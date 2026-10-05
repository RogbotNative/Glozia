import Head from 'expo-router/head';
import { StyleSheet, View } from 'react-native';

import { AmbientGold } from '@/components/ambient-gold';
import { Button, TextLink } from '@/components/buttons';
import { CrownCoin } from '@/components/home/approach';
import { Container } from '@/components/layout';
import { Enter } from '@/components/motion';
import { Page } from '@/components/page';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Em, Eyebrow, Sans, Serif } from '@/components/typography';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

export default function NotFound() {
  const { isMobile, isDesktop } = useLayout();
  return (
    <Page>
      <Head>
        <title>Page not found · Glozia</title>
        <meta name="robots" content="noindex" />
      </Head>
      <SiteHeader />
      <View style={styles.stage}>
        <AmbientGold layout="center" />
        <Container style={[styles.inner, { paddingVertical: isMobile ? 96 : 160 }, isDesktop && styles.row]}>
          <View style={{ flex: isDesktop ? 1 : undefined, gap: 24 }}>
            <Enter>
              <Eyebrow>Page not found</Eyebrow>
            </Enter>
            <Enter delay={120}>
              <Serif size={isMobile ? 52 : 88} lh={1} heading={1}>
                This page has <Em>wandered off.</Em>
              </Serif>
            </Enter>
            <Enter delay={240}>
              <Sans size={16} lh={1.7} color={colors.body} style={{ maxWidth: 520 }}>
                The link may be old or mistyped. Everything you need is a click away.
              </Sans>
            </Enter>
            <Enter
              delay={360}
              style={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 28, marginTop: 8 }}>
              <Button label="Back to home" href="/" arrow />
              <TextLink label="Services & prices" href="/services" />
            </Enter>
          </View>
          {isDesktop ? (
            <Enter variant="scale" delay={300}>
              <CrownCoin size={300} />
            </Enter>
          ) : null}
        </Container>
      </View>
      <SiteFooter />
    </Page>
  );
}

const styles = StyleSheet.create({
  stage: { position: 'relative', overflow: 'hidden' },
  inner: { gap: 48 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 96 },
});
