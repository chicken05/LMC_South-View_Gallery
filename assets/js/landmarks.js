/* ==========================================================================
   South-View · the Atlanta skyline, building by building
   --------------------------------------------------------------------------
   The view looks NORTH from South-View Cemetery toward downtown Atlanta, so
   west (the Atlanta University Center, the stadiums) is on the left and east
   (Sweet Auburn, Cabbagetown) is on the right. Midtown sits farther back.

   Each landmark has the years it was under construction and (if it is gone)
   demolished, so the skyline genuinely changes over time:

     start  – construction begins (the building starts rising)
     built  – completed
     gone   – demolished (it fades out like an erased drawing)

   Units are roughly feet. `layer` sets depth: 'far' (Midtown, hazier),
   'city' (downtown), 'near' (the south edge of downtown, closest to us).
   Dates come from public records; where a date is approximate it is noted.
   To add a building: copy an entry, give it a unique id, and set its
   position, size, years and a draw() function built from the helpers below.
   ========================================================================== */
(function (SV) {
  'use strict';

  const U = SV.util;

  /* Watercolour pigments for the colour pass */
  const C = {
    brick: '#a65a3d',
    brickDark: '#7b4030',
    redBrick: '#9c4c37',
    buff: '#d2b58a',
    sand: '#d8c7a2',
    limestone: '#dcd2bd',
    marble: '#ebe6db',
    terracotta: '#d6b088',
    cream: '#e8dcc3',
    concrete: '#cdc6b8',
    concreteDark: '#9f988c',
    slate: '#5d646e',
    roof: '#6a5a50',
    tile: '#b0573a',
    tin: '#8e9294',
    gold: '#e0a92c',
    goldLight: '#f7d67e',
    goldDark: '#a97a18',
    copper: '#86a593',
    granitePink: '#c8998b',
    graniteRose: '#b27f72',
    graniteWarm: '#c7b49a',
    graniteDark: '#5d5258',
    glass: '#6f97bd',
    glassDark: '#3f5f86',
    glassTeal: '#5e979c',
    bronze: '#8c6b4b',
    bronzeDark: '#5b4633',
    white: '#f3f0e9',
    polaris: '#2f6fd0',
    steel: '#98a1a9',
    teal: '#6f9fa0',
  };
  const WHITE_PAPER = [247, 244, 237];

  /* ------------------------------------------------------------------------
     Drawing helpers (all coordinates in world units, y up from the ground)
     ------------------------------------------------------------------------ */
  const H = {};

  /** Front face with an optional shaded side face receding to the right. */
  H.box = (P, x0, y0, x1, y1, o) => {
    o = o || {};
    const col = o.color || C.concrete;
    if (o.side) {
      const s = o.side;
      const side = [
        [x1, y0],
        [x1 + s, y0],
        [x1 + s, y1 - (o.drop || 0)],
        [x1, y1],
      ];
      P.fill(side, o.sideColor || U.shade(col, -0.3), o.wash);
      P.hatch(side, { a: 0.42, gap: 2.6 });
      P.poly(side, { a: 0.6, w: 0.85, over: 1 });
    }
    const front = [
      [x0, y0],
      [x1, y0],
      [x1, y1],
      [x0, y1],
    ];
    P.fill(front, col, o.wash);
    if (o.shadeFront) P.hatch(front, { a: o.shadeFront, gap: 4.2, angle: 58, broken: 0.25 });
    P.poly(front, { a: o.lineA == null ? 0.9 : o.lineA, w: o.lineW || 1.05, over: o.over });
  };

  /**
   * A grid of windows on a face. Styles:
   *  'punched' – individual windows   'ribbon' – continuous floor bands
   *  'vstrip'  – vertical glass strips between stone piers
   * Level of detail drops automatically when windows get too small to draw.
   */
  H.grid = (P, x0, y0, x1, y1, o) => {
    const rows = Math.max(1, o.rows | 0);
    const cols = Math.max(1, o.cols | 0);
    const cw = (x1 - x0) / cols;
    const ch = (y1 - y0) / rows;
    const fw = o.fw || 0.5;
    const fh = o.fh || 0.56;
    const ww = cw * fw;
    const wh = ch * fh;
    const style = o.style || 'punched';
    const det = P.detail;
    const rects = [];

    if (style === 'vstrip') {
      for (let c = 0; c < cols; c++) rects.push([x0 + cw * (c + (1 - fw) / 2), y0, ww, y1 - y0]);
      if (P.pencil) {
        if (ww * det < 1.2) {
          const segs = rects.map((q) => [q[0] + q[2] / 2, y0, q[0] + q[2] / 2, y1]);
          P.lines(segs, { a: 0.3, w: 0.6, over: 0.3, jit: 0.2, passes: 1 });
        } else {
          P.marks(rects, { a: o.a == null ? 0.42 : o.a });
        }
        if (ch * det > 3.4) {
          const segs = [];
          for (let r = 1; r < rows; r++) segs.push([x0, y0 + ch * r, x1, y0 + ch * r]);
          P.lines(segs, { a: 0.12, w: 0.5, over: 0, jit: 0.15, passes: 1 });
        }
      } else if (P.color) {
        if (o.glass) P.tint(rects, o.glass, 0.7);
      } else if (o.lit !== 0) {
        const lit = [];
        const lr = o.lit == null ? 0.4 : o.lit;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (P.rand() < lr) lit.push([x0 + cw * (c + (1 - fw) / 2), y0 + ch * (r + 0.2), ww, ch * 0.6]);
          }
        }
        P.lights(lit, o.lightColors);
      }
      return;
    }

    const tooSmall = ch * det < 2.3 || cw * det < 1.9;
    if (P.pencil) {
      if (style === 'ribbon' || tooSmall) {
        const step = Math.max(1, Math.ceil(2.4 / Math.max(0.01, ch * det)));
        const segs = [];
        for (let r = 0; r < rows; r += step) {
          const y = y0 + ch * (r + (1 - fh) / 2);
          segs.push([x0 + cw * 0.12, y, x1 - cw * 0.12, y]);
          if (style === 'ribbon' && !tooSmall) segs.push([x0 + cw * 0.12, y + wh, x1 - cw * 0.12, y + wh]);
        }
        P.lines(segs, { a: style === 'ribbon' ? 0.42 : 0.3, w: 0.6, over: 0.4, jit: 0.25, passes: 1 });
        if (style === 'ribbon' && !tooSmall && ch * det > 4) {
          const bands = [];
          for (let r = 0; r < rows; r++) bands.push([x0 + cw * 0.12, y0 + ch * (r + (1 - fh) / 2), x1 - x0 - cw * 0.24, wh]);
          P.marks(bands, { a: 0.16 });
        }
        return;
      }
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) rects.push([x0 + cw * (c + (1 - fw) / 2), y0 + ch * (r + (1 - fh) / 2), ww, wh]);
      }
      P.marks(rects, { a: o.a == null ? 0.5 : o.a });
    } else if (P.color) {
      if (!o.glass) return;
      if (style === 'ribbon' || tooSmall) {
        for (let r = 0; r < rows; r++) rects.push([x0 + cw * 0.12, y0 + ch * (r + (1 - fh) / 2), x1 - x0 - cw * 0.24, wh]);
        P.tint(rects, o.glass, 0.55);
      } else {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) rects.push([x0 + cw * (c + (1 - fw) / 2), y0 + ch * (r + (1 - fh) / 2), ww, wh]);
        }
        P.tint(rects, o.glass, 0.72);
      }
    } else if (o.lit !== 0) {
      const lr = o.lit == null ? 0.4 : o.lit;
      for (let r = 0; r < rows; r++) {
        const rowLit = P.rand() < 0.25 ? 0.9 : lr; // whole office floors left on
        for (let c = 0; c < cols; c++) {
          if (P.rand() < rowLit) rects.push([x0 + cw * (c + (1 - fw) / 2), y0 + ch * (r + (1 - fh) / 2), ww, wh]);
        }
      }
      P.lights(rects, o.lightColors);
    }
  };

  H.cornice = (P, x0, x1, y, o) => {
    o = o || {};
    const ov = o.over == null ? 2.5 : o.over;
    const h = o.h || 3.5;
    const pts = [
      [x0 - ov, y],
      [x1 + ov, y],
      [x1 + ov, y + h],
      [x0 - ov, y + h],
    ];
    P.fill(pts, o.color || C.limestone);
    P.hatch(
      [
        [x0 - ov, y],
        [x1 + ov, y],
        [x1 + ov, y + h * 0.5],
        [x0 - ov, y + h * 0.5],
      ],
      { a: 0.45, gap: 1.8, angle: 80 }
    );
    P.poly(pts, { a: 0.85, w: 0.9, over: 1.5 });
  };

  H.gable = (P, x0, x1, y, h, o) => {
    o = o || {};
    const ov = o.over || 0;
    const mid = (x0 + x1) / 2;
    const pts = [
      [x0 - ov, y],
      [x1 + ov, y],
      [mid, y + h],
    ];
    P.fill(pts, o.color || C.roof, o.wash);
    if (o.hatch !== false) {
      P.hatch(
        [
          [mid, y + h],
          [x1 + ov, y],
          [mid, y],
        ],
        { a: 0.34, gap: 2.4 }
      );
    }
    P.poly(pts, { a: 0.85, w: 1, over: 1.6 });
  };

  /** Hipped roof (trapezoid) — or a pyramid when the inset meets in the middle. */
  H.hip = (P, x0, x1, y, h, inset, o) => {
    o = o || {};
    const mid = (x0 + x1) / 2;
    const pyramid = inset * 2 >= x1 - x0 - 0.01;
    const pts = pyramid
      ? [
          [x0, y],
          [x1, y],
          [mid, y + h],
        ]
      : [
          [x0, y],
          [x1, y],
          [x1 - inset, y + h],
          [x0 + inset, y + h],
        ];
    P.fill(pts, o.color || C.slate, o.wash);
    const right = pyramid
      ? [
          [mid, y],
          [x1, y],
          [mid, y + h],
        ]
      : [
          [mid, y],
          [x1, y],
          [x1 - inset, y + h],
          [mid, y + h],
        ];
    P.hatch(right, { a: 0.36, gap: 2.2 });
    P.poly(pts, { a: 0.88, w: 1, over: 1.4 });
    if (o.finial) P.line(mid, y + h, mid, y + h + o.finial, { a: 0.8, w: 0.7, over: 0 });
  };

  H.dome = (P, cx, y, rx, ry, o) => {
    o = o || {};
    const pts = P.arcPts(cx, y, rx, ry, 0, Math.PI, 30);
    P.fill(pts, o.color || C.marble, o.wash);
    const right = P.arcPts(cx, y, rx, ry, 0, Math.PI / 2, 14);
    right.push([cx, y]);
    P.hatch(right, { a: 0.3, gap: 2.2, angle: 72 });
    const ribs = o.ribs || 6;
    for (let k = 1; k < ribs; k++) {
      const u = -1 + (2 * k) / ribs;
      const rib = [];
      for (let i = 0; i <= 8; i++) {
        const t = ((Math.PI / 2) * i) / 8;
        rib.push([cx + u * rx * Math.cos(t), y + ry * Math.sin(t)]);
      }
      P.curve(rib, { a: 0.42, w: 0.65 });
    }
    P.curve(pts, { a: 0.9, w: 1.05 });
    P.line(cx - rx, y, cx + rx, y, { a: 0.8, w: 0.9 });
  };

  H.spire = (P, cx, y, w, h, o) => {
    o = o || {};
    const pts = [
      [cx - w / 2, y],
      [cx + w / 2, y],
      [cx, y + h],
    ];
    P.fill(pts, o.color || C.slate, o.wash);
    P.hatch(
      [
        [cx, y],
        [cx + w / 2, y],
        [cx, y + h],
      ],
      { a: 0.4, gap: 2 }
    );
    P.poly(pts, { a: 0.9, w: 0.95, over: 1.6 });
    if (o.finial !== false) P.line(cx, y + h, cx, y + h + (o.finial || 4), { a: 0.8, w: 0.7, over: 0 });
  };

  H.columns = (P, x0, x1, y0, y1, n, o) => {
    o = o || {};
    const step = (x1 - x0) / (n - 1);
    const cw = o.cw || step * 0.32;
    const segs = [];
    for (let i = 0; i < n; i++) {
      const x = x0 + step * i;
      segs.push([x - cw / 2, y0, x - cw / 2, y1], [x + cw / 2, y0, x + cw / 2, y1]);
    }
    if (P.pencil) {
      for (let i = 0; i < n - 1; i++) {
        const xa = x0 + step * i + cw / 2;
        const xb = x0 + step * (i + 1) - cw / 2;
        P.hatch(
          [
            [xa, y0],
            [xb, y0],
            [xb, y1],
            [xa, y1],
          ],
          { a: 0.3, gap: 2.1, angle: 76 }
        );
      }
    } else if (P.color && o.shadow !== false) {
      for (let i = 0; i < n - 1; i++) {
        const xa = x0 + step * i + cw / 2;
        const xb = x0 + step * (i + 1) - cw / 2;
        P.fillRect(xa, y0, xb - xa, y1 - y0, '#6e6a66', { a: 0.35, edge: false });
      }
    }
    P.lines(segs, { a: 0.7, w: 0.8, over: 0.8 });
  };

  /** Dark opening (doorway, arch, belfry) — hatched in pencil, deep tone in colour. */
  H.opening = (P, poly, o) => {
    o = o || {};
    if (P.pencil) {
      P.hatch(poly, { a: o.a || 0.55, gap: 1.6, angle: 70, cross: !!o.cross });
      P.poly(poly, { a: 0.6, w: 0.7, over: 0.5 });
    } else if (P.color) {
      P.fill(poly, o.color || '#4b4344', { a: 0.75, edge: false });
    }
  };

  H.archPoly = (P, cx, y, w, h) => {
    const r = w / 2;
    const pts = [
      [cx - r, y],
      [cx + r, y],
      [cx + r, y + h - r],
    ];
    P.arcPts(cx, y + h - r, r, r, 0, Math.PI, 8).forEach((q) => pts.push(q));
    pts.push([cx - r, y + h - r]);
    return pts;
  };

  H.arcade = (P, x0, x1, y, h, n, o) => {
    o = o || {};
    const step = (x1 - x0) / n;
    const w = step * (o.fw || 0.62);
    for (let i = 0; i < n; i++) {
      const cx = x0 + step * (i + 0.5);
      const poly = H.archPoly(P, cx, y, w, h);
      if (P.light) {
        if (o.lit && P.rand() < o.lit) P.lights([[cx - w / 2, y, w, h - w / 2]]);
      } else {
        H.opening(P, poly, o);
      }
    }
  };

  H.lancets = (P, x0, x1, y, h, n) => {
    const step = (x1 - x0) / n;
    const w = step * 0.5;
    for (let i = 0; i < n; i++) {
      const cx = x0 + step * (i + 0.5);
      const poly = [
        [cx - w / 2, y],
        [cx + w / 2, y],
        [cx + w / 2, y + h * 0.72],
        [cx, y + h],
        [cx - w / 2, y + h * 0.72],
      ];
      if (P.light) {
        if (P.rand() < 0.6) P.lightPoly(poly, '#ffcf7a', 0.75);
      } else {
        H.opening(P, poly, { color: '#58607a' });
      }
    }
  };

  H.circle = (P, cx, cy, r, color) => {
    const pts = P.arcPts(cx, cy, r, r, 0, Math.PI * 2, 16);
    P.fillCurve(pts, color || C.white);
    P.curve(pts, { a: 0.8, w: 0.75, closed: true });
  };

  H.clock = (P, cx, cy, r) => {
    H.circle(P, cx, cy, r, C.white);
    P.lines(
      [
        [cx, cy, cx, cy + r * 0.7],
        [cx, cy, cx + r * 0.5, cy],
      ],
      { a: 0.7, w: 0.6, over: 0 }
    );
  };

  H.flag = (P, x, y, h, o) => {
    o = o || {};
    P.line(x, y, x, y + h, { a: 0.8, w: 0.7, over: 0 });
    const f = [
      [x, y + h],
      [x + h * 0.5, y + h * 0.9],
      [x + h * 0.06, y + h * 0.72],
    ];
    P.fill(f, o.color || '#a8392d');
    P.poly(f, { a: 0.7, w: 0.6, over: 0 });
  };

  /** Steel truss (light towers, spires, cranes). Drawn as thin bars so it
      survives in both the pencil and the colour pass. */
  H.truss = (P, x0, y0, x1, y1, o) => {
    o = o || {};
    const col = o.color || C.steel;
    const n = Math.max(2, Math.round((y1 - y0) / Math.max(2, (x1 - x0) * 1.3)));
    const segs = [
      [x0, y0, x0, y1],
      [x1, y0, x1, y1],
    ];
    for (let i = 0; i < n; i++) {
      const ya = y0 + ((y1 - y0) * i) / n;
      const yb = y0 + ((y1 - y0) * (i + 1)) / n;
      segs.push(i % 2 ? [x0, ya, x1, yb] : [x1, ya, x0, yb]);
    }
    if (P.color) {
      const t = Math.max(P.wu(0.9), 0.8);
      for (const s of segs) {
        const dx = s[2] - s[0];
        const dy = s[3] - s[1];
        const L = Math.hypot(dx, dy) || 1;
        const nx = (-dy / L) * t;
        const ny = (dx / L) * t;
        P.fill(
          [
            [s[0] - nx, s[1] - ny],
            [s[2] - nx, s[3] - ny],
            [s[2] + nx, s[3] + ny],
            [s[0] + nx, s[1] + ny],
          ],
          col,
          { a: 0.9, edge: false, off: 0.3 }
        );
      }
    }
    P.lines(segs, { a: 0.7, w: 0.7, over: 0.5, jit: 0.25 });
  };

  /** Miss Freedom, the statue atop the Capitol dome since 1889. */
  H.statue = (P, x, y, h) => {
    const body = [
      [x - h * 0.13, y],
      [x + h * 0.13, y],
      [x + h * 0.06, y + h * 0.72],
      [x - h * 0.06, y + h * 0.72],
    ];
    P.fill(body, C.white);
    P.poly(body, { a: 0.8, w: 0.7, over: 0.5 });
    H.circle(P, x, y + h * 0.8, h * 0.075, C.white);
    P.lines(
      [
        [x + h * 0.05, y + h * 0.66, x + h * 0.17, y + h * 1.0],
        [x - h * 0.06, y + h * 0.6, x - h * 0.15, y + h * 0.38],
      ],
      { a: 0.8, w: 0.75, over: 0.4 }
    );
  };

  /** Classic early skyscraper: base, shaft, cornice. Shared by several. */
  H.tower = (P, o) => {
    const W = o.w / 2;
    H.box(P, -W, 0, W, o.h, { color: o.color, side: o.side == null ? 6 : o.side });
    if (o.base) {
      H.box(P, -W, 0, W, o.base, { color: o.baseColor || C.limestone, shadeFront: 0.08 });
      if (o.arches) H.arcade(P, -W + 4, W - 4, 2, o.base - 6, o.arches, { fw: 0.62 });
    }
    H.grid(P, -W + 4, (o.base || 0) + 4, W - 4, o.h - (o.top || 6), {
      rows: o.rows,
      cols: o.cols,
      fw: o.fw,
      fh: o.fh,
      glass: o.glass || C.glassDark,
      lit: o.lit == null ? 0.45 : o.lit,
      style: o.style,
    });
    if (o.cornice !== false) H.cornice(P, -W, W, o.h, { h: o.corniceH || 4.5, over: 3.2, color: o.corniceColor || o.color });
  };

  /** Glass curtain-wall shaft with mullions and floor lines. */
  H.curtain = (P, x0, y0, x1, y1, o) => {
    o = o || {};
    const face = [
      [x0, y0],
      [x1, y0],
      [x1, y1],
      [x0, y1],
    ];
    P.fill(face, o.color || C.glass, { grad: o.grad || [U.shade(o.color || C.glass, 0.25), U.shade(o.color || C.glass, -0.2)] });
    if (P.pencil) {
      const det = P.detail;
      const vstep = Math.max(o.mullion || 8, P.wu(4));
      const segs = [];
      for (let x = x0 + vstep; x < x1 - 0.5; x += vstep) segs.push([x, y0, x, y1]);
      P.lines(segs, { a: 0.22, w: 0.5, over: 0, jit: 0.15, passes: 1 });
      const fstep = Math.max(o.floor || 12, P.wu(det > 1 ? 3 : 4));
      const fl = [];
      for (let y = y0 + fstep; y < y1 - 0.5; y += fstep) fl.push([x0, y, x1, y]);
      P.lines(fl, { a: 0.15, w: 0.45, over: 0, jit: 0.15, passes: 1 });
      P.hatch(
        [
          [x0 + (x1 - x0) * 0.62, y0],
          [x1, y0],
          [x1, y1],
          [x0 + (x1 - x0) * 0.62, y1],
        ],
        { a: 0.22, gap: 3, angle: 64 }
      );
    }
    if (P.light && o.lit !== 0) {
      const rows = Math.round((y1 - y0) / (o.floor || 12));
      const cols = Math.max(2, Math.round((x1 - x0) / (o.mullion || 8)));
      H.grid(P, x0, y0, x1, y1, { rows, cols, fw: 0.82, fh: 0.6, lit: o.lit == null ? 0.38 : o.lit });
    }
    P.poly(face, { a: 0.85, w: 1, over: o.over });
  };

  /* ------------------------------------------------------------------------
     Landmarks
     ------------------------------------------------------------------------ */
  const list = [];
  const add = (d) => {
    d.seed = U.hash(d.id);
    d.kind = 'landmark';
    list.push(d);
    return d;
  };

  /* ---------- 19th century ---------- */

  add({
    id: 'union-depot',
    name: 'Union Depot train shed',
    layer: 'city',
    x: 178,
    z: 9,
    w: 300,
    h: 78,
    start: 1869.8,
    built: 1871.2,
    gone: 1930.4,
    draw(P) {
      const W = 140;
      H.box(P, -W, 0, W, 26, { color: C.brick });
      H.arcade(P, -W + 6, W - 6, 2, 20, 12, { lit: 0.5 });
      const roof = [];
      for (let i = 0; i <= 26; i++) {
        const t = i / 26;
        roof.push([-W + 2 * W * t, 26 + 48 * Math.pow(Math.sin(Math.PI * t), 0.75)]);
      }
      P.fill(roof, C.slate);
      P.hatch(roof.slice(13).concat([[0, 26]]), { a: 0.32, gap: 2.6 });
      const ribs = [];
      for (let k = 1; k < 12; k++) {
        const t = k / 12;
        ribs.push([-W + 2 * W * t, 26, -W + 2 * W * t, 26 + 48 * Math.pow(Math.sin(Math.PI * t), 0.75)]);
      }
      P.lines(ribs, { a: 0.4, w: 0.6, over: 0 });
      P.curve(roof, { a: 0.9, w: 1.05 });
      P.line(-W, 26, W, 26, { a: 0.8 });
    },
  });

  add({
    id: 'shrine',
    name: 'Shrine of the Immaculate Conception',
    layer: 'near',
    x: -128,
    z: 5,
    w: 96,
    h: 130,
    start: 1869.4,
    built: 1873.2,
    lights: true,
    draw(P) {
      H.box(P, -26, 0, 26, 46, { color: C.redBrick });
      H.gable(P, -28, 28, 46, 20, { color: C.slate });
      H.circle(P, 0, 36, 6.5, '#7d8fb3');
      H.lancets(P, -20, 20, 6, 22, 3);
      const tw = (cx, h, sp) => {
        H.box(P, cx - 10, 0, cx + 10, h, { color: C.redBrick });
        H.lancets(P, cx - 7, cx + 7, h - 20, 14, 1);
        H.spire(P, cx, h, 22, sp, { color: C.slate });
      };
      tw(-35, 70, 54);
      tw(35, 58, 40);
    },
  });

  add({
    id: 'fulton-bag-mill',
    name: 'Fulton Bag and Cotton Mill',
    layer: 'city',
    x: 1965,
    z: 6,
    w: 300,
    h: 208,
    start: 1880.2,
    built: 1881.6,
    smoke: { x: 118, y: 204, until: 1978 },
    draw(P) {
      H.box(P, -140, 0, 88, 60, { color: C.brick, side: 6 });
      H.grid(P, -136, 5, 84, 56, { rows: 4, cols: 22, fw: 0.52, glass: C.glassDark, lit: 0.3 });
      H.gable(P, -142, 96, 60, 15, { color: C.slate, over: 1 });
      H.box(P, -34, 60, -14, 88, { color: C.brick });
      H.hip(P, -36, -12, 88, 12, 12, { color: C.slate, finial: 3 });
      const st = [
        [108, 0],
        [128, 0],
        [123, 200],
        [113, 200],
      ];
      P.fill(st, C.brickDark);
      P.hatch(
        [
          [118, 0],
          [128, 0],
          [123, 200],
          [118, 200],
        ],
        { a: 0.4, gap: 2.2 }
      );
      P.poly(st, { a: 0.9, w: 1 });
      P.lines(
        [
          [111, 196, 125, 196],
          [112, 160, 124, 160],
        ],
        { a: 0.6, w: 0.7, over: 0.5 }
      );
    },
  });

  add({
    id: 'fountain-hall',
    name: 'Fountain Hall (Stone Hall), Atlanta University',
    layer: 'city',
    x: -1560,
    z: 5,
    w: 124,
    h: 134,
    start: 1880.6,
    built: 1882.4,
    draw(P) {
      H.box(P, -52, 0, 52, 48, { color: C.redBrick, side: 5 });
      H.grid(P, -48, 5, 48, 44, { rows: 3, cols: 10, glass: C.glassDark, lit: 0.45 });
      H.gable(P, -54, 54, 48, 15, { color: C.slate });
      H.box(P, -11, 48, 11, 104, { color: C.redBrick });
      H.clock(P, 0, 90, 6);
      H.arcade(P, -9, 9, 66, 14, 2);
      H.hip(P, -13, 13, 104, 24, 13, { color: C.slate, finial: 5 });
    },
  });

  add({
    id: 'kimball-house',
    name: 'Kimball House hotel',
    layer: 'city',
    x: 62,
    z: 7,
    w: 254,
    h: 152,
    start: 1883.8,
    built: 1885.3,
    gone: 1959.4,
    draw(P) {
      const W = 112;
      H.box(P, -W, 0, W, 98, { color: C.redBrick, side: 8 });
      P.lines(
        [
          [-W, 22, W, 22],
          [-W, 50, W, 50],
          [-W, 78, W, 78],
        ],
        { a: 0.4, w: 0.7, over: 1 }
      );
      H.grid(P, -W + 6, 4, W - 6, 94, { rows: 7, cols: 18, fw: 0.42, fh: 0.55, glass: C.glassDark, lit: 0.45 });
      H.cornice(P, -W, W, 98, { h: 4, color: C.sand });
      H.hip(P, -W - 2, W + 2, 102, 11, 6, { color: C.slate });
      for (const cx of [-70, -46, 46, 70]) H.gable(P, cx - 6, cx + 6, 104, 9, { color: C.slate, hatch: false });
      for (const cx of [-W + 16, W - 16]) {
        H.box(P, cx - 15, 98, cx + 15, 118, { color: C.redBrick });
        H.grid(P, cx - 12, 101, cx + 12, 115, { rows: 2, cols: 3, glass: C.glassDark });
        H.hip(P, cx - 17, cx + 17, 118, 18, 17, { color: C.slate });
        H.flag(P, cx, 136, 10);
      }
      H.box(P, -14, 98, 14, 128, { color: C.redBrick });
      H.grid(P, -11, 101, 11, 125, { rows: 3, cols: 3, glass: C.glassDark });
      H.hip(P, -16, 16, 128, 14, 16, { color: C.slate });
      H.flag(P, 0, 142, 9, { color: '#9a3b2e' });
    },
  });

  /* Georgia State Capitol: built 1884–1889 on the old city hall site. */
  add({
    id: 'capitol',
    name: 'Georgia State Capitol',
    layer: 'near',
    x: -330,
    z: 6,
    w: 402,
    h: 104,
    start: 1884.2,
    built: 1888.6,
    lights: true,
    draw(P) {
      for (const s of [-1, 1]) {
        const xa = s < 0 ? -190 : 62;
        const xb = s < 0 ? -62 : 190;
        H.box(P, xa, 0, xb, 74, { color: C.limestone });
        H.grid(P, xa + 6, 8, xb - 6, 70, { rows: 4, cols: 9, fw: 0.42, fh: 0.55, glass: C.glassDark, lit: 0.35 });
        H.cornice(P, xa, xb, 74, { h: 4 });
        H.box(P, xa + 3, 78, xb - 3, 84, { color: C.limestone, lineA: 0.7 });
        const end = s < 0 ? xa : xb - 26;
        H.box(P, end, 0, end + 26, 80, { color: C.limestone, lineA: 0.8 });
        H.gable(P, end - 1, end + 27, 80, 9, { color: C.limestone, hatch: false });
      }
      H.box(P, -62, 0, 62, 86, { color: C.limestone });
      H.grid(P, -58, 8, -42, 70, { rows: 4, cols: 1, glass: C.glassDark });
      H.grid(P, 42, 8, 58, 70, { rows: 4, cols: 1, glass: C.glassDark });
      H.box(P, -40, 0, 40, 22, { color: C.limestone, shadeFront: 0.12 });
      H.arcade(P, -36, 36, 2, 16, 5, { lit: 0.6 });
      H.columns(P, -34, 34, 22, 74, 6, { cw: 4.5 });
      H.cornice(P, -42, 42, 74, { h: 4 });
      H.gable(P, -44, 44, 78, 22, { color: C.limestone });
    },
  });

  const capitolDome = (P, metal, washOpt) => {
    H.box(P, -40, 0, 40, 46, { color: C.limestone });
    H.columns(P, -36, 36, 4, 42, 8, { cw: 3 });
    H.cornice(P, -42, 42, 46, { h: 3.5 });
    H.dome(P, 0, 50, 41, 56, { color: metal, ribs: 8, wash: washOpt });
    H.box(P, -8, 104, 8, 118, { color: C.limestone, lineA: 0.8 });
    H.dome(P, 0, 118, 9, 8, { color: metal, ribs: 3, wash: washOpt });
    H.statue(P, 0, 126, 24);
    P.glow(0, 78, 46, '#ffd98a', 0.32);
  };

  add({
    id: 'capitol-dome',
    name: 'Capitol dome (before gilding)',
    layer: 'near',
    x: -330,
    y: 86,
    z: 6.1,
    w: 96,
    h: 152,
    start: 1887.9,
    built: 1889.0,
    gone: 1958.9,
    lights: true,
    draw(P) {
      capitolDome(P, C.tin);
    },
  });

  /* 1958: the dome is gilded with gold from Dahlonega — the story's first
     vivid colour, so it ignores the era's muted palette (minColor). */
  add({
    id: 'capitol-dome-gold',
    name: 'Gold dome (gilded 1958)',
    layer: 'near',
    x: -330,
    y: 86,
    z: 6.2,
    w: 96,
    h: 152,
    start: 1957.6,
    built: 1958.5,
    minColor: 1,
    lights: true,
    crane: false,
    draw(P) {
      capitolDome(P, C.gold, { hgrad: [C.goldLight, C.gold, C.goldDark] });
    },
  });

  add({
    id: 'rockefeller-hall',
    name: 'Rockefeller Hall, Spelman College',
    layer: 'city',
    x: -1395,
    z: 5,
    w: 104,
    h: 86,
    start: 1885.2,
    built: 1886.6,
    draw(P) {
      H.box(P, -44, 0, 44, 50, { color: C.redBrick, side: 5 });
      H.grid(P, -40, 5, 40, 46, { rows: 3, cols: 9, glass: C.glassDark, lit: 0.45 });
      H.hip(P, -46, 46, 50, 14, 10, { color: C.slate });
      H.box(P, -9, 64, 9, 74, { color: C.cream });
      H.hip(P, -10, 10, 74, 10, 10, { color: C.slate, finial: 3 });
    },
  });

  add({
    id: 'graves-hall',
    name: 'Graves Hall, Morehouse College',
    layer: 'city',
    x: -1725,
    z: 5,
    w: 114,
    h: 102,
    start: 1888.2,
    built: 1889.6,
    draw(P) {
      H.box(P, -50, 0, 50, 56, { color: C.redBrick, side: 5 });
      H.grid(P, -46, 5, 46, 52, { rows: 4, cols: 10, glass: C.glassDark, lit: 0.45 });
      H.cornice(P, -50, 50, 56, { h: 3, color: C.sand });
      H.box(P, -14, 56, 14, 78, { color: C.redBrick });
      H.grid(P, -11, 60, 11, 74, { rows: 1, cols: 3, glass: C.glassDark });
      H.hip(P, -16, 16, 78, 18, 9, { color: C.slate });
      H.flag(P, 0, 96, 6);
    },
  });

  add({
    id: 'big-bethel',
    name: 'Big Bethel AME Church',
    layer: 'near',
    x: 1345,
    z: 6,
    w: 106,
    h: 158,
    start: 1889.8,
    built: 1891.4,
    lights: true,
    draw(P) {
      H.box(P, -48, 0, 20, 48, { color: '#9a8c80' });
      H.gable(P, -50, 22, 48, 18, { color: C.slate });
      H.lancets(P, -42, 14, 8, 26, 4);
      H.circle(P, -14, 40, 5, '#8b5f7d');
      H.box(P, 20, 0, 48, 98, { color: '#9a8c80' });
      H.arcade(P, 24, 44, 72, 18, 2);
      H.spire(P, 34, 98, 32, 54, { color: C.slate });
      // the "JESUS SAVES" neon on the steeple glows at dusk
      P.text('JESUS SAVES', 34, 92, { size: 4.6, vertical: false, pencil: false, light: '#ff3a2c', weight: 700 });
      P.glow(34, 93, 14, '#ff4a33', 0.35);
    },
  });

  add({
    id: 'grady-1892',
    name: 'Grady Hospital (1892)',
    layer: 'city',
    x: 1178,
    z: 6,
    w: 152,
    h: 94,
    start: 1890.6,
    built: 1892.3,
    draw(P) {
      H.box(P, -66, 0, 66, 50, { color: C.redBrick, side: 5 });
      H.grid(P, -62, 5, 62, 46, { rows: 3, cols: 13, glass: C.glassDark, lit: 0.5 });
      H.hip(P, -68, 68, 50, 12, 8, { color: C.slate });
      H.box(P, -12, 50, 12, 76, { color: C.redBrick });
      H.grid(P, -9, 54, 9, 72, { rows: 2, cols: 2, glass: C.glassDark });
      H.hip(P, -14, 14, 76, 16, 14, { color: C.slate, finial: 3 });
    },
  });

  add({
    id: 'equitable-1892',
    name: 'Equitable Building (1892)',
    layer: 'city',
    x: 238,
    z: 6,
    w: 112,
    h: 122,
    start: 1891.2,
    built: 1892.4,
    gone: 1971.5,
    draw(P) {
      H.box(P, -48, 0, 48, 112, { color: C.brickDark, side: 6 });
      H.box(P, -48, 0, 48, 24, { color: C.sand, shadeFront: 0.1 });
      H.arcade(P, -44, 44, 2, 18, 6, { fw: 0.6, lit: 0.6 });
      H.grid(P, -44, 28, 44, 98, { rows: 6, cols: 9, fw: 0.5, glass: C.glassDark, lit: 0.45 });
      H.arcade(P, -44, 44, 100, 10, 9, { fw: 0.5, lit: 0.4 });
      H.cornice(P, -48, 48, 112, { h: 5, over: 3.5, color: C.sand });
    },
  });

  add({
    id: 'flatiron',
    name: 'Flatiron (English-American) Building',
    layer: 'city',
    x: 332,
    z: 5,
    w: 60,
    h: 164,
    start: 1896.3,
    built: 1897.3,
    draw(P) {
      H.tower(P, { w: 44, h: 158, color: C.buff, base: 18, rows: 10, cols: 4, side: 5, corniceColor: C.limestone });
    },
  });

  /* ---------- early 20th century ---------- */

  add({
    id: 'empire-building',
    name: 'Empire Building',
    layer: 'city',
    x: 414,
    z: 4,
    w: 98,
    h: 192,
    start: 1900.1,
    built: 1901.4,
    draw(P) {
      H.box(P, -40, 0, 40, 184, { color: C.limestone, side: 6 });
      H.box(P, -40, 0, 40, 34, { color: C.sand });
      H.columns(P, -32, 32, 4, 30, 5, { cw: 4 });
      H.grid(P, -36, 38, 36, 166, { rows: 11, cols: 7, glass: C.glassDark, lit: 0.45 });
      H.cornice(P, -40, 40, 170, { h: 3 });
      H.grid(P, -36, 172, 36, 182, { rows: 1, cols: 7, glass: C.glassDark });
      H.cornice(P, -40, 40, 184, { h: 5, over: 3.5 });
    },
  });

  add({
    id: 'terminal-station',
    name: 'Terminal Station',
    layer: 'city',
    x: -560,
    z: 6,
    w: 292,
    h: 74,
    start: 1903.6,
    built: 1905.3,
    gone: 1972.4,
    draw(P) {
      H.box(P, -120, 0, 120, 52, { color: C.cream, side: 7 });
      H.arcade(P, -112, 112, 4, 30, 11, { fw: 0.6, lit: 0.5 });
      H.grid(P, -112, 36, 112, 49, { rows: 1, cols: 14, fh: 0.6, glass: C.glassDark });
      H.cornice(P, -120, 120, 52, { h: 3, color: C.terracotta });
      H.hip(P, -122, 122, 55, 14, 30, { color: C.tile });
    },
  });

  const terminalTowers = (P, h) => {
    for (const cx of [-128, 128]) {
      H.box(P, cx - 15, 0, cx + 15, h, { color: C.cream });
      H.grid(P, cx - 11, 8, cx + 11, h - 10, { rows: Math.round(h / 16), cols: 2, fw: 0.5, glass: C.glassDark });
      H.cornice(P, cx - 15, cx + 15, h, { h: 3, color: C.terracotta });
      H.box(P, cx - 11, h + 3, cx + 11, h + 17, { color: C.cream });
      H.arcade(P, cx - 10, cx + 10, h + 4, 11, 2);
      H.dome(P, cx, h + 17, 12, 13, { color: C.tile, ribs: 4 });
      P.line(cx, h + 30, cx, h + 36, { a: 0.8, w: 0.7, over: 0 });
    }
  };

  /* Terminal Station's towers were cut from eight storeys to five in 1940. */
  add({
    id: 'terminal-towers',
    name: 'Terminal Station towers',
    layer: 'city',
    x: -560,
    z: 6.1,
    w: 300,
    h: 150,
    start: 1904,
    built: 1905.3,
    gone: 1940.4,
    draw(P) {
      terminalTowers(P, 112);
    },
  });
  add({
    id: 'terminal-towers-1940',
    name: 'Terminal Station towers (shortened 1940)',
    layer: 'city',
    x: -560,
    z: 6.1,
    w: 300,
    h: 112,
    start: 1940.1,
    built: 1940.5,
    gone: 1972.4,
    reveal: 'fade',
    crane: false,
    draw(P) {
      terminalTowers(P, 74);
    },
  });

  add({
    id: 'candler-building',
    name: 'Candler Building',
    layer: 'city',
    x: 562,
    z: 4,
    w: 118,
    h: 212,
    start: 1904.6,
    built: 1906.4,
    draw(P) {
      H.box(P, -50, 0, 50, 200, { color: C.marble, side: 6 });
      H.box(P, -50, 0, 50, 30, { color: C.marble, shadeFront: 0.1 });
      H.arcade(P, -46, 46, 2, 24, 5, { fw: 0.65, lit: 0.5 });
      H.grid(P, -46, 34, 46, 182, { rows: 14, cols: 9, glass: C.glassDark, lit: 0.45 });
      H.cornice(P, -50, 50, 184, { h: 3 });
      H.arcade(P, -46, 46, 186, 10, 9, { fw: 0.45, lit: 0.4 });
      H.cornice(P, -50, 50, 200, { h: 6, over: 4.5, color: C.marble });
    },
  });

  add({
    id: 'odd-fellows',
    name: 'Odd Fellows Building',
    layer: 'city',
    x: 1478,
    z: 6,
    w: 122,
    h: 106,
    start: 1911.3,
    built: 1912.8,
    draw(P) {
      H.box(P, -52, 0, 52, 82, { color: C.brick, side: 5 });
      H.grid(P, -48, 6, 48, 78, { rows: 6, cols: 10, glass: C.glassDark, lit: 0.45 });
      H.cornice(P, -52, 52, 82, { h: 3, color: C.sand });
      for (const cx of [-40, 40]) {
        H.box(P, cx - 11, 82, cx + 11, 94, { color: C.brick });
        H.hip(P, cx - 12, cx + 12, 94, 10, 12, { color: C.slate, finial: 2 });
      }
    },
  });

  add({
    id: 'hurt-building',
    name: 'Hurt Building',
    layer: 'city',
    x: 772,
    z: 4,
    w: 160,
    h: 212,
    start: 1912,
    built: 1913.6,
    draw(P) {
      H.box(P, -50, 0, 72, 200, { color: C.terracotta, side: 6 });
      H.grid(P, -46, 8, 68, 194, { rows: 14, cols: 11, glass: C.glassDark, lit: 0.45 });
      H.box(P, -76, 0, -50, 204, { color: C.terracotta, shadeFront: 0.14 });
      H.grid(P, -73, 8, -53, 196, { rows: 14, cols: 2, glass: C.glassDark, lit: 0.45 });
      H.cornice(P, -76, 72, 200, { h: 4, color: C.terracotta });
    },
  });

  add({
    id: 'ebenezer',
    name: 'Ebenezer Baptist Church',
    layer: 'near',
    x: 1705,
    z: 6,
    w: 104,
    h: 88,
    start: 1914.2,
    built: 1922.4,
    lights: true,
    draw(P) {
      H.box(P, -14, 0, 46, 44, { color: C.redBrick });
      H.gable(P, -16, 48, 44, 20, { color: C.slate });
      H.lancets(P, -8, 42, 6, 26, 3);
      H.circle(P, 16, 52, 4.5, '#8d6aa0');
      H.box(P, -44, 0, -14, 72, { color: C.redBrick });
      const crenels = [];
      for (let i = 0; i < 4; i++) crenels.push([-44 + i * 8.5, 72, -40 + i * 8.5, 78]);
      crenels.forEach((q) => H.box(P, q[0], q[1], q[2], q[3], { color: C.redBrick, lineA: 0.75 }));
      H.lancets(P, -38, -20, 46, 18, 2);
      H.opening(P, H.archPoly(P, -29, 0, 9, 16), {});
      // Ebenezer's vertical neon sign
      P.text('EBENEZER', -2, 62, { size: 3.6, vertical: true, pencil: false, light: '#ff3b30', weight: 700 });
      P.glow(-2, 50, 16, '#ff4130', 0.3);
    },
  });

  add({
    id: 'sears-ponce',
    name: 'Sears, Roebuck & Co. building (Ponce City Market)',
    layer: 'far',
    x: 1995,
    z: 3,
    w: 334,
    h: 246,
    start: 1925.2,
    built: 1926.6,
    draw(P) {
      H.box(P, -150, 0, 150, 128, { color: C.brick, side: 7 });
      H.grid(P, -146, 6, 146, 124, { rows: 9, cols: 30, glass: C.glassDark, lit: 0.45 });
      H.box(P, -26, 128, 26, 208, { color: C.brick, side: 4 });
      H.grid(P, -22, 132, 22, 204, { rows: 6, cols: 4, glass: C.glassDark, lit: 0.5 });
      H.hip(P, -28, 28, 208, 30, 28, { color: C.slate, finial: 6 });
    },
  });

  add({
    id: 'rhodes-haverty',
    name: 'Rhodes-Haverty Building',
    layer: 'city',
    x: 298,
    z: 3,
    w: 88,
    h: 250,
    start: 1928,
    built: 1929.5,
    draw(P) {
      H.box(P, -36, 0, 36, 222, { color: C.brick, side: 6 });
      H.grid(P, -32, 6, 32, 214, { rows: 19, cols: 7, glass: C.glassDark, lit: 0.45 });
      H.box(P, -26, 222, 26, 236, { color: C.brick, side: 4 });
      H.grid(P, -22, 225, 22, 233, { rows: 1, cols: 5, glass: C.glassDark });
      H.box(P, -14, 236, 14, 247, { color: C.sand });
      P.lines(
        [
          [-14, 247, -14, 250],
          [14, 247, 14, 250],
        ],
        { a: 0.6, w: 0.6, over: 0 }
      );
    },
  });

  add({
    id: 'city-hall',
    name: 'Atlanta City Hall',
    layer: 'near',
    x: -10,
    z: 7,
    w: 172,
    h: 214,
    start: 1928.7,
    built: 1930.4,
    lights: true,
    draw(P) {
      H.box(P, -78, 0, 78, 54, { color: C.cream, side: 6 });
      H.grid(P, -72, 6, 72, 50, { rows: 4, cols: 16, fw: 0.4, glass: C.glassDark, lit: 0.4 });
      H.box(P, -36, 54, 36, 150, { color: C.cream, side: 5 });
      H.grid(P, -32, 58, 32, 146, { rows: 9, cols: 7, fw: 0.38, fh: 0.6, glass: C.glassDark, lit: 0.45 });
      H.box(P, -28, 150, 28, 172, { color: C.cream, side: 4 });
      H.grid(P, -24, 153, 24, 169, { rows: 2, cols: 5, glass: C.glassDark, lit: 0.5 });
      H.box(P, -19, 172, 19, 188, { color: C.cream, side: 3 });
      for (const x of [-16, -6, 6, 16]) H.spire(P, x, 188, 5, 13, { color: C.cream, finial: 2 });
      H.spire(P, 0, 188, 10, 22, { color: C.cream });
    },
  });

  add({
    id: 'union-station',
    name: 'Union Station (1930)',
    layer: 'city',
    x: 178,
    z: 9,
    w: 232,
    h: 60,
    start: 1929.4,
    built: 1930.6,
    gone: 1972.3,
    draw(P) {
      H.box(P, -105, 0, 105, 40, { color: C.brick, side: 6 });
      H.cornice(P, -105, 105, 40, { h: 3, color: C.limestone });
      H.grid(P, -100, 6, -46, 36, { rows: 2, cols: 6, glass: C.glassDark, lit: 0.5 });
      H.grid(P, 46, 6, 100, 36, { rows: 2, cols: 6, glass: C.glassDark, lit: 0.5 });
      H.box(P, -40, 0, 40, 52, { color: C.limestone });
      H.columns(P, -32, 32, 6, 44, 6, { cw: 3.5 });
      H.cornice(P, -42, 42, 52, { h: 3 });
    },
  });

  add({
    id: 'prince-hall',
    name: 'Prince Hall Masonic Temple',
    layer: 'city',
    x: 1566,
    z: 6.5,
    w: 92,
    h: 64,
    start: 1939.6,
    built: 1941.2,
    draw(P) {
      H.box(P, -40, 0, 40, 58, { color: C.buff, side: 5 });
      H.grid(P, -36, 6, 36, 54, { rows: 4, cols: 8, glass: C.glassDark, lit: 0.45 });
      H.cornice(P, -40, 40, 58, { h: 3, color: C.sand });
    },
  });

  /* ---------- mid-century ---------- */

  add({
    id: 'grady-1958',
    name: 'Grady Memorial Hospital (1958)',
    layer: 'city',
    x: 1262,
    z: 5,
    w: 292,
    h: 214,
    start: 1955.6,
    built: 1958.4,
    draw(P) {
      H.box(P, -36, 0, 36, 120, { color: C.buff });
      H.grid(P, -32, 6, 32, 116, { rows: 9, cols: 6, glass: C.glassDark, lit: 0.45 });
      for (const s of [-1, 1]) {
        const xa = s < 0 ? -136 : 36;
        H.box(P, xa, 0, xa + 100, 206, { color: C.buff, side: s > 0 ? 5 : 0 });
        H.grid(P, xa + 4, 6, xa + 96, 200, { rows: 16, cols: 12, fw: 0.55, glass: C.glassDark, lit: 0.5 });
      }
      H.box(P, -20, 206, 20, 214, { color: C.concrete });
    },
  });

  add({
    id: 'fulton-national-bank',
    name: 'Fulton National Bank Building',
    layer: 'city',
    x: 642,
    z: 3,
    w: 122,
    h: 300,
    start: 1956.4,
    built: 1958.2,
    draw(P) {
      H.box(P, -52, 0, 52, 292, { color: C.marble, side: 6 });
      H.grid(P, -48, 10, 48, 286, { rows: 24, cols: 12, fw: 0.72, fh: 0.62, glass: C.glassTeal, lit: 0.5 });
      H.box(P, -30, 292, 30, 300, { color: C.marble });
    },
  });

  add({
    id: 'one-park-tower',
    name: 'One Park Tower',
    layer: 'city',
    x: 884,
    z: 2.5,
    w: 106,
    h: 446,
    start: 1959.6,
    built: 1961.3,
    draw(P) {
      H.box(P, -44, 0, 44, 436, { color: C.concreteDark, side: 6 });
      H.grid(P, -40, 8, 40, 430, { rows: 32, cols: 10, fw: 0.72, fh: 0.7, glass: C.glassDark, lit: 0.5, style: 'ribbon' });
      H.box(P, -24, 436, 24, 446, { color: C.concrete });
    },
  });

  add({
    id: 'fulton-county-stadium',
    name: 'Atlanta–Fulton County Stadium',
    layer: 'near',
    x: 160,
    z: 8,
    w: 524,
    h: 158,
    start: 1964.1,
    built: 1965.3,
    gone: 1997.6,
    lights: true,
    draw(P) {
      const bowl = [
        [-244, 0],
        [244, 0],
        [240, 70],
        [226, 86],
        [-226, 86],
        [-240, 70],
      ];
      P.fill(bowl, C.concrete);
      P.hatch(
        [
          [100, 0],
          [244, 0],
          [240, 70],
          [226, 86],
          [100, 86],
        ],
        { a: 0.26, gap: 3 }
      );
      const ribs = [];
      for (let x = -230; x <= 230; x += 18) ribs.push([x, 2, x, 82]);
      P.lines(ribs, { a: 0.35, w: 0.6, over: 0 });
      P.lines(
        [
          [-240, 30, 240, 30],
          [-238, 56, 238, 56],
        ],
        { a: 0.5, w: 0.7, over: 1 }
      );
      if (P.color) {
        P.fillRect(-236, 58, 472, 10, '#3e6fa8', { a: 0.75, edge: false });
      }
      P.poly(bowl, { a: 0.9, w: 1.05 });
      for (const x of [-196, -76, 76, 196]) {
        H.truss(P, x - 3, 86, x + 3, 146);
        P.fillRect(x - 11, 146, 22, 10, C.steel);
        P.rect(x - 11, 146, 22, 10, { a: 0.8, w: 0.7, over: 0.5 });
        P.lightPoly(
          [
            [x - 11, 146],
            [x + 11, 146],
            [x + 11, 156],
            [x - 11, 156],
          ],
          '#fff6dc',
          0.95
        );
        P.glow(x, 151, 26, '#fff2c8', 0.45);
      }
    },
  });

  add({
    id: 'state-of-georgia-building',
    name: 'State of Georgia Building (First National Bank, 1966)',
    layer: 'city',
    x: 14,
    z: 4,
    w: 152,
    h: 562,
    start: 1964.6,
    built: 1966.8,
    draw(P) {
      H.box(P, -66, 0, 66, 552, { color: C.marble, side: 7 });
      H.grid(P, -62, 6, 62, 546, { rows: 44, cols: 11, fw: 0.42, style: 'vstrip', glass: C.glassDark, lit: 0.45 });
      H.box(P, -60, 552, 60, 562, { color: C.marble });
    },
  });

  add({
    id: 'hyatt-regency',
    name: 'Hyatt Regency Atlanta',
    layer: 'city',
    x: 1002,
    z: 3,
    w: 160,
    h: 244,
    start: 1965.6,
    built: 1967.2,
    draw(P) {
      H.box(P, -66, 0, 66, 226, { color: C.concrete, side: 7 });
      H.grid(P, -62, 8, 62, 222, { rows: 22, cols: 14, fw: 0.7, fh: 0.45, style: 'ribbon', glass: C.glassDark, lit: 0.55 });
      H.box(P, -18, 226, 18, 244, { color: C.concrete });
      H.grid(P, -16, 229, 16, 241, { rows: 1, cols: 6, glass: C.glassDark, lit: 0.9 });
    },
  });

  /* Polaris, the blue saucer on the Hyatt (1967): a second vivid accent. */
  add({
    id: 'polaris',
    name: 'Polaris revolving restaurant',
    layer: 'city',
    x: 1002,
    y: 244,
    z: 3.1,
    w: 80,
    h: 42,
    start: 1966.9,
    built: 1967.5,
    minColor: 0.85,
    lights: true,
    crane: false,
    draw(P) {
      H.dome(P, 0, 0, 34, 30, { color: C.polaris, ribs: 7, wash: { hgrad: ['#5d97ec', C.polaris, '#1e4c96'] } });
      P.line(0, 30, 0, 40, { a: 0.8, w: 0.7, over: 0 });
      P.glow(0, 12, 46, '#3f86ff', 0.55);
      P.glow(0, 40, 4, '#ff3b30', 0.95);
    },
  });

  /* ---------- 1970s–present ---------- */

  add({
    id: 'westin-peachtree-plaza',
    name: 'Westin Peachtree Plaza',
    layer: 'city',
    x: 364,
    z: 2,
    w: 134,
    h: 744,
    start: 1973.6,
    built: 1976.2,
    paper: WHITE_PAPER,
    inkA: 0.82,
    draw(P) {
      const r = 56;
      const top = 690;
      const body = [
        [-r, 0],
        [r, 0],
        [r, top],
        [-r, top],
      ];
      P.fill(body, C.bronze, { hgrad: ['#c39b70', C.bronze, C.bronzeDark, '#3d2e21'] });
      if (P.pencil) {
        const segs = [];
        for (let k = 1; k < 18; k++) {
          const u = -Math.cos((Math.PI * k) / 18);
          segs.push([r * u, 0, r * u, top]);
        }
        P.lines(segs, { a: 0.18, w: 0.5, over: 0, jit: 0.2, passes: 1 });
        P.hatch(
          [
            [r * 0.35, 0],
            [r, 0],
            [r, top],
            [r * 0.35, top],
          ],
          { a: 0.26, gap: 2.4, angle: 80 }
        );
      }
      H.grid(P, -r + 3, 8, r - 3, top - 6, { rows: 68, cols: 14, fw: 0.84, fh: 0.5, style: 'ribbon', glass: '#3b2c20', lit: 0.4 });
      P.lines(
        [
          [-r, 0, -r, top],
          [r, 0, r, top],
        ],
        { a: 0.85, w: 1, over: 1.5 }
      );
      P.arc(0, top, r, 5, Math.PI, Math.PI * 2, { a: 0.7, w: 0.9 });
      const ring = [
        [-r - 5, top],
        [r + 5, top],
        [r + 5, top + 22],
        [-r - 5, top + 22],
      ];
      P.fill(ring, C.bronzeDark);
      H.grid(P, -r - 3, top + 4, r + 3, top + 18, { rows: 1, cols: 16, fw: 0.8, fh: 0.7, glass: '#2f2419', lit: 0.95 });
      P.poly(ring, { a: 0.85, w: 0.95 });
      H.box(P, -r + 8, top + 22, r - 8, top + 30, { color: C.concrete });
      P.line(0, top + 30, 0, top + 54, { a: 0.8, w: 0.8, over: 0 });
      P.glow(0, top + 54, 4, '#ff3b30', 0.95);
    },
  });

  add({
    id: 'russell-federal-building',
    name: 'Richard B. Russell Federal Building',
    layer: 'city',
    x: -600,
    z: 4,
    w: 162,
    h: 390,
    start: 1976.6,
    built: 1979.2,
    paper: WHITE_PAPER,
    inkA: 0.85,
    draw(P) {
      H.box(P, -70, 0, 70, 380, { color: C.concrete, side: 7 });
      H.grid(P, -66, 8, 66, 374, { rows: 26, cols: 14, fw: 0.5, fh: 0.5, glass: C.glassDark, lit: 0.4 });
      H.box(P, -40, 380, 40, 390, { color: C.concrete });
    },
  });

  add({
    id: 'atlanta-life',
    name: 'Atlanta Life Insurance Company headquarters (Herndon Plaza)',
    layer: 'city',
    x: 1405,
    z: 5,
    w: 122,
    h: 176,
    start: 1978.6,
    built: 1980.4,
    paper: WHITE_PAPER,
    inkA: 0.85,
    draw(P) {
      H.box(P, -52, 0, 52, 168, { color: '#b8a38d', side: 6 });
      H.grid(P, -48, 8, 48, 162, { rows: 13, cols: 8, fw: 0.7, style: 'ribbon', glass: C.glassDark, lit: 0.5 });
      H.box(P, -30, 168, 30, 176, { color: C.concrete });
    },
  });

  add({
    id: 'georgia-pacific',
    name: 'Georgia-Pacific Tower',
    layer: 'city',
    x: 704,
    z: 2.2,
    w: 162,
    h: 700,
    start: 1979.4,
    built: 1981.8,
    paper: WHITE_PAPER,
    inkA: 0.82,
    draw(P) {
      const pts = [
        [-70, 0],
        [70, 0],
      ];
      let x = 70;
      const steps = 9;
      for (let i = 0; i < steps; i++) {
        const y = 320 + ((697 - 320) * i) / steps;
        pts.push([x, y]);
        x -= 11;
        pts.push([x, y]);
      }
      pts.push([x, 697], [-70, 697]);
      P.fill(pts, C.granitePink, { grad: [U.shade(C.granitePink, 0.12), U.shade(C.granitePink, -0.12)] });
      const colsN = 12;
      const slots = [];
      for (let c = 0; c < colsN; c++) {
        const cx = -64 + (128 * (c + 0.5)) / colsN;
        let topY = 690;
        for (let i = 0; i < steps; i++) {
          const edge = 70 - 11 * (i + 1);
          if (cx > edge - 3) {
            topY = 320 + ((697 - 320) * i) / steps - 6;
            break;
          }
        }
        slots.push([cx - 3, 8, 6, topY - 8]);
      }
      if (P.pencil) P.marks(slots, { a: 0.4 });
      if (P.color) P.tint(slots, '#5a4246', 0.65);
      if (P.light) {
        const lit = [];
        for (const q of slots) {
          for (let y = q[1]; y < q[1] + q[3] - 8; y += 13) if (P.rand() < 0.4) lit.push([q[0], y, q[2], 6]);
        }
        P.lights(lit);
      }
      const stepSegs = [];
      x = 70;
      for (let i = 0; i < steps; i++) {
        const y = 320 + ((697 - 320) * i) / steps;
        stepSegs.push([x - 11, y, x - 11, y - 12]);
        x -= 11;
      }
      P.lines(stepSegs, { a: 0.4, w: 0.6, over: 0 });
      P.poly(pts, { a: 0.88, w: 1.05 });
    },
  });

  add({
    id: 'marriott-marquis',
    name: 'Atlanta Marriott Marquis',
    layer: 'city',
    x: 1124,
    z: 2,
    w: 204,
    h: 560,
    start: 1982.6,
    built: 1985.4,
    paper: WHITE_PAPER,
    inkA: 0.82,
    draw(P) {
      const half = (y) => 72 + 26 * Math.sin(Math.PI * Math.min(1, y / 600)) - (y / 554) * 16;
      const left = [];
      const right = [];
      for (let i = 0; i <= 24; i++) {
        const y = (554 * i) / 24;
        left.push([-half(y), y]);
        right.push([half(y), y]);
      }
      const shape = right.concat(left.slice().reverse());
      P.fill(shape, C.white, { hgrad: ['#f5f2ea', '#e2ddd2', '#b9b3a8'] });
      if (P.pencil) {
        const bands = [];
        for (let y = 10; y < 550; y += 11) bands.push([-half(y) + 2, y, half(y) - 2, y]);
        P.lines(bands, { a: 0.24, w: 0.55, over: 0, jit: 0.2, passes: 1 });
        P.hatch(right.concat([[40, 554], [40, 0]]), { a: 0.25, gap: 2.8 });
      }
      if (P.light) {
        const lit = [];
        for (let y = 12; y < 550; y += 11) {
          const hw = half(y) - 4;
          for (let x = -hw; x < hw - 4; x += 7) if (P.rand() < 0.35) lit.push([x, y, 4.5, 4]);
        }
        P.lights(lit);
      }
      P.curve(right, { a: 0.85, w: 1 });
      P.curve(left, { a: 0.85, w: 1 });
      P.line(-half(554), 554, half(554), 554, { a: 0.8 });
    },
  });

  add({
    id: 'one-atlantic-center',
    name: 'One Atlantic Center (IBM Tower)',
    layer: 'far',
    x: 1262,
    z: 1.5,
    w: 142,
    h: 826,
    start: 1985.2,
    built: 1987.4,
    paper: WHITE_PAPER,
    inkA: 0.82,
    draw(P) {
      H.box(P, -58, 0, 58, 690, { color: '#c6a58d', side: 7 });
      H.grid(P, -54, 8, 54, 684, { rows: 46, cols: 8, fw: 0.4, style: 'vstrip', glass: '#5d4e52', lit: 0.4 });
      H.box(P, -50, 690, 50, 722, { color: '#c6a58d', side: 5 });
      for (const cx of [-50, 50]) H.spire(P, cx, 722, 10, 34, { color: '#c6a58d', finial: 4 });
      H.gable(P, -30, 30, 722, 26, { color: '#c6a58d', hatch: false });
      H.hip(P, -46, 46, 722, 88, 46, { color: C.copper });
      P.line(0, 810, 0, 826, { a: 0.8, w: 0.7, over: 0 });
      P.glow(0, 760, 46, '#ffe6b0', 0.45);
    },
  });

  add({
    id: 'promenade-ii',
    name: 'Promenade II',
    layer: 'far',
    x: 1470,
    z: 1.6,
    w: 132,
    h: 696,
    start: 1988,
    built: 1990.2,
    paper: WHITE_PAPER,
    inkA: 0.82,
    draw(P) {
      H.box(P, -54, 0, 54, 600, { color: '#cbbfa8', side: 6 });
      H.grid(P, -50, 8, 50, 594, { rows: 42, cols: 9, fw: 0.45, style: 'vstrip', glass: C.glassDark, lit: 0.4 });
      const st = [[-54, 600]];
      let x = -54;
      for (let i = 0; i < 6; i++) {
        st.push([x, 600 + i * 14 + 14]);
        x += 9;
        st.push([x, 600 + i * 14 + 14]);
      }
      st.push([0, 690]);
      const right = st.map((q) => [-q[0], q[1]]).reverse();
      const shape = st.concat(right);
      P.fill(shape, '#cbbfa8');
      P.hatch(shape.filter((q) => q[0] >= 0).concat([[0, 600]]), { a: 0.3, gap: 2.4 });
      P.poly(shape, { a: 0.85, w: 0.95 });
      P.line(0, 690, 0, 696, { a: 0.8, w: 0.7, over: 0 });
      P.glow(0, 650, 34, '#dfe8ff', 0.4);
    },
  });

  add({
    id: '191-peachtree',
    name: '191 Peachtree Tower',
    layer: 'city',
    x: 502,
    z: 1.8,
    w: 162,
    h: 774,
    start: 1988.2,
    built: 1990.9,
    paper: WHITE_PAPER,
    inkA: 0.82,
    draw(P) {
      H.box(P, -70, 0, 70, 690, { color: C.graniteWarm, side: 7 });
      H.grid(P, -66, 8, 66, 684, { rows: 48, cols: 10, fw: 0.44, style: 'vstrip', glass: '#4f5a6a', lit: 0.42 });
      for (const cx of [-46, 46]) {
        H.box(P, cx - 22, 690, cx + 22, 728, { color: C.graniteWarm });
        H.columns(P, cx - 16, cx + 16, 694, 724, 4, { cw: 3 });
        H.hip(P, cx - 25, cx + 25, 728, 38, 25, { color: C.graniteWarm, finial: 6 });
        P.glow(cx, 712, 26, '#ffe2a6', 0.5);
      }
    },
  });

  add({
    id: 'truist-plaza',
    name: 'Truist Plaza (SunTrust Plaza)',
    layer: 'city',
    x: 924,
    z: 1.6,
    w: 152,
    h: 874,
    start: 1989.6,
    built: 1992.3,
    paper: WHITE_PAPER,
    inkA: 0.82,
    draw(P) {
      const W = 64;
      const ch = 14;
      const dark = '#6b5b62';
      const chamfer = (x0, x1, y0, y1, shade) => {
        H.box(P, x0, y0, x1, y1, { color: U.shade(dark, shade), lineA: 0.75 });
        if (shade < 0) P.hatch([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], { a: 0.3, gap: 2.4 });
      };
      chamfer(-W, -W + ch, 0, 800, 0.12);
      chamfer(W - ch, W, 0, 800, -0.22);
      H.box(P, -W + ch, 0, W - ch, 806, { color: dark });
      H.grid(P, -W + ch + 3, 8, W - ch - 3, 796, { rows: 56, cols: 8, fw: 0.5, style: 'vstrip', glass: '#2e3446', lit: 0.4 });
      H.box(P, -54, 806, 54, 832, { color: dark, side: 4 });
      H.box(P, -40, 832, 40, 852, { color: dark, side: 3 });
      H.hip(P, -32, 32, 852, 22, 32, { color: '#8d7d82' });
      P.glow(0, 842, 48, '#fff3d4', 0.55);
      P.lightPoly(
        [
          [-32, 852],
          [32, 852],
          [0, 874],
        ],
        '#fff0c8',
        0.7
      );
    },
  });

  add({
    id: 'bank-of-america-plaza',
    name: 'Bank of America Plaza',
    layer: 'far',
    x: 762,
    z: 2,
    w: 162,
    h: 1028,
    start: 1990.4,
    built: 1992.4,
    paper: WHITE_PAPER,
    inkA: 0.82,
    draw(P) {
      const W = 64;
      const stone = '#c69b88';
      H.box(P, -W, 0, W, 760, { color: stone, side: 8 });
      H.grid(P, -W + 4, 8, W - 4, 754, { rows: 52, cols: 9, fw: 0.44, style: 'vstrip', glass: '#4f4652', lit: 0.4 });
      H.box(P, -54, 760, 54, 800, { color: stone, side: 6 });
      H.grid(P, -50, 764, 50, 796, { rows: 3, cols: 7, fw: 0.44, style: 'vstrip', glass: '#4f4652' });
      H.box(P, -44, 800, 44, 836, { color: stone, side: 5 });
      const apex = 948;
      const bars = [
        [-40, 836, 0, apex],
        [40, 836, 0, apex],
        [-26, 836, 0, apex],
        [26, 836, 0, apex],
        [-30, 866, 30, 866],
        [-20, 896, 20, 896],
        [-11, 922, 11, 922],
      ];
      if (P.color) {
        for (const s of bars) {
          const t = 1.3;
          const dx = s[2] - s[0];
          const dy = s[3] - s[1];
          const L = Math.hypot(dx, dy) || 1;
          const nx = (-dy / L) * t;
          const ny = (dx / L) * t;
          P.fill(
            [
              [s[0] - nx, s[1] - ny],
              [s[2] - nx, s[3] - ny],
              [s[2] + nx, s[3] + ny],
              [s[0] + nx, s[1] + ny],
            ],
            C.gold,
            { a: 0.95, edge: false, off: 0.2 }
          );
        }
      }
      P.lines(bars, { a: 0.78, w: 0.75, over: 0.4 });
      const ob = [
        [-7, apex - 24],
        [7, apex - 24],
        [0, 1026],
      ];
      P.fill(ob, C.gold, { hgrad: [C.goldLight, C.gold, C.goldDark] });
      P.poly(ob, { a: 0.85, w: 0.85, over: 0.6 });
      P.glow(0, 930, 70, '#ffcf5a', 0.55);
      P.lightPoly(ob, '#ffd76a', 0.85);
    },
  });

  add({
    id: 'georgia-dome',
    name: 'Georgia Dome',
    layer: 'city',
    x: -1062,
    z: 5,
    w: 644,
    h: 198,
    start: 1989.6,
    built: 1992.6,
    gone: 2017.9,
    paper: WHITE_PAPER,
    inkA: 0.85,
    lights: true,
    draw(P) {
      const walls = [
        [-302, 0],
        [302, 0],
        [290, 96],
        [-290, 96],
      ];
      P.fill(walls, C.teal, { grad: ['#86b1ad', '#5c8a88'] });
      P.lines(
        [
          [-298, 34, 298, 34],
          [-294, 66, 294, 66],
        ],
        { a: 0.45, w: 0.7, over: 1 }
      );
      H.grid(P, -284, 40, 284, 62, { rows: 1, cols: 40, fw: 0.6, glass: C.glassDark, lit: 0.6 });
      P.hatch(
        [
          [140, 0],
          [302, 0],
          [290, 96],
          [140, 96],
        ],
        { a: 0.24, gap: 3 }
      );
      P.poly(walls, { a: 0.9, w: 1.05 });
      const roof = [];
      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        roof.push([-290 + 580 * t, 96 + 96 * Math.pow(Math.sin(Math.PI * t), 0.55)]);
      }
      P.fill(roof, C.white, { grad: ['#fbfaf6', '#d9d6cf'] });
      const cables = [];
      for (let k = 1; k < 14; k++) {
        const t = k / 14;
        const x = -290 + 580 * t;
        cables.push([x, 96, x * 0.35, 96 + 96 * Math.pow(Math.sin(Math.PI * t), 0.55) * 0.98]);
      }
      P.lines(cables, { a: 0.28, w: 0.55, over: 0 });
      P.curve(roof, { a: 0.9, w: 1.05 });
      P.glow(0, 120, 120, '#fff4d6', 0.25);
    },
  });

  add({
    id: 'olympic-cauldron',
    name: 'Olympic Cauldron (1996)',
    layer: 'near',
    x: 662,
    z: 7.8,
    w: 46,
    h: 140,
    start: 1995.6,
    built: 1996.45,
    paper: WHITE_PAPER,
    flame: { x: 0, y: 132, from: 1996.45, to: 1997.2 },
    draw(P) {
      const tw = [
        [-10, 0],
        [10, 0],
        [6, 112],
        [-6, 112],
      ];
      P.fill(tw, C.steel, { hgrad: ['#c7ccd0', C.steel, '#6d757c'] });
      const sp = [];
      for (let y = 6; y < 110; y += 10) sp.push([-9 + y * 0.03, y, 9 - y * 0.03, y + 6]);
      P.lines(sp, { a: 0.45, w: 0.6, over: 0 });
      P.poly(tw, { a: 0.85, w: 0.95 });
      const bowl = [
        [-18, 118],
        [18, 118],
        [13, 112],
        [-13, 112],
      ];
      P.fill(bowl, '#b8a46e');
      P.poly(bowl, { a: 0.85, w: 0.9 });
    },
  });

  add({
    id: 'turner-field',
    name: 'Centennial Olympic Stadium / Turner Field',
    layer: 'near',
    x: 472,
    z: 7.5,
    w: 524,
    h: 152,
    start: 1993.6,
    built: 1996.4,
    paper: WHITE_PAPER,
    inkA: 0.88,
    lights: true,
    draw(P) {
      const base = [
        [-246, 0],
        [246, 0],
        [244, 30],
        [-244, 30],
      ];
      P.fill(base, '#a55a43');
      H.arcade(P, -238, 238, 3, 22, 26, { fw: 0.55, lit: 0.5 });
      P.poly(base, { a: 0.9, w: 1 });
      const up = [
        [-240, 30],
        [240, 30],
        [232, 84],
        [212, 96],
        [-212, 96],
        [-232, 84],
      ];
      P.fill(up, '#e8e4dc');
      const ribs = [];
      for (let x = -224; x <= 224; x += 14) ribs.push([x, 32, x * 0.97, 92]);
      P.lines(ribs, { a: 0.3, w: 0.55, over: 0 });
      if (P.color) P.fillRect(-228, 60, 456, 9, '#2f5d93', { a: 0.7, edge: false });
      P.hatch(
        [
          [120, 30],
          [240, 30],
          [232, 84],
          [212, 96],
          [120, 96],
        ],
        { a: 0.22, gap: 3 }
      );
      P.poly(up, { a: 0.88, w: 1 });
      for (const x of [-200, -70, 70, 200]) {
        H.truss(P, x - 3, 96, x + 3, 142);
        P.fillRect(x - 10, 142, 20, 9, C.steel);
        P.rect(x - 10, 142, 20, 9, { a: 0.8, w: 0.7, over: 0.5 });
        P.lightPoly(
          [
            [x - 10, 142],
            [x + 10, 142],
            [x + 10, 151],
            [x - 10, 151],
          ],
          '#fff6dc',
          0.95
        );
        P.glow(x, 146, 24, '#fff2c8', 0.45);
      }
    },
  });

  add({
    id: '1180-peachtree',
    name: '1180 Peachtree',
    layer: 'far',
    x: 1632,
    z: 1.7,
    w: 122,
    h: 662,
    start: 2004.2,
    built: 2006.4,
    paper: WHITE_PAPER,
    inkA: 0.8,
    draw(P) {
      H.curtain(P, -48, 0, 48, 590, { color: '#6d9cc4', mullion: 9, floor: 13 });
      const sail = [[-34, 590], [48, 590], [48, 662]];
      for (let i = 1; i < 10; i++) {
        const t = i / 10;
        sail.push([48 - 82 * t, 662 - 60 * Math.pow(t, 1.6)]);
      }
      P.fill(sail, '#8fb6d6', { grad: ['#c3dbef', '#6d9cc4'] });
      P.poly(sail, { a: 0.8, w: 0.9, over: 0.6 });
      P.glow(10, 625, 38, '#d7e9ff', 0.5);
    },
  });

  add({
    id: 'skyview',
    name: 'SkyView Atlanta',
    layer: 'near',
    x: -822,
    z: 7,
    w: 214,
    h: 210,
    start: 2012.8,
    built: 2013.4,
    paper: WHITE_PAPER,
    inkA: 0.85,
    draw(P) {
      const cx = 0;
      const cy = 108;
      const R = 94;
      P.lines(
        [
          [-62, 0, cx, cy],
          [62, 0, cx, cy],
          [-40, 0, cx, cy],
          [40, 0, cx, cy],
        ],
        { a: 0.8, w: 0.9, over: 0.5 }
      );
      const spokes = [];
      const n = 21;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n;
        spokes.push([cx, cy, cx + Math.cos(a) * R, cy + Math.sin(a) * R]);
      }
      P.lines(spokes, { a: 0.35, w: 0.5, over: 0, jit: 0.2, passes: 1 });
      P.arc(cx, cy, R, R, 0, Math.PI * 2, { a: 0.85, w: 1, closed: true });
      P.arc(cx, cy, R - 4, R - 4, 0, Math.PI * 2, { a: 0.4, w: 0.6, closed: true });
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n;
        const gx = cx + Math.cos(a) * R;
        const gy = cy + Math.sin(a) * R - 6;
        const g = [
          [gx - 4, gy],
          [gx + 4, gy],
          [gx + 4, gy + 7],
          [gx - 4, gy + 7],
        ];
        P.fill(g, i % 2 ? '#e9eef2' : '#4f7fbf');
        P.poly(g, { a: 0.7, w: 0.6, over: 0 });
        P.glow(gx, gy + 3, 7, i % 3 ? '#9fd0ff' : '#ff9ad5', 0.85);
      }
      H.circle(P, cx, cy, 6, C.steel);
    },
  });

  add({
    id: 'mercedes-benz-stadium',
    name: 'Mercedes-Benz Stadium',
    layer: 'city',
    x: -1192,
    z: 5.2,
    w: 704,
    h: 216,
    start: 2014.6,
    built: 2017.6,
    paper: WHITE_PAPER,
    inkA: 0.85,
    lights: true,
    draw(P) {
      const pts = [
        [-332, 0],
        [332, 0],
        [320, 118],
        [272, 166],
        [192, 194],
        [80, 210],
        [-60, 208],
        [-180, 192],
        [-270, 160],
        [-318, 108],
      ];
      P.fill(pts, '#a9b4bd', { grad: ['#dfe6ea', '#8a97a2'] });
      const facets = [];
      for (let i = -300; i < 320; i += 46) facets.push([i, 0, i + 40, 120]);
      for (let i = -300; i < 320; i += 46) facets.push([i + 40, 0, i, 120]);
      P.lines(facets, { a: 0.24, w: 0.55, over: 0 });
      const petals = [
        [-250, 150, 0, 196],
        [-150, 186, 20, 204],
        [-20, 206, 60, 200],
        [100, 206, 40, 196],
        [210, 188, 30, 194],
        [290, 150, 10, 190],
      ];
      P.lines(petals, { a: 0.5, w: 0.7, over: 0 });
      if (P.color) P.fillRect(-300, 70, 600, 12, '#2e4e74', { a: 0.55, edge: false });
      H.grid(P, -300, 70, 300, 82, { rows: 1, cols: 48, fw: 0.7, lit: 0.8 });
      P.hatch(pts.filter((q) => q[0] > 100).concat([[100, 0]]), { a: 0.22, gap: 3 });
      P.poly(pts, { a: 0.9, w: 1.05 });
      P.glow(0, 150, 160, '#fff1d0', 0.25);
    },
  });

  /* Completed in 2026 — the newest tower on the horizon. */
  add({
    id: '1072-west-peachtree',
    name: '1072 West Peachtree',
    layer: 'far',
    x: 1092,
    z: 1.75,
    w: 104,
    h: 754,
    start: 2023.4,
    built: 2025.9,
    paper: WHITE_PAPER,
    inkA: 0.8,
    draw(P) {
      H.curtain(P, -40, 0, 40, 712, { color: '#7aa4c6', mullion: 8, floor: 12 });
      const crown = [
        [-40, 712],
        [40, 712],
        [30, 748],
        [-30, 748],
      ];
      P.fill(crown, '#a9c6de');
      P.poly(crown, { a: 0.8, w: 0.9 });
      P.line(0, 748, 0, 754, { a: 0.8, w: 0.7, over: 0 });
      P.glow(0, 730, 30, '#e6f1ff', 0.5);
    },
  });

  /* ------------------------------------------------------------------------
     Camera focus points used by content entries (`focus: "capitol"` etc.)
     ------------------------------------------------------------------------ */
  const LAYER_PAR = { far: 0.84, city: 1, near: 1.12 };
  const byId = {};
  list.forEach((d) => {
    byId[d.id] = d;
  });
  const at = (id) => byId[id].x / LAYER_PAR[byId[id].layer];
  const focus = {
    railroad: at('union-depot'),
    'union-depot': at('union-depot'),
    capitol: at('capitol'),
    'kimball-house': at('kimball-house'),
    auc: at('fountain-hall') + 120,
    'atlanta-university': at('fountain-hall') + 120,
    grady: at('grady-1892') + 40,
    'sweet-auburn': at('odd-fellows') - 20,
    auburn: at('odd-fellows') - 20,
    ebenezer: at('ebenezer') - 80,
    'fulton-county-stadium': at('fulton-county-stadium') + 120,
    'turner-field': at('turner-field'),
    'georgia-dome': at('georgia-dome') + 220,
    downtown: 520,
    midtown: at('one-atlantic-center') - 100,
    skyline: 420,
    'south-view': 300,
  };
  byId['capitol'].focusName = 'Georgia State Capitol';

  SV.landmarks = { list, helpers: H, palette: C, focus, byId, LAYER_PAR, WHITE_PAPER };
})((window.SV = window.SV || {}));
