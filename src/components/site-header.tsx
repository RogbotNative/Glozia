import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, MaybeLink, type PressState } from '@/components/buttons';
import { CloseIcon, MenuIcon } from '@/components/icons';
import { Image } from '@/components/image';
import { Container, useSectionNav } from '@/components/layout';
import { Enter } from '@/components/motion';
import { Sans, Serif } from '@/components/typography';
import { brand } from '@/constants/images';
import { hours, site } from '@/constants/site';
import { colors, webTransition } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';

/** Home-page sections in nav order (after Services). From other pages they link to /?s=<id>. */
const SECTIONS = [
  ['Studio', 'studio'],
  ['Shop', 'shop'],
  ['Team', 'team'],
  ['Visit', 'visit'],
] as const;

/** Nav label with a gold underline that grows from the left on hover (and stays on the current page). */
function NavText({ label, color, hover, on }: { label: string; color: string; hover: string; on: boolean }) {
  return (
    <View>
      <Sans size={12} lh={1.4} tracking={0.2} upper color={on ? hover : color} style={webTransition('color', 300) as object}>
        {label}
      </Sans>
      <View
        style={[
          styles.underline,
          { backgroundColor: hover, transform: [{ scaleX: on ? 1 : 0 }] },
          webTransition('transform', 350, 'cubic-bezier(.2,.7,.2,1)'),
        ]}
      />
    </View>
  );
}

function NavItem({ label, onPress, href, color, hover, active }: { label: string; onPress?: () => void; href?: string; color: string; hover: string; active?: boolean }) {
  return (
    <MaybeLink href={href}>
      <Pressable onPress={onPress} role="link" aria-current={active ? 'page' : undefined} style={styles.navItem}>
        {(s) => <NavText label={label} color={color} hover={hover} on={!!active || !!(s as PressState).hovered} />}
      </Pressable>
    </MaybeLink>
  );
}

/**
 * `overlay` is the home-page header that floats over the 3D hero: no bottom divider. Other pages keep
 * the 1px line.
 */
export function SiteHeader({ overlay = false, active }: { overlay?: boolean; active?: 'services' }) {
  const { isDesktop, isMobile } = useLayout();
  const goTo = useSectionNav();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={[styles.header, { height: isDesktop ? 104 : 72 }, overlay ? styles.overlay : styles.divider]}>
      <Enter variant="fade">
        <Container style={styles.row}>
          {isDesktop ? (
            <>
              <View style={[styles.side, styles.nav]} role="navigation" aria-label="Primary">
                <NavItem label="Services" href="/services" color={colors.ink} hover={colors.bronze} active={active === 'services'} />
                {SECTIONS.map(([label, id]) => (
                  <NavItem key={id} label={label} onPress={() => goTo(id)} color={colors.ink} hover={colors.bronze} />
                ))}
              </View>
              <Link href="/" asChild>
                <Pressable accessibilityLabel="Glozia — home" role="link">
                  <Image source={brand.lockupBronze} style={{ width: 86, height: 60 }} contentFit="contain" alt="Glozia" />
                </Pressable>
              </Link>
              <View style={[styles.side, styles.right]}>
                <NavItem label={site.phoneDisplay} onPress={() => goTo('visit')} color={colors.ink} hover={colors.bronze} />
                <Button label="Book an appointment" href="/book" />
              </View>
            </>
          ) : (
            <>
              <Link href="/" asChild>
                <Pressable accessibilityLabel="Glozia — home" role="link">
                  <Image source={brand.lockupBronze} style={{ width: 66, height: 46 }} contentFit="contain" alt="Glozia" />
                </Pressable>
              </Link>
              <View style={styles.compactRight}>
                {!isMobile ? <Button label="Book" href="/book" height={44} /> : null}
                <Pressable
                  onPress={() => setMenuOpen(true)}
                  role="button"
                  accessibilityLabel="Open menu"
                  style={styles.iconButton}>
                  <MenuIcon color={colors.ink} />
                </Pressable>
              </View>
            </>
          )}
        </Container>
      </Enter>
      <MobileMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

function MobileMenu({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const goTo = useSectionNav();
  const insets = useSafeAreaInsets();

  const go = (fn: () => void) => {
    onClose();
    setTimeout(fn, 60);
  };

  const links: [string, () => void][] = [
    ['Services & prices', () => router.push('/services')],
    ...SECTIONS.map(([label, id]) => [label, () => goTo(id)] as [string, () => void]),
    ['Book an appointment', () => router.push('/book')],
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View style={[styles.menu, { paddingTop: insets.top, paddingBottom: insets.bottom + 32 }]}>
        <View style={styles.menuTop}>
          <Image source={brand.lockupBronze} style={{ width: 66, height: 46 }} contentFit="contain" alt="Glozia" />
          <Pressable onPress={onClose} role="button" accessibilityLabel="Close menu" style={styles.iconButton}>
            <CloseIcon color={colors.ink} />
          </Pressable>
        </View>
        <View role="navigation" style={styles.menuLinks}>
          {links.map(([label, action]) => (
            <Pressable key={label} onPress={() => go(action)} role="link" style={styles.menuLink}>
              {(s) => (
                <Serif size={38} lh={1.1} color={(s as PressState).hovered ? colors.bronze : colors.ink}>
                  {label}
                </Serif>
              )}
            </Pressable>
          ))}
        </View>
        <View style={styles.menuFoot}>
          <MaybeLink href={site.phoneHref}>
            <Pressable role="link">
              <Sans size={16}>Call or WhatsApp · {site.phoneDisplay}</Sans>
            </Pressable>
          </MaybeLink>
          <MaybeLink href={site.instagramUrl}>
            <Pressable role="link">
              <Sans size={16} color={colors.muted}>
                {site.instagramHandle}
              </Sans>
            </Pressable>
          </MaybeLink>
          <Sans size={14} color={colors.muted}>
            {hours.rows.map((r) => r.join(' · ')).join('\n')}
          </Sans>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    justifyContent: 'center',
    zIndex: 3,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.line },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  nav: { gap: 36 },
  right: { justifyContent: 'flex-end', gap: 32 },
  navItem: { paddingVertical: 6 },
  underline: { position: 'absolute', left: 0, right: 0, bottom: -5, height: 1, transformOrigin: 'left' },
  compactRight: { flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: -10 },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  menu: { flex: 1, backgroundColor: colors.cream, paddingHorizontal: 24 },
  menuTop: { height: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: -10 },
  menuLinks: { marginTop: 40, gap: 18 },
  menuLink: { alignSelf: 'flex-start', paddingVertical: 4 },
  menuFoot: { marginTop: 'auto', gap: 8, paddingTop: 24, borderTopWidth: 1, borderTopColor: colors.line },
});
