'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiCalendar, FiUser, FiArrowLeft } from 'react-icons/fi';
import api from '@/lib/api';
import type { BlogPost } from '@/types';
import { getImageUrl } from '@/lib/utils';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.get<BlogPost>(`/api/blog/${slug}`)
      .then(setPost)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse"><div className="h-10 bg-slate-200 rounded w-3/4 mb-4" /><div className="h-64 bg-slate-200 rounded-2xl" /></div>;

  if (!post) return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><p className="text-xl text-slate-400">Artículo no encontrado</p></div>;

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <Link href="/blog" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-6">
        <FiArrowLeft className="mr-1" /> Volver al Blog
      </Link>

      <h1 className="text-3xl md:text-4xl font-extrabold text-navy-600 leading-tight">{post.titulo}</h1>

      <div className="flex items-center gap-4 text-sm text-slate-500 mt-4">
        {post.autorNombre && <span className="flex items-center gap-1"><FiUser size={14} />{post.autorNombre}</span>}
        {post.publishedAt && <span className="flex items-center gap-1"><FiCalendar size={14} />{new Date(post.publishedAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
      </div>

      {post.imagenUrl && (
        <div className="mt-8 rounded-2xl overflow-hidden">
          <img src={getImageUrl(post.imagenUrl)} alt={post.titulo} className="w-full h-auto" />
        </div>
      )}

      <div className="mt-8 prose prose-slate prose-lg max-w-none
                      prose-headings:text-navy-600 prose-headings:font-extrabold
                      prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-navy-600 whitespace-pre-line leading-relaxed text-slate-700">
        {post.contenido}
      </div>
    </article>
  );
}
