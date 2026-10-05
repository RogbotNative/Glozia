Update the Glozia website in this repo so it matches the latest design exactly.

## Context

- This repo is the Glozia site, built with Expo Router and react-native-web. It's exported as static files to `dist/` and deployed on Vercel (see README.md).
- The design source of truth is in `design/`. Start with `design/HANDOFF.md`. It:
  - maps each design board to a route
  - lists every change made since this build was created
  - specifies the new Shop section
  - explains how to read the `.dc.html` boards
- Where to find things:
  - Reference renders at 1440px are in `design/screenshots/`: `home3d-01…10`, `services-01…03` and `booking-01…02`.
  - Every `/_blob/<id>` in the boards points to a repo file listed in `design/asset-map.json`.
  - Shop data is in `data/shop-routines.json`.
  - New team photos are `photos/team-*.jpg`.

## What to do

1. Read `design/HANDOFF.md`. Then read `design/Home3D.dc.html`, `design/Services.dc.html` and `design/Booking.dc.html`, including the markup and the logic class at the bottom of each. Look at the screenshots.
2. Write a short plan mapping each change in HANDOFF.md to the files you'll touch, then implement all of it:
   - **Hero:** remove the Day/Dusk switch so there's day lighting only, and add the Friday note to the hours line.
   - **Header:** remove the divider line on the home page only, and add Shop to the nav and the mobile menu.
   - **Shop:** replace the "From booking to bill" Experience section with the new Shop section.
   - **Photos:** use the new photos on the team cards and on the `/book` stylist avatars.
   - **Gallery:** remove the "Hover to pause the carousel" caption. Hovering must still pause it.
   - **README:** update it to match.
3. Compare the build with the design section by section at 1440px:
   - Run the dev server (`npm run web`, port 8081), screenshot each section and compare it with the matching design screenshot.
   - Fix any other difference in layout, spacing, typography, colour or copy.
   - Check 820px and 390px too. There must be no horizontal scrolling, and the Shop tabs and shelf must work by touch.
4. Run `npm run typecheck`, `npm run lint` and `npm run build`, and fix every error and warning you introduced. The browser console should be clean.

## Rules

- Keep the stack, routes, SEO, `vercel.json` and the WhatsApp booking flow as they are.
- Don't connect anything to GlowDesk and don't add API keys or env vars. Prices stay static, in ₹ and before GST.
- Keep the live Google Maps embed. The map picture in the design is only a stand-in.
- Every animation must respect `prefers-reduced-motion`.
- Don't change anything in `design/`. It's the reference.
- The team photos are stock stand-ins, so their alt text describes the photo and doesn't name the person.

When you're done, commit on a new branch called `design-update` and don't push. Then reply with a summary of what changed and anything in the design you couldn't match or that needs a decision from me.
