import Svg, { Circle, Path } from 'react-native-svg';

type IconProps = { size?: number; color?: string; stroke?: number };

function Line({ d, size = 18, color = 'currentColor', stroke = 1.4 }: IconProps & { d: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <Path d={d} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export const ArrowRight = (p: IconProps) => <Line {...p} d="M4 12h16M14 6l6 6-6 6" />;
export const ArrowLeft = (p: IconProps) => <Line {...p} d="M20 12H4M10 6l-6 6 6 6" />;
export const Check = (p: IconProps) => <Line stroke={2} {...p} d="M5 12.5l4.5 4.5L19 7.5" />;
export const MenuIcon = (p: IconProps) => <Line size={24} stroke={1.3} {...p} d="M4 8h16M4 16h16" />;
export const CloseIcon = (p: IconProps) => <Line size={24} stroke={1.3} {...p} d="M6 6l12 12M18 6L6 18" />;
export const Moon = (p: IconProps) => <Line size={16} stroke={1.5} {...p} d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />;
export const Flip = (p: IconProps) => (
  <Line {...p} d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.7L4 15.5M4 20v-4.5h4.5" />
);
export const Hand = (p: IconProps) => (
  <Line
    size={22}
    stroke={1.3}
    {...p}
    d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12m0-1.5a1.5 1.5 0 0 1 3 0V12m0-.5a1.5 1.5 0 0 1 3 0v3.5a6 6 0 0 1-6 6h-.5a5.5 5.5 0 0 1-4.6-2.5L4.5 15a1.5 1.5 0 0 1 2.4-1.8L8 14.5"
  />
);
export const Chat = (p: IconProps) => <Line {...p} d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-5.2A8.5 8.5 0 1 1 21 11.5z" />;

export function Sun({ size = 16, color = 'currentColor', stroke = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <Circle cx={12} cy={12} r={4} stroke={color} strokeWidth={stroke} />
      <Path
        d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </Svg>
  );
}
