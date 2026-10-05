import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Serif } from '@/components/typography';
import { marqueeWords } from '@/constants/content';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

const SPEED = 40; // px per second

function Row({ size, onWidth }: { size: number; onWidth?: (w: number) => void }) {
  return (
    <View style={styles.row} onLayout={onWidth ? (e) => onWidth(e.nativeEvent.layout.width) : undefined}>
      {marqueeWords.map((word) => (
        <View key={word} style={styles.item}>
          <Serif size={size} lh={1.2} italic color={colors.cream} numberOfLines={1}>
            {word}
          </Serif>
          <View style={styles.diamond} />
        </View>
      ))}
    </View>
  );
}

export function Marquee() {
  const { isMobile } = useLayout();
  const reduceMotion = useReducedMotion();
  const x = useSharedValue(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!width || reduceMotion) return;
    x.set(0);
    x.set(withRepeat(withTiming(-width, { duration: (width / SPEED) * 1000, easing: Easing.linear }), -1, false));
    return () => cancelAnimation(x);
  }, [width, reduceMotion, x]);

  const animated = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));
  const size = isMobile ? 22 : 26;

  return (
    <View aria-hidden style={[styles.strip, { height: isMobile ? 60 : 72 }]}>
      <Animated.View style={[styles.track, animated]}>
        <Row size={size} onWidth={setWidth} />
        <Row size={size} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { backgroundColor: colors.espresso, overflow: 'hidden', justifyContent: 'center' },
  track: { flexDirection: 'row', alignSelf: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', paddingLeft: 44, gap: 44 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 44 },
  diamond: { width: 7, height: 7, backgroundColor: colors.gold, transform: [{ rotate: '45deg' }] },
});
