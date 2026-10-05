import data from '../../data/shop-routines.json';

import { inr } from './services';

export type BottleShape = 'shampoo' | 'masque' | 'serum' | 'oil';

export type Product = { range: string; type: string; price: number; shape: BottleShape };

export type Routine = {
  label: string;
  title: string;
  tint: string;
  description: string;
  pairsWith: string[];
  products: Product[];
  total: number;
};

/** Take-home routines for the Shop section. Static retail prices in ₹, before GST. */
export const shop = data as { brand: string; routines: Routine[]; alsoOnShelf: string };

/** "Hi Glozia, I’d like the after colour routine: Vitamino Color shampoo, Vitamino Color masque." */
export function routineMessage(routine: Routine) {
  const items = routine.products.map((p) => `${p.range} ${p.type.toLowerCase()}`).join(', ');
  return `Hi Glozia, I’d like the ${routine.label.toLowerCase()} routine: ${items}.`;
}

export function routineTotal(routine: Routine) {
  return inr(routine.products.reduce((n, p) => n + p.price, 0));
}
