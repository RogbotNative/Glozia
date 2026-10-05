import { Pressable, StyleSheet, View } from 'react-native';

import { Button, MaybeLink, type PressState } from '@/components/buttons';
import { Image } from '@/components/image';
import { Container, Grid } from '@/components/layout';
import { Reveal } from '@/components/motion';
import { ShimmerText } from '@/components/shimmer-text';
import { Label, Sans, Serif } from '@/components/typography';
import { brand } from '@/constants/images';
import { hours, site } from '@/constants/site';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <MaybeLink href={href}>
      <Pressable role="link" style={{ alignSelf: 'flex-start' }}>
        {(s) => (
          <Sans size={14} lh={1.7} color={(s as PressState).hovered ? colors.cream : colors.onDarkMuted}>
            {label}
          </Sans>
        )}
      </Pressable>
    </MaybeLink>
  );
}

export function SiteFooter({ bottomInset = 0 }: { bottomInset?: number }) {
  const { isDesktop, isMobile } = useLayout();
  const year = new Date().getFullYear();

  const brandBlock = (
    <View style={{ gap: 14 }}>
      <Image
        source={brand.logoGold}
        style={{ width: isMobile ? 140 : 170, height: isMobile ? 89 : 108 }}
        contentFit="contain"
        alt={site.fullName}
      />
      <Sans size={10} tracking={0.38} upper color={colors.onDarkMuted}>
        & Ladies Spa
      </Sans>
    </View>
  );
  const studio = (
    <View style={{ gap: 10 }}>
      <Label color={colors.gold}>Studio</Label>
      <Sans size={14} lh={1.7} color={colors.onDarkMuted}>
        {site.street}
        {'\n'}
        {site.city} {site.postalCode}
        {'\n'}
        {site.phoneDisplay}
      </Sans>
    </View>
  );
  const hoursBlock = (
    <View style={{ gap: 10 }}>
      <Label color={colors.gold}>Hours</Label>
      <Sans size={14} lh={1.7} color={colors.onDarkMuted}>
        {hours.rows.map((r) => r.join(' · ')).join('\n')}
      </Sans>
    </View>
  );
  const follow = (
    <View style={{ gap: 10 }}>
      <Label color={colors.gold}>Follow</Label>
      <FooterLink label="Instagram" href={site.instagramUrl} />
      <FooterLink label="Google reviews" href={site.mapsUrl} />
    </View>
  );

  return (
    <View style={{ backgroundColor: colors.night }}>
      <Container
        style={[
          { paddingTop: isMobile ? 64 : 96, paddingBottom: (isMobile ? 32 : 40) + bottomInset, gap: isMobile ? 24 : 64 },
          isDesktop && { minHeight: 560, justifyContent: 'space-between' },
        ]}>
        <Reveal style={[styles.top, !isDesktop && styles.topStacked]}>
          <Serif size={isMobile ? 44 : isDesktop ? 72 : 60} lh={isMobile ? 1.02 : 1} color={colors.cream} heading={2}>
            Your chair is <ShimmerText>waiting.</ShimmerText>
          </Serif>
          <Button label="Book an appointment" href="/book" variant="light" full={isMobile} />
        </Reveal>
        <Reveal delay={120} style={[styles.grid, { marginTop: isMobile ? 16 : 0, paddingTop: isMobile ? 32 : 48 }]}>
          {isMobile ? (
            <View style={{ gap: 24 }}>
              {brandBlock}
              {studio}
              {hoursBlock}
              {follow}
            </View>
          ) : (
            <Grid columns={isDesktop ? 4 : 2} gap={48} rowGap={40}>
              {brandBlock}
              {studio}
              {hoursBlock}
              {follow}
            </Grid>
          )}
        </Reveal>
        <View style={[styles.bottom, isMobile && { flexDirection: 'column', gap: 6 }]}>
          <Sans size={12} tracking={0.08} color={colors.faint}>
            © {year} {site.fullName}
          </Sans>
          <Sans size={12} tracking={0.08} color={colors.faint}>
            Nagarbhavi, Bengaluru
          </Sans>
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 64 },
  topStacked: { flexDirection: 'column', alignItems: 'flex-start', gap: 24 },
  grid: { borderTopWidth: 1, borderTopColor: colors.lineDark },
  bottom: { flexDirection: 'row', justifyContent: 'space-between' },
});
