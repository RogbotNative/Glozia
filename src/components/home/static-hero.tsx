import { StyleSheet, View } from 'react-native';

import { Button, TextLink } from '@/components/buttons';
import { Image } from '@/components/image';
import { Container, Section } from '@/components/layout';
import { Enter } from '@/components/motion';
import { Em, Eyebrow, Sans, Serif } from '@/components/typography';
import { photos } from '@/constants/images';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

/** Photo hero for phones and tablets (and native apps). */
export function StaticHero() {
  const { isMobile, content } = useLayout();

  const copy = (
    <View style={{ gap: isMobile ? 20 : 26, flex: isMobile ? undefined : 1, minWidth: 0 }}>
      <Enter>
        <Eyebrow size={isMobile ? 11 : 12}>
          {isMobile ? 'Nagarbhavi, Bengaluru' : 'Unisex salon & ladies spa · Nagarbhavi, Bengaluru'}
        </Eyebrow>
      </Enter>
      <Enter delay={120}>
        <Serif size={isMobile ? 52 : 68} lh={0.98} heading={1} style={{ letterSpacing: -0.5 }}>
          The quiet art of <Em color={colors.bronze}>looking like</Em> yourself.
        </Serif>
      </Enter>
      <Enter delay={240}>
        <Sans size={isMobile ? 16 : 17} lh={1.65} weight="light" color={colors.body} style={{ maxWidth: 470 }}>
          Premium haircuts, colour, skin and spa care for men and women — with warm service and real
          attention to detail, on Mallathahalli Lake Road.
        </Sans>
      </Enter>
      <Enter delay={360} style={[styles.ctas, isMobile && styles.ctasStacked]}>
        <Button label="Book an appointment" href="/book" arrow={!isMobile} full={isMobile} />
        <TextLink label="Services & prices" href="/services" />
      </Enter>
    </View>
  );

  const imgWidth = isMobile ? content : 340;
  // The arched photo unveils from the bottom, then floats gently.
  const image = (
    <Enter variant="arch" delay={200} style={{ marginTop: isMobile ? 16 : 0 }}>
      <View {...({ dataSet: { float: '' } } as object)}>
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
          }}
        />
      </View>
    </Enter>
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
