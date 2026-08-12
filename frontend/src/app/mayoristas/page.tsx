'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiUserPlus, FiLogIn, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

function MayoristasContent() {
  const { isAuthenticated, user, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'info' | 'login' | 'register'>('info');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'register') setTab('register');
    else if (tabParam === 'login') setTab('login');
  }, [searchParams]);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ nombre: '', apellido: '', email: '', password: '', telefono: '', empresa: '', cuit: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast.success('¡Bienvenido!');
      router.push('/catalogo');
    } catch (err: any) {
      toast.error(err.message || 'Error al iniciar sesión');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/register', regForm);
      toast.success('¡Registro exitoso! Tu cuenta será revisada por un administrador.');
      setTab('login');
    } catch (err: any) {
      toast.error(err.message || 'Error al registrarse');
    } finally { setLoading(false); }
  };

  if (isAuthenticated && user?.rol === 'MAYORISTA') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
          <FiCheck size={40} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-navy-600">¡Ya estás logueado como mayorista!</h1>
        <p className="text-slate-500 mt-4">Podés ver los precios mayoristas en todo nuestro catálogo.</p>
        <Link href="/catalogo" className="btn-primary mt-8 inline-flex">Ver Catálogo con Precios Mayoristas</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-navy-600">Zona Mayoristas</h1>
        <p className="text-slate-500 mt-2 text-lg">Accedé a precios exclusivos para compras por cantidad</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Benefits */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-navy-600 mb-6">Beneficios Mayoristas</h2>
          <ul className="space-y-4">
            {[
              'Precios especiales en todo el catálogo',
              'Descuentos por volumen de compra',
              'Atención personalizada por WhatsApp',
              'Factura A disponible',
              'Envíos a todo el país',
              'Lista de precios actualizada',
            ].map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <FiCheck className="text-green-500 mt-0.5 shrink-0" size={20} />
                <span className="text-slate-700">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Forms */}
        <div className="card p-8">
          <div className="flex gap-2 mb-6">
            <button onClick={() => setTab('login')}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${
                tab === 'login' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              <FiLogIn className="inline mr-2" size={16} />Iniciar Sesión
            </button>
            <button onClick={() => setTab('register')}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${
                tab === 'register' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              <FiUserPlus className="inline mr-2" size={16} />Registrarme
            </button>
          </div>

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
                <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                       className="input-field" required />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Contraseña</label>
                <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                       className="input-field" required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Ingresando...' : 'Iniciar Sesión'}</button>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Nombre *</label>
                  <input type="text" value={regForm.nombre} onChange={(e) => setRegForm({...regForm, nombre: e.target.value})} className="input-field" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Apellido</label>
                  <input type="text" value={regForm.apellido} onChange={(e) => setRegForm({...regForm, apellido: e.target.value})} className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Email *</label>
                <input type="email" value={regForm.email} onChange={(e) => setRegForm({...regForm, email: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Contraseña *</label>
                <input type="password" value={regForm.password} onChange={(e) => setRegForm({...regForm, password: e.target.value})} className="input-field" required minLength={6} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Empresa *</label>
                <input type="text" value={regForm.empresa} onChange={(e) => setRegForm({...regForm, empresa: e.target.value})} className="input-field" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">CUIT</label>
                  <input type="text" value={regForm.cuit} onChange={(e) => setRegForm({...regForm, cuit: e.target.value})} className="input-field" placeholder="20-12345678-9" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Teléfono</label>
                  <input type="tel" value={regForm.telefono} onChange={(e) => setRegForm({...regForm, telefono: e.target.value})} className="input-field" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Registrando...' : 'Crear Cuenta Mayorista'}</button>
              <p className="text-xs text-slate-400 text-center">Tu cuenta será revisada y aprobada por un administrador</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MayoristasPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-12 text-center text-slate-500">Cargando...</div>}>
      <MayoristasContent />
    </Suspense>
  );
}
