import { View } from 'react-native';

import { site } from '@/constants/site';
import { colors } from '@/constants/theme';

export function MapEmbed({ height }: { height: number | '100%' }) {
  return (
    <View style={{ height, minHeight: 240, backgroundColor: '#E0D5C6', borderRadius: 2, overflow: 'hidden' }}>
      <iframe
        title="Map showing Glozia on Mallathahalli Lake Road, Nagarbhavi"
        src={site.mapsEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ border: 0, width: '100%', height: '100%', display: 'block', filter: 'sepia(0.25) saturate(0.85)', background: colors.sand }}
      />
    </View>
  );
}
