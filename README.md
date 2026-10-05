# Glozia — website

Website for **Glozia Unisex Salon & Ladies Spa**, Mallathahalli Lake Road, Nagarbhavi, Bengaluru.

Built with **React Native** via [Expo](https://expo.dev) (SDK 57) and Expo Router. The same code base
renders the website (react-native-web, statically pre-rendered for SEO) and can also be run as an
iOS / Android app.

## Pages

| Route       | What it is                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------------- |
| `/`         | Home: 3D gold-crown hero (desktop, three.js) with Day/Dusk lighting, services cover-flow, team, gallery, reviews, map |
| `/services` | Full menu — 254 services for her and him, from `data/glowdesk-services.json`. Links like `/services?for=him&cat=Hair%20%26%20Beard` open a category |
| `/book`     | Booking request: pick services, stylist, day and time; sends the request to the studio's WhatsApp |

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
                    *.web.tsx files are web-only versions (3D hero, CSS gallery, Google Maps embed)
src/constants/      brand colours & fonts, contact details & hours, page copy, image map
src/data/           menu built from data/glowdesk-services.json
3d/                 three.js crown scene (src/scene.js), loaded on demand by the desktop hero
brand/ photos/      logo SVGs and photography
design/             original design boards (reference only)
public/             favicons, copied as-is into the export
```

## Before launch

- **Photos** in `photos/` are Unsplash stock placeholders (see `photos/SOURCES.txt`) — swap in the studio's own.
- **Team portraits**: the team cards show initials until portraits exist; the fourth card reads "Spa team" — replace it with the therapist's name in `src/constants/content.ts`.
- **Bookings** open WhatsApp with a pre-filled request to +91 73378 76023; the studio confirms by reply. Add a cancellation policy line to the booking page if you have one.
- **Social preview image**: once the site has its final domain, add an `og:image` tag in `src/app/+html.tsx`.
