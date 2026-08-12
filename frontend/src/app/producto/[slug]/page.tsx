'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiShoppingCart, FiMinus, FiPlus, FiPackage, FiCheck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '@/lib/api';
import type { Producto } from '@/types';
import { formatCurrency, getImageUrl, getWhatsAppUrl, getProductWhatsAppMessage } from '@/lib/utils';
import { CONTACT } from '@/lib/config';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function ProductoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const addItem = useCart((s) => s.addItem);
  const { isAuthenticated, user } = useAuth();
  const isMayorista = isAuthenticated && (user?.rol === 'MAYORISTA' || user?.rol === 'ADMIN');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get<Producto>(`/api/productos/${slug}`)
      .then((data) => { setProducto(data); setSelectedImage(0); })
      .catch(() => {})
      .finally(() => setLoading(false));

    api.get<Producto[]>(`/api/productos/${slug}/relacionados?limit=4`)
      .then(setRelacionados).catch(() => {});
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-slate-200 rounded-2xl" />
          <div><div className="h-8 bg-slate-200 rounded w-3/4 mb-4" /><div className="h-12 bg-slate-200 rounded w-1/2" /></div>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-400">Producto no encontrado</h2>
        <Link href="/catalogo" className="btn-primary mt-6 inline-flex">Volver al Catálogo</Link>
      </div>
    );
  }

  const whatsappMsg = getProductWhatsAppMessage(producto.nombre, cantidad, producto.precioMinorista);
  const whatsappUrl = getWhatsAppUrl(CONTACT.whatsapp, whatsappMsg);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href="/catalogo" className="hover:text-primary-600">Catálogo</Link>
        <span className="mx-2">/</span>
        <Link href={`/catalogo?categoriaId=${producto.categoriaId}`} className="hover:text-primary-600">{producto.categoriaNombre}</Link>
        <span className="mx-2">/</span>
        <span className="text-navy-600 font-medium">{producto.nombre}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
            <img src={getImageUrl(producto.imagenes?.[selectedImage]?.url)} alt={producto.nombre}
                 className="w-full h-full object-cover" />
          </div>
          {producto.imagenes.length > 1 && (
            <div className="flex gap-3 mt-4">
              {producto.imagenes.map((img, i) => (
                <button key={img.id} onClick={() => setSelectedImage(i)}
                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                          i === selectedImage ? 'border-primary-500 shadow-md' : 'border-slate-200 hover:border-slate-300'
                        }`}>
                  <img src={getImageUrl(img.url)} alt={img.altText} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-primary-600 font-medium">{producto.categoriaNombre}</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-navy-600 mt-1">{producto.nombre}</h1>
            </div>
            {producto.sku && <span className="badge-info">SKU: {producto.sku}</span>}
          </div>

          {producto.marca && <p className="text-slate-500 mt-2">Marca: <span className="font-semibold">{producto.marca}</span></p>}

          {/* Price */}
          <div className="mt-6 p-5 bg-slate-50 rounded-2xl">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-navy-600">{formatCurrency(producto.precioMinorista)}</span>
              <span className="text-sm text-slate-500">precio minorista</span>
            </div>
            {isMayorista && producto.precioMayorista ? (
              <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-700 font-semibold">Precio mayorista:</p>
                <span className="text-2xl font-extrabold text-green-700">{formatCurrency(producto.precioMayorista)}</span>
                <p className="text-xs text-green-600 mt-1">A partir de {producto.cantidadMinimaMayorista} unidades</p>
              </div>
            ) : producto.precioMayorista && !isMayorista ? (
              <Link href="/mayoristas" className="mt-3 block p-3 bg-primary-50 rounded-xl border border-primary-200 text-sm text-primary-700 hover:bg-primary-100 transition-colors">
                🔒 Iniciá sesión como mayorista para ver precios especiales
              </Link>
            ) : null}
          </div>

          {/* Stock */}
          <div className="mt-4 flex items-center gap-2">
            {producto.stock > 0 ? (
              <><FiCheck className="text-green-500" /><span className="text-sm text-green-600 font-medium">{producto.stock} unidades disponibles</span></>
            ) : (
              <><FiPackage className="text-red-500" /><span className="text-sm text-red-600 font-medium">Sin stock</span></>
            )}
          </div>

          {/* Quantity + Actions */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700">Cantidad:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                        className="p-3 hover:bg-slate-50 transition-colors"><FiMinus size={16} /></button>
                <span className="px-5 font-bold text-navy-600 min-w-[3rem] text-center">{cantidad}</span>
                <button onClick={() => setCantidad(cantidad + 1)}
                        className="p-3 hover:bg-slate-50 transition-colors"><FiPlus size={16} /></button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => { addItem(producto, cantidad); toast.success('Agregado al pedido'); }}
                      disabled={producto.stock === 0}
                      className="btn-primary flex-1 disabled:opacity-40">
                <FiShoppingCart size={18} className="mr-2" /> Agregar al Pedido
              </button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp flex-1">
                <FaWhatsapp size={20} /> Pedir por WhatsApp
              </a>
            </div>
          </div>

          {/* Description */}
          {producto.descripcion && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h2 className="font-bold text-navy-600 text-lg mb-3">Descripción</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{producto.descripcion}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-navy-600 mb-6">Productos Relacionados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relacionados.map((prod) => (
              <Link key={prod.id} href={`/producto/${prod.slug}`} className="card-hover group overflow-hidden">
                <div className="aspect-square bg-slate-50 overflow-hidden">
                  <img src={getImageUrl(prod.imagenes?.[0]?.url)} alt={prod.nombre}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-navy-600 text-sm line-clamp-2 group-hover:text-primary-600 transition-colors">{prod.nombre}</h3>
                  <p className="text-lg font-extrabold text-navy-600 mt-2">{formatCurrency(prod.precioMinorista)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
