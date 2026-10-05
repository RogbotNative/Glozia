import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

export type MotionVariant = 'up' | 'fade' | 'scale' | 'left' | 'right' | 'arch' | 'pop' | 'draw';

type MotionProps = {
  children?: ReactNode;
  variant?: MotionVariant;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

function entering(variant: MotionVariant, delay: number) {
  if (variant === 'fade' || variant === 'draw') return FadeIn.duration(700).delay(delay);
  if (variant === 'scale' || variant === 'pop') return ZoomIn.duration(500).delay(delay);
  return FadeInDown.duration(700).delay(delay);
}

/** Native: Reanimated entering animations (they follow the system reduce-motion setting). */
export function Enter({ children, variant = 'up', delay = 0, style }: MotionProps) {
  return (
    <Animated.View entering={entering(variant, delay)} style={style}>
      {children}
    </Animated.View>
  );
}

/** Native has no scroll-reveal; content simply enters when first rendered. */
export const Reveal = Enter;

export function RevealObserver() {
  return null;
}
