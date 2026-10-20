# South-View: An Illustrated History

A scroll-driven, illustrated timeline of South-View Cemetery and African American Atlanta, from 1863 to 2026. As you scroll, a hand-drawn view north from South-View's hill changes through the years. It starts as a pencil sketch of the 1860s railroad town and becomes a full-color, sunset view of today's skyline. Buildings rise, get demolished, and are replaced in the years they really were.

Built for LMC 3403 (Georgia Tech, Fall 2026). Plain HTML, CSS and JavaScript: no build step and no dependencies.

## Run it

- **Quickest:** double-click `index.html`.
- **Local server (closer to the hosted version):** run `python3 -m http.server` in this folder, then open <http://localhost:8000>.

## Edit the timeline (`content/timeline.js`)

This is the only file you need to touch. Each entry uses the same fields as our research template:

```js
{
  id: 'ludie-clay-andrews',       // unique; also a link anchor: index.html#ludie-clay-andrews
  year: 1920,                     // where it sits on the timeline, and the skyline's year
  date: '1914 – 1920',            // the date shown on the card
  person: 'Ludie Clay Andrews',
  title: 'Opening doors for Black nurses',
  description: '…',
  whyItBelongs: '…',              // shown as "Connection to South-View"
  media: {
    type: 'Historical photograph',
    src: 'assets/images/archive/ludie-clay-andrews.jpg',  // '' = "archival image needed" box
    width: 356, height: 462,      // the image's pixel size (prevents layout jumps)
    alt: '…', caption: '…', credit: '…', creditUrl: '…',
    suggestion: '…'               // shown in the placeholder box when src is ''
  },
  sources: [{ label: 'Historical background', url: '…' }],
  focus: 'grady',                 // optional: the landmark the skyline pans to
  status: 'researched',           // 'researched' | 'draft' | 'placeholder'
  note: '…'                       // internal note, never shown on the page
},
```

- **To add an entry,** copy a block, edit it, and save. Entries sort by `year` automatically.
- **To remove an entry,** delete its block.
- **To add an image,** put a JPG (about 800–1000px on the long side) in `assets/images/archive/` and point `src` at it.
- **Focus targets:** `railroad`, `capitol`, `kimball-house`, `auc`, `grady`, `sweet-auburn`, `ebenezer`, `fulton-county-stadium`, `turner-field`, `georgia-dome`, `downtown`, `midtown`, `skyline`, `south-view`.
- **Section intros, the hero text and the ending** are also in this file (`site` and `periods`).
- **Before publishing,** set `showStatusLabels: false` to hide the Draft/Placeholder tags.

If something looks wrong, open the browser console. The site warns about entries missing a year or title, duplicate ids, unknown `focus` values, and missing images.

## Content status

- **Researched (team):** Turner, Grant, Herndon, Andrews and Dobbs, all from *Research pre-civil rights*.
- **Draft:** the section intros and the Civil Rights and Post–Civil Rights entries (Smith-Robinson, Hamilton, King, Aaron, King Sr., Russell, Lewis, the 2026 National Register listing). Each has source links, but the team should verify and rewrite them in our own words.
- **Placeholder:** one 1950s slot, plus every entry without an image.
- **Image rights:** the Grant portrait's date and reproduction permission still need checking, as noted in our research. The other photos are credited to their source archives; confirm permission before a public launch.

## Host it and embed it in Wix

1. **Host:** on GitHub, open Settings → Pages → *Deploy from branch* → `main` / root. The site will be at `https://<user>.github.io/<repo>/`.
2. **Embed:** in Wix, choose Add → Embed Code → **Embed a Site**, paste the URL, stretch it to full width, and make it about the height of the screen. In Wix Studio you can set the height to `100vh`.
3. Scrolling happens inside the iframe. When a reader reaches the end, the Wix page continues scrolling as normal.

## Handy URLs

| URL | What it does |
| --- | --- |
| `index.html?year=1958` | Opens at a given year |
| `index.html#john-lewis` | Opens at an entry (works with any `id`) |
| `index.html?motion=off` | Turns off ambient animation (it also follows the OS "reduce motion" setting and the pause button) |

## How it works

| File | Role |
| --- | --- |
| `content/timeline.js` | All text and entries |
| `assets/js/story.js` | Builds the page and maps scroll position to a year and camera position; runs the timeline indicator |
| `assets/js/scene.js` | Canvas renderer: five layers (sky, city, effects, mid-ground, cemetery) |
| `assets/js/landmarks.js` | About 45 real buildings, each with build and demolish years (Kimball House 1885–1959, gold dome 1958, Westin 1976, and so on) |
| `assets/js/scenery.js` | Year-by-year curves (color, sky, dusk), filler buildings, trees, headstones |
| `assets/js/pencil.js` | Hand-drawn line, hatching and watercolor drawing tools |

Each building is drawn once into a cached image, in pencil, watercolor and night-lights versions, so scrolling only composites pictures. In testing, a full-length scroll held 60fps in desktop Chrome. To add a building, copy an entry in `landmarks.js` and set `x`, `w`, `h`, `start`, `built` and `gone`.

The skyline is an artistic interpretation: positions are compressed, and some dates are approximate.
