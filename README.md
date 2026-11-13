# A Personal Flight Log — Site Manual

This is a personal portfolio site with six pages: **Home, Experience, Projects, Atlas, Photos, and Field Notes**. It's built with React, TypeScript, and Vite, and compiles to a single `dist/index.html` file.

Most of what you'll want to change lives in **one file: `src/data.ts`**. This manual explains where everything is and gives step-by-step recipes for the most common edits.

---

## Contents

1. [Running the site](#1-running-the-site)
2. [Where things live](#2-where-things-live)
3. [Recipes](#3-recipes)
   - [Change your name, email, or intro](#change-your-name-email-or-intro)
   - [Change the Spotify song on the home page](#change-the-spotify-song-on-the-home-page)
   - [Add or edit a role on the Experience page](#add-or-edit-a-role-on-the-experience-page)
   - [Add a project](#add-a-project)
   - [Add a destination to the Atlas](#add-a-destination-to-the-atlas)
   - [Add a country or a flag](#add-a-country-or-a-flag)
   - [Add a photo](#add-a-photo)
   - [Add a Field Notes article](#add-a-field-notes-article)
   - [Add a new page](#add-a-new-page)
   - [Update the printable résumé (PDF)](#update-the-printable-résumé-pdf)
4. [Images and drawings](#4-images-and-drawings)
5. [Checking your changes](#5-checking-your-changes)
6. [Building and publishing](#6-building-and-publishing)
7. [Troubleshooting](#7-troubleshooting)
8. [Project structure](#8-project-structure)

---

## 1. Running the site

You need Node.js 20 or newer.

```sh
npm install          # first time only
npm run dev          # starts a local preview at http://localhost:5173
```

Every change you save appears in the browser immediately.

To build the production file:

```sh
npm run build        # writes dist/index.html
```

---

## 2. Where things live

| What you want to change | File | Search for |
|---|---|---|
| Name, email, Spotify default | `src/data.ts` | `profile`, `defaultSpotifyUrl` |
| Field Notes articles | `src/data.ts` | `notes` |
| Atlas destinations | `src/data.ts` | `travelSpots` |
| Atlas region tabs | `src/data.ts` | `travelSectors` |
| Photos | `src/data.ts` | `photos` |
| Experience roles | `src/data.ts` | `experienceTeams` |
| Résumé text (on the website) | `src/data.ts` | `resume` |
| Project cards | `src/data.ts` | `projectCards` |
| Project filter tabs | `src/data.ts` | `projectCategories` |
| Personal project dialog text | `src/data.ts` | `projectDetails` |
| Page list and menu order | `src/App.tsx` | `navItems` |
| Page layout and headings | `src/App.tsx` | `PageIntro`, `<Route` |
| Dialog text (About, Contact) | `src/App.tsx` | `modal ===` |
| Project illustrations (drawings) | `src/components/ProjectVisuals.tsx` | `export function` |
| Colors and spacing | `src/index.css` | `:root` |
| Printable résumé PDF | `scripts/generate-resume.mjs` | `content` |
| Site title for the browser tab | `index.html` and `pageTitles` in `src/App.tsx` | `<title>` |

`src/data.ts` is organized into numbered sections. Each section begins with a comment banner like this one:

```ts
/* ---------------------------------------------------------------------
 * 12. PROJECT CARDS — one object per project on the Projects page.
 * --------------------------------------------------------------------- */
```

---

## 3. Recipes

### Change your name, email, or intro

Open `src/data.ts` and edit the `profile` block at the top:

```ts
export const profile = {
  name: "Dylan Kwok",
  email: "hello@dylankwok.space",
  description: "…",
};
```

The name appears in the header, hero, footer, and the résumé. The email appears in the contact dialog and the résumé.

The word **"Dylan"** also appears in a few hardcoded lines in `src/App.tsx` (the "About" dialog and the hero intro). Search the file for `Dylan` and edit those directly if you need to change them.

---

### Change the Spotify song on the home page

Get a link from Spotify (Share → Copy link). Paste it into `defaultSpotifyUrl`:

```ts
export const defaultSpotifyUrl =
  "https://open.spotify.com/track/7H0ya83CMmgFcOhw0UB6ow";
```

Visitors can change this themselves with the **Tune in** button; their choice is saved in their browser.

---

### Add or edit a role on the Experience page

Find `experienceTeams` in `src/data.ts`. Each role is one object:

```ts
{
  id: "untitled-rocketry",              // unique, no spaces
  role: "Founder",                       // job title
  team: "Untitled Rocketry",             // organization name
  period: "CURRENT",                     // shown top-right, e.g. "2025 — PRESENT"
  type: "Community / Competition",       // small tag above the title
  description: "One or two sentences…",
  highlights: ["Short point", "Another point"],   // bullet tags
  focus: "Founder · rocketry community",         // one-line summary at the bottom
},
```

To **add** a role, copy an existing block, change the values, and paste it at the end of the list (before the closing `];`).

To **remove** a role, delete its block.

The **first role** in the list opens by default on phones. Put your most important role first.

The same list feeds the résumé card on the Experience page and the on-site résumé dialog, so you only need to edit it once.

---

### Add a project

Adding a project takes two edits in `src/data.ts`, plus an optional illustration.

#### Step 1 — Add a card

Find `projectCards` (section 12). Copy an existing card and fill in your details:

```ts
{
  id: "my-new-project",                 // unique, lowercase, dashes only
  modal: "my-new-project",              // must match a key in projectDetails (step 2)
  title: "My New Project",              // shown on the card
  code: "MY / PROJECT",                 // small label across the top of the card image
  tag: "PERSONAL PROJECT / 2026",       // small line under the title (left)
  meta: "CATEGORY NOTE",                // small line under the title (right)
  category: "Engineering",              // must match a category name in projectCategories
  visual: "modular-rocket",             // which drawing to show (see below)
  badge: "NEW",                         // optional: "FEATURED" or "NEW", or delete this line
  ariaLabel: "Explore My New Project",  // screen-reader text, describes the click action
},
```

**Choosing `category`** — must exactly match one of these, from `projectCategories`:
- `"Teams & Organizations"`
- `"Engineering"`
- `"Games"`
- `"Functional Software"`

Want a new category? Add it to `projectCategories` (section 11) with a matching label, then use it on a card.

**Choosing `visual`** — which drawing appears on the card:

| `visual` value | Drawing | Best for |
|---|---|---|
| `"rocketry"` | Rocket photo-style image | Rocket projects (uses `/images/model-rocket.svg`) |
| `"h2gp"` | Vehicle diagram | Team vehicle |
| `"cubesat"` | CubeSat structure | Satellite hardware |
| `"makers"` | Community network | Organizations |
| `"modular-rocket"` | Modular rocket | Modular rocket projects |
| `"telemetry-lost"` | Terminal + branch map | Text games |
| `"astroforge"` | Parts + stats UI | Build/design games |
| `"vena"` | Phone app screens | Apps |
| `"protoqueue"` | Print queue dashboard | Dashboards and tools |

Not sure? Pick the closest match. You can replace the drawing later (see [Images and drawings](#4-images-and-drawings)).

**Badges** — `"FEATURED"` shows a solid orange tag; `"NEW"` shows an outlined tag. Delete the `badge` line for no tag.

#### Step 2 — Add the dialog text

Find `projectDetails` (section 13). Add an entry whose **key is the same as the card's `modal` value**:

```ts
"my-new-project": {
  eyebrow: "PERSONAL PROJECT / 2026",     // small line at the top of the dialog
  title: "My New Project.",               // large heading
  intro: "One sentence that summarizes it.",
  sections: [
    { heading: "The idea", body: "What you built and why." },
    { heading: "What I learned", body: "Something specific you took away." },
  ],
  role: "What your role was, e.g. design, programming, and testing.",
  facts: ["CATEGORY / ENGINEERING", "FORMAT / 3D-PRINTED HARDWARE"],
  fineprint: "Any disclaimer. Keep it short, or use an empty string \"\".",
},
```

**Important:** `projectDetails` only works for the personal projects with a built-in dialog (the five personal projects). The four organizations (Untitled Rocketry, Irvington Driving Force, MakerCubed, Fremont Student Makers) have their own dialogs in `src/App.tsx`, so you don't need entries for them there.

#### Step 3 — Test it

Save, then check the Projects page in your browser:

```sh
npx tsc --noEmit    # catches typos and missing fields
```

If the new card's **category filter** doesn't show it, the `category` spelling is probably slightly different from the list in `projectCategories`.

#### Adding a fully custom project dialog (advanced)

If you want a project to have its own dialog layout (like Untitled Rocketry), it's easier to copy an existing block in `src/App.tsx`. Search for `modal === "rocketry"`, copy the whole block, rename the key, and add the new key to `ModalName` near the top of the file.

---

### Add a destination to the Atlas

Find `travelSpots` (section 6). Copy an existing destination and edit:

```ts
{
  id: "lisbon",                               // unique, lowercase, dashes
  place: "Lisbon",                            // name on the globe and list
  region: "Lisbon, Portugal",                 // shown under the name
  country: "Portugal",                        // used for the country counter
  countryFlag: "PT",                          // flag code (see Add a country or a flag)
  flagCode: "PT",                             // same as countryFlag for non-US places
  flagLabel: "Flag of Portugal",              // used for accessibility text
  sector: "Europe",                           // "North America" | "Europe" | "Asia" | "Pacific" | "Middle East"
  cluster: "Iberia & Western Europe",         // short group name for the list
  coordinates: [-9.1393, 38.7223],            // [LONGITUDE, LATITUDE]
  year: "PORTUGAL",                           // short tag shown on the list
  label: "38.72° N / 9.14° W",                // coordinates as displayed
  note: "One or two sentences about the place.",
  kind: "Places",                             // "Home" | "Fieldwork" | "Places"
},
```

**Coordinates** are `[longitude, latitude]` — longitude first. West and south are negative. Easy way to find them: right-click any spot in Google Maps and copy the numbers.

**Only one** destination should have `kind: "Home"` — this is your home base and the starting point of the dashed route.

**The `label`** is just for display. Keep it consistent with `coordinates`.

**Adding a sector** is rare; if you need one, update `TravelSector` and add a tab to `travelSectors`.

---

### Add a country or a flag

Every destination needs `countryFlag` and `flagCode`. Use these codes:

**National flags** (use the two-letter ISO country code for both fields):

| Country | Code | Country | Code |
|---|---|---|---|
| United States | `US` | Japan | `JP` |
| Mexico | `MX` | China | `CN` |
| Canada | `CA` | Spain | `ES` |
| Jamaica | `JM` | France | `FR` |
| United Kingdom | `GB` | Italy | `IT` |
| Switzerland | `CH` | United Arab Emirates | `AE` |

**US state flags** (for places inside the United States, set `countryFlag: "US"` and `flagCode` to the state):

| State | `flagCode` |
|---|---|
| California | `US-CA` |
| Arizona | `US-AZ` |
| New York | `US-NY` |
| Massachusetts | `US-MA` |
| Florida | `US-FL` |
| Hawaii | `US-HI` |

**Adding a brand-new country** requires two extra steps, so for a new country:

1. Add the flag drawing to `FlagSvgContents` in `src/components/FlagBadge.tsx`. Use the existing cases as a pattern.
2. Add its code to the `FlagCode` type at the top of the same file.
3. Add the country's name to `ATLAS_COUNTRY_NAME` in `src/components/GlobeSection.tsx` so the globe highlights it.

Any country not in the table will show the globe fill but no flag.

---

### Add a photo

1. Put the image file in `public/photos/` (e.g. `my-trip.jpg`).
2. In `src/data.ts`, find `photos` (section 7) and add:

```ts
{
  id: "my-trip",
  src: "/photos/my-trip.jpg",               // leading slash, must match the file name
  alt: "Short description for screen readers",
  title: "The title shown on the photo",
  location: "City, Country",
  category: "Places",                       // "Places" or "Fieldwork" (filter buttons)
  date: "MAR 2026",
  credit: "Photographer / Source",          // shown in the lightbox
},
```

**Tip:** photos look best around 1600 px wide or less. Large files slow the page down.

**Photo filters** are built automatically from the `category` values you use. A new category (for example `"Travel"`) appears as a filter button the moment you add a photo with it.

---

### Add a Field Notes article

Find `notes` (section 3) and add an object:

```ts
{
  id: "my-article",                          // unique, lowercase, dashes
  number: "004",                             // shown as FIELD NOTE 004
  date: "NOV 20, 2026",
  category: "Learning",                      // "Learning" or "Perspective" (filter buttons)
  title: "The title of the article.",
  summary: "A one-line summary shown in the dialog.",
  readingTime: "3 MIN READ",
  paragraphs: [
    "First paragraph.",
    "Second paragraph.",
  ],
},
```

**Each paragraph** is one string in the `paragraphs` list. Put a comma after each one.

**Ordering:** the list shows articles in the order they appear in `notes`. Put the newest first.

**Filter buttons:** the filter buttons are fixed to **"All notes", "Learning", and "Perspective"**. If you use a different category, you also need to add it to the list in `src/App.tsx` (search for `"All notes"`).

---

### Add a new page

Adding a page takes three steps.

1. **Register the page** in `src/App.tsx`. Find `type PageKey` and add your new name:

   ```ts
   type PageKey = "home" | "experience" | "projects" | "atlas" | "photos" | "notes" | "about-me";
   ```

2. **Add it to the menu.** Find `navItems` and add an entry (the menu order follows this list):

   ```ts
   { id: "about-me", label: "About", to: "/about-me", blurb: "Background", icon: <ArrowUpRight size={16} /> },
   ```

   Also add a title in `pageTitles`:

   ```ts
   "about-me": "About · Dylan Kwok",
   ```

3. **Add the page content.** In `src/App.tsx`, find `<Routes>` and add a route next to the others:

   ```tsx
   <Route
     path="/about-me"
     element={
       <>
         <PageIntro
           index="01"
           eyebrow="ABOUT"
           title="Something about me."
           lede="A short introduction."
         />
         {/* Your content here: paragraphs, cards, or other components */}
         <SectionShortcuts current="about-me" />
         {contactAndFooter}
       </>
     }
   />
   ```

Keep `<SectionShortcuts>` and `{contactAndFooter}` at the end of every page so visitors can keep browsing.

---

### Update the printable résumé (PDF)

There are two résumés:

- **The on-site résumé** (the "View résumé" button) is built from `resume` and `experienceTeams` in `src/data.ts`. Edits there appear immediately.
- **The downloadable PDF** is generated by `scripts/generate-resume.mjs`. The PDF doesn't update automatically.

After editing the on-site résumé text, update the matching lines in `scripts/generate-resume.mjs` and regenerate:

```sh
node scripts/generate-resume.mjs
```

This writes `public/documents/dylan-kwok-resume.pdf`. Run `npm run build` afterward so the new PDF is included.

---

## 4. Images and drawings

Images go in the `public/` folder. A file at `public/photos/a.jpg` is referenced in code as `/photos/a.jpg`.

| Folder | Used for |
|---|---|
| `public/photos/` | Photo archive and some section images |
| `public/images/` | Hero image, rocket illustration |
| `public/documents/` | The downloadable résumé PDF |
| `public/fonts/` | Typefaces (don't rename these) |

**The project drawings** are SVG components in `src/components/ProjectVisuals.tsx`. To replace one with a real photo or screenshot:

1. Add the image to `public/images/`.
2. In `src/App.tsx`, find `renderProjectVisual` and change the case for that project to return an `<img>` instead of the drawing.

```tsx
case "telemetry-lost":
  return <img src="/images/telemetry-lost.png" alt="Telemetry Lost screenshot" className="project-visual" />;
```

Use a 16:10 aspect ratio for the best fit.

---

## 5. Checking your changes

Run these in order after any edit:

```sh
npx tsc --noEmit        # checks for typos and missing fields (fast)
npm run dev             # view the site in your browser
```

The **most common mistakes**, and what they look like:

| Symptom | Likely cause |
|---|---|
| Red error in the terminal, mentions `TS…` | A missing comma, quote, or field. The line number tells you where. |
| A project card doesn't appear under its filter | The `category` doesn't exactly match a name in `projectCategories`. |
| Clicking a card does nothing | The card's `modal` value doesn't match its `projectDetails` key (for personal projects). |
| A photo shows a broken image | The `src` path is wrong, or the file isn't in `public/photos/`. |
| The Atlas doesn't show a pin | `coordinates` are in the wrong order. Use `[longitude, latitude]`. |
| A country shows on the globe but no flag | Its `countryFlag` / `flagCode` isn't in the flag table. |

For a full test run:

```sh
npx playwright test     # runs the browser tests
```

---

## 6. Building and publishing

```sh
npm run build           # creates dist/index.html
```

`dist/index.html` is a **single self-contained file**. You can host it on any static host (GitHub Pages, Netlify, Vercel, or a plain web server). Upload the whole `dist/` folder.

The site uses hash-based links (`/#/projects`), so it works without any special server configuration.

---

## 7. Troubleshooting

**The site looks unstyled or fonts look wrong.** Check that `public/fonts/` contains `space-grotesk-regular.ttf`, `space-grotesk-medium.ttf`, and `ibm-plex-mono.ttf`. If they're missing, the site falls back to system fonts.

**The Atlas globe is blank or flickers.** Refresh the page. If it persists, check the browser console for errors. Most often this is a bad coordinate (`NaN` or a missing comma).

**The résumé PDF is out of date.** Run `node scripts/generate-resume.mjs` and then `npm run build`.

**Changes don't appear in the production build.** Run `npm run build` again, then reload the `dist/index.html` file with the cache cleared.

**Tests fail after a content change.** The tests check specific names (for example, the project titles). Update the matching expectations in `tests/site.spec.ts`.

---

## 8. Project structure

```
src/
  data.ts                 ← content: edit this most often
  App.tsx                 ← pages, navigation, and dialogs
  index.css               ← colors, spacing, and responsive styles
  main.tsx                ← entry point (don't edit)
  components/
    GlobeSection.tsx      ← Atlas page (globe and destination list)
    Gallery.tsx           ← Photos page
    ExperienceSection.tsx ← Experience page
    Resume.tsx            ← on-site résumé dialog
    ProjectVisuals.tsx    ← project drawings
    FlagBadge.tsx         ← country and state flags
    OrbitDiagram.tsx      ← orbital model on the Projects page
    Modal.tsx             ← shared dialog wrapper
public/
  photos/                 ← photo archive images
  images/                 ← hero and illustration images
  documents/              ← downloadable résumé PDF
  fonts/                  ← typefaces
scripts/
  generate-resume.mjs     ← builds the résumé PDF
tests/
  site.spec.ts            ← browser tests
```

Files you usually **shouldn't** need to touch: `main.tsx`, `vite.config.ts`, `package.json`, `tsconfig.json`.
