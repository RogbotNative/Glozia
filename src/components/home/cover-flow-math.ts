import { showcase } from '@/constants/content';

export const COUNT = showcase.length;

export const pad2 = (n: number) => String(n).padStart(2, '0');
export const wrap = (n: number) => ((n % COUNT) + COUNT) % COUNT;

/** Position of card i relative to the front card, in the range [-3, 3). */
export function relative(i: number, pos: number) {
  return ((((i - pos) % COUNT) + COUNT * 1.5) % COUNT) - COUNT / 2;
}

/** Cover-flow placement from the design board, in design pixels (multiply by `unit` to scale). */
export function flow(i: number, pos: number) {
  const r = relative(i, pos);
  const a = Math.abs(r);
  const sign = r < 0 ? -1 : 1;
  return {
    x: r * 290 - sign * Math.max(0, a - 1) * 50,
    z: -a * 240,
    rotate: -sign * (Math.min(a, 1) * 36 + Math.max(0, a - 1) * 10),
    opacity: a <= 1 ? 1 : a <= 2 ? 1 - (a - 1) * 0.12 : a < 2.5 ? (0.88 * (2.5 - a)) / 0.5 : 0,
    zIndex: Math.round(100 - a * 10),
    front: a < 0.5,
  };
}

export type StageProps = {
  /** Settled position (card index, may grow past COUNT). */
  pos: number;
  /** Live position while dragging, or null. */
  drag: number | null;
  onDrag: (pos: number | null) => void;
  /** Drag released: snap to this position. */
  onSettle: (pos: number) => void;
  /** A side card was pressed: bring it to the front. */
  onPick: (pos: number) => void;
  /** Card scale (1 at desktop). */
  unit: number;
  reduceMotion: boolean;
};
