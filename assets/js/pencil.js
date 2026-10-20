/* ==========================================================================
   South-View · hand-drawn drawing primitives
   --------------------------------------------------------------------------
   Every building, tree and headstone is drawn by the same small "Pencil"
   API. A drawing function runs once per *mode*:

     'pencil' – opaque paper silhouette + graphite lines and hatching
     'color'  – watercolour washes (composited with "multiply" so the pencil
                lines always show through, like pen-and-wash)
     'light'  – lit windows and neon, faded in at dusk

   The result of each run is baked into an offscreen canvas ("sprite"), so
   the expensive, wobbly linework is drawn once — not on every scroll frame.
   ========================================================================== */
(function (SV) {
  'use strict';

  const U = SV.util;
  const INK = [40, 36, 33];
  const PAPER = [242, 235, 220];

  /* ------------------------------------------------------------------------
     Textures (generated once, deterministic)
     ------------------------------------------------------------------------ */
  const Tex = {};

  Tex.noise = (size, seed, density, alpha, color) => {
    const c = U.canvas(size, size);
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(size, size);
    const d = img.data;
    const r = U.rng(seed);
    const col = color || INK;
    for (let i = 0; i < size * size; i++) {
      if (r() < density) {
        d[i * 4] = col[0];
        d[i * 4 + 1] = col[1];
        d[i * 4 + 2] = col[2];
        d[i * 4 + 3] = (alpha * (0.35 + r() * 0.65) * 255) | 0;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c;
  };

  /* Seamless paper tile: warm base, soft blotches, fibres and fine grain. */
  Tex.paper = (size, seed, base) => {
    const c = U.canvas(size, size);
    const ctx = c.getContext('2d');
    const r = U.rng(seed);
    ctx.fillStyle = U.rgba(base || PAPER);
    ctx.fillRect(0, 0, size, size);
    const wraps = [-size, 0, size];
    for (let i = 0; i < 22; i++) {
      const x = r() * size;
      const y = r() * size;
      const rad = size * (0.08 + r() * 0.2);
      const dark = r() < 0.62;
      const col = dark ? [125, 98, 62] : [255, 252, 244];
      for (const ox of wraps) {
        for (const oy of wraps) {
          const cx = x + ox;
          const cy = y + oy;
          if (cx + rad < 0 || cx - rad > size || cy + rad < 0 || cy - rad > size) continue;
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
          g.addColorStop(0, U.rgba(col, dark ? 0.05 : 0.07));
          g.addColorStop(1, U.rgba(col, 0));
          ctx.fillStyle = g;
          ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
        }
      }
    }
    ctx.lineCap = 'round';
    for (let i = 0; i < 170; i++) {
      const x = r() * size;
      const y = r() * size;
      const len = 4 + r() * 16;
      const a = r() * Math.PI * 2;
      const bend = (r() - 0.5) * 5;
      ctx.strokeStyle = U.rgba(r() < 0.55 ? [120, 96, 64] : [255, 255, 250], 0.05 + r() * 0.07);
      ctx.lineWidth = 0.5 + r() * 0.7;
      for (const ox of wraps) {
        for (const oy of wraps) {
          const sx = x + ox;
          const sy = y + oy;
          if (sx < -30 || sx > size + 30 || sy < -30 || sy > size + 30) continue;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(
            sx + (Math.cos(a) * len) / 2 - Math.sin(a) * bend,
            sy + (Math.sin(a) * len) / 2 + Math.cos(a) * bend,
            sx + Math.cos(a) * len,
            sy + Math.sin(a) * len
          );
          ctx.stroke();
        }
      }
    }
    const img = ctx.getImageData(0, 0, size, size);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (r() - 0.5) * 13;
      d[i] += n;
      d[i + 1] += n;
      d[i + 2] += n * 0.9;
    }
    ctx.putImageData(img, 0, 0);
    return c;
  };

  /* Shared textures used while baking sprites. */
  let shared = null;
  Tex.shared = () => {
    if (shared) return shared;
    shared = {
      // paper-coloured specks: the "tooth" of the paper breaking up graphite
      tooth: Tex.noise(96, 11, 0.16, 0.55, [246, 240, 228]),
      // pigment granulation for washes: dark and light specks
      granDark: Tex.noise(128, 23, 0.1, 0.22, [70, 52, 36]),
      granLight: Tex.noise(128, 37, 0.08, 0.3, [255, 252, 245]),
    };
    return shared;
  };

  /* ------------------------------------------------------------------------
     Pencil
     ------------------------------------------------------------------------ */
  class Pencil {
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {object} o  s: device px per world unit, ox/oy: device px of the
     *                    world origin, dpr, mode, seed, paper (rgb)
     */
    constructor(ctx, o) {
      this.ctx = ctx;
      this.s = o.s;
      this.ox = o.ox;
      this.oy = o.oy;
      this.d = o.dpr || 1;
      this.mode = o.mode;
      this.rand = U.rng((o.seed || 1) + (o.mode === 'pencil' ? 0 : o.mode === 'color' ? 7919 : 104729));
      // geometry randomness must be identical in every mode, otherwise the
      // colour wash would not line up with the pencil drawing
      this.geo = U.rng((o.seed || 1) ^ 0x9e3779b9);
      this.detail = this.s / this.d; // CSS px per world unit (for level of detail)
      this.paper = o.paper || PAPER;
      this.ink = o.ink || INK;
      this.inkA = o.inkA == null ? 1 : o.inkA;
    }

    X(x) {
      return this.ox + x * this.s;
    }
    Y(y) {
      return this.oy - y * this.s;
    }
    r(a, b) {
      return a + (b - a) * this.rand();
    }
    /** geometry random — use this (not r) for anything that changes shape */
    g(a, b) {
      return a + (b - a) * this.geo();
    }
    gi(a, b) {
      return Math.floor(this.g(a, b + 0.999));
    }
    jit(cssPx) {
      return (this.rand() * 2 - 1) * cssPx * this.d;
    }
    /** CSS pixels → world units at this sprite's scale */
    wu(cssPx) {
      return cssPx / this.detail;
    }
    get pencil() {
      return this.mode === 'pencil';
    }
    get color() {
      return this.mode === 'color';
    }
    get light() {
      return this.mode === 'light';
    }

    _seg(path, X1, Y1, X2, Y2, over, jit, bowMax) {
      const dx = X2 - X1;
      const dy = Y2 - Y1;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const o1 = over * this.r(-0.25, 1);
      const o2 = over * this.r(-0.25, 1);
      const ax = X1 - ux * o1 + this.jit(jit);
      const ay = Y1 - uy * o1 + this.jit(jit);
      const bx = X2 + ux * o2 + this.jit(jit);
      const by = Y2 + uy * o2 + this.jit(jit);
      const bow = this.r(-1, 1) * Math.min(len * 0.018, bowMax * this.d);
      path.moveTo(ax, ay);
      path.quadraticCurveTo((ax + bx) / 2 - uy * bow, (ay + by) / 2 + ux * bow, bx, by);
    }

    _style(o, w0, a0) {
      const ctx = this.ctx;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = U.rgba(o.ink || this.ink, 1);
      return {
        w: (o.w == null ? w0 : o.w) * this.d,
        a: (o.a == null ? a0 : o.a) * this.inkA,
      };
    }

    /** Straight strokes. segs = [[x1, y1, x2, y2], ...] in world units. */
    lines(segs, o) {
      if (this.mode !== 'pencil' || !segs.length) return;
      o = o || {};
      const ctx = this.ctx;
      const st = this._style(o, 1, 0.85);
      const over = (o.over == null ? 2 : o.over) * this.d;
      const jit = o.jit == null ? 0.45 : o.jit;
      const passes = o.passes || 2;
      for (let p = 0; p < passes; p++) {
        const path = new Path2D();
        for (let i = 0; i < segs.length; i++) {
          const s = segs[i];
          this._seg(path, this.X(s[0]), this.Y(s[1]), this.X(s[2]), this.Y(s[3]), over * (p ? 0.55 : 1), jit, 1.4);
        }
        ctx.globalAlpha = st.a * (p ? 0.5 : 1);
        ctx.lineWidth = st.w * (p ? 0.72 : 1);
        ctx.stroke(path);
      }
      ctx.globalAlpha = 1;
    }
    line(x1, y1, x2, y2, o) {
      this.lines([[x1, y1, x2, y2]], o);
    }
    poly(pts, o) {
      const segs = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % pts.length];
        segs.push([a[0], a[1], b[0], b[1]]);
      }
      this.lines(segs, o);
    }
    path(pts, o) {
      const segs = [];
      for (let i = 0; i < pts.length - 1; i++) segs.push([pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]]);
      this.lines(segs, o);
    }
    rect(x, y, w, h, o) {
      this.poly(
        [
          [x, y],
          [x + w, y],
          [x + w, y + h],
          [x, y + h],
        ],
        o
      );
    }

    _smooth(ptsPx, closed) {
      const p = new Path2D();
      const n = ptsPx.length;
      if (n < 2) return p;
      if (closed) {
        const m0 = [(ptsPx[n - 1][0] + ptsPx[0][0]) / 2, (ptsPx[n - 1][1] + ptsPx[0][1]) / 2];
        p.moveTo(m0[0], m0[1]);
        for (let i = 0; i < n; i++) {
          const a = ptsPx[i];
          const b = ptsPx[(i + 1) % n];
          p.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
        }
        p.closePath();
      } else {
        p.moveTo(ptsPx[0][0], ptsPx[0][1]);
        for (let i = 1; i < n - 1; i++) {
          const a = ptsPx[i];
          const b = ptsPx[i + 1];
          p.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
        }
        p.lineTo(ptsPx[n - 1][0], ptsPx[n - 1][1]);
      }
      return p;
    }

    /** Smooth hand-drawn curve through points (world units). */
    curve(pts, o) {
      if (this.mode !== 'pencil' || pts.length < 2) return;
      o = o || {};
      const ctx = this.ctx;
      const st = this._style(o, 1, 0.85);
      const jit = o.jit == null ? 0.4 : o.jit;
      const passes = o.passes || 2;
      for (let p = 0; p < passes; p++) {
        const px = pts.map((q) => [this.X(q[0]) + this.jit(jit), this.Y(q[1]) + this.jit(jit)]);
        ctx.globalAlpha = st.a * (p ? 0.5 : 1);
        ctx.lineWidth = st.w * (p ? 0.72 : 1);
        ctx.stroke(this._smooth(px, !!o.closed));
      }
      ctx.globalAlpha = 1;
    }

    /** Points along an ellipse arc (angles in radians, y up). */
    arcPts(cx, cy, rx, ry, a0, a1, n) {
      n = n || Math.max(8, Math.ceil((Math.abs(a1 - a0) * Math.max(rx, ry) * this.detail) / 5));
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const t = a0 + ((a1 - a0) * i) / n;
        pts.push([cx + Math.cos(t) * rx, cy + Math.sin(t) * ry]);
      }
      return pts;
    }
    arc(cx, cy, rx, ry, a0, a1, o) {
      this.curve(this.arcPts(cx, cy, rx, ry, a0, a1), o);
    }

    _clip(poly) {
      const clip = new Path2D();
      for (let i = 0; i < poly.length; i++) {
        const X = this.X(poly[i][0]);
        const Y = this.Y(poly[i][1]);
        if (i) clip.lineTo(X, Y);
        else clip.moveTo(X, Y);
      }
      clip.closePath();
      return clip;
    }

    /** Parallel pencil hatching clipped to a polygon. */
    hatch(poly, o) {
      if (this.mode !== 'pencil') return;
      o = o || {};
      const ctx = this.ctx;
      const d = this.d;
      const gap = Math.max(1.6, o.gap || 3.2) * d;
      const st = this._style(o, 0.65, 0.36);
      let x0 = Infinity;
      let x1 = -Infinity;
      let y0 = Infinity;
      let y1 = -Infinity;
      for (const q of poly) {
        const X = this.X(q[0]);
        const Y = this.Y(q[1]);
        if (X < x0) x0 = X;
        if (X > x1) x1 = X;
        if (Y < y0) y0 = Y;
        if (Y > y1) y1 = Y;
      }
      if (x1 - x0 < 0.5 || y1 - y0 < 0.5) return;
      ctx.save();
      ctx.clip(this._clip(poly));
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      const R = Math.hypot(x1 - x0, y1 - y0) / 2 + 2 * d;
      const draw = (angDeg, alpha) => {
        const ang = (angDeg * Math.PI) / 180;
        const dx = Math.cos(ang);
        const dy = -Math.sin(ang);
        const nx = -dy;
        const ny = dx;
        const path = new Path2D();
        for (let t = -R; t <= R; t += gap * this.r(0.8, 1.2)) {
          if (o.broken && this.rand() < o.broken) continue;
          const px = cx + nx * t + this.jit(0.5);
          const py = cy + ny * t + this.jit(0.5);
          const l0 = -R * this.r(0.85, 1);
          const l1 = R * this.r(0.85, 1);
          path.moveTo(px + dx * l0, py + dy * l0);
          path.lineTo(px + dx * l1 + this.jit(0.7), py + dy * l1 + this.jit(0.7));
        }
        ctx.lineWidth = st.w;
        ctx.globalAlpha = alpha;
        ctx.stroke(path);
      };
      draw(o.angle == null ? 62 : o.angle, st.a);
      if (o.cross) draw((o.angle == null ? 62 : o.angle) - 78, st.a * 0.75);
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    _polyPath(poly, jitPx, ox, oy) {
      const path = new Path2D();
      for (let i = 0; i < poly.length; i++) {
        const X = this.X(poly[i][0]) + ox + (jitPx ? this.jit(jitPx) : 0);
        const Y = this.Y(poly[i][1]) + oy + (jitPx ? this.jit(jitPx) : 0);
        if (i) path.lineTo(X, Y);
        else path.moveTo(X, Y);
      }
      path.closePath();
      return path;
    }

    _wash(path, color, o, bounds) {
      const ctx = this.ctx;
      let style = U.rgba(color, 1);
      if (o.grad && bounds) {
        const g = ctx.createLinearGradient(0, bounds[1], 0, bounds[3]);
        g.addColorStop(0, U.rgba(o.grad[0], 1));
        g.addColorStop(1, U.rgba(o.grad[1], 1));
        style = g;
      } else if (o.hgrad && bounds) {
        const g = ctx.createLinearGradient(bounds[0], 0, bounds[2], 0);
        const stops = o.hgrad;
        for (let i = 0; i < stops.length; i++) g.addColorStop(i / (stops.length - 1), U.rgba(stops[i], 1));
        style = g;
      }
      ctx.fillStyle = style;
      ctx.globalAlpha = o.a == null ? 0.92 : o.a;
      ctx.fill(path);
      if (o.edge !== false) {
        ctx.strokeStyle = U.rgba(U.shade(color, -0.3), 1);
        ctx.globalAlpha = 0.22;
        ctx.lineWidth = 1.1 * this.d;
        ctx.stroke(path);
      }
      ctx.globalAlpha = 1;
    }

    _bounds(poly) {
      let x0 = Infinity;
      let x1 = -Infinity;
      let y0 = Infinity;
      let y1 = -Infinity;
      for (const q of poly) {
        const X = this.X(q[0]);
        const Y = this.Y(q[1]);
        if (X < x0) x0 = X;
        if (X > x1) x1 = X;
        if (Y < y0) y0 = Y;
        if (Y > y1) y1 = Y;
      }
      return [x0, y0, x1, y1];
    }

    /**
     * Fill a polygon. In pencil mode this lays down opaque paper (so things
     * in front hide things behind); in colour mode it paints a wash.
     */
    fill(poly, color, o) {
      if (this.mode === 'light' || !poly.length) return;
      o = o || {};
      const ctx = this.ctx;
      if (this.mode === 'pencil') {
        if (o.noPaper) return;
        ctx.globalAlpha = 1;
        ctx.fillStyle = U.rgba(o.paper || this.paper, 1);
        ctx.fill(this._polyPath(poly, 0, 0, 0));
        return;
      }
      if (o.noColor) return;
      const off = o.off == null ? 0.9 : o.off;
      const path = this._polyPath(poly, 0.35, this.jit(off), this.jit(off));
      this._wash(path, color, o, this._bounds(poly));
    }
    fillRect(x, y, w, h, color, o) {
      this.fill(
        [
          [x, y],
          [x + w, y],
          [x + w, y + h],
          [x, y + h],
        ],
        color,
        o
      );
    }
    /** Fill a smooth closed shape through points (trees, domes, clouds). */
    fillCurve(pts, color, o) {
      if (this.mode === 'light' || pts.length < 3) return;
      o = o || {};
      const ctx = this.ctx;
      if (this.mode === 'pencil') {
        if (o.noPaper) return;
        ctx.globalAlpha = 1;
        ctx.fillStyle = U.rgba(o.paper || this.paper, 1);
        ctx.fill(this._smooth(pts.map((q) => [this.X(q[0]), this.Y(q[1])]), true));
        return;
      }
      if (o.noColor) return;
      const off = o.off == null ? 0.9 : o.off;
      const ox = this.jit(off);
      const oy = this.jit(off);
      const path = this._smooth(
        pts.map((q) => [this.X(q[0]) + ox + this.jit(0.4), this.Y(q[1]) + oy + this.jit(0.4)]),
        true
      );
      this._wash(path, color, o, this._bounds(pts));
    }

    /** Small graphite marks (windows) — batched filled rects. */
    marks(rects, o) {
      if (this.mode !== 'pencil' || !rects.length) return;
      const ctx = this.ctx;
      const a = (o && o.a != null ? o.a : 0.5) * this.inkA;
      const min = 0.6 * this.d;
      ctx.fillStyle = U.rgba(this.ink, 1);
      for (const q of rects) {
        ctx.globalAlpha = a * this.r(0.45, 1);
        const X = this.X(q[0]) + this.jit(0.2);
        const Y = this.Y(q[1] + q[3]) + this.jit(0.2);
        ctx.fillRect(X, Y, Math.max(min, q[2] * this.s), Math.max(min, q[3] * this.s));
      }
      ctx.globalAlpha = 1;
    }

    /** Glass / window colour (colour mode only). */
    tint(rects, color, a) {
      if (this.mode !== 'color' || !rects.length) return;
      const ctx = this.ctx;
      ctx.fillStyle = U.rgba(color, 1);
      for (const q of rects) {
        ctx.globalAlpha = (a == null ? 0.75 : a) * this.r(0.75, 1);
        ctx.fillRect(this.X(q[0]), this.Y(q[1] + q[3]), Math.max(0.6, q[2] * this.s), Math.max(0.6, q[3] * this.s));
      }
      ctx.globalAlpha = 1;
    }

    /** Lit windows (light mode only). */
    lights(rects, colors, a) {
      if (this.mode !== 'light' || !rects.length) return;
      const ctx = this.ctx;
      const pal = colors || ['#ffd27a', '#ffe3a3', '#fff0cf', '#ffc65c', '#dce9ff'];
      const min = 0.8 * this.d;
      for (const q of rects) {
        const c = pal[(this.rand() * pal.length) | 0];
        const X = this.X(q[0]);
        const Y = this.Y(q[1] + q[3]);
        const w = Math.max(min, q[2] * this.s);
        const h = Math.max(min, q[3] * this.s);
        ctx.globalAlpha = (a == null ? 0.95 : a) * this.r(0.55, 1);
        ctx.fillStyle = c;
        ctx.fillRect(X, Y, w, h);
        ctx.globalAlpha *= 0.22;
        ctx.fillRect(X - w * 0.5 - this.d, Y - h * 0.4 - this.d, w * 2 + 2 * this.d, h * 1.8 + 2 * this.d);
      }
      ctx.globalAlpha = 1;
    }

    /** A soft glow (light mode only): neon signs, dome lights, beacons. */
    glow(x, y, r, color, a) {
      if (this.mode !== 'light') return;
      const ctx = this.ctx;
      const X = this.X(x);
      const Y = this.Y(y);
      const R = Math.max(2 * this.d, r * this.s);
      const g = ctx.createRadialGradient(X, Y, 0, X, Y, R);
      g.addColorStop(0, U.rgba(color, a == null ? 0.9 : a));
      g.addColorStop(1, U.rgba(color, 0));
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(X - R, Y - R, R * 2, R * 2);
    }
    /** Solid light shape (light mode only). */
    lightPoly(poly, color, a) {
      if (this.mode !== 'light') return;
      const ctx = this.ctx;
      ctx.globalAlpha = a == null ? 0.9 : a;
      ctx.fillStyle = U.rgba(color, 1);
      ctx.fill(this._polyPath(poly, 0, 0, 0));
      ctx.globalAlpha = 1;
    }

    /** Hand-lettered text: signs, gate lettering. */
    text(str, x, y, o) {
      o = o || {};
      const ctx = this.ctx;
      const size = Math.max(4, (o.size || 8) * this.s);
      if (size < 3 * this.d) return;
      if (this.mode === 'pencil' && o.pencil === false) return;
      if (this.mode === 'color' && !o.color) return;
      if (this.mode === 'light' && !o.light) return;
      ctx.save();
      ctx.font = (o.weight || 600) + ' ' + size + 'px ' + (o.font || '"Fraunces", Georgia, serif');
      ctx.textAlign = o.align || 'center';
      ctx.textBaseline = 'alphabetic';
      const X = this.X(x);
      const Y = this.Y(y);
      if (o.vertical) {
        const chars = str.split('');
        chars.forEach((ch, i) => this._glyph(ch, X, Y + i * size * 1.02, o, size));
      } else {
        this._glyph(str, X, Y, o, size);
      }
      ctx.restore();
    }
    _glyph(str, X, Y, o, size) {
      const ctx = this.ctx;
      if (this.mode === 'pencil') {
        ctx.globalAlpha = (o.a == null ? 0.8 : o.a) * this.inkA;
        ctx.fillStyle = U.rgba(this.ink, 1);
        ctx.fillText(str, X, Y);
      } else if (this.mode === 'color') {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = U.rgba(o.color, 1);
        ctx.fillText(str, X, Y);
      } else {
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = U.rgba(o.light, 1);
        ctx.fillText(str, X - 0.6 * this.d, Y);
        ctx.fillText(str, X + 0.6 * this.d, Y);
        ctx.globalAlpha = 1;
        ctx.fillStyle = U.rgba(U.shade(o.light, 0.55), 1);
        ctx.fillText(str, X, Y);
        void size;
      }
    }
  }

  /** Paper tooth / pigment granulation after a sprite is drawn. */
  Pencil.finish = (canvas, mode) => {
    if (mode === 'light') return;
    const tex = Tex.shared();
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    if (mode === 'pencil') {
      ctx.fillStyle = ctx.createPattern(tex.tooth, 'repeat');
      ctx.globalAlpha = 0.9;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = ctx.createPattern(tex.granDark, 'repeat');
      ctx.globalAlpha = 0.8;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ctx.createPattern(tex.granLight, 'repeat');
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.restore();
  };

  SV.Pencil = Pencil;
  SV.Tex = Tex;
  SV.INK = INK;
  SV.PAPER = PAPER;
})((window.SV = window.SV || {}));
