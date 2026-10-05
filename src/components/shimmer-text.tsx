import type { ReactNode } from 'react';

import { Em } from '@/components/typography';
import { colors } from '@/constants/theme';

export function ShimmerText({ children }: { children: ReactNode }) {
  return <Em color={colors.gold}>{children}</Em>;
}
