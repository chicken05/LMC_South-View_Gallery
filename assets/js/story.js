/* ==========================================================================
   South-View · story
   --------------------------------------------------------------------------
   Builds the page from content/timeline.js, then turns the reader's scroll
   position into a YEAR and a CAMERA position for the skyline:

     every chapter, entry and decade marker is an "anchor" with a year; the
     year at any scroll position is interpolated between the anchors above
     and below it, so the city is always drawn in the year you are reading.

   Also runs the timeline indicator (HUD), reveal animations, light
   parallax on entries, and deep links (#entry-id, ?year=1958).
   ========================================================================== */
(function (SV) {
  'use strict';

  const U = SV.util;

  /* tiny DOM helper */
  const h = (tag, attrs, kids) => {
    const el = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'style') el.setAttribute('style', v);
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    (kids || []).forEach((c) => {
      if (c == null || c === false) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  };

  const link = (label, url, cls) =>
    h('a', { class: cls, href: url, target: '_blank', rel: 'noopener noreferrer' }, [label, h('span', { class: 'ext', 'aria-hidden': 'true', text: ' ↗' })]);

  const STATUS = {
    draft: 'Draft · sourced, needs team review',
    placeholder: 'Placeholder · research needed',
  };

  class Story {
    constructor(o) {
      this.content = o.content || {};
      this.root = o.root;
      this.hudEl = o.hud;
      this.scene = o.scene;
      this.reduced = !!o.reduced;
      this.site = this.content.site || {};
      this.startYear = this.site.startYear || 1860;
      this.endYear = this.site.endYear || new Date().getFullYear();
      this.year = null;
      this.cam = null;
      this.anchors = [];
      this.visible = new Set();
      this.onMotionToggle = null;
      this.lastHud = {};
      this.normalize();
    }

    /* ----------------------------------------------------------- content */

    normalize() {
      const periods = (this.content.periods || []).slice().sort((a, b) => a.start - b.start);
      const entries = (this.content.entries || []).filter((e, i) => {
        const ok = e && typeof e.year === 'number' && e.title;
        if (!ok && window.console) console.warn('[South-View] entry #' + i + ' needs at least a numeric "year" and a "title" — skipped.', e);
        return ok;
      });
      const seen = {};
      entries.forEach((e, i) => {
        e._order = i;
        if (!e.id) e.id = 'entry-' + i;
        if (seen[e.id]) {
          if (window.console) console.warn('[South-View] duplicate entry id "' + e.id + '" — renamed.');
          e.id = e.id + '-' + i;
        }
        seen[e.id] = true;
        if (e.focus && SV.landmarks.focus[e.focus] == null && window.console) {
          console.warn('[South-View] unknown focus "' + e.focus + '" on entry "' + e.id + '". Options: ' + Object.keys(SV.landmarks.focus).join(', '));
        }
      });
      entries.sort((a, b) => a.year - b.year || a._order - b._order);
      const periodFor = (e) => {
        if (e.period && periods.some((p) => p.id === e.period)) return e.period;
        let found = periods[0];
        for (const p of periods) if (e.year >= p.start) found = p;
        return found ? found.id : null;
      };
      this.periods = periods.map((p) => Object.assign({}, p, { entries: entries.filter((e) => periodFor(e) === p.id) }));
      this.entries = entries;
    }

    /* ------------------------------------------------------------- build */

    build() {
      const site = this.site;
      const root = this.root;
      root.textContent = '';

      // hero
      const hero = h('section', { class: 'hero', id: 'top', 'data-year': this.startYear, 'data-anchor': 'start', 'aria-labelledby': 'hero-title' }, [
        h('div', { class: 'hero__inner reveal' }, [
          h('p', { class: 'hero__kicker', text: site.kicker || '' }),
          h('h1', { class: 'hero__title', id: 'hero-title', text: site.title || 'South-View' }),
          h('p', { class: 'hero__dek', text: site.dek || '' }),
          h('p', { class: 'hero__cue', 'aria-hidden': 'true' }, [h('span', { text: 'Scroll to begin' }), h('span', { class: 'hero__cue-line' })]),
        ]),
      ]);
      root.appendChild(hero);

      const timeline = h('div', { class: 'timeline', id: 'timeline', tabindex: '-1' });
      root.appendChild(timeline);
      let prevYear = this.startYear;
      let flip = false;

      this.periods.forEach((p) => {
        const sec = h('section', { class: 'period period--' + p.id, id: p.id, 'data-period': p.id, 'aria-labelledby': p.id + '-title' });
        const chapterYear = Math.max(prevYear, Math.min(p.start, p.entries.length ? p.entries[0].year : p.start));
        if (chapterYear - prevYear >= 4) sec.appendChild(this.gap(prevYear, chapterYear));
        sec.appendChild(
          h('header', { class: 'chapter', 'data-year': chapterYear, 'data-focus': p.focus || null }, [
            h('div', { class: 'chapter__inner reveal' }, [
              h('p', { class: 'chapter__num', text: p.number || '' }),
              h('h2', { class: 'chapter__title', id: p.id + '-title', text: p.title }),
              p.years ? h('p', { class: 'chapter__years', text: p.years }) : null,
              p.intro ? h('p', { class: 'chapter__intro', text: p.intro }) : null,
              this.statusChip(p.status),
            ]),
          ])
        );
        prevYear = chapterYear;
        p.entries.forEach((e) => {
          if (e.year - prevYear >= 4) sec.appendChild(this.gap(prevYear, e.year));
          sec.appendChild(this.entry(e, flip));
          flip = !flip;
          prevYear = e.year;
        });
        timeline.appendChild(sec);
      });

      if (this.endYear - prevYear >= 4) timeline.appendChild(this.gap(prevYear, this.endYear));
      root.appendChild(this.finale());
      this.buildHud();
      this.anchorEls = Array.from(root.querySelectorAll('[data-year]'));
      this.observe();
      this.measure();
    }

    statusChip(status) {
      if (!this.site.showStatusLabels || !STATUS[status]) return null;
      return h('p', { class: 'status status--' + status, text: STATUS[status] });
    }

    gap(y0, y1) {
      const years = y1 - y0;
      const vh = U.clamp(years * 2.1, 14, 64);
      const g = h('div', { class: 'gap', 'aria-hidden': 'true', style: '--gap:' + vh.toFixed(1) + 'vh' });
      let side = 0;
      for (let d = Math.ceil((y0 + 1) / 10) * 10; d < y1; d += 10) {
        const t = (d - y0) / years;
        g.appendChild(h('span', { class: 'gap__decade gap__decade--' + (side++ % 2 ? 'r' : 'l'), 'data-year': d, style: '--position:' + (t * 100).toFixed(1) + '%', text: d + 's' }));
      }
      return g;
    }

    entry(e, flip) {
      const titleId = e.id + '-title';
      const status = e.status || 'researched';
      const art = h('article', {
        class: 'entry' + (flip ? ' entry--flip' : '') + ' entry--' + status,
        id: e.id,
        'data-year': e.year,
        'data-focus': e.focus || null,
        'aria-labelledby': titleId,
      });
      art.appendChild(h('div', { class: 'entry__year', 'aria-hidden': 'true', text: String(e.date && /^\d{4}$/.test(e.date) ? e.date : Math.floor(e.year)) }));
      art.appendChild(h('div', { class: 'entry__media reveal' }, [this.media(e)]));
      // Keep one link per destination in an entry, retaining every source's role.
      const destinations = new Map();
      (e.sources || []).filter((s) => s && s.url).forEach((s) => {
        if (!destinations.has(s.url)) destinations.set(s.url, { url: s.url, labels: [] });
        const labels = destinations.get(s.url).labels;
        const label = s.label || 'Source';
        if (!labels.includes(label)) labels.push(label);
      });
      const m = e.media || {};
      if (m.src && m.credit && destinations.has(m.creditUrl)) destinations.get(m.creditUrl).labels.push('Image credit');
      const sources = Array.from(destinations.values());
      const body = h('div', { class: 'entry__body reveal' }, [
        h('div', { class: 'card' }, [
          h('p', { class: 'entry__eyebrow' }, [h('span', { class: 'entry__date', text: e.date || String(e.year) }), e.person ? h('span', { class: 'entry__person', text: e.person }) : null]),
          h('h3', { class: 'entry__title', id: titleId, text: e.title }),
          e.description ? h('p', { class: 'entry__desc', text: e.description }) : null,
          e.whyItBelongs
            ? h('div', { class: 'entry__why' }, [
                h('h4', { class: 'entry__why-label' }, [h('span', { class: 'entry__why-icon', 'aria-hidden': 'true' }), 'Connection to South-View']),
                h('p', { text: e.whyItBelongs }),
              ])
            : null,
          sources.length
            ? h(
                'ul',
                { class: 'entry__sources', 'aria-label': 'Sources' },
                sources.map((s) => h('li', null, [link(s.labels.join(' · '), s.url)]))
              )
            : null,
          this.statusChip(status),
        ]),
      ]);
      art.appendChild(body);
      return art;
    }

    media(e) {
      const m = e.media || {};
      const meta = h('span', { class: 'photo__type', text: [m.type, m.date].filter(Boolean).join(' · ') || 'Archival image' });
      if (!m.src) {
        return h('figure', { class: 'photo photo--placeholder' }, [
          h('div', { class: 'photo__frame' }, [
            h('div', { class: 'placeholder', role: 'img', 'aria-label': 'Placeholder: archival image needed' }, [
              h('span', { class: 'placeholder__icon', 'aria-hidden': 'true' }),
              h('span', { class: 'placeholder__label', text: 'Archival image needed' }),
              m.suggestion ? h('span', { class: 'placeholder__hint', text: 'Suggested: ' + m.suggestion }) : null,
            ]),
          ]),
          h('figcaption', { class: 'photo__caption' }, [meta, ' Placeholder']),
        ]);
      }
      const img = h('img', {
        src: m.src,
        alt: m.alt || '',
        width: m.width || null,
        height: m.height || null,
        loading: 'lazy',
        decoding: 'async',
      });
      img.addEventListener('load', () => this.requestMeasure());
      img.addEventListener('error', () => {
        if (window.console) console.warn('[South-View] image not found: ' + m.src);
      });
      const caption = h('figcaption', { class: 'photo__caption' }, [
        meta,
        m.caption ? ' ' + m.caption + ' ' : ' ',
        m.credit
          ? (m.creditUrl && !(e.sources || []).some((s) => s && s.url === m.creditUrl)
              ? link(m.credit, m.creditUrl, 'photo__credit')
              : h('span', { class: 'photo__credit', text: m.credit }))
          : null,
      ]);
      const style = m.width ? 'max-width:' + Math.round(Math.max(m.width * 1.4, 300)) + 'px' : null;
      return h('figure', { class: 'photo', style }, [h('div', { class: 'photo__frame' }, [img]), caption]);
    }

    finale() {
      const f = this.site.finale || {};
      const credits = this.site.credits || {};
      const imageCredits = this.entries
        .filter((e) => e.media && e.media.src && e.media.credit)
        .map((e) => h('li', null, [e.person + ': ', e.media.creditUrl ? link(e.media.credit, e.media.creditUrl) : e.media.credit]));
      const back = h('button', { class: 'button', type: 'button', text: 'Return to ' + this.startYear });
      back.addEventListener('click', () => this.scrollToY(0));
      return h('section', { class: 'finale', id: 'finale', 'data-year': this.endYear, 'data-anchor': 'end', 'data-focus': 'skyline', 'aria-labelledby': 'finale-title' }, [
        h('div', { class: 'finale__inner reveal' }, [
          h('p', { class: 'chapter__num', text: String(this.endYear) }),
          h('h2', { class: 'finale__title', id: 'finale-title', text: f.title || 'The view from South-View' }),
          f.text ? h('p', { class: 'finale__text', text: f.text }) : null,
          f.address ? h('p', { class: 'finale__address', text: f.address }) : null,
          back,
          h('div', { class: 'finale__credits' }, [
            credits.course ? h('p', { class: 'finale__course', text: credits.course }) : null,
            credits.team ? h('p', { text: credits.team }) : null,
            f.sources && f.sources.length
              ? h('div', null, [h('h3', { text: 'Further reading' }), h('ul', null, f.sources.map((s) => h('li', null, [link(s.label, s.url)])))])
              : null,
            imageCredits.length ? h('div', null, [h('h3', { text: 'Image credits' }), h('ul', null, imageCredits)]) : null,
            credits.note ? h('p', { class: 'finale__note', text: credits.note }) : null,
          ]),
        ]),
      ]);
    }

    /* --------------------------------------------------------------- HUD */

    buildHud() {
      const hud = this.hudEl;
      hud.textContent = '';
      this.hud = {
        year: h('span', { class: 'hud__year', text: String(this.startYear) }),
        period: h('span', { class: 'hud__period', text: '' }),
        marker: h('span', { class: 'hud__marker' }),
        fill: h('span', { class: 'hud__fill' }),
        segs: [],
        ticks: [],
      };
      const track = h('div', { class: 'hud__track' }, [this.hud.fill]);
      this.periods.forEach((p) => {
        const a = h('a', { class: 'hud__seg', href: '#' + p.id, 'aria-label': 'Jump to ' + (p.number ? p.number + ': ' : '') + p.title }, [
          h('span', { class: 'hud__seg-label', text: p.number || p.title }),
        ]);
        a.addEventListener('click', (ev) => {
          ev.preventDefault();
          this.jumpTo(p.id);
        });
        this.hud.segs.push({ el: a, p });
        track.appendChild(a);
      });
      this.entries.forEach((e) => {
        const t = h('a', { class: 'hud__tick', href: '#' + e.id, 'aria-label': e.year + ': ' + e.title }, [
          h('span', { class: 'hud__tick-year', 'aria-hidden': 'true', text: String(e.year) }),
        ]);
        t.addEventListener('click', (ev) => {
          ev.preventDefault();
          this.jumpTo(e.id);
        });
        this.hud.ticks.push({ el: t, e });
        track.appendChild(t);
      });
      track.appendChild(this.hud.marker);
      const motion = h('button', { class: 'hud__motion', type: 'button', 'aria-pressed': this.reduced ? 'true' : 'false' }, [
        h('span', { class: 'hud__motion-icon', 'aria-hidden': 'true' }),
        h('span', { class: 'hud__motion-label', text: this.reduced ? 'Animation paused' : 'Pause animation' }),
      ]);
      motion.addEventListener('click', () => {
        const off = motion.getAttribute('aria-pressed') !== 'true';
        this.setReducedMotion(off);
        if (this.onMotionToggle) this.onMotionToggle(off);
      });
      this.hud.motion = motion;
      this.hud.track = track;
      this.hud.rail = h('div', { class: 'hud__rail' }, [track]);
      hud.appendChild(h('div', { class: 'hud__now' }, [this.hud.year, this.hud.period]));
      hud.appendChild(this.hud.rail);
      hud.appendChild(motion);
    }

    setReducedMotion(off) {
      this.reduced = off;
      const m = this.hud && this.hud.motion;
      if (m) {
        m.setAttribute('aria-pressed', off ? 'true' : 'false');
        m.querySelector('.hud__motion-label').textContent = off ? 'Animation paused' : 'Pause animation';
      }
      if (off) this.clearParallax();
    }

    /* ----------------------------------------------------------- reveal */

    observe() {
      const els = Array.from(this.root.querySelectorAll('.reveal'));
      if (!('IntersectionObserver' in window)) {
        els.forEach((el) => el.classList.add('is-visible'));
        return;
      }
      const io = new IntersectionObserver(
        (list) => {
          list.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add('is-visible');
              io.unobserve(en.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );
      els.forEach((el) => io.observe(el));
      // parallax only works on what is near the viewport
      const near = new IntersectionObserver(
        (list) => {
          list.forEach((en) => {
            if (en.isIntersecting) this.visible.add(en.target);
            else this.visible.delete(en.target);
          });
        },
        { rootMargin: '25% 0px 25% 0px' }
      );
      Array.from(this.root.querySelectorAll('.entry, .gap')).forEach((el) => near.observe(el));
    }

    /* ---------------------------------------------------------- measure */

    requestMeasure() {
      if (this._mt) return;
      this._mt = setTimeout(() => {
        this._mt = null;
        this.measure();
      }, 120);
    }

    measure() {
      const vh = window.innerHeight || 1;
      this.vh = vh;
      const doc = document.documentElement;
      this.maxScroll = Math.max(1, doc.scrollHeight - vh);
      const sy = window.scrollY || window.pageYOffset || 0;
      const focus = SV.landmarks.focus;
      const A = [];
      for (const el of this.anchorEls) {
        const r = el.getBoundingClientRect();
        const top = r.top + sy;
        let y;
        if (el.getAttribute('data-anchor') === 'start') y = 0;
        else if (el.getAttribute('data-anchor') === 'end') y = this.maxScroll;
        else y = top + r.height / 2 - vh / 2;
        const year = parseFloat(el.getAttribute('data-year'));
        const f = el.getAttribute('data-focus');
        A.push({ y: U.clamp(y, 0, this.maxScroll), year, focus: f && focus[f] != null ? focus[f] : null, el });
      }
      A.sort((a, b) => a.y - b.y);
      for (let i = 1; i < A.length; i++) if (A[i].year < A[i - 1].year) A[i].year = A[i - 1].year;
      for (const a of A) a.cam = a.focus != null ? a.focus : this.scene.autoCam(a.year);
      this.anchors = A;
      // cache layout for parallax
      this.boxes = new Map();
      Array.from(this.root.querySelectorAll('.entry, .gap')).forEach((el) => {
        const r = el.getBoundingClientRect();
        this.boxes.set(el, { top: r.top + sy, h: r.height });
      });
      this.layoutHud();
    }

    layoutHud() {
      if (!this.hud) return;
      const max = this.maxScroll;
      const posOf = (id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.top + (window.scrollY || 0);
      };
      const starts = this.hud.segs.map((s) => U.clamp(posOf(s.p.id) - this.vh * 0.5, 0, max) / max);
      starts[0] = 0;
      this.hud.segs.forEach((s, i) => {
        const a = starts[i];
        const b = i + 1 < starts.length ? starts[i + 1] : 1;
        s.el.style.setProperty('--a', (a * 100).toFixed(2) + '%');
        s.el.style.setProperty('--b', (b * 100).toFixed(2) + '%');
        s.range = [a, b];
      });
      let previous = 0;
      let smallestStep = 1;
      this.hud.ticks.forEach((t, i) => {
        const anchor = this.anchors.find((x) => x.el.id === t.e.id);
        const p = anchor ? anchor.y / max : 0;
        t.el.style.setProperty('--p', (p * 100).toFixed(2) + '%');
        if (i && p > previous) smallestStep = Math.min(smallestStep, p - previous);
        previous = p;
      });
      // On phones, keep the proportional rail and give each labeled dot room
      // for a separate 44px touch target. Only this small rail scrolls sideways.
      this.hudEl.style.setProperty('--mobile-track-width', Math.ceil(45 / smallestStep) + 'px');
      const { rail, track } = this.hud;
      this.hud.mobileRail = window.innerWidth < 900 ? {
        start: track.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft,
        width: track.clientWidth,
        viewport: rail.clientWidth,
        max: Math.max(0, rail.scrollWidth - rail.clientWidth),
      } : null;
      this.lastHud.railProgress = null;
    }

    /* ----------------------------------------------------------- mapping */

    sample(sy) {
      const A = this.anchors;
      if (!A.length) return { year: this.startYear, cam: this.scene.autoCam(this.startYear) };
      if (sy <= A[0].y) return { year: A[0].year, cam: A[0].cam };
      for (let i = 1; i < A.length; i++) {
        if (sy <= A[i].y) {
          const a = A[i - 1];
          const b = A[i];
          const t = b.y > a.y ? (sy - a.y) / (b.y - a.y) : 1;
          return { year: a.year + (b.year - a.year) * t, cam: a.cam + (b.cam - a.cam) * U.smooth01(t) };
        }
      }
      const z = A[A.length - 1];
      return { year: z.year, cam: z.cam };
    }

    scrollForYear(year) {
      const A = this.anchors;
      if (!A.length) return 0;
      if (year <= A[0].year) return A[0].y;
      for (let i = 1; i < A.length; i++) {
        const a = A[i - 1];
        const b = A[i];
        if (year <= b.year && b.year > a.year) return a.y + ((year - a.year) / (b.year - a.year)) * (b.y - a.y);
      }
      return A[A.length - 1].y;
    }

    scrollToY(y) {
      window.scrollTo({ top: Math.round(y), behavior: this.reduced ? 'auto' : 'smooth' });
    }

    jumpTo(id) {
      const a = this.anchors.find((x) => x.el.id === id);
      if (a) return this.scrollToY(a.y);
      const el = document.getElementById(id);
      if (!el) return;
      const sec = el.querySelector('[data-year]');
      const b = sec && this.anchors.find((x) => x.el === sec);
      this.scrollToY(b ? b.y : el.getBoundingClientRect().top + window.scrollY);
    }

    jumpToYear(year) {
      window.scrollTo(0, Math.round(this.scrollForYear(year)));
    }

    /** Called once after layout settles: honours #entry-id and ?year= */
    applyDeepLink() {
      const q = U.query;
      const hash = decodeURIComponent((window.location.hash || '').slice(1));
      if (q.year && !isNaN(parseFloat(q.year))) {
        this.jumpToYear(parseFloat(q.year));
        return true;
      }
      if (hash && hash !== 'top') {
        const a = this.anchors.find((x) => x.el.id === hash);
        if (a) {
          window.scrollTo(0, Math.round(a.y));
          return true;
        }
        const el = document.getElementById(hash);
        if (el) {
          const inner = el.querySelector('[data-year]');
          const b = inner && this.anchors.find((x) => x.el === inner);
          if (b) {
            window.scrollTo(0, Math.round(b.y));
            return true;
          }
        }
      }
      return false;
    }

    /* ------------------------------------------------------------ update */

    /**
     * Called every animation frame. Returns the view the scene should draw.
     */
    update(dt) {
      const sy = window.scrollY || window.pageYOffset || 0;
      const target = this.sample(sy);
      if (this.year == null || this.reduced) {
        this.year = target.year;
        this.cam = target.cam;
      } else {
        const k = 1 - Math.exp(-dt * 6.5);
        this.year += (target.year - this.year) * k;
        this.cam += (target.cam - this.cam) * k;
        if (Math.abs(target.year - this.year) < 0.002) this.year = target.year;
        if (Math.abs(target.cam - this.cam) < 0.05) this.cam = target.cam;
      }
      this.settling = Math.abs(target.year - this.year) > 0.002 || Math.abs(target.cam - this.cam) > 0.05;
      this.updateHud(sy);
      if (!this.reduced) this.parallax(sy);
      return { year: this.year, camX: this.cam };
    }

    updateHud(sy) {
      if (!this.hud) return;
      const yr = Math.round(U.clamp(this.year, this.startYear, this.endYear));
      const last = this.lastHud;
      if (yr !== last.yr) {
        this.hud.year.textContent = String(yr);
        last.yr = yr;
      }
      let current = this.periods[0];
      for (const p of this.periods) if (this.year >= p.start - 0.001) current = p;
      if (current && current.id !== last.period) {
        this.hud.period.textContent = current.title;
        this.hud.segs.forEach((s) => s.el.classList.toggle('is-current', s.p.id === current.id));
        last.period = current.id;
      }
      const prog = U.clamp(sy / this.maxScroll, 0, 1);
      if (Math.abs(prog - (last.prog || -1)) > 0.0004) {
        this.hudEl.style.setProperty('--progress', (prog * 100).toFixed(2) + '%');
        last.prog = prog;
      }
      // Follow page scrolling on mobile; leave manual rail swipes alone
      // while the page stays still. Layout changes also refresh the position.
      const rail = this.hud.mobileRail;
      if (rail && prog !== last.railProgress) {
        this.hud.rail.scrollLeft = U.clamp(rail.start + prog * rail.width - rail.viewport / 2, 0, rail.max);
        last.railProgress = prog;
      }
      const accent = U.rgba(this.scene.accent(this.year));
      if (accent !== last.accent) {
        document.documentElement.style.setProperty('--accent', accent);
        last.accent = accent;
      }
      const dusk = this.scene.isDusk(this.year);
      if (dusk !== last.dusk) {
        document.documentElement.classList.toggle('is-dusk', dusk);
        last.dusk = dusk;
      }
    }

    parallax(sy) {
      if (!this.boxes) return;
      const vh = this.vh;
      this.visible.forEach((el) => {
        const b = this.boxes.get(el);
        if (!b) return;
        const rel = U.clamp((b.top + b.h / 2 - sy - vh / 2) / vh, -1.5, 1.5);
        if (el.classList.contains('gap')) {
          el.querySelectorAll('.gap__decade').forEach((d, i) => {
            d.style.translate = (i % 2 ? -1 : 1) * rel * 4 + 'vw 0';
          });
          return;
        }
        const media = el.firstElementChild && el.firstElementChild.nextElementSibling;
        const year = el.firstElementChild;
        if (media) media.style.translate = '0 ' + (rel * -36).toFixed(1) + 'px';
        // Keep desktop years inside the space above their cards as they move.
        if (year) year.style.translate = '0 ' + (rel * (window.innerWidth >= 900 ? 10 : 70)).toFixed(1) + 'px';
      });
    }

    clearParallax() {
      Array.from(this.root.querySelectorAll('.entry__media, .entry__year, .gap__decade')).forEach((el) => {
        el.style.translate = '';
      });
    }
  }

  SV.Story = Story;
})((window.SV = window.SV || {}));
