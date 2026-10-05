import { router, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { cubicBezier } from 'react-native-reanimated';

import { AmbientGold } from '@/components/ambient-gold';
import { Button, type PressState } from '@/components/buttons';
import { Image } from '@/components/image';
import { Container, Grid, Section } from '@/components/layout';
import { Enter, Reveal } from '@/components/motion';
import { Page } from '@/components/page';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Em, Eyebrow, Sans, Serif } from '@/components/typography';
import { photos } from '@/constants/images';
import { colors, webTransition } from '@/constants/theme';
import {
  genderFromParam,
  genderLabels,
  genderParam,
  inr,
  menu,
  totalServices,
  type Category,
  type Gender,
} from '@/data/services';
import { useLayout } from '@/hooks/use-layout';

const GENDERS = ['Female', 'Male'] as const;
const SLIDE = cubicBezier(0.2, 0.7, 0.2, 1);
const RAIL_STEP = 46; // rail item height (44) + gap (2)

/** For her / For him, with the dark pill sliding to the chosen side. */
function GenderTabs({ gender, onChange }: { gender: Gender; onChange: (g: Gender) => void }) {
  const [tabs, setTabs] = useState<{ x: number; width: number }[]>([]);
  const index = GENDERS.indexOf(gender);
  const measured = tabs.length === GENDERS.length;
  const slot = tabs[index];
  return (
    <View role="group" aria-label="Menu for" style={styles.tabs}>
      {measured && slot ? (
        <Animated.View
          style={[
            styles.tabIndicator,
            { left: slot.x, width: slot.width, transitionProperty: ['left', 'width'], transitionDuration: 450, transitionTimingFunction: SLIDE },
          ]}
        />
      ) : null}
      {GENDERS.map((g, i) => {
        const on = g === gender;
        return (
          <Pressable
            key={g}
            role="button"
            aria-pressed={on}
            onPress={() => onChange(g)}
            onLayout={(e) => {
              const { x, width } = e.nativeEvent.layout;
              setTabs((prev) => {
                const next = [...prev];
                next[i] = { x, width };
                return next;
              });
            }}
            // Until the tabs are measured, the chosen tab paints its own background.
            style={[styles.tab, { backgroundColor: on && !measured ? colors.ink : 'transparent' }]}>
            <Sans size={12} weight="medium" tracking={0.22} upper color={on ? colors.cream : colors.ink} style={webTransition('color', 300) as object}>
              {genderLabels[g]}
            </Sans>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Category list with a cream marker that slides to the chosen category. */
function CategoryRail({ cats, current, onChange }: { cats: Category[]; current: string; onChange: (c: string) => void }) {
  const index = Math.max(0, cats.findIndex((c) => c.name === current));
  return (
    <View role="navigation" aria-label="Categories" style={{ gap: 2 }}>
      <Animated.View
        style={[styles.railMarker, { top: index * RAIL_STEP, transitionProperty: 'top', transitionDuration: 450, transitionTimingFunction: SLIDE }]}
      />
      {cats.map((c) => {
        const on = c.name === current;
        return (
          <Pressable
            key={c.name}
            role="button"
            aria-pressed={on}
            onPress={() => onChange(c.name)}
            style={(s) => [
              styles.rail,
              { backgroundColor: !on && (s as PressState).hovered ? 'rgba(246,241,234,0.45)' : 'transparent' },
              webTransition('background-color', 200),
            ]}>
            <Sans size={15} weight={on ? 'medium' : 'regular'}>
              {c.name}
            </Sans>
            <Sans size={12} color={colors.muted}>
              {c.items.length}
            </Sans>
          </Pressable>
        );
      })}
    </View>
  );
}

function CategoryChips({ cats, current, onChange }: { cats: Category[]; current: string; onChange: (c: string) => void }) {
  const { gutter } = useLayout();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -gutter }}
      contentContainerStyle={{ paddingHorizontal: gutter, gap: 8 }}>
      {cats.map((c) => {
        const on = c.name === current;
        return (
          <Pressable
            key={c.name}
            role="button"
            aria-pressed={on}
            onPress={() => onChange(c.name)}
            style={[
              styles.chip,
              { backgroundColor: on ? colors.ink : colors.cream, borderColor: on ? colors.ink : colors.lineMid },
              webTransition('background-color, border-color', 300),
            ]}>
            <Sans size={14} color={on ? colors.cream : colors.ink} numberOfLines={1} style={webTransition('color', 300) as object}>
              {c.name}
            </Sans>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function PriceList({ category }: { category: Category }) {
  const { isDesktop, isMobile } = useLayout();
  const columns = isDesktop ? 2 : 1;
  return (
    <View style={[styles.panel, { padding: isMobile ? 24 : isDesktop ? 48 : 36, paddingHorizontal: isMobile ? 20 : isDesktop ? 56 : 36 }]}>
      <Enter variant="left" style={[styles.panelHead, isMobile && { flexDirection: 'column', alignItems: 'flex-start', gap: 8 }]}>
        <Serif size={isMobile ? 36 : 52} lh={1} heading={2}>
          {category.name}
        </Serif>
        <Sans size={13} tracking={0.08} color={colors.muted}>
          {category.min === category.max ? inr(category.min) : `${inr(category.min)} – ${inr(category.max)}`}
        </Sans>
      </Enter>
      {/* Rows cascade in, and their dotted leaders draw across, each time the category changes. */}
      <Grid columns={columns} gap={48} rowGap={0}>
        {category.items.map((item, i) => {
          const delay = 80 + Math.min(i, 14) * 45;
          return (
            <Enter key={item.name} delay={delay} style={styles.item}>
              <Serif size={isMobile ? 19 : 21} lh={1.2} weight="regular" style={{ flexShrink: 1 }}>
                {item.name}
              </Serif>
              <Enter variant="draw" delay={delay + 150} style={styles.leader} />
              <Sans size={15} lh={1.4} tracking={0.02} numberOfLines={1}>
                {inr(item.price)}
              </Sans>
            </Enter>
          );
        })}
      </Grid>
    </View>
  );
}

export default function Services() {
  const { isMobile, isDesktop, hydrated } = useLayout();
  const params = useLocalSearchParams<{ for?: string; cat?: string }>();

  // The URL (?for=her&cat=Facials) is the source of truth, so menu links are shareable. It is read
  // only after hydration so the pre-rendered HTML (the default tab) always matches the first render.
  const gender: Gender = (hydrated && genderFromParam(params.for)) || 'Female';
  const cats = menu[gender];
  const current = (hydrated && cats.find((c) => c.name === params.cat)) || cats[0];
  const genderCount = cats.reduce((n, c) => n + c.items.length, 0);

  const chooseGender = (g: Gender) => router.setParams({ for: genderParam[g], cat: undefined });
  const chooseCat = (c: string) => router.setParams({ for: genderParam[gender], cat: c });

  const imgW = isDesktop ? 360 : 280;

  return (
    <Page>
      <Head>
        <title>Services & prices · Glozia Unisex Salon, Nagarbhavi</title>
        <meta
          name="description"
          content={`The full Glozia menu — ${totalServices} hair, skin, nail, spa and bridal services for men and women, with clear prices in ₹.`}
        />
      </Head>
      <SiteHeader active="services" />

      <Section style={styles.hero}>
        {/* Floating pearls and gold rings (three.js) drifting behind the heading. */}
        <AmbientGold layout="right" />
        <Container style={[styles.intro, isMobile && styles.introStacked, { minHeight: isDesktop ? 520 : undefined }]}>
          <View style={{ flex: isMobile ? undefined : 1, gap: 24, paddingBottom: isMobile ? 0 : 88, paddingTop: isMobile ? 48 : 64 }}>
            <Enter>
              <Eyebrow size={isMobile ? 11 : 12}>Services & prices</Eyebrow>
            </Enter>
            <Enter delay={120}>
              <Serif size={isMobile ? 72 : isDesktop ? 128 : 96} lh={0.95} heading={1} style={{ letterSpacing: -1.5 }}>
                The <Em>menu.</Em>
              </Serif>
            </Enter>
            <Enter delay={240}>
              <Sans size={16} lh={1.7} color={colors.body} style={{ maxWidth: 520 }}>
                Every service we offer, for her and for him — {totalServices} in all. Prices can vary with hair
                length and texture; your stylist will always confirm before starting.
              </Sans>
            </Enter>
            <Enter delay={340}>
              <Sans size={13} color={colors.muted}>
                Prices in ₹, before GST.
              </Sans>
            </Enter>
          </View>
          {!isMobile ? (
            <Enter variant="arch" delay={200}>
              <View {...({ dataSet: { float: '' } } as object)}>
                <Image
                  source={photos.menuHero}
                  alt="A smiling stylist blow-drying a client's hair in a bright salon"
                  contentFit="cover"
                  style={{ width: imgW, height: imgW * 1.2, borderTopLeftRadius: imgW / 2, borderTopRightRadius: imgW / 2 }}
                />
              </View>
            </Enter>
          ) : null}
        </Container>
      </Section>

      <Section id="menu" bg={colors.sand}>
        <Container
          style={{ paddingTop: isMobile ? 40 : 88, paddingBottom: isMobile ? 56 : 96, gap: isMobile ? 24 : 48, minHeight: isDesktop ? 1296 : undefined }}>
          <Reveal style={[styles.menuTop, isMobile && { flexDirection: 'column', alignItems: 'flex-start', gap: 12 }]}>
            <GenderTabs gender={gender} onChange={chooseGender} />
            <Enter key={gender} variant="fade">
              <Sans size={14} color={colors.muted}>
                {genderCount} services · {cats.length} categories
              </Sans>
            </Enter>
          </Reveal>
          {isMobile ? (
            <View style={{ gap: 20 }}>
              <CategoryChips cats={cats} current={current.name} onChange={chooseCat} />
              <PriceList key={`${gender}-${current.name}`} category={current} />
            </View>
          ) : (
            // The price panel stretches to the rail (and section) height, as on the board.
            <Reveal style={{ flex: 1, flexDirection: 'row', gap: isDesktop ? 72 : 32, alignItems: 'stretch' }}>
              <View style={{ width: isDesktop ? 300 : 220 }}>
                <CategoryRail cats={cats} current={current.name} onChange={chooseCat} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <PriceList key={`${gender}-${current.name}`} category={current} />
              </View>
            </Reveal>
          )}
        </Container>
      </Section>

      <Section id="bridal" bg={colors.espresso}>
        <Container
          style={[
            styles.bridal,
            isMobile ? { flexDirection: 'column', alignItems: 'flex-start', paddingTop: 64, gap: 40 } : { minHeight: 440 },
          ]}>
          <Reveal style={{ flex: isMobile ? undefined : 1, minWidth: 0, gap: 20, alignSelf: 'center', paddingVertical: isMobile ? 0 : 56 }}>
            <Eyebrow color={colors.gold} size={isMobile ? 11 : 12}>
              Bridal & occasion
            </Eyebrow>
            <Serif size={isMobile ? 38 : 56} lh={1.05} color={colors.cream} heading={2}>
              For the days that <Em>matter most.</Em>
            </Serif>
            <Sans size={16} lh={1.7} color={colors.onDarkMuted} style={{ maxWidth: 560 }}>
              Bridal hair and make-up from ₹10,000, the O3 bridal facial at ₹3,999, and saree draping for the
              whole family. We’ll plan the day with you in a consultation.
            </Sans>
            <Button label="Book a consultation" href="/book" variant="light" style={{ marginTop: 8 }} />
          </Reveal>
          <Reveal variant="arch" delay={150} style={{ alignSelf: 'flex-end' }}>
            <Image
              source={photos.bridal}
              alt="Close-up of a bride's make-up being finished"
              contentFit="cover"
              style={{
                width: isMobile ? 280 : 360,
                height: isMobile ? 280 : 360,
                borderTopLeftRadius: isMobile ? 140 : 180,
                borderTopRightRadius: isMobile ? 140 : 180,
              }}
            />
          </Reveal>
        </Container>
      </Section>

      <SiteFooter />
    </Page>
  );
}

const styles = StyleSheet.create({
  hero: { position: 'relative', overflow: 'hidden' },
  intro: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 64 },
  introStacked: { flexDirection: 'column', alignItems: 'flex-start', gap: 0, paddingBottom: 48 },
  menuTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 32 },
  tabs: { flexDirection: 'row', gap: 8, padding: 6, backgroundColor: colors.cream, borderRadius: 999, alignSelf: 'flex-start' },
  tab: { height: 48, paddingHorizontal: 28, borderRadius: 999, justifyContent: 'center' },
  tabIndicator: { position: 'absolute', top: 6, height: 48, borderRadius: 999, backgroundColor: colors.ink },
  railMarker: { position: 'absolute', left: 0, right: 0, height: 44, borderRadius: 2, backgroundColor: colors.cream },
  rail: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  chip: { height: 40, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, justifyContent: 'center' },
  panel: { flexGrow: 1, backgroundColor: colors.cream, borderRadius: 2, gap: 32 },
  panelHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(42,33,28,0.14)',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(42,33,28,0.08)',
  },
  leader: {
    flex: 1,
    minWidth: 16,
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderBottomColor: 'rgba(42,33,28,0.35)',
  },
  bridal: { flexDirection: 'row', alignItems: 'flex-end', gap: 96 },
});
