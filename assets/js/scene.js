/* ==========================================================================
   South-View · scene renderer
   --------------------------------------------------------------------------
   Five stacked canvases (back → front):

     sky   paper, sky wash, sun, clouds, planes, birds
     city  Midtown (far), downtown (city) and the south edge (near)
     fx    smoke, beacons, the Olympic flame
     mid   tree canopy, south-side houses, rail, highway, MARTA, traffic
     fg    South-View Cemetery: hill, gate, trees, headstones

   The scene is told what YEAR it is and where the camera points; it works
   out everything else (what exists, how much colour, construction, dusk).
   Static layers only redraw when the view changes; ambient layers tick at
   ~30fps unless motion is paused or reduced.
   ========================================================================== */
(function (SV) {
  'use strict';

  const U = SV.util;
  const S = SV.scenery;
  const ERA = S.era;
  const PROPS = S.PROPS;

  const LAYERS = {
    far: { par: 0.84, scale: 0.9, dy: 3 },
    city: { par: 1, scale: 1, dy: 0 },
    near: { par: 1.12, scale: 1.06, dy: -2 },
  };
  const PAR = { sky: 0.08, mid: 1.25, fg: 1.45 };
  const LV = Math.log(1.22); // sprite scale step between cached levels
  const FADE = 1.2; // years a demolished building takes to fade away
  const WORLD = [-2380, 2760];

  const ink = (a) => 'rgba(40,36,33,' + U.clamp(a, 0, 1).toFixed(3) + ')';

  class Scene {
    constructor(root, opts) {
      this.root = root;
      this.opts = opts || {};
      this.animate = !this.opts.reduced;
      this.names = ['sky', 'city', 'fx', 'mid', 'fg'];
      this.L = {};
      for (const n of this.names) {
        const c = document.createElement('canvas');
        c.className = 'scene__layer scene__layer--' + n;
        c.setAttribute('aria-hidden', 'true');
        root.appendChild(c);
        this.L[n] = { c, ctx: c.getContext('2d') };
      }
      this.items = { far: [], city: [], near: [] };
      const all = SV.landmarks.list.concat(S.makeFillers());
      for (const it of all) this.items[it.layer].push(it);
      for (const k in this.items) this.items[k].sort((a, b) => a.z - b.z || a.x - b.x);
      this.emitters = SV.landmarks.list.filter((d) => d.smoke);
      this.flames = SV.landmarks.list.filter((d) => d.flame);
      this.tall = SV.landmarks.list.filter((d) => d.h > 480);
      this.mid = S.makeMid();
      this.fg = S.makeFg();
      this.fgObjects = this.buildFgObjects();
      this.clouds = S.makeClouds();
      this.sprites = new Map();
      this.jobs = new Map();
      this.pixels = 0;
      this.frame = 0;
      this.t = 37; // ambient clock (seconds); a pleasant still frame when paused
      this.view = { year: 1860, camX: 0, intro: 1 };
      this.particles = {};
      this.planes = [];
      this.birds = [];
      this.nextPlane = 5;
      this.nextBirds = 2;
      this.paperTile = SV.Tex.paper(512, 7, SV.PAPER);
      this.patterns = new WeakMap();
      this.recs = [];
      this.resize();
    }

    /* ---------------------------------------------------------------- setup */

    resize() {
      const W = Math.max(1, this.root.clientWidth || window.innerWidth);
      const H = Math.max(1, this.root.clientHeight || window.innerHeight);
      let dpr = Math.min(window.devicePixelRatio || 1, 2);
      const maxPx = this.opts.maxPixels || 4.6e6;
      if (W * H * dpr * dpr > maxPx) dpr = Math.max(1, Math.sqrt(maxPx / (W * H)));
      dpr = Math.round(dpr * 100) / 100;
      if (W === this.W && H === this.H && dpr === this.dpr) return false;
      const dprChanged = dpr !== this.dpr;
      this.W = W;
      this.H = H;
      this.dpr = dpr;
      this.cw = Math.round(W * dpr);
      this.ch = Math.round(H * dpr);
      for (const n of this.names) {
        this.L[n].c.width = this.cw;
        this.L[n].c.height = this.ch;
      }
      this.portrait = H > W * 1.05;
      this.horizonY = H * (this.portrait ? 0.7 : 0.665);
      this.crestY = H * (this.portrait ? 0.84 : 0.81);
      this.u = H / 1000;
      // props (trees, stones…) are baked at the current unit size
      for (const [k, sp] of this.sprites) {
        if (dprChanged || k.charAt(0) === 'p') this.dropSprite(k, sp);
      }
      this.jobs.clear();
      this.hill = null;
      this.skyBase = null;
      this.patterns = new WeakMap();
      this.dirty = true;
      return true;
    }

    /** Re-bake props (e.g. once web fonts load, for the gate lettering). */
    flushProps() {
      for (const [k, sp] of this.sprites) if (k.charAt(0) === 'p') this.dropSprite(k, sp);
      this.dirty = true;
    }

    setReducedMotion(reduced) {
      this.animate = !reduced;
      this.dirty = true;
    }

    setView(v) {
      this.view.year = v.year;
      this.view.camX = v.camX;
      this.view.intro = v.intro == null ? 1 : v.intro;
    }

    pattern(ctx) {
      let p = this.patterns.get(ctx);
      if (!p) {
        p = ctx.createPattern(this.paperTile, 'repeat');
        this.patterns.set(ctx, p);
      }
      return p;
    }

    computeView() {
      const y = this.view.year;
      const avail = this.horizonY - this.H * 0.11;
      const sH = avail / ERA.skylineH(y);
      const sW = this.W / ERA.viewW(y);
      this.s = Math.min(sH, sW);
      const half = this.W / 2 / this.s;
      const lo = WORLD[0] + half;
      const hi = WORLD[1] - half;
      this.camX = lo > hi ? (lo + hi) / 2 : U.clamp(this.view.camX, lo, hi);
      this.e = { color: ERA.color(y), sky: ERA.sky(y), dusk: ERA.dusk(y) };
    }

    /** Default camera target for a year (used by the story when an entry
        has no explicit focus). */
    autoCam(year) {
      return ERA.camX(year);
    }

    /* -------------------------------------------------------------- sprites */

    level(scale) {
      return Math.round(Math.log(scale) / LV);
    }

    dropSprite(key, sp) {
      this.sprites.delete(key);
      this.pixels -= sp.px;
      sp.c.width = 0;
      sp.c.height = 0;
    }

    sprite(it, mode, lvl, prio) {
      const key = (it.kind === 'prop' ? 'p:' : '') + it.id + '|' + mode + '|' + lvl;
      let sp = this.sprites.get(key);
      if (sp) {
        sp.used = this.frame;
        return sp;
      }
      const job = this.jobs.get(key);
      if (job) job.frame = this.frame;
      else this.jobs.set(key, { key, it, mode, lvl, prio: prio || 0, frame: this.frame });
      if (it.kind !== 'prop') {
        for (const dl of [1, -1, 2, -2, 3, -3]) {
          sp = this.sprites.get(it.id + '|' + mode + '|' + (lvl + dl));
          if (sp) {
            sp.used = this.frame;
            return sp;
          }
        }
      }
      return null;
    }

    bake(job) {
      const it = job.it;
      let s = Math.exp(job.lvl * LV);
      const pad = 6 * this.dpr;
      const maxDim = 4096;
      let w = it.w * s + pad * 2;
      let h = it.h * s + pad * 2;
      if (w > maxDim || h > maxDim) {
        s *= Math.min(maxDim / w, maxDim / h);
        w = it.w * s + pad * 2;
        h = it.h * s + pad * 2;
      }
      const c = U.canvas(w, h);
      const ctx = c.getContext('2d');
      const ox = pad + (it.w / 2) * s;
      const oy = c.height - pad;
      const P = new SV.Pencil(ctx, {
        s,
        ox,
        oy,
        dpr: this.dpr,
        mode: job.mode,
        seed: it.seed,
        paper: it.paper,
        inkA: it.inkA,
      });
      try {
        it.draw(P, it.body || it.v || 0);
      } catch (err) {
        if (window.console) console.warn('[South-View] could not draw', it.id, err);
      }
      SV.Pencil.finish(c, job.mode);
      const sp = { c, s, ox, oy, used: this.frame, px: c.width * c.height };
      this.sprites.set(job.key, sp);
      this.pixels += sp.px;
    }

    processJobs(budgetMs) {
      if (!this.jobs.size) return false;
      const t0 = performance.now();
      const jobs = Array.from(this.jobs.values());
      jobs.sort((a, b) => b.prio - a.prio);
      let did = false;
      for (const j of jobs) {
        this.jobs.delete(j.key);
        if (j.frame < this.frame - 1) continue; // no longer on screen
        if (!this.sprites.has(j.key)) {
          this.bake(j);
          did = true;
        }
        if (performance.now() - t0 > budgetMs) break;
      }
      if (did) this.evict();
      return did;
    }

    evict() {
      const max = this.opts.maxSpritePixels || (this.portrait ? 2.4e7 : 5.2e7);
      if (this.pixels <= max) return;
      const arr = Array.from(this.sprites.entries()).sort((a, b) => a[1].used - b[1].used);
      for (const [k, sp] of arr) {
        if (this.pixels <= max * 0.8) break;
        if (sp.used >= this.frame - 1) continue;
        this.dropSprite(k, sp);
      }
    }

    /* ------------------------------------------------------- item lifecycle */

    state(it, y) {
      if (y < it.start) return null;
      if (it.gone != null && y > it.gone + FADE) return null;
      const span = it.built - it.start;
      const p = span > 0 ? U.clamp((y - it.start) / span, 0, 1) : 1;
      let reveal = 1;
      let alpha = 1;
      if (it.reveal === 'fade') alpha = U.smooth01(p);
      else reveal = U.easeInOut(p);
      if (it.gone != null) alpha *= 1 - U.smoothstep(it.gone - 0.15, it.gone + FADE, y);
      return { p, reveal, alpha, colorIn: U.smoothstep(0.55, 1, p), building: p > 0.001 && p < 0.999 };
    }

    introAt(sx) {
      const t = this.view.intro;
      if (t >= 1) return 1;
      return U.clamp((t * 1.4 - 0.08 - 0.5 * U.clamp(sx / this.W, 0, 1)) / 0.32, 0, 1);
    }

    /* ------------------------------------------------------------- drawing */

    blit(ctx, sp, rec, op, alpha) {
      if (alpha <= 0.003) return;
      const d = this.dpr;
      const k = (rec.sl * d) / sp.s;
      const cw = sp.c.width;
      const ch = sp.c.height;
      let sy0 = 0;
      if (rec.reveal < 0.999) sy0 = Math.max(0, Math.floor(sp.oy - rec.reveal * rec.it.h * sp.s));
      const sh = ch - sy0;
      if (sh <= 0) return;
      ctx.globalCompositeOperation = op;
      ctx.globalAlpha = alpha;
      ctx.drawImage(sp.c, 0, sy0, cw, sh, rec.sx * d - sp.ox * k, rec.sy * d - sp.oy * k + sy0 * k, cw * k, sh * k);
    }

    drawCity() {
      const ctx = this.L.city.ctx;
      const d = this.dpr;
      const W = this.W;
      const y = this.view.year;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, this.cw, this.ch);
      const recs = (this.recs = []);
      for (const name of ['far', 'city', 'near']) {
        const Ld = LAYERS[name];
        const sl = this.s * Ld.scale;
        const lvl = this.level(sl * d);
        const groundY = this.horizonY - Ld.dy;
        const camOff = this.camX * Ld.par;
        for (const it of this.items[name]) {
          const st = this.state(it, y);
          if (!st) continue;
          const sx = W / 2 + (it.x - camOff) * sl;
          const half = (it.w * sl) / 2;
          if (sx + half < -40 || sx - half > W + 40) continue;
          const reveal = Math.min(st.reveal, this.introAt(sx));
          if (reveal <= 0.002 || st.alpha <= 0.003) continue;
          const pen = this.sprite(it, 'pencil', lvl, it.kind === 'landmark' ? 2 : 1);
          if (!pen) continue;
          const rec = { it, sx, sy: groundY - (it.y || 0) * sl, sl, lvl, reveal, alpha: st.alpha, st };
          this.blit(ctx, pen, rec, 'source-over', st.alpha);
          const ca = st.alpha * st.colorIn * Math.max(this.e.color * (it.colorMul || 1), it.minColor || 0);
          if (ca > 0.01) {
            const col = this.sprite(it, 'color', lvl, it.kind === 'landmark' ? 2 : 1);
            if (col) this.blit(ctx, col, rec, 'multiply', Math.min(1, ca));
          }
          recs.push(rec);
        }
        if (name === 'far') {
          ctx.globalCompositeOperation = 'source-atop';
          ctx.globalAlpha = 1;
          const haze = U.mix(SV.PAPER, ERA.skyLow(y), this.e.sky);
          ctx.fillStyle = U.rgba(haze, 0.4 - 0.1 * this.e.color);
          ctx.fillRect(0, 0, this.cw, this.ch);
        }
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      for (const r of recs) if (r.st.building && r.it.crane !== false && r.it.kind === 'landmark') this.drawConstruction(ctx, r);
      for (const r of recs) if (r.st.building && r.it.kind === 'filler' && r.it.crane !== false) this.drawConstruction(ctx, r);
      const dusk = this.e.dusk;
      if (dusk > 0.01) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = 'source-atop';
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(46,36,88,' + (0.5 * dusk).toFixed(3) + ')';
        ctx.fillRect(0, 0, this.cw, this.ch);
        const la = Math.pow(dusk, 1.4) * 0.62;
        for (const r of recs) {
          if (r.it.lights === false || r.st.p < 1) continue;
          const lt = this.sprite(r.it, 'light', r.lvl, 0);
          if (lt) this.blit(ctx, lt, r, 'lighter', la * r.alpha);
        }
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }

    /** Scaffolding before WWII, tower cranes after. */
    drawConstruction(ctx, r) {
      const d = this.dpr;
      const it = r.it;
      const sl = r.sl;
      const bw = (it.bodyW || it.w * 0.86) * sl;
      const x0 = r.sx - bw / 2;
      const x1 = r.sx + bw / 2;
      const ground = r.sy;
      const top = ground - r.reveal * (it.bodyH || it.h) * sl;
      const rr = U.rng(it.seed);
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineCap = 'round';
      const colored = this.e.color > 0.28;
      if (this.view.year < 1946) {
        ctx.strokeStyle = ink(0.5);
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        const poles = Math.max(2, Math.round(bw / 14));
        for (let i = 0; i <= poles; i++) {
          const x = x0 - 2 + ((bw + 4) * i) / poles + (rr() - 0.5);
          ctx.moveTo(x, ground);
          ctx.lineTo(x, top - 7);
        }
        for (let yy = top - 4; yy < Math.min(ground, top + 46); yy += 7) {
          ctx.moveTo(x0 - 4, yy);
          ctx.lineTo(x1 + 4, yy + (rr() - 0.5));
        }
        ctx.stroke();
        return;
      }
      const H = Math.max(30, (it.bodyH || it.h) * sl);
      const mx = x0 + bw * (0.72 + rr() * 0.12);
      const mastTop = Math.min(top - 16, ground - H * 0.42);
      ctx.strokeStyle = colored ? 'rgba(214,160,40,0.95)' : ink(0.6);
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(mx - 1.6, ground);
      ctx.lineTo(mx - 1.6, mastTop);
      ctx.moveTo(mx + 1.6, ground);
      ctx.lineTo(mx + 1.6, mastTop);
      for (let yy = ground; yy > mastTop + 4; yy -= 4) {
        ctx.moveTo(mx - 1.6, yy);
        ctx.lineTo(mx + 1.6, yy - 4);
      }
      const jibL = Math.max(26, bw * 0.75);
      ctx.moveTo(mx - jibL, mastTop);
      ctx.lineTo(mx + jibL * 0.3, mastTop);
      ctx.moveTo(mx - jibL * 0.7, mastTop);
      ctx.lineTo(mx, mastTop - 7);
      ctx.lineTo(mx + jibL * 0.3, mastTop);
      ctx.stroke();
      ctx.fillStyle = colored ? 'rgba(90,86,80,0.9)' : ink(0.55);
      ctx.fillRect(mx + jibL * 0.18, mastTop, 5, 3.5);
      const hookX = mx - jibL * (0.35 + 0.3 * ((Math.sin(this.t * 0.25 + it.seed) + 1) / 2));
      ctx.strokeStyle = ink(0.45);
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(hookX, mastTop);
      ctx.lineTo(hookX, Math.max(mastTop + 6, top - 4));
      ctx.stroke();
    }

    buildFgObjects() {
      const objs = [];
      for (const s of this.fg.stones) objs.push({ kind: 'stone', ref: s, depth: s.depth, x: s.x });
      for (const t of this.fg.trees) objs.push({ kind: 'tree', ref: t, depth: t.depth, x: t.x });
      objs.push({ kind: 'gate', ref: this.fg.gate, depth: this.fg.gate.depth, x: this.fg.gate.x });
      objs.sort((a, b) => a.depth - b.depth);
      return objs;
    }

    /** Draw a prop sprite with its ground point at (x, y) CSS px. */
    drawProp(ctx, type, v, x, y, scale, alpha, colorA, colorOp) {
      const pen = this.propSprite(type, v, 'pencil');
      if (!pen) return;
      this.stamp(ctx, pen, x, y, scale, alpha, 'source-over');
      if (colorA > 0.01) {
        const col = this.propSprite(type, v, 'color');
        if (col) this.stamp(ctx, col, x, y, scale, alpha * colorA, colorOp || 'multiply');
      }
    }

    propSprite(type, v, mode) {
      const key = 'p:' + type + '.' + v + '|' + mode + '|u';
      let sp = this.sprites.get(key);
      if (sp) {
        sp.used = this.frame;
        return sp;
      }
      const P = PROPS[type];
      const s = this.u * this.dpr * 1.25;
      const pad = 5 * this.dpr;
      const c = U.canvas(P.w * s + pad * 2, P.h * s + pad * 2);
      const ctx = c.getContext('2d');
      const ox = pad + (P.w / 2) * s;
      const oy = c.height - pad;
      const pen = new SV.Pencil(ctx, { s, ox, oy, dpr: this.dpr, mode, seed: U.hash(type) + v * 977 });
      try {
        P.draw(pen, v);
      } catch (err) {
        if (window.console) console.warn('[South-View] prop failed', type, err);
      }
      SV.Pencil.finish(c, mode);
      sp = { c, s, ox, oy, used: this.frame, px: c.width * c.height };
      this.sprites.set(key, sp);
      this.pixels += sp.px;
      return sp;
    }

    stamp(ctx, sp, x, y, scale, alpha, op) {
      if (alpha <= 0.003) return;
      const d = this.dpr;
      const k = (this.u * d * scale) / sp.s;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = op;
      ctx.globalAlpha = Math.min(1, alpha);
      ctx.drawImage(sp.c, x * d - sp.ox * k, y * d - sp.oy * k, sp.c.width * k, sp.c.height * k);
    }

    /* ---------------------------------------------------------------- sky */

    renderSkyBase() {
      if (!this.skyBase || this.skyBase.width !== this.cw || this.skyBase.height !== this.ch) this.skyBase = U.canvas(this.cw, this.ch);
      const c = this.skyBase;
      const ctx = c.getContext('2d');
      const d = this.dpr;
      const y = this.view.year;
      const e = this.e;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = this.pattern(ctx);
      ctx.fillRect(0, 0, this.cw, this.ch);
      const hz = this.horizonY * d;
      if (e.sky > 0.01) {
        const g = ctx.createLinearGradient(0, 0, 0, hz);
        g.addColorStop(0, U.rgba(ERA.skyTop(y)));
        g.addColorStop(0.58, U.rgba(ERA.skyMid(y)));
        g.addColorStop(1, U.rgba(ERA.skyLow(y)));
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = e.sky;
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, this.cw, hz + 2 * d);
        ctx.fillStyle = U.rgba(ERA.skyLow(y));
        ctx.fillRect(0, hz, this.cw, this.ch - hz);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
      // the sun: a faint pencil circle early on, a watercolour sun later,
      // sinking toward the western horizon as the story nears the present
      ctx.setTransform(d, 0, 0, d, 0, 0);
      const sunIn = U.smoothstep(1950, 1963, y);
      const sx = this.W * (this.portrait ? 0.26 : 0.19);
      const sy = this.H * U.lerp(0.15, this.portrait ? 0.5 : 0.53, U.smoothstep(1962, 2026, y));
      const sr = this.H * U.lerp(0.03, 0.048, U.smoothstep(1985, 2026, y));
      if (sunIn < 1) {
        ctx.strokeStyle = ink(0.22 * (1 - sunIn));
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0.2, Math.PI * 2.05);
        ctx.stroke();
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const a = (Math.PI * 2 * i) / 10 + 0.15;
          ctx.moveTo(sx + Math.cos(a) * sr * 1.35, sy + Math.sin(a) * sr * 1.35);
          ctx.lineTo(sx + Math.cos(a) * sr * 1.75, sy + Math.sin(a) * sr * 1.75);
        }
        ctx.stroke();
      }
      if (sunIn > 0) {
        const col = U.mix(U.mix('#fff2c2', '#ffc46b', U.smoothstep(1990, 2012, y)), '#ff8a3a', e.dusk);
        const glow = ctx.createRadialGradient(sx, sy, sr * 0.6, sx, sy, sr * (4 + 3 * e.dusk));
        glow.addColorStop(0, U.rgba(col, 0.55 * sunIn));
        glow.addColorStop(1, U.rgba(col, 0));
        ctx.fillStyle = glow;
        ctx.fillRect(sx - sr * 8, sy - sr * 8, sr * 16, sr * 16);
        ctx.globalAlpha = 0.92 * sunIn;
        ctx.fillStyle = U.rgba(U.shade(col, 0.15));
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      // a low line of distant hills behind the city
      const hy = this.horizonY;
      const pan = this.camX * this.s * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, hy + 4);
      for (let x = 0; x <= this.W + 8; x += 8) {
        const wx = (x + pan) / this.u;
        ctx.lineTo(x, hy - this.u * (16 + 9 * Math.sin(wx * 0.004 + 1.3) + 5 * Math.sin(wx * 0.011)));
      }
      ctx.lineTo(this.W + 8, hy + 4);
      ctx.closePath();
      ctx.fillStyle = U.rgba(U.mix([226, 219, 202], U.mix(ERA.skyLow(y), '#7f8fa8', 0.35), e.sky), 0.55 + 0.25 * e.sky);
      ctx.fill();
      ctx.strokeStyle = ink(0.18);
      ctx.lineWidth = 0.7;
      ctx.stroke();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.skyBaseKey = this.skyKey();
    }

    skyKey() {
      return Math.round(this.view.year * 8) + '|' + Math.round(this.camX * this.s * 0.5) + '|' + this.cw + 'x' + this.ch;
    }

    drawSky(dt) {
      const ctx = this.L.sky.ctx;
      if (!this.skyBase || this.skyBaseKey !== this.skyKey()) this.renderSkyBase();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.drawImage(this.skyBase, 0, 0);
      const e = this.e;
      const intro = this.view.intro;
      // clouds
      const span = this.W + 700 * this.u;
      for (const cl of this.clouds) {
        const x = ((((cl.x * this.u + this.t * cl.speed - this.camX * this.s * PAR.sky) % span) + span) % span) - 350 * this.u;
        const yy = cl.y * this.H;
        const sc = cl.s * (this.portrait ? 0.8 : 1.15);
        const a = U.clamp(intro * 1.6 - 0.2, 0, 1);
        const pen = this.propSprite('cloud', cl.v % 4, 'pencil');
        if (pen) this.stamp(ctx, pen, x, yy, sc, a * (0.9 - 0.3 * e.sky), 'source-over');
        if (e.sky > 0.02) {
          const col = this.propSprite('cloud', cl.v % 4, 'color');
          if (col) this.stamp(ctx, col, x, yy, sc, a * e.sky * 0.85, 'source-over');
          // at sunset the clouds take on the colour of the sky behind them
          if (e.dusk > 0.02 && col) this.stamp(ctx, col, x, yy, sc, a * e.dusk * 0.7, 'multiply');
        }
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      this.drawPlanes(ctx, dt);
      this.drawBirds(ctx, dt);
    }

    drawPlanes(ctx, dt) {
      const y = this.view.year;
      if (y < 1926 || this.view.intro < 1) return;
      if (this.animate) {
        this.nextPlane -= dt;
        if (this.nextPlane <= 0) {
          const dir = Math.random() < 0.5 ? 1 : -1;
          this.planes.push({ x: dir > 0 ? -60 : this.W + 60, y: this.H * (0.08 + Math.random() * 0.22), dir, v: 26 + Math.random() * 30, year: y });
          this.nextPlane = 14 + Math.random() * 20;
        }
      } else if (!this.planes.length) {
        this.planes.push({ x: this.W * 0.72, y: this.H * 0.16, dir: -1, v: 0, year: y, still: true });
      }
      const d = this.dpr;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      for (let i = this.planes.length - 1; i >= 0; i--) {
        const p = this.planes[i];
        if (this.animate) p.x += p.dir * p.v * dt;
        if (p.x < -120 || p.x > this.W + 120 || (!this.animate && !p.still) || (this.animate && p.still)) {
          this.planes.splice(i, 1);
          continue;
        }
        this.planeShape(ctx, p, y);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    planeShape(ctx, p, y) {
      const k = this.u * (this.portrait ? 1 : 1.25);
      const L = (y < 1946 ? 14 : y < 1960 ? 20 : 26) * k;
      const x = p.x;
      const yy = p.y;
      const dir = p.dir;
      const dark = ink(0.75);
      if (y >= 1958 && this.e.sky > 0.2 && this.animate) {
        const g = ctx.createLinearGradient(x, 0, x - dir * L * 9, 0);
        g.addColorStop(0, 'rgba(255,255,255,' + (0.7 * this.e.sky).toFixed(2) + ')');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6 * k;
        ctx.beginPath();
        ctx.moveTo(x - dir * L * 0.5, yy);
        ctx.lineTo(x - dir * L * 9, yy + 2 * k);
        ctx.stroke();
      }
      ctx.lineCap = 'round';
      ctx.strokeStyle = dark;
      ctx.fillStyle = this.e.color > 0.3 ? 'rgba(236,236,232,0.95)' : 'rgba(242,235,220,1)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(x, yy, L / 2, L * 0.085, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + dir * L * 0.05, yy);
      ctx.lineTo(x - dir * L * 0.18, yy + L * 0.32);
      ctx.moveTo(x + dir * L * 0.05, yy);
      ctx.lineTo(x - dir * L * 0.12, yy - L * 0.16);
      ctx.moveTo(x - dir * L * 0.45, yy);
      ctx.lineTo(x - dir * L * 0.55, yy - L * 0.22);
      if (y < 1946) {
        ctx.moveTo(x - dir * L * 0.05, yy - L * 0.2);
        ctx.lineTo(x - dir * L * 0.05, yy + L * 0.25);
      }
      ctx.stroke();
    }

    drawBirds(ctx, dt) {
      if (this.view.intro < 0.6) return;
      if (this.animate) {
        this.nextBirds -= dt;
        if (this.nextBirds <= 0) {
          const dir = Math.random() < 0.5 ? 1 : -1;
          const n = 3 + ((Math.random() * 5) | 0);
          const y0 = this.H * (0.18 + Math.random() * 0.25);
          const flock = [];
          for (let i = 0; i < n; i++) flock.push({ dx: -i * 14 - Math.random() * 10, dy: (Math.random() - 0.5) * 22, ph: Math.random() * 6 });
          this.birds.push({ x: dir > 0 ? -40 : this.W + 40, y: y0, dir, v: 30 + Math.random() * 18, flock });
          this.nextBirds = 18 + Math.random() * 22;
        }
      } else if (!this.birds.length) {
        this.birds.push({
          x: this.W * 0.62,
          y: this.H * 0.27,
          dir: 1,
          v: 0,
          still: true,
          flock: [
            { dx: 0, dy: 0, ph: 0 },
            { dx: -16, dy: 8, ph: 1 },
            { dx: -30, dy: -4, ph: 2 },
          ],
        });
      }
      const d = this.dpr;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.strokeStyle = ink(0.62);
      ctx.lineWidth = 0.9;
      ctx.lineCap = 'round';
      for (let i = this.birds.length - 1; i >= 0; i--) {
        const b = this.birds[i];
        if (this.animate) b.x += b.dir * b.v * dt;
        if (b.x < -200 || b.x > this.W + 200 || (this.animate && b.still) || (!this.animate && !b.still)) {
          this.birds.splice(i, 1);
          continue;
        }
        const k = this.u * 1.1;
        ctx.beginPath();
        for (const m of b.flock) {
          const x = b.x + b.dir * m.dx * k;
          const yy = b.y + m.dy * k + Math.sin(this.t * 1.3 + m.ph) * 3 * k;
          const flap = Math.sin(this.t * 9 + m.ph * 3) * 2.6 * k;
          const w = 5.5 * k;
          ctx.moveTo(x - w, yy - 1.2 * k + flap);
          ctx.quadraticCurveTo(x - w * 0.4, yy - 2.5 * k, x, yy);
          ctx.quadraticCurveTo(x + w * 0.4, yy - 2.5 * k, x + w, yy - 1.2 * k + flap);
        }
        ctx.stroke();
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    /* ------------------------------------------------------------------ fx */

    drawFx(dt) {
      const ctx = this.L.fx.ctx;
      const d = this.dpr;
      const y = this.view.year;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, this.cw, this.ch);
      ctx.setTransform(d, 0, 0, d, 0, 0);
      const W = this.W;
      // smoke from the mill stack (until the mill closed in 1978)
      for (const em of this.emitters) {
        const st = this.state(em, y);
        if (!st || st.p < 1 || y > em.smoke.until) continue;
        const Ld = LAYERS[em.layer];
        const sl = this.s * Ld.scale;
        const sx = W / 2 + (em.x - this.camX * Ld.par) * sl + em.smoke.x * sl;
        const sy = this.horizonY - Ld.dy - em.smoke.y * sl;
        if (sx < -200 || sx > W + 200) continue;
        this.smoke(ctx, em, sx, sy, sl, dt, 1 - U.smoothstep(em.smoke.until - 6, em.smoke.until, y));
      }
      // the Olympic flame, summer 1996
      for (const f of this.flames) {
        if (y < f.flame.from || y > f.flame.to) continue;
        const Ld = LAYERS[f.layer];
        const sl = this.s * Ld.scale;
        const sx = W / 2 + (f.x - this.camX * Ld.par) * sl;
        const sy = this.horizonY - Ld.dy - f.flame.y * sl;
        const fl = Math.sin(this.t * 13) * 0.12 + Math.sin(this.t * 7.3) * 0.1;
        const h = 16 * sl * (1 + fl);
        const g = ctx.createRadialGradient(sx, sy - h * 0.3, 0, sx, sy - h * 0.3, h);
        g.addColorStop(0, 'rgba(255,236,150,0.95)');
        g.addColorStop(0.5, 'rgba(255,140,40,0.8)');
        g.addColorStop(1, 'rgba(255,90,20,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(sx - h * 0.35, sy);
        ctx.quadraticCurveTo(sx - h * 0.4, sy - h * 0.6, sx + fl * h, sy - h * 1.2);
        ctx.quadraticCurveTo(sx + h * 0.4, sy - h * 0.6, sx + h * 0.35, sy);
        ctx.closePath();
        ctx.fill();
      }
      // aviation beacons blink on the tallest towers at dusk
      if (this.e.dusk > 0.15) {
        for (const it of this.tall) {
          const st = this.state(it, y);
          if (!st || st.p < 1) continue;
          const Ld = LAYERS[it.layer];
          const sl = this.s * Ld.scale;
          const sx = W / 2 + (it.x - this.camX * Ld.par) * sl;
          if (sx < -10 || sx > W + 10) continue;
          const sy = this.horizonY - Ld.dy - ((it.y || 0) + it.h - 2) * sl;
          const blink = this.animate ? Math.max(0, Math.sin(this.t * 2.6 + (it.seed % 7))) : 0.8;
          const a = this.e.dusk * blink * st.alpha;
          if (a < 0.03) continue;
          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 5);
          g.addColorStop(0, 'rgba(255,70,60,' + a.toFixed(3) + ')');
          g.addColorStop(1, 'rgba(255,70,60,0)');
          ctx.fillStyle = g;
          ctx.fillRect(sx - 5, sy - 5, 10, 10);
        }
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    smoke(ctx, em, sx, sy, sl, dt, strength) {
      if (strength <= 0.01) return;
      const key = em.id;
      let list = this.particles[key];
      if (!list) {
        list = this.particles[key] = [];
        for (let i = 0; i < 16; i++) list.push({ age: i * 0.45, ox: 0, oy: 0, r: 1 });
      }
      for (const p of list) {
        if (this.animate) p.age += dt;
        if (p.age > 7.2) p.age -= 7.2;
        const a = p.age / 7.2;
        p.ox = (a * 70 + Math.sin(p.age * 1.4 + key.length) * 4) * sl * 0.9;
        p.oy = -(a * 60) * sl * 0.9;
        p.r = (5 + a * 24) * sl * 0.9;
      }
      const pencil = this.e.color < 0.25;
      for (const p of list) {
        const a = p.age / 7.2;
        const alpha = (1 - a) * 0.38 * strength * Math.min(1, p.age * 2);
        if (alpha < 0.01) continue;
        const x = sx + p.ox;
        const yy = sy + p.oy;
        if (pencil) {
          ctx.strokeStyle = ink(alpha * 0.9);
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.arc(x, yy, p.r, 0.3, Math.PI * 1.85);
          ctx.stroke();
        } else {
          const g = ctx.createRadialGradient(x, yy, 0, x, yy, p.r);
          g.addColorStop(0, 'rgba(120,118,120,' + alpha.toFixed(3) + ')');
          g.addColorStop(1, 'rgba(120,118,120,0)');
          ctx.fillStyle = g;
          ctx.fillRect(x - p.r, yy - p.r, p.r * 2, p.r * 2);
        }
      }
    }

    /* ----------------------------------------------------------------- mid */

    drawMid() {
      const ctx = this.L.mid.ctx;
      const d = this.dpr;
      const W = this.W;
      const H = this.H;
      const u = this.u;
      const y = this.view.year;
      const e = this.e;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, this.cw, this.ch);
      const intro = this.view.intro;
      const clipW = intro >= 1 ? W : W * U.clamp(intro * 1.5 - 0.1, 0, 1.2);
      if (clipW <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, clipW * d, this.ch);
      ctx.clip();
      const pan = this.camX * this.s * PAR.mid;
      const band = this.horizonY + 0.014 * H;
      ctx.fillStyle = this.pattern(ctx);
      ctx.fillRect(0, band * d, this.cw, this.ch - band * d);
      const green = e.color > 0.02 ? ERA.green(y) : null;
      if (green) {
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = e.color * 0.5;
        ctx.fillStyle = U.rgba(green);
        ctx.fillRect(0, band * d, this.cw, this.ch - band * d);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.strokeStyle = ink(0.35);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, band + 0.5);
      ctx.lineTo(W, band + 0.5);
      ctx.stroke();
      const sx = (x) => W / 2 + x * u - pan;
      const colorA = e.color * 0.95;

      // back canopy
      for (const t of this.mid.trees) {
        if (t.row !== 0 || y < t.appear) continue;
        const x = sx(t.x);
        if (x < -60 || x > W + 60) continue;
        const grow = U.clamp((y - t.appear) / 30, 0.35, 1);
        const fade = U.clamp((y - t.appear) / 1.5, 0, 1);
        this.drawProp(ctx, t.type, t.v, x, band + t.dy * u + 3 * u, t.s * grow * 0.62, fade, colorA);
      }
      // south-side houses
      const hy = this.horizonY + 0.044 * H;
      for (const h of this.mid.houses) {
        if (y < h.appear - 0.5) continue;
        if (h.gone != null && y > h.gone + 1) continue;
        const x = sx(h.x);
        if (x < -40 || x > W + 40) continue;
        let a = U.clamp((y - h.appear + 0.5) / 1, 0, 1);
        if (h.gone != null) a *= 1 - U.smoothstep(h.gone - 0.2, h.gone + 1, y);
        this.drawProp(ctx, h.type, h.v, x, hy + h.dy * u, h.s * 0.9, a, colorA);
        if (e.dusk > 0.2 && a > 0.5) {
          ctx.setTransform(d, 0, 0, d, 0, 0);
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = e.dusk * 0.7;
          ctx.fillStyle = '#ffcf7a';
          ctx.fillRect(x - 3 * u, hy + h.dy * u - 7 * u, 2.2 * u, 2.4 * u);
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
        }
      }
      // railroad (the reason Atlanta exists)
      const ry = this.horizonY + 0.066 * H;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = ink(0.55);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, ry);
      ctx.lineTo(W, ry);
      ctx.moveTo(0, ry + 2.2 * u);
      ctx.lineTo(W, ry + 2.2 * u);
      const tieStep = 7 * u;
      const off = ((-pan % tieStep) + tieStep) % tieStep;
      for (let x = off; x < W; x += tieStep) {
        ctx.moveTo(x, ry - 0.8);
        ctx.lineTo(x - 1.2, ry + 3 * u);
      }
      ctx.stroke();
      this.drawTrain(ctx, ry, y);
      // the Downtown Connector, sketched in from 1956 to 1964
      const hw = this.mid.highway;
      if (y > hw.start) {
        const p = U.clamp((y - hw.start) / (hw.built - hw.start), 0, 1);
        const wy = this.horizonY + 0.088 * H;
        const x1 = W * p;
        ctx.fillStyle = 'rgba(242,235,220,1)';
        ctx.fillRect(0, wy - 2 * u, x1, 9 * u);
        if (e.color > 0.02) {
          ctx.globalCompositeOperation = 'multiply';
          ctx.globalAlpha = e.color * 0.7;
          ctx.fillStyle = '#9b9790';
          ctx.fillRect(0, wy - 2 * u, x1, 9 * u);
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
        }
        ctx.strokeStyle = ink(0.65);
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(0, wy - 2 * u);
        ctx.lineTo(x1, wy - 2 * u);
        ctx.moveTo(0, wy + 7 * u);
        ctx.lineTo(x1, wy + 7 * u);
        ctx.stroke();
        ctx.strokeStyle = ink(0.3);
        ctx.setLineDash([5 * u, 6 * u]);
        ctx.beginPath();
        ctx.moveTo(0, wy + 2.5 * u);
        ctx.lineTo(x1, wy + 2.5 * u);
        ctx.stroke();
        ctx.setLineDash([]);
        if (p >= 1) this.drawTraffic(ctx, wy, false);
      }
      // MARTA rail (south line, early 1980s)
      const mt = this.mid.marta;
      if (y > mt.start) {
        const p = U.clamp((y - mt.start) / (mt.built - mt.start), 0, 1);
        const my = this.horizonY + 0.052 * H;
        const x1 = W * p;
        ctx.strokeStyle = ink(0.6);
        ctx.lineWidth = 1;
        ctx.fillStyle = 'rgba(236,232,224,1)';
        ctx.fillRect(0, my, x1, 3 * u);
        ctx.beginPath();
        ctx.moveTo(0, my);
        ctx.lineTo(x1, my);
        ctx.moveTo(0, my + 3 * u);
        ctx.lineTo(x1, my + 3 * u);
        const pierStep = 46 * u;
        const po = ((-pan * 1.02) % pierStep + pierStep) % pierStep;
        for (let x = po; x < x1; x += pierStep) {
          ctx.moveTo(x, my + 3 * u);
          ctx.lineTo(x, ry - 1);
          ctx.moveTo(x + 3 * u, my + 3 * u);
          ctx.lineTo(x + 3 * u, ry - 1);
        }
        ctx.stroke();
        if (p >= 1) this.drawMarta(ctx, my);
      }
      // nearer trees
      for (const t of this.mid.trees) {
        if (t.row !== 1 || y < t.appear) continue;
        const x = sx(t.x) * 1 - pan * 0.08;
        if (x < -80 || x > W + 80) continue;
        const grow = U.clamp((y - t.appear) / 30, 0.35, 1);
        this.drawProp(ctx, t.type, t.v, x, this.horizonY + 0.1 * H + t.dy * u, t.s * grow * 0.95, 1, colorA);
      }
      if (e.dusk > 0.01) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = 'source-atop';
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(42,32,80,' + (0.42 * e.dusk).toFixed(3) + ')';
        ctx.fillRect(0, 0, this.cw, this.ch);
        ctx.globalCompositeOperation = 'source-over';
        if (y > hw.built) {
          ctx.setTransform(d, 0, 0, d, 0, 0);
          this.drawTraffic(ctx, this.horizonY + 0.088 * H, true);
        }
      }
      ctx.restore();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }

    drawTrain(ctx, ry, y) {
      const u = this.u;
      const W = this.W;
      const steam = y < 1953;
      const cars = y < 1900 ? 4 : 5;
      const len = (steam ? 46 : 34) + cars * 25;
      const period = W + len * u + 300;
      const x0 = ((this.t * 34 * u) % period) - len * u - 100;
      const col = this.e.color > 0.25;
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = ink(0.8);
      const box = (x, w, h, fill) => {
        ctx.fillStyle = fill;
        ctx.fillRect(x, ry - h * u, w * u, h * u);
        ctx.strokeRect(x, ry - h * u, w * u, h * u);
      };
      const paper = 'rgba(242,235,220,1)';
      let x = x0;
      for (let i = 0; i < cars; i++) {
        box(x, 22, 9, col ? (steam ? '#7b3f34' : '#9aa4ad') : paper);
        ctx.fillStyle = ink(0.45);
        for (let k = 0; k < 4; k++) ctx.fillRect(x + (3 + k * 5) * u, ry - 7 * u, 2.4 * u, 2.4 * u);
        x += 25 * u;
      }
      if (steam) {
        box(x, 12, 7, col ? '#3b3533' : paper);
        x += 13 * u;
        box(x + 8 * u, 26, 7, col ? '#2f2b2a' : paper);
        box(x, 9, 11, col ? '#2f2b2a' : paper);
        box(x + 26 * u, 3, 6, col ? '#2f2b2a' : paper);
        ctx.beginPath();
        for (let k = 0; k < 3; k++) {
          ctx.moveTo(x + (14 + k * 7) * u + 2.4 * u, ry);
          ctx.arc(x + (14 + k * 7) * u, ry, 2.4 * u, 0, Math.PI * 2);
        }
        ctx.stroke();
        const sx = x + 27.5 * u;
        const sy = ry - 6 * u;
        for (let k = 0; k < 6; k++) {
          const a = ((this.t * 0.9 + k / 6) % 1 + 1) % 1;
          const px = sx - a * 34 * u;
          const py = sy - a * 26 * u;
          const r = (2.5 + a * 9) * u;
          if (this.e.color < 0.25) {
            ctx.strokeStyle = ink((1 - a) * 0.4);
            ctx.beginPath();
            ctx.arc(px, py, r, 0.4, Math.PI * 1.9);
            ctx.stroke();
          } else {
            ctx.fillStyle = 'rgba(110,108,110,' + ((1 - a) * 0.28).toFixed(3) + ')';
            ctx.beginPath();
            ctx.arc(px, py, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.strokeStyle = ink(0.8);
      } else {
        ctx.fillStyle = col ? '#c9a23c' : paper;
        ctx.beginPath();
        ctx.moveTo(x, ry);
        ctx.lineTo(x, ry - 9 * u);
        ctx.lineTo(x + 26 * u, ry - 9 * u);
        ctx.quadraticCurveTo(x + 33 * u, ry - 8 * u, x + 33 * u, ry);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    drawMarta(ctx, my) {
      const u = this.u;
      const W = this.W;
      const len = 4 * 25;
      const period = W + len * u + 500;
      const x0 = W - ((((this.t * 52 * u + 300) % period) + period) % period);
      const col = this.e.color > 0.25;
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = ink(0.8);
      for (let i = 0; i < 4; i++) {
        const x = x0 + i * 25 * u;
        ctx.fillStyle = col ? '#d9dde0' : 'rgba(242,235,220,1)';
        ctx.fillRect(x, my - 8 * u, 23 * u, 8 * u);
        ctx.strokeRect(x, my - 8 * u, 23 * u, 8 * u);
        if (col) {
          ctx.fillStyle = '#e08a2b';
          ctx.fillRect(x, my - 3.2 * u, 23 * u, 1.2 * u);
          ctx.fillStyle = '#2f5aa8';
          ctx.fillRect(x, my - 2 * u, 23 * u, 1 * u);
        }
        ctx.fillStyle = this.e.dusk > 0.3 ? 'rgba(255,226,150,0.9)' : ink(0.4);
        for (let k = 0; k < 4; k++) ctx.fillRect(x + (2 + k * 5.5) * u, my - 6.5 * u, 3 * u, 2.2 * u);
      }
    }

    drawTraffic(ctx, wy, lightsOnly) {
      const u = this.u;
      const W = this.W;
      const n = Math.round(W / (38 * u));
      const r = U.rng(5);
      for (let i = 0; i < n; i++) {
        const lane = i % 2;
        const speed = (lane ? -1 : 1) * (40 + r() * 30) * u;
        const base = r() * (W + 100);
        const x = ((((base + this.t * speed) % (W + 100)) + (W + 100)) % (W + 100)) - 50;
        const yy = wy + (lane ? 4.2 : 0.4) * u;
        if (lightsOnly) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = this.e.dusk;
          ctx.fillStyle = speed > 0 ? '#fff4d0' : '#ff3b2f';
          ctx.fillRect(x + (speed > 0 ? 7 * u : -1 * u), yy, 1.6 * u, 1.4 * u);
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
          continue;
        }
        const colA = this.e.color > 0.25;
        ctx.fillStyle = colA ? ['#b5442f', '#2f5f8a', '#e0b33c', '#dedad2', '#3e7a54', '#4a4a52'][(r() * 6) | 0] : 'rgba(242,235,220,1)';
        ctx.strokeStyle = ink(0.7);
        ctx.lineWidth = 0.6;
        ctx.fillRect(x, yy, 7 * u, 2.6 * u);
        ctx.strokeRect(x, yy, 7 * u, 2.6 * u);
      }
    }

    /* ------------------------------------------------------------------ fg */

    ensureHill() {
      if (this.hill) return this.hill;
      const u = this.u;
      const d = this.dpr;
      const tile = S.TILE;
      const top = this.crestY - 40 * u;
      const w = Math.ceil(tile * u * d);
      const h = Math.ceil((this.H - top) * d) + 2;
      const c = U.canvas(w, h);
      const ctx = c.getContext('2d');
      const r = U.rng(321);
      const yAt = (xu) => (this.crestY - S.crest(xu) * u - top) * d;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let i = 0; i <= 240; i++) {
        const xu = (tile * i) / 240;
        ctx.lineTo(xu * u * d, yAt(xu));
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = ctx.createPattern(this.paperTile, 'repeat');
      ctx.fill();
      // crest line, drawn twice like a pencil pass
      ctx.lineCap = 'round';
      for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath();
        for (let i = 0; i <= 240; i++) {
          const xu = (tile * i) / 240;
          const yy = yAt(xu) + (r() - 0.5) * 0.8 * d;
          if (i) ctx.lineTo(xu * u * d, yy);
          else ctx.moveTo(0, yy);
        }
        ctx.strokeStyle = ink(pass ? 0.35 : 0.75);
        ctx.lineWidth = (pass ? 0.7 : 1.1) * d;
        ctx.stroke();
      }
      // grass: short strokes, dense near the crest
      ctx.strokeStyle = ink(0.3);
      ctx.lineWidth = 0.6 * d;
      ctx.beginPath();
      const count = Math.round(tile * 1.6);
      for (let i = 0; i < count; i++) {
        const xu = r() * tile;
        const yy = yAt(xu) + Math.pow(r(), 2.2) * (h - yAt(xu));
        const x = xu * u * d;
        const len = (2 + r() * 4) * d * (1 + (yy / h) * 0.6);
        ctx.moveTo(x, yy);
        ctx.lineTo(x + (r() - 0.3) * len * 0.5, yy - len);
      }
      ctx.stroke();
      this.hill = { c, top, w };
      return this.hill;
    }

    crestAt(screenX, pan) {
      const xu = (screenX - this.W / 2 + pan) / this.u;
      return this.crestY - S.crest(xu) * this.u;
    }

    drawFg() {
      const ctx = this.L.fg.ctx;
      const d = this.dpr;
      const W = this.W;
      const H = this.H;
      const u = this.u;
      const y = this.view.year;
      const e = this.e;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, this.cw, this.ch);
      const intro = this.view.intro;
      const clipW = intro >= 1 ? W : W * U.clamp(intro * 1.7, 0, 1.2);
      if (clipW <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, clipW * d, this.ch);
      ctx.clip();
      const pan = this.camX * this.s * PAR.fg;
      const hill = this.ensureHill();
      const tilePx = S.TILE * u;
      let x0 = W / 2 - pan;
      x0 = ((x0 % tilePx) + tilePx) % tilePx - tilePx;
      for (let x = x0; x < W; x += tilePx) ctx.drawImage(hill.c, Math.round(x * d), Math.round(hill.top * d));
      // grass wash
      if (e.color > 0.02) {
        ctx.setTransform(d, 0, 0, d, 0, 0);
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W + 8; x += 8) ctx.lineTo(x, this.crestAt(x, pan) + 1);
        ctx.lineTo(W + 8, H);
        ctx.closePath();
        const g = ctx.createLinearGradient(0, this.crestY - 30 * u, 0, H);
        const gc = ERA.green(y);
        g.addColorStop(0, U.rgba(U.shade(gc, 0.12)));
        g.addColorStop(1, U.rgba(U.shade(gc, -0.22)));
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = e.color * 0.85;
        ctx.fillStyle = g;
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
      const founded = this.fg.founded;
      const colorA = e.color;
      const depthY = (x, depth) => {
        const cy = this.crestAt(x, pan);
        return cy + 3 * u + depth * (H - cy) * 0.78;
      };
      // farm fence before the cemetery; iron fencing after
      for (const f of this.fg.fence) {
        const x = W / 2 + f.x * u - pan;
        if (x < -30 || x > W + 30) continue;
        const yy = depthY(x, 0.02);
        if (y < founded + 0.6) this.drawProp(ctx, 'post', 0, x, yy, 0.95, 1 - U.smoothstep(founded, founded + 0.6, y), colorA);
        if (y > founded && Math.abs(f.x + 520) < 900) this.drawProp(ctx, 'iron', 0, x, yy, 0.85, U.smoothstep(founded, founded + 1.2, y), colorA);
      }
      for (const o of this.fgObjects) {
        const par = 1 + o.depth * 0.32;
        const x = W / 2 + (o.x * u - pan * par);
        if (x < -320 * u || x > W + 320 * u) continue;
        const yy = depthY(x, o.depth);
        const sc = 0.55 + o.depth * 0.9;
        if (o.kind === 'stone') {
          const s = o.ref;
          if (y < s.appear) continue;
          let a = U.clamp((y - s.appear) / 0.8, 0, 1);
          if (s.decay) a *= 1 - U.smoothstep(s.decay, s.decay + 6, y);
          if (a <= 0.01) continue;
          this.drawProp(ctx, s.type, s.v % 3, x, yy, sc, a, colorA);
          if (s.flowers && colorA > 0.25) this.flowers(ctx, x, yy, sc, s, colorA * a);
        } else if (o.kind === 'tree') {
          const t = o.ref;
          const grow = U.lerp(0.78, 1, U.smoothstep(1860, 1960, y));
          this.drawProp(ctx, t.type, 1, x, yy, t.s * sc * grow, 1, colorA);
        } else if (o.kind === 'gate') {
          if (y < founded - 0.4) continue;
          const a = U.smoothstep(founded - 0.4, founded + 0.2, y);
          this.drawProp(ctx, 'gate', 0, x, yy, sc * 1.05, a, colorA);
        }
      }
      if (e.dusk > 0.01) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = 'source-atop';
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(40,30,74,' + (0.44 * e.dusk).toFixed(3) + ')';
        ctx.fillRect(0, 0, this.cw, this.ch);
      }
      ctx.restore();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }

    flowers(ctx, x, yy, sc, s, a) {
      const d = this.dpr;
      const u = this.u * sc;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = Math.min(1, a);
      const r = U.rng((s.x * 1000) | 0);
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = i % 2 ? s.flowerColor : '#5c8a45';
        ctx.beginPath();
        ctx.arc(x + (r() - 0.5) * 14 * u, yy - r() * 3 * u, (1 + r() * 1.3) * u, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    /* -------------------------------------------------------------- frame */

    /**
     * Draw a frame. Returns true while more frames are needed (sprites still
     * baking or ambient animation running).
     */
    render(dt) {
      this.frame++;
      this.computeView();
      const sig =
        this.view.year.toFixed(3) + '|' + this.camX.toFixed(1) + '|' + this.view.intro.toFixed(3) + '|' + this.s.toFixed(4) + '|' + this.W + 'x' + this.H;
      const viewChanged = sig !== this.lastSig;
      const first = this.frame < 3;
      const baked = this.processJobs(first ? 600 : viewChanged ? 5 : 10);
      const ambient = this.animate && !document.hidden;
      if (ambient) this.t += Math.min(dt, 0.1);
      const staticDirty = viewChanged || baked || this.dirty || first;
      this.tick = (this.tick || 0) + 1;
      const ambientDue = ambient && this.tick % 2 === 0;
      if (staticDirty) {
        this.drawCity();
        this.drawFg();
      }
      if (staticDirty || ambientDue) {
        this.drawSky(ambientDue ? dt * 2 : 0);
        this.drawFx(ambientDue ? dt * 2 : 0);
        this.drawMid();
      }
      this.lastSig = sig;
      this.dirty = false;
      return this.jobs.size > 0 || ambient;
    }

    /** UI accent colour for the current year (used by the HUD). */
    accent(year) {
      return ERA.accent(year);
    }
    isDusk(year) {
      return ERA.dusk(year) > 0.55;
    }
  }

  SV.Scene = Scene;
})((window.SV = window.SV || {}));
