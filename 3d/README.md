# Glozia 3D hero scene

The gold crown hero used on the "Home — 3D, lively" board.

- `src/scene.js` — scene source (three.js r186): gold crown extruded from the Glozia logo, pearls,
  gold rings, gold dust, Day/Dusk lighting, pointer-follow, drag-to-spin, tap-to-shine,
  pauses when off-screen, respects prefers-reduced-motion.
- `crown.json` — the crown outline traced from the logo (SVG path data).
- `dist/glozia-scene.js` — minified bundle; exposes `window.GloziaScene.mount(canvas, { mode, onReady })`
  which returns `{ setMode('day'|'dusk'), shine(), dispose() }`.

Rebuild:

    npm install three esbuild
    npx esbuild src/scene.js --bundle --minify --format=iife --outfile=dist/glozia-scene.js

For the Next.js build, import `mount` from `src/scene.js` inside a client component and call it in
`useEffect` with a ref to a `<canvas>`; call `dispose()` in the cleanup.
