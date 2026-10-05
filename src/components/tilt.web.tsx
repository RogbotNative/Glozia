import { useRef, type PointerEvent } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

import type { TiltProps } from './tilt';

/**
 * Card that leans toward a mouse pointer with a soft glare that follows it (as in the design's
 * tilt/untilt). Off for touch and pen input, and when the visitor prefers reduced motion.
 */
export function Tilt({ height, glare, radius, children }: TiltProps) {
  const card = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = card.current;
    if (!el || reduceMotion || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transform = `rotateX(${((0.5 - y) * 12).toFixed(2)}deg) rotateY(${((x - 0.5) * 16).toFixed(2)}deg)`;
    el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    if (card.current) card.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div style={{ height, perspective: 900 }} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div ref={card} style={{ position: 'relative', height, display: 'flex', transition: 'transform .35s ease-out' }}>
        {children}
        {glare ? (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: radius,
              pointerEvents: 'none',
              background: `radial-gradient(circle at var(--gx, 50%) var(--gy, 0%), ${glare}, transparent 46%)`,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export type { TiltProps };
