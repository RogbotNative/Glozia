import { createContext, useContext, useRef, type ReactNode } from 'react';
import { ScrollView, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

type PageApi = {
  scrollTo: (id: string) => void;
  register: (id: string, y: number) => void;
};

const PageContext = createContext<PageApi>({ scrollTo: () => {}, register: () => {} });

/** On native the page is a ScrollView; sections report their offsets so nav links can scroll to them. */
export function Page({ children, floating }: { children: ReactNode; floating?: ReactNode }) {
  const ref = useRef<ScrollView>(null);
  const offsets = useRef<Record<string, number>>({});
  const insets = useSafeAreaInsets();

  const api: PageApi = {
    scrollTo: (id) => {
      const y = offsets.current[id];
      if (y != null) ref.current?.scrollTo({ y, animated: true });
    },
    register: (id, y) => {
      offsets.current[id] = y;
    },
  };

  return (
    <PageContext.Provider value={api}>
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <ScrollView ref={ref} contentContainerStyle={{ paddingTop: insets.top }}>
          {children}
        </ScrollView>
        {floating}
      </View>
    </PageContext.Provider>
  );
}

export function useAnchor(id: string) {
  const { register } = useContext(PageContext);
  return { onLayout: (e: LayoutChangeEvent) => register(id, e.nativeEvent.layout.y) };
}

export function usePageScroll() {
  return useContext(PageContext);
}
