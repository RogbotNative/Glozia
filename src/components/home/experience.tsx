import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { cubicBezier, useReducedMotion } from 'react-native-reanimated';

import { Button } from '@/components/buttons';
import { Flip } from '@/components/icons';
import { Container, Section } from '@/components/layout';
import { Em, Eyebrow, Sans, Serif } from '@/components/typography';
import { experienceSteps } from '@/constants/content';
import { brand } from '@/constants/images';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

const EASE = cubicBezier(0.3, 0.7, 0.2, 1);

function SampleBadge() {
  return (
    <View style={styles.badge}>
      <Sans size={10} lh={1.2} tracking={0.2} upper color={colors.bronze}>
        Sample
      </Sans>
    </View>
  );
}

function Row({ k, v, compact }: { k: string; v: string; compact: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Sans size={compact ? 13 : 14} lh={1.45} color={colors.muted} style={{ width: compact ? 70 : 84 }}>
        {k}
      </Sans>
      <Sans size={compact ? 13 : 14} lh={1.45} style={{ flex: 1 }}>
        {v}
      </Sans>
    </View>
  );
}

function BookingFace({ compact }: { compact: boolean }) {
  return (
    <>
      <View style={styles.faceTop}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={styles.avatar}>
            <Image source={brand.lockupGold} style={{ width: 26, height: 18 }} contentFit="contain" alt="" />
          </View>
          <View style={{ gap: 2 }}>
            <Sans size={14} lh={1.3} weight="medium">
              Glozia Unisex Salon
            </Sans>
            <Sans size={12} lh={1.3} color={colors.muted}>
              on WhatsApp · just now
            </Sans>
          </View>
        </View>
        <SampleBadge />
      </View>
      <View style={[styles.bubble, { padding: compact ? 18 : 22 }]}>
        <Serif size={compact ? 26 : 30} lh={1.1} weight="regular">
          Hi Ananya — you’re booked.
        </Serif>
        <View style={{ gap: 10 }}>
          <Row compact={compact} k="When" v="Sat, 11 Oct · 4:30 pm" />
          <Row compact={compact} k="Services" v="Advance haircut, Hydrating hair spa" />
          <Row compact={compact} k="Stylist" v="Sajan" />
          <Row compact={compact} k="Where" v="Mallathahalli Lake Road, Nagarbhavi" />
        </View>
        <Sans size={14} color={colors.body} style={{ marginTop: 'auto' }}>
          See you soon. — Team Glozia
        </Sans>
      </View>
      <View style={styles.faceFoot}>
        <Sans size={12} color={colors.muted}>
          Booking confirmation
        </Sans>
        <Sans size={12} tracking={0.16} color={colors.muted}>
          1 / 2
        </Sans>
      </View>
    </>
  );
}

function ReceiptLine({ label, value, muted, last }: { label: string; value: string; muted?: boolean; last?: boolean }) {
  return (
    <View style={[styles.receiptLine, !last && styles.receiptDivider]}>
      <Sans size={15} color={muted ? colors.muted : colors.ink}>
        {label}
      </Sans>
      <Sans size={15} color={muted ? colors.muted : colors.ink}>
        {value}
      </Sans>
    </View>
  );
}

function ReceiptFace() {
  return (
    <>
      <View style={[styles.faceTop, { alignItems: 'flex-start' }]}>
        <Image source={brand.lockupBronze} style={{ width: 58, height: 40 }} contentFit="contain" alt="Glozia" />
        <SampleBadge />
      </View>
      <View style={{ gap: 4 }}>
        <Serif size={34} lh={1} weight="regular">
          Receipt
        </Serif>
        <Sans size={12} tracking={0.06} color={colors.muted}>
          Sat, 11 Oct · paid by UPI
        </Sans>
      </View>
      <View style={styles.dashedTop}>
        <ReceiptLine label="Advance haircut" value="₹999" />
        <ReceiptLine label="Hydrating hair spa" value="₹1,200" />
        <ReceiptLine label="GST" value="as billed" muted last />
      </View>
      <View style={[styles.dashedTop, styles.subtotal]}>
        <Sans size={12} tracking={0.22} upper>
          Subtotal
        </Sans>
        <Serif size={34} weight="regular">
          ₹2,199
        </Serif>
      </View>
      <View style={styles.faceFoot}>
        <Sans size={12} color={colors.muted}>
          Sent to WhatsApp at checkout
        </Sans>
        <Sans size={12} tracking={0.16} color={colors.muted}>
          2 / 2
        </Sans>
      </View>
    </>
  );
}

function FlipCard() {
  const { isDesktop, content } = useLayout();
  const reduceMotion = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched || reduceMotion) return;
    const id = setInterval(() => setFlipped((f) => !f), 5200);
    return () => clearInterval(id);
  }, [touched, reduceMotion]);

  const width = isDesktop ? 420 : Math.min(420, content);
  const height = Math.round((width * 560) / 420);
  const compact = width < 400;
  const transition = {
    transitionProperty: 'transform' as const,
    transitionDuration: reduceMotion ? 0 : 1100,
    transitionTimingFunction: EASE,
  };

  return (
    <View style={{ alignItems: 'center', gap: 32 }}>
      <View style={{ width, height }}>
        <Animated.View
          aria-hidden={flipped}
          style={[
            styles.face,
            { backgroundColor: colors.cream, padding: compact ? 22 : 28 },
            { transform: [{ perspective: 1300 }, { rotateY: flipped ? '180deg' : '0deg' }], ...transition },
          ]}>
          <BookingFace compact={compact} />
        </Animated.View>
        <Animated.View
          aria-hidden={!flipped}
          style={[
            styles.face,
            { backgroundColor: '#FBF8F3', padding: compact ? 22 : 28, gap: 18 },
            { transform: [{ perspective: 1300 }, { rotateY: flipped ? '360deg' : '180deg' }], ...transition },
          ]}>
          <ReceiptFace />
        </Animated.View>
      </View>
      <Button
        variant="ghostLight"
        label={flipped ? 'Show the booking' : 'Show the receipt'}
        icon={(c) => <Flip color={c} />}
        onPress={() => {
          setTouched(true);
          setFlipped((f) => !f);
        }}
        style={{ alignSelf: 'center' }}
      />
    </View>
  );
}

export function Experience() {
  const { isMobile, isDesktop } = useLayout();
  return (
    <Section bg={colors.espresso}>
      <Container
        style={[
          { paddingVertical: isMobile ? 72 : 120, gap: isMobile ? 48 : 64 },
          isDesktop && { flexDirection: 'row', alignItems: 'center', gap: 96 },
        ]}>
        <View style={{ flex: isDesktop ? 1 : undefined, minWidth: 0, gap: 40 }}>
          <View style={{ gap: isMobile ? 16 : 20 }}>
            <Eyebrow color={colors.gold} size={isMobile ? 11 : 12}>
              The experience
            </Eyebrow>
            <Serif size={isMobile ? 38 : 56} lh={1.08} color={colors.cream} heading={2} style={{ maxWidth: 600 }}>
              From booking to bill, <Em>looked after.</Em>
            </Serif>
            <Sans size={isMobile ? 15 : 16} lh={1.7} color={colors.onDarkMuted} style={{ maxWidth: 520 }}>
              The details that usually get in the way are handled quietly in the background, so the time in
              the chair is all yours.
            </Sans>
          </View>
          <View>
            {experienceSteps.map(([title, body], i) => (
              <View key={title} style={[styles.step, i === experienceSteps.length - 1 && styles.stepLast, { gap: isMobile ? 18 : 28 }]}>
                <Serif size={isMobile ? 20 : 22} weight="regular" color={colors.gold} style={{ width: isMobile ? 26 : 32 }}>
                  {`0${i + 1}`}
                </Serif>
                <View style={{ flex: 1, gap: 6 }}>
                  <Serif size={isMobile ? 24 : 28} weight="regular" color={colors.cream} heading={3}>
                    {title}
                  </Serif>
                  <Sans size={isMobile ? 14 : 15} color={colors.onDarkMuted}>
                    {body}
                  </Sans>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={isDesktop ? { width: 520, alignItems: 'center' } : null}>
          <FlipCard />
        </View>
      </Container>
    </Section>
  );
}

const styles = StyleSheet.create({
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 22,
    gap: 20,
    backfaceVisibility: 'hidden',
    boxShadow: '0 50px 80px -40px rgba(0,0,0,0.8)',
  },
  faceTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.espresso,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    borderWidth: 1,
    borderColor: 'rgba(138,97,40,0.4)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  bubble: {
    flex: 1,
    gap: 14,
    backgroundColor: colors.white,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    boxShadow: '0 1px 0 rgba(42,33,28,0.08)',
  },
  faceFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dashedTop: { borderTopWidth: 1, borderStyle: 'dashed', borderTopColor: 'rgba(42,33,28,0.3)' },
  receiptLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14 },
  receiptDivider: { borderBottomWidth: 1, borderBottomColor: 'rgba(42,33,28,0.08)' },
  subtotal: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingTop: 16,
  },
  step: {
    flexDirection: 'row',
    paddingVertical: 22,
    borderTopWidth: 1,
    borderTopColor: colors.lineDark,
  },
  stepLast: { borderBottomWidth: 1, borderBottomColor: colors.lineDark },
});
