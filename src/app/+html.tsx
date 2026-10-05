import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

import { site } from '@/constants/site';

/**
 * Pages are pre-rendered at a phone width. On wider screens the page stays hidden for a moment
 * until React has re-rendered at the real width (LayoutProvider removes the class), with a
 * fallback timer in case scripts fail.
 */
const revealScript = `(function(){try{var w=document.documentElement.clientWidth||window.innerWidth;if(w>=720){var d=document.documentElement;d.classList.add('glz-wait');setTimeout(function(){d.classList.remove('glz-wait')},4000)}}catch(e){}})();`;

const baseCss = `
html,body{background-color:#F6F1EA;}
body{color:#2A211C;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;overflow-x:hidden;}
#root{transition:opacity .35s ease;}
html.glz-wait #root{opacity:0;}
`;

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: site.fullName,
  telephone: '+91-73378-76023',
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.street,
    addressLocality: site.city,
    addressRegion: site.region,
    postalCode: site.postalCode,
    addressCountry: 'IN',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '09:00',
      closes: '20:30',
    },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '10:00', closes: '20:30' },
  ],
  priceRange: '₹₹',
  sameAs: [site.instagramUrl],
};

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#F6F1EA" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={site.fullName} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: baseCss }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
