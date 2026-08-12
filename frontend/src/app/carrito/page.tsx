'use client';

import Link from 'next/link';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '@/hooks/useCart';
import { formatCurrency, getImageUrl, getWhatsAppUrl, getCartWhatsAppMessage } from '@/lib/utils';
import { CONTACT } from '@/lib/config';

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCart();

  const whatsappMsg = getCartWhatsAppMessage(
    items.map((item) => ({
      nombre: item.producto.nombre,
      cantidad: item.cantidad,
      precio: item.producto.precioMinorista,
    }))
  );
  const whatsappUrl = getWhatsAppUrl(CONTACT.whatsapp, whatsappMsg);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <FiShoppingBag size={64} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-400">Tu lista de pedido está vacía</h2>
        <p className="text-slate-400 mt-2">¡Explorá nuestro catálogo y agregá productos!</p>
        <Link href="/catalogo" className="btn-primary mt-6 inline-flex">Ver Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-navy-600 mb-8">Tu Lista de Pedido</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.producto.id} className="card p-4 flex gap-4">
              <Link href={`/producto/${item.producto.slug}`} className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                <img src={getImageUrl(item.producto.imagenes?.[0]?.url)} alt={item.producto.nombre}
                     className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/producto/${item.producto.slug}`}>
                  <h3 className="font-bold text-navy-600 text-sm line-clamp-1 hover:text-primary-600 transition-colors">{item.producto.nombre}</h3>
                </Link>
                <p className="text-xs text-slate-500 mt-0.5">{item.producto.categoriaNombre} • {item.producto.marca}</p>
                <p className="text-lg font-extrabold text-navy-600 mt-2">{formatCurrency(item.producto.precioMinorista)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.producto.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <FiTrash2 size={18} />
                </button>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                          className="p-1.5 hover:bg-slate-50"><FiMinus size={14} /></button>
                  <span className="px-3 text-sm font-bold">{item.cantidad}</span>
                  <button onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                          className="p-1.5 hover:bg-slate-50"><FiPlus size={14} /></button>
                </div>
                <p className="text-sm font-bold text-primary-600">{formatCurrency(item.producto.precioMinorista * item.cantidad)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-28">
            <h2 className="font-bold text-navy-600 text-lg mb-4">Resumen del Pedido</h2>
            <div className="space-y-3 text-sm">
              {items.map((item) => (
                <div key={item.producto.id} className="flex justify-between text-slate-600">
                  <span className="truncate mr-2">{item.producto.nombre} x{item.cantidad}</span>
                  <span className="font-medium shrink-0">{formatCurrency(item.producto.precioMinorista * item.cantidad)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between items-center">
              <span className="font-bold text-navy-600 text-lg">Total</span>
              <span className="text-2xl font-extrabold text-navy-600">{formatCurrency(getTotal())}</span>
            </div>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full mt-6">
              <FaWhatsapp size={22} /> Enviar Pedido por WhatsApp
            </a>

            <p className="text-xs text-slate-400 text-center mt-3">
              Se abrirá WhatsApp con el detalle de tu pedido
            </p>

            <button onClick={clearCart} className="w-full mt-4 text-sm text-red-500 hover:text-red-600 py-2 transition-colors">
              Vaciar lista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
