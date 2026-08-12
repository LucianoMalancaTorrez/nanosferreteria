'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { Banner } from '@/types';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminBannersPage() {
  const { token } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ titulo: '', subtitulo: '', imagenUrl: '', link: '', orden: '0', activo: true });

  const fetchBanners = () => {
    if (!token) return;
    api.get<Banner[]>('/api/admin/banners', token).then(setBanners).catch(() => {});
  };

  useEffect(() => { fetchBanners(); }, [token]);

  const handleCreate = async () => {
    try {
      await api.post('/api/admin/banners', { ...form, orden: Number(form.orden) }, token!);
      toast.success('Banner creado');
      setCreating(false);
      setForm({ titulo: '', subtitulo: '', imagenUrl: '', link: '', orden: '0', activo: true });
      fetchBanners();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este banner?')) return;
    try {
      await api.delete(`/api/admin/banners/${id}`, token!);
      toast.success('Banner eliminado');
      fetchBanners();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-navy-600">Banners</h2>
        <button onClick={() => setCreating(true)} className="btn-primary text-sm"><FiPlus className="mr-2" /> Nuevo Banner</button>
      </div>

      {creating && (
        <div className="card p-4 mb-6 space-y-3">
          <input type="text" value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} placeholder="Título" className="input-field text-sm" />
          <input type="text" value={form.subtitulo} onChange={(e) => setForm({...form, subtitulo: e.target.value})} placeholder="Subtítulo" className="input-field text-sm" />
          <input type="text" value={form.imagenUrl} onChange={(e) => setForm({...form, imagenUrl: e.target.value})} placeholder="URL de la imagen" className="input-field text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={form.link} onChange={(e) => setForm({...form, link: e.target.value})} placeholder="Link (ej: /catalogo)" className="input-field text-sm" />
            <input type="number" value={form.orden} onChange={(e) => setForm({...form, orden: e.target.value})} placeholder="Orden" className="input-field text-sm" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="btn-primary text-sm py-2"><FiCheck className="mr-1" /> Crear</button>
            <button onClick={() => setCreating(false)} className="btn-outline text-sm py-2"><FiX className="mr-1" /> Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {banners.map((b) => (
          <div key={b.id} className="card p-4 flex gap-4 items-center">
            <img src={getImageUrl(b.imagenUrl)} alt={b.titulo} className="w-32 h-20 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-bold text-navy-600">{b.titulo || '(Sin título)'}</p>
              <p className="text-sm text-slate-500">{b.subtitulo}</p>
              <p className="text-xs text-slate-400 mt-1">Orden: {b.orden} | Link: {b.link || '-'}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={b.activo ? 'badge-success' : 'badge-warning'}>{b.activo ? 'Activo' : 'Inactivo'}</span>
              <button onClick={() => handleDelete(b.id)} className="p-2 text-slate-400 hover:text-red-600"><FiTrash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
