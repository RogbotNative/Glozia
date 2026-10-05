// Tidies the static export for Vercel.
import { copyFileSync, existsSync, rmSync } from 'node:fs';

// Vercel serves dist/404.html for unknown paths; Expo exports the not-found route as +not-found.html.
if (existsSync('dist/+not-found.html')) {
  copyFileSync('dist/+not-found.html', 'dist/404.html');
  console.log('postexport: copied +not-found.html to 404.html');
} else {
  console.warn('postexport: dist/+not-found.html not found; skipping 404 page');
}

// Expo Router's development sitemap isn't meant for visitors.
rmSync('dist/_sitemap.html', { force: true });
