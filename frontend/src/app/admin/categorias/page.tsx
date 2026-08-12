'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { Categoria } from '@/types';
import toast from 'react-hot-toast';

export default function AdminCategoriasPage() {
  const { token } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', categoriaPadreId: '' });
  const [creating, setCreating] = useState(false);

  const fetchCategorias = () => {
    api.get<Categoria[]>('/api/categorias?tree=false').then(setCategorias).catch(() => {});
  };

  useEffect(() => { fetchCategorias(); }, []);

  const handleCreate = async () => {
    try {
      await api.post('/api/admin/categorias', {
        nombre: form.nombre, descripcion: form.descripcion,
        categoriaPadreId: form.categoriaPadreId ? Number(form.categoriaPadreId) : null,
      }, token!);
      toast.success('Categoría creada');
      setCreating(false);
      setForm({ nombre: '', descripcion: '', categoriaPadreId: '' });
      fetchCategorias();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleUpdate = async (id: number) => {
    try {
      await api.put(`/api/admin/categorias/${id}`, {
        nombre: form.nombre, descripcion: form.descripcion,
        categoriaPadreId: form.categoriaPadreId ? Number(form.categoriaPadreId) : null,
      }, token!);
      toast.success('Categoría actualizada');
      setEditing(null);
      fetchCategorias();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await api.delete(`/api/admin/categorias/${id}`, token!);
      toast.success('Categoría eliminada');
      fetchCategorias();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-navy-600">Categorías</h2>
        <button onClick={() => { setCreating(true); setForm({ nombre: '', descripcion: '', categoriaPadreId: '' }); }}
                className="btn-primary text-sm"><FiPlus className="mr-2" /> Nueva</button>
      </div>

      {creating && (
        <div className="card p-4 mb-4 space-y-3">
          <input type="text" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})}
                 placeholder="Nombre de la categoría" className="input-field text-sm" />
          <input type="text" value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})}
                 placeholder="Descripción" className="input-field text-sm" />
          <select value={form.categoriaPadreId} onChange={(e) => setForm({...form, categoriaPadreId: e.target.value})} className="input-field text-sm">
            <option value="">Sin categoría padre (raíz)</option>
            {categorias.filter(c => !c.categoriaPadreId).map((c) => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
          </select>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="btn-primary text-sm py-2"><FiCheck className="mr-1" /> Crear</button>
            <button onClick={() => setCreating(false)} className="btn-outline text-sm py-2"><FiX className="mr-1" /> Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {categorias.map((cat) => (
          <div key={cat.id} className="card p-4">
            {editing === cat.id ? (
              <div className="space-y-3">
                <input type="text" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} className="input-field text-sm" />
                <input type="text" value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} className="input-field text-sm" />
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(cat.id)} className="btn-primary text-sm py-2"><FiCheck className="mr-1" /> Guardar</button>
                  <button onClick={() => setEditing(null)} className="btn-outline text-sm py-2">Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-navy-600">{cat.categoriaPadreNombre ? '↳ ' : ''}{cat.nombre}</p>
                  {cat.descripcion && <p className="text-xs text-slate-500 mt-0.5">{cat.descripcion}</p>}
                  {cat.categoriaPadreNombre && <p className="text-xs text-primary-500">Padre: {cat.categoriaPadreNombre}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(cat.id); setForm({ nombre: cat.nombre, descripcion: cat.descripcion || '', categoriaPadreId: cat.categoriaPadreId ? String(cat.categoriaPadreId) : '' }); }}
                          className="p-2 text-slate-400 hover:text-blue-600"><FiEdit2 size={16} /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 text-slate-400 hover:text-red-600"><FiTrash2 size={16} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
