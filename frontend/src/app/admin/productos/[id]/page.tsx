'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiSave, FiArrowLeft, FiUploadCloud, FiX, FiImage, FiTrash2 } from 'react-icons/fi';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { Categoria, Producto, ImagenProducto } from '@/types';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminProductoFormPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEdit = id && id !== 'nuevo';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [existingImages, setExistingImages] = useState<ImagenProducto[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [form, setForm] = useState({
    nombre: '', descripcion: '', categoriaId: '', precioMinorista: '',
    precioMayorista: '', cantidadMinimaMayorista: '10', stock: '0',
    sku: '', marca: '', activo: true, destacado: false,
  });

  useEffect(() => {
    api.get<Categoria[]>('/api/categorias?tree=false').then(setCategorias).catch(() => {});

    if (isEdit && token) {
      api.get<Producto>(`/api/admin/productos/${id}`, token).then((prod) => {
        setForm({
          nombre: prod.nombre, descripcion: prod.descripcion || '',
          categoriaId: String(prod.categoriaId), precioMinorista: String(prod.precioMinorista),
          precioMayorista: prod.precioMayorista ? String(prod.precioMayorista) : '',
          cantidadMinimaMayorista: String(prod.cantidadMinimaMayorista || 10),
          stock: String(prod.stock), sku: prod.sku || '', marca: prod.marca || '',
          activo: prod.activo, destacado: prod.destacado,
        });
        setExistingImages(prod.imagenes || []);
      }).catch(() => {
        // Fallback: fetch from list
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
            setExistingImages(prod.imagenes || []);
          }
        });
      });
    }
  }, [id, isEdit, token]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  const handleFilesSelected = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      toast.error('Solo se permiten archivos de imagen');
      return;
    }

    const previews = fileArray.map((f) => URL.createObjectURL(f));
    setNewImageFiles((prev) => [...prev, ...fileArray]);
    setNewImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imgId: number) => {
    if (!confirm('¿Eliminar esta imagen del producto?')) return;
    try {
      await api.delete(`/api/admin/productos/${id}/imagenes/${imgId}`, token!);
      setExistingImages((prev) => prev.filter((img) => img.id !== imgId));
      toast.success('Imagen eliminada');
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar imagen');
    }
  };

  const uploadImages = async (productId: number | string) => {
    if (newImageFiles.length === 0) return;
    setUploadingImages(true);
    try {
      const formData = new FormData();
      newImageFiles.forEach((file) => formData.append('files', file));
      await api.post(`/api/admin/productos/${productId}/imagenes`, formData, token!);
      toast.success(`${newImageFiles.length} imagen(es) subida(s)`);
    } catch (err: any) {
      toast.error(err.message || 'Error al subir imágenes');
    } finally {
      setUploadingImages(false);
    }
  };

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
        await uploadImages(id!);
        toast.success('Producto actualizado');
      } else {
        const created = await api.post<Producto>('/api/admin/productos', body, token!);
        await uploadImages(created.id);
        toast.success('Producto creado');
      }
      router.push('/admin/productos');
    } catch (err: any) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const totalImages = existingImages.length + newImageFiles.length;

  return (
    <div className="max-w-3xl animate-fade-in">
      <Link href="/admin/productos" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-6">
        <FiArrowLeft className="mr-1" /> Volver a productos
      </Link>

      <h2 className="text-2xl font-extrabold text-navy-600 mb-6">{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product data card */}
        <div className="card p-6 space-y-5">
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
        </div>

        {/* Images card */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-navy-600 text-lg flex items-center gap-2">
              <FiImage size={20} /> Imágenes del Producto
            </h3>
            <span className="text-xs text-slate-400">{totalImages} imagen{totalImages !== 1 ? 'es' : ''}</span>
          </div>

          {/* Existing images (edit mode) */}
          {existingImages.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">Imágenes actuales</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden border-2 border-slate-200 aspect-square">
                    <img src={getImageUrl(img.url)} alt={img.altText || 'Producto'}
                         className="w-full h-full object-cover" />
                    {img.principal && (
                      <span className="absolute top-1.5 left-1.5 bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Principal
                      </span>
                    )}
                    <button type="button" onClick={() => removeExistingImage(img.id)}
                            className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New images preview */}
          {newImagePreviews.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">Nuevas imágenes por subir</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {newImagePreviews.map((preview, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border-2 border-primary-300 border-dashed aspect-square bg-primary-50">
                    <img src={preview} alt={`Nueva imagen ${index + 1}`}
                         className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewImage(index)}
                            className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600">
                      <FiX size={14} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-[10px] truncate">{newImageFiles[index]?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drop zone / file selector */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFilesSelected(e.target.files);
                e.target.value = '';
              }}
            />
            <FiUploadCloud size={36} className={`mx-auto mb-3 ${dragActive ? 'text-primary-500' : 'text-slate-400'}`} />
            <p className="text-sm font-medium text-slate-700">
              {dragActive ? 'Soltá las imágenes acá' : 'Arrastrá imágenes acá o tocá para seleccionar'}
            </p>
            <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP — Desde tu PC o celular</p>
          </div>
        </div>

        {/* Submit button */}
        <button type="submit" disabled={loading || uploadingImages} className="btn-primary w-full sm:w-auto">
          <FiSave className="mr-2" />
          {loading || uploadingImages
            ? (uploadingImages ? 'Subiendo imágenes...' : 'Guardando...')
            : isEdit ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </form>
    </div>
  );
}
