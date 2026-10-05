import { MENU } from './menu';

export type Gender = 'Female' | 'Male';

export type Service = {
  name: string;
  price: number;
};

export type Category = {
  name: string;
  items: Service[];
  min: number;
  max: number;
};

function buildMenu(gender: Gender): Category[] {
  return MENU[gender].map(([name, rows]) => {
    const items = rows.map(([itemName, price]) => ({ name: itemName, price }));
    const prices = items.map((i) => i.price);
    return { name, items, min: Math.min(...prices), max: Math.max(...prices) };
  });
}

export const menu: Record<Gender, Category[]> = {
  Female: buildMenu('Female'),
  Male: buildMenu('Male'),
};

export const totalServices = [...menu.Female, ...menu.Male].reduce((n, c) => n + c.items.length, 0);

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

export const genderLabels: Record<Gender, string> = { Female: 'For her', Male: 'For him' };
export const genderParam: Record<Gender, string> = { Female: 'her', Male: 'him' };

export function genderFromParam(value: string | undefined): Gender | null {
  if (value === 'her') return 'Female';
  if (value === 'him') return 'Male';
  return null;
}
