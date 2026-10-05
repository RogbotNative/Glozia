import { photos } from './images';

export type ShowcaseItem = {
  name: string;
  price: string;
  desc: string;
  img: number;
  alt: string;
  link: { for: 'her' | 'him'; cat: string };
};

/** Home-page service categories. Prices are the lowest on the studio's menu. */
export const showcase: ShowcaseItem[] = [
  {
    name: 'Hair',
    price: 'Haircuts from ₹220',
    desc: 'cuts, beard work and styling for men and women.',
    img: photos.cardHair,
    alt: "A stylist cutting a man's hair with scissors",
    link: { for: 'him', cat: 'Hair & Beard' },
  },
  {
    name: 'Colour & Keratin',
    price: 'Global colour from ₹1,500',
    desc: 'global colour, highlights, keratin, nanoplastia and smoothening.',
    img: photos.hero,
    alt: "A stylist pinning a client's hair into soft sculpted curls",
    link: { for: 'her', cat: 'Hair Colour' },
  },
  {
    name: 'Skin',
    price: 'Facials from ₹999',
    desc: 'facials, clean-ups, acne care, de-tan and threading.',
    img: photos.cardSkin,
    alt: "A therapist brushing a clay mask onto a client's face",
    link: { for: 'her', cat: 'Facials' },
  },
  {
    name: 'Ladies Spa',
    price: 'Massages from ₹600',
    desc: 'aroma and deep-tissue massages, polishing and Glozia’s signature rituals.',
    img: photos.cardSpa,
    alt: 'Warm oil being poured for a back massage',
    link: { for: 'her', cat: 'Spa' },
  },
  {
    name: 'Hands & Feet',
    price: 'Manicures from ₹300',
    desc: 'manicures, pedicures, gel polish and nail extensions.',
    img: photos.cardHands,
    alt: 'Manicured nails in soft neutral and glitter shades',
    link: { for: 'her', cat: 'Manicure' },
  },
  {
    name: 'Bridal',
    price: 'Bridal make-up ₹10,000',
    desc: 'bridal hair and make-up, the O3 bridal facial and saree draping.',
    img: photos.bridal,
    alt: "Close-up of a bride's make-up being finished",
    link: { for: 'her', cat: 'Make-Up' },
  },
];

export function servicesHref(link: ShowcaseItem['link']) {
  return `/services?for=${link.for}&cat=${encodeURIComponent(link.cat)}`;
}

export const marqueeWords = [
  'Haircuts',
  'Global colour',
  'Keratin',
  'Hair spa',
  'Facials',
  'Threading',
  'Ladies spa',
  'Manicure & pedicure',
  'Nail extensions',
  'Bridal',
];

export type TeamMember = { id: string; name: string; role: string; initial?: string };

/** Team cards show placeholder initials (the crown when there's none) until the studio's own portraits exist. */
export const team: TeamMember[] = [
  { id: 'sajan', name: 'Sajan', role: 'Hair stylist', initial: 'S' },
  { id: 'salman', name: 'Salman', role: 'Hair & beard', initial: 'S' },
  { id: 'arjun', name: 'Arjun', role: 'Hair stylist', initial: 'A' },
  { id: 'spa', name: 'Spa team', role: 'Ladies spa' },
];

export const gallery = [
  { img: photos.galInterior, alt: 'A bright salon interior with round mirrors' },
  { img: photos.galMen, alt: 'A stylist blow-drying a man’s hair' },
  { img: photos.galWash, alt: 'A client having her hair washed at the basin' },
  { img: photos.galFacial, alt: 'A cream mask being applied during a facial' },
  { img: photos.galNails, alt: 'Glossy dark and tortoiseshell nail art' },
  { img: photos.menuHero, alt: 'A smiling stylist blow-drying a client’s hair' },
  { img: photos.heroDetail, alt: 'Scissors, comb and grooming products on wood' },
  { img: photos.cardHands, alt: 'Manicured nails in soft neutral shades' },
  { img: photos.chairLights, alt: 'A salon chair under warm pendant lights' },
  { img: photos.menuSpa, alt: 'Warm stones laid along a back during a spa treatment' },
];

export const reviews = [
  {
    quote:
      'Had a great experience at the salon. Great ambience, warm service, and attention to detail',
    name: 'Arpitha Bollalli',
  },
  { quote: 'Very professional and skilled hair stylist Sajan', name: 'Prashantha MP' },
  {
    quote: 'Wonderful experience friendly team and beautiful results highly recommend',
    name: 'Muraleedharan',
  },
];
