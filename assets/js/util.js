/* ==========================================================================
   South-View · shared helpers
   Plain browser script (no build step, no modules) so the site also works
   when index.html is opened straight from disk.
   ========================================================================== */
(function (SV) {
  'use strict';

  const U = {};

  U.clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  U.lerp = (a, b, t) => a + (b - a) * t;
  U.smooth01 = (t) => {
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return t * t * (3 - 2 * t);
  };
  U.smoothstep = (a, b, v) => U.smooth01((v - a) / (b - a));
  U.easeInOut = (t) => {
    t = U.clamp(t, 0, 1);
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  U.easeOut = (t) => 1 - Math.pow(1 - U.clamp(t, 0, 1), 3);

  /* Deterministic PRNG (mulberry32): the drawing is identical on every load
     and every resize, so the skyline never "re-rolls" its pencil marks. */
  U.rng = (seed) => {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  U.hash = (str) => {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

  /* Keyframed curve: keys = [[x, y], ...] sorted by x. Eased between keys
     unless `linear` is true. Used for every "value over the years" setting. */
  U.curve = (keys, linear) => (x) => {
    if (x <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      if (x <= keys[i][0]) {
        const k0 = keys[i - 1];
        const k1 = keys[i];
        let t = (x - k0[0]) / (k1[0] - k0[0]);
        if (!linear) t = U.smooth01(t);
        return k0[1] + (k1[1] - k0[1]) * t;
      }
    }
    return keys[keys.length - 1][1];
  };

  /* ---- colour ---- */
  U.hex = (h) => {
    if (Array.isArray(h)) return h;
    h = String(h).replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  U.mix = (a, b, t) => {
    a = U.hex(a);
    b = U.hex(b);
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  };
  U.rgba = (c, a) => {
    c = U.hex(c);
    const al = a == null ? 1 : Math.round(U.clamp(a, 0, 1) * 1000) / 1000;
    return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + al + ')';
  };
  /* amt < 0 darkens toward black, amt > 0 lightens toward white */
  U.shade = (c, amt) => (amt < 0 ? U.mix(c, [0, 0, 0], -amt) : U.mix(c, [255, 255, 255], amt));
  U.colorCurve = (keys) => (x) => {
    if (x <= keys[0][0]) return U.hex(keys[0][1]);
    for (let i = 1; i < keys.length; i++) {
      if (x <= keys[i][0]) {
        const t = U.smooth01((x - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]));
        return U.mix(keys[i - 1][1], keys[i][1], t);
      }
    }
    return U.hex(keys[keys.length - 1][1]);
  };

  U.canvas = (w, h) => {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w));
    c.height = Math.max(1, Math.ceil(h));
    return c;
  };

  U.query = (() => {
    const out = {};
    try {
      new URLSearchParams(window.location.search).forEach((v, k) => {
        out[k] = v;
      });
    } catch (e) {
      /* very old browsers: ignore */
    }
    return out;
  })();

  SV.util = U;
})((window.SV = window.SV || {}));
