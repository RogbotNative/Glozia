import type { GradientProps } from './gradient';

const stopsCss = (stops: GradientProps['stops']) => stops.map(([offset, color]) => `${color} ${offset * 100}%`).join(', ');

/** Absolutely positioned CSS gradient layer (see gradient.tsx for the native version). */
export function Gradient(props: GradientProps) {
  const background =
    props.kind === 'linear'
      ? `linear-gradient(180deg, ${stopsCss(props.stops)})`
      : `radial-gradient(${props.rx} ${props.ry} at ${props.cx} ${props.cy}, ${stopsCss(props.stops)})`;
  return (
    <div
      aria-hidden
      style={{ position: 'absolute', inset: 0, background, borderRadius: props.radius, pointerEvents: 'none' }}
    />
  );
}

export type { GradientProps };
