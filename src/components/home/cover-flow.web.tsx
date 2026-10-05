import { useRef, type PointerEvent } from 'react';

import { flow, pad2, relative, type StageProps } from '@/components/home/cover-flow-math';
import { Image } from '@/components/image';
import { Sans, Serif } from '@/components/typography';
import { showcase } from '@/constants/content';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

/**
 * Web cover-flow stage, built like the design board: a CSS 3D stage (perspective 1600px) with cards
 * placed by translateX/translateZ/rotateY, dragged with pointer events (touch keeps vertical scroll).
 */
export function CoverFlowStage({ pos, drag, onDrag, onSettle, onPick, unit, reduceMotion }: StageProps) {
  const { gutter } = useLayout();
  const gesture = useRef<{ x: number; start: number; id: number; moved: number; captured: boolean } | null>(null);
  const endedAt = useRef(0);
  const cardW = 320 * unit;
  const imgH = 430 * unit;
  const current = drag ?? pos;

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    gesture.current = { x: e.clientX, start: pos, id: e.pointerId, moved: 0, captured: false };
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    g.moved = Math.max(g.moved, Math.abs(dx));
    if (g.moved < 5) return;
    if (!g.captured) {
      g.captured = true;
      e.currentTarget.setPointerCapture(g.id);
    }
    onDrag(g.start - dx / (260 * unit));
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g?.captured) return;
    endedAt.current = Date.now();
    onSettle(Math.round(g.start - (e.clientX - g.x) / (260 * unit)));
  };

  const dragging = drag != null;
  return (
    <div
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      style={{
        position: 'relative',
        height: 620 * unit,
        margin: `0 ${-gutter}px`,
        overflow: 'hidden',
        perspective: 1600,
        perspectiveOrigin: '50% 44%',
        touchAction: 'pan-y',
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}>
      {showcase.map((item, i) => {
        const p = flow(i, current);
        return (
          <button
            key={item.name}
            type="button"
            aria-label={`${item.name} — ${item.price}`}
            onClick={() => {
              if (Date.now() - endedAt.current < 300) return;
              const r = relative(i, pos);
              if (Math.abs(r) > 0.01) onPick(pos + r);
            }}
            style={{
              position: 'absolute',
              left: '50%',
              top: 18 * unit,
              width: cardW,
              marginLeft: -cardW / 2,
              padding: 0,
              border: 0,
              background: 'transparent',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              transform: `translateX(${(p.x * unit).toFixed(1)}px) translateZ(${(p.z * unit).toFixed(1)}px) rotateY(${p.rotate.toFixed(1)}deg)`,
              opacity: p.opacity,
              zIndex: p.zIndex,
              transition: dragging || reduceMotion ? 'none' : 'transform 1s cubic-bezier(.22,.7,.2,1), opacity .8s ease',
            }}>
            <span
              style={{
                display: 'block',
                borderRadius: `${cardW / 2}px ${cardW / 2}px 2px 2px`,
                boxShadow: '0 40px 60px -36px rgba(42,33,28,0.6)',
              }}>
              <Image
                source={item.img}
                alt=""
                contentFit="cover"
                draggable={false}
                style={{
                  width: cardW,
                  height: imgH,
                  borderTopLeftRadius: cardW / 2,
                  borderTopRightRadius: cardW / 2,
                  borderBottomLeftRadius: 2,
                  borderBottomRightRadius: 2,
                }}
              />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: p.front ? 1 : 0, transition: 'opacity .5s ease' }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                <Serif size={34 * Math.max(unit, 0.9)} lh={1.1} weight="regular">
                  {item.name}
                </Serif>
                <Sans size={12} tracking={0.16} color={colors.bronze}>
                  {pad2(i + 1)}
                </Sans>
              </span>
              <span style={{ paddingTop: 12, borderTop: '1px solid rgba(42,33,28,0.16)' }}>
                <Sans size={14} tracking={0.04} color={colors.body}>
                  {item.price}
                </Sans>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
