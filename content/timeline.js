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
    showStatusLabels: false,
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
      team: 'Mickey Paulus · Rick Berglund · Sunny Lin · Vaishnavi Manivannan',
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
        'Turner’s work for Black citizenship connects South-View to Atlanta’s struggles over freedom and political power after the Civil War. His burial here links the cemetery to Reconstruction and to the churches and civic institutions that Black Atlantans built despite discrimination.',
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
        { label: 'Turner’s religious and political leadership (PBS)', url: 'https://www.pbs.org/thisfarbyfaith/people/henry_mcneal_turner.html' },
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
        'Robert Grant was a Black businessman, blacksmith and religious leader in Atlanta. He helped establish South-View Cemetery in 1886, when Black Atlantans faced discrimination in burial practices. As a founder of both South-View and Zion Hill Baptist Church, he helped build institutions that served the city’s Black community.',
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
        { label: 'South-View’s founders (Georgia Tech)', url: 'https://leading-edge.iac.gatech.edu/building-memories/southview-cemetery/' },
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
        'Born into slavery in 1858, Alonzo Herndon became a successful Atlanta barber and businessman. In 1905, he purchased a mutual aid association that eventually grew into Atlanta Life Insurance Company. His businesses provided services and opportunities for Black Atlantans during segregation, and he supported community institutions, including the South-View Cemetery Association.',
      whyItBelongs:
        'Herndon built successful businesses despite the racial barriers facing Black Atlantans. His support for the South-View Cemetery Association shows how his achievements also benefited local institutions. His story connects business success with investment in the community.',
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
        { label: 'Historical background and connection to South-View', url: 'https://www.georgiaencyclopedia.org/articles/business-economy/alonzo-herndon-1858-1927' },
        { label: 'Herndon historical marker (Georgia Historical Society)', url: 'https://www.georgiahistory.com/ghmi_marker_updated/alonzo-herndon-1858-1927/' },
        { label: 'Support for the cemetery association (Georgia Tech)', url: 'https://leading-edge.iac.gatech.edu/building-memories/southview-cemetery/' },
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
        'By challenging restrictions in nursing, Andrews widened opportunities for Black women in Atlanta’s hospitals. Her burial at South-View connects the cemetery to the nurses and educators who worked to make professional recognition and health care more accessible.',
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
        { label: 'Grady’s nursing schools (Georgia State University)', url: 'https://exhibits.library.gsu.edu/grady-exhibit/history-background/' },
      ],
      focus: 'grady',
      status: 'researched',
    },
    {
      id: 'david-t-howard',
      year: 1924,
      date: '1923–1924',
      period: 'founding',
      person: 'David T. Howard',
      title: 'Building opportunities through education',
      description:
        'Born into slavery in Georgia in 1849, David T. Howard became a successful Atlanta businessman and undertaker after emancipation. He supported Black community institutions and served on the South-View Cemetery Association’s board. In the early 1920s, he donated land for a school serving Black children. The school opened in 1924 during segregation; Martin Luther King Jr. attended from 1936 to 1940.',
      whyItBelongs:
        'Howard helped build institutions that offered Black families opportunity and dignity during segregation. He remains buried at South-View following his death in 1935. His school’s connection to King, initially buried here in 1968, links that earlier work to the Civil Rights Movement.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/david-t-howard-family-c1900.jpg',
        width: 640,
        height: 515,
        alt: 'David Tobias Howard, his mother Fannie Howard and his wife Ella Branner Howard seated in a horse-drawn carriage in Atlanta, with a house in the background.',
        caption: 'David T. Howard with his mother and wife, c. 1899–1900. Photograph assembled for W. E. B. Du Bois’s 1900 Paris Exposition collection; it predates the school’s 1924 opening.',
        credit: 'Library of Congress, Prints and Photographs Division · public domain',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:David_Tobias_Howard,_an_undertaker,_his_mother,_and_wife,_Atlanta,_Georgia;_seated_in_a_horse-drawn_carriage_with_tree-shaded_house_in_background_LCCN99472385.jpg',
      },
      sources: [
        { label: 'School history (Atlanta Public Schools)', url: 'https://howard.atlantapublicschools.us/our-school' },
        { label: 'Historical background (Atlanta Journal-Constitution)', url: 'https://www.ajc.com/lifestyles/david-howard-from-georgia-slave-atlanta-philanthropist/BlsNK0GcM6WPKVGIf43SBK/' },
        { label: 'King’s school years (Stanford)', url: 'https://kinginstitute.stanford.edu/publications/papers-martin-luther-king-jr-volume-i' },
        { label: 'Cemetery association (Georgia Tech)', url: 'https://leading-edge.iac.gatech.edu/building-memories/southview-cemetery/' },
        { label: 'Burial at South-View (The Atlanta Voice)', url: 'https://theatlantavoice.com/atlanta-cemetery-network-offers-glimpse-into-citys-history/' },
        { label: 'School opening (APS facilities director / COAA)', url: 'https://www.coaa.org/resources/howard-middle-school-building-stands-ready-for-its-second-century' },
        { label: 'Archival family photograph (Library of Congress)', url: 'https://www.loc.gov/item/99472385/' },
      ],
      focus: 'sweet-auburn',
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
        'Dobbs’s voter organizing helped Black Atlantans claim a greater voice in city government. His grandson, Maynard Jackson, later became Atlanta’s first Black mayor. Dobbs’s burial at South-View connects the cemetery to the local groundwork that made this political change possible.',
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
        { label: 'Original 1939 interview (Library of Congress)', url: 'https://tile.loc.gov/storage-services/service/mss/wpalh/wpalh-13070415/wpalh-13070415.pdf' },
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
        'Buried at South-View in December 1994, McPheeters represents the librarians and educators who widened access to Atlanta’s public institutions. Her work preserved Black history while making books and learning available to communities long excluded from equal library services.',
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
        'Robinson’s burial at South-View links the cemetery to the students and organizers who made Atlanta a center of the movement. Her work in SNCC’s Atlanta office helped sustain campaigns across the South and widened women’s leadership within civil rights organizing.',
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
        'Bond’s struggle shows how Atlanta’s civil rights organizers challenged exclusion from state government as well as segregation in daily life. His son Michael Julian Bond recalled that a portion of his father’s cremated remains was interred at South-View, where generations of their family rest.',
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
        'When the Braves moved from Milwaukee to Atlanta in 1966, Hank Aaron became one of the city’s most visible Black athletes. On April 12, he played in Atlanta’s first regular-season Major League Baseball game, against the Pittsburgh Pirates at Atlanta Stadium. Aaron had faced racial barriers in segregated baseball and in the integrated major leagues. His arrival brought that experience into a Southern city still confronting discrimination.',
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
        { label: 'The Braves’ first Atlanta season (Atlanta History Center)', url: 'https://www.atlantahistorycenter.com/exhibitions/atlanta-in-50-objects/the-atlanta-braves/' },
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
      period: 'civil-rights',
      person: 'Dr. Martin Luther King Jr.',
      title: 'A procession to South-View',
      description:
        'After Dr. Martin Luther King Jr.’s assassination in Memphis on April 4, 1968, Atlanta gathered to mourn him. On April 9, a service at Ebenezer Baptist Church preceded a procession to Morehouse College. Two mules pulled a wooden farm wagon carrying his casket; president emeritus Benjamin E. Mays delivered the eulogy at Morehouse. More than 100,000 people joined or witnessed the procession. King was then buried at South-View.',
      whyItBelongs:
        'A cemetery founded in response to racial discrimination became King’s first resting place, linking South-View’s beginnings to the Civil Rights Movement. His remains were moved to the King Center in 1970. His parents, Martin Luther King Sr. and Alberta Williams King, remain buried at South-View.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/martin-luther-king-jr-1964.jpg',
        width: 515,
        height: 640,
        alt: 'Black-and-white portrait of Dr. Martin Luther King Jr. in a dark suit and tie, with his right hand raised.',
        caption: 'Dr. Martin Luther King Jr., 1964. This portrait predates the April 9, 1968 funeral.',
        credit: 'Dick DeMarsico / New York World-Telegram & Sun, Library of Congress · public domain',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Martin_Luther_King_Jr_NYWTS.jpg',
      },
      sources: [
        { label: 'Funeral history (Stanford)', url: 'https://kinginstitute.stanford.edu/assassination-martin-luther-king-jr' },
        { label: 'Burial and relocation (National Park Service)', url: 'https://www.nps.gov/malu/a-strong-and-enduring-acknowledgment.htm' },
        { label: 'April 9, 1968 reporting (UPI)', url: 'https://www.upi.com/Archives/1968/04/09/Vast-throng-pays-King-last-tribute/2254143681508/' },
        { label: 'South-View marker (Georgia Historical Society)', url: 'https://www.georgiahistory.com/ghmi_marker_updated/south-view-cemetery/' },
        { label: 'Burial photograph (permission required)', url: 'https://dlg.usg.edu/record/geh_athpc_1310' },
        { label: 'Procession photograph (permission required)', url: 'https://dlg.usg.edu/record/geh_jilson_515' },
      ],
      focus: 'ebenezer',
      status: 'researched',
    },

    /* ------------------------------------------ PART III: POST–CIVIL RIGHTS */
    {
      id: 'hank-aaron',
      year: 1974,
      date: 'April 8, 1974',
      person: 'Hank Aaron',
      title: '715',
      description:
        'On April 8, 1974, Hank Aaron hit his 715th career home run before a sellout crowd of 53,775 at Atlanta–Fulton County Stadium, passing Babe Ruth’s record. The fourth-inning home run came off Los Angeles Dodgers pitcher Al Downing. Aaron reached the milestone despite racist hate mail and threats throughout the chase.',
      whyItBelongs:
        'Aaron died in January 2021 and was buried at South-View, a few miles south of the stadium site. His achievements and endurance in the face of racism connect the cemetery to the struggle for equality in American sports.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/hank-aaron-1974.jpg',
        width: 364,
        height: 440,
        alt: 'Hank Aaron in an Atlanta Braves uniform and cap, seated with his arms folded.',
        caption: 'Hank Aaron in an Atlanta Braves publicity portrait, 1974.',
        credit: 'Photographer unknown / Texas Rangers, via Wikimedia Commons · public domain in the United States',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Hank_Aaron_1974.jpg',
      },
      sources: [
        { label: 'Historical background', url: 'https://baseballhall.org/discover-more/stories/inside-pitch/henry-aaron-hits-home-run-number-715' },
        { label: 'Connection to South-View', url: 'https://www.clickondetroit.com/sports/2021/01/27/the-hammer-makes-one-last-trip-to-spot-where-he-hit-no-715/' },
        { label: 'Aaron’s career and civil rights legacy (New Georgia Encyclopedia)', url: 'https://www.georgiaencyclopedia.org/articles/sports-outdoor-recreation/hank-aaron-1934-2021/' },
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
        'Martin Luther King Sr. led Ebenezer Baptist Church from 1931 to 1975, joining religious leadership with campaigns for voter registration and equal pay for Atlanta’s Black teachers. He helped make the church a base for civic action while supporting his son’s civil rights work. His ministry continued through the deaths of his son in 1968 and his wife, Alberta, in 1974.',
      whyItBelongs:
        'When he died on November 11, 1984, King Sr. was buried next to Alberta at South-View, where their younger son, A. D. King, is also buried. Their graves connect the cemetery to generations of religious and civil rights leadership in Atlanta.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/martin-luther-king-sr-1979.jpg',
        width: 743,
        height: 1042,
        alt: 'Martin Luther King Sr. seated in a dark suit and patterned tie at Ebenezer Baptist Church.',
        caption: 'Martin Luther King Sr. at Ebenezer Baptist Church, January 14, 1979. Cropped from a White House photograph; it predates his 1984 funeral.',
        credit: 'White House staff photographer / National Archives, NAID 183007 · public domain',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Martin_Luther_King_Sr,_c1977-81.jpg',
      },
      sources: [
        { label: 'Religious and civil rights leadership (Stanford)', url: 'https://kinginstitute.stanford.edu/king-martin-luther-sr' },
        { label: 'Connection to South-View', url: 'https://roughdraftatlanta.com/2026/05/05/south-view-cemetery-historic-atlanta/' },
        { label: 'King family burials (Georgia Historical Society)', url: 'https://www.georgiahistory.com/ghmi_marker_updated/south-view-cemetery/' },
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
        src: 'assets/images/archive/georgia-dome-2011.jpg',
        width: 1024,
        height: 768,
        alt: 'The white roof and striped exterior of the Georgia Dome, with a street and trees in the foreground.',
        caption: 'The Georgia Dome in 2011, one of the Atlanta landmarks Herman J. Russell’s company helped build. The photograph shows the completed stadium, which opened in 1992.',
        credit: 'Ken Lund / Flickr · CC BY-SA 2.0',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Georgia_Dome,_Atlanta,_Georgia_2011.jpg',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.georgiaencyclopedia.org/articles/business-economy/herman-j-russell-1930-2014/' },
        { label: 'Connection to South-View (Georgia Tech)', url: 'https://leading-edge.iac.gatech.edu/building-memories/southview-cemetery/' },
        { label: 'Company history (Georgia Historical Society)', url: 'https://www.georgiahistory.com/ghmi_marker_updated/h-j-russell-company/' },
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
        'John Lewis chaired the Student Nonviolent Coordinating Committee, spoke at the 1963 March on Washington and was beaten while leading voting-rights marchers in Selma in 1965. He carried that work into public office, representing Atlanta in Congress from 1987 until his death in July 2020. His career joined grassroots organizing with national political leadership.',
      whyItBelongs:
        'After lying in state at the U.S. Capitol, Lewis was eulogized at Ebenezer Baptist Church on July 30, 2020, and buried at South-View, alongside many of the movement’s leaders. His burial brought that life of public service back to the city he represented.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/john-lewis-congressional-portrait.jpg',
        width: 242,
        height: 310,
        alt: 'Black-and-white portrait of John Lewis standing behind a chair, beside a U.S. flag and a studio backdrop depicting the Capitol.',
        caption: 'John Lewis in a House Photography Studio portrait, c. 1992. The studio backdrop depicts the U.S. Capitol.',
        credit: 'House Photography Studio / Collection of the U.S. House of Representatives · public domain',
        creditUrl: 'https://history.house.gov/Collection/Detail/36507223312',
      },
      sources: [
        { label: 'Historical background', url: 'https://www.wsls.com/news/politics/2020/07/30/john-lewis-funeral-set-for-atlanta-church-that-mlk-once-led/' },
        { label: 'Connection to South-View', url: 'https://www.wsbtv.com/news/local/atlanta/what-is-south-view-cemetery-heres-history-where-john-lewis-is-buried/CSKPZVG6PFFJXKD3XKCOPKRP2I' },
        { label: 'Civil rights and congressional service (National Archives)', url: 'https://www.archives.gov/research/african-americans/individuals/john-lewis' },
        { label: 'Burial and cemetery context (Atlanta Department of City Planning)', url: 'https://citydesign.atlantaga.gov/blog/2022/7/28/promised-land-a-tour-of-atlantas-historically-african-american-cemeteries-and-the-graves-of-civil-rights-pioneers' },
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
        'In its 140th year, South-View Cemetery was listed on the National Register of Historic Places on July 6, 2026. Founded in response to discrimination at Atlanta’s segregated burial grounds, it became a resting place for generations of Black Atlantans. More than 80,000 people rest across its 100 acres in Lakewood Heights.',
      whyItBelongs:
        'The listing recognizes what families have long known: the people buried at South-View built Black Atlanta and helped change the nation. Descendants of the founders still lead the cemetery, continuing its work of caring for families and preserving their history.',
      media: {
        type: 'Photograph',
        src: 'assets/images/archive/Capt._Darrell_Bogan_speaking_at_South-View_Cemetery_in_Atlanta_in_2010.jpg',
        width: 3000,
        height: 2400,
        alt: 'Air Force personnel and visitors gathered among graves and trees at South-View Cemetery for a remembrance ceremony.',
        caption: 'Wreaths Across America at South-View Cemetery, December 2010. This photograph of the cemetery predates its 2026 National Register listing.',
        credit: 'Master Sgt. Stan Coleman / U.S. Air Force · public domain',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Capt._Darrell_Bogan_speaking_at_South-View_Cemetery_in_Atlanta_in_2010.jpg',
      },
      sources: [
        { label: 'National Park Service weekly list', url: 'https://home.nps.gov/subjects/nationalregister/weekly-list-2026-07-10.htm' },
        { label: 'Rough Draft Atlanta', url: 'https://roughdraftatlanta.com/2026/05/05/south-view-cemetery-historic-atlanta/' },
        { label: 'Founding and continued family leadership (South-View Cemetery Association)', url: 'https://southviewcemetery.com/our-history/' },
      ],
      focus: 'skyline',
      status: 'draft',
    },
    {
      id: 'maynard-jackson-elected-1973',
      year: 1973,
      date: 'October 16, 1973',
      period: 'legacy',
      person: 'Maynard H. Jackson Jr.',
      title: 'Atlanta elects its first Black mayor',
      description:
        'On October 16, 1973, Maynard Jackson defeated incumbent Sam Massell in a runoff election to become Atlanta’s first Black mayor and the first Black mayor of a major Southern city. His administration later expanded opportunities for minority-owned businesses to win city contracts and helped reshape Atlanta’s airport.',
      whyItBelongs:
        'Jackson’s grandfather, John Wesley Dobbs, was a voting-rights organizer buried at South-View. The election marked a new chapter in the political empowerment that Dobbs and other Black Atlantans had worked to make possible.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/Maynard_Jackson.jpg',
        width: 95,
        height: 103,
        alt: 'Photograph of former Atlanta mayor Maynard Jackson.',
        caption: 'Maynard Jackson, Atlanta’s first Black mayor.',
        credit: 'State Archives of North Carolina, Ralph Campbell Jr. Papers',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Maynard_Jackson.jpg',
      },
      sources: [
        { label: 'Maynard Jackson elected — Today in Georgia History', url: 'https://www.todayingeorgiahistory.org/tih-georgia-day/maynard-jackson-elected/' },
        { label: 'Maynard Jackson biography — New Georgia Encyclopedia', url: 'https://www.georgiaencyclopedia.org/articles/government-politics/maynard-jackson-1938-2003/' },
        { label: 'John Wesley Dobbs at South-View — Georgia preservation newsletter', url: 'https://dlg.usg.edu/record/dlg_ggpd_i-ga-bn200-ph5-bp1-br4-b10-s2-belec-p-btext' },
      ],
      focus: 'downtown',
      status: 'draft',
    },
    {
      id: 'alberta-williams-king-1974',
      year: 1974,
      date: 'July 3, 1974',
      period: 'legacy',
      person: 'Alberta Williams King',
      title: 'A community mourns Alberta Williams King',
      description:
        'Alberta Williams King helped sustain Ebenezer Baptist Church as an organist and choir director and was active in the NAACP and YWCA. The mother of Dr. Martin Luther King Jr., she supported a family and church central to Atlanta’s civil rights history. She was killed while playing the organ on June 30, 1974; her funeral followed on July 3.',
      whyItBelongs:
        'Her burial at South-View connects the cemetery to the church communities that sustained Atlanta’s Civil Rights Movement. She remains buried there beside her husband, Martin Luther King Sr., whose own ministry joined religious leadership with civic action.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/Martin_Luther_King,_Henry_Elkins,_and_Alberta_Williams_King_at_Ebenezer,_1962_(cropped).png',
        width: 302,
        height: 471,
        alt: 'Alberta Williams King at Ebenezer Baptist Church in 1962.',
        caption: 'Alberta Williams King at Ebenezer Baptist Church, 1962.',
        credit: 'Photographer unknown / Wikimedia Commons, public domain',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Martin_Luther_King,_Henry_Elkins,_and_Alberta_Williams_King_at_Ebenezer,_1962_(cropped).png',
      },
      sources: [
        { label: 'Alberta Williams King obituary and burial history — Atlanta Journal-Constitution', url: 'https://www.ajc.com/uatl/the-death-of-alberta-williams-king-mother-of-martin-luther-king-jr/IIDVT4RJDNFYZFRGSA5SFQJ4RQ/' },
        { label: 'July 3, 1974 funeral archive — Digital Library of Georgia', url: 'https://dlg.usg.edu/record/geh_byd_4202' },
        { label: 'Church and civic leadership (Stanford)', url: 'https://kinginstitute.stanford.edu/king-alberta-williams' },
        { label: 'South-View historical marker — Georgia Historical Society', url: 'https://www.georgiahistory.com/ghmi_marker_updated/south-view-cemetery/' },
      ],
      focus: 'ebenezer',
      status: 'draft',
    },
    {
      id: 'albert-h-watts-president-1977',
      year: 1977,
      date: '1977',
      period: 'legacy',
      person: 'Albert H. Watts',
      title: 'A founder’s family carries South-View forward',
      description:
        'Albert H. Watts, a grandson of South-View co-founder Albert Watts, became president-treasurer of the cemetery association in 1977. He had begun working at South-View as a young man, digging graves, and had served in several roles before taking the top leadership position. He remained president-treasurer until his death in 2001.',
      whyItBelongs:
        'Watts’s leadership illustrates how South-View continued as a Black-led institution long after its founding in 1886. His family’s involvement helped preserve the cemetery across generations, sustaining its work of providing dignified burials for the community.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/Capt._Darrell_Bogan_speaking_at_South-View_Cemetery_in_Atlanta_in_2010.jpg',
        width: 3000,
        height: 2400,
        alt: 'Captain Darrell Bogan speaking at a ceremony at South-View Cemetery in 2010.',
        caption: 'A remembrance ceremony at South-View Cemetery in 2010, reflecting the institution’s continuing community role.',
        credit: 'Master Sgt. Stan Coleman / U.S. Air Force, public domain',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Capt._Darrell_Bogan_speaking_at_South-View_Cemetery_in_Atlanta_in_2010.jpg',
      },
      sources: [
        { label: 'History of the Watts family — South-View Cemetery Association', url: 'https://southviewcemetery.com/our-history/' },
        { label: 'South-View family leadership — Georgia Tech Building Memories', url: 'https://leading-edge.iac.gatech.edu/building-memories/southview-cemetery/' },
        { label: 'South-View preservation history — Georgia preservation newsletter', url: 'https://dlg.usg.edu/record/dlg_ggpd_i-ga-bn200-ph5-bp1-br4-b10-s2-belec-p-btext' },
      ],
      focus: 'south-view',
      status: 'draft',
    },
    {
      id: 'henry-o-flipper-reburial-1978',
      year: 1978,
      date: 'February 11, 1978',
      period: 'legacy',
      person: 'Henry Ossian Flipper',
      title: 'Henry O. Flipper receives military honors',
      description:
        'Henry Ossian Flipper became the first Black graduate of the U.S. Military Academy at West Point in 1877. After a court-martial and dismissal from the Army, he spent decades seeking to clear his name. The Army corrected his discharge record in 1976, and on February 11, 1978, he was reinterred with full military honors in his hometown of Thomasville, Georgia.',
      whyItBelongs:
        'Educated in Atlanta after emancipation, Flipper represents opportunities Black families fought to secure through new schools. He was buried at South-View in 1940 before his 1978 reburial in Thomasville. His story links the city’s educational institutions to the struggle for recognition of Black military service.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/Henry_Ossian_Flipper.jpg',
        width: 1513,
        height: 1897,
        alt: 'Historical portrait of Henry Ossian Flipper wearing a military uniform.',
        caption: 'Henry Ossian Flipper in military uniform, circa 1880.',
        credit: 'Miriam Matthews Photograph Collection / UCLA Library Digital Collections, public domain',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Henry_Ossian_Flipper,_c1880.jpg',
      },
      sources: [
        { label: 'Flipper burial history — South-View Cemetery Association', url: 'https://southviewcemetery.com/our-history/' },
        { label: 'First Black Graduate of West Point marker — Georgia Historical Society', url: 'https://www.georgiahistory.com/ghmi_marker_updated/first-black-graduate-of-west-point/' },
        { label: 'Henry O. Flipper biography — National Park Service', url: 'https://home.nps.gov/people/henryflipper.htm' },
      ],
      focus: 'south-view',
      status: 'draft',
    },
    {
      id: 'benjamin-mays-south-view-1984',
      year: 1984,
      date: 'March 28, 1984',
      period: 'legacy',
      person: 'Benjamin E. Mays',
      title: 'Remembering Morehouse mentor Benjamin E. Mays',
      description:
        'Benjamin E. Mays, who led Morehouse College from 1940 to 1967, died on March 28, 1984. An educator, minister and outspoken critic of segregation, he encouraged generations of students, including Martin Luther King Jr., to pursue leadership and social change. Their relationship continued after King’s student years, with Mays serving as a trusted mentor.',
      whyItBelongs:
        'Mays was initially buried at South-View Cemetery before his remains were later moved to the Morehouse College campus. His story connects South-View to Atlanta’s historically Black colleges and the educators who shaped the Civil Rights Movement.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/Benjamin_Mays_Portrait_1921.png',
        width: 966,
        height: 1424,
        alt: 'Historical portrait of educator Benjamin Elijah Mays.',
        caption: 'Benjamin E. Mays, former president of Morehouse College and mentor to Martin Luther King Jr.',
        credit: 'Historical portrait via Wikimedia Commons, public domain',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Benjamin_Mays_Portrait_1921.png',
      },
      sources: [
        { label: 'Benjamin E. Mays — Stanford King Institute', url: 'https://kinginstitute.stanford.edu/mays-benjamin-elijah' },
        { label: 'Benjamin Mays biography — New Georgia Encyclopedia', url: 'https://www.georgiaencyclopedia.org/articles/education/benjamin-mays-ca-1894-1984/' },
        { label: 'Mays burial and relocation — South-View Cemetery Association', url: 'https://southviewcemetery.com/our-history/' },
      ],
      focus: 'auc',
      status: 'draft',
    },
    {
      id: 'lillian-miles-lewis-2013',
      year: 2013,
      date: 'January 7, 2013',
      period: 'legacy',
      person: 'Lillian Miles Lewis',
      title: 'Honoring Lillian Miles Lewis',
      description:
        'Lillian Miles Lewis worked as a librarian at Atlanta University and served on Georgia’s State Ethics Commission. She also advised her husband, civil rights leader and congressman John Lewis. After her death on December 31, 2012, her funeral at Ebenezer Baptist Church on January 7, 2013, brought together Atlanta’s civic and religious communities.',
      whyItBelongs:
        'Buried at South-View after the service, Lewis joins the educators, librarians and civic leaders who helped shape Atlanta. Her work shows how the city’s political changes also depended on public service carried out beyond elected office.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/Martin_Luther_King_Jr._National_Historic_Site_August_2016_01_(Ebenezer_Baptist_Church_Horizon_Sanctuary).jpg',
        width: 6000,
        height: 4000,
        alt: 'Exterior of Ebenezer Baptist Church Horizon Sanctuary in Atlanta.',
        caption: 'Ebenezer Baptist Church Horizon Sanctuary, photographed in 2016. Lillian Miles Lewis’s funeral was held here in 2013.',
        credit: 'Michael Barera / Wikimedia Commons, CC BY-SA 4.0',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Martin_Luther_King_Jr._National_Historic_Site_August_2016_01_(Ebenezer_Baptist_Church_Horizon_Sanctuary).jpg',
      },
      sources: [
        { label: 'Original January 2013 funeral program — Digital Library of Georgia', url: 'https://dlg.usg.edu/record/aarl_afpc_lewislillianmiles20130107' },
        { label: 'Funeral and South-View interment notice — Atlanta Journal-Constitution', url: 'https://www.legacy.com/us/obituaries/atlanta/name/lillian-lewis-obituary?id=24933043' },
        { label: 'Lillian Lewis papers and career — Atlanta University Center Archives', url: 'https://findingaids.auctr.edu/repositories/2/resources/174' },
      ],
      focus: 'ebenezer',
      status: 'draft',
    },
    {
      id: 'south-view-historical-marker-2016',
      year: 2016,
      date: 'April 30, 2016',
      period: 'legacy',
      person: 'South-View Cemetery',
      title: 'A historical marker recognizes South-View',
      description:
        'On April 30, 2016, the Georgia Historical Society and Historic South-View Preservation Foundation unveiled a historical marker honoring South-View Cemetery. The marker tells how formerly enslaved African Americans founded the cemetery in 1886 in response to discrimination at Atlanta’s segregated burial grounds. It also recognizes the community leaders buried there.',
      whyItBelongs:
        'Placed near the cemetery’s main office, the marker publicly recognizes South-View’s founding, its burial traditions and the contributions of generations of Black Atlantans. It was a preservation milestone distinct from the cemetery’s later National Register listing.',
      media: {
        type: 'Historical photograph',
        src: 'assets/images/archive/Grave_of_Horace_A._Bohannon,_South-View_Cemetery,_Atlanta_in_2010.jpg',
        width: 3872,
        height: 2592,
        alt: 'Grave of Tuskegee Airman Horace A. Bohannon at South-View Cemetery.',
        caption: 'A commemorative wreath at the grave of Tuskegee Airman Horace A. Bohannon in South-View Cemetery, 2010.',
        credit: 'Master Sgt. Stan Coleman / U.S. Air Force, public domain',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Grave_of_Horace_A._Bohannon,_South-View_Cemetery,_Atlanta_in_2010.jpg',
      },
      sources: [
        { label: 'April 2016 marker dedication — Georgia Historical Society', url: 'https://www.georgiahistory.com/georgia-historical-society-to-recognize-south-view-cemetery-with-historical-marker-dedication-this-saturday/' },
        { label: 'Official South-View marker text — Georgia Historical Society', url: 'https://www.georgiahistory.com/ghmi_marker_updated/south-view-cemetery/' },
        { label: 'South-View historical context — Georgia Tech Building Memories', url: 'https://leading-edge.iac.gatech.edu/building-memories/southview-cemetery/' },
      ],
      focus: 'south-view',
      status: 'draft',
    },
     {
      id: 'georgia-tech-lmc-3403',
      year: 2026,
      date: 'Fall 2026',
      person: 'Georgia Tech students, LMC 3403',
      title: 'Expanding South-View’s impact',
      description:
        'In fall 2026, students in Georgia Tech’s LMC 3403 class created projects for South-View that share its history in new ways. This illustrated timeline is one of them. Each project was made to be handed to South-View, so the people who lead it can keep using and updating it after the semester ends.',
      whyItBelongs:
        'These projects help South-View share the lives and work of the people who shaped Atlanta. They extend the cemetery’s role as a place of remembrance into an online history that its caretakers can keep using and updating.',
      media: {
        type: 'Photograph',
        src: 'assets/images/archive/georgia-tech-tower-2022.jpg',
        width: 1024,
        height: 768,
        alt: 'Tech Tower on Georgia Tech’s campus, framed by trees beneath a blue sky.',
        caption: 'Tech Tower on Georgia Tech’s campus, January 2022. This campus photograph predates the fall 2026 class project.',
        credit: 'Tyler Lahti / Flickr · CC BY-SA 2.0',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Tech_Tower_in_Atlanta.jpg',
      },
      sources: [],
      focus: 'midtown',
      status: 'draft',
      note: '',
    },
  ],
};
