'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiShoppingCart, FiFilter, FiX, FiGrid, FiList } from 'react-icons/fi';
import api from '@/lib/api';
import type { Producto, Categoria, PageResponse } from '@/types';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

export default function CatalogoPage() {
  const searchParams = useSearchParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const addItem = useCart((s) => s.addItem);

  const [filters, setFilters] = useState({
    categoriaId: searchParams.get('categoriaId') || '',
    marca: searchParams.get('marca') || '',
    precioMin: '',
    precioMax: '',
    disponible: '',
    q: searchParams.get('q') || '',
    page: 0,
    sort: 'recientes',
  });

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = '/api/productos';
      const params = new URLSearchParams();

      if (filters.q) {
        endpoint = '/api/productos/buscar';
        params.set('q', filters.q);
      } else {
        if (filters.categoriaId) params.set('categoriaId', filters.categoriaId);
        if (filters.marca) params.set('marca', filters.marca);
        if (filters.precioMin) params.set('precioMin', filters.precioMin);
        if (filters.precioMax) params.set('precioMax', filters.precioMax);
        if (filters.disponible) params.set('disponible', filters.disponible);
        if (filters.sort) params.set('sort', filters.sort);
      }

      params.set('page', String(filters.page));
      params.set('size', '12');

      const data = await api.get<PageResponse<Producto>>(`${endpoint}?${params}`);
      setProductos(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  useEffect(() => {
    api.get<Categoria[]>('/api/categorias?tree=true').then(setCategorias).catch(() => {});
    api.get<string[]>('/api/productos/marcas').then(setMarcas).catch(() => {});
  }, []);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 0 }));
  };

  const clearFilters = () => {
    setFilters({ categoriaId: '', marca: '', precioMin: '', precioMax: '', disponible: '', q: '', page: 0, sort: 'recientes' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="text-navy-600 font-medium">Catálogo</span>
      </nav>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="card p-6 sticky top-28">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-navy-600 text-lg">Filtros</h3>
              <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline">Limpiar</button>
            </div>

            {/* Search */}
            <div className="mb-5">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Buscar</label>
              <input type="text" value={filters.q} onChange={(e) => updateFilter('q', e.target.value)}
                     placeholder="Producto, marca..." className="input-field text-sm py-2" />
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Categoría</label>
              <select value={filters.categoriaId} onChange={(e) => updateFilter('categoriaId', e.target.value)}
                      className="input-field text-sm py-2">
                <option value="">Todas</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div className="mb-5">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Marca</label>
              <select value={filters.marca} onChange={(e) => updateFilter('marca', e.target.value)}
                      className="input-field text-sm py-2">
                <option value="">Todas</option>
                {marcas.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="mb-5">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Precio</label>
              <div className="flex gap-2">
                <input type="number" value={filters.precioMin} onChange={(e) => updateFilter('precioMin', e.target.value)}
                       placeholder="Min" className="input-field text-sm py-2" />
                <input type="number" value={filters.precioMax} onChange={(e) => updateFilter('precioMax', e.target.value)}
                       placeholder="Max" className="input-field text-sm py-2" />
              </div>
            </div>

            {/* Availability */}
            <div className="mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={filters.disponible === 'true'}
                       onChange={(e) => updateFilter('disponible', e.target.checked ? 'true' : '')}
                       className="rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
                <span className="text-sm text-slate-700">Solo con stock</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">{totalElements} productos encontrados</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setFiltersOpen(true)} className="lg:hidden btn-outline text-sm py-2 px-3">
                <FiFilter size={16} className="mr-1" /> Filtros
              </button>
              <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}
                      className="input-field text-sm py-2 w-auto">
                <option value="recientes">Más recientes</option>
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
                <option value="nombre_asc">Nombre: A-Z</option>
              </select>
              <div className="hidden sm:flex border border-slate-200 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-slate-400'}`}>
                  <FiGrid size={18} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-slate-400'}`}>
                  <FiList size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 gap-4' : 'grid-cols-1 gap-3'}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="aspect-square bg-slate-200 rounded-xl mb-3" />
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-6 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-slate-400">No se encontraron productos</p>
              <button onClick={clearFilters} className="btn-primary mt-4">Limpiar Filtros</button>
            </div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 gap-4' : 'grid-cols-1 gap-3'}`}>
              {productos.map((prod) => (
                <div key={prod.id} className={`card-hover group overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
                  <Link href={`/producto/${prod.slug}`} className={viewMode === 'list' ? 'w-40 shrink-0' : ''}>
                    <div className={`bg-slate-50 relative overflow-hidden ${viewMode === 'list' ? 'h-full' : 'aspect-square'}`}>
                      <img src={getImageUrl(prod.imagenes?.[0]?.url)} alt={prod.nombre}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      {prod.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="badge-danger">Sin Stock</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4 flex-1">
                    <p className="text-xs text-primary-600 font-medium">{prod.categoriaNombre}</p>
                    <Link href={`/producto/${prod.slug}`}>
                      <h3 className="font-bold text-navy-600 mt-1 text-sm leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {prod.nombre}
                      </h3>
                    </Link>
                    {prod.marca && <p className="text-xs text-slate-500 mt-1">{prod.marca}</p>}
                    <p className="text-lg font-extrabold text-navy-600 mt-2">{formatCurrency(prod.precioMinorista)}</p>
                    <button onClick={() => { addItem(prod); toast.success('Agregado'); }}
                            disabled={prod.stock === 0}
                            className="btn-primary w-full mt-3 text-sm py-2 disabled:opacity-40">
                      <FiShoppingCart size={14} className="mr-1" /> Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setFilters((f) => ({ ...f, page: i }))}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          filters.page === i ? 'bg-primary-500 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-primary-50'
                        }`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto animate-slide-down">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-navy-600">Filtros</h3>
              <button onClick={() => setFiltersOpen(false)}><FiX size={24} /></button>
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Categoría</label>
              <select value={filters.categoriaId} onChange={(e) => updateFilter('categoriaId', e.target.value)} className="input-field text-sm py-2">
                <option value="">Todas</option>
                {categorias.map((c) => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
              </select>
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Marca</label>
              <select value={filters.marca} onChange={(e) => updateFilter('marca', e.target.value)} className="input-field text-sm py-2">
                <option value="">Todas</option>
                {marcas.map((m) => (<option key={m} value={m}>{m}</option>))}
              </select>
            </div>
            <button onClick={() => { clearFilters(); setFiltersOpen(false); }} className="btn-primary w-full mt-4">Aplicar</button>
          </div>
        </div>
      )}
    </div>
  );
}
