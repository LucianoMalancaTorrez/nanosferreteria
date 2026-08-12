'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiArrowRight, FiTruck, FiShield, FiClock, FiStar, FiShoppingCart } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '@/lib/api';
import type { Banner, Producto, Categoria } from '@/types';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { getWhatsAppLink } from '@/lib/config';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const addItem = useCart((s) => s.addItem);

  useEffect(() => {
    api.get<Banner[]>('/api/banners').then(setBanners).catch(() => {});
    api.get<Producto[]>('/api/productos/destacados').then(setProductos).catch(() => {});
    api.get<Categoria[]>('/api/categorias?tree=true').then(setCategorias).catch(() => {});
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-navy-600 min-h-[400px] md:min-h-[500px]">
        {banners.length > 0 ? (
          <>
            <div className="absolute inset-0 transition-opacity duration-700"
                 style={{ backgroundImage: `url(${getImageUrl(banners[currentBanner]?.imagenUrl)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-navy-600/90 via-navy-600/60 to-transparent" />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
              <div className="max-w-lg">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight animate-slide-up">
                  {banners[currentBanner]?.titulo}
                </h2>
                <p className="text-xl text-slate-200 mt-4 animate-slide-up">{banners[currentBanner]?.subtitulo}</p>
                <div className="flex gap-3 mt-8 animate-slide-up">
                  <Link href={banners[currentBanner]?.link || '/catalogo'} className="btn-primary">
                    Ver Ofertas <FiArrowRight className="ml-2" />
                  </Link>
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                    <FaWhatsapp size={20} /> Consultanos
                  </a>
                </div>
              </div>
            </div>
            {/* Banner dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, i) => (
                <button key={i} onClick={() => setCurrentBanner(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentBanner ? 'bg-primary-500 w-8' : 'bg-white/50 hover:bg-white/80'}`}
                  aria-label={`Banner ${i + 1}`} />
              ))}
            </div>
          </>
        ) : (
          <div className="gradient-hero">
            <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Todo para tu obra<br />y tu hogar
              </h2>
              <p className="text-xl text-slate-200 mt-4">Herramientas, materiales y todo lo que necesitás</p>
              <Link href="/catalogo" className="btn-primary mt-8 inline-flex">
                Ver Catálogo <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-6 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FiTruck, text: 'Envíos a todo el país', sub: 'Consultar zona' },
              { icon: FiShield, text: 'Garantía oficial', sub: 'En todas las marcas' },
              { icon: FiClock, text: 'Atención personalizada', sub: 'Lun a Sáb' },
              { icon: FiStar, text: 'Precios mayoristas', sub: 'Registrate gratis' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <badge.icon size={24} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-navy-600">{badge.text}</p>
                  <p className="text-xs text-slate-500">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-navy-600">Nuestras Categorías</h2>
            <p className="text-slate-500 mt-2">Encontrá todo lo que necesitás para tu proyecto</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categorias.map((cat) => (
              <Link key={cat.id} href={`/catalogo?categoriaId=${cat.id}`}
                    className="card-hover group p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                  {cat.nombre.charAt(0)}
                </div>
                <h3 className="font-bold text-navy-600 group-hover:text-primary-600 transition-colors">{cat.nombre}</h3>
                <p className="text-xs text-slate-500 mt-1">{cat.subcategorias?.length || 0} subcategorías</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-navy-600">Productos Destacados</h2>
              <p className="text-slate-500 mt-1">Lo más vendido de nuestra ferretería</p>
            </div>
            <Link href="/catalogo" className="btn-outline text-sm hidden sm:inline-flex">
              Ver Todo <FiArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {productos.slice(0, 8).map((prod) => (
              <div key={prod.id} className="card-hover group overflow-hidden">
                <Link href={`/producto/${prod.slug}`}>
                  <div className="aspect-square bg-slate-50 relative overflow-hidden">
                    <img
                      src={getImageUrl(prod.imagenes?.[0]?.url)}
                      alt={prod.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {prod.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="badge-danger text-sm">Sin Stock</span>
                      </div>
                    )}
                    {prod.destacado && prod.stock > 0 && (
                      <span className="absolute top-3 left-3 badge bg-primary-500 text-white">Destacado</span>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <p className="text-xs text-primary-600 font-medium">{prod.categoriaNombre}</p>
                  <Link href={`/producto/${prod.slug}`}>
                    <h3 className="font-bold text-navy-600 mt-1 text-sm leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {prod.nombre}
                    </h3>
                  </Link>
                  <div className="mt-3">
                    <p className="text-xl font-extrabold text-navy-600">{formatCurrency(prod.precioMinorista)}</p>
                    {prod.marca && <p className="text-xs text-slate-500 mt-0.5">{prod.marca}</p>}
                  </div>
                  <button
                    onClick={() => { addItem(prod); toast.success('Agregado al pedido'); }}
                    disabled={prod.stock === 0}
                    className="btn-primary w-full mt-3 text-sm py-2.5 disabled:opacity-40">
                    <FiShoppingCart size={16} className="mr-2" />
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link href="/catalogo" className="btn-outline">Ver Todo el Catálogo</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}} />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">¿Sos mayorista?</h2>
          <p className="text-xl text-slate-200 mt-4 max-w-2xl mx-auto">
            Registrate gratis y accedé a precios especiales en todo nuestro catálogo. Descuentos exclusivos para compras por cantidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/mayoristas?tab=register" className="btn-primary bg-white text-navy-600 hover:bg-slate-100 shadow-xl">
              Registrarme como Mayorista
            </Link>
            <a href={getWhatsAppLink('Hola! Quiero información sobre precios mayoristas')} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <FaWhatsapp size={20} /> Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
         className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-whatsapp rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform duration-200 animate-scale-in"
         aria-label="WhatsApp">
        <FaWhatsapp size={28} className="text-white" />
      </a>
    </div>
  );
}
