'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiBox, FiGrid, FiUsers, FiArrowRight } from 'react-icons/fi';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { DashboardStats } from '@/types';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ totalProductos: 0, totalCategorias: 0, mayoristasPendientes: 0 });

  useEffect(() => {
    if (!token) return;
    api.get<DashboardStats>('/api/admin/dashboard/stats', token).then(setStats).catch(() => {});
  }, [token]);

  const cards = [
    { label: 'Productos', value: stats.totalProductos, icon: FiBox, color: 'bg-blue-500', link: '/admin/productos' },
    { label: 'Categorías', value: stats.totalCategorias, icon: FiGrid, color: 'bg-green-500', link: '/admin/categorias' },
    { label: 'Mayoristas Pendientes', value: stats.mayoristasPendientes, icon: FiUsers, color: 'bg-amber-500', link: '/admin/mayoristas' },
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-extrabold text-navy-600 mb-6">Bienvenido al Panel</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.link} className="card p-6 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="text-3xl font-extrabold text-navy-600 mt-1">{card.value}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center text-white`}>
                <card.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-primary-600 font-medium group-hover:gap-2 transition-all">
              Ver detalle <FiArrowRight className="ml-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-navy-600 mb-4">Accesos Rápidos</h3>
          <div className="space-y-3">
            <Link href="/admin/productos" className="block p-4 bg-slate-50 rounded-xl hover:bg-primary-50 transition-colors">
              <p className="font-semibold text-navy-600">📦 Cargar un producto nuevo</p>
              <p className="text-sm text-slate-500">Agregá un producto al catálogo</p>
            </Link>
            <Link href="/admin/banners" className="block p-4 bg-slate-50 rounded-xl hover:bg-primary-50 transition-colors">
              <p className="font-semibold text-navy-600">🖼️ Gestionar banners</p>
              <p className="text-sm text-slate-500">Cambiá las ofertas de la home</p>
            </Link>
            <Link href="/admin/catalogo-pdf" className="block p-4 bg-slate-50 rounded-xl hover:bg-primary-50 transition-colors">
              <p className="font-semibold text-navy-600">📄 Generar catálogo PDF</p>
              <p className="text-sm text-slate-500">Descargá la lista de precios actualizada</p>
            </Link>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-navy-600 mb-4">Información Útil</h3>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="font-semibold text-blue-700">💡 Tip</p>
              <p className="text-blue-600 mt-1">Para que un producto aparezca en la home, marcalo como &quot;Destacado&quot; al crearlo o editarlo.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="font-semibold text-green-700">🔒 Mayoristas</p>
              <p className="text-green-600 mt-1">Los mayoristas que se registren deben ser aprobados desde la sección &quot;Mayoristas&quot; antes de poder ver precios especiales.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
