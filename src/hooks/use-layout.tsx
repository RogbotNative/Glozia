import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { MAX_WIDTH } from '@/constants/theme';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export type Layout = {
  width: number;
  height: number;
  bp: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  /** Horizontal page padding. */
  gutter: number;
  /** Width available inside the gutters. */
  content: number;
  /** False during the static (server) render and the first client render on web. */
  hydrated: boolean;
};

/**
 * Static HTML is rendered at a phone width; most visitors are on phones. Wider screens are
 * briefly hidden by a script in +html.tsx until the client re-renders at the real width.
 */
const STATIC_WIDTH = 390;
const STATIC_HEIGHT = 844;

export const TABLET_MIN = 720;
export const DESKTOP_MIN = 1100;

function compute(width: number, height: number, hydrated: boolean): Layout {
  const w = width > 0 ? width : STATIC_WIDTH;
  const bp: Breakpoint = w >= DESKTOP_MIN ? 'desktop' : w >= TABLET_MIN ? 'tablet' : 'mobile';
  // Desktop gutter grows from 48px to the design's 96px, reached at 1400px (a 1440px window with a scrollbar).
  const gutter =
    bp === 'desktop' ? Math.round(48 + Math.min(1, (w - DESKTOP_MIN) / 300) * 48) : bp === 'tablet' ? 40 : 24;
  return {
    width: w,
    height: height > 0 ? height : STATIC_HEIGHT,
    bp,
    isMobile: bp === 'mobile',
    isTablet: bp === 'tablet',
    isDesktop: bp === 'desktop',
    gutter,
    content: Math.min(w, MAX_WIDTH) - gutter * 2,
    hydrated,
  };
}

const LayoutContext = createContext<Layout>(compute(STATIC_WIDTH, STATIC_HEIGHT, false));

const noopSubscribe = () => () => {};

/** False while pre-rendering and during hydration on the web; true afterwards (and always on native). */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function LayoutProvider({ children }: { children: ReactNode }) {
  const dims = useWindowDimensions();
  const hydrated = useHydrated();
  const layout = hydrated
    ? compute(dims.width, dims.height, true)
    : compute(STATIC_WIDTH, STATIC_HEIGHT, false);

  useEffect(() => {
    if (Platform.OS !== 'web' || !hydrated) return;
    // Reveal the page once it has re-rendered at the real width (see +html.tsx).
    const id = requestAnimationFrame(() => document.documentElement.classList.remove('glz-wait'));
    return () => cancelAnimationFrame(id);
  }, [hydrated]);

  return <LayoutContext.Provider value={layout}>{children}</LayoutContext.Provider>;
}

export function useLayout() {
  return useContext(LayoutContext);
}
