import { useEffect, useRef, useState } from 'react';

import type { AmbientScene } from '../../3d/src/web';

import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

type Props = {
  /** 'right' leaves the left side for text; 'center' keeps to the gap between a heading and a side card. */
  layout?: 'right' | 'center';
  /** Page colour behind the layer, for depth fog. */
  fog?: string;
};

/** Seeded positions so the server and client render the same dust. [left %, top %, size px, delay s, duration s] */
const DUST: [number, number, number, number, number][] = [
  [6, 72, 4, 0, 9], [14, 30, 3, 2.4, 11], [22, 84, 5, 4.1, 10], [31, 18, 3, 1.2, 12], [43, 64, 4, 6.3, 9],
  [52, 26, 3, 3.3, 13], [61, 80, 5, 0.8, 10], [69, 40, 3, 5.2, 11], [77, 12, 4, 2.9, 12], [84, 58, 3, 7.1, 9],
  [91, 34, 5, 1.7, 10], [96, 76, 3, 4.6, 13], [38, 46, 3, 8.2, 11], [73, 90, 4, 3.8, 12],
];

/** Light CSS gold dust for phones, where the three.js layer isn't worth the download. */
function GoldDust() {
  return (
    <div aria-hidden className="glz-dust-field">
      {DUST.map(([left, top, size, delay, duration], i) => (
        <span
          key={i}
          className="glz-dust"
          style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `-${delay}s`, animationDuration: `${duration}s` }}
        />
      ))}
    </div>
  );
}

/**
 * Floating pearls, gold rings and gold dust in three.js (3d/src/ambient.js), behind a page heading.
 * Place inside a relatively positioned parent; it fills it and never takes pointer events.
 */
export function AmbientGold({ layout = 'right', fog = colors.cream }: Props) {
  const { width, hydrated } = useLayout();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const enabled = hydrated && width >= 720;

  useEffect(() => {
    if (!enabled) return;
    let disposed = false;
    let scene: AmbientScene | null = null;
    import('../../3d/src/web')
      .then(({ mountAmbient }) => {
        if (disposed || !canvasRef.current) return;
        scene = mountAmbient(canvasRef.current, {
          layout,
          fog,
          onReady: () => {
            if (!disposed) setReady(true);
          },
        });
      })
      .catch((err) => console.error('[Glozia] ambient scene could not start', err));
    return () => {
      disposed = true;
      scene?.dispose();
    };
  }, [enabled, layout, fog]);

  if (!enabled) return <GoldDust />;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        opacity: ready ? 1 : 0,
        transition: 'opacity 1.4s ease',
      }}
    />
  );
}
