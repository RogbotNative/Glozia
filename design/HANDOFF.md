# Glozia website — design handoff

This folder is an exact copy of the latest Glozia design canvas (updated 5 October 2026). Use it as the
source of truth when updating the Expo build in this repo. Don't edit anything in `design/`: it's
the reference.

## Which board is which

| Board | Route in the build | Use |
| --- | --- | --- |
| `Home3D.dc.html` (1440 × 7850) | `/` | **Canonical home page** |
| `Services.dc.html` (1440 × 2920) | `/services` | Canonical |
| `Booking.dc.html` (1440 × 1880) | `/book` | Canonical |
| `Mobile.dc.html` (390 × 8000) | — | Earlier "quiet luxury" mobile mock. Use it only for mobile type scale, spacing and header/menu patterns. Its section list is out of date; Home3D's sections win. |
| `Main.dc.html` | — | Earlier quiet-luxury desktop direction. Reference only, don't build it. |
| `canvas.json` | — | Canvas layout metadata. Ignore. |

Reference renders are in `design/screenshots/`:

- `home3d-01-hero` … `home3d-10-footer`: one per home section, 1440 px wide.
- `services-01…03` and `booking-01…02`: the other two pages at 1440 px.
- `mobile-reference-01…08`: the older mobile mock, for patterns only.

## Reading a `.dc.html` board

- The markup is inside `<x-dc>`. Page CSS, classes (`.hbtn`, `.btn-dark`, `.seg`, …) and keyframes are in `<helmet>`.
- Inline styles are the spec. Copy pixel sizes, colours, letter-spacing and line-heights from them.
- `{{name}}` holes are filled by `renderVals()` in the `<script type="text/x-dc" data-dc-script>` block at the bottom (`class Component extends DCLogic`). That block also holds the data (services, reviews, team, shop routines) and the interaction logic (cover-flow drag/snap, tilt, autoplay).
- `<sc-for list="{{items}}" as="x">` repeats its children for each item. `<sc-if value="{{flag}}">` renders its children only when `flag` is true. Ignore `hint-placeholder-*` attributes: they're editor hints.
- `/_blob/<id>` is an uploaded file. `design/asset-map.json` gives the matching file in this repo for every id.

## Tokens

These are already in `src/constants/theme.ts`, so keep using it.

- **Colours:** cream `#F6F1EA`, sand `#EDE4D8`, ink `#2A211C`, body `#4F4238`, muted `#6B5B4E`, bronze `#8A6128`, gold `#C4914D`, espresso `#231B17`, night `#1B1512` and on-dark muted `#BDAE9F`.
- **Type:** Cormorant Garamond (300/400 and italics) for headings, Jost for body and labels. Eyebrows are 11–12 px, uppercase, with letter-spacing of 0.2–0.24em.

## What changed since this build was made

Each item names the file in the build that needs it.

1. **Hero** (`src/components/home/hero.web.tsx`)
   - Remove the Day / Dusk switch and everything that depends on it:
     - the `MODE` table and the `mode` state
     - the dusk photo layer
     - the `Segment` buttons and the `setMode` calls
     - `SiteHeader tone={mode}`, which is now always `day`
   - The scene mounts in `day` mode only.
   - The bottom bar keeps "Drag the crown to turn it · tap it to make it shine" on the left. On the right it reads "Open every day · 9:00 am – 8:30 pm (Fridays from 10:00 am)". The Friday note is new: the studio opens at 10 on Fridays. See `home3d-01-hero`.
2. **Header** (`src/components/site-header.tsx`)
   - The home page header, which overlays the hero, has **no bottom divider line**. Keep the 1px line on `/services` and `/book`, which still have it in their boards.
   - Nav order: Services · Studio · **Shop** · Team · Visit. Add `['Shop', 'shop']` to `SECTIONS` so the item also shows in the mobile menu.
   - From other pages, Shop goes to `/?s=shop` like the other sections.
3. **Shop replaces "From booking to bill"**
   - Delete `src/components/home/experience.tsx` and `experienceSteps` in `content.ts`.
   - Add the new Shop section with `id="shop"` between the services cover-flow and the team. The spec is below; see `home3d-05-shop`.
4. **Team** (`src/components/home/team.tsx`)
   - Replace the initials, the crown and "Portrait coming soon" with photos:

     | Card | Photo |
     | --- | --- |
     | Sajan | `photos/team-hair-cut.jpg` |
     | Salman | `photos/team-barber-tools.jpg` |
     | Arjun | `photos/team-hair-detail.jpg` |
     | Spa team | `photos/team-spa-massage.jpg` |

   - The photo covers the whole arch.
   - Add a bottom gradient: `transparent 55% → rgba(27,21,18,0.45)`.
   - The inner border is 1px `rgba(233,207,160,0.62)`, inset 12px.
   - Keep the tilt and the glare.
   - These are stock stand-ins showing hands at work, so the alt text describes the photo, not the person (see `asset-map.json`).
   - Keep the label "Spa team". Add the photos to `src/constants/images.ts`. See `home3d-06-team`.
5. **Gallery** (`src/components/home/gallery.web.tsx`)
   - Delete the "Hover to pause the carousel" caption.
   - Hover must still pause the cylinder. Keep the CSS rule and make it `animation-play-state: paused !important`.
6. **Booking page** (`src/app/book.tsx`)
   - Each stylist option gets a 56px round avatar above the name.
   - Sajan, Salman and Arjun use their team photo, cropped to cover the circle.
   - "Any stylist" is an espresso `#231B17` circle with `brand/glozia-crown-gold.svg` at 30 × 15 in the middle.
   - See `booking-01`.
7. **Visit**
   - Keep the **live Google Maps embed**. The map picture in the design is only a stand-in.
   - Optional: point "Get directions" at the salon's exact Google listing: `https://www.google.com/maps/dir/?api=1&destination=Glozia+Unisex+Salon+and+ladies+Spa+Nagarbhavi&destination_place_id=ChIJu1QiTQU_rjsR5uzM3TJKhCQ`
8. **README**
   - Drop "Day/Dusk lighting".
   - Under "Before launch", note that the team photos are Pexels stand-ins (`photos/SOURCES.txt`) and must be replaced with real portraits.

After these, compare every section with its screenshot and fix any other difference in layout, spacing, type, colour or copy.

## Shop section spec

All exact values are inline in `Home3D.dc.html`, inside `<section id="shop">`, and the data is in `data/shop-routines.json`.

- **Frame:** espresso `#231B17` background, cream text, 1020px tall at 1440 wide, padding `104px 96px`, 40px gap between rows.
- **Heading block** (max-width 660):
  - Eyebrow "Shop" in gold `#C4914D`.
  - H2 "Take the salon *home.*", serif 56/1.06, weight 300.
  - Intro, 16/1.7, colour `#BDAE9F`: "The professional ranges on our shelf, matched to the service you came in for — so your colour, smoothness and shine keep going between visits."
- **Routine tabs:**
  - Six pill buttons inside a 1px `rgba(246,241,234,0.2)` rounded track with 5px padding and 6px gaps.
  - The container uses `role="group"` with `aria-label="Choose a routine"`. Each button uses `aria-pressed`.
  - Active tab: background `#C4914D`, text `#1B1512`. Inactive: transparent, text `#E9DFD2`.
- **Left panel** (340px wide, `aria-live="polite"`):
  - Routine title: serif 34px, weight 300.
  - Description: 15/1.65, `#BDAE9F`.
  - "Pairs with": a label plus service chips (13px, 1px `rgba(196,145,77,0.45)` pill border, text `#EDE4D8`).
  - A divider (`rgba(246,241,234,0.14)`), then "Full routine" on the left and the total on the right (serif 38px, `#E6BE7E`, e.g. ₹2,165).
  - At the bottom: an "Order on WhatsApp" light button, with "or pick it up at the front desk" (13px) under it.
- **WhatsApp link:** `whatsappUrl(message)` from `src/constants/site.ts`.
  - Message format: `Hi Glozia, I’d like the {label, lowercase} routine: {Range type, lowercase, comma-separated}.`
  - Example: `Hi Glozia, I’d like the after colour routine: Vitamino Color shampoo, Vitamino Color masque.`
- **Shelf** (56px gap after the panel): one 254px column per product (two or three per routine).
  - Each product sits in an arch niche 340px tall: radius `127px 127px 4px 4px`, 1px `rgba(196,145,77,0.28)` border, a radial spotlight on `#2B221D`, and a soft shadow ellipse under the bottle.
  - Bottle drawing:
    - Four shapes, each with a gold `#C4914D` cap and tinted with the routine's `tint`:
      - shampoo, viewBox 0 0 132 236
      - masque, 150 × 150
      - serum, 100 × 210
      - oil, 110 × 236
    - Copy them from the `isShampoo` / `isMasque` / `isSerum` / `isOil` blocks in the board into `react-native-svg` components (already a dependency).
    - The bottle floats 10px up and down over 5.5s. Each product starts 1.3s earlier than the one before it.
  - Pointer tilt and glare work the same way as the team cards.
  - Under each niche: "L'ORÉAL PROFESSIONNEL" in small gold caps, the range name in serif 25px, then a row with the type on the left and the price on the right.
- **Footnote** (`alsoOnShelf` in the JSON): "Also on the shelf: Biolage serum ₹350 · Streax Professional serum ₹340 · Hydra Keratin shampoo ₹870 and mask ₹999. All prices before GST."
- **Motion:**
  - With `prefers-reduced-motion`, there's no float and no tilt.
  - On touch devices there's no tilt. The float can stay.
- **Below 1024px** (not drawn in the design, so build it this way):
  - The tabs become a single horizontally scrolling row with snap.
  - The panel stacks above the shelf.
  - The shelf becomes a horizontally scrolling row of niches about 220px wide and 300px tall.
  - On mobile the WhatsApp button is full width.

## Rules

- Keep the stack and setup:
  - Expo Router, react-native-web and the static export
  - the routes, the SEO in `+html.tsx` and `vercel.json`
  - the WhatsApp booking flow
  - the three.js scene in `3d/src/scene.js`, which is identical to the one the design uses
- Prices are static, in INR, before GST. Don't connect anything to GlowDesk, and don't add API keys or env vars.
- Every animation respects `prefers-reduced-motion`.
- The photos are stock stand-ins: the Unsplash and Pexels licences are listed in `photos/SOURCES.txt`. The design's map image is © OpenStreetMap contributors and isn't used in the build.

## Done when

- `npm run typecheck`, `npm run lint` and `npm run build` all pass, and the browser console is clean.
- At 1440px every home section matches its `home3d-*` screenshot. `/services` matches `services-*` and `/book` matches `booking-*`.
- At 390px and 820px there's no horizontal page scroll, the Shop tabs and shelf scroll by touch, and the team shows a 2 × 2 grid of photos.
- `grep` finds no "Dusk", "From booking to bill", "Portrait coming soon" or "Hover to pause" left in `src/`.
