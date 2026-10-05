import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}

const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => 0;

/**
 * The current time in whole minutes since the epoch, or 0 while pre-rendering and hydrating
 * (so the static HTML never bakes in the build machine's clock).
 */
export function useMinute() {
  return useSyncExternalStore(subscribe, getMinute, getServerMinute);
}
