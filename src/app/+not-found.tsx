import Head from 'expo-router/head';
import { View } from 'react-native';

import { Button, TextLink } from '@/components/buttons';
import { Container } from '@/components/layout';
import { Page } from '@/components/page';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Em, Eyebrow, Sans, Serif } from '@/components/typography';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

export default function NotFound() {
  const { isMobile } = useLayout();
  return (
    <Page>
      <Head>
        <title>Page not found · Glozia</title>
        <meta name="robots" content="noindex" />
      </Head>
      <SiteHeader />
      <Container style={{ paddingVertical: isMobile ? 96 : 160, gap: 24 }}>
        <Eyebrow>Page not found</Eyebrow>
        <Serif size={isMobile ? 52 : 88} lh={1} heading={1}>
          This page has <Em>wandered off.</Em>
        </Serif>
        <Sans size={16} lh={1.7} color={colors.body} style={{ maxWidth: 520 }}>
          The link may be old or mistyped. Everything you need is a click away.
        </Sans>
        <View style={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 28, marginTop: 8 }}>
          <Button label="Back to home" href="/" arrow />
          <TextLink label="Services & prices" href="/services" />
        </View>
      </Container>
      <SiteFooter />
    </Page>
  );
}
