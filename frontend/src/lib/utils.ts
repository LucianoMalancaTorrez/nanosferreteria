export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function getProductWhatsAppMessage(nombre: string, cantidad: number, precio: number): string {
  return `¡Hola! Me interesa el siguiente producto:\n\n📦 *${nombre}*\n📊 Cantidad: ${cantidad}\n💰 Precio unitario: ${formatCurrency(precio)}\n💵 Total: ${formatCurrency(precio * cantidad)}\n\n¿Está disponible?`;
}

export function getCartWhatsAppMessage(items: Array<{ nombre: string; cantidad: number; precio: number }>): string {
  let message = '¡Hola! Quisiera hacer el siguiente pedido:\n\n';
  let total = 0;

  items.forEach((item, i) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    message += `${i + 1}. *${item.nombre}*\n   Cant: ${item.cantidad} × ${formatCurrency(item.precio)} = ${formatCurrency(subtotal)}\n\n`;
  });

  message += `──────────────\n💵 *TOTAL: ${formatCurrency(total)}*\n\n¿Podrían confirmar disponibilidad y forma de pago? ¡Gracias!`;
  return message;
}

export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getImageUrl(url: string): string {
  if (!url) return 'https://placehold.co/600x600/1E3A5F/F97316?text=Sin+Imagen';
  if (url.startsWith('http')) return url;
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  return `${base}${url}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
