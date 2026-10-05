import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, sansFamily, serifFamily, type Weight } from '@/constants/theme';

type Base = TextProps & {
  size: number;
  /** Line height as a multiple of the font size. */
  lh?: number;
  weight?: Weight;
  color?: string;
  align?: TextStyle['textAlign'];
  /** Renders as h1–h4 on the web. */
  heading?: 1 | 2 | 3 | 4;
};

function headingProps(level?: number) {
  if (!level) return null;
  return { role: 'heading' as const, 'aria-level': level } as object;
}

export function Serif({
  size,
  lh = 1.1,
  weight = 'light',
  italic = false,
  color = colors.ink,
  align,
  heading,
  style,
  ...rest
}: Base & { italic?: boolean }) {
  return (
    <Text
      {...headingProps(heading)}
      {...rest}
      style={[
        {
          fontFamily: serifFamily(weight, italic),
          fontSize: size,
          lineHeight: Math.round(size * lh),
          color,
          textAlign: align,
        },
        style,
      ]}
    />
  );
}

/** Italic run inside a Serif heading, like <em>. */
export function Em({
  children,
  weight = 'light',
  color,
  style,
}: {
  children: React.ReactNode;
  weight?: Weight;
  color?: string;
  style?: TextStyle;
}) {
  return <Text style={[{ fontFamily: serifFamily(weight, true) }, color ? { color } : null, style]}>{children}</Text>;
}

export function Sans({
  size,
  lh = 1.6,
  weight = 'regular',
  color = colors.ink,
  align,
  heading,
  tracking = 0,
  upper = false,
  style,
  ...rest
}: Base & { tracking?: number; upper?: boolean }) {
  return (
    <Text
      {...headingProps(heading)}
      {...rest}
      style={[
        {
          fontFamily: sansFamily(weight),
          fontSize: size,
          lineHeight: Math.round(size * lh),
          color,
          textAlign: align,
          letterSpacing: size * tracking,
          textTransform: upper ? 'uppercase' : undefined,
        },
        style,
      ]}
    />
  );
}

export function Eyebrow({
  children,
  color = colors.bronze,
  size = 12,
  style,
}: {
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: TextStyle | object | null;
}) {
  return (
    <Sans size={size} lh={1.4} weight="medium" tracking={0.26} upper color={color} style={style as TextStyle}>
      {children}
    </Sans>
  );
}

/** Small uppercase label (Address, Hours, roles). */
export function Label({ children, color = colors.muted, size = 11 }: { children: React.ReactNode; color?: string; size?: number }) {
  return (
    <Sans size={size} lh={1.5} tracking={0.22} upper color={color}>
      {children}
    </Sans>
  );
}
