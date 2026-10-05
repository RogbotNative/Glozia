import { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

export type GradientProps = (
  | { kind: 'linear' }
  | { kind: 'radial'; cx: string; cy: string; rx: string; ry: string }
) & {
  /** [offset 0–1, colour] pairs. Linear gradients run top to bottom. */
  stops: [number, string][];
  /** CSS border-radius for the layer (web only; native callers clip with overflow: hidden). */
  radius?: string;
};

/** Absolutely positioned gradient layer drawn with react-native-svg. */
export function Gradient(props: GradientProps) {
  const id = useId().replace(/:/g, '');
  const stops = props.stops.map(([offset, color]) => <Stop key={offset} offset={offset} stopColor={color} />);
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none" aria-hidden>
      <Defs>
        {props.kind === 'linear' ? (
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            {stops}
          </LinearGradient>
        ) : (
          <RadialGradient id={id} cx={props.cx} cy={props.cy} rx={props.rx} ry={props.ry} fx={props.cx} fy={props.cy}>
            {stops}
          </RadialGradient>
        )}
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}
