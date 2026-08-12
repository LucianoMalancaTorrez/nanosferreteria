'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiBox, FiGrid, FiImage, FiUsers, FiFileText, FiFile, FiLogOut, FiMenu } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: FiHome },
  { href: '/admin/productos', label: 'Productos', icon: FiBox },
  { href: '/admin/categorias', label: 'Categorías', icon: FiGrid },
  { href: '/admin/banners', label: 'Banners', icon: FiImage },
  { href: '/admin/mayoristas', label: 'Mayoristas', icon: FiUsers },
  { href: '/admin/blog', label: 'Blog', icon: FiFileText },
  { href: '/admin/catalogo-pdf', label: 'Catálogo PDF', icon: FiFile },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    if (!isAuthenticated || user?.rol !== 'ADMIN') {
      router.push('/admin/login');
    }
  }, [isAuthenticated, user, pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!isAuthenticated || user?.rol !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-black text-lg">N</div>
            <div><h2 className="font-extrabold">Nano&apos;s</h2><p className="text-[10px] text-slate-400 tracking-widest uppercase">Admin Panel</p></div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {ADMIN_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === link.href
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}>
              <link.icon size={18} />{link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className="text-sm text-slate-400 mb-3 px-4">
            <p className="font-medium text-white">{user?.nombre}</p>
            <p className="text-xs">{user?.email}</p>
          </div>
          <button onClick={() => { logout(); router.push('/'); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-800 w-full transition-all">
            <FiLogOut size={18} />Cerrar Sesión
          </button>
          <Link href="/" className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-300 w-full mt-1 transition-all">
            ← Volver al sitio
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100"><FiMenu size={22} /></button>
          <h1 className="text-lg font-bold text-navy-600">{ADMIN_LINKS.find(l => l.href === pathname)?.label || 'Admin'}</h1>
          <div className="text-sm text-slate-500">Panel de Administración</div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
