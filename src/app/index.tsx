import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { useEffect } from 'react';

import { Approach } from '@/components/home/approach';
import { Gallery } from '@/components/home/gallery';
import { HomeHero } from '@/components/home/hero';
import { Marquee } from '@/components/home/marquee';
import { Reviews } from '@/components/home/reviews';
import { ServicesShowcase } from '@/components/home/services-showcase';
import { Shop } from '@/components/home/shop';
import { Team } from '@/components/home/team';
import { Visit } from '@/components/home/visit';
import { BOOK_BAR_HEIGHT, MobileBookBar } from '@/components/mobile-book-bar';
import { Page, usePageScroll } from '@/components/page';
import { SiteFooter } from '@/components/site-footer';
import { useLayout } from '@/hooks/use-layout';

/** Handles /?s=team style links from other pages. */
function ScrollToSection() {
  const { s } = useLocalSearchParams<{ s?: string }>();
  const { hydrated } = useLayout();
  const { scrollTo } = usePageScroll();
  useEffect(() => {
    if (!hydrated || !s) return;
    const id = setTimeout(() => scrollTo(s), 250);
    return () => clearTimeout(id);
  }, [hydrated, s, scrollTo]);
  return null;
}

export default function Home() {
  const { isMobile } = useLayout();
  return (
    <Page floating={isMobile ? <MobileBookBar /> : null}>
      <Head>
        <title>Glozia Unisex Salon & Ladies Spa · Nagarbhavi, Bengaluru</title>
        <meta
          name="description"
          content="Premium haircuts, colour, skin and spa care for men and women on Mallathahalli Lake Road, Nagarbhavi. Rated 4.8 on Google. Open every day — book online."
        />
        <meta property="og:title" content="Glozia Unisex Salon & Ladies Spa" />
        <meta property="og:description" content="The quiet art of looking like yourself. Hair, skin, nails and a ladies spa in Nagarbhavi, Bengaluru." />
      </Head>
      <ScrollToSection />
      <HomeHero />
      <Marquee />
      <Approach />
      <ServicesShowcase />
      <Shop />
      <Team />
      <Gallery />
      <Reviews />
      <Visit />
      <SiteFooter bottomInset={isMobile ? BOOK_BAR_HEIGHT : 0} />
    </Page>
  );
}
