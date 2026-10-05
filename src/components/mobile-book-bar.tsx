import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/buttons';
import { Sans, Serif } from '@/components/typography';
import { openStatus } from '@/constants/site';
import { colors } from '@/constants/theme';
import { useMinute } from '@/hooks/use-clock';

export const BOOK_BAR_HEIGHT = 84;

/** Sticky "open today · book" bar shown on phones. */
export function MobileBookBar() {
  const insets = useSafeAreaInsets();
  // Opening status depends on the visitor's clock, so it is only filled in after hydration.
  const minute = useMinute();
  const status = minute ? openStatus(minute * 60_000) : null;

  return (
    <View
      {...({ dataSet: { enter: 'up' } } as object)}
      style={[
        styles.bar,
        Platform.OS === 'web' ? ({ position: 'fixed' } as object) : null,
        { paddingBottom: 16 + insets.bottom, height: BOOK_BAR_HEIGHT + insets.bottom },
      ]}>
      <View style={styles.text}>
        <Sans size={10} lh={1.4} tracking={0.2} upper color={colors.muted}>
          {status?.label ?? 'Open every day'}
        </Sans>
        <Serif size={20} lh={1.2} weight="regular">
          {status?.detail ?? 'Nagarbhavi, Bengaluru'}
        </Serif>
      </View>
      <Button label="Book" href="/book" height={48} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(246,241,234,0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(42,33,28,0.14)',
    boxShadow: '0 -12px 32px rgba(42,33,28,0.08)',
    zIndex: 20,
  },
  text: { flex: 1, minWidth: 0, gap: 2 },
});
