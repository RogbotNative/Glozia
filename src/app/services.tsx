import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button, type PressState } from '@/components/buttons';
import { Container, Grid, Section } from '@/components/layout';
import { Page } from '@/components/page';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Em, Eyebrow, Sans, Serif } from '@/components/typography';
import { photos } from '@/constants/images';
import { colors, webTransition } from '@/constants/theme';
import {
  formatDuration,
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

function GenderTabs({ gender, onChange }: { gender: Gender; onChange: (g: Gender) => void }) {
  return (
    <View role="group" aria-label="Menu for" style={styles.tabs}>
      {(['Female', 'Male'] as const).map((g) => {
        const on = g === gender;
        return (
          <Pressable
            key={g}
            role="button"
            aria-pressed={on}
            onPress={() => onChange(g)}
            style={[styles.tab, { backgroundColor: on ? colors.ink : 'transparent' }, webTransition('background-color', 200)]}>
            <Sans size={12} weight="medium" tracking={0.22} upper color={on ? colors.cream : colors.ink}>
              {genderLabels[g]}
            </Sans>
          </Pressable>
        );
      })}
    </View>
  );
}

function CategoryRail({ cats, current, onChange }: { cats: Category[]; current: string; onChange: (c: string) => void }) {
  return (
    <View role="navigation" aria-label="Categories" style={{ gap: 2 }}>
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
              { backgroundColor: on ? colors.cream : (s as PressState).hovered ? 'rgba(246,241,234,0.55)' : 'transparent' },
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
            style={[styles.chip, { backgroundColor: on ? colors.ink : colors.cream, borderColor: on ? colors.ink : colors.lineMid }]}>
            <Sans size={14} color={on ? colors.cream : colors.ink} numberOfLines={1}>
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
      <View style={[styles.panelHead, isMobile && { flexDirection: 'column', alignItems: 'flex-start', gap: 8 }]}>
        <Serif size={isMobile ? 36 : 52} lh={1} heading={2}>
          {category.name}
        </Serif>
        <Sans size={13} tracking={0.08} color={colors.muted}>
          {category.min === category.max ? inr(category.min) : `${inr(category.min)} – ${inr(category.max)}`}
        </Sans>
      </View>
      <Grid columns={columns} gap={48} rowGap={0}>
        {category.items.map((item) => (
          <View key={item.name} style={styles.item}>
            <View style={{ flexShrink: 1, gap: 2 }}>
              <Serif size={isMobile ? 19 : 21} lh={1.2} weight="regular">
                {item.name}
              </Serif>
              <Sans size={12} lh={1.4} color={colors.muted}>
                {formatDuration(item.durationMin)}
              </Sans>
            </View>
            <View aria-hidden style={styles.leader} />
            <Sans size={15} tracking={0.02} style={{ alignSelf: 'flex-start', marginTop: 2 }}>
              {inr(item.price)}
            </Sans>
          </View>
        ))}
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

      <Section>
        <Container style={[styles.intro, isMobile && styles.introStacked, { minHeight: isDesktop ? 520 : undefined }]}>
          <View style={{ flex: isMobile ? undefined : 1, gap: 24, paddingBottom: isMobile ? 0 : 88, paddingTop: isMobile ? 48 : 64 }}>
            <Eyebrow size={isMobile ? 11 : 12}>Services & prices</Eyebrow>
            <Serif size={isMobile ? 72 : isDesktop ? 128 : 96} lh={0.95} heading={1} style={{ letterSpacing: -1.5 }}>
              The <Em>menu.</Em>
            </Serif>
            <Sans size={16} lh={1.7} color={colors.body} style={{ maxWidth: 520 }}>
              Every service we offer, for her and for him — {totalServices} in all. Prices can vary with hair
              length and texture; your stylist will always confirm before starting.
            </Sans>
            <Sans size={13} color={colors.muted}>
              Prices in ₹, before GST.
            </Sans>
          </View>
          {!isMobile ? (
            <Image
              source={photos.menuHero}
              alt="A smiling stylist blow-drying a client's hair in a bright salon"
              contentFit="cover"
              style={{ width: imgW, height: imgW * 1.2, borderTopLeftRadius: imgW / 2, borderTopRightRadius: imgW / 2 }}
            />
          ) : null}
        </Container>
      </Section>

      <Section id="menu" bg={colors.sand}>
        <Container style={{ paddingTop: isMobile ? 40 : 88, paddingBottom: isMobile ? 56 : 96, gap: isMobile ? 24 : 48 }}>
          <View style={[styles.menuTop, isMobile && { flexDirection: 'column', alignItems: 'flex-start', gap: 12 }]}>
            <GenderTabs gender={gender} onChange={chooseGender} />
            <Sans size={14} color={colors.muted}>
              {genderCount} services · {cats.length} categories
            </Sans>
          </View>
          {isMobile ? (
            <View style={{ gap: 20 }}>
              <CategoryChips cats={cats} current={current.name} onChange={chooseCat} />
              <PriceList category={current} />
            </View>
          ) : (
            <View style={{ flexDirection: 'row', gap: isDesktop ? 72 : 32, alignItems: 'flex-start' }}>
              <View style={{ width: isDesktop ? 300 : 220 }}>
                <CategoryRail cats={cats} current={current.name} onChange={chooseCat} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <PriceList category={current} />
              </View>
            </View>
          )}
        </Container>
      </Section>

      <Section id="bridal" bg={colors.espresso}>
        <Container
          style={[
            styles.bridal,
            isMobile ? { flexDirection: 'column', alignItems: 'flex-start', paddingTop: 64, gap: 40 } : { minHeight: 440 },
          ]}>
          <View style={{ flex: isMobile ? undefined : 1, minWidth: 0, gap: 20, alignSelf: 'center', paddingVertical: isMobile ? 0 : 56 }}>
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
          </View>
          <Image
            source={photos.bridal}
            alt="Close-up of a bride's make-up being finished"
            contentFit="cover"
            style={{
              width: isMobile ? 280 : 360,
              height: isMobile ? 280 : 360,
              borderTopLeftRadius: isMobile ? 140 : 180,
              borderTopRightRadius: isMobile ? 140 : 180,
              alignSelf: 'flex-end',
            }}
          />
        </Container>
      </Section>

      <SiteFooter />
    </Page>
  );
}

const styles = StyleSheet.create({
  intro: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 64 },
  introStacked: { flexDirection: 'column', alignItems: 'flex-start', gap: 0, paddingBottom: 48 },
  menuTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 32 },
  tabs: { flexDirection: 'row', gap: 8, padding: 6, backgroundColor: colors.cream, borderRadius: 999, alignSelf: 'flex-start' },
  tab: { height: 48, paddingHorizontal: 28, borderRadius: 999, justifyContent: 'center' },
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
  panel: { backgroundColor: colors.cream, borderRadius: 2, gap: 32 },
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
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(42,33,28,0.08)',
  },
  leader: {
    flex: 1,
    minWidth: 16,
    marginTop: 18,
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderBottomColor: 'rgba(42,33,28,0.35)',
  },
  bridal: { flexDirection: 'row', alignItems: 'flex-end', gap: 96 },
});
