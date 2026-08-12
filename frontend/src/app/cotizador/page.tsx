'use client';

import { useState } from 'react';
import { FiSend, FiCheckCircle } from 'react-icons/fi';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CotizadorPage() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', materiales: '', mensaje: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/cotizaciones', form);
      setSent(true);
      toast.success('Cotización enviada');
    } catch (err: any) {
      toast.error(err.message || 'Error al enviar');
    } finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <FiCheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h1 className="text-3xl font-extrabold text-navy-600">¡Cotización Enviada!</h1>
        <p className="text-slate-500 mt-4">Recibimos tu solicitud. Nos comunicaremos pronto con el presupuesto.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-navy-600">Cotizador de Presupuesto</h1>
        <p className="text-slate-500 mt-2">Envianos tu lista de materiales y te armamos el presupuesto</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Nombre completo *</label>
            <input type="text" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} className="input-field" required />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="input-field" required />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Teléfono / WhatsApp</label>
          <input type="tel" value={form.telefono} onChange={(e) => setForm({...form, telefono: e.target.value})} className="input-field" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Lista de materiales *</label>
          <textarea value={form.materiales} onChange={(e) => setForm({...form, materiales: e.target.value})}
                    className="input-field min-h-[150px]" required
                    placeholder="Ej: 100 metros cable 2.5mm, 50 cajas térmicas 2x20A, 20 llaves de luz..." />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Mensaje adicional</label>
          <textarea value={form.mensaje} onChange={(e) => setForm({...form, mensaje: e.target.value})}
                    className="input-field min-h-[80px]" placeholder="Indicaciones especiales, fecha necesaria, etc." />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          <FiSend className="mr-2" /> {loading ? 'Enviando...' : 'Enviar Solicitud de Cotización'}
        </button>
      </form>
    </div>
  );
}
