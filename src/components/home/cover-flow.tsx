import { useRef } from 'react';
import { Pressable, StyleSheet, View, type GestureResponderEvent } from 'react-native';
import Animated, { cubicBezier } from 'react-native-reanimated';

import { flow, pad2, relative, type StageProps } from '@/components/home/cover-flow-math';
import { Image } from '@/components/image';
import { Sans, Serif } from '@/components/typography';
import { showcase } from '@/constants/content';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

const EASE = cubicBezier(0.22, 0.7, 0.2, 1);

/**
 * Native cover-flow stage. React Native has no translateZ or parent perspective, so depth is
 * projected into a scale. The web version (cover-flow.web.tsx) uses real CSS 3D.
 */
export function CoverFlowStage({ pos, drag, onDrag, onSettle, onPick, unit, reduceMotion }: StageProps) {
  const { gutter } = useLayout();
  const gesture = useRef({ x: 0, y: 0, start: 0, endedAt: 0 });
  const cardW = 320 * unit;
  const imgH = 430 * unit;
  const current = drag ?? pos;

  // Horizontal drag via the responder system; vertical movement is left to page scrolling.
  const dragTo = (pageX: number) => gesture.current.start - (pageX - gesture.current.x) / (260 * unit);
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
      gesture.current.start = pos;
    },
    onResponderMove: (e: GestureResponderEvent) => onDrag(dragTo(e.nativeEvent.pageX)),
    onResponderRelease: (e: GestureResponderEvent) => {
      gesture.current.endedAt = Date.now();
      onSettle(Math.round(dragTo(e.nativeEvent.pageX)));
    },
    onResponderTerminate: () => onSettle(Math.round(current)),
  };

  return (
    <View {...responder} style={[styles.stage, { height: imgH + 190, marginHorizontal: -gutter }]}>
      {showcase.map((item, i) => {
        const p = flow(i, current);
        const k = 1600 / (1600 - p.z * unit);
        return (
          <Animated.View
            key={item.name}
            style={[
              styles.card,
              {
                width: cardW,
                marginLeft: -cardW / 2,
                transform: [{ perspective: 1600 }, { translateX: p.x * unit * k }, { scale: k }, { rotateY: `${p.rotate}deg` }],
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
                if (Math.abs(r) > 0.01) onPick(pos + r);
              }}
              style={{ gap: 18 }}>
              <Image
                source={item.img}
                alt={item.alt}
                contentFit="cover"
                style={{
                  width: cardW,
                  height: imgH,
                  borderTopLeftRadius: cardW / 2,
                  borderTopRightRadius: cardW / 2,
                  borderBottomLeftRadius: 2,
                  borderBottomRightRadius: 2,
                }}
              />
              <View style={{ gap: 12, opacity: p.front ? 1 : 0 }}>
                <View style={styles.cardTitle}>
                  <Serif size={34 * Math.max(unit, 0.9)} lh={1.1} weight="regular">
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
  );
}

const styles = StyleSheet.create({
  stage: { position: 'relative', overflow: 'hidden' },
  card: { position: 'absolute', left: '50%', top: 18 },
  cardTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  cardPrice: { paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(42,33,28,0.16)' },
});
