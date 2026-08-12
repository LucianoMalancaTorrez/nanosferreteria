'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { BlogPost } from '@/types';
import toast from 'react-hot-toast';

export default function AdminBlogPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const fetchPosts = () => {
    if (!token) return;
    api.get<BlogPost[]>('/api/admin/blog', token).then(setPosts).catch(() => {});
  };

  useEffect(() => { fetchPosts(); }, [token]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este artículo?')) return;
    try {
      await api.delete(`/api/admin/blog/${id}`, token!);
      toast.success('Artículo eliminado');
      fetchPosts();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-navy-600">Blog</h2>
        <Link href="/admin/blog/nuevo" className="btn-primary text-sm"><FiPlus className="mr-2" /> Nuevo Artículo</Link>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="card p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="font-bold text-navy-600">{post.titulo}</p>
              <p className="text-sm text-slate-500 mt-0.5">Slug: /{post.slug}</p>
            </div>
            <span className={post.publicado ? 'badge-success' : 'badge-warning'}>
              {post.publicado ? <><FiEye className="mr-1" />Publicado</> : <><FiEyeOff className="mr-1" />Borrador</>}
            </span>
            <button onClick={() => handleDelete(post.id)} className="p-2 text-slate-400 hover:text-red-600"><FiTrash2 size={16} /></button>
          </div>
        ))}
        {posts.length === 0 && <p className="text-center text-slate-400 py-10">No hay artículos</p>}
      </div>
    </div>
  );
}
