import type { ReactNode } from 'react';
import { View } from 'react-native';

export type TiltProps = {
  height: number;
  /** Glare colour at the pointer (web only). */
  glare?: string;
  /** CSS border-radius matching the card, so the glare stays inside it (web only). */
  radius?: string;
  /** A single card that fills the height. */
  children: ReactNode;
};

/** Native: no pointer, so no tilt. See tilt.web.tsx. */
export function Tilt({ height, children }: TiltProps) {
  return <View style={{ height }}>{children}</View>;
}
