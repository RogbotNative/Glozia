export type SceneMode = 'day' | 'dusk';

export interface GloziaScene {
  setMode(mode: SceneMode): void;
  shine(): void;
  renderOnce(): void;
  dispose(): void;
}

export interface MountOptions {
  mode?: SceneMode;
  onReady?: () => void;
  onError?: (error: unknown) => void;
  maxDpr?: number;
  layout?: 'center';
  offsetX?: number;
  offsetY?: number;
  crease?: number;
  bevelSegments?: number;
}

/** Returns null when WebGL is unavailable. */
export function mount(canvas: HTMLCanvasElement, opts?: MountOptions): GloziaScene | null;
