import { Image as ExpoImage, type ImageProps } from 'expo-image';

/**
 * expo-image on the web only forwards `accessibilityLabel` to the rendered <img alt>, so mirror
 * `alt` into it. Pass alt="" for decorative images.
 */
export function Image({ alt, accessibilityLabel, ...props }: ImageProps) {
  return <ExpoImage {...props} alt={alt} accessibilityLabel={accessibilityLabel ?? alt} />;
}
