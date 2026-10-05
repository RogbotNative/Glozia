import { Link, type Href } from 'expo-router';
import { cloneElement, useState, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ArrowLeft, ArrowRight } from '@/components/icons';
import { Sheen } from '@/components/sheen';
import { Sans } from '@/components/typography';
import { colors, webTransition } from '@/constants/theme';

/** Pressable state on react-native-web also reports hover and focus. */
export type PressState = { pressed: boolean; hovered?: boolean; focused?: boolean };

/**
 * Hover tracked in state. Needed for pressables wrapped in <Link asChild>, where a style
 * function would be lost when the link merges its props into the child.
 */
export function useHover() {
  const [hovered, setHovered] = useState(false);
  return [hovered, { onHoverIn: () => setHovered(true), onHoverOut: () => setHovered(false) }] as const;
}

export type Variant = 'dark' | 'light' | 'line' | 'gold' | 'ghostLight';

const VARIANTS: Record<Variant, { bg: string; bgHover: string; fg: string; fgHover?: string; border?: string; pill?: boolean }> = {
  dark: { bg: colors.ink, bgHover: '#000000', fg: colors.cream },
  light: { bg: colors.cream, bgHover: colors.white, fg: colors.ink },
  line: { bg: 'transparent', bgHover: colors.ink, fg: colors.ink, fgHover: colors.cream, border: colors.ink },
  gold: { bg: colors.gold, bgHover: '#D2A15F', fg: colors.night },
  ghostLight: {
    bg: 'transparent',
    bgHover: colors.cream,
    fg: colors.cream,
    fgHover: colors.espresso,
    border: 'rgba(246,241,234,0.35)',
    pill: true,
  },
};

function isExternal(href: string) {
  return /^(https?:|tel:|mailto:)/.test(href);
}

/** Wraps a pressable in an expo-router Link so it renders as a real <a> on the web. */
export function MaybeLink({ href, children }: { href?: string; children: React.ReactElement<{ style?: StyleProp<ViewStyle> }> }) {
  if (!href) return children;
  const external = isExternal(href);
  // <Link asChild> merges props into its child and only accepts a single (flattened) style object.
  const child = cloneElement(children, { style: StyleSheet.flatten(children.props.style) });
  return (
    <Link
      href={href as Href}
      asChild
      {...(external && Platform.OS === 'web' && href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : null)}>
      {child}
    </Link>
  );
}

type ButtonProps = {
  label: string;
  href?: string;
  onPress?: () => void;
  variant?: Variant;
  arrow?: boolean;
  /** Rendered before the label in the button's current text colour. */
  icon?: (color: string) => ReactNode;
  disabled?: boolean;
  full?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  /** A slow light sweep across the button, to draw the eye when it becomes available (web). */
  sheen?: boolean;
};

export function Button({
  label,
  href,
  onPress,
  variant = 'dark',
  arrow,
  icon,
  disabled,
  full,
  height = 52,
  style,
  accessibilityLabel,
  sheen,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const [hovered, hover] = useHover();
  const active = hovered && !disabled;
  const fg = active && v.fgHover ? v.fgHover : v.fg;
  return (
    <MaybeLink href={disabled ? undefined : href}>
      <Pressable
        {...hover}
        onPress={onPress}
        disabled={disabled}
        role={href ? 'link' : 'button'}
        accessibilityLabel={accessibilityLabel}
        style={[
          styles.button,
          { height, borderRadius: v.pill ? 999 : 2, paddingHorizontal: v.pill ? 24 : height < 50 ? 20 : 28 },
          { backgroundColor: disabled ? colors.disabled : active ? v.bgHover : v.bg },
          v.border ? { borderWidth: 1, borderColor: v.border } : null,
          full ? styles.full : null,
          // Filled buttons lift slightly on hover, like the hero buttons in the design.
          active && !v.border ? styles.lifted : null,
          sheen && !disabled ? styles.sheenHost : null,
          webTransition('background-color, color, transform, box-shadow', 250),
          style,
        ]}>
        {sheen && !disabled ? <Sheen /> : null}
        {icon ? <View style={styles.icon}>{icon(fg)}</View> : null}
        <Sans size={12} lh={1.2} weight="medium" tracking={0.22} upper color={fg} numberOfLines={1}>
          {label}
        </Sans>
        {arrow ? (
          <View style={[active ? styles.arrowNudge : null, webTransition('transform', 250)]}>
            <ArrowRight color={fg} />
          </View>
        ) : null}
      </Pressable>
    </MaybeLink>
  );
}

export function TextLink({
  label,
  href,
  onPress,
  color = colors.ink,
  hoverColor = colors.bronze,
  lineColor = colors.lineStrong,
  style,
}: {
  label: string;
  href?: string;
  onPress?: () => void;
  color?: string;
  hoverColor?: string;
  lineColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const [hovered, hover] = useHover();
  return (
    <MaybeLink href={href}>
      <Pressable
        {...hover}
        onPress={onPress}
        role="link"
        style={[styles.textLink, { borderBottomColor: hovered ? hoverColor : lineColor }, style]}>
        <Sans size={12} lh={1.3} weight="medium" tracking={0.22} upper color={hovered ? hoverColor : color}>
          {label}
        </Sans>
      </Pressable>
    </MaybeLink>
  );
}

export function RoundButton({
  direction,
  onPress,
  label,
}: {
  direction: 'left' | 'right';
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      role="button"
      accessibilityLabel={label}
      style={(s) => [
        styles.round,
        { backgroundColor: (s as PressState).hovered ? colors.ink : 'transparent' },
        webTransition('background-color', 250),
      ]}>
      {(s) => {
        const c = (s as PressState).hovered ? colors.cream : colors.ink;
        return direction === 'left' ? <ArrowLeft color={c} /> : <ArrowRight color={c} />;
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    alignSelf: 'flex-start',
  },
  full: { alignSelf: 'stretch' },
  lifted: { transform: [{ translateY: -2 }], boxShadow: '0 14px 24px -14px rgba(42,33,28,0.55)' },
  sheenHost: { position: 'relative', overflow: 'hidden' },
  arrowNudge: { transform: [{ translateX: 4 }] },
  icon: { marginRight: -2 },
  textLink: {
    alignSelf: 'flex-start',
    paddingBottom: 6,
    borderBottomWidth: 1,
  },
  round: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(42,33,28,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
