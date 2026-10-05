import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View, type GestureResponderEvent } from 'react-native';
import Animated, { cubicBezier, useReducedMotion } from 'react-native-reanimated';

import { Button, MaybeLink, RoundButton, TextLink } from '@/components/buttons';
import { Container, Section } from '@/components/layout';
import { Eyebrow, Sans, Serif } from '@/components/typography';
import { servicesHref, showcase } from '@/constants/content';
import { colors, webTransition } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

const COUNT = showcase.length;
const EASE = cubicBezier(0.22, 0.7, 0.2, 1);

const pad2 = (n: number) => String(n).padStart(2, '0');
const wrap = (n: number) => ((n % COUNT) + COUNT) % COUNT;

/** Position of card i relative to the front card, in the range [-3, 3). */
function relative(i: number, pos: number) {
  return ((((i - pos) % COUNT) + COUNT * 1.5) % COUNT) - COUNT / 2;
}

/** Cover-flow placement. translateZ isn't available on native, so depth is projected into a scale. */
function placement(i: number, pos: number, unit: number) {
  const r = relative(i, pos);
  const a = Math.abs(r);
  const sign = r < 0 ? -1 : 1;
  const x = (r * 290 - sign * Math.max(0, a - 1) * 50) * unit;
  const z = -a * 240 * unit;
  const k = 1600 / (1600 - z);
  const rotate = -sign * (Math.min(a, 1) * 36 + Math.max(0, a - 1) * 10);
  const opacity = a <= 1 ? 1 : a <= 2 ? 1 - (a - 1) * 0.12 : a < 2.5 ? (0.88 * (2.5 - a)) / 0.5 : 0;
  return {
    transform: [{ perspective: 1600 }, { translateX: x * k }, { scale: k }, { rotateY: `${rotate}deg` }],
    opacity,
    zIndex: Math.round(100 - a * 10),
    front: a < 0.5,
  };
}

function SectionHeader() {
  const { isMobile, isDesktop } = useLayout();
  return (
    <View style={[styles.header, isMobile && styles.headerStacked]}>
      <View style={{ gap: isMobile ? 16 : 20, flexShrink: 1 }}>
        <Eyebrow size={isMobile ? 11 : 12}>Services</Eyebrow>
        <Serif size={isMobile ? 40 : isDesktop ? 60 : 48} lh={1.06} heading={2}>
          Considered care, head to toe.
        </Serif>
      </View>
      <View style={{ maxWidth: 360, gap: 22 }}>
        <Sans size={15} lh={1.7} color={colors.muted}>
          {isMobile
            ? 'From a quick tidy-up to a full transformation — every service is priced clearly before you sit down.'
            : 'Drag the cards, use the arrows or pick one. Every price comes straight from the salon’s own menu.'}
        </Sans>
        {!isMobile ? <TextLink label="Full menu & prices" href="/services" /> : null}
      </View>
    </View>
  );
}

function ServiceList() {
  return (
    <View>
      {showcase.map((item, i) => (
        <MaybeLink key={item.name} href={servicesHref(item.link)}>
          <Pressable role="link" style={[styles.listRow, i === COUNT - 1 && styles.listLast]}>
            <Image
              source={item.img}
              alt=""
              contentFit="cover"
              style={{ width: 104, height: 132, borderTopLeftRadius: 52, borderTopRightRadius: 52, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }}
            />
            <View style={{ flex: 1, gap: 6, justifyContent: 'center' }}>
              <Serif size={28} weight="regular" heading={3}>
                {item.name}
              </Serif>
              <Sans size={14} lh={1.55} color={colors.muted}>
                {item.desc.charAt(0).toUpperCase() + item.desc.slice(1)}
              </Sans>
              <Sans size={12} tracking={0.08} style={{ marginTop: 4 }}>
                {item.price}
              </Sans>
            </View>
          </Pressable>
        </MaybeLink>
      ))}
    </View>
  );
}

function CoverFlow() {
  const { isDesktop, gutter } = useLayout();
  const reduceMotion = useReducedMotion();
  const unit = isDesktop ? 1 : 0.85;
  const cardW = 320 * unit;
  const imgH = 430 * unit;

  const [pos, setPos] = useState(0);
  const [drag, setDrag] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const gesture = useRef({ x: 0, y: 0, pos: 0, endedAt: 0 });

  // Gently cycle through the cards until the visitor takes over.
  useEffect(() => {
    if (touched || reduceMotion) return;
    const id = setInterval(() => setPos((p) => p + 1), 5200);
    return () => clearInterval(id);
  }, [touched, reduceMotion]);

  const go = (target: number) => {
    setTouched(true);
    setPos(Math.round(target));
  };

  // Horizontal drag via the responder system; vertical movement is left to page scrolling.
  const dragTo = (pageX: number) => gesture.current.pos - (pageX - gesture.current.x) / (260 * unit);
  const responder = {
    // Capture phase, so the start point is recorded even when the press lands on a card.
    onStartShouldSetResponderCapture: (e: GestureResponderEvent) => {
      gesture.current.x = e.nativeEvent.pageX;
      gesture.current.y = e.nativeEvent.pageY;
      return false;
    },
    onMoveShouldSetResponder: (e: GestureResponderEvent) => {
      const dx = Math.abs(e.nativeEvent.pageX - gesture.current.x);
      const dy = Math.abs(e.nativeEvent.pageY - gesture.current.y);
      return dx > 8 && dx > dy;
    },
    onResponderGrant: () => {
      gesture.current.pos = pos;
      setTouched(true);
    },
    onResponderMove: (e: GestureResponderEvent) => setDrag(dragTo(e.nativeEvent.pageX)),
    onResponderRelease: (e: GestureResponderEvent) => {
      gesture.current.endedAt = Date.now();
      setDrag(null);
      setPos(Math.round(dragTo(e.nativeEvent.pageX)));
    },
    onResponderTerminate: () => {
      setDrag(null);
      setPos((p) => Math.round(p));
    },
  };

  const current = drag ?? pos;
  const front = wrap(Math.round(current));
  const active = showcase[front];

  return (
    <View style={{ gap: 40 }}>
      <View
        {...responder}
        style={[
          styles.stage,
          { height: imgH + 190, marginHorizontal: -gutter },
          Platform.OS === 'web' ? ({ touchAction: 'pan-y', cursor: drag != null ? 'grabbing' : 'grab', userSelect: 'none' } as object) : null,
        ]}>
        {showcase.map((item, i) => {
          const p = placement(i, current, unit);
          return (
            <Animated.View
              key={item.name}
              style={[
                styles.card,
                {
                  width: cardW,
                  marginLeft: -cardW / 2,
                  transform: p.transform,
                  opacity: p.opacity,
                  zIndex: p.zIndex,
                  transitionProperty: ['transform', 'opacity'],
                  transitionDuration: drag != null || reduceMotion ? 0 : 1000,
                  transitionTimingFunction: EASE,
                },
              ]}>
              <Pressable
                role="button"
                accessibilityLabel={`${item.name} — ${item.price}`}
                onPress={() => {
                  if (Date.now() - gesture.current.endedAt < 300) return;
                  const r = relative(i, pos);
                  if (Math.abs(r) > 0.01) go(pos + r);
                }}
                style={{ gap: 18 }}>
                <View style={[styles.cardShadow, { borderTopLeftRadius: cardW / 2, borderTopRightRadius: cardW / 2 }]}>
                  <Image
                    source={item.img}
                    alt={item.alt}
                    contentFit="cover"
                    draggable={false}
                    style={{
                      width: cardW,
                      height: imgH,
                      borderTopLeftRadius: cardW / 2,
                      borderTopRightRadius: cardW / 2,
                      borderBottomLeftRadius: 2,
                      borderBottomRightRadius: 2,
                    }}
                  />
                </View>
                <View style={[{ gap: 12, opacity: p.front ? 1 : 0 }, webTransition('opacity', 500)]}>
                  <View style={styles.cardTitle}>
                    <Serif size={34 * Math.max(unit, 0.9)} lh={1.1}>
                      {item.name}
                    </Serif>
                    <Sans size={12} tracking={0.16} color={colors.bronze}>
                      {pad2(i + 1)}
                    </Sans>
                  </View>
                  <View style={styles.cardPrice}>
                    <Sans size={14} tracking={0.04} color={colors.body}>
                      {item.price}
                    </Sans>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      <View style={[styles.controls, !isDesktop && styles.controlsStacked]}>
        <Sans size={15} lh={1.6} color={colors.muted} aria-live="polite" style={{ flex: isDesktop ? 1 : undefined, maxWidth: 420 }}>
          <Sans size={15} weight="medium">
            {active.name}
          </Sans>{' '}
          — {active.desc}
        </Sans>
        <View style={styles.arrows}>
          <RoundButton direction="left" label="Previous service" onPress={() => go(pos - 1)} />
          <Sans size={13} tracking={0.16} align="center" style={{ minWidth: 64 }}>
            {pad2(front + 1)} / {pad2(COUNT)}
          </Sans>
          <RoundButton direction="right" label="Next service" onPress={() => go(pos + 1)} />
        </View>
        <View style={{ flex: isDesktop ? 1 : undefined, alignItems: isDesktop ? 'flex-end' : 'flex-start' }}>
          <Button label={`See ${active.name} prices`} href={servicesHref(active.link)} />
        </View>
      </View>
    </View>
  );
}

export function ServicesShowcase() {
  const { isMobile, isDesktop } = useLayout();
  return (
    <Section>
      <Container style={{ paddingTop: isMobile ? 72 : 120, paddingBottom: isMobile ? 72 : 96, gap: isMobile ? 36 : 40 }}>
        <SectionHeader />
        {isMobile ? <ServiceList /> : <CoverFlow key={isDesktop ? 'd' : 't'} />}
        {isMobile ? <TextLink label="Full menu & prices" href="/services" /> : null}
      </Container>
    </Section>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 64 },
  headerStacked: { flexDirection: 'column', alignItems: 'flex-start', gap: 16 },
  listRow: {
    flexDirection: 'row',
    gap: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(42,33,28,0.14)',
  },
  listLast: { borderBottomWidth: 1, borderBottomColor: 'rgba(42,33,28,0.14)' },
  stage: { position: 'relative', overflow: 'hidden' },
  card: { position: 'absolute', left: '50%', top: 18 },
  cardShadow: { boxShadow: '0 40px 60px -36px rgba(42,33,28,0.6)' },
  cardTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  cardPrice: { paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(42,33,28,0.16)' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 32 },
  controlsStacked: { flexDirection: 'column', alignItems: 'flex-start', gap: 20 },
  arrows: { flexDirection: 'row', alignItems: 'center', gap: 20 },
});
