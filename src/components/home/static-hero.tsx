import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Button, TextLink } from '@/components/buttons';
import { Container, Section } from '@/components/layout';
import { Em, Eyebrow, Sans, Serif } from '@/components/typography';
import { photos } from '@/constants/images';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

/** Photo hero for phones and tablets (and native apps). */
export function StaticHero() {
  const { isMobile, content } = useLayout();

  const copy = (
    <View style={{ gap: isMobile ? 20 : 26, flex: isMobile ? undefined : 1, minWidth: 0 }}>
      <Eyebrow size={isMobile ? 11 : 12}>
        {isMobile ? 'Nagarbhavi, Bengaluru' : 'Unisex salon & ladies spa · Nagarbhavi, Bengaluru'}
      </Eyebrow>
      <Serif size={isMobile ? 52 : 68} lh={0.98} heading={1} style={{ letterSpacing: -0.5 }}>
        The quiet art of <Em color={colors.bronze}>looking like</Em> yourself.
      </Serif>
      <Sans size={isMobile ? 16 : 17} lh={1.65} weight="light" color={colors.body} style={{ maxWidth: 470 }}>
        Premium haircuts, colour, skin and spa care for men and women — with warm service and real
        attention to detail, on Mallathahalli Lake Road.
      </Sans>
      <View style={[styles.ctas, isMobile && styles.ctasStacked]}>
        <Button label="Book an appointment" href="/book" arrow={!isMobile} full={isMobile} />
        <TextLink label="Services & prices" href="/services" />
      </View>
    </View>
  );

  const imgWidth = isMobile ? content : 340;
  const image = (
    <Image
      source={photos.hero}
      alt="A stylist pinning a client's hair into soft sculpted curls"
      contentFit="cover"
      style={{
        width: imgWidth,
        height: isMobile ? 420 : 480,
        borderTopLeftRadius: imgWidth / 2,
        borderTopRightRadius: imgWidth / 2,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        marginTop: isMobile ? 16 : 0,
      }}
    />
  );

  return (
    <Section id="top">
      <Container
        style={
          isMobile
            ? { paddingTop: 36, paddingBottom: 48, gap: 20 }
            : { paddingTop: 64, paddingBottom: 80, flexDirection: 'row', alignItems: 'center', gap: 48 }
        }>
        {copy}
        {image}
      </Container>
    </Section>
  );
}

const styles = StyleSheet.create({
  ctas: { flexDirection: 'row', alignItems: 'center', gap: 32, marginTop: 6 },
  ctasStacked: { flexDirection: 'column', alignItems: 'flex-start', gap: 20, marginTop: 4 },
});
