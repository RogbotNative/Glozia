import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/buttons';
import { Sans } from '@/components/typography';
import { photos } from '@/constants/images';
import { site } from '@/constants/site';
import { colors } from '@/constants/theme';

/** Native apps show a photo with a directions button instead of an embedded map. */
export function MapEmbed({ height }: { height: number | '100%' }) {
  return (
    <View style={[styles.box, { height }]}>
      <Image source={photos.galInterior} alt="" contentFit="cover" style={StyleSheet.absoluteFill} />
      <View style={styles.card}>
        <Sans size={14} lh={1.5}>
          {site.addressLines.join('\n')}
        </Sans>
        <Button label="Open in Google Maps" href={site.mapsUrl} height={44} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { minHeight: 240, borderRadius: 2, overflow: 'hidden', backgroundColor: '#E0D5C6', justifyContent: 'flex-end' },
  card: { margin: 16, padding: 16, gap: 12, backgroundColor: 'rgba(246,241,234,0.94)', borderRadius: 2, borderColor: colors.line, borderWidth: 1 },
});
