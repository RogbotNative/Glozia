export { mount, type GloziaScene, type MountOptions, type SceneMode } from './scene';

export interface AmbientOptions {
  /** Where the pearls gather: 'right' leaves the left side for text; 'center' keeps to the gap between a heading and a side card. */
  layout?: 'right' | 'center';
  /** Colour of the page behind, used for depth fog. */
  fog?: string;
  onReady?: () => void;
}

export interface AmbientScene {
  dispose(): void;
}

/** Returns null when WebGL is unavailable. */
export function mountAmbient(canvas: HTMLCanvasElement, opts?: AmbientOptions): AmbientScene | null;
