import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { Button, MaybeLink, RoundButton, TextLink } from '@/components/buttons';
import { CoverFlowStage } from '@/components/home/cover-flow';
import { COUNT, pad2, wrap } from '@/components/home/cover-flow-math';
import { Image } from '@/components/image';
import { Container, Section } from '@/components/layout';
import { Reveal } from '@/components/motion';
import { Eyebrow, Sans, Serif } from '@/components/typography';
import { servicesHref, showcase } from '@/constants/content';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

function SectionHeader() {
  const { isMobile, isDesktop } = useLayout();
  return (
    <View style={[styles.header, isMobile && styles.headerStacked]}>
      <View style={{ gap: isMobile ? 16 : 20, flexShrink: 1 }}>
        <Eyebrow size={isMobile ? 11 : 12}>Services</Eyebrow>
        <Serif size={isMobile ? 40 : isDesktop ? 60 : 48} lh={1.05} heading={2}>
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
        <Reveal key={item.name}>
          <MaybeLink href={servicesHref(item.link)}>
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
        </Reveal>
      ))}
    </View>
  );
}

function CoverFlow() {
  const { isDesktop } = useLayout();
  const reduceMotion = useReducedMotion();
  const unit = isDesktop ? 1 : 0.85;
  const [pos, setPos] = useState(0);
  const [drag, setDrag] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);

  // Gently cycle through the cards until the visitor takes over.
  useEffect(() => {
    if (touched || reduceMotion || drag != null) return;
    const id = setInterval(() => setPos((p) => p + 1), 5200);
    return () => clearInterval(id);
  }, [touched, reduceMotion, drag]);

  const go = (target: number) => {
    setTouched(true);
    setDrag(null);
    setPos(Math.round(target));
  };

  const front = wrap(Math.round(drag ?? pos));
  const active = showcase[front];

  return (
    <View style={{ gap: 40 }}>
      <CoverFlowStage
        pos={pos}
        drag={drag}
        onDrag={(p) => {
          setTouched(true);
          setDrag(p);
        }}
        onSettle={go}
        onPick={go}
        unit={unit}
        reduceMotion={reduceMotion}
      />

      <View style={[styles.controls, !isDesktop && styles.controlsStacked]}>
        {/* Equal side columns keep the arrows centred, as in the design's 1fr / auto / 1fr grid. */}
        <View style={isDesktop ? { flex: 1, minWidth: 0 } : null}>
          <Sans size={15} lh={1.6} color={colors.muted} aria-live="polite" style={{ maxWidth: 420 }}>
            <Sans size={15} weight="medium">
              {active.name}
            </Sans>{' '}
            — {active.desc}
          </Sans>
        </View>
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
      <Container
        style={{ paddingTop: isMobile ? 72 : 120, paddingBottom: isMobile ? 72 : 96, gap: isMobile ? 36 : 40, minHeight: isDesktop ? 1160 : undefined }}>
        <Reveal>
          <SectionHeader />
        </Reveal>
        <Reveal variant="fade" delay={150}>
          {isMobile ? <ServiceList /> : <CoverFlow key={isDesktop ? 'd' : 't'} />}
        </Reveal>
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
  controls: { flexDirection: 'row', alignItems: 'center', gap: 32 },
  controlsStacked: { flexDirection: 'column', alignItems: 'flex-start', gap: 20 },
  arrows: { flexDirection: 'row', alignItems: 'center', gap: 20 },
});
