import { StyleSheet, View } from 'react-native';

import { Image } from '@/components/image';
import { Container, Grid, Section } from '@/components/layout';
import { Reveal } from '@/components/motion';
import { Tilt } from '@/components/tilt';
import { Eyebrow, Label, Sans, Serif } from '@/components/typography';
import { team, type TeamMember } from '@/constants/content';
import { brand } from '@/constants/images';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

/** Placeholder portrait from the design board: gold initial (or the crown) in a dark arch, until real photos exist. */
function Portrait({ member, height, radius }: { member: TeamMember; height: number; radius: number }) {
  const inset = radius - 12;
  return (
    <Tilt height={height} glare="rgba(255,232,190,0.26)" radius={`${radius}px ${radius}px 2px 2px`}>
      <View style={[styles.portrait, { borderTopLeftRadius: radius, borderTopRightRadius: radius }]}>
        <View style={[styles.inset, { borderTopLeftRadius: inset, borderTopRightRadius: inset }]} />
        <View {...({ dataSet: { float: '' } } as object)} aria-hidden>
          {member.initial ? (
            <Serif size={height * 0.5} lh={1} color={colors.gold}>
              {member.initial}
            </Serif>
          ) : (
            <Image source={brand.crownGold} style={{ width: height * 0.39, height: height * 0.19 }} contentFit="contain" alt="" />
          )}
        </View>
        <View style={[styles.caption, { bottom: height < 300 ? 16 : 22 }]}>
          <Sans size={height < 300 ? 9 : 10} tracking={height < 300 ? 0.14 : 0.24} upper color={colors.onDarkMuted} align="center">
            Portrait coming soon
          </Sans>
        </View>
      </View>
    </Tilt>
  );
}

export function Team() {
  const { isMobile, isDesktop } = useLayout();
  const height = isMobile ? 220 : isDesktop ? 380 : 320;
  const radius = isMobile ? 80 : 144;
  return (
    <Section id="team">
      <Container style={{ paddingVertical: isMobile ? 72 : 120, gap: isMobile ? 32 : 64, minHeight: isDesktop ? 940 : undefined }}>
        <Reveal style={[styles.header, isMobile && styles.headerStacked]}>
          <View style={{ gap: isMobile ? 16 : 20, flexShrink: 1 }}>
            <Eyebrow size={isMobile ? 11 : 12}>The team</Eyebrow>
            <Serif size={isMobile ? 40 : isDesktop ? 60 : 48} lh={1.05} heading={2}>
              The hands behind the chair.
            </Serif>
          </View>
          <Sans size={15} lh={1.7} color={colors.muted} style={{ maxWidth: 360 }}>
            Meet the stylists and therapists who’ll look after you — and ask for anyone by name when you
            book.
          </Sans>
        </Reveal>
        <Grid columns={isDesktop ? 4 : 2} gap={isMobile ? 16 : 32} rowGap={isMobile ? 24 : 40}>
          {team.map((member, i) => (
            <Reveal key={member.id} delay={(isDesktop ? i : i % 2) * 120} style={{ gap: isMobile ? 12 : 18 }}>
              <Portrait member={member} height={height} radius={radius} />
              <View style={{ gap: isMobile ? 4 : 6 }}>
                <Serif size={isMobile ? 22 : 28} weight="regular" heading={3}>
                  {member.name}
                </Serif>
                <Label size={isMobile ? 10 : 11}>{member.role}</Label>
              </View>
            </Reveal>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 64 },
  headerStacked: { flexDirection: 'column', alignItems: 'flex-start', gap: 16 },
  portrait: {
    flex: 1,
    backgroundColor: colors.espresso,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    boxShadow: '0 30px 50px -30px rgba(42,33,28,0.6)',
  },
  inset: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(196,145,77,0.4)',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  caption: { position: 'absolute', left: 0, right: 0 },
});
