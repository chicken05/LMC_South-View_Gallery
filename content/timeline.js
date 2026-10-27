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
      id: 'william-holmes-borders',
      year: 1957,
      date: 'January 9, 1957',
      person: 'William Holmes Borders',
      title: 'Challenging segregation on Atlanta buses',
      description:
        'In January 1957, William Holmes Borders and five other Black ministers took seats at the front of a segregated Atlanta bus. Their Love, Law, and Liberation campaign used a planned protest and arrests to challenge segregation in court. Borders, pastor of Wheat Street Baptist Church, brought church leadership into the fight for equal access to public transportation. Atlanta’s buses were desegregated in 1959.',
      whyItBelongs:
        'Borders helped turn the organizing strength of Atlanta’s Black churches into civil rights action. When he died in 1993, John Lewis spoke at his funeral, and a graveside service followed at South-View. Their connection links this early campaign to the movement’s next generation.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/william-holmes-borders-bus-1957.jpg',
        width: 1200,
        height: 780,
        alt: 'Black ministers seated at the front of an Atlanta bus during the protest led by William Holmes Borders, with onlookers outside the windows.',
        caption: 'Borders and other ministers challenge bus segregation in Atlanta, January 9, 1957.',
        credit: 'Atlanta Journal-Constitution Photographic Archives, Georgia State University Library',
        creditUrl: 'https://dlg.usg.edu/record/gsu_ajc_5944',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.georgiaencyclopedia.org/articles/arts-culture/william-holmes-borders-1905-1993/' },
        { label: 'Letter to Dr. King', url: 'https://kinginstitute.stanford.edu/king-papers/documents/william-holmes-borders' },
        { label: 'Connection to South-View', url: 'https://dlg.usg.edu/record/gsu_ajc_14596' },
      ],
      focus: 'sweet-auburn',
      status: 'researched',
    },
    {
      id: 'annie-l-mcpheeters',
      year: 1959,
      date: '1959 – 1966',
      person: 'Annie L. McPheeters',
      title: 'Opening Atlanta libraries to more readers',
      description:
        'Annie L. McPheeters built reading programs and a collection of Black history at Atlanta’s segregated public libraries. She worked with advocacy groups that won the desegregation of library services in 1959. In 1966 she joined Georgia State College as a reference librarian, becoming its first Black faculty appointee. Her work widened access to books, education and the history of Black Atlanta.',
      whyItBelongs:
        'Like the campaign against bus segregation, McPheeters’s work challenged barriers in everyday public life. Her funeral program records her burial at South-View in December 1994, connecting the cemetery to the librarians and educators who helped open the city’s institutions.',
      media: {
        type: 'Historical document',
        src: 'assets/images/archive/annie-l-mcpheeters-clipping-1966.jpg',
        width: 720,
        height: 1143,
        alt: 'Archival newspaper clipping with a portrait of Annie L. McPheeters and a report of her appointment to the faculty at Georgia State College. The original scan is faint.',
        caption: 'The Atlanta Inquirer reports McPheeters’s appointment to Georgia State College, July 23, 1966. Original archival scan.',
        credit: 'Annie L. McPheeters Papers, Auburn Avenue Research Library, via the Digital Library of Georgia',
        creditUrl: 'https://dlg.usg.edu/record/dlg_aaed_aarl90-005-001-003',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.georgiaencyclopedia.org/articles/education/annie-l-mcpheeters-1908-1994/' },
        { label: 'Auburn Branch history', url: 'https://georgialibraries.omeka.net/s/AARL/page/Gallery' },
        { label: 'Connection to South-View', url: 'https://dlg.usg.edu/record/aarl_afpc_mcpheetersanniel19941229' },
      ],
      focus: 'sweet-auburn',
      status: 'researched',
    },
    {
      id: 'ruby-doris-smith-robinson',
      year: 1961,
      date: '1961 – 1966',
      person: 'Ruby Doris Smith-Robinson',
      title: 'Keeping the movement organized',
      description:
        'As a Spelman student, Ruby Doris Smith joined Atlanta’s sit-ins, the Rock Hill jail-no-bail protests and the Freedom Rides. In the Atlanta office of the Student Nonviolent Coordinating Committee (SNCC), she organized supplies, transportation and support for workers in the field. In 1966 she became SNCC’s executive secretary, the first woman to hold the position. Her daily work helped sustain the movement’s protests and voter-registration campaigns.',
      whyItBelongs:
        'Robinson’s organizing supported the work of John Lewis, Julian Bond and others in SNCC. She died in 1967, at just 25. A South-View cemetery record card preserves her connection to the place where many of the movement’s leaders now rest.',
      media: {
        type: 'Historical newsfilm still',
        src: 'assets/images/archive/ruby-doris-smith-robinson-sncc-1966.jpg',
        width: 640,
        height: 486,
        alt: 'Ruby Doris Smith-Robinson speaking at a SNCC meeting in Atlanta, in a black-and-white frame from WSB-TV newsfilm.',
        caption: 'Ruby Doris Smith-Robinson at a SNCC meeting in Atlanta, May 23, 1966. Still from silent WSB-TV newsfilm.',
        credit: 'WSB-TV Newsfilm Collection, Walter J. Brown Media Archives, University of Georgia Libraries; Henry W. Grady College of Journalism and Mass Communication',
        creditUrl: 'https://dlg.usg.edu/record/ugabma_wsbn_wsbn38936',
      },
      sources: [
        { label: 'Historical background', url: 'https://snccdigital.org/people/ruby-doris-smith-robinson/' },
        { label: 'SNCC organizers remember', url: 'https://www.gpb.org/news/2023/02/27/uber-how-1960s-civil-rights-activists-built-motor-fleet-out-of-their-atlanta' },
        { label: 'Connection to South-View', url: 'https://dlg.usg.edu/record/auu_auc-078_auc-078-0137' },
      ],
      focus: 'auc',
      status: 'researched',
    },
    {
      id: 'john-lewis-selma',
      year: 1965,
      date: 'March 7, 1965',
      person: 'John Lewis',
      title: 'From Washington to Selma',
      description:
        'John Lewis chaired SNCC from 1963 to 1966 and spoke at the 1963 March on Washington for Jobs and Freedom. On March 7, 1965, he and Hosea Williams led voting-rights marchers across the Edmund Pettus Bridge in Selma, Alabama. State troopers attacked the marchers on what became known as Bloody Sunday, bringing national attention to the struggle for Black voting rights.',
      whyItBelongs:
        'Lewis carried the work of student organizing into a national campaign for political rights. He later represented Atlanta in Congress and was buried at South-View in 2020. His story connects the cemetery to both the movement’s marches and its lasting work in government.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/john-lewis-selma-1965.jpg',
        width: 1200,
        height: 790,
        alt: 'Hosea Williams and John Lewis lead a line of marchers across the Edmund Pettus Bridge in Selma, Alabama, on Bloody Sunday.',
        caption: 'Hosea Williams and John Lewis lead marchers at Selma, March 7, 1965.',
        credit: 'Tom Lankford / Birmingham News, Alabama Department of Archives and History',
        creditUrl: 'https://digital.archives.alabama.gov/digital/collection/amg/id/59645/',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.archives.gov/research/african-americans/individuals/john-lewis' },
        { label: 'March on Washington program', url: 'https://www.archives.gov/milestone-documents/official-program-for-the-march-on-washington' },
        { label: 'Connection to South-View', url: 'https://citydesign.atlantaga.gov/blog/2022/7/28/promised-land-a-tour-of-atlantas-historically-african-american-cemeteries-and-the-graves-of-civil-rights-pioneers' },
      ],
      focus: 'auc',
      status: 'researched',
    },
    {
      id: 'grace-towns-hamilton',
      year: 1965,
      date: 'June 1965',
      person: 'Grace Towns Hamilton',
      title: 'A seat under the gold dome',
      description:
        'Grace Towns Hamilton led the Atlanta Urban League from 1943 to 1960, working on housing, health care, education and voter registration. In June 1965 she won a seat in the Georgia House of Representatives, becoming the first Black woman elected to the Georgia General Assembly. Her election carried years of community organizing into a state government that had long excluded Black Atlantans.',
      whyItBelongs:
        'Hamilton’s election shows how the struggle for voting rights opened a path to public office. She took her place in the legislature while fellow organizer Julian Bond faced exclusion from his seat. She died in 1992 and is buried at South-View.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/grace-towns-hamilton-1965.jpg',
        width: 1017,
        height: 1200,
        alt: 'Grace Towns Hamilton in a patterned jacket and dark necklace, standing in front of a map of Atlanta.',
        caption: 'Grace Towns Hamilton during the election season, May 19, 1965.',
        credit: 'Guy Hayes / Atlanta Journal-Constitution Photographic Archives, Georgia State University Library',
        creditUrl: 'https://dlg.usg.edu/record/gsu_ajc_8575',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.georgiaencyclopedia.org/articles/history-archaeology/grace-towns-hamilton-1907-1992' },
        { label: 'Hamilton’s papers', url: 'https://www.atlantahistorycenter.com/blog/grace-towns-hamilton-papers-collection/' },
        { label: 'Connection to South-View', url: 'https://leading-edge.iac.gatech.edu/building-memories/southview-cemetery/' },
      ],
      focus: 'capitol',
      status: 'researched',
    },
    {
      id: 'julian-bond',
      year: 1966,
      date: '1965 – 1967',
      person: 'Julian Bond',
      title: 'Demanding the right to serve',
      description:
        'Julian Bond helped found SNCC and served as its communications director. Elected to the Georgia House in 1965, he was refused his seat in January 1966 after supporting SNCC’s criticism of the Vietnam War. He challenged the decision, and that December the U.S. Supreme Court ruled that his exclusion violated his freedom of speech. Bond finally took his seat in January 1967.',
      whyItBelongs:
        'Bond’s struggle shows that winning an election did not guarantee a place in government. His son Michael Julian Bond later recalled that the family interred a portion of his father’s cremated remains at South-View, where several generations of their family rest.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/julian-bond-house-1966.jpg',
        width: 1200,
        height: 883,
        alt: 'Julian Bond remains seated with his hands clasped while other Georgia House members stand and raise their right hands to take the oath of office.',
        caption: 'Bond watches fellow lawmakers take the oath while he is denied his seat, January 10, 1966.',
        credit: 'Bill Wilson / Atlanta Journal-Constitution Photographic Archives, Georgia State University Library',
        creditUrl: 'https://dlg.usg.edu/record/gsu_ajc_11921',
      },
      sources: [
        { label: 'Historical background', url: 'https://snccdigital.org/people/julian-bond/' },
        { label: 'Supreme Court decision', url: 'https://www.law.cornell.edu/supremecourt/text/385/116' },
        { label: 'Connection to South-View', url: 'https://canopyatlanta.org/2023/11/17/atlantans-share-their-familial-connections-to-south-view-cemetery/' },
      ],
      focus: 'capitol',
      status: 'researched',
    },
    {
      id: 'hank-aaron-atlanta',
      year: 1966,
      date: 'April 12, 1966',
      person: 'Hank Aaron',
      title: 'Professional baseball arrives in Atlanta',
      description:
        'When the Braves moved from Milwaukee to Atlanta in 1966, Hank Aaron became one of the city’s most visible Black athletes. On April 12, he played in Atlanta’s first Major League Baseball game, against the Pittsburgh Pirates at Atlanta Stadium. Aaron had faced racial barriers in segregated baseball and in the integrated major leagues. His arrival brought that experience into a Southern city still confronting discrimination.',
      whyItBelongs:
        'As Hamilton and Bond fought for representation at the Capitol, Aaron’s career showed another side of a changing Atlanta. He would break baseball’s home-run record in the same stadium in 1974. After his death in 2021, he was buried at South-View.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/hank-aaron-atlanta-1966.jpg',
        width: 1200,
        height: 805,
        alt: 'Hank Aaron follows through on a swing as a catcher and umpire crouch behind him during Atlanta’s first Major League Baseball game.',
        caption: 'Aaron bats against Pittsburgh at Atlanta Stadium, April 12, 1966.',
        credit: 'Marion Crowe / Atlanta Journal-Constitution Photographic Archives, Georgia State University Library',
        creditUrl: 'https://dlg.usg.edu/record/gsu_ajc_5788',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.georgiaencyclopedia.org/articles/sports-outdoor-recreation/hank-aaron-1934-2021/' },
        { label: 'Remembering Aaron’s life', url: 'https://www.mlb.com/braves/news/hank-aaron-life-remembered-by-braves-reporter-mark-bowman' },
        { label: 'Connection to South-View', url: 'https://citydesign.atlantaga.gov/blog/2022/7/28/promised-land-a-tour-of-atlantas-historically-african-american-cemeteries-and-the-graves-of-civil-rights-pioneers' },
      ],
      focus: 'fulton-county-stadium',
      status: 'researched',
    },
    {
      id: 'martin-luther-king-sr-civil-rights',
      year: 1966,
      date: 'December 4, 1966',
      person: 'Martin Luther King Sr.',
      title: 'A generation of church leadership',
      description:
        'Martin Luther King Sr., pastor of Atlanta’s Ebenezer Baptist Church, had long worked for Black civic and political rights. During the Civil Rights Movement he supported his son’s work while fearing for his family’s safety. In December 1966 he addressed the anniversary gathering of the Montgomery Improvement Association at Holt Street Baptist Church, linking Atlanta’s older generation of Black clergy to the wider movement.',
      whyItBelongs:
        'Like William Holmes Borders, King Sr. made the church a place for civil rights leadership. He and his wife, Alberta Williams King, are buried at South-View. The cemetery also became their son’s first resting place after his assassination in 1968; his remains were later moved.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/martin-luther-king-sr-montgomery-1966.jpg',
        width: 796,
        height: 1200,
        alt: 'Martin Luther King Sr., wearing glasses and a dark suit, speaks from a wooden pulpit at Holt Street Baptist Church.',
        caption: 'King Sr. speaks at Holt Street Baptist Church in Montgomery, December 4, 1966.',
        credit: 'Jim Peppler / Southern Courier, Alabama Department of Archives and History',
        creditUrl: 'https://crdl.usg.edu/record/aar_peppler_8378',
      },
      sources: [
        { label: 'Historical background', url: 'https://kinginstitute.stanford.edu/king-martin-luther-sr' },
        { label: 'King Sr. and his son, 1960', url: 'https://crdl.usg.edu/record/gsu_ajc_261' },
        { label: 'Connection to South-View', url: 'https://www.georgiahistory.com/ghmi_marker_updated/south-view-cemetery/' },
      ],
      focus: 'ebenezer',
      status: 'researched',
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
