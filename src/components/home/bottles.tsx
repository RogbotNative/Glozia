import Svg, { Rect } from 'react-native-svg';

import type { BottleShape } from '@/data/shop';

const CAP = '#C4914D';
const CAP_DARK = '#A97A35';
const LABEL = 'rgba(255,255,255,0.32)';
const SHINE = 'rgba(255,255,255,0.45)';

/** Product bottles from the Shop board (Home3D.dc.html), tinted per routine. `scale` 1 = design size. */
export function Bottle({ shape, tint, scale = 1 }: { shape: BottleShape; tint: string; scale?: number }) {
  switch (shape) {
    case 'shampoo':
      return (
        <Svg width={150 * scale} height={268 * scale} viewBox="0 0 132 236" aria-hidden>
          <Rect x={44} y={4} width={44} height={34} rx={7} fill={CAP} />
          <Rect x={40} y={30} width={52} height={10} rx={3} fill={CAP_DARK} />
          <Rect x={22} y={38} width={88} height={194} rx={26} fill={tint} />
          <Rect x={22} y={112} width={88} height={62} fill={LABEL} />
          <Rect x={32} y={52} width={9} height={164} rx={4.5} fill={SHINE} />
          <Rect x={90} y={48} width={12} height={172} rx={6} fill="rgba(0,0,0,0.13)" />
          <Rect x={40} y={134} width={52} height={3} rx={1.5} fill="rgba(42,33,28,0.35)" />
          <Rect x={48} y={144} width={36} height={3} rx={1.5} fill="rgba(42,33,28,0.22)" />
        </Svg>
      );
    case 'masque':
      return (
        <Svg width={170 * scale} height={170 * scale} viewBox="0 0 150 150" aria-hidden>
          <Rect x={14} y={8} width={122} height={42} rx={10} fill={CAP} />
          <Rect x={14} y={40} width={122} height={8} fill="rgba(0,0,0,0.14)" />
          <Rect x={8} y={46} width={134} height={100} rx={22} fill={tint} />
          <Rect x={8} y={74} width={134} height={40} fill={LABEL} />
          <Rect x={20} y={56} width={9} height={80} rx={4.5} fill={SHINE} />
          <Rect x={122} y={54} width={12} height={86} rx={6} fill="rgba(0,0,0,0.13)" />
          <Rect x={45} y={92} width={60} height={3} rx={1.5} fill="rgba(42,33,28,0.35)" />
        </Svg>
      );
    case 'serum':
      return (
        <Svg width={114 * scale} height={239 * scale} viewBox="0 0 100 210" aria-hidden>
          <Rect x={38} y={4} width={24} height={44} rx={12} fill="#2A211C" />
          <Rect x={32} y={44} width={36} height={26} rx={5} fill={CAP} />
          <Rect x={18} y={68} width={64} height={138} rx={18} fill={tint} />
          <Rect x={18} y={116} width={64} height={44} fill={LABEL} />
          <Rect x={27} y={80} width={7} height={110} rx={3.5} fill={SHINE} />
          <Rect x={66} y={76} width={10} height={122} rx={5} fill="rgba(0,0,0,0.14)" />
          <Rect x={34} y={136} width={32} height={3} rx={1.5} fill="rgba(42,33,28,0.32)" />
        </Svg>
      );
    case 'oil':
      return (
        <Svg width={125 * scale} height={268 * scale} viewBox="0 0 110 236" aria-hidden>
          <Rect x={46} y={2} width={46} height={12} rx={4} fill={CAP} />
          <Rect x={46} y={10} width={14} height={30} rx={3} fill={CAP} />
          <Rect x={36} y={36} width={38} height={22} rx={5} fill={CAP_DARK} />
          <Rect x={22} y={56} width={66} height={176} rx={20} fill={tint} />
          <Rect x={22} y={122} width={66} height={50} fill={LABEL} />
          <Rect x={31} y={68} width={8} height={150} rx={4} fill={SHINE} />
          <Rect x={72} y={64} width={10} height={160} rx={5} fill="rgba(0,0,0,0.13)" />
          <Rect x={38} y={145} width={34} height={3} rx={1.5} fill="rgba(42,33,28,0.32)" />
        </Svg>
      );
  }
}
