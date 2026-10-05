import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

/** Eases a number from its previous value to `value` over `ms` (instantly with reduced motion). */
export function useCountUp(value: number, ms = 650) {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    from.current = value;
    if (reduceMotion || start === value) {
      const id = requestAnimationFrame(() => setShown(value));
      return () => cancelAnimationFrame(id);
    }
    const t0 = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(start + (value - start) * eased));
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [value, ms, reduceMotion]);

  return shown;
}
