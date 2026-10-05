import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useReducedMotion, type CSSAnimationKeyframes } from 'react-native-reanimated';

import { Button } from '@/components/buttons';
import { Gradient } from '@/components/gradient';
import { Bottle } from '@/components/home/bottles';
import { Container, Section } from '@/components/layout';
import { Tilt } from '@/components/tilt';
import { Em, Eyebrow, Label, Sans, Serif } from '@/components/typography';
import { whatsappUrl } from '@/constants/site';
import { colors, webTransition } from '@/constants/theme';
import { inr } from '@/data/services';
import { routineMessage, routineTotal, shop, type Product, type Routine } from '@/data/shop';
import { useLayout } from '@/hooks/use-layout';

const SOFT = '#BDAE9F';
const TAB_IDLE = '#E9DFD2';
const TOTAL = '#E6BE7E';
const NICHE = '#2B221D';

/** Gentle 10px float, staggered per product. */
const BOB: CSSAnimationKeyframes = {
  from: { transform: [{ translateY: 0 }] },
  '50%': { transform: [{ translateY: -10 }] },
  to: { transform: [{ translateY: 0 }] },
};

/** Web-only CSS scroll snapping for the horizontal rows below 1024px; items snap inside the page gutter. */
const snapRow = (gutter: number) =>
  Platform.OS === 'web' ? ({ scrollSnapType: 'x mandatory', scrollPaddingInline: gutter } as ViewStyle) : null;
const snapItem = Platform.OS === 'web' ? ({ scrollSnapAlign: 'start' } as ViewStyle) : null;

function RoutineTabs({ active, onChange, narrow }: { active: number; onChange: (i: number) => void; narrow: boolean }) {
  const { gutter } = useLayout();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[narrow ? { marginHorizontal: -gutter } : styles.tabsFit, narrow && snapRow(gutter)]}
      contentContainerStyle={narrow ? { paddingHorizontal: gutter } : null}>
      <View role="group" aria-label="Choose a routine" style={styles.track}>
        {shop.routines.map((r, i) => {
          const on = i === active;
          return (
            <Pressable
              key={r.label}
              role="button"
              aria-pressed={on}
              onPress={() => onChange(i)}
              style={[styles.tab, { backgroundColor: on ? colors.gold : 'transparent' }, snapItem, webTransition('background-color', 500)]}>
              <Sans size={12} lh={1.2} weight="medium" tracking={0.18} upper color={on ? colors.night : TAB_IDLE} numberOfLines={1}>
                {r.label}
              </Sans>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function RoutinePanel({ routine, wide }: { routine: Routine; wide: boolean }) {
  const { isMobile } = useLayout();
  return (
    <View aria-live="polite" style={[styles.panel, wide ? { width: 340 } : { maxWidth: 560 }]}>
      <Serif size={34} lh={1.15} color={colors.cream} heading={3}>
        {routine.title}
      </Serif>
      <Sans size={15} lh={1.65} color={SOFT}>
        {routine.description}
      </Sans>
      <View style={{ gap: 10 }}>
        <Label color={SOFT}>Pairs with</Label>
        <View style={styles.chips}>
          {routine.pairsWith.map((name) => (
            <View key={name} style={styles.chip}>
              <Sans size={13} lh={1} color={colors.sand}>
                {name}
              </Sans>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.totalRow}>
        <Sans size={11} tracking={0.24} upper color={SOFT}>
          Full routine
        </Sans>
        <Serif size={38} lh={1} weight="regular" color={TOTAL}>
          {routineTotal(routine)}
        </Serif>
      </View>
      <View style={[styles.order, wide && { marginTop: 'auto' }]}>
        <Button label="Order on WhatsApp" href={whatsappUrl(routineMessage(routine))} variant="light" full={isMobile} />
        <Sans size={13} color={SOFT}>
          or pick it up at the front desk
        </Sans>
      </View>
    </View>
  );
}

function ShelfItem({ product, tint, index, compact }: { product: Product; tint: string; index: number; compact: boolean }) {
  const reduceMotion = useReducedMotion();
  const width = compact ? 220 : 254;
  const height = compact ? 300 : 340;
  const radius = width / 2;
  return (
    <View style={[{ width, gap: 16 }, snapItem]}>
      <Tilt height={height} glare="rgba(255,236,200,0.2)" radius={`${radius}px ${radius}px 4px 4px`}>
        <View
          style={[
            styles.niche,
            { borderTopLeftRadius: radius, borderTopRightRadius: radius },
          ]}>
          <Gradient kind="radial" cx="50%" cy="40%" rx="70%" ry="55%" stops={[[0, 'rgba(255,222,170,0.16)'], [0.7, 'rgba(255,222,170,0)']]} />
          <View style={[styles.floorShadow, { bottom: compact ? 30 : 34 }]}>
            <Gradient kind="radial" cx="50%" cy="50%" rx="50%" ry="50%" stops={[[0, 'rgba(0,0,0,0.55)'], [1, 'rgba(0,0,0,0)']]} />
          </View>
          <Animated.View
            style={[
              { marginBottom: compact ? 34 : 40 },
              reduceMotion
                ? null
                : {
                    animationName: BOB,
                    animationDuration: '5.5s',
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDelay: `${-index * 1.3}s`,
                  },
            ]}>
            <Bottle shape={product.shape} tint={tint} scale={height / 340} />
          </Animated.View>
        </View>
      </Tilt>
      <View style={{ gap: 6 }}>
        <Sans size={11} tracking={0.22} upper color={colors.gold}>
          {shop.brand}
        </Sans>
        <Serif size={25} lh={1.15} weight="regular" color={colors.cream}>
          {product.range}
        </Serif>
        <View style={styles.productRow}>
          <Sans size={14} color={SOFT}>
            {product.type}
          </Sans>
          <Sans size={14} color={colors.cream}>
            {inr(product.price)}
          </Sans>
        </View>
      </View>
    </View>
  );
}

function Shelf({ routine, narrow, routineIndex }: { routine: Routine; narrow: boolean; routineIndex: number }) {
  const { gutter } = useLayout();
  const items = routine.products.map((p, i) => (
    <ShelfItem key={`${routineIndex}-${i}`} product={p} tint={routine.tint} index={i} compact={narrow} />
  ));
  if (narrow) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[{ marginHorizontal: -gutter }, snapRow(gutter)]}
        contentContainerStyle={{ paddingHorizontal: gutter, gap: 20 }}>
        {items}
      </ScrollView>
    );
  }
  return <View style={styles.shelf}>{items}</View>;
}

/** "Take the salon home": take-home product routines, ordered on WhatsApp. */
export function Shop() {
  const { isMobile, width, content } = useLayout();
  const [active, setActive] = useState(0);
  const routine = shop.routines[active];
  // Panel (340) + gap (56) + three 254px niches with 28px gaps.
  const wide = content >= 1214;
  const narrow = width < 1024;

  return (
    <Section id="shop" bg={colors.espresso}>
      <Container style={{ paddingVertical: isMobile ? 72 : 104, gap: 40 }}>
        <View style={{ maxWidth: 660, gap: 18 }}>
          <Eyebrow color={colors.gold} size={isMobile ? 11 : 12}>
            Shop
          </Eyebrow>
          <Serif size={isMobile ? 40 : 56} lh={1.06} color={colors.cream} heading={2}>
            Take the salon <Em>home.</Em>
          </Serif>
          <Sans size={16} lh={1.7} color={SOFT}>
            The professional ranges on our shelf, matched to the service you came in for — so your colour,
            smoothness and shine keep going between visits.
          </Sans>
        </View>

        <RoutineTabs active={active} onChange={setActive} narrow={narrow} />

        <View style={wide ? styles.bodyWide : styles.bodyStacked}>
          <RoutinePanel routine={routine} wide={wide} />
          <Shelf routine={routine} narrow={narrow} routineIndex={active} />
        </View>

        <Sans size={13} lh={1.6} color={colors.faint}>
          {shop.alsoOnShelf}
        </Sans>
      </Container>
    </Section>
  );
}

const styles = StyleSheet.create({
  tabsFit: { alignSelf: 'flex-start', maxWidth: '100%' },
  track: {
    flexDirection: 'row',
    gap: 6,
    padding: 5,
    borderWidth: 1,
    borderColor: 'rgba(246,241,234,0.2)',
    borderRadius: 999,
  },
  tab: { height: 44, paddingHorizontal: 18, borderRadius: 999, justifyContent: 'center' },
  bodyWide: { flexDirection: 'row', gap: 56, alignItems: 'stretch' },
  bodyStacked: { gap: 40 },
  panel: { gap: 22 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(196,145,77,0.45)',
    borderRadius: 999,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(246,241,234,0.14)',
  },
  order: { gap: 10 },
  shelf: { flex: 1, minWidth: 0, flexDirection: 'row', justifyContent: 'center', gap: 28 },
  niche: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: NICHE,
    borderWidth: 1,
    borderColor: 'rgba(196,145,77,0.28)',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  floorShadow: { position: 'absolute', left: '50%', width: 160, height: 20, marginLeft: -80 },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(246,241,234,0.12)',
  },
});
