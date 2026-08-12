'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Bienvenido al panel de administración');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Credenciales inválidas');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center text-white font-black text-2xl mb-4">N</div>
          <h1 className="text-2xl font-extrabold text-white">Panel de Administración</h1>
          <p className="text-slate-400 mt-1">Nano&apos;s Ferretería</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-8 shadow-xl space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                   className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="admin@nanosweb.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1 block">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                   className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Ingresando...' : 'Iniciar Sesión'}</button>
        </form>
      </div>
    </div>
  );
}
