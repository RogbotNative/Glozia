import { useEffect } from 'react';
import { StyleSheet, View, type TextStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Image } from '@/components/image';
import { Container, Section } from '@/components/layout';
import { Reveal } from '@/components/motion';
import { Em, Eyebrow, Serif } from '@/components/typography';
import { brand } from '@/constants/images';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

/** The crown turning like a coin inside a slowly rotating dashed ring. */
export function CrownCoin({ size }: { size: number }) {
  const reduceMotion = useReducedMotion();
  const spin = useSharedValue(0);
  const ring = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    spin.set(withRepeat(withTiming(360, { duration: 9000, easing: Easing.linear }), -1, false));
    ring.set(withRepeat(withTiming(360, { duration: 40000, easing: Easing.linear }), -1, false));
    return () => {
      cancelAnimation(spin);
      cancelAnimation(ring);
    };
  }, [reduceMotion, spin, ring]);

  const coin = useAnimatedStyle(() => ({ transform: [{ perspective: 900 }, { rotateY: `${spin.get()}deg` }] }));
  const dashed = useAnimatedStyle(() => ({ transform: [{ rotate: `${ring.get()}deg` }] }));
  const inset = size * 0.07;

  return (
    <View aria-hidden style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={[StyleSheet.absoluteFill, styles.circle, { borderRadius: size / 2 }]} />
      <Animated.View
        style={[
          styles.dashed,
          { top: inset, left: inset, right: inset, bottom: inset, borderRadius: size / 2 },
          dashed,
        ]}
      />
      <Animated.View style={coin}>
        <Image source={brand.crownGold} style={{ width: size * 0.72, height: size * 0.35 }} contentFit="contain" alt="" />
      </Animated.View>
    </View>
  );
}

export function Approach() {
  const { isMobile, isDesktop } = useLayout();
  return (
    <Section id="studio" bg={colors.sand}>
      <Container
        style={[
          styles.inner,
          isMobile ? { paddingVertical: 72, flexDirection: 'column', alignItems: 'flex-start', gap: 24 } : { minHeight: isDesktop ? 560 : 440 },
        ]}>
        <Reveal style={{ flex: isMobile ? undefined : 1, maxWidth: 840, gap: isMobile ? 24 : 28 }}>
          <View style={styles.eyebrowRow}>
            <Eyebrow size={isMobile ? 11 : 12}>Our approach</Eyebrow>
            <Reveal variant="draw" delay={300} style={[styles.rule, { width: isMobile ? 40 : 56 }]} />
          </View>
          <Serif size={isMobile ? 28 : isDesktop ? 46 : 36} lh={isMobile ? 1.28 : 1.22} style={{ textWrap: 'pretty' } as TextStyle}>
            Good work starts with listening. Every visit begins with a conversation about your hair, your
            skin and your routine — so you leave with something that suits the way you <Em>actually</Em> live.
          </Serif>
        </Reveal>
        {!isMobile ? (
          <Reveal variant="scale" delay={200}>
            <CrownCoin size={isDesktop ? 320 : 220} />
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}

const styles = StyleSheet.create({
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 96 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  rule: { height: 1, backgroundColor: colors.bronze },
  circle: { borderWidth: 1, borderColor: 'rgba(138,97,40,0.35)' },
  dashed: { position: 'absolute', borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(138,97,40,0.45)' },
});
