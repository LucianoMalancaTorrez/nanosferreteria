'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiUser, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { CONTACT, getPhoneLink, getWhatsAppLink } from '@/lib/config';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/mayoristas', label: 'Mayoristas' },
  { href: '/cotizador', label: 'Cotizador' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const cartCount = useCart((s) => s.getItemCount());
  const { isAuthenticated, user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-navy-600 text-white text-sm py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href={getPhoneLink()} className="flex items-center gap-1 hover:text-primary-300 transition-colors">
              <FiPhone size={14} /> {CONTACT.phoneDisplay}
            </a>
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1 hover:text-green-400 transition-colors">
              <FaWhatsapp size={14} /> WhatsApp
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">{CONTACT.hours}</span>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <span className="text-primary-300">Hola, {user.nombre}</span>
                {user.rol === 'ADMIN' && (
                  <Link href="/admin" className="text-primary-300 hover:text-primary-200 underline">Panel Admin</Link>
                )}
                <button onClick={logout} className="hover:text-primary-300 transition-colors">Salir</button>
              </div>
            ) : (
              <Link href="/mayoristas" className="hover:text-primary-300 transition-colors flex items-center gap-1">
                <FiUser size={14} /> Mayoristas
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <Image src="/logo.png" alt="Nano's Ferretería" width={48} height={48} className="rounded-lg" priority />
              <div className="hidden sm:block">
                <h1 className="text-xl font-extrabold text-charcoal leading-tight">Nano&apos;s</h1>
                <p className="text-[10px] text-slate-500 -mt-0.5 tracking-widest uppercase">Ferretería y Sanitarios</p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos, marcas, categorías..."
                  className="input-field pl-12 pr-4 py-2.5"
                  id="search-desktop"
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)}
                      className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                      aria-label="Buscar">
                <FiSearch size={22} className="text-slate-700" />
              </button>

              <Link href="/carrito" className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                    aria-label="Carrito">
                <FiShoppingCart size={22} className="text-slate-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button onClick={() => setMobileOpen(!mobileOpen)}
                      className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                      aria-label="Menú">
                {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>

          {/* Nav - Desktop */}
          <nav className="hidden md:flex gap-1 mt-2 -mx-2">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden border-t border-slate-100 px-4 py-3 animate-slide-down">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="input-field"
                autoFocus
                id="search-mobile"
              />
            </form>
          </div>
        )}

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 animate-slide-down">
            <nav className="flex flex-col py-2 px-4">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="py-3 px-4 text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors">
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && user?.rol === 'ADMIN' && (
                <Link href="/admin" onClick={() => setMobileOpen(false)}
                      className="py-3 px-4 text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors">
                  Panel Admin
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
