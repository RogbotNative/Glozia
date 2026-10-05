import { StaticHero } from '@/components/home/static-hero';
import { SiteHeader } from '@/components/site-header';

/** Native apps use the photo hero; the interactive 3D crown is web-only (see hero.web.tsx). */
export function HomeHero() {
  return (
    <>
      <SiteHeader />
      <StaticHero />
    </>
  );
}
