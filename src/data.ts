/* =====================================================================
 * SITE CONTENT — EDIT THIS FILE TO UPDATE MOST OF THE WEBSITE
 * =====================================================================
 *
 * Quick map of this file (search for the block name):
 *
 *   1. profile ............... your name, email, one-line description
 *   2. defaultSpotifyUrl ..... the song/playlist shown on the home page
 *   3. notes ................. Field Notes articles (writing page)
 *   4. travelSectors ......... regions shown as filter tabs on the Atlas
 *   5. travelSpots ........... every destination on the Atlas globe
 *   6. photos ................ Photos page archive
 *   7. experienceTeams ....... roles listed on the Experience page
 *   8. resume ................ summary text used on the on-site résumé
 *   9. projectCategories ..... filter tabs on the Projects page
 *  10. projectCards .......... project cards on the Projects page
 *  11. projectDetails ........ extra text for the personal project dialogs
 *
 * Tips
 *  - Keep every line inside quotes ("...") and every item followed by a comma.
 *  - Run `npx tsc --noEmit` after editing. It reports typos with line numbers.
 *  - Images go in /public and are referenced with a leading slash, e.g. "/photos/x.jpg".
 *  - Anything not listed here (layout, colors, styles) lives in src/App.tsx,
 *    src/components/*.tsx and src/index.css.
 * ===================================================================== */

/* ---------------------------------------------------------------------
 * 1. PROFILE — your name and contact details
 * --------------------------------------------------------------------- */
export const profile = {
  name: "Dylan Kwok",
  email: "hello@dylankwok.space",
  description:
    "First-year aerospace engineering student. Learning by doing, and always looking a little further up.",
};

/* ---------------------------------------------------------------------
 * 2. SPOTIFY — default track or playlist on the home page
 * --------------------------------------------------------------------- */
export const defaultSpotifyUrl =
  "https://open.spotify.com/track/7H0ya83CMmgFcOhw0UB6ow";

/* ---------------------------------------------------------------------
 * 3. FIELD NOTES — articles on the Field Notes page. Each item becomes one row and one dialog.
 * --------------------------------------------------------------------- */
export const notes = [
  {
    id: "first-principles",
    number: "001",
    date: "OCT 24, 2026",
    category: "Learning",
    title: "Back to first principles.",
    summary:
      "What a stubborn physics problem taught me about asking better questions.",
    readingTime: "3 MIN READ",
    paragraphs: [
      "A few weeks into my first semester, I spent an entire evening trying to make a dynamics problem agree with my answer. The algebra was neat. The diagram looked convincing. The answer was still wrong.",
      "The breakthrough was not a clever trick. It was drawing the free-body diagram again, slowly, and asking what each arrow actually meant. I had made an assumption in the first thirty seconds and never returned to it.",
      "That is the habit I am trying to build now: start with what is true, not what is familiar. Write down the assumptions. Check the units. Be willing to redraw the picture. It is less glamorous than a launch, but I suspect it is how the interesting work begins.",
    ],
  },
  {
    id: "looking-up",
    number: "002",
    date: "OCT 08, 2026",
    category: "Perspective",
    title: "A good reason to keep looking up.",
    summary:
      "A quiet evening, a passing satellite, and a reminder of why I started.",
    readingTime: "2 MIN READ",
    paragraphs: [
      "I went outside after a long afternoon of calculus and happened to catch a bright point moving steadily across the sky. No blinking lights, no sound. Just a spacecraft doing exactly what someone had calculated it would do.",
      "It is easy to lose the big picture when the immediate problem is a differential equation or an uncooperative CAD sketch. Seeing something built by people, circling the planet above a completely ordinary evening, helped put those small tasks back in context.",
      "I am at the very beginning of understanding how any of it works. That is not discouraging. It is the best part. There is so much left to learn, and the sky is a pretty good reminder to keep going.",
    ],
  },
  {
    id: "making-room",
    number: "003",
    date: "SEP 19, 2026",
    category: "Learning",
    title: "Making room for the first bad prototype.",
    summary:
      "The fastest way to learn something is sometimes to build it imperfectly.",
    readingTime: "3 MIN READ",
    paragraphs: [
      "The first version of my model rocket looked better in the CAD file than it did on the workbench. The fin alignment was off, the body tube needed another sanding pass, and my carefully planned assembly sequence was not nearly as practical as I thought.",
      "But the physical version taught me things the screen could not. I could feel the awkward joint. I could see why a dimension needed more tolerance. Every imperfect part turned an abstract design decision into a specific question.",
      "The next version will be better, not because I thought about it for longer, but because I made the first one. For now, that is the approach: build small, take notes, stay curious, repeat.",
    ],
  },
];

import type { FlagCode } from "./components/FlagBadge";

/* ---------------------------------------------------------------------
 * 4. ATLAS TYPES — the allowed sector names (do not edit unless adding a new region)
 * --------------------------------------------------------------------- */
export type TravelSector =
  | "North America"
  | "Europe"
  | "Asia"
  | "Pacific"
  | "Middle East";

export type TravelSpot = {
  id: string;
  place: string;
  region: string;
  country: string;
  countryFlag: FlagCode;
  flagCode: FlagCode;
  flagLabel: string;
  sector: TravelSector;
  cluster: string;
  coordinates: [number, number];
  year: string;
  label: string;
  note: string;
  kind: "Home" | "Fieldwork" | "Places";
};

/* ---------------------------------------------------------------------
 * 5. ATLAS REGIONS — filter tabs and the globe camera position for each region
 * --------------------------------------------------------------------- */
export const travelSectors: {
  id: "All" | TravelSector;
  label: string;
  shortLabel: string;
  rotation: [number, number];
  zoom: number;
}[] = [
  {
    id: "All",
    label: "All Sectors",
    shortLabel: "ALL",
    rotation: [98, -26],
    zoom: 1,
  },
  {
    id: "North America",
    label: "North America",
    shortLabel: "N. AMERICA",
    rotation: [100, -34],
    zoom: 1.55,
  },
  {
    id: "Europe",
    label: "Europe",
    shortLabel: "EUROPE",
    rotation: [-7, -44.5],
    zoom: 2.35,
  },
  {
    id: "Pacific",
    label: "Pacific",
    shortLabel: "PACIFIC",
    rotation: [157.4, -20.8],
    zoom: 3.1,
  },
  {
    id: "Asia",
    label: "Asia",
    shortLabel: "ASIA",
    rotation: [-130, -36],
    zoom: 1.95,
  },
  {
    id: "Middle East",
    label: "Middle East",
    shortLabel: "MIDDLE EAST",
    rotation: [-55.3, -25.2],
    zoom: 2.1,
  },
];

/* ---------------------------------------------------------------------
 * 6. ATLAS DESTINATIONS — one object per place. Required: id, place, region, country, countryFlag, flagCode, flagLabel, sector, cluster, coordinates [longitude, latitude], year, label, note, kind ("Home" | "Fieldwork" | "Places").
 * --------------------------------------------------------------------- */
export const travelSpots: TravelSpot[] = [
  // NORTH AMERICA (12)
  {
    id: "san-francisco",
    place: "San Francisco",
    region: "California, USA",
    country: "United States",
    countryFlag: "US",
    flagCode: "US-CA",
    flagLabel: "California State Flag",
    sector: "North America",
    cluster: "West Coast",
    coordinates: [-122.4194, 37.7749],
    year: "HOME BASE",
    label: "37.77° N / 122.42° W",
    note: "Where the flight log begins. Fog, hills, marine layer mornings, and a very reliable view of the sky.",
    kind: "Home",
  },
  {
    id: "yosemite",
    place: "Yosemite",
    region: "California, USA",
    country: "United States",
    countryFlag: "US",
    flagCode: "US-CA",
    flagLabel: "California State Flag",
    sector: "North America",
    cluster: "West Coast",
    coordinates: [-119.5383, 37.8651],
    year: "SIERRA",
    label: "37.87° N / 119.54° W",
    note: "Granite walls, high-country air, and dark valley skies where satellites trace clean arcs overhead.",
    kind: "Fieldwork",
  },
  {
    id: "joshua-tree",
    place: "Joshua Tree",
    region: "California, USA",
    country: "United States",
    countryFlag: "US",
    flagCode: "US-CA",
    flagLabel: "California State Flag",
    sector: "North America",
    cluster: "Desert Southwest",
    coordinates: [-115.901, 33.8734],
    year: "MOJAVE",
    label: "33.87° N / 115.90° W",
    note: "Boulders, dry desert thermals, and wide-open night skies built for stargazing and long-exposure frames.",
    kind: "Fieldwork",
  },
  {
    id: "grand-canyon",
    place: "Grand Canyon",
    region: "Arizona, USA",
    country: "United States",
    countryFlag: "US",
    flagCode: "US-AZ",
    flagLabel: "Arizona State Flag",
    sector: "North America",
    cluster: "Desert Southwest",
    coordinates: [-112.1401, 36.0544],
    year: "SOUTH RIM",
    label: "36.05° N / 112.14° W",
    note: "Standing on the rim feels like looking at planetary geology from orbit—layered time cut by a single river.",
    kind: "Fieldwork",
  },
  {
    id: "sedona",
    place: "Sedona",
    region: "Arizona, USA",
    country: "United States",
    countryFlag: "US",
    flagCode: "US-AZ",
    flagLabel: "Arizona State Flag",
    sector: "North America",
    cluster: "Desert Southwest",
    coordinates: [-111.761, 34.8697],
    year: "RED ROCK",
    label: "34.87° N / 111.76° W",
    note: "Iron-oxide mesas and steep canyon trails that look like a Mars rover testbed at sunset.",
    kind: "Fieldwork",
  },
  {
    id: "new-york",
    place: "New York",
    region: "New York, USA",
    country: "United States",
    countryFlag: "US",
    flagCode: "US-NY",
    flagLabel: "New York State Flag",
    sector: "North America",
    cluster: "East Coast",
    coordinates: [-74.006, 40.7128],
    year: "EAST COAST",
    label: "40.71° N / 74.01° W",
    note: "Steel grids, suspension bridges, and an afternoon aboard the Intrepid looking up at Concorde and Enterprise.",
    kind: "Places",
  },
  {
    id: "boston",
    place: "Boston",
    region: "Massachusetts, USA",
    country: "United States",
    countryFlag: "US",
    flagCode: "US-MA",
    flagLabel: "Massachusetts State Flag",
    sector: "North America",
    cluster: "East Coast",
    coordinates: [-71.0589, 42.3601],
    year: "NEW ENGLAND",
    label: "42.36° N / 71.06° W",
    note: "Brick walkways along the Charles River, engineering labs, and aerospace history tucked into every block.",
    kind: "Places",
  },
  {
    id: "orlando",
    place: "Orlando",
    region: "Florida, USA",
    country: "United States",
    countryFlag: "US",
    flagCode: "US-FL",
    flagLabel: "Florida State Flag",
    sector: "North America",
    cluster: "Southeast & Tropics",
    coordinates: [-81.3792, 28.5383],
    year: "SPACE COAST",
    label: "28.54° N / 81.38° W",
    note: "Base camp for the Space Coast—humid mornings, towering thunderheads, and rockets rising just east on the horizon.",
    kind: "Fieldwork",
  },
  {
    id: "cancun",
    place: "Cancun",
    region: "Cancun, Mexico",
    country: "Mexico",
    countryFlag: "MX",
    flagCode: "MX",
    flagLabel: "Flag of Mexico",
    sector: "North America",
    cluster: "Southeast & Tropics",
    coordinates: [-86.8515, 21.1619],
    year: "YUCATÁN",
    label: "21.16° N / 86.85° W",
    note: "Turquoise Yucatán water, warm trade winds, and ancient astronomical alignments across the peninsula.",
    kind: "Places",
  },
  {
    id: "cabo-san-lucas",
    place: "Cabo San Lucas",
    region: "Cabo San Lucas, Mexico",
    country: "Mexico",
    countryFlag: "MX",
    flagCode: "MX",
    flagLabel: "Flag of Mexico",
    sector: "North America",
    cluster: "West Coast",
    coordinates: [-109.9167, 22.8905],
    year: "BAJA",
    label: "22.89° N / 109.92° W",
    note: "Where desert granite meets the Pacific swell at the tip of the Baja peninsula.",
    kind: "Places",
  },
  {
    id: "jamaica",
    place: "Jamaica",
    region: "Caribbean",
    country: "Jamaica",
    countryFlag: "JM",
    flagCode: "JM",
    flagLabel: "Flag of Jamaica",
    sector: "North America",
    cluster: "Southeast & Tropics",
    coordinates: [-77.2975, 18.1096],
    year: "CARIBBEAN",
    label: "18.11° N / 77.30° W",
    note: "Blue Mountains mist, warm sea breeze, and low-latitude constellations hanging high above the coast.",
    kind: "Places",
  },
  {
    id: "victoria",
    place: "Victoria",
    region: "Victoria, Canada",
    country: "Canada",
    countryFlag: "CA",
    flagCode: "CA",
    flagLabel: "Flag of Canada",
    sector: "North America",
    cluster: "West Coast",
    coordinates: [-123.3656, 48.4284],
    year: "VANCOUVER ISL.",
    label: "48.43° N / 123.37° W",
    note: "Floatplanes banking into the Inner Harbour and cold Salish Sea wind across the breakwater.",
    kind: "Places",
  },

  // EUROPE (10)
  {
    id: "seville",
    place: "Seville",
    region: "Seville, Spain",
    country: "Spain",
    countryFlag: "ES",
    flagCode: "ES",
    flagLabel: "Flag of Spain",
    sector: "Europe",
    cluster: "Iberia & Western Europe",
    coordinates: [-5.9845, 37.3891],
    year: "ANDALUSIA",
    label: "37.39° N / 5.98° W",
    note: "Geometric tilework, sunlit courtyards, and centuries of celestial navigation archives along the Guadalquivir.",
    kind: "Places",
  },
  {
    id: "barcelona",
    place: "Barcelona",
    region: "Barcelona, Spain",
    country: "Spain",
    countryFlag: "ES",
    flagCode: "ES",
    flagLabel: "Flag of Spain",
    sector: "Europe",
    cluster: "Iberia & Western Europe",
    coordinates: [2.1734, 41.3851],
    year: "CATALONIA",
    label: "41.39° N / 2.17° E",
    note: "Catenary arches and structural geometry that make gravity look like a design partner.",
    kind: "Places",
  },
  {
    id: "paris",
    place: "Paris",
    region: "Paris, France",
    country: "France",
    countryFlag: "FR",
    flagCode: "FR",
    flagLabel: "Flag of France",
    sector: "Europe",
    cluster: "Iberia & Western Europe",
    coordinates: [2.3522, 48.8566],
    year: "FRANCE",
    label: "48.86° N / 2.35° E",
    note: "Wrought-iron trusses, early aviation pioneers at Le Bourget, and long walks along the Seine.",
    kind: "Places",
  },
  {
    id: "london",
    place: "London",
    region: "London, UK",
    country: "United Kingdom",
    countryFlag: "GB",
    flagCode: "GB",
    flagLabel: "Flag of the United Kingdom",
    sector: "Europe",
    cluster: "Iberia & Western Europe",
    coordinates: [-0.1276, 51.5072],
    year: "UNITED KINGDOM",
    label: "51.51° N / 0.13° W",
    note: "Standing on the Prime Meridian at Greenwich where longitude zero and modern timekeeping were set.",
    kind: "Places",
  },
  {
    id: "geneva",
    place: "Geneva",
    region: "Geneva, Switzerland",
    country: "Switzerland",
    countryFlag: "CH",
    flagCode: "CH",
    flagLabel: "Flag of Switzerland",
    sector: "Europe",
    cluster: "Swiss Alps & Léman",
    coordinates: [6.1432, 46.2044],
    year: "ROMANDIE",
    label: "46.20° N / 6.14° E",
    note: "CERN's underground detector caverns, Lake Geneva's Jet d'Eau plume, and physics built at civil-engineering scale.",
    kind: "Fieldwork",
  },
  {
    id: "lausanne",
    place: "Lausanne",
    region: "Lausanne, Switzerland",
    country: "Switzerland",
    countryFlag: "CH",
    flagCode: "CH",
    flagLabel: "Flag of Switzerland",
    sector: "Europe",
    cluster: "Swiss Alps & Léman",
    coordinates: [6.6323, 46.5197],
    year: "VAUD",
    label: "46.52° N / 6.63° E",
    note: "Terraced hills rising from Lac Léman toward EPFL's engineering labs, with the Savoy Alps across the water.",
    kind: "Places",
  },
  {
    id: "rome",
    place: "Rome",
    region: "Rome, Italy",
    country: "Italy",
    countryFlag: "IT",
    flagCode: "IT",
    flagLabel: "Flag of Italy",
    sector: "Europe",
    cluster: "Italy",
    coordinates: [12.4964, 41.9028],
    year: "LAZIO",
    label: "41.90° N / 12.50° E",
    note: "The Pantheon's unreinforced concrete dome and an oculus that tracks the sun like an instrument.",
    kind: "Places",
  },
  {
    id: "florence",
    place: "Florence",
    region: "Florence, Italy",
    country: "Italy",
    countryFlag: "IT",
    flagCode: "IT",
    flagLabel: "Flag of Italy",
    sector: "Europe",
    cluster: "Italy",
    coordinates: [11.2558, 43.7696],
    year: "TUSCANY",
    label: "43.77° N / 11.26° E",
    note: "Galileo's early telescopes and Brunelleschi's self-supporting brickwork high above the Arno.",
    kind: "Places",
  },
  {
    id: "cinque-terre",
    place: "Cinque Terre",
    region: "Cinque Terre, Italy",
    country: "Italy",
    countryFlag: "IT",
    flagCode: "IT",
    flagLabel: "Flag of Italy",
    sector: "Europe",
    cluster: "Italy",
    coordinates: [9.7125, 44.127],
    year: "LIGURIA",
    label: "44.13° N / 9.71° E",
    note: "Five cliffside villages linked by coastal footpaths and trains tunneling straight through Ligurian stone.",
    kind: "Places",
  },
  {
    id: "naples",
    place: "Naples",
    region: "Naples, Italy",
    country: "Italy",
    countryFlag: "IT",
    flagCode: "IT",
    flagLabel: "Flag of Italy",
    sector: "Europe",
    cluster: "Italy",
    coordinates: [14.2681, 40.8518],
    year: "CAMPANIA",
    label: "40.85° N / 14.27° E",
    note: "Vesuvius on the bay horizon, narrow streets, and a reminder of the raw thermal energy beneath the crust.",
    kind: "Places",
  },

  // ASIA (5)
  {
    id: "hangzhou",
    place: "Hangzhou",
    region: "Hangzhou, China",
    country: "China",
    countryFlag: "CN",
    flagCode: "CN",
    flagLabel: "Flag of China",
    sector: "Asia",
    cluster: "East China",
    coordinates: [120.1551, 30.2741],
    year: "ZHEJIANG",
    label: "30.27° N / 120.16° E",
    note: "West Lake mist, pagoda silhouettes, and high-speed rail gliding across the Yangtze delta.",
    kind: "Places",
  },
  {
    id: "beijing",
    place: "Beijing",
    region: "Beijing, China",
    country: "China",
    countryFlag: "CN",
    flagCode: "CN",
    flagLabel: "Flag of China",
    sector: "Asia",
    cluster: "East China",
    coordinates: [116.4074, 39.9042],
    year: "CHINA",
    label: "39.90° N / 116.41° E",
    note: "Bronze armillary spheres at the Ancient Observatory and the scale of a capital built on cardinal axes.",
    kind: "Places",
  },
  {
    id: "shanghai",
    place: "Shanghai",
    region: "Shanghai, China",
    country: "China",
    countryFlag: "CN",
    flagCode: "CN",
    flagLabel: "Flag of China",
    sector: "Asia",
    cluster: "East China",
    coordinates: [121.4737, 31.2304],
    year: "CHINA",
    label: "31.23° N / 121.47° E",
    note: "Pudong's tuned-mass-damped supertalls and maglev trains that feel like low-altitude flight.",
    kind: "Places",
  },
  {
    id: "tokyo",
    place: "Tokyo",
    region: "Tokyo, Japan",
    country: "Japan",
    countryFlag: "JP",
    flagCode: "JP",
    flagLabel: "Flag of Japan",
    sector: "Asia",
    cluster: "Japanese Archipelago",
    coordinates: [139.6917, 35.6895],
    year: "KANTO",
    label: "35.69° N / 139.69° E",
    note: "Aerospace exhibits at Miraikan, Shinkansen timetables accurate to the second, and midnight ramen in Shibuya.",
    kind: "Places",
  },
  {
    id: "taiki-spaceport",
    place: "Taiki Spaceport",
    region: "Hokkaido, Japan",
    country: "Japan",
    countryFlag: "JP",
    flagCode: "JP",
    flagLabel: "Flag of Japan",
    sector: "Asia",
    cluster: "Japanese Archipelago",
    coordinates: [143.4418, 42.5],
    year: "HOKKAIDO · HOSPO",
    label: "42.50° N / 143.44° E",
    note: "Hokkaido Spaceport on the Tokachi coast—commercial launch pads facing open Pacific corridors for sounding and orbital rockets.",
    kind: "Fieldwork",
  },

  // PACIFIC (4)
  {
    id: "kauai",
    place: "Kauai",
    region: "Kauai, Hawaii",
    country: "United States",
    countryFlag: "US",
    flagCode: "US-HI",
    flagLabel: "Hawaii State Flag",
    sector: "Pacific",
    cluster: "Hawaiian Islands",
    coordinates: [-159.5261, 22.0964],
    year: "HAWAII",
    label: "22.10° N / 159.53° W",
    note: "Na Pali ridges, canyon radar domes on the western rim, and trade winds straight off the open Pacific.",
    kind: "Fieldwork",
  },
  {
    id: "honolulu",
    place: "Honolulu",
    region: "Honolulu, Hawaii",
    country: "United States",
    countryFlag: "US",
    flagCode: "US-HI",
    flagLabel: "Hawaii State Flag",
    sector: "Pacific",
    cluster: "Hawaiian Islands",
    coordinates: [-157.8583, 21.3069],
    year: "OAHU · HAWAII",
    label: "21.31° N / 157.86° W",
    note: "Volcanic craters meeting the city grid and transpacific flight paths converging mid-ocean.",
    kind: "Places",
  },
  {
    id: "maui",
    place: "Maui",
    region: "Maui, Hawaii",
    country: "United States",
    countryFlag: "US",
    flagCode: "US-HI",
    flagLabel: "Hawaii State Flag",
    sector: "Pacific",
    cluster: "Hawaiian Islands",
    coordinates: [-156.3319, 20.7984],
    year: "HAWAII",
    label: "20.80° N / 156.33° W",
    note: "Climbing above the cloud inversion at Haleakalā where space-surveillance domes watch the orbital sky.",
    kind: "Fieldwork",
  },
  {
    id: "hawaii-island",
    place: "Hawaii Island",
    region: "Hawaii Island, Hawaii",
    country: "United States",
    countryFlag: "US",
    flagCode: "US-HI",
    flagLabel: "Hawaii State Flag",
    sector: "Pacific",
    cluster: "Hawaiian Islands",
    coordinates: [-155.5828, 19.5429],
    year: "BIG ISLAND",
    label: "19.54° N / 155.58° W",
    note: "Basalt lava fields and high-altitude observatories under some of the steadiest seeing on Earth.",
    kind: "Fieldwork",
  },

  // MIDDLE EAST (1)
  {
    id: "dubai",
    place: "Dubai",
    region: "Dubai, UAE",
    country: "United Arab Emirates",
    countryFlag: "AE",
    flagCode: "AE",
    flagLabel: "Flag of the United Arab Emirates",
    sector: "Middle East",
    cluster: "Arabian Peninsula",
    coordinates: [55.2708, 25.2048],
    year: "UAE",
    label: "25.20° N / 55.27° E",
    note: "Desert horizons, wind-engineered spires, and a global crossroads between Europe and Asia.",
    kind: "Places",
  },
];

/* ---------------------------------------------------------------------
 * 7. PHOTOS — images for the Photos page. The src must match a file in /public/photos.
 * --------------------------------------------------------------------- */
export const photos = [
  {
    id: "launch",
    src: "/photos/launch.jpg",
    alt: "A rocket rising over the ocean leaving a long smoke trail",
    title: "The long climb",
    location: "South Padre Island, TX",
    category: "Fieldwork",
    date: "MAR 2026",
    credit: "Forest Katsch / Pexels",
  },
  {
    id: "iceland",
    src: "/photos/iceland.jpg",
    alt: "An empty road winding through Iceland toward snow-covered mountains",
    title: "Road to nothing in particular",
    location: "Skagafjörður, Iceland",
    category: "Places",
    date: "AUG 2025",
    credit: "Kamil Gr / Pexels",
  },
  {
    id: "observatory",
    src: "/photos/observatory.jpg",
    alt: "A radio telescope silhouetted under a bright star-filled night sky",
    title: "Listening to the sky",
    location: "Northern California",
    category: "Fieldwork",
    date: "OCT 2025",
    credit: "Der_Hördt / Pexels",
  },
  {
    id: "wing",
    src: "/photos/wing.jpg",
    alt: "The wing of an airplane above a layer of clouds and blue sky",
    title: "Return leg",
    location: "Somewhere above the Pacific",
    category: "Places",
    date: "MAY 2026",
    credit: "Nothing Ahead / Pexels",
  },
  {
    id: "desert",
    src: "/photos/desert.jpg",
    alt: "An analog Mars research station in a red desert landscape",
    title: "Field site, back-up planet",
    location: "Hanksville, UT",
    category: "Fieldwork",
    date: "APR 2025",
    credit: "Wine Food Travel / Pexels",
  },
  {
    id: "starbase",
    src: "/photos/starbase.jpg",
    alt: "An aerospace facility lit through coastal fog at night",
    title: "Night shift at the pad",
    location: "Starbase, TX",
    category: "Places",
    date: "MAR 2026",
    credit: "Jeswin Thomas / Pexels",
  },
];

/* ---------------------------------------------------------------------
 * 8. EXPERIENCE — roles on the Experience page. The first item opens by default on phones.
 * --------------------------------------------------------------------- */
export const experienceTeams = [
  {
    id: "untitled-rocketry",
    role: "Founder",
    team: "Untitled Rocketry",
    period: "CURRENT",
    type: "Community / Competition",
    description:
      "Founded a rocketry community organization in Fremont, California. Untitled Rocketry competes in the American Rocketry Challenge.",
    highlights: [
      "American Rocketry Challenge",
      "Rocketry community organization",
      "Fremont, California",
    ],
    focus: "Founder · rocketry community · American Rocketry Challenge",
  },
  {
    id: "irvington-driving-force",
    role: "Lead Engineer",
    team: "Irvington Driving Force",
    period: "CURRENT",
    type: "Competition Engineering",
    description:
      "Lead engineer for Irvington Driving Force, a team competing in the H2GP competition.",
    highlights: ["Lead Engineer", "H2GP competition", "Irvington Driving Force"],
    focus: "Lead engineering · H2GP competition",
  },
  {
    id: "makercubed",
    role: "Structures",
    team: "MakerCubed CubeSat Project",
    period: "CURRENT",
    type: "Space Hardware",
    description:
      "Work on structures for the MakerCubed CubeSat Project.",
    highlights: ["CubeSat project", "Structures workstream"],
    focus: "Structures · MakerCubed CubeSat Project",
  },
  {
    id: "fremont-student-makers",
    role: "Co-founder",
    team: "Fremont Student Makers",
    period: "CURRENT",
    type: "Nonprofit / 501(c)(3)",
    description:
      "Co-founded Fremont Student Makers, a 501(c)(3) nonprofit organization.",
    highlights: ["Co-founder", "501(c)(3) nonprofit", "Fremont, California"],
    focus: "Co-founder · 501(c)(3) nonprofit",
  },
  {
    id: "irvington-maker-club",
    role: "Director of Aerospace & Treasurer",
    team: "Irvington Maker Club",
    period: "CURRENT",
    type: "Leadership",
    description:
      "Serve as Director of Aerospace and Treasurer for the Irvington Maker Club.",
    highlights: ["Aerospace director", "Treasurer", "Irvington Maker Club"],
    focus: "Aerospace director · Treasurer",
  },
];

/* ---------------------------------------------------------------------
 * 9. RÉSUMÉ TEXT — on-site résumé copy. The PDF is generated separately; see README.
 * --------------------------------------------------------------------- */
export const resume = {
  headline:
    "First-year aerospace engineering student, rocketry founder, H2GP lead engineer, and CubeSat structures contributor.",
  location: "San Francisco, California",
  education: {
    program: "Aerospace Engineering",
    standing: "First-year undergraduate",
    location: "San Francisco, CA",
  },
  areasOfPractice: [
    {
      group: "Competitive rocketry",
      items: "Founder, Untitled Rocketry · American Rocketry Challenge",
    },
    {
      group: "Competition engineering",
      items: "Lead Engineer, Irvington Driving Force · H2GP",
    },
    {
      group: "Space hardware",
      items: "Structures, MakerCubed CubeSat Project",
    },
    {
      group: "Student organizations",
      items: "Fremont Student Makers · Irvington Maker Club",
    },
  ],
  interests:
    "Competitive rocketry · CubeSat structures · student maker communities",
  updated: "CURRENT SNAPSHOT",
};

/* ------------------------------------------------------------------
   PORTFOLIO PROJECTS / SELECTED WORK
   ------------------------------------------------------------------ */
export type ProjectCategory =
  | "Teams & Organizations"
  | "Engineering"
  | "Games"
  | "Functional Software";

export type ProjectVisualKind =
  | "rocketry"
  | "h2gp"
  | "cubesat"
  | "makers"
  | "modular-rocket"
  | "telemetry-lost"
  | "astroforge"
  | "vena"
  | "protoqueue";

export type ProjectCard = {
  id: string;
  modal: string;
  title: string;
  code: string;
  tag: string;
  meta: string;
  category: ProjectCategory;
  visual: ProjectVisualKind;
  badge?: "FEATURED" | "NEW";
  ariaLabel: string;
};

/* ---------------------------------------------------------------------
 * 11. PROJECT FILTERS — the filter tabs on the Projects page. Category names must match the `category` field of each project card.
 * --------------------------------------------------------------------- */
export const projectCategories: { id: "All" | ProjectCategory; label: string }[] =
  [
    { id: "All", label: "All Work" },
    { id: "Teams & Organizations", label: "Teams & Orgs" },
    { id: "Engineering", label: "Engineering" },
    { id: "Games", label: "Games" },
    { id: "Functional Software", label: "Software" },
  ];

/* ---------------------------------------------------------------------
 * 12. PROJECT CARDS — one object per project on the Projects page. See README for the step-by-step guide to adding one.
 * --------------------------------------------------------------------- */
export const projectCards: ProjectCard[] = [
  {
    id: "untitled-rocketry",
    modal: "rocketry",
    title: "Untitled Rocketry",
    code: "UNTITLED / ROCKETRY",
    tag: "FOUNDER / AMERICAN ROCKETRY CHALLENGE",
    meta: "FREMONT, CA",
    category: "Teams & Organizations",
    visual: "rocketry",
    ariaLabel: "Explore Untitled Rocketry",
  },
  {
    id: "irvington-driving-force",
    modal: "h2gp",
    title: "Irvington Driving Force",
    code: "IRVINGTON / H2GP",
    tag: "LEAD ENGINEER / H2GP",
    meta: "COMPETITION TEAM",
    category: "Teams & Organizations",
    visual: "h2gp",
    ariaLabel: "Explore Irvington Driving Force H2GP team",
  },
  {
    id: "makercubed-cubesat",
    modal: "cubesat",
    title: "MakerCubed CubeSat",
    code: "MAKERCUBED / STRUCTURES",
    tag: "SPACE HARDWARE / STRUCTURES",
    meta: "CUBESAT PROJECT",
    category: "Teams & Organizations",
    visual: "cubesat",
    ariaLabel: "Explore MakerCubed CubeSat structures work",
  },
  {
    id: "fremont-student-makers",
    modal: "makers",
    title: "Fremont Student Makers",
    code: "FREMONT / COMMUNITY",
    tag: "CO-FOUNDER / 501(c)(3)",
    meta: "FREMONT, CA",
    category: "Teams & Organizations",
    visual: "makers",
    ariaLabel: "Explore Fremont Student Makers nonprofit",
  },
  {
    id: "modular-rocket-system",
    modal: "modular-rocket",
    title: "Modular Rocket System",
    code: "PERSONAL / ENGINEERING",
    tag: "PERSONAL ENGINEERING PROJECT",
    meta: "2025",
    category: "Engineering",
    visual: "modular-rocket",
    badge: "FEATURED",
    ariaLabel: "Explore the Modular Rocket System project",
  },
  {
    id: "telemetry-lost",
    modal: "telemetry-lost",
    title: "Telemetry Lost",
    code: "PERSONAL / GAME",
    tag: "PERSONAL ENGINEERING PROJECT",
    meta: "2026",
    category: "Games",
    visual: "telemetry-lost",
    badge: "FEATURED",
    ariaLabel: "Explore the Telemetry Lost branching text RPG",
  },
  {
    id: "astroforge",
    modal: "astroforge",
    title: "AstroForge",
    code: "PERSONAL / GAME DEV",
    tag: "PERSONAL GAME DEVELOPMENT PROJECT",
    meta: "2026",
    category: "Games",
    visual: "astroforge",
    badge: "NEW",
    ariaLabel: "Explore the AstroForge rocket construction game",
  },
  {
    id: "vena",
    modal: "vena",
    title: "VENA",
    code: "ENTREPRENEURSHIP",
    tag: "ENTREPRENEURSHIP PROJECT",
    meta: "2026",
    category: "Functional Software",
    visual: "vena",
    badge: "FEATURED",
    ariaLabel: "Explore the VENA health app concept",
  },
  {
    id: "protoqueue",
    modal: "protoqueue",
    title: "ProtoQueue",
    code: "MAKERSPACE / TOOL",
    tag: "SCHOOL MAKERSPACE PROJECT",
    meta: "2026",
    category: "Functional Software",
    visual: "protoqueue",
    badge: "NEW",
    ariaLabel: "Explore the ProtoQueue makerspace print tool",
  },
];

/* ---------------------------------------------------------------------
 * 13. PROJECT DIALOG TEXT — the long-form text inside each personal project dialog. Keys must match a card's `modal` value.
 * --------------------------------------------------------------------- */
export const projectDetails: Record<
  string,
  {
    eyebrow: string;
    title: string;
    intro: string;
    sections: { heading: string; body: string }[];
    role: string;
    facts: [string, string];
    fineprint: string;
  }
> = {
  "modular-rocket": {
    eyebrow: "PERSONAL ENGINEERING PROJECT / 2025",
    title: "Modular Rocket System.",
    intro: "A modular 3D-printed rocket system built for adaptable flight testing.",
    sections: [
      {
        heading: "The concept",
        body: "A rocket designed as interchangeable modules, so the configuration can change between flight tests.",
      },
      {
        heading: "The build",
        body: "3D-printed construction throughout, built to be reconfigured rather than rebuilt.",
      },
    ],
    role: "Personal engineering project · design, print, and test",
    facts: ["CATEGORY / ENGINEERING", "FORMAT / MODULAR HARDWARE"],
    fineprint:
      "This diagram is an illustrative concept. It does not show specific flight hardware or test results.",
  },
  "telemetry-lost": {
    eyebrow: "PERSONAL PROJECT / 2026",
    title: "Telemetry Lost.",
    intro: "A branching text RPG where strategic choices shape the story and ending.",
    sections: [
      {
        heading: "The game",
        body: "A branching narrative where each decision sends the story down a different path.",
      },
      {
        heading: "Design focus",
        body: "Strategic choices with real trade-offs, leading to multiple distinct endings.",
      },
    ],
    role: "Personal project · writing, systems, and design",
    facts: ["CATEGORY / GAMES", "FORMAT / TEXT RPG"],
    fineprint:
      "The interface shown is an illustrative concept mockup, not a gameplay screenshot.",
  },
  astroforge: {
    eyebrow: "PERSONAL GAME DEVELOPMENT PROJECT / 2026",
    title: "AstroForge.",
    intro:
      "An AI-assisted rocket construction game built around designing, testing, and relaunching.",
    sections: [
      {
        heading: "The loop",
        body: "Design a vehicle, run the test, learn from the failure, and relaunch an improved version.",
      },
      {
        heading: "AI-assisted",
        body: "Built with AI assistance as part of the development workflow.",
      },
    ],
    role: "Personal game development project",
    facts: ["CATEGORY / GAMES", "FOCUS / DESIGN → TEST → RELAUNCH"],
    fineprint:
      "The interface shown is an illustrative concept mockup, not a gameplay screenshot.",
  },
  vena: {
    eyebrow: "ENTREPRENEURSHIP PROJECT / 2026",
    title: "VENA.",
    intro: "An AI-assisted health app concept for injury triage and user guidance.",
    sections: [
      {
        heading: "The concept",
        body: "An app concept that helps a user describe an injury and get guided next steps.",
      },
      {
        heading: "The intent",
        body: "Reduce the guesswork between an injury happening and knowing what to do next.",
      },
    ],
    role: "Entrepreneurship project · concept and prototype work",
    facts: ["CATEGORY / FUNCTIONAL SOFTWARE", "FOCUS / INJURY TRIAGE"],
    fineprint:
      "Illustrative concept only. VENA is not a medical device, does not provide medical advice, and has not been cleared by any regulator.",
  },
  protoqueue: {
    eyebrow: "SCHOOL MAKERSPACE PROJECT / 2026",
    title: "ProtoQueue.",
    intro: "A digital makerspace tool that organizes and tracks student 3D print jobs.",
    sections: [
      {
        heading: "The problem",
        body: "Student print requests pile up with no clear order, owner, or status.",
      },
      {
        heading: "The tool",
        body: "A shared queue that organizes jobs and tracks each one from request to finished part.",
      },
    ],
    role: "School makerspace project · built for the makerspace I help run",
    facts: ["CATEGORY / FUNCTIONAL SOFTWARE", "FOCUS / PRINT JOB TRACKING"],
    fineprint:
      "The dashboard shown is an illustrative concept mockup, not a live product screenshot.",
  },
};
