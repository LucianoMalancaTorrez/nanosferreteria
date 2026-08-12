'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminBlogNuevoPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ titulo: '', contenido: '', imagenUrl: '', metaDescription: '', publicado: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/admin/blog', form, token!);
      toast.success('Artículo creado');
      router.push('/admin/blog');
    } catch (err: any) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl animate-fade-in">
      <Link href="/admin/blog" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-6">
        <FiArrowLeft className="mr-1" /> Volver al blog
      </Link>
      <h2 className="text-2xl font-extrabold text-navy-600 mb-6">Nuevo Artículo</h2>
      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Título *</label>
          <input type="text" value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} className="input-field" required />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Contenido *</label>
          <textarea value={form.contenido} onChange={(e) => setForm({...form, contenido: e.target.value})} className="input-field min-h-[300px] font-mono text-sm" required
                    placeholder="Escribí el contenido del artículo..." />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">URL de imagen</label>
          <input type="text" value={form.imagenUrl} onChange={(e) => setForm({...form, imagenUrl: e.target.value})} className="input-field" placeholder="https://..." />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Meta description (SEO)</label>
          <textarea value={form.metaDescription} onChange={(e) => setForm({...form, metaDescription: e.target.value})} className="input-field" maxLength={300} rows={2} />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.publicado} onChange={(e) => setForm({...form, publicado: e.target.checked})}
                 className="rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
          <span className="text-sm">Publicar ahora</span>
        </label>
        <button type="submit" disabled={loading} className="btn-primary">
          <FiSave className="mr-2" /> {loading ? 'Guardando...' : 'Crear Artículo'}
        </button>
      </form>
    </div>
  );
}
