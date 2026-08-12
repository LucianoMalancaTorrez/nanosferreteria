'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { Producto, PageResponse } from '@/types';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminProductosPage() {
  const { token } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProductos = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const endpoint = search ? `/api/productos/buscar?q=${encodeURIComponent(search)}&page=${page}&size=15` : `/api/productos?page=${page}&size=15`;
      const data = await api.get<PageResponse<Producto>>(endpoint, token);
      setProductos(data.content);
      setTotalPages(data.totalPages);
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProductos(); }, [token, page, search]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await api.delete(`/api/admin/productos/${id}`, token!);
      toast.success('Producto eliminado');
      fetchProductos();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                 placeholder="Buscar productos..." className="input-field pl-10 text-sm py-2.5" />
        </div>
        <Link href="/admin/productos/nuevo" className="btn-primary text-sm"><FiPlus className="mr-2" /> Nuevo Producto</Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Producto</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Categoría</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Precio Min.</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Precio May.</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600">Stock</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600">Estado</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={getImageUrl(p.imagenes?.[0]?.url)} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-navy-600 line-clamp-1">{p.nombre}</p>
                        <p className="text-xs text-slate-400">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{p.categoriaNombre}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(p.precioMinorista)}</td>
                  <td className="px-4 py-3 text-right font-medium hidden lg:table-cell">{p.precioMayorista ? formatCurrency(p.precioMayorista) : '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={p.stock > 0 ? 'badge-success' : 'badge-danger'}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={p.activo ? 'badge-success' : 'badge-warning'}>{p.activo ? 'Activo' : 'Inactivo'}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/productos/${p.id}`} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><FiEdit2 size={16} /></Link>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><FiTrash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-slate-100">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium ${page === i ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
