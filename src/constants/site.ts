export const site = {
  name: 'Glozia',
  fullName: 'Glozia Unisex Salon & Ladies Spa',
  phoneDisplay: '+91 73378 76023',
  phoneHref: 'tel:+917337876023',
  whatsappNumber: '917337876023',
  instagramHandle: '@glozia_unisex_salon',
  instagramUrl: 'https://www.instagram.com/glozia_unisex_salon/',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Glozia+Unisex+Salon+and+ladies+Spa+Nagarbhavi',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Glozia+Unisex+Salon+and+ladies+Spa+Nagarbhavi&destination_place_id=ChIJu1QiTQU_rjsR5uzM3TJKhCQ',
  mapsEmbedUrl:
    'https://www.google.com/maps?q=Glozia+Unisex+Salon+and+ladies+Spa,+Mallathahalli+Lake+Road,+Nagarbhavi,+Bengaluru&output=embed',
  addressLines: ['Mallathahalli Lake Road, Nagarbhavi', 'Bengaluru, Karnataka 560056'],
  street: 'Mallathahalli Lake Road, Nagarbhavi',
  city: 'Bengaluru',
  region: 'Karnataka',
  postalCode: '560056',
  rating: '4.8',
  reviewCount: '106+',
} as const;

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Opening hours in Bengaluru time. Day 0 = Sunday. Minutes from midnight. */
export const hours = {
  open: (day: number) => (day === 5 ? 10 * 60 : 9 * 60),
  close: 20 * 60 + 30,
  rows: [
    ['Sat – Thu', '9:00 am – 8:30 pm'],
    ['Friday', '10:00 am – 8:30 pm'],
  ] as const,
};

export function formatClock(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** Current day and minute in India Standard Time (UTC+5:30, no daylight saving). */
export function nowInBengaluru(at = Date.now()) {
  const ist = new Date(at + 330 * 60 * 1000);
  return {
    day: ist.getUTCDay(),
    minutes: ist.getUTCHours() * 60 + ist.getUTCMinutes(),
    year: ist.getUTCFullYear(),
    month: ist.getUTCMonth(),
    date: ist.getUTCDate(),
  };
}

export type OpenStatus = { label: string; detail: string; open: boolean };

export function openStatus(at = Date.now()): OpenStatus {
  const { day, minutes } = nowInBengaluru(at);
  const opens = hours.open(day);
  if (minutes < opens) {
    return { open: false, label: 'Opens today', detail: `at ${formatClock(opens)}` };
  }
  if (minutes < hours.close) {
    return { open: true, label: 'Open today', detail: `Until ${formatClock(hours.close)}` };
  }
  const tomorrow = (day + 1) % 7;
  return { open: false, label: 'Closed now', detail: `Opens ${formatClock(hours.open(tomorrow))}` };
}
