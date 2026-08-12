'use client';

import { useState } from 'react';
import { FiDownload, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCatalogoPdfPage() {
  const { token } = useAuth();
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.post('/api/admin/catalogo/generar', {}, token!);
      toast.success('¡Catálogo PDF regenerado!');
    } catch (err: any) { toast.error(err.message); }
    finally { setGenerating(false); }
  };

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  return (
    <div className="max-w-2xl animate-fade-in">
      <h2 className="text-2xl font-extrabold text-navy-600 mb-6">Catálogo PDF</h2>

      <div className="card p-8 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
          <span className="text-3xl">📄</span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-navy-600">Genera tu catálogo en PDF</h3>
          <p className="text-slate-500 mt-2">El PDF se genera automáticamente con todos los productos activos, organizados por categoría, con precios minoristas y mayoristas.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleGenerate} disabled={generating} className="btn-primary">
            <FiRefreshCw className={`mr-2 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Generando...' : 'Regenerar Catálogo'}
          </button>

          <a href={`${apiBase}/api/catalogo/pdf`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            <FiDownload className="mr-2" /> Descargar PDF
          </a>
        </div>

        <p className="text-xs text-slate-400">El catálogo incluye: nombre, SKU, precio minorista, precio mayorista y stock de cada producto.</p>
      </div>
    </div>
  );
}
