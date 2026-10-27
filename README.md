# South-View: An Illustrated History

A scroll-driven, illustrated timeline of South-View Cemetery and African American Atlanta, from 1863 to 2026. As you scroll, a hand-drawn view north from South-View's hill changes through the years. It starts as a pencil sketch of the 1860s railroad town and becomes a full-color, sunset view of today's skyline. Buildings rise, get demolished, and are replaced in the years they really were.

Built for LMC 3403 (Georgia Tech, Fall 2026). Plain HTML, CSS and JavaScript: no build step and no dependencies.

## Run it

- **Quickest:** double-click `index.html`.
- **Local server (closer to the hosted version):** run `python3 -m http.server` in this folder, then open <http://localhost:8000>.

## Add or edit a timeline entry

All timeline entries are in `content/timeline.js`. Open that file in a text editor.

1. Find an existing entry and copy the whole entry, from its opening `{` to its closing `},`. Paste the copy beside the other entries.
2. Replace the person's name, year, headline, story and connection to South-View. Add the names and website addresses of your sources.
3. On the line labeled `id`, give the new entry its own short link name, such as `new-person`. Use lowercase letters and dashes, with no spaces.
4. To add a picture, put it in `assets/images/archive/`. In the copied entry, replace the old picture's filename with yours. Add a short description of what the picture shows, a caption, and the name and website of its owner. Use the picture's width and height in pixels (shown in its file properties). If there is no picture yet, leave its address empty (`''`); the page will show an “archival image needed” box.
5. Keep the existing commas, quotation marks and brackets in place. Write the year as a number, without quotation marks. Save the file, refresh the website, and check the new entry's date, wording, picture and links. The page puts entries in year order for you.

To edit an entry, find its headline and change its text. To remove one, delete the whole entry, from `{` through the closing `},`.

The example below shows which lines to replace:

```js
{
  id: 'ludie-clay-andrews',       // give each entry its own short link name
  year: 1920,                     // year used to put entries in order
  date: '1914 – 1920',            // date readers see on the card
  person: 'Ludie Clay Andrews',
  title: 'Opening doors for Black nurses',
  description: '…',
  whyItBelongs: '…',              // shown as "Connection to South-View"
  media: {
    type: 'Historical photograph',
    src: 'assets/images/archive/ludie-clay-andrews.jpg',  // replace this picture's filename
    width: 356, height: 462,      // picture size, found in its file properties
    alt: '…', caption: '…', credit: '…', creditUrl: '…',
    suggestion: '…'               // describe a picture to find if none is available yet
  },
  sources: [{ label: 'Historical background', url: '…' }],
  focus: 'grady',                 // which landmark the skyline moves toward
  status: 'researched',           // use 'draft' for work that still needs review
  note: '…'                       // a private note for the team; readers will not see it
},
```

For pictures, a JPG about 800–1000 pixels along its longer side is usually enough. Keep the copied skyline landmark unless another location fits better. The available names are `railroad`, `capitol`, `kimball-house`, `auc`, `grady`, `sweet-auburn`, `ebenezer`, `fulton-county-stadium`, `turner-field`, `georgia-dome`, `downtown`, `midtown`, `skyline`, and `south-view`.

The opening text, section introductions and ending are in the same file, above the entries. Before publishing, change `showStatusLabels: true` to `showStatusLabels: false` to hide the Draft and Placeholder tags.

If an entry does not appear, check that it has a year and headline, its own short link name, and the same punctuation as the entry you copied.

## Content status

- **Researched (team):** Turner, Grant, Herndon, Andrews and Dobbs, all from *Research pre-civil rights*.
- **Civil Rights research:** Borders, McPheeters, Smith-Robinson, Lewis at Selma, Hamilton, Bond, Aaron’s Atlanta debut and King Sr.’s church leadership are based on *South_View_Civil_Rights_Research_Word_Style.pdf*. Each includes the listed archival image or document, historical sources and evidence of a connection to South-View. The existing later entries for Aaron, King Sr. and Lewis remain in place.
- **Draft:** the section intros, King Jr.’s 1968 funeral and the Post–Civil Rights entries (Aaron’s 1974 record, King Sr.’s 1984 burial, Russell, Lewis’s 2020 burial and the 2026 National Register listing) still need team review.
- **Images:** the eight Civil Rights research entries have local archival images. McPheeters’s image is the first newspaper scan in the listed clippings document; the original is faint. Smith-Robinson’s image is a still at approximately 00:50 in the listed May 23, 1966 WSB-TV newsfilm. Archive watermarks are retained. Entries outside this research still show placeholders where images are missing.
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
