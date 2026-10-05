import { Image } from 'expo-image';
import { Link } from 'expo-router';
import Head from 'expo-router/head';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Button, MaybeLink, TextLink, type PressState } from '@/components/buttons';
import { Chat, Check } from '@/components/icons';
import { Container, Grid } from '@/components/layout';
import { Page } from '@/components/page';
import { Em, Eyebrow, Label, Sans, Serif } from '@/components/typography';
import { brand } from '@/constants/images';
import { formatClock, hours, nowInBengaluru, site, whatsappUrl } from '@/constants/site';
import { colors, sansFamily, webTransition } from '@/constants/theme';
import { findService, inr, type Gender } from '@/data/services';
import { useMinute } from '@/hooks/use-clock';
import { useLayout } from '@/hooks/use-layout';

const LINE = 'rgba(42,33,28,0.18)';

/** Popular services; prices are read from the studio's catalogue so they stay in sync. */
const POPULAR: { id: string; name: string; group: string; ref: [Gender, string, string]; fallback: number }[] = [
  { id: 'mcut', name: 'Men’s haircut', group: 'For him', ref: ['Male', 'Hair & Beard', 'Hair Cut'], fallback: 220 },
  { id: 'mbeard', name: 'Beard + haircut', group: 'For him', ref: ['Male', 'Hair & Beard', 'Beard + Haircut'], fallback: 300 },
  { id: 'wcut', name: 'Advance haircut', group: 'For her', ref: ['Female', 'Haircuts & Styling', 'Advance Hair Cut'], fallback: 999 },
  { id: 'colour', name: 'Global colour', group: 'For her', ref: ['Female', 'Hair Colour', 'Global Color'], fallback: 2500 },
  { id: 'hspa', name: 'Hydrating hair spa', group: 'For her', ref: ['Female', 'Hair Spa', 'Hydrating Hair Spa'], fallback: 1200 },
  { id: 'keratin', name: 'Pro-keratin treatment', group: 'For her', ref: ['Female', 'Hair Treatments', 'Pro-Keratin Treatment'], fallback: 4500 },
  { id: 'facial', name: 'Basic facial', group: 'Skin', ref: ['Female', 'Facials', 'Basic Facial'], fallback: 999 },
  { id: 'hydra', name: 'Hydra facial', group: 'Skin', ref: ['Female', 'Facials', 'Hydra Facial'], fallback: 2500 },
  { id: 'brow', name: 'Eyebrow threading', group: 'Skin', ref: ['Female', 'Threading', 'Eyebrow'], fallback: 50 },
  { id: 'aroma', name: 'Aroma bliss massage · 65 min', group: 'Ladies spa', ref: ['Female', 'Spa', 'Aroma Bliss Massage 65 min'], fallback: 1799 },
  { id: 'mani', name: 'Regular manicure', group: 'Hands & feet', ref: ['Female', 'Manicure', 'Regular Manicure'], fallback: 500 },
  { id: 'pedi', name: 'Regular pedicure', group: 'Hands & feet', ref: ['Female', 'Pedicure', 'Regular Pedicure'], fallback: 800 },
];

const SERVICES = POPULAR.map((s) => ({ ...s, price: findService(...s.ref)?.price ?? s.fallback }));

const STYLISTS = [
  { id: 'any', name: 'Any stylist', role: 'First available' },
  { id: 'sajan', name: 'Sajan', role: 'Hair stylist' },
  { id: 'salman', name: 'Salman', role: 'Hair & beard' },
  { id: 'arjun', name: 'Arjun', role: 'Hair stylist' },
];

/** Start times in minutes from midnight. */
const SLOTS = [540, 600, 660, 690, 750, 810, 870, 900, 990, 1050, 1110, 1170];

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

type Day = { key: string; dow: number; date: number; month: number; long: string };

/** The next seven days in Bengaluru, starting tomorrow. */
function upcomingDays(at: number): Day[] {
  const now = nowInBengaluru(at);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.UTC(now.year, now.month, now.date + i + 1));
    const dow = d.getUTCDay();
    return {
      key: d.toISOString().slice(0, 10),
      dow,
      date: d.getUTCDate(),
      month: d.getUTCMonth(),
      long: `${DAY_LONG[dow]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`,
    };
  });
}

function StepHeading({ n, title, aside }: { n: string; title: string; aside?: string }) {
  const { isMobile } = useLayout();
  return (
    <View style={styles.stepHead}>
      <Serif size={22} weight="regular" color={colors.bronze}>
        {n}
      </Serif>
      <Serif size={isMobile ? 28 : 34} weight="regular" heading={2} style={{ flexShrink: 1 }}>
        {title}
      </Serif>
      {aside && !isMobile ? (
        <Sans size={13} color={colors.muted} style={{ marginLeft: 'auto' }}>
          {aside}
        </Sans>
      ) : null}
    </View>
  );
}

function Option({
  selected,
  disabled,
  onPress,
  children,
  style,
  label,
  dark,
}: {
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  style?: object;
  label?: string;
  /** Selected options fill with ink instead of white. */
  dark?: boolean;
}) {
  return (
    <Pressable
      role="button"
      aria-pressed={selected}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={(s) => [
        styles.option,
        {
          borderColor: selected ? colors.ink : disabled ? 'rgba(42,33,28,0.08)' : (s as PressState).hovered ? colors.ink : LINE,
          backgroundColor: selected ? (dark ? colors.ink : colors.white) : 'transparent',
        },
        webTransition('border-color, background-color', 200),
        style,
      ]}>
      {children}
    </Pressable>
  );
}

function Field({ label, ...props }: TextInputProps & { label: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 8, flex: 1 }}>
      <Label>{label}</Label>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor="#9C8E80"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.field,
          { borderColor: focused ? colors.ink : 'rgba(42,33,28,0.25)' },
          props.multiline ? { height: 96, paddingTop: 14, textAlignVertical: 'top' } : { height: 52 },
        ]}
      />
    </View>
  );
}

export default function Book() {
  const { isMobile, isDesktop, gutter } = useLayout();
  const [picked, setPicked] = useState<string[]>([]);
  const [stylist, setStylist] = useState('any');
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [sent, setSent] = useState(false);

  // Dates depend on today's date, so they're computed in the browser rather than at build time.
  const minute = useMinute();
  const days = minute ? upcomingDays(minute * 60_000) : [];

  const chosen = SERVICES.filter((s) => picked.includes(s.id));
  const total = chosen.reduce((n, s) => n + s.price, 0);
  const day = days.find((d) => d.key === dayKey) ?? null;
  const opensAt = day ? hours.open(day.dow) : 0;
  const stylistName = STYLISTS.find((s) => s.id === stylist)?.name ?? 'Any stylist';
  const ready = chosen.length > 0 && !!day && time != null;
  const first = name.trim().split(/\s+/)[0];

  const hint = ready
    ? 'This opens WhatsApp with your request ready to send. We’ll reply to confirm.'
    : chosen.length === 0
      ? 'Choose at least one service to continue.'
      : !day
        ? 'Now pick a day that suits you.'
        : 'Last step — pick a time.';

  const message = () =>
    [
      'Hi Glozia, I’d like to book an appointment.',
      name.trim() ? `Name: ${name.trim()}` : null,
      `Services: ${chosen.map((s) => `${s.name} (${inr(s.price)})`).join(', ')}`,
      `Stylist: ${stylistName}`,
      day && time != null ? `When: ${day.long} at ${formatClock(time)}` : null,
      `Estimated total: ${inr(total)} (before GST)`,
      notes.trim() ? `Notes: ${notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n');

  const send = () => {
    if (!ready) return;
    Linking.openURL(whatsappUrl(message()));
    setSent(true);
  };

  const reset = () => {
    setSent(false);
    setPicked([]);
    setDayKey(null);
    setTime(null);
    setStylist('any');
  };

  const pickDay = (d: Day) => {
    setDayKey(d.key);
    if (time != null && time < hours.open(d.dow)) setTime(null);
  };

  const form = (
    <View style={{ gap: 56 }}>
      <View style={{ gap: 20 }}>
        <StepHeading n="01" title="Choose your services" aside="Select one or more" />
        <Grid columns={isDesktop ? 3 : isMobile ? 1 : 2} gap={12}>
          {SERVICES.map((s) => {
            const on = picked.includes(s.id);
            return (
              <Option
                key={s.id}
                selected={on}
                onPress={() => setPicked((p) => (on ? p.filter((x) => x !== s.id) : [...p, s.id]))}
                style={styles.serviceOption}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Serif size={21} lh={1.1} weight="regular">
                    {s.name}
                  </Serif>
                  <Sans size={13} color={colors.muted}>
                    {s.group} · {inr(s.price)}
                  </Sans>
                </View>
                <View style={[styles.tick, { borderColor: on ? colors.ink : LINE, backgroundColor: on ? colors.ink : 'transparent' }]}>
                  {on ? <Check size={14} color={colors.cream} /> : null}
                </View>
              </Option>
            );
          })}
        </Grid>
        <Sans size={13} color={colors.muted}>
          Looking for something else? Pick the closest service and add details in the notes — or{' '}
          <Link href="/services" style={{ color: colors.bronze, textDecorationLine: 'underline' }}>
            browse the full menu
          </Link>
          .
        </Sans>
      </View>

      <View style={{ gap: 20 }}>
        <StepHeading n="02" title="Choose a stylist" />
        <Grid columns={isMobile ? 2 : 4} gap={12}>
          {STYLISTS.map((s) => (
            <Option key={s.id} selected={stylist === s.id} onPress={() => setStylist(s.id)} style={styles.stylistOption}>
              <View style={styles.monogram}>
                <Serif size={24} lh={1} weight="regular" color={colors.gold}>
                  {s.id === 'any' ? '·' : s.name[0]}
                </Serif>
              </View>
              <Serif size={20} lh={1.1} weight="regular" align="center">
                {s.name}
              </Serif>
              <Sans size={11} tracking={0.16} upper color={colors.muted} align="center">
                {s.role}
              </Sans>
            </Option>
          ))}
        </Grid>
      </View>

      <View style={{ gap: 20 }}>
        <StepHeading n="03" title="Pick a date & time" />
        <ScrollView
          horizontal
          scrollEnabled={isMobile}
          showsHorizontalScrollIndicator={false}
          style={isMobile ? { marginHorizontal: -gutter } : null}
          contentContainerStyle={[{ gap: 10, minHeight: 88 }, isMobile ? { paddingHorizontal: gutter } : { flexGrow: 1 }]}>
          {days.map((d) => {
            const on = d.key === dayKey;
            const fg = on ? colors.cream : colors.ink;
            return (
              <Option
                key={d.key}
                dark
                selected={on}
                label={d.long}
                onPress={() => pickDay(d)}
                style={[styles.dayOption, isMobile ? { width: 72 } : { flex: 1 }]}>
                <Sans size={11} tracking={0.18} upper color={fg}>
                  {DAY_SHORT[d.dow]}
                </Sans>
                <Serif size={30} lh={1} weight="regular" color={fg}>
                  {d.date}
                </Serif>
                <Sans size={11} tracking={0.1} color={fg}>
                  {MONTHS[d.month].slice(0, 3)}
                </Sans>
              </Option>
            );
          })}
        </ScrollView>
        <Grid columns={isDesktop ? 6 : isMobile ? 3 : 4} gap={10}>
          {SLOTS.map((t) => {
            const closed = !!day && t < opensAt;
            const on = time === t;
            return (
              <Option
                key={t}
                dark
                selected={on}
                disabled={closed}
                label={closed ? `${formatClock(t)} — before opening on ${DAY_LONG[day!.dow]}s` : formatClock(t)}
                onPress={() => setTime(t)}
                style={styles.timeOption}>
                <Sans
                  size={14}
                  tracking={0.04}
                  color={on ? colors.cream : closed ? '#A79A8C' : colors.ink}
                  style={closed ? { textDecorationLine: 'line-through' } : null}>
                  {formatClock(t)}
                </Sans>
              </Option>
            );
          })}
        </Grid>
        <Sans size={13} color={colors.muted}>
          Open {hours.rows.map((r) => r.join(' ')).join(' · ')}.
        </Sans>
      </View>

      <View style={{ gap: 20 }}>
        <StepHeading n="04" title="Your details" />
        <Field label="Name" value={name} onChangeText={setName} placeholder="Your full name" autoComplete="name" />
        <Field
          label="Anything we should know? (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Hair length, allergies to products, a reference photo you’ll bring…"
          multiline
        />
      </View>
    </View>
  );

  const confirmation = (
    <View aria-live="polite" style={[styles.confirmed, { padding: isMobile ? 28 : 56 }]}>
      <View style={styles.checkCircle}>
        <Check size={28} color={colors.cream} stroke={1.6} />
      </View>
      <Serif size={isMobile ? 40 : 56} lh={1.05}>
        {first ? `Almost there, ${first}.` : 'Almost there.'}
      </Serif>
      <Sans size={17} lh={1.7} color={colors.body} style={{ maxWidth: 560 }}>
        We’ve opened WhatsApp with your request for {day?.long} at {time != null ? formatClock(time) : ''}. Press
        send and we’ll confirm your chair — please arrive five minutes early so there’s time for a cup of
        something warm.
      </Sans>
      <View style={[styles.confirmActions, isMobile && { flexDirection: 'column', alignItems: 'stretch' }]}>
        <Button label="Open WhatsApp again" onPress={send} icon={(c) => <Chat color={c} />} />
        <Button label="Book another" variant="line" onPress={reset} />
        <Button label="Back to home" variant="line" href="/" />
      </View>
    </View>
  );

  const summary = (
    <View style={[styles.summary, isDesktop && styles.summarySticky]} role="complementary" aria-label="Booking summary">
      <Eyebrow>Your appointment</Eyebrow>
      <View style={{ gap: 12 }}>
        {chosen.length === 0 ? (
          <Serif size={22} italic color={colors.muted}>
            No services chosen yet.
          </Serif>
        ) : (
          chosen.map((s) => (
            <View key={s.id} style={styles.summaryRow}>
              <Serif size={22} lh={1.2} weight="regular" style={{ flex: 1 }}>
                {s.name}
              </Serif>
              <Sans size={14}>{inr(s.price)}</Sans>
            </View>
          ))
        )}
      </View>
      <View style={styles.summaryFacts}>
        {[
          ['Stylist', stylistName],
          ['Date', day?.long ?? '—'],
          ['Time', time != null ? formatClock(time) : '—'],
        ].map(([k, v]) => (
          <View key={k} style={styles.summaryRow}>
            <Sans size={15} color={colors.muted}>
              {k}
            </Sans>
            <Sans size={15}>{v}</Sans>
          </View>
        ))}
      </View>
      <View style={[styles.summaryRow, { alignItems: 'baseline' }]}>
        <Sans size={12} tracking={0.22} upper style={{ flex: 1 }}>
          Estimated total{' '}
          <Sans size={12} tracking={0.04} color={colors.muted} style={{ textTransform: 'none' }}>
            (before GST)
          </Sans>
        </Sans>
        <Serif size={30} weight="regular">
          {total ? inr(total) : '—'}
        </Serif>
      </View>
      <Button
        label={sent ? 'Send on WhatsApp again' : 'Request on WhatsApp'}
        onPress={send}
        disabled={!ready}
        full
        icon={(c) => <Chat color={c} />}
      />
      <Sans size={13} color={colors.muted}>
        {hint}
      </Sans>
      <View style={styles.summaryNote}>
        <Chat color={colors.ink} />
        <Sans size={13} color={colors.muted} style={{ flex: 1 }}>
          Your booking is confirmed by a reply on WhatsApp, where reminders arrive too. Pay at the studio — your
          receipt lands on WhatsApp.
        </Sans>
      </View>
    </View>
  );

  return (
    <Page>
      <Head>
        <title>Book an appointment · Glozia Unisex Salon, Nagarbhavi</title>
        <meta
          name="description"
          content="Choose your services, stylist and time at Glozia in Nagarbhavi, Bengaluru, and send your booking request on WhatsApp."
        />
      </Head>

      <View style={[styles.header, { height: isMobile ? 72 : 88 }]}>
        <Container style={styles.headerRow}>
          <Link href="/" asChild>
            <Pressable accessibilityLabel="Glozia — home" role="link">
              <Image
                source={brand.lockupBronze}
                style={{ width: isMobile ? 66 : 77, height: isMobile ? 46 : 54 }}
                contentFit="contain"
                alt="Glozia"
              />
            </Pressable>
          </Link>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 40 }}>
            {!isMobile ? (
              <MaybeLink href={site.phoneHref}>
                <Pressable role="link">
                  <Sans size={14} color={colors.muted}>
                    Need help? Call or WhatsApp {site.phoneDisplay}
                  </Sans>
                </Pressable>
              </MaybeLink>
            ) : null}
            <TextLink label="Back to site" href="/" />
          </View>
        </Container>
      </View>

      <Container
        style={[
          { paddingTop: isMobile ? 40 : 64, paddingBottom: isMobile ? 72 : 96, gap: isMobile ? 48 : 80 },
          isDesktop && { flexDirection: 'row', alignItems: 'flex-start' },
        ]}>
        <View style={{ flex: isDesktop ? 1 : undefined, minWidth: 0, gap: 56 }}>
          <View style={{ gap: 18 }}>
            <Eyebrow size={isMobile ? 11 : 12}>Book an appointment</Eyebrow>
            <Serif size={isMobile ? 52 : 72} lh={1} heading={1}>
              Reserve your <Em>chair.</Em>
            </Serif>
            <Sans size={16} lh={1.7} color={colors.body}>
              Pick what you’d like, who you’d like and when — we’ll confirm on WhatsApp.
            </Sans>
          </View>
          {sent ? confirmation : form}
        </View>
        <View style={isDesktop ? { width: 420 } : null}>{summary}</View>
      </Container>
    </Page>
  );
}

const styles = StyleSheet.create({
  header: { borderBottomWidth: 1, borderBottomColor: colors.line, justifyContent: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepHead: { flexDirection: 'row', alignItems: 'baseline', gap: 16 },
  option: { borderWidth: 1, borderRadius: 2 },
  serviceOption: { minHeight: 84, paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 16 },
  tick: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stylistOption: { height: 150, padding: 18, alignItems: 'center', justifyContent: 'center', gap: 8 },
  monogram: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.espresso,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  dayOption: { height: 88, alignItems: 'center', justifyContent: 'center', gap: 2 },
  timeOption: { height: 48, alignItems: 'center', justifyContent: 'center' },
  field: {
    fontFamily: sansFamily('regular'),
    fontSize: 16,
    color: colors.ink,
    borderWidth: 1,
    backgroundColor: colors.paper,
    borderRadius: 2,
    paddingHorizontal: 16,
    outlineStyle: 'none',
  } as object,
  confirmed: { gap: 28, backgroundColor: colors.sand, borderRadius: 2, alignItems: 'flex-start' },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  summary: {
    padding: 36,
    gap: 24,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 2,
  },
  summarySticky: { position: 'sticky', top: 24 } as object,
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  summaryFacts: {
    gap: 12,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  summaryNote: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
