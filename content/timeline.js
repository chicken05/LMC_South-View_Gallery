/* ==========================================================================
   SOUTH-VIEW TIMELINE — CONTENT FILE
   --------------------------------------------------------------------------
   This is the only file you need to edit to add, remove, or change timeline
   entries. Keep the existing commas, quotation marks and brackets in place.
   Write years as numbers, without quotation marks.

   ADD AN ENTRY
   1. Find a complete entry below, from its opening { to its closing },.
      Copy it and paste the copy beside the other entries.
   2. Replace the name, year, headline, story and connection to South-View.
      Replace the source names and website addresses with your sources.
   3. Give the copy its own short link name on the line labeled id, such as
      'new-person'. Use lowercase letters and dashes, with no spaces.
   4. For a picture, put the image in assets/images/archive/. In the copied
      entry, replace the old picture's filename with yours. Add a short
      picture description, caption and the name and website of its owner.
      If you have no picture yet, leave the picture's address empty ('').
      The page will show an "archival image needed" box.
   5. Save this file and refresh the website. Check the date, wording,
      picture and links. The page puts entries in year order for you.

   REMOVE AN ENTRY   delete its whole entry, from { through the closing },.

   Entry fields (they mirror our research template):
     id            unique, lowercase-with-dashes; also the link anchor
                   (…/index.html#ludie-clay-andrews jumps straight to it)
     year          number — places the entry on the timeline and sets the
                   skyline to that year
     date          optional display date ("November 1863", "c. 1900")
     period        optional: "prologue" | "founding" | "civil-rights" |
                   "legacy" (otherwise worked out from the year)
     person        name(s) the entry is about
     title         short headline
     description   what happened
     whyItBelongs  the connection to South-View (shown under the heading
                   "Connection to South-View")
     media         { type, src, alt, caption, credit, creditUrl, suggestion }
                   type: "Historical photograph", "Historical illustration",
                   "Historical interview", "Document", …
     sources       list of { label, url }
     focus         optional: point the skyline camera at a landmark —
                   "railroad", "capitol", "kimball-house", "auc", "grady",
                   "sweet-auburn", "ebenezer", "fulton-county-stadium",
                   "turner-field", "georgia-dome", "downtown", "midtown",
                   "skyline", "south-view"
     status        "researched" (team-verified) | "draft" (sourced, needs
                   team review) | "placeholder" (research still needed)
     note          internal note for the team — never shown on the page
   ========================================================================== */

window.SOUTHVIEW_CONTENT = {
  site: {
    title: 'South-View',
    kicker: "Atlanta's oldest African American–controlled burial ground",
    dek:
      'Founded in 1886 by Black Atlantans who had been made to use the back gates of the city’s cemeteries, South-View holds the story of Black Atlanta, from Reconstruction through the Civil Rights Movement to today. Scroll down to move through time and watch the city they helped build rise on the horizon.',
    startYear: 1860,
    endYear: 2026,
    // set to false before publishing to hide the "Draft" / "Placeholder" tags
    showStatusLabels: true,
    finale: {
      title: 'The view from South-View',
      text:
        'More than 80,000 people rest on South-View’s hills: founders and the families of the formerly enslaved, ministers and nurses, business owners and athletes, and leaders of a movement that changed the nation. Their work is part of the skyline on the horizon.',
      address: 'South-View Cemetery · 1990 Jonesboro Road SE, Atlanta, Georgia',
      sources: [
        { label: 'South-View Cemetery Association — Our History', url: 'https://southviewcemetery.com/our-history/' },
        { label: 'Historic South-View Preservation Foundation', url: 'https://www.southviewpreservation.com/historyintheneighborhood' },
        { label: 'Building Memories: South-View Cemetery (Georgia Tech)', url: 'https://leading-edge.iac.gatech.edu/building-memories/southview-cemetery' },
      ],
    },
    credits: {
      course: 'LMC 3403 · Georgia Tech · Fall 2026',
      team: '[Team member names]',
      note: 'Prototype. Skyline illustration is an artistic interpretation drawn in code; landmark dates are approximate.',
    },
  },

  /* The story is told in a short prologue and three parts. `start`/`end`
     are the years each part covers (used for the timeline indicator). */
  periods: [
    {
      id: 'prologue',
      number: 'Prologue',
      title: 'Before South-View',
      years: '1863 – 1885',
      start: 1860,
      end: 1885.9,
      intro:
        'Atlanta was a railroad town when the Civil War reached it in 1864. Over the next two decades, formerly enslaved people rebuilt their lives in the city: they founded churches and businesses, and they fought for the political rights that Reconstruction promised.',
      status: 'draft',
    },
    {
      id: 'founding',
      number: 'Part I',
      title: 'Founding & Early History',
      years: '1886 – 1949',
      start: 1886,
      end: 1949.9,
      intro:
        'In February 1886, nine Black businessmen, among them Jacob McKinley, George W. Graham, Robert Grant, Charles H. Morgan, John Render and Albert Watts, petitioned the State of Georgia for a charter to create a cemetery of their own. Black Atlantans had been forced to use back gates at the city’s cemeteries, and South-View, chartered that April, gave families a place to bury their dead with dignity.',
      status: 'draft',
    },
    {
      id: 'civil-rights',
      number: 'Part II',
      title: 'Civil Rights Era',
      years: '1950 – 1969',
      start: 1950,
      end: 1969.9,
      intro:
        'In the 1950s and 1960s, Atlanta’s Black colleges, churches and businesses became a headquarters of the Civil Rights Movement. Many of the students, ministers and lawmakers who led it now rest at South-View.',
      status: 'draft',
    },
    {
      id: 'legacy',
      number: 'Part III',
      title: 'Post–Civil Rights',
      years: '1970 – Today',
      start: 1970,
      end: 2026,
      intro:
        'After the movement, Atlanta changed fast: a new skyline went up, MARTA was built, and the Olympics came to the city. South-View remains a family-run institution led by descendants of its founders, and in 2026, its 140th year, it was listed on the National Register of Historic Places.',
      status: 'draft',
    },
  ],

  entries: [
    /* ------------------------------------------------------------ PROLOGUE */
    {
      id: 'henry-mcneal-turner',
      year: 1863,
      date: 'November 1863',
      period: 'prologue',
      person: 'Henry McNeal Turner',
      title: 'Serving during the Civil War',
      description:
        'In 1863, Henry McNeal Turner helped organize the First Regiment of United States Colored Troops and served as its chaplain. After the war, he became a Georgia state legislator during Reconstruction and a bishop in the African Methodist Episcopal Church. His work combined religious leadership with the fight for Black political rights.',
      whyItBelongs:
        'Turner’s life reminds visitors that the struggle for equality began generations before the modern Civil Rights Movement. His burial at South-View connects the cemetery to the Civil War and Reconstruction, when formerly enslaved people were working to build new lives and claim political rights.',
      media: {
        type: 'Historical illustration',
        src: 'assets/images/archive/henry-mcneal-turner-1863.jpg',
        width: 666,
        height: 860,
        alt: 'Engraved portrait of Rev. Henry McNeal Turner in a dark coat and white cravat, captioned “Rev. H. M. Turner, Chaplain First United States Colored Regiment.”',
        caption: '“Rev. H. M. Turner, Chaplain First United States Colored Regiment,” 1863.',
        credit: 'Library of Congress',
        creditUrl: 'https://www.loc.gov/item/2009630222',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.georgiaencyclopedia.org/articles/arts-culture/henry-mcneal-turner-1834-1915' },
        { label: 'Connection to South-View', url: 'https://www.georgiaencyclopedia.org/articles/arts-culture/black-cemeteries' },
      ],
      focus: 'railroad',
      status: 'researched',
    },

    /* ------------------------------------------------- PART I: FOUNDING */
    {
      id: 'robert-grant',
      year: 1886,
      date: '1886',
      person: 'Robert Grant',
      title: 'Helping establish South-View',
      description:
        'Robert Grant was a Black businessman, blacksmith, and religious leader in Atlanta. He helped establish South-View Cemetery in 1886, when Black Atlantans faced discrimination in burial practices. Grant also played an important role in the founding of Zion Hill Baptist Church.',
      whyItBelongs:
        'At a time when Black Atlantans faced discrimination even in death, Grant helped create a place where families could bury their loved ones with dignity. South-View’s continued existence reflects the efforts of its founders to provide for their community.',
      media: {
        type: 'Historical portrait',
        src: 'assets/images/archive/robert-grant.jpg',
        width: 305,
        height: 404,
        alt: 'Engraved portrait of Robert Grant, a bearded man in a suit and tie.',
        caption: 'Portrait of Robert Grant (original date to be verified).',
        credit: 'Zion Hill Baptist Church history archive',
        creditUrl: 'https://www.zionhill.org/historyarchive',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.zionhill.org/historyarchive' },
        { label: 'Connection to South-View', url: 'https://www.southviewpreservation.com/historyintheneighborhood' },
      ],
      focus: 'south-view',
      status: 'researched',
      note: 'Portrait’s original date and reproduction permission still need verification.',
    },
    {
      id: 'alonzo-herndon',
      year: 1905,
      date: '1905',
      person: 'Alonzo Herndon',
      title: 'Building a business during segregation',
      description:
        'Born into slavery in 1858, Alonzo Herndon became a successful Atlanta businessman. In 1905, he purchased a mutual aid association that eventually grew into Atlanta Life Insurance Company. He also supported community institutions, including the Southview Cemetery Association.',
      whyItBelongs:
        'Herndon built successful businesses despite the racial barriers facing Black Atlantans. His support for the Southview Cemetery Association shows how his achievements also benefited local institutions. His story connects business success with investment in the community.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/alonzo-herndon-c1900.jpg',
        width: 799,
        height: 1024,
        alt: 'Black-and-white studio portrait of Alonzo Herndon wearing round spectacles, a dark suit and a patterned tie.',
        caption: 'Alonzo Herndon, c. 1900.',
        credit: 'Atlanta University Center Robert W. Woodruff Library, via the Digital Library of Georgia',
        creditUrl: 'https://dlg.usg.edu/record/auu_auc-001_auc-001-1139',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.georgiaencyclopedia.org/articles/business-economy/alonzo-herndon-1858-1927' },
        { label: 'Connection to South-View', url: 'https://www.georgiaencyclopedia.org/articles/business-economy/alonzo-herndon-1858-1927' },
      ],
      focus: 'sweet-auburn',
      status: 'researched',
    },
    {
      id: 'ludie-clay-andrews',
      year: 1920,
      date: '1914 – 1920',
      person: 'Ludie Clay Andrews',
      title: 'Opening doors for Black nurses',
      description:
        'Ludie Clay Andrews helped organize the Grady Municipal Training School for Colored Nurses in 1914. She challenged restrictions that prevented Black nurses from obtaining state registration and became Georgia’s first Black registered nurse in 1920. Her work helped expand professional opportunities for Black women in healthcare.',
      whyItBelongs:
        'Andrews challenged barriers that kept qualified Black nurses from receiving professional recognition. Her efforts helped future generations of nurses pursue careers in healthcare. She is buried at South-View, connecting the cemetery to an important chapter in Georgia’s nursing history.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/ludie-clay-andrews.jpg',
        width: 356,
        height: 462,
        alt: 'Color photograph of Ludie Clay Andrews, an older woman with gray hair, smiling and looking down, wearing a dark dress and a pearl necklace.',
        caption: 'Ludie Clay Andrews (photograph date unknown).',
        credit: 'Georgia Women of Achievement',
        creditUrl: 'https://www.georgiawomen.org/ludie-clay-andrews',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.georgiawomen.org/ludie-clay-andrews' },
        { label: 'Connection to South-View', url: 'https://leading-edge.iac.gatech.edu/building-memories/southview-cemetery' },
      ],
      focus: 'grady',
      status: 'researched',
    },
    {
      id: 'john-wesley-dobbs',
      year: 1939,
      date: 'December 2, 1939',
      person: 'John Wesley Dobbs',
      title: 'A voice for political change',
      description:
        'John Wesley Dobbs worked to increase Black political participation in Atlanta during segregation. He led the Atlanta Civic and Political League in the 1930s, encouraging greater community involvement in politics. In a 1939 interview, he shared his experiences growing up and becoming a community leader.',
      whyItBelongs:
        'Decades before the major Civil Rights marches, Dobbs was helping Black Atlantans build political influence. His story shows how earlier generations laid the groundwork for the struggle for voting rights. His burial at South-View connects the cemetery to this history of local organizing.',
      media: {
        type: 'Historical interview',
        src: 'assets/images/archive/john-wesley-dobbs.jpg',
        width: 700,
        height: 1024,
        alt: 'Black-and-white portrait of John Wesley Dobbs in a dark three-piece suit with a polka-dot tie and pocket square.',
        caption: 'Interview conducted December 2, 1939, by Geneva Tensill. Portrait of John Wesley Dobbs.',
        credit: 'New Georgia Encyclopedia',
        creditUrl: 'https://www.georgiaencyclopedia.org/articles/history-archaeology/john-wesley-dobbs-1882-1961',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.georgiaencyclopedia.org/articles/history-archaeology/john-wesley-dobbs-1882-1961' },
        { label: 'Connection to South-View', url: 'https://leading-edge.iac.gatech.edu/building-memories/southview-cemetery' },
      ],
      focus: 'sweet-auburn',
      status: 'researched',
    },

    /* --------------------------------------------- PART II: CIVIL RIGHTS */
    {
      id: 'placeholder-1950s',
      year: 1955,
      date: '1950s',
      person: 'Research in progress',
      title: 'A 1950s South-View story',
      description:
        'This space is reserved for a researched entry from the 1950s. To fill it, find someone buried at South-View whose work in that decade shaped Black Atlanta, confirm the burial with a reliable source, and add a photograph or document.',
      whyItBelongs: 'Add the person’s connection to South-View here, with a source link below.',
      media: {
        type: 'Archival image',
        src: '',
        suggestion: 'A dated photograph or document from the 1950s.',
      },
      sources: [],
      focus: 'capitol',
      status: 'placeholder',
    },
    {
      id: 'ruby-doris-smith-robinson',
      year: 1961,
      date: 'February 1961',
      person: 'Ruby Doris Smith-Robinson',
      title: 'Jail, no bail',
      description:
        'As a Spelman College student, Ruby Doris Smith joined the Atlanta Student Movement’s sit-ins in 1960. In February 1961 she went to Rock Hill, South Carolina, where protesters served 30 days in jail rather than pay bail, and that May she rode with the Freedom Riders. In 1966 she became the first woman elected executive secretary of the Student Nonviolent Coordinating Committee (SNCC).',
      whyItBelongs:
        'She died in 1967, at just 25, and is buried at South-View. Her story is a reminder that young women were central to the movement’s strategy and leadership.',
      media: {
        type: 'Historical photograph',
        src: '',
        suggestion: 'A portrait of Ruby Doris Smith-Robinson (check rights with the source archive).',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.kennesaw.edu/atlanta-student-movement/historical-people/ruby-dorris-smith-robinson.php' },
        { label: 'Connection to South-View', url: 'https://leading-edge.iac.gatech.edu/building-memories/southview-cemetery' },
      ],
      focus: 'auc',
      status: 'draft',
    },
    {
      id: 'grace-towns-hamilton',
      year: 1965,
      date: '1965',
      person: 'Grace Towns Hamilton',
      title: 'A seat under the gold dome',
      description:
        'Grace Towns Hamilton led the Atlanta Urban League from 1943 to 1960, working on housing, health care, education and voter registration. In a 1965 special election she won a seat in the Georgia House of Representatives, the first Black woman elected to the Georgia General Assembly. She served for nearly two decades and was a principal architect of Atlanta’s 1973 city charter.',
      whyItBelongs:
        'Hamilton turned years of community organizing into political power at the State Capitol. She died in 1992 and is buried at South-View.',
      media: {
        type: 'Historical photograph',
        src: '',
        suggestion: 'A portrait from the Grace Towns Hamilton Papers (Atlanta History Center or the AUC Woodruff Library).',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.wabe.org/homes-of-georgias-first-black-female-house-representative-to-be-preserved-as-historical-sites-in-vine-city/' },
        { label: 'Connection to South-View', url: 'https://en.wikipedia.org/wiki/Grace_Towns_Hamilton' },
      ],
      focus: 'capitol',
      status: 'draft',
      note: 'Sources disagree on her final year in office (1984 vs. January 1985) — confirm before stating it.',
    },
    {
      id: 'martin-luther-king-jr',
      year: 1968,
      date: 'April 9, 1968',
      person: 'Dr. Martin Luther King Jr.',
      title: 'A procession to South-View',
      description:
        'After Dr. King was assassinated in Memphis on April 4, 1968, his funeral began at Ebenezer Baptist Church. A wooden farm wagon pulled by two mules carried his casket three and a half miles to Morehouse College as more than 100,000 people watched. He was then buried at South-View Cemetery.',
      whyItBelongs:
        'South-View was King’s first resting place. In 1970 his remains were moved to a tomb beside Ebenezer, now part of the King Center. His parents, Martin Luther King Sr. and Alberta Williams King, are buried at South-View.',
      media: {
        type: 'Historical photograph',
        src: '',
        suggestion: 'A photograph of the mule-drawn wagon procession on April 9, 1968.',
      },
      sources: [
        { label: 'Historical background', url: 'https://en.wikipedia.org/wiki/Funeral_of_Martin_Luther_King_Jr.' },
        { label: 'Connection to South-View', url: 'https://www.atlantanewsfirst.com/2022/02/09/atlantas-south-view-cemetery-is-walk-through-black-history/' },
      ],
      focus: 'ebenezer',
      status: 'draft',
    },

    /* ------------------------------------------ PART III: POST–CIVIL RIGHTS */
    {
      id: 'hank-aaron',
      year: 1974,
      date: 'April 8, 1974',
      person: 'Hank Aaron',
      title: '715',
      description:
        'In front of a sellout crowd of 53,775 at Atlanta–Fulton County Stadium, Hank Aaron hit his 715th career home run and broke Babe Ruth’s record. He had received hate mail and threats throughout the chase.',
      whyItBelongs:
        'Aaron died in January 2021 and was buried at South-View, just a few miles south of where he hit the record-breaking home run.',
      media: {
        type: 'Historical photograph',
        src: '',
        suggestion: 'A photograph of home run 715 on April 8, 1974, or of Aaron at Atlanta Stadium.',
      },
      sources: [
        { label: 'Historical background', url: 'https://baseballhall.org/discover-more/stories/inside-pitch/henry-aaron-hits-home-run-number-715' },
        { label: 'Connection to South-View', url: 'https://www.clickondetroit.com/sports/2021/01/27/the-hammer-makes-one-last-trip-to-spot-where-he-hit-no-715/' },
      ],
      focus: 'fulton-county-stadium',
      status: 'draft',
    },
    {
      id: 'martin-luther-king-sr',
      year: 1984,
      date: 'November 1984',
      person: 'Martin Luther King Sr.',
      title: '“Daddy King” comes home',
      description:
        'Martin Luther King Sr. was senior pastor of Ebenezer Baptist Church from 1931 to 1975 and a local civil rights leader who fought for equal salaries for Atlanta’s Black teachers. He lived through the assassinations of his son in 1968 and of his wife, Alberta Williams King, who was shot at Ebenezer during a Sunday service in 1974.',
      whyItBelongs:
        'When he died on November 11, 1984, King Sr. was buried next to Alberta at South-View, where their younger son, the civil rights leader A. D. King, is also buried.',
      media: {
        type: 'Historical photograph',
        src: '',
        suggestion: 'A portrait of Martin Luther King Sr. at Ebenezer Baptist Church.',
      },
      sources: [
        { label: 'Historical background', url: 'https://en.wikipedia.org/wiki/Martin_Luther_King_Sr.' },
        { label: 'Connection to South-View', url: 'https://roughdraftatlanta.com/2026/05/05/south-view-cemetery-historic-atlanta/' },
      ],
      focus: 'ebenezer',
      status: 'draft',
    },
    {
      id: 'herman-j-russell',
      year: 1992,
      date: '1950s – 2014',
      person: 'Herman J. Russell',
      title: 'Building the skyline',
      description:
        'Herman J. Russell grew a small plastering business into one of the country’s largest minority-owned construction and real estate firms. His company helped build Hartsfield-Jackson International Airport, the Georgia Dome, Turner Field and Philips Arena. In the early 1960s he became the first Black member of the Atlanta Chamber of Commerce.',
      whyItBelongs:
        'Russell counted Dr. King as a friend and worked behind the scenes with counsel and funding, including helping Maynard Jackson become Atlanta’s first Black mayor in 1973. He died in 2014 and is buried at South-View, in the city he helped build.',
      media: {
        type: 'Historical photograph',
        src: '',
        suggestion: 'A portrait of Herman J. Russell, or a construction photo from one of his projects.',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.georgiaencyclopedia.org/articles/business-economy/herman-j-russell-1930-2014/' },
        { label: 'Connection to South-View', url: 'https://en.wikipedia.org/wiki/Herman_J._Russell' },
      ],
      focus: 'georgia-dome',
      status: 'draft',
    },
    {
      id: 'john-lewis',
      year: 2020,
      date: 'July 30, 2020',
      person: 'John Lewis',
      title: 'Good trouble, laid to rest',
      description:
        'John Lewis chaired SNCC, spoke at the 1963 March on Washington, and was beaten while leading marchers across the Edmund Pettus Bridge in Selma in 1965. He represented Atlanta in Congress from 1987 until his death in July 2020.',
      whyItBelongs:
        'After lying in state at the U.S. Capitol, Lewis was eulogized at Ebenezer Baptist Church on July 30, 2020, and buried at South-View, alongside many of the movement’s leaders.',
      media: {
        type: 'Historical photograph',
        src: '',
        suggestion: 'His official congressional portrait (works of the U.S. government are generally public domain).',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.wsls.com/news/politics/2020/07/30/john-lewis-funeral-set-for-atlanta-church-that-mlk-once-led/' },
        { label: 'Connection to South-View', url: 'https://www.wsbtv.com/news/local/atlanta/what-is-south-view-cemetery-heres-history-where-john-lewis-is-buried/CSKPZVG6PFFJXKD3XKCOPKRP2I' },
      ],
      focus: 'downtown',
      status: 'draft',
    },
    {
      id: 'national-register-2026',
      year: 2026,
      date: 'July 6, 2026',
      person: 'South-View Cemetery',
      title: '140 years, on the National Register',
      description:
        'In its 140th year, South-View Cemetery was listed on the National Register of Historic Places on July 6, 2026. More than 80,000 people rest across its 100 acres in southeast Atlanta’s Lakewood Heights neighborhood.',
      whyItBelongs:
        'The listing recognizes what families have long known: the people buried at South-View built Black Atlanta and helped change the nation. Descendants of the founders still lead the cemetery today.',
      media: {
        type: 'Photograph',
        src: '',
        suggestion: 'Our own photograph of South-View today.',
      },
      sources: [
        { label: 'National Park Service weekly list', url: 'https://home.nps.gov/subjects/nationalregister/weekly-list-2026-07-10.htm' },
        { label: 'Rough Draft Atlanta', url: 'https://roughdraftatlanta.com/2026/05/05/south-view-cemetery-historic-atlanta/' },
      ],
      focus: 'skyline',
      status: 'draft',
    },
  ],
};
