import { StyleSheet, View } from 'react-native';

import { TextLink } from '@/components/buttons';
import { Container } from '@/components/layout';
import { Em, Eyebrow, Serif } from '@/components/typography';
import { site } from '@/constants/site';
import { useLayout } from '@/hooks/use-layout';

export function GalleryHeader() {
  const { isMobile, isDesktop } = useLayout();
  return (
    <Container style={[styles.row, isMobile && styles.stacked]}>
      <View style={{ gap: isMobile ? 16 : 20 }}>
        <Eyebrow size={isMobile ? 11 : 12}>From the studio</Eyebrow>
        <Serif size={isMobile ? 40 : isDesktop ? 60 : 48} lh={1.05} heading={2}>
          Recent <Em>work.</Em>
        </Serif>
      </View>
      <TextLink
        label={isMobile ? site.instagramHandle : `Instagram · ${site.instagramHandle}`}
        href={site.instagramUrl}
        style={isMobile ? null : { alignSelf: 'flex-end' }}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 },
  stacked: { flexDirection: 'column', alignItems: 'flex-start', gap: 20 },
});
