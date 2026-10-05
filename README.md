# Glozia — website

Website for **Glozia Unisex Salon & Ladies Spa**, Mallathahalli Lake Road, Nagarbhavi, Bengaluru.

Built with **React Native** via [Expo](https://expo.dev) (SDK 57) and Expo Router. The same code base
renders the website (react-native-web, statically pre-rendered for SEO) and can also be run as an
iOS / Android app.

## Pages

| Route       | What it is                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------------- |
| `/`         | Home: 3D gold-crown hero (desktop, three.js), services cover-flow, Shop (take-home product routines, ordered on WhatsApp), team, gallery, reviews, map |
| `/services` | Full menu — 254 services for her and him. Links like `/services?for=him&cat=Hair%20%26%20Beard` open a category |
| `/book`     | Booking request: pick services, stylist, day and time; sends the request to the studio's WhatsApp |

From other pages, the Studio / Shop / Team / Visit links go to `/?s=<section>`.

## Motion

Every page animates, and all of it switches off when the visitor prefers reduced motion.

- **3D (three.js, screens 720px and wider):** the gold crown on the home page, and a layer of floating pearls, gold rings and gold dust behind the Services, Booking and 404 headings (`3d/src/ambient.js`). Both share one on-demand three.js download. Phones get light CSS gold dust instead.
- **Entrances and scroll reveals:** `<Enter>` plays on first paint (pure CSS, so it needs no JavaScript); `<Reveal>` rises in as a section scrolls into view (`src/components/motion.web.tsx`, styles in `src/global.css`).
- **Interactions:** sliding For her / For him switch and category marker, cascading price rows with dotted leaders that draw in, lifting option cards, a counting booking total, a sheen on the ready booking button, tilt and glare on the team cards and Shop niches, and button and nav hover states.

## Develop

```bash
npm install
npm run web        # dev server at http://localhost:8081
npm run typecheck
npm run lint
npm run build      # static export to dist/
```

`npm run ios` / `npm run android` start the native app in Expo Go or a development build.

## Deploy (Vercel)

`vercel.json` is set up for a static deployment: Vercel runs `npm run build` and serves `dist/`
with clean URLs (`/services`, `/book`) and a branded 404 page. Import the GitHub repo in Vercel
with the framework preset left as **Other** — no other settings are needed.

## Project layout

```
src/app/            routes (Expo Router): _layout, +html (page shell, SEO, schema.org), index, services, book, +not-found
src/components/     shared UI; home/ holds the home-page sections
                    *.web.tsx files are web-only versions (3D hero, CSS 3D cover-flow and gallery, tilt, Google Maps embed)
src/constants/      brand colours & fonts, contact details & hours, page copy, image map
src/data/           menu.ts (menu copy from design/Services.dc.html), shop.ts (reads data/shop-routines.json)
data/               glowdesk-services.json (raw GlowDesk catalogue), shop-routines.json (Shop routines)
3d/                 three.js scenes: src/scene.js (hero crown), src/ambient.js (pearls behind headings), src/web.js (shared entry)
brand/ photos/      logo SVGs and photography
design/             design boards, handoff notes and reference screenshots (reference only)
public/             favicons, copied as-is into the export
```

Prices everywhere are static, in ₹ and before GST; nothing is connected to GlowDesk. To change a
price, edit `src/data/menu.ts` (services) or `data/shop-routines.json` (Shop).

## Before launch

- **Photos** in `photos/` are stock placeholders (Unsplash and Pexels licences, see `photos/SOURCES.txt`) — swap in the studio's own.
- **Team portraits**: the team cards (and the stylist avatars on `/book`) show the design's placeholder — a gold initial in a dark arch, with "Portrait coming soon" — until real portraits exist. The fourth card reads "Spa team"; use the therapist's name if you prefer (`src/constants/content.ts`). The Pexels team photos in `photos/team-*.jpg` aren't used.
- **Bookings** open WhatsApp with a pre-filled request to +91 73378 76023; the studio confirms by reply. Add a cancellation policy line to the booking page if you have one.
- **Social preview image**: once the site has its final domain, add an `og:image` tag in `src/app/+html.tsx`.
