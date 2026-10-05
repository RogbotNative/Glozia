import { Platform } from 'react-native';

export const colors = {
  cream: '#F6F1EA',
  sand: '#EDE4D8',
  paper: '#FCFAF6',
  white: '#FFFFFF',
  ink: '#2A211C',
  body: '#4F4238',
  muted: '#6B5B4E',
  faint: '#968777',
  disabled: '#A39587',
  bronze: '#8A6128',
  gold: '#C4914D',
  espresso: '#231B17',
  night: '#1B1512',
  onDark: '#F6F1EA',
  onDarkMuted: '#BDAE9F',
  line: 'rgba(42,33,28,0.12)',
  lineMid: 'rgba(42,33,28,0.18)',
  lineStrong: 'rgba(42,33,28,0.35)',
  lineDark: 'rgba(246,241,234,0.14)',
} as const;

const SERIF_FALLBACK = "'Cormorant Garamond', Garamond, 'Times New Roman', serif";
const SANS_FALLBACK = "Jost, Futura, 'Avenir Next', 'Helvetica Neue', sans-serif";

function family(name: string, fallback: string) {
  return Platform.OS === 'web' ? `${name}, ${fallback}` : name;
}

export type Weight = 'light' | 'regular' | 'medium';

const serif = {
  light: family('CormorantGaramond_300Light', SERIF_FALLBACK),
  lightItalic: family('CormorantGaramond_300Light_Italic', SERIF_FALLBACK),
  regular: family('CormorantGaramond_400Regular', SERIF_FALLBACK),
  regularItalic: family('CormorantGaramond_400Regular_Italic', SERIF_FALLBACK),
  medium: family('CormorantGaramond_500Medium', SERIF_FALLBACK),
  mediumItalic: family('CormorantGaramond_400Regular_Italic', SERIF_FALLBACK),
};

const sans = {
  light: family('Jost_300Light', SANS_FALLBACK),
  regular: family('Jost_400Regular', SANS_FALLBACK),
  medium: family('Jost_500Medium', SANS_FALLBACK),
};

export function serifFamily(weight: Weight = 'light', italic = false) {
  return serif[italic ? (`${weight}Italic` as const) : weight];
}

export function sansFamily(weight: Weight = 'regular') {
  return sans[weight];
}

/** Content never grows wider than the 1440px design frame. */
export const MAX_WIDTH = 1440;

/** Web-only CSS transition, ignored on native. */
export function webTransition(property: string, ms: number, easing = 'ease') {
  if (Platform.OS !== 'web') return null;
  return {
    transitionProperty: property,
    transitionDuration: `${ms}ms`,
    transitionTimingFunction: easing,
  } as object;
}
