import Svg, { Path } from 'react-native-svg';

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
export const Hand = (p: IconProps) => (
  <Line
    size={22}
    stroke={1.3}
    {...p}
    d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12m0-1.5a1.5 1.5 0 0 1 3 0V12m0-.5a1.5 1.5 0 0 1 3 0v3.5a6 6 0 0 1-6 6h-.5a5.5 5.5 0 0 1-4.6-2.5L4.5 15a1.5 1.5 0 0 1 2.4-1.8L8 14.5"
  />
);
export const Chat = (p: IconProps) => <Line {...p} d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-5.2A8.5 8.5 0 1 1 21 11.5z" />;
