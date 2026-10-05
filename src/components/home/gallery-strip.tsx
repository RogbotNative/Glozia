import { ScrollView, View } from 'react-native';

import { Image } from '@/components/image';
import { gallery } from '@/constants/content';
import { useLayout } from '@/hooks/use-layout';

/** Swipeable row of arched photos (phones, tablets and native). */
export function GalleryStrip() {
  const { gutter, isMobile } = useLayout();
  const w = isMobile ? 220 : 260;
  const h = Math.round(w * 1.4);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={w + 16}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: gutter, gap: 16 }}>
      {gallery.map((g, i) => (
        <View key={i}>
          <Image
            source={g.img}
            alt={g.alt}
            contentFit="cover"
            style={{
              width: w,
              height: h,
              borderTopLeftRadius: i % 3 === 0 ? w / 2 : 2,
              borderTopRightRadius: i % 3 === 0 ? w / 2 : 2,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
}
