/* ==========================================================================
   South-View · scenery
   --------------------------------------------------------------------------
   • era curves   – how colour, sky, dusk and the camera change by year
   • fillers      – the ordinary city between the landmarks; each lot is
                    built, replaced and rebuilt over the decades
   • mid-ground   – tree canopy, south-side houses, the railroad, the
                    Downtown Connector and MARTA
   • foreground   – South-View Cemetery itself: the hill, gate, trees and
                    headstones that accumulate after 1886
   • sky          – clouds (and the shapes for planes and birds)
   ========================================================================== */
(function (SV) {
  'use strict';

  const U = SV.util;
  const H = SV.landmarks.helpers;
  const C = SV.landmarks.palette;
  const WHITE = SV.landmarks.WHITE_PAPER;

  /* ------------------------------------------------------------------------
     Era curves (x = year)
     ------------------------------------------------------------------------ */
  const era = {
    // amount of watercolour on buildings: pencil → muted → vibrant
    color: U.curve([
      [1860, 0],
      [1898, 0],
      [1915, 0.05],
      [1940, 0.11],
      [1950, 0.18],
      [1957, 0.32],
      [1964, 0.5],
      [1970, 0.66],
      [1980, 0.85],
      [1992, 0.97],
      [2026, 1],
    ]),
    // sky wash strength
    sky: U.curve([
      [1860, 0],
      [1947, 0],
      [1957, 0.32],
      [1967, 0.58],
      [1978, 0.86],
      [1990, 1],
    ]),
    // golden hour → dusk at the very end of the story
    dusk: U.curve([
      [1860, 0],
      [1996, 0],
      [2008, 0.22],
      [2018, 0.58],
      [2026, 0.92],
    ]),
    skyTop: U.colorCurve([
      [1947, '#e8e2d4'],
      [1960, '#a9c4d6'],
      [1975, '#76a6d2'],
      [1996, '#5f90cf'],
      [2010, '#5367ad'],
      [2026, '#2c2f6c'],
    ]),
    skyMid: U.colorCurve([
      [1947, '#eee7d9'],
      [1960, '#d2dfe2'],
      [1975, '#b7d3e9'],
      [1996, '#c3d6e8'],
      [2010, '#e7aba2'],
      [2026, '#cf5f7c'],
    ]),
    skyLow: U.colorCurve([
      [1947, '#f1eadb'],
      [1960, '#efe5d1'],
      [1975, '#f1e2c2'],
      [1996, '#f5dab0'],
      [2010, '#f6b670'],
      [2026, '#f78b48'],
    ]),
    // ground/vegetation wash
    green: U.colorCurve([
      [1946, '#a6a77a'],
      [1965, '#8fae6b'],
      [1990, '#6fa457'],
      [2026, '#5f9a4c'],
    ]),
    // how tall a skyline the camera keeps in frame (world units ≈ feet)
    skylineH: U.curve([
      [1860, 210],
      [1884, 230],
      [1889, 300],
      [1906, 330],
      [1929, 380],
      [1958, 470],
      [1967, 690],
      [1976, 860],
      [1987, 960],
      [1992, 1120],
      [2026, 1120],
    ]),
    // the narrowest slice of city the camera may show (matters on phones)
    viewW: U.curve([
      [1860, 900],
      [1890, 980],
      [1930, 1100],
      [1960, 1300],
      [1980, 1500],
      [2000, 1620],
      [2026, 1700],
    ]),
    // default camera position when an entry does not ask for a focus
    camX: U.curve([
      [1860, 120],
      [1886, -40],
      [1905, 260],
      [1930, 360],
      [1958, 280],
      [1968, 520],
      [1980, 520],
      [1992, 560],
      [2026, 480],
    ]),
    // UI accent that follows the palette (sepia → brick → gold → coral)
    accent: U.colorCurve([
      [1860, '#7a5a3c'],
      [1945, '#7d5634'],
      [1958, '#a8432a'],
      [1968, '#b0412b'],
      [1992, '#c46a1c'],
      [2026, '#d2532f'],
    ]),
  };

  /* ------------------------------------------------------------------------
     Filler buildings
     ------------------------------------------------------------------------ */
  const FD = {};
  const BRICKS = [C.brick, C.redBrick, '#b4806a', C.buff, '#9b6650', '#c09a74'];
  const STONES = [C.limestone, C.sand, C.cream, C.terracotta, C.buff];
  const MODERN = [C.concrete, '#d9d3c7', '#b9b4aa', '#c8bfae', '#a7a59f'];
  const GLASSES = ['#6f97bd', '#7ea9c9', '#5f8fae', '#86a8b8', '#6c8aa9', '#8db0c2'];

  FD.house = (P, f) => {
    const w = f.w;
    const wall = f.h * 0.56;
    H.box(P, -w / 2, 0, w / 2, wall, { color: f.color, side: w * 0.1 });
    H.grid(P, -w / 2 + 3, wall * 0.25, w / 2 - 3, wall * 0.85, {
      rows: 1,
      cols: 2 + (f.v % 2),
      fw: 0.38,
      fh: 0.7,
      glass: C.glassDark,
      lit: 0.55,
    });
    H.gable(P, -w / 2 - 2, w / 2 + 2, wall, f.h - wall, { color: C.roof });
    if (f.v !== 1) H.box(P, w * 0.16, wall + (f.h - wall) * 0.3, w * 0.16 + 3.5, f.h * 0.96, { color: C.brickDark, lineA: 0.7 });
  };

  FD.shop = (P, f) => {
    const W = f.w / 2;
    const h = f.h;
    H.box(P, -W, 0, W, h - 4, { color: f.color, side: 4 });
    H.grid(P, -W + 3, 2, W - 3, Math.min(13, h * 0.32), { rows: 1, cols: Math.max(2, Math.round(f.w / 14)), fw: 0.7, fh: 0.75, glass: C.glassDark, lit: 0.7 });
    if (h > 26) {
      H.grid(P, -W + 3, h * 0.38, W - 3, h - 8, {
        rows: Math.max(1, Math.round((h - 14) / 12)),
        cols: Math.max(2, Math.round(f.w / 10)),
        glass: C.glassDark,
        lit: 0.45,
      });
    }
    H.cornice(P, -W, W, h - 4, { h: 3, color: C.sand, over: 1.5 });
  };

  FD.warehouse = (P, f) => {
    const W = f.w / 2;
    H.box(P, -W, 0, W, f.h, { color: f.color, side: 5 });
    H.grid(P, -W + 4, 4, W - 4, f.h - 5, {
      rows: Math.max(2, Math.round(f.h / 13)),
      cols: Math.max(3, Math.round(f.w / 9)),
      fw: 0.5,
      glass: C.glassDark,
      lit: 0.3,
    });
    P.line(-W, f.h - 2, W, f.h - 2, { a: 0.5, w: 0.7, over: 1 });
    if (f.v === 2) {
      const tx = W * 0.45;
      P.lines(
        [
          [tx - 5, f.h, tx - 5, f.h + 10],
          [tx + 5, f.h, tx + 5, f.h + 10],
        ],
        { a: 0.7, w: 0.6, over: 0 }
      );
      const tank = [
        [tx - 7, f.h + 10],
        [tx + 7, f.h + 10],
        [tx + 7, f.h + 20],
        [tx - 7, f.h + 20],
      ];
      P.fill(tank, '#8a6e55');
      P.poly(tank, { a: 0.8, w: 0.8 });
      H.hip(P, tx - 8, tx + 8, f.h + 20, 6, 8, { color: '#6e5a48' });
    }
  };

  FD.church = (P, f) => {
    const W = f.w / 2;
    const nave = f.h * 0.38;
    H.box(P, -W, 0, W * 0.4, nave, { color: f.color });
    H.gable(P, -W - 1, W * 0.4 + 1, nave, nave * 0.45, { color: C.slate });
    H.lancets(P, -W + 3, W * 0.35, nave * 0.15, nave * 0.6, 2);
    H.box(P, W * 0.4, 0, W, f.h * 0.62, { color: f.color });
    H.spire(P, W * 0.7, f.h * 0.62, W * 0.62, f.h * 0.38, { color: C.slate });
  };

  FD.office = (P, f) => {
    H.tower(P, {
      w: f.w,
      h: f.h,
      color: f.color,
      base: Math.min(16, f.h * 0.14),
      rows: f.floors,
      cols: Math.max(3, Math.round(f.w / 9)),
      side: 5,
      corniceColor: C.sand,
    });
  };

  FD.deco = (P, f) => {
    const W = f.w / 2;
    const h1 = f.h * 0.7;
    const h2 = f.h * 0.88;
    H.box(P, -W, 0, W, h1, { color: f.color, side: 5 });
    H.grid(P, -W + 4, 5, W - 4, h1 - 4, { rows: Math.round(h1 / 11), cols: Math.max(3, Math.round(f.w / 9)), glass: C.glassDark, lit: 0.45 });
    H.box(P, -W * 0.72, h1, W * 0.72, h2, { color: f.color, side: 4 });
    H.grid(P, -W * 0.72 + 3, h1 + 3, W * 0.72 - 3, h2 - 3, { rows: Math.max(1, Math.round((h2 - h1) / 11)), cols: 3, glass: C.glassDark, lit: 0.5 });
    H.box(P, -W * 0.4, h2, W * 0.4, f.h, { color: f.color, side: 3 });
  };

  FD.modern = (P, f) => {
    const W = f.w / 2;
    const rows = Math.max(4, Math.round(f.h / 12));
    H.box(P, -W, 0, W, f.h, { color: f.color, side: 6 });
    if (f.v === 0) {
      H.grid(P, -W + 3, 6, W - 3, f.h - 4, { rows, cols: Math.max(4, Math.round(f.w / 8)), fw: 0.75, fh: 0.55, style: 'ribbon', glass: C.glassDark, lit: 0.5 });
    } else if (f.v === 1) {
      H.grid(P, -W + 3, 6, W - 3, f.h - 4, { rows, cols: Math.max(4, Math.round(f.w / 9)), fw: 0.46, style: 'vstrip', glass: C.glassDark, lit: 0.45 });
    } else {
      H.grid(P, -W + 3, 6, W - 3, f.h - 4, { rows, cols: Math.max(4, Math.round(f.w / 8)), fw: 0.62, fh: 0.6, glass: C.glassTeal, lit: 0.5 });
    }
    H.box(P, -W * 0.5, f.h, W * 0.5, f.h + 8, { color: f.color, lineA: 0.7 });
  };

  FD.parking = (P, f) => {
    const W = f.w / 2;
    H.box(P, -W, 0, W, f.h, { color: f.color, side: 5 });
    const decks = Math.max(3, Math.round(f.h / 10));
    const rects = [];
    for (let i = 0; i < decks; i++) rects.push([-W + 3, (f.h * i) / decks + 3, f.w - 6, f.h / decks - 5]);
    if (P.pencil) {
      rects.forEach((q) =>
        P.hatch(
          [
            [q[0], q[1]],
            [q[0] + q[2], q[1]],
            [q[0] + q[2], q[1] + q[3]],
            [q[0], q[1] + q[3]],
          ],
          { a: 0.3, gap: 2.4, angle: 80 }
        )
      );
    }
    if (P.color) P.tint(rects, '#55575d', 0.5);
  };

  FD.glass = (P, f) => {
    const W = f.w / 2;
    const col = f.color;
    const crownH = f.v === 0 ? 0 : Math.min(40, f.h * 0.07);
    H.curtain(P, -W, 0, W, f.h - crownH, { color: col, mullion: Math.max(7, f.w / 9), floor: 12 });
    const top = f.h - crownH;
    if (f.v === 1) {
      const cr = [
        [-W, top],
        [W, top],
        [W * 0.55, f.h],
        [-W * 0.55, f.h],
      ];
      P.fill(cr, U.shade(col, 0.2));
      P.poly(cr, { a: 0.8, w: 0.9 });
    } else if (f.v === 2) {
      H.hip(P, -W, W, top, crownH * 1.6, W, { color: U.shade(col, 0.15), finial: 6 });
    } else if (f.v === 3) {
      H.box(P, -W * 0.7, top, W * 0.7, top + crownH * 0.55, { color: U.shade(col, 0.2) });
      H.box(P, -W * 0.4, top + crownH * 0.55, W * 0.4, f.h, { color: U.shade(col, 0.25) });
    } else if (f.v === 4) {
      const fin = [
        [W * 0.2, top],
        [W, top],
        [W, f.h + 10],
      ];
      P.fill(fin, U.shade(col, 0.3));
      P.poly(fin, { a: 0.8, w: 0.85 });
    }
  };

  FD.resi = (P, f) => {
    const W = f.w / 2;
    H.box(P, -W, 0, W, f.h, { color: f.color, side: 5 });
    const rows = Math.max(3, Math.round(f.h / 10));
    H.grid(P, -W + 3, 4, W - 3, f.h - 3, { rows, cols: Math.max(3, Math.round(f.w / 9)), fw: 0.6, fh: 0.55, glass: C.glassDark, lit: 0.55 });
    if (P.pencil && f.h * P.detail > 30) {
      const segs = [];
      for (let i = 1; i < rows; i++) segs.push([-W - 1.5, (f.h * i) / rows, W + 1.5, (f.h * i) / rows]);
      P.lines(segs, { a: 0.35, w: 0.55, over: 0.4, passes: 1 });
    }
  };

  const drawFiller = (P, f) => FD[f.type](P, f);

  /* Build the lots. Every lot gets a chain of buildings: 19th-century
     houses and shops are replaced by early skyscrapers, then by mid-century
     slabs and parking decks, then by glass towers — so the skyline changes
     the way Atlanta's did, rather than simply being recoloured. */
  const makeFillers = () => {
    const out = [];
    const r = U.rng(4242);
    let n = 0;

    // extra headroom above the body for roofs, tanks, crowns and fins
    const EXTRA = { glass: 52, warehouse: 30, church: 10, modern: 12 };

    const mk = (layer, type, x, w, h, built, core) => {
      const v = (r() * 5) | 0;
      let color;
      if (type === 'house') color = ['#c9b79a', '#b9a68b', '#d6c4a6', '#a9967e'][v % 4];
      else if (type === 'church') color = r() < 0.5 ? C.redBrick : '#b9ad9e';
      else if (type === 'glass') color = GLASSES[(r() * GLASSES.length) | 0];
      else if (type === 'modern' || type === 'parking') color = MODERN[(r() * MODERN.length) | 0];
      else if (type === 'office' || type === 'deco') color = r() < 0.55 ? BRICKS[(r() * BRICKS.length) | 0] : STONES[(r() * STONES.length) | 0];
      else color = BRICKS[(r() * BRICKS.length) | 0];
      const id = 'f' + n++;
      return {
        id,
        kind: 'filler',
        layer,
        x,
        // sprite bounds (body plus room for side faces and roofs)
        w: w * 1.16 + 10,
        h: h + (EXTRA[type] || 8),
        bodyW: w,
        bodyH: h,
        // what the drawing function sees
        body: { type, w, h, v: type === 'modern' ? v % 3 : v, color, floors: Math.max(2, Math.round(h / 12)) },
        built,
        start: built - (h > 160 ? 1.8 : 0.9),
        gone: null,
        z: r() * 0.9,
        inkA: built > 1972 ? 0.62 : 0.72,
        paper: built > 1972 ? WHITE : null,
        colorMul: 0.88,
        crane: h > 150 ? undefined : false,
        lights: type !== 'church' || r() < 0.3,
        seed: U.hash(id + ':' + type),
        draw: drawFiller,
        core,
      };
    };

    const pick = (layer, year, core) => {
      const x = r();
      if (layer === 'near') {
        if (year < 1955) return x < 0.42 ? 'house' : x < 0.75 ? 'shop' : 'warehouse';
        if (year < 1980) return x < 0.45 ? 'parking' : x < 0.75 ? 'modern' : null;
        return x < 0.5 ? 'resi' : x < 0.75 ? 'parking' : 'modern';
      }
      if (year < 1895) {
        if (x < 0.06) return 'church';
        return core > 0.5 ? (x < 0.6 ? 'shop' : 'warehouse') : x < 0.55 ? 'house' : x < 0.85 ? 'shop' : 'warehouse';
      }
      if (year < 1936) {
        if (core > 0.42 && x < 0.55 + core * 0.3) return x < 0.12 && year > 1924 ? 'deco' : 'office';
        return x < 0.4 ? 'shop' : x < 0.7 ? 'warehouse' : 'house';
      }
      if (year < 1950) return core > 0.5 && x < 0.3 ? 'deco' : x < 0.5 ? 'shop' : 'warehouse';
      if (year < 1980) {
        if (core > 0.32) return x < 0.68 ? 'modern' : 'parking';
        return x < 0.35 ? 'modern' : x < 0.55 ? 'parking' : x < 0.8 ? 'warehouse' : null;
      }
      if (core > 0.35) return x < 0.7 ? 'glass' : 'resi';
      return x < 0.6 ? 'resi' : x < 0.75 ? 'modern' : null;
    };

    const heightFor = (type, core) => {
      const x = r();
      switch (type) {
        case 'house':
          return 20 + x * 12;
        case 'shop':
          return 24 + x * 26 + core * 14;
        case 'warehouse':
          return 36 + x * 34;
        case 'church':
          return 80 + x * 40;
        case 'office':
          return 70 + core * 130 * (0.45 + x * 0.55);
        case 'deco':
          return 120 + core * 120 * (0.4 + x * 0.6);
        case 'modern':
          return 70 + core * 330 * (0.3 + x * 0.7);
        case 'parking':
          return 34 + x * 30;
        case 'glass':
          return 180 + core * 430 * (0.35 + x * 0.65);
        case 'resi':
          return 50 + core * 180 * (0.3 + x * 0.7) + x * 30;
        default:
          return 40;
      }
    };
    const widthFor = (type, base) => {
      switch (type) {
        case 'house':
          return 26 + r() * 14;
        case 'church':
          return 44 + r() * 16;
        case 'parking':
          return Math.max(70, base);
        case 'office':
        case 'deco':
          return 54 + r() * 46;
        case 'glass':
        case 'modern':
          return 76 + r() * 60;
        default:
          return base;
      }
    };
    const life = (type, core) => {
      const x = r();
      switch (type) {
        case 'house':
          return 35 + x * 60 - core * 20;
        case 'shop':
          return 40 + x * 70 - core * 20;
        case 'warehouse':
          return 45 + x * 70;
        case 'church':
          return 90 + x * 80;
        case 'office':
        case 'deco':
          return 55 + x * 70;
        case 'modern':
          return 40 + x * 60;
        case 'parking':
          return 25 + x * 45;
        default:
          return 999;
      }
    };

    const lot = (layer, cx, base, core, firstYear) => {
      let year = firstYear;
      let type = pick(layer, year, core);
      let guard = 0;
      while (guard++ < 6) {
        if (!type) {
          year += 8 + r() * 25;
          if (year > 2024) return;
          type = pick(layer, year, core);
          continue;
        }
        const w = widthFor(type, base);
        const h = heightFor(type, core);
        const f = mk(layer, type, cx + (r() - 0.5) * 12, w, h, year, core);
        const end = year + life(type, core);
        // buildings near the core get replaced; outlying ones often survive
        const replace = end < 2023 && r() < 0.35 + core * 0.6;
        if (replace) {
          f.gone = end;
          out.push(f);
          year = end + 0.6 + r() * 2.5;
          type = pick(layer, year, core);
        } else {
          out.push(f);
          return;
        }
      }
    };

    // downtown (city layer)
    for (let x = -2500; x < 2850; ) {
      const core = Math.max(Math.exp(-Math.pow((x - 520) / 760, 2)), 0.45 * Math.exp(-Math.pow((x + 1560) / 240, 2)));
      const base = 48 + r() * 60 + core * 26;
      const first = 1846 + r() * 30 + (1 - core) * r() * 30;
      lot('city', x, base, core, first);
      x += base * (0.62 + r() * 0.5);
    }
    // midtown and beyond (far layer) — mostly rises after 1950
    for (let x = -900; x < 2700; ) {
      const core = Math.exp(-Math.pow((x - 1250) / 620, 2)) * 0.9 + 0.12;
      const base = 60 + r() * 60;
      const first = r() < 0.35 ? 1870 + r() * 40 : 1948 + r() * 30 + (1 - core) * 20;
      lot('far', x, base, core, first);
      x += base * (0.7 + r() * 0.6);
    }
    // south edge of downtown (near layer) — low-rise
    for (let x = -2400; x < 2700; ) {
      const base = 44 + r() * 50;
      lot('near', x, base, 0.3, 1856 + r() * 50);
      x += base * (0.9 + r() * 0.9);
    }

    // November 1864: much of the antebellum city burned and was rebuilt
    const count = out.length;
    for (let i = 0; i < count; i++) {
      const f = out[i];
      if (f.layer === 'far' || f.built >= 1864 || (f.gone != null && f.gone < 1866) || r() > 0.5) continue;
      const built = 1866 + r() * 12;
      out.push(Object.assign({}, f, { id: f.id + 'r', built, start: built - 0.9, seed: f.seed + 1 }));
      f.gone = 1864.85;
    }
    return out;
  };

  /* ------------------------------------------------------------------------
     Props (trees, houses, headstones, the gate, clouds) — drawn with the
     same Pencil API and baked as sprites by the scene.
     ------------------------------------------------------------------------ */
  const blob = (cx, cy, rx, ry, n, wob, phase) => {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = (Math.PI * 2 * i) / n;
      const k = 1 + wob * Math.sin(t * 5 + phase) + wob * 0.5 * Math.sin(t * 9 + phase * 2.3);
      pts.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k]);
    }
    return pts;
  };

  const PROPS = {};

  PROPS.oak = {
    w: 100,
    h: 112,
    draw(P, v) {
      const ph = v * 1.7;
      P.fillRect(-4, 0, 8, 46, '#6b5240');
      P.lines(
        [
          [-4, 0, -3, 46],
          [4, 0, 3, 46],
          [0, 40, -16, 60],
          [1, 44, 18, 62],
        ],
        { a: 0.75, w: 0.85, over: 0.6 }
      );
      const crown = blob(0, 70, 46, 38, 30, 0.1, ph);
      P.fillCurve(crown, '#6c9a4f', { grad: ['#8fb86b', '#4f7d3c'] });
      if (P.pencil) {
        const sh = blob(14, 60, 34, 28, 22, 0.08, ph + 1);
        P.hatch(sh, { a: 0.3, gap: 2.6, angle: 58 });
        const tufts = [];
        for (let i = 0; i < 9; i++) {
          const a = ph + i * 0.7;
          const rr = 20 + (i % 3) * 7;
          tufts.push(blob(Math.cos(a) * rr * 0.9, 70 + Math.sin(a) * rr * 0.6, 9, 7, 10, 0.12, i));
        }
        tufts.forEach((t) => P.curve(t, { a: 0.22, w: 0.6, closed: true, passes: 1 }));
      }
      if (P.color) P.fillCurve(blob(16, 60, 30, 26, 22, 0.08, ph + 1), '#3f6a33', { a: 0.45, edge: false });
      P.curve(crown, { a: 0.8, w: 0.95, closed: true });
    },
  };

  PROPS.pine = {
    w: 44,
    h: 120,
    draw(P, v) {
      P.fillRect(-2.5, 0, 5, 30, '#6b5240');
      P.lines(
        [
          [-2.5, 0, -2, 30],
          [2.5, 0, 2, 30],
        ],
        { a: 0.7, w: 0.75, over: 0.5 }
      );
      const tiers = 4 + (v % 2);
      for (let i = 0; i < tiers; i++) {
        const y0 = 22 + i * 18;
        const w = 20 - i * 3.2;
        const t = [
          [-w, y0],
          [w, y0],
          [0, y0 + 34],
        ];
        P.fill(t, '#4f7d4a', { grad: ['#6b9a5c', '#3c6638'] });
        P.hatch(
          [
            [0, y0],
            [w, y0],
            [0, y0 + 34],
          ],
          { a: 0.3, gap: 2.2 }
        );
        P.poly(t, { a: 0.75, w: 0.8, over: 0.8 });
      }
    },
  };

  PROPS.cedar = {
    w: 60,
    h: 150,
    draw(P, v) {
      P.fillRect(-3, 0, 6, 16, '#6b5240');
      const pts = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        pts.push([24 * Math.sin(Math.PI * Math.pow(t, 0.8)) * (1 - t * 0.55) + Math.sin(t * 17 + v) * 2.2, 10 + t * 136]);
      }
      const shape = pts.concat(pts.slice().reverse().map((q) => [-q[0] * 0.92, q[1]]));
      P.fillCurve(shape, '#4a6f45', { grad: ['#5f8a55', '#2f5130'] });
      P.hatch(pts.concat([[0, 146], [0, 10]]), { a: 0.34, gap: 2.3, angle: 64 });
      P.curve(shape, { a: 0.78, w: 0.9, closed: true });
    },
  };

  PROPS.magnolia = {
    w: 130,
    h: 150,
    draw(P, v) {
      P.fillRect(-5, 0, 10, 30, '#5f4a3b');
      const crown = blob(0, 82, 58, 64, 34, 0.08, v * 2.1);
      P.fillCurve(crown, '#3f6a3f', { grad: ['#5d8b55', '#2d4f2e'] });
      if (P.pencil) {
        P.hatch(blob(18, 72, 44, 52, 26, 0.07, v), { a: 0.36, gap: 2.4, angle: 60, cross: true });
        const leaves = [];
        for (let i = 0; i < 26; i++) {
          const a = i * 2.4 + v;
          const rr = 14 + (i % 5) * 9;
          const x = Math.cos(a) * rr;
          const y = 82 + Math.sin(a) * rr * 1.05;
          leaves.push([x - 3, y - 1, x + 3, y + 1]);
        }
        P.lines(leaves, { a: 0.3, w: 0.6, over: 0, passes: 1 });
      }
      if (P.color) {
        for (let i = 0; i < 7; i++) {
          const a = i * 0.9 + v;
          H.circle(P, Math.cos(a) * 34, 92 + Math.sin(a) * 30, 2.4, '#f7f3ea');
        }
      }
      P.curve(crown, { a: 0.8, w: 0.95, closed: true });
    },
  };

  PROPS.shotgun = {
    w: 22,
    h: 24,
    draw(P, v) {
      const col = ['#d4c5a8', '#c7b392', '#e0d3b8', '#bfae94'][v % 4];
      H.box(P, -8, 0, 8, 13, { color: col, side: 2.5 });
      H.gable(P, -9.5, 9.5, 13, 9, { color: C.roof });
      H.grid(P, -6, 4, 6, 10, { rows: 1, cols: 2, fw: 0.4, fh: 0.8, glass: C.glassDark, lit: 0.7 });
      P.lines([[-9, 4, 9, 4]], { a: 0.4, w: 0.5, over: 0.5 });
    },
  };

  PROPS.bungalow = {
    w: 34,
    h: 22,
    draw(P, v) {
      const col = ['#cdbb9c', '#b7a184', '#d9cbb0', '#a99780'][v % 4];
      H.box(P, -14, 0, 14, 11, { color: col, side: 2.5 });
      H.hip(P, -16, 16, 11, 9, 7, { color: C.roof });
      H.grid(P, -11, 3, 11, 9, { rows: 1, cols: 3, fw: 0.4, fh: 0.8, glass: C.glassDark, lit: 0.7 });
    },
  };

  PROPS.tablet = {
    w: 18,
    h: 26,
    draw(P, v) {
      const col = v % 3 === 0 ? '#e5e1d8' : v % 3 === 1 ? '#b9b6b1' : '#c9b8ad';
      const w = 6.5 + (v % 2);
      const h = 18 + (v % 3) * 2;
      const pts = [
        [-w, 0],
        [w, 0],
        [w, h - w],
      ];
      P.arcPts(0, h - w, w, w * 0.9, 0, Math.PI, 10).forEach((q) => pts.push(q));
      pts.push([-w, h - w]);
      P.fill(pts, col);
      P.hatch(
        [
          [w * 0.35, 0],
          [w, 0],
          [w, h - w],
          [w * 0.35, h - 1],
        ],
        { a: 0.32, gap: 1.8 }
      );
      P.lines(
        [
          [-w * 0.55, h * 0.62, w * 0.55, h * 0.62],
          [-w * 0.45, h * 0.5, w * 0.45, h * 0.5],
          [-w * 0.5, h * 0.4, w * 0.4, h * 0.4],
        ],
        { a: 0.3, w: 0.45, over: 0, passes: 1 }
      );
      P.poly(pts, { a: 0.85, w: 0.85, over: 0.4 });
    },
  };

  PROPS.square = {
    w: 20,
    h: 22,
    draw(P, v) {
      const col = v % 2 ? '#a9a6a3' : '#d8d3ca';
      H.box(P, -8, 0, 8, 4, { color: U.shade(col, -0.1), lineA: 0.7 });
      H.box(P, -6.5, 4, 6.5, 17 + (v % 3), { color: col, side: 1.5 });
      P.lines([[-4.5, 12, 4.5, 12]], { a: 0.3, w: 0.45, over: 0, passes: 1 });
    },
  };

  PROPS.obelisk = {
    w: 22,
    h: 76,
    draw(P, v) {
      const col = v % 2 ? '#e8e4dc' : '#c9c4bb';
      H.box(P, -9, 0, 9, 6, { color: col, side: 2 });
      H.box(P, -7, 6, 7, 12, { color: col, side: 1.5 });
      const h = 54 + (v % 3) * 6;
      const sh = [
        [-5, 12],
        [5, 12],
        [3.4, h],
        [-3.4, h],
      ];
      P.fill(sh, col);
      P.hatch(
        [
          [1.5, 12],
          [5, 12],
          [3.4, h],
          [1, h],
        ],
        { a: 0.32, gap: 1.8 }
      );
      P.poly(sh, { a: 0.85, w: 0.85, over: 0.4 });
      const tip = [
        [-3.4, h],
        [3.4, h],
        [0, h + 7],
      ];
      P.fill(tip, col);
      P.poly(tip, { a: 0.85, w: 0.8, over: 0.3 });
    },
  };

  PROPS.cross = {
    w: 18,
    h: 32,
    draw(P, v) {
      const col = v % 2 ? '#dedad2' : '#b7b4ae';
      H.box(P, -7, 0, 7, 5, { color: col, side: 1.5 });
      const c = [
        [-1.8, 5],
        [1.8, 5],
        [1.8, 19],
        [6, 19],
        [6, 22.5],
        [1.8, 22.5],
        [1.8, 28],
        [-1.8, 28],
        [-1.8, 22.5],
        [-6, 22.5],
        [-6, 19],
        [-1.8, 19],
      ];
      P.fill(c, col);
      P.poly(c, { a: 0.85, w: 0.8, over: 0.3 });
    },
  };

  PROPS.wood = {
    w: 16,
    h: 28,
    draw(P, v) {
      const col = '#8a7258';
      const lean = (v % 3) - 1;
      const c = [
        [-1.3, 0],
        [1.3, 0],
        [1.3 + lean, 16],
        [5 + lean, 16.5],
        [5 + lean, 19],
        [1.2 + lean, 18.6],
        [1 + lean, 24],
        [-1.4 + lean, 24],
        [-1.2 + lean, 18.4],
        [-5 + lean, 18],
        [-5 + lean, 15.6],
        [-1.3 + lean, 16],
      ];
      P.fill(c, col);
      P.poly(c, { a: 0.75, w: 0.7, over: 0.3, jit: 0.6 });
    },
  };

  PROPS.field = {
    w: 18,
    h: 12,
    draw(P, v) {
      const pts = blob(0, 4, 7, 5.5, 12, 0.12, v);
      P.fillCurve(
        pts.map((q) => [q[0], Math.max(0, q[1])]),
        '#a39c90'
      );
      P.hatch(blob(2.5, 3.5, 4.5, 4, 10, 0.1, v), { a: 0.3, gap: 1.6 });
      P.curve(
        pts.map((q) => [q[0], Math.max(0, q[1])]),
        { a: 0.75, w: 0.75, closed: true }
      );
    },
  };

  PROPS.double = {
    w: 38,
    h: 22,
    draw(P, v) {
      const col = v % 2 ? '#7f7a78' : '#b69a8f';
      H.box(P, -16, 0, 16, 4, { color: U.shade(col, -0.1), lineA: 0.7 });
      const pts = [
        [-14, 4],
        [14, 4],
        [14, 12],
      ];
      P.arcPts(7, 12, 7, 5, 0, Math.PI, 8).forEach((q) => pts.push(q));
      P.arcPts(-7, 12, 7, 5, 0, Math.PI, 8).forEach((q) => pts.push(q));
      pts.push([-14, 12]);
      P.fill(pts, col);
      P.hatch(
        [
          [6, 4],
          [14, 4],
          [14, 12],
          [6, 16],
        ],
        { a: 0.3, gap: 1.8 }
      );
      P.lines(
        [
          [-10, 10, -4, 10],
          [4, 10, 10, 10],
        ],
        { a: 0.3, w: 0.45, over: 0, passes: 1 }
      );
      P.poly(pts, { a: 0.85, w: 0.85, over: 0.3 });
    },
  };

  PROPS.flat = {
    w: 22,
    h: 6,
    draw(P, v) {
      const col = v % 2 ? '#8d8a86' : '#c2bdb4';
      const pts = [
        [-9, 0],
        [9, 0],
        [8, 3],
        [-8, 3],
      ];
      P.fill(pts, col);
      P.poly(pts, { a: 0.75, w: 0.7, over: 0.3 });
    },
  };

  PROPS.mausoleum = {
    w: 64,
    h: 54,
    draw(P, v) {
      const col = v % 2 ? '#e2ddd3' : '#c6c0b5';
      H.box(P, -27, 0, 27, 5, { color: U.shade(col, -0.08), side: 3 });
      H.box(P, -23, 5, 23, 32, { color: col, side: 3 });
      H.columns(P, -18, 18, 6, 31, 4, { cw: 2.6, shadow: false });
      H.opening(P, H.archPoly(P, 0, 5, 9, 20), { cross: true });
      H.cornice(P, -23, 23, 32, { h: 2.5, over: 1.5, color: col });
      H.gable(P, -25, 25, 34.5, 11, { color: col });
    },
  };

  /* The cemetery gate — an illustrative entrance, not a survey drawing. */
  PROPS.gate = {
    w: 150,
    h: 112,
    draw(P) {
      const stone = '#bdb3a4';
      for (const cx of [-50, 50]) {
        H.box(P, cx - 8, 0, cx + 8, 64, { color: stone, side: 2.5 });
        P.lines(
          [
            [cx - 8, 16, cx + 8, 16],
            [cx - 8, 32, cx + 8, 32],
            [cx - 8, 48, cx + 8, 48],
          ],
          { a: 0.3, w: 0.5, over: 0, passes: 1 }
        );
        H.box(P, cx - 10, 64, cx + 10, 69, { color: U.shade(stone, -0.08) });
        H.circle(P, cx, 74, 5, stone);
      }
      // wrought-iron arch
      const arch = P.arcPts(0, 66, 42, 26, 0, Math.PI, 18);
      P.curve(arch, { a: 0.85, w: 1, passes: 2 });
      P.curve(
        arch.map((q) => [q[0], q[1] - 6]),
        { a: 0.6, w: 0.7 }
      );
      const bars = [];
      for (let x = -40; x <= 40; x += 6) bars.push([x, 0, x, 60 + Math.sqrt(Math.max(0, 1 - (x / 42) * (x / 42))) * 20 - 4]);
      P.lines(bars, { a: 0.5, w: 0.55, over: 0, passes: 1 });
      if (P.color) {
        bars.forEach((b) => P.fillRect(b[0] - 0.35, b[1], 0.7, b[3] - b[1], '#2d2a2a', { a: 0.75, edge: false, off: 0 }));
      }
      // name plate
      const plate = [
        [-30, 82],
        [30, 82],
        [30, 93],
        [-30, 93],
      ];
      P.fill(plate, '#efe7d6');
      P.poly(plate, { a: 0.8, w: 0.8, over: 0.5 });
      P.text('SOUTH-VIEW', 0, 85, { size: 8.4, weight: 700, a: 0.85, color: '#2b2522' });
      P.text('1886', 0, 96, { size: 5.5, weight: 600, a: 0.7, color: '#2b2522' });
      // fence wings
      const fence = [];
      for (const s of [-1, 1]) {
        for (let x = 60; x <= 74; x += 3.5) fence.push([s * x, 0, s * x, 30]);
        fence.push([s * 58, 26, s * 75, 26], [s * 58, 6, s * 75, 6]);
      }
      P.lines(fence, { a: 0.55, w: 0.55, over: 0, passes: 1 });
    },
  };

  PROPS.post = {
    w: 30,
    h: 22,
    draw(P) {
      P.fillRect(-1.5, 0, 3, 18, '#8a7258');
      P.lines(
        [
          [-1.5, 0, -1.5, 18],
          [1.5, 0, 1.5, 18],
          [-15, 14, 15, 13],
          [-15, 7, 15, 7.5],
        ],
        { a: 0.6, w: 0.65, over: 0.6, jit: 0.5 }
      );
    },
  };

  PROPS.iron = {
    w: 40,
    h: 22,
    draw(P) {
      const bars = [];
      for (let x = -18; x <= 18; x += 3) bars.push([x, 0, x, 16]);
      bars.push([-19, 14, 19, 14], [-19, 3, 19, 3]);
      P.lines(bars, { a: 0.5, w: 0.5, over: 0, passes: 1 });
      if (P.color) bars.forEach((b) => P.fillRect(Math.min(b[0], b[2]) - 0.3, Math.min(b[1], b[3]), Math.abs(b[2] - b[0]) + 0.6, Math.abs(b[3] - b[1]) + 0.6, '#2d2a2a', { a: 0.7, edge: false, off: 0 }));
    },
  };

  PROPS.cloud = {
    w: 260,
    h: 90,
    draw(P, v) {
      const r = U.rng(31 + v * 17);
      const puffs = [];
      const n = 5 + (v % 3);
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const x = -100 + 200 * t + (r() - 0.5) * 20;
        const rad = 22 + Math.sin(Math.PI * t) * 26 + r() * 10;
        puffs.push([x, 18 + rad * 0.55, rad]);
      }
      // silhouette: upper envelope of puffs + flat base
      const pts = [];
      for (let i = 0; i <= 48; i++) {
        const x = -125 + (250 * i) / 48;
        let y = 10;
        for (const p of puffs) {
          const dx = x - p[0];
          if (Math.abs(dx) < p[2]) y = Math.max(y, p[1] + Math.sqrt(p[2] * p[2] - dx * dx) * 0.75);
        }
        pts.push([x, y]);
      }
      const shape = pts.concat([
        [125, 8],
        [-125, 8],
      ]);
      P.fillCurve(shape, '#ffffff', { a: 0.96 });
      if (P.color) P.fillRect(-120, 8, 240, 18, '#9a9cc0', { a: 0.35, edge: false });
      P.hatch(
        [
          [-110, 9],
          [110, 9],
          [96, 24],
          [-96, 24],
        ],
        { a: 0.18, gap: 3, angle: 12, broken: 0.35 }
      );
      P.curve(pts.slice(2, -2), { a: 0.55, w: 0.8 });
      P.line(-112, 9, 112, 9, { a: 0.25, w: 0.6, over: 2 });
    },
  };

  /* ------------------------------------------------------------------------
     Mid-ground: canopy, houses, rail, highway, MARTA
     ------------------------------------------------------------------------ */
  const makeMid = () => {
    const r = U.rng(777);
    const trees = [];
    const houses = [];
    for (let x = -4200; x < 4200; x += 13 + r() * 24) {
      const old = r() < 0.5;
      trees.push({
        row: 0,
        x,
        s: 0.6 + r() * 0.55,
        type: r() < 0.3 ? 'pine' : 'oak',
        appear: old ? 1700 : 1880 + r() * 105,
        v: (r() * 4) | 0,
        dy: r() * 6,
      });
    }
    for (let x = -4000; x < 4000; x += 34 + r() * 60) {
      if (r() < 0.3) continue;
      const appear = 1872 + r() * 66;
      let gone = null;
      // the Downtown Connector and urban renewal cleared whole blocks
      if (x > -700 && x < 700 && r() < 0.7) gone = 1957 + r() * 7;
      else if (r() < 0.2) gone = 1975 + r() * 40;
      houses.push({ x, s: 0.75 + r() * 0.4, type: r() < 0.6 ? 'shotgun' : 'bungalow', appear, gone, v: (r() * 4) | 0, dy: r() * 5 });
    }
    for (let x = -4100; x < 4100; x += 60 + r() * 140) {
      trees.push({ row: 1, x, s: 0.85 + r() * 0.6, type: r() < 0.22 ? 'pine' : 'oak', appear: r() < 0.6 ? 1700 : 1890 + r() * 90, v: (r() * 4) | 0, dy: r() * 4 });
    }
    return {
      trees,
      houses,
      highway: { start: 1956, built: 1964 },
      marta: { start: 1980.5, built: 1982.5 },
    };
  };

  /* ------------------------------------------------------------------------
     Foreground: South-View Cemetery
     ------------------------------------------------------------------------ */
  const FOUNDED = 1886.3;
  const makeFg = () => {
    const r = U.rng(1886);
    const stones = [];
    const typeFor = (year) => {
      const x = r();
      if (year < 1905) return x < 0.3 ? 'wood' : x < 0.5 ? 'field' : x < 0.85 ? 'tablet' : 'obelisk';
      if (year < 1935) return x < 0.1 ? 'wood' : x < 0.2 ? 'field' : x < 0.62 ? 'tablet' : x < 0.78 ? 'square' : x < 0.9 ? 'obelisk' : 'cross';
      if (year < 1965) return x < 0.42 ? 'tablet' : x < 0.7 ? 'square' : x < 0.85 ? 'cross' : 'double';
      return x < 0.25 ? 'tablet' : x < 0.5 ? 'double' : x < 0.75 ? 'flat' : x < 0.88 ? 'square' : 'cross';
    };
    // the original section sits beside the gate; later burials spread out
    for (let i = 0; i < 300; i++) {
      const x = -2300 + r() * 4900;
      const dist = Math.abs(x + 230) / 2400;
      const appear = FOUNDED + 0.4 + Math.pow(r(), 0.9) * 138 * (0.2 + 0.8 * Math.min(1, dist * 1.3)) + r() * 6;
      if (appear > 2026) continue;
      const type = typeFor(appear);
      const stone = { x, depth: r(), appear, type, v: (r() * 6) | 0 };
      if (type === 'wood') stone.decay = appear + 28 + r() * 25; // wooden markers weather away
      stone.flowers = appear > 1960 ? r() < 0.55 : r() < 0.12;
      stone.flowerColor = ['#d9534f', '#f2c14e', '#f7f2e8', '#c25ba5', '#ef8a4c'][(r() * 5) | 0];
      stones.push(stone);
    }
    stones.push({ x: 160, depth: 0.42, appear: 1912, type: 'mausoleum', v: 0 });
    stones.push({ x: 1180, depth: 0.25, appear: 1931, type: 'mausoleum', v: 1 });
    stones.push({ x: -1150, depth: 0.3, appear: 1958, type: 'mausoleum', v: 0 });
    stones.sort((a, b) => a.depth - b.depth);
    const fence = [];
    for (let x = -2500; x < 2800; x += 30) fence.push({ x, before: FOUNDED });
    return {
      stones,
      gate: { x: -520, depth: 0.38, built: FOUNDED },
      trees: [
        { type: 'magnolia', x: -1420, depth: 0.2, s: 1.35 },
        { type: 'cedar', x: -840, depth: 0.12, s: 1.1 },
        { type: 'oak', x: 980, depth: 0.55, s: 3.1 },
        { type: 'cedar', x: 1640, depth: 0.18, s: 1.25 },
        { type: 'oak', x: 2350, depth: 0.4, s: 2.4 },
        { type: 'cedar', x: -1900, depth: 0.3, s: 1.1 },
      ],
      fence,
      founded: FOUNDED,
    };
  };

  const makeClouds = () => {
    const r = U.rng(99);
    const out = [];
    for (let i = 0; i < 7; i++) {
      out.push({ x: r() * 3000, y: 0.07 + r() * 0.33, s: 0.55 + r() * 0.7, v: i, speed: 2 + r() * 5 });
    }
    return out;
  };

  /** Rolling crest of South-View's hill; periodic so it tiles forever. */
  const TILE = 2400;
  const crest = (x) => {
    const k = (Math.PI * 2) / TILE;
    return 22 * (0.55 * Math.sin(x * k * 2 + 0.7) + 0.3 * Math.sin(x * k * 5 + 1.3) + 0.15 * Math.sin(x * k * 9 + 2.1));
  };

  SV.scenery = {
    era,
    makeFillers,
    makeMid,
    makeFg,
    makeClouds,
    PROPS,
    crest,
    TILE,
  };
})((window.SV = window.SV || {}));
