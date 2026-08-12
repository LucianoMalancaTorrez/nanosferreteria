'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { Categoria } from '@/types';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminProductoFormPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEdit = id && id !== 'nuevo';

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: '', descripcion: '', categoriaId: '', precioMinorista: '',
    precioMayorista: '', cantidadMinimaMayorista: '10', stock: '0',
    sku: '', marca: '', activo: true, destacado: false,
  });

  useEffect(() => {
    api.get<Categoria[]>('/api/categorias?tree=false').then(setCategorias).catch(() => {});

    if (isEdit && token) {
      // Load product by fetching all and finding by id (simple approach)
      api.get<any>(`/api/productos?page=0&size=1000`, token).then((data) => {
        const prod = data.content.find((p: any) => p.id === Number(id));
        if (prod) {
          setForm({
            nombre: prod.nombre, descripcion: prod.descripcion || '',
            categoriaId: String(prod.categoriaId), precioMinorista: String(prod.precioMinorista),
            precioMayorista: prod.precioMayorista ? String(prod.precioMayorista) : '',
            cantidadMinimaMayorista: String(prod.cantidadMinimaMayorista || 10),
            stock: String(prod.stock), sku: prod.sku || '', marca: prod.marca || '',
            activo: prod.activo, destacado: prod.destacado,
          });
        }
      });
    }
  }, [id, isEdit, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      ...form,
      categoriaId: Number(form.categoriaId),
      precioMinorista: Number(form.precioMinorista),
      precioMayorista: form.precioMayorista ? Number(form.precioMayorista) : null,
      cantidadMinimaMayorista: Number(form.cantidadMinimaMayorista),
      stock: Number(form.stock),
    };

    try {
      if (isEdit) {
        await api.put(`/api/admin/productos/${id}`, body, token!);
        toast.success('Producto actualizado');
      } else {
        await api.post('/api/admin/productos', body, token!);
        toast.success('Producto creado');
      }
      router.push('/admin/productos');
    } catch (err: any) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl animate-fade-in">
      <Link href="/admin/productos" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-6">
        <FiArrowLeft className="mr-1" /> Volver a productos
      </Link>

      <h2 className="text-2xl font-extrabold text-navy-600 mb-6">{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Nombre *</label>
          <input type="text" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} className="input-field" required />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Descripción</label>
          <textarea value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} className="input-field min-h-[100px]" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Categoría *</label>
            <select value={form.categoriaId} onChange={(e) => setForm({...form, categoriaId: e.target.value})} className="input-field" required>
              <option value="">Seleccionar...</option>
              {categorias.map((c) => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Marca</label>
            <input type="text" value={form.marca} onChange={(e) => setForm({...form, marca: e.target.value})} className="input-field" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Precio Minorista *</label>
            <input type="number" step="0.01" value={form.precioMinorista} onChange={(e) => setForm({...form, precioMinorista: e.target.value})} className="input-field" required />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Precio Mayorista</label>
            <input type="number" step="0.01" value={form.precioMayorista} onChange={(e) => setForm({...form, precioMayorista: e.target.value})} className="input-field" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Cant. Mín. Mayorista</label>
            <input type="number" value={form.cantidadMinimaMayorista} onChange={(e) => setForm({...form, cantidadMinimaMayorista: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Stock</label>
            <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">SKU</label>
            <input type="text" value={form.sku} onChange={(e) => setForm({...form, sku: e.target.value})} className="input-field" />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.activo} onChange={(e) => setForm({...form, activo: e.target.checked})}
                   className="rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
            <span className="text-sm">Activo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.destacado} onChange={(e) => setForm({...form, destacado: e.target.checked})}
                   className="rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
            <span className="text-sm">Destacado (aparece en la home)</span>
          </label>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          <FiSave className="mr-2" /> {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear Producto'}
        </button>
      </form>
    </div>
  );
}
