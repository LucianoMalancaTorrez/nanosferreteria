'use client';

import { useEffect, useState } from 'react';
import { FiCheck, FiX, FiClock } from 'react-icons/fi';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { Usuario } from '@/types';
import toast from 'react-hot-toast';

export default function AdminMayoristasPage() {
  const { token } = useAuth();
  const [mayoristas, setMayoristas] = useState<Usuario[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending'>('all');

  const fetchMayoristas = () => {
    if (!token) return;
    const endpoint = filter === 'pending' ? '/api/admin/usuarios/mayoristas/pendientes' : '/api/admin/usuarios/mayoristas';
    api.get<Usuario[]>(endpoint, token).then(setMayoristas).catch(() => {});
  };

  useEffect(() => { fetchMayoristas(); }, [token, filter]);

  const handleAprobar = async (id: number) => {
    try {
      await api.put(`/api/admin/usuarios/${id}/aprobar`, {}, token!);
      toast.success('Mayorista aprobado');
      fetchMayoristas();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleRechazar = async (id: number) => {
    if (!confirm('¿Rechazar este mayorista?')) return;
    try {
      await api.put(`/api/admin/usuarios/${id}/rechazar`, {}, token!);
      toast.success('Mayorista rechazado');
      fetchMayoristas();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex gap-2 mb-6">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>Todos</button>
        <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'pending' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
          <FiClock className="inline mr-1" /> Pendientes
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Nombre</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Empresa</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">CUIT</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Email</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600">Estado</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mayoristas.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-600">{m.nombre} {m.apellido}</p>
                    <p className="text-xs text-slate-400">{m.telefono}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{m.empresa || '-'}</td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{m.cuit || '-'}</td>
                  <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">{m.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={m.aprobado ? 'badge-success' : 'badge-warning'}>{m.aprobado ? 'Aprobado' : 'Pendiente'}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!m.aprobado ? (
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleAprobar(m.id)} className="p-2 text-green-500 hover:text-green-700 transition-colors" title="Aprobar">
                          <FiCheck size={18} />
                        </button>
                        <button onClick={() => handleRechazar(m.id)} className="p-2 text-red-400 hover:text-red-600 transition-colors" title="Rechazar">
                          <FiX size={18} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleRechazar(m.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Revocar aprobación">
                        <FiX size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {mayoristas.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <p>{filter === 'pending' ? 'No hay mayoristas pendientes de aprobación' : 'No hay mayoristas registrados'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
