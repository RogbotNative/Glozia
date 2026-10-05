import catalogue from '../../data/glowdesk-services.json';

export type Gender = 'Female' | 'Male';

export type Service = {
  name: string;
  price: number;
  durationMin: number;
};

export type Category = {
  name: string;
  items: Service[];
  min: number;
  max: number;
};

type Row = { gender: string; category: string; name: string; price: number; durationMin: number };

/** Menu order, matching the studio's printed menu. Unknown categories are appended at the end. */
const ORDER: Record<Gender, string[]> = {
  Female: [
    'Haircuts & Styling',
    'Hair Colour',
    'Hair Spa',
    'Hair Treatments',
    'Facials',
    'Clean-Up',
    'Threading',
    'Face Wax',
    'De-Tan & Bleach',
    'Waxing',
    'Spa',
    'Head Massage',
    'Back Massage',
    'Foot Massage',
    'Manicure',
    'Pedicure',
    'Nails',
    'Make-Up',
  ],
  Male: [
    'Hair & Beard',
    'Hair Colour',
    'Hair Spa',
    'Hair Treatments',
    'Facials',
    'Clean-Up',
    'De-Tan & Bleach',
    'Waxing',
    'Head Massage',
    'Foot Massage',
    'Manicure',
    'Pedicure',
  ],
};

const rows = catalogue as Row[];

function buildMenu(gender: Gender): Category[] {
  const groups = new Map<string, Service[]>();
  for (const row of rows) {
    if (row.gender !== gender) continue;
    const list = groups.get(row.category) ?? [];
    list.push({ name: row.name, price: row.price, durationMin: row.durationMin });
    groups.set(row.category, list);
  }
  const order = ORDER[gender];
  const names = [...groups.keys()].sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
  });
  return names.map((name) => {
    const items = [...(groups.get(name) ?? [])].sort((a, b) => a.price - b.price);
    const prices = items.map((i) => i.price);
    return { name, items, min: Math.min(...prices), max: Math.max(...prices) };
  });
}

export const menu: Record<Gender, Category[]> = {
  Female: buildMenu('Female'),
  Male: buildMenu('Male'),
};

export const totalServices = rows.length;

export function findService(gender: Gender, category: string, name: string) {
  return menu[gender].find((c) => c.name === category)?.items.find((i) => i.name === name);
}

/** ₹ with Indian digit grouping (1,00,000), independent of the device's Intl support. */
export function inr(n: number) {
  const s = String(Math.round(n));
  if (s.length <= 3) return `₹${s}`;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `₹${rest},${last3}`;
}

export function formatDuration(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

export const genderLabels: Record<Gender, string> = { Female: 'For her', Male: 'For him' };
export const genderParam: Record<Gender, string> = { Female: 'her', Male: 'him' };

export function genderFromParam(value: string | undefined): Gender | null {
  if (value === 'her') return 'Female';
  if (value === 'him') return 'Male';
  return null;
}
