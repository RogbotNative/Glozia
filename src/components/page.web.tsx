import { createContext, useContext, type ReactNode } from 'react';
import { View } from 'react-native';

import { colors } from '@/constants/theme';

type PageApi = { scrollTo: (id: string) => void };

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const PageContext = createContext<PageApi>({ scrollTo });

/** On the web the document itself scrolls, so anchors and the 3D scene can use window scroll. */
export function Page({ children, floating }: { children: ReactNode; floating?: ReactNode }) {
  return (
    <PageContext.Provider value={{ scrollTo }}>
      <View style={{ backgroundColor: colors.cream, minHeight: '100%' }}>
        {children}
        {floating}
      </View>
    </PageContext.Provider>
  );
}

/** Props that make a section reachable by id (rendered as the element's `id` on the web). */
export function useAnchor(id: string) {
  return { nativeID: id };
}

export function usePageScroll() {
  return useContext(PageContext);
}
