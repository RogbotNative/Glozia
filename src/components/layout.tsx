import { router, usePathname } from 'expo-router';
import { Children, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useAnchor, usePageScroll } from '@/components/page';
import { MAX_WIDTH } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

/** Centres content at the design width with responsive side padding. */
export function Container({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { gutter } = useLayout();
  return (
    <View style={[{ width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center', paddingHorizontal: gutter }, style]}>
      {children}
    </View>
  );
}

/** Full-bleed band with an optional anchor id. */
export function Section({
  id,
  bg,
  children,
  style,
}: {
  id?: string;
  bg?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const anchor = useAnchor(id ?? '');
  return (
    <View {...(id ? anchor : null)} style={[{ width: '100%', backgroundColor: bg }, style]}>
      {children}
    </View>
  );
}

/** Equal-width columns that wrap into rows, without pixel maths. */
export function Grid({
  columns,
  gap,
  rowGap = gap,
  children,
}: {
  columns: number;
  gap: number;
  rowGap?: number;
  children: ReactNode;
}) {
  const items = Children.toArray(children);
  const rows: ReactNode[][] = [];
  for (let i = 0; i < items.length; i += columns) rows.push(items.slice(i, i + columns));
  return (
    <View style={{ gap: rowGap }}>
      {rows.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', gap }}>
          {row.map((item, c) => (
            <View key={c} style={{ flex: 1, minWidth: 0 }}>
              {item}
            </View>
          ))}
          {Array.from({ length: columns - row.length }, (_, k) => (
            <View key={`pad-${k}`} style={{ flex: 1 }} />
          ))}
        </View>
      ))}
    </View>
  );
}

/** Scrolls to a home-page section, navigating home first when needed. */
export function useSectionNav() {
  const pathname = usePathname();
  const { scrollTo } = usePageScroll();
  return (id: string) => {
    if (pathname === '/') scrollTo(id);
    else router.push({ pathname: '/', params: { s: id } });
  };
}
