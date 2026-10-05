import { useEffect, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useLayout } from '@/hooks/use-layout';

/**
 * Motion on the web is plain CSS (see global.css), keyed off data attributes:
 * - <Enter> plays once when it appears (page load, or when remounted with a new key). It needs no
 *   JavaScript, so pre-rendered content animates on first paint.
 * - <Reveal> rises in when scrolled into view. RevealObserver only hides elements that start below
 *   the fold, after hydration, so nothing is ever invisible without JavaScript.
 * Both are disabled under prefers-reduced-motion.
 */
export type MotionVariant = 'up' | 'fade' | 'scale' | 'left' | 'right' | 'arch' | 'pop' | 'draw';

type MotionProps = {
  children?: ReactNode;
  variant?: MotionVariant;
  /** Delay in ms. */
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export function Enter({ children, variant = 'up', delay = 0, style }: MotionProps) {
  return (
    <View {...({ dataSet: { enter: variant } } as object)} style={[style, delay ? ({ animationDelay: `${delay}ms` } as ViewStyle) : null]}>
      {children}
    </View>
  );
}

export function Reveal({ children, variant = 'up', delay = 0, style }: MotionProps) {
  return (
    <View {...({ dataSet: { reveal: variant } } as object)} style={[style, delay ? ({ transitionDelay: `${delay}ms` } as ViewStyle) : null]}>
      {children}
    </View>
  );
}

/** One observer for every <Reveal> on the page, including ones added by later renders. */
export function RevealObserver() {
  const { hydrated } = useLayout();

  useEffect(() => {
    if (!hydrated || !('IntersectionObserver' in window)) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.removeAttribute('data-reveal-wait');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    const seen = new WeakSet<Element>();
    let frame = 0;
    const scan = () => {
      frame = 0;
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        const r = el.getBoundingClientRect();
        // Already on screen: leave it visible rather than hiding and re-showing it.
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) return;
        el.setAttribute('data-reveal-wait', '');
        io.observe(el);
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(scan);
    };
    scan();
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [hydrated]);

  return null;
}
