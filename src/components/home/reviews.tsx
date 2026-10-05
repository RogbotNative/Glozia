import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { cubicBezier, useReducedMotion } from 'react-native-reanimated';

import { RoundButton, TextLink } from '@/components/buttons';
import { Container, Section } from '@/components/layout';
import { Eyebrow, Label, Sans, Serif } from '@/components/typography';
import { reviews } from '@/constants/content';
import { site } from '@/constants/site';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

const EASE = cubicBezier(0.3, 0.7, 0.2, 1);

/** Stack positions: front, middle, back. Depth is projected into a scale. */
const STACK = [
  { x: 0, y: 0, scale: 1, rotate: '0deg', opacity: 1, bg: colors.white },
  { x: 34, y: 30, scale: 1400 / 1490, rotate: '2.4deg', opacity: 0.92, bg: '#F3ECE2' },
  { x: 68, y: 60, scale: 1400 / 1580, rotate: '4.8deg', opacity: 0.78, bg: colors.sand },
];

export function Reviews() {
  const { isMobile, isDesktop } = useLayout();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = reviews.length;
  const front = ((index % count) + count) % count;
  const shift = isMobile ? 0.5 : 1;
  const cardHeight = isMobile ? 330 : 360;

  return (
    <Section>
      <Container
        style={[
          { paddingVertical: isMobile ? 72 : 120, gap: isMobile ? 36 : 64 },
          isDesktop && { flexDirection: 'row', alignItems: 'center', gap: 96 },
        ]}>
        <View style={{ width: isDesktop ? 440 : undefined, gap: isMobile ? 20 : 28 }}>
          <Eyebrow size={isMobile ? 11 : 12}>Kind words</Eyebrow>
          <View style={styles.score}>
            <Serif size={isMobile ? 72 : 132} lh={0.9} heading={2} accessibilityLabel={`Rated ${site.rating} on Google`}>
              {site.rating}
            </Serif>
            <Sans size={isMobile ? 14 : 15} lh={1.5} color={colors.muted}>
              on Google,{'\n'}from {site.reviewCount} reviews
            </Sans>
          </View>
          <View style={styles.controls}>
            <RoundButton direction="left" label="Previous review" onPress={() => setIndex((i) => i + count - 1)} />
            <Sans size={13} tracking={0.16}>
              {`0${front + 1} / 0${count}`}
            </Sans>
            <RoundButton direction="right" label="Next review" onPress={() => setIndex((i) => i + 1)} />
          </View>
          {isDesktop ? <TextLink label="Read all reviews" href={site.mapsUrl} /> : null}
        </View>

        <View style={{ flex: isDesktop ? 1 : undefined, minWidth: 0, height: cardHeight + 80 }}>
          {reviews.map((r, i) => {
            const slot = (i - front + count) % count;
            const p = STACK[slot];
            return (
              <Animated.View
                key={r.name}
                aria-hidden={slot !== 0}
                style={[
                  styles.card,
                  {
                    height: cardHeight,
                    right: isMobile ? 34 : 68,
                    maxWidth: 640,
                    padding: isMobile ? 28 : 48,
                    paddingHorizontal: isMobile ? 28 : 52,
                    zIndex: count - slot,
                    opacity: p.opacity,
                    backgroundColor: p.bg,
                    transform: [
                      { translateX: p.x * shift },
                      { translateY: p.y * shift },
                      { scale: p.scale },
                      { rotate: p.rotate },
                    ],
                    transitionProperty: ['transform', 'opacity', 'backgroundColor'],
                    transitionDuration: reduceMotion ? 0 : 800,
                    transitionTimingFunction: EASE,
                  },
                ]}>
                <Serif aria-hidden size={96} lh={0.5} weight="regular" color={colors.gold} style={{ height: 40 }}>
                  “
                </Serif>
                <Serif size={isMobile ? 24 : 34} lh={1.3} italic>
                  {r.quote}
                </Serif>
                <Label>{r.name} · Google</Label>
              </Animated.View>
            );
          })}
        </View>
        {!isDesktop ? <TextLink label="Read all reviews" href={site.mapsUrl} /> : null}
      </Container>
    </Section>
  );
}

const styles = StyleSheet.create({
  score: { flexDirection: 'row', alignItems: 'flex-end', gap: 20 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: 'space-between',
    boxShadow: '0 40px 70px -40px rgba(42,33,28,0.45)',
  },
});
