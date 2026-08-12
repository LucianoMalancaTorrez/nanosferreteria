/** Datos de contacto y configuración pública de Nano's Ferretería */
export const SITE = {
  name: "Nano's Ferretería",
  shortName: 'Nano\'s',
  tagline: 'Ferretería y Sanitarios',
  description:
    'Ferretería en Mendoza. Herramientas, materiales de construcción, sanitarios, electricidad, pinturas y más. Precios minoristas y mayoristas.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const;

export const CONTACT = {
  address: 'Los Pescadores 871, Mendoza, Argentina',
  phone: '2615414663',
  phoneDisplay: '(0261) 541-4663',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5492615414663',
  hours: 'Lunes a Sábados: 10:00 a 13:00',
  email: 'nanosferreteriamza@gmail.com',
} as const;

export const SOCIAL = {
  facebook: 'https://www.facebook.com/share/194vs8BgVb/',
  instagram: 'https://www.instagram.com/nanosferreteriamza/',
} as const;

export const MAPS = {
  embedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.452!2d-68.845!3d-32.890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e0c0%3A0x0!2sLos+Pescadores+871%2C+M5500+Mendoza!5e0!3m2!1ses!2sar!4v1',
  linkUrl: 'https://www.google.com/maps/search/?api=1&query=Los+Pescadores+871+Mendoza+Argentina',
  lat: -32.890,
  lng: -68.845,
} as const;

export function getWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function getPhoneLink(): string {
  return `tel:+54${CONTACT.phone}`;
}
