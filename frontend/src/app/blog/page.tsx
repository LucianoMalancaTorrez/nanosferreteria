'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import api from '@/lib/api';
import type { BlogPost, PageResponse } from '@/types';
import { getImageUrl, truncate } from '@/lib/utils';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<PageResponse<BlogPost>>('/api/blog?page=0&size=20')
      .then((data) => setPosts(data.content))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-navy-600">Blog & Tips</h1>
        <p className="text-slate-500 mt-2 text-lg">Consejos, guías y novedades del mundo de la ferretería</p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="aspect-video bg-slate-200 rounded-xl mb-4" />
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-xl">Próximamente más artículos</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="card-hover group overflow-hidden">
              <div className="aspect-video bg-slate-50 overflow-hidden">
                <img src={getImageUrl(post.imagenUrl)} alt={post.titulo}
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  {post.autorNombre && <span className="flex items-center gap-1"><FiUser size={12} />{post.autorNombre}</span>}
                  {post.publishedAt && <span className="flex items-center gap-1"><FiCalendar size={12} />{new Date(post.publishedAt).toLocaleDateString('es-AR')}</span>}
                </div>
                <h2 className="text-lg font-bold text-navy-600 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {post.titulo}
                </h2>
                <p className="text-sm text-slate-500 mt-2 line-clamp-3">{truncate(post.metaDescription || post.contenido, 150)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
