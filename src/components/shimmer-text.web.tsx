import type { ReactNode } from 'react';

import { serifFamily } from '@/constants/theme';

/** Gold text with a slow light sweep (CSS in global.css). */
export function ShimmerText({ children }: { children: ReactNode }) {
  return (
    <span className="glz-shimmer" style={{ fontFamily: serifFamily('light', true) }}>
      {children}
    </span>
  );
}
