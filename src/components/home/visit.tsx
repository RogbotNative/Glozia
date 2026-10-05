import { Pressable, StyleSheet, View } from 'react-native';

import { Button, MaybeLink, type PressState } from '@/components/buttons';
import { Container, Section } from '@/components/layout';
import { MapEmbed } from '@/components/map-embed';
import { Em, Eyebrow, Label, Sans, Serif } from '@/components/typography';
import { hours, site, whatsappUrl } from '@/constants/site';
import { colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

function InlineLink({ label, href, color = colors.ink }: { label: string; href: string; color?: string }) {
  return (
    <MaybeLink href={href}>
      <Pressable role="link" style={{ alignSelf: 'flex-start' }}>
        {(s) => (
          <Sans size={16} lh={1.6} color={(s as PressState).hovered ? colors.bronze : color}>
            {label}
          </Sans>
        )}
      </Pressable>
    </MaybeLink>
  );
}

export function Visit() {
  const { isMobile, isDesktop } = useLayout();
  return (
    <Section id="visit" style={styles.border}>
      <Container
        style={[
          { paddingVertical: isMobile ? 72 : 128, gap: isMobile ? 24 : 56 },
          isDesktop && { flexDirection: 'row', gap: 96, minHeight: 816 },
        ]}>
        {isDesktop ? (
          <View style={{ width: 600 }}>
            <MapEmbed height="100%" />
          </View>
        ) : null}
        <View style={{ flex: isDesktop ? 1 : undefined, minWidth: 0, justifyContent: 'center', gap: isMobile ? 24 : 36 }}>
          <View style={{ gap: isMobile ? 16 : 20 }}>
            <Eyebrow size={isMobile ? 11 : 12}>Visit</Eyebrow>
            <Serif size={isMobile ? 40 : 60} lh={1.06} heading={2}>
              Come in, <Em>slow down.</Em>
            </Serif>
          </View>
          {!isDesktop ? <MapEmbed height={isMobile ? 240 : 360} /> : null}
          <View style={[styles.facts, isMobile && styles.factsStacked]}>
            <View style={{ flex: isMobile ? undefined : 1, gap: 10 }}>
              <Label>Address</Label>
              <Sans size={16} lh={1.7}>
                {site.addressLines.join('\n')}
              </Sans>
            </View>
            <View style={{ flex: isMobile ? undefined : 1, gap: 10 }}>
              <Label>Hours</Label>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <View style={{ gap: 6 }}>
                  {hours.rows.map(([days]) => (
                    <Sans key={days} size={16}>
                      {days}
                    </Sans>
                  ))}
                </View>
                <View style={{ gap: 6 }}>
                  {hours.rows.map(([days, time]) => (
                    <Sans key={days} size={16} numberOfLines={1}>
                      {time}
                    </Sans>
                  ))}
                </View>
              </View>
            </View>
          </View>
          <View style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 6 }}>
              <Sans size={16} lh={1.6}>
                Call or WhatsApp ·
              </Sans>
              <InlineLink label={site.phoneDisplay} href={site.phoneHref} />
            </View>
            <InlineLink label="Message us on WhatsApp" href={whatsappUrl()} color={colors.muted} />
            <InlineLink label={site.instagramHandle} href={site.instagramUrl} color={colors.muted} />
          </View>
          <View style={[styles.ctas, isMobile && styles.ctasStacked]}>
            <Button label="Book an appointment" href="/book" full={isMobile} />
            <Button label="Get directions" href={site.mapsUrl} variant="line" full={isMobile} />
          </View>
        </View>
      </Container>
    </Section>
  );
}

const styles = StyleSheet.create({
  border: { borderTopWidth: 1, borderTopColor: colors.line },
  facts: { flexDirection: 'row', gap: 40 },
  factsStacked: { flexDirection: 'column', gap: 24 },
  ctas: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  ctasStacked: { flexDirection: 'column', flexWrap: 'nowrap', gap: 12 },
});
