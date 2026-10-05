import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type TextStyle } from 'react-native';

import type { GloziaScene } from '../../../3d/src/scene';

import { Button, TextLink } from '@/components/buttons';
import { StaticHero } from '@/components/home/static-hero';
import { Hand } from '@/components/icons';
import { Image } from '@/components/image';
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
const LINE = 'rgba(42,33,28,0.2)';

/** Desktop hero: the gold crown rendered with three.js in day lighting. */
function CrownHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<GloziaScene | null>(null);
  const [ready, setReady] = useState(false);
  const { gutter } = useLayout();

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

  return (
    <View nativeID="top" style={styles.hero}>
      <div aria-hidden style={{ ...fill, background: 'radial-gradient(70% 80% at 70% 46%, #FBF7F0 0%, #F2E9DD 62%, #EADFD0 100%)' }} />
      {/* Static crown shown until the 3D scene has drawn its first frame (or if WebGL is unavailable). */}
      <View style={[styles.fallback, { opacity: ready ? 0 : 1 }, webTransition('opacity', 800)]}>
        <Image source={brand.crownGold} style={{ width: 640, height: 310 }} contentFit="contain" alt="" />
      </View>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="An interactive 3D gold Glozia crown floating among pearls and gold rings"
        style={{ ...fill, width: '100%', height: '100%', display: 'block' }}
      />

      <SiteHeader overlay />

      <View style={styles.overlay}>
        <Container style={styles.inner}>
          <View style={styles.copy}>
            <Sans size={12} lh={1.4} weight="medium" tracking={0.26} upper color={colors.bronze}>
              Unisex salon & ladies spa · Nagarbhavi, Bengaluru
            </Sans>
            <Serif size={96} lh={0.96} heading={1} style={styles.title}>
              The quiet art of <Em color={colors.bronze}>looking like</Em> yourself.
            </Serif>
            <Sans size={18} lh={1.65} weight="light" color={colors.body} style={{ maxWidth: 470 }}>
              Premium haircuts, colour, skin and spa care for men and women — with warm service and real
              attention to detail, on Mallathahalli Lake Road.
            </Sans>
            <View style={styles.ctas}>
              <Button label="Book an appointment" href="/book" arrow />
              <TextLink label="Services & prices" href="/services" lineColor={LINE} />
            </View>
          </View>

          <View style={[styles.bottom, { left: gutter, right: gutter }]}>
            <View style={styles.hint}>
              <Hand color={colors.body} />
              <Sans size={13} tracking={0.04} color={colors.body}>
                Drag the crown to turn it · tap it to make it shine
              </Sans>
            </View>
            <View style={styles.hours}>
              <Sans size={13} tracking={0.04} color={colors.body}>
                Open every day · 9:00 am – 8:30 pm (Fridays from 10:00 am)
              </Sans>
              <span aria-hidden style={{ position: 'relative', width: 1, height: 44, background: LINE, overflow: 'hidden' }}>
                <span className="glz-drop" style={{ background: colors.bronze }} />
              </span>
            </View>
          </View>
        </Container>
      </View>
    </View>
  );
}

const fill = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as const;

const styles = StyleSheet.create({
  hero: { height: HERO_HEIGHT, position: 'relative', overflow: 'hidden' },
  fallback: { position: 'absolute', left: '68%', top: '50%', marginLeft: -320, marginTop: -155, pointerEvents: 'none' },
  // Pointer events pass through to the canvas except on the links and buttons.
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'box-none' },
  inner: { flex: 1 },
  copy: { marginTop: 206, maxWidth: 640, gap: 28, pointerEvents: 'box-none' },
  // Balanced over three lines, as in the design ("The quiet / art of looking / like yourself.").
  title: { letterSpacing: -1.44, textWrap: 'balance' } as TextStyle,
  ctas: { flexDirection: 'row', alignItems: 'center', gap: 36, marginTop: 6 },
  bottom: {
    position: 'absolute',
    bottom: 36,
    pointerEvents: 'none',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 32,
  },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hours: { flexDirection: 'row', alignItems: 'center', gap: 16 },
});
