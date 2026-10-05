import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type TextStyle } from 'react-native';

import type { GloziaScene, SceneMode } from '../../../3d/src/scene';

import { Button, TextLink } from '@/components/buttons';
import { StaticHero } from '@/components/home/static-hero';
import { Hand, Moon, Sun } from '@/components/icons';
import { Container } from '@/components/layout';
import { SiteHeader } from '@/components/site-header';
import { Em, Sans, Serif } from '@/components/typography';
import { brand } from '@/constants/images';
import { colors, webTransition } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

export function HomeHero() {
  const { isDesktop } = useLayout();
  if (isDesktop) return <CrownHero />;
  return (
    <>
      <SiteHeader />
      <StaticHero />
    </>
  );
}

const HERO_HEIGHT = 920;

const MODE = {
  day: { ink: colors.ink, muted: colors.body, acc: colors.bronze, line: 'rgba(42,33,28,0.2)', button: 'dark' as const },
  dusk: { ink: colors.cream, muted: colors.duskMuted, acc: colors.goldSoft, line: 'rgba(246,241,234,0.26)', button: 'gold' as const },
};

const fade = (ms = 800) => webTransition('color, border-color, background-color', ms) as TextStyle;

/** Desktop hero: the gold crown rendered with three.js, with a Day / Dusk lighting switch. */
function CrownHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<GloziaScene | null>(null);
  const [mode, setMode] = useState<SceneMode>('day');
  const [ready, setReady] = useState(false);
  const { gutter } = useLayout();
  const m = MODE[mode];

  useEffect(() => {
    let disposed = false;
    // three.js is loaded on demand so phones and the first paint don't pay for it.
    import('../../../3d/src/scene')
      .then(({ mount }) => {
        if (disposed || !canvasRef.current) return;
        sceneRef.current = mount(canvasRef.current, {
          mode: 'day',
          onReady: () => {
            if (!disposed) setReady(true);
          },
        });
      })
      .catch((err) => console.error('[Glozia] 3D scene could not start', err));
    return () => {
      disposed = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  const choose = (next: SceneMode) => {
    setMode(next);
    sceneRef.current?.setMode(next);
  };

  return (
    <View nativeID="top" style={styles.hero}>
      <div aria-hidden style={{ ...fill, background: 'radial-gradient(70% 80% at 70% 46%, #FBF7F0 0%, #F2E9DD 62%, #EADFD0 100%)' }} />
      <div
        aria-hidden
        style={{
          ...fill,
          background: 'radial-gradient(58% 72% at 69% 47%, #45301F 0%, #241A15 52%, #140F0C 100%)',
          opacity: mode === 'dusk' ? 1 : 0,
          transition: 'opacity 1.1s ease',
        }}
      />
      {/* Static crown shown until the 3D scene has drawn its first frame (or if WebGL is unavailable). */}
      <View style={[styles.fallback, { opacity: ready ? 0 : 1 }, webTransition('opacity', 800)]} pointerEvents="none">
        <Image source={brand.crownGold} style={{ width: 640, height: 310 }} contentFit="contain" alt="" />
      </View>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="An interactive 3D gold Glozia crown floating among pearls and gold rings"
        style={{ ...fill, width: '100%', height: '100%', display: 'block' }}
      />

      <SiteHeader tone={mode} overlay />

      <View style={styles.overlay} pointerEvents="box-none">
        <Container style={styles.inner}>
          <View style={styles.copy} pointerEvents="box-none">
            <Sans size={12} lh={1.4} weight="medium" tracking={0.26} upper color={m.acc} style={fade()}>
              Unisex salon & ladies spa · Nagarbhavi, Bengaluru
            </Sans>
            <Serif size={96} lh={0.96} heading={1} color={m.ink} style={[{ letterSpacing: -1.4 }, fade()]}>
              The quiet art of{' '}
              <Em color={m.acc} style={fade()}>
                looking like
              </Em>{' '}
              yourself.
            </Serif>
            <Sans size={18} lh={1.65} weight="light" color={m.muted} style={[{ maxWidth: 470 }, fade()]}>
              Premium haircuts, colour, skin and spa care for men and women — with warm service and real
              attention to detail, on Mallathahalli Lake Road.
            </Sans>
            <View style={styles.ctas}>
              <Button label="Book an appointment" href="/book" variant={m.button} arrow />
              <TextLink label="Services & prices" href="/services" color={m.ink} hoverColor={m.acc} lineColor={m.line} />
            </View>
          </View>

          <View style={[styles.bottom, { left: gutter, right: gutter }]} pointerEvents="box-none">
            <View style={styles.group} role="group" aria-label="Lighting">
              <Sans size={11} tracking={0.24} upper color={m.muted} style={fade()}>
                Light
              </Sans>
              <View style={[styles.segments, { borderColor: m.line }, fade()]}>
                <Segment label="Day" active={mode === 'day'} onPress={() => choose('day')} mode={mode} icon="sun" />
                <Segment label="Dusk" active={mode === 'dusk'} onPress={() => choose('dusk')} mode={mode} icon="moon" />
              </View>
            </View>
            <View style={styles.hint} pointerEvents="none">
              <Hand color={m.muted} />
              <Sans size={13} tracking={0.04} color={m.muted} style={fade()}>
                Drag the crown to turn it · tap it to make it shine
              </Sans>
            </View>
            <View style={styles.hours} pointerEvents="none">
              <Sans size={13} tracking={0.04} color={m.muted} style={fade()}>
                Open every day · 9:00 am – 8:30 pm
              </Sans>
              <span aria-hidden style={{ position: 'relative', width: 1, height: 44, background: m.line, overflow: 'hidden' }}>
                <span className="glz-drop" style={{ background: m.acc }} />
              </span>
            </View>
          </View>
        </Container>
      </View>
    </View>
  );
}

function Segment({
  label,
  active,
  onPress,
  mode,
  icon,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  mode: SceneMode;
  icon: 'sun' | 'moon';
}) {
  const bg = active ? (mode === 'dusk' ? colors.gold : colors.ink) : 'transparent';
  const fg = active ? (mode === 'dusk' ? colors.night : colors.cream) : mode === 'dusk' ? colors.duskMuted : colors.body;
  return (
    <Pressable
      onPress={onPress}
      role="button"
      aria-pressed={active}
      style={[styles.segment, { backgroundColor: bg }, webTransition('background-color', 500)]}>
      {icon === 'sun' ? <Sun color={fg} /> : <Moon color={fg} />}
      <Sans size={12} weight="medium" tracking={0.18} upper color={fg} style={webTransition('color', 500) as TextStyle}>
        {label}
      </Sans>
    </Pressable>
  );
}

const fill = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as const;

const styles = StyleSheet.create({
  hero: { height: HERO_HEIGHT, position: 'relative', overflow: 'hidden' },
  fallback: { position: 'absolute', left: '68%', top: '50%', marginLeft: -320, marginTop: -155 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  inner: { flex: 1 },
  copy: { marginTop: 206, maxWidth: 640, gap: 28 },
  ctas: { flexDirection: 'row', alignItems: 'center', gap: 36, marginTop: 6 },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 32,
  },
  group: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  segments: { flexDirection: 'row', gap: 4, padding: 4, borderRadius: 999, borderWidth: 1 },
  segment: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingHorizontal: 18, borderRadius: 999 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hours: { flexDirection: 'row', alignItems: 'center', gap: 16 },
});
