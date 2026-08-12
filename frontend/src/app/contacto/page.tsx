'use client';

import { useEffect, useState } from 'react';
import { FiMapPin, FiPhone, FiClock, FiMail } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa';
import api from '@/lib/api';
import type { Sucursal } from '@/types';
import { CONTACT, SOCIAL, MAPS, getPhoneLink, getWhatsAppLink } from '@/lib/config';

export default function ContactoPage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  useEffect(() => {
    api.get<Sucursal[]>('/api/sucursales').then(setSucursales).catch(() => {});
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="gradient-hero py-16 text-center text-white">
        <h1 className="text-4xl font-extrabold">Contacto y Sucursales</h1>
        <p className="text-xl text-slate-200 mt-2">Estamos para ayudarte. ¡Consultanos!</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Sucursales */}
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-navy-600">Nuestra Sucursal</h2>
            {sucursales.length > 0 ? sucursales.map((suc) => (
              <div key={suc.id} className="card p-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-navy-600">{suc.nombre}</h3>
                  {suc.principal && <span className="badge bg-primary-100 text-primary-700">Principal</span>}
                </div>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <FiMapPin className="text-primary-500 shrink-0 mt-0.5" size={18} />
                    {suc.direccion}
                  </li>
                  {suc.telefono && (
                    <li><a href={`tel:${suc.telefono.replace(/\D/g, '')}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-primary-600 transition-colors">
                      <FiPhone className="text-primary-500" size={16} />{suc.telefono}
                    </a></li>
                  )}
                  {suc.whatsapp && (
                    <li><a href={`https://wa.me/${suc.whatsapp}`} target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-3 text-sm text-slate-600 hover:text-green-600 transition-colors">
                      <FaWhatsapp className="text-whatsapp" size={16} />WhatsApp
                    </a></li>
                  )}
                  {suc.horarios && (
                    <li className="flex items-start gap-3 text-sm text-slate-600">
                      <FiClock className="text-primary-500 shrink-0 mt-0.5" size={16} />{suc.horarios}
                    </li>
                  )}
                </ul>
                {suc.googleMapsUrl && (
                  <a href={suc.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                     className="btn-outline text-sm py-2 mt-4 inline-flex">
                    <FiMapPin className="mr-2" /> Ver en Google Maps
                  </a>
                )}
              </div>
            )) : (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-navy-600">Nano&apos;s Ferretería</h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <FiMapPin className="text-primary-500 shrink-0 mt-0.5" size={18} />
                    {CONTACT.address}
                  </li>
                  <li>
                    <a href={getPhoneLink()} className="flex items-center gap-3 text-sm text-slate-600 hover:text-primary-600 transition-colors">
                      <FiPhone className="text-primary-500" size={16} />{CONTACT.phoneDisplay}
                    </a>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <FiClock className="text-primary-500 shrink-0 mt-0.5" size={16} />{CONTACT.hours}
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Contact Info + Social */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-2xl font-extrabold text-navy-600 mb-4">Escribinos</h2>
              <div className="space-y-4">
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 text-slate-700 hover:text-primary-600 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center"><FiMail className="text-primary-500" size={20} /></div>
                  <div><p className="font-semibold">Email</p><p className="text-sm text-slate-500">{CONTACT.email}</p></div>
                </a>
                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 text-slate-700 hover:text-green-600 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center"><FaWhatsapp className="text-whatsapp" size={20} /></div>
                  <div><p className="font-semibold">WhatsApp</p><p className="text-sm text-slate-500">{CONTACT.phoneDisplay}</p></div>
                </a>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-2xl font-extrabold text-navy-600 mb-4">Redes Sociales</h2>
              <div className="flex gap-4">
                <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
                   className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center hover:scale-110 transition-transform">
                  <FaInstagram size={24} />
                </a>
                <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer"
                   className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition-transform">
                  <FaFacebookF size={24} />
                </a>
                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                   className="w-14 h-14 rounded-2xl bg-whatsapp text-white flex items-center justify-center hover:scale-110 transition-transform">
                  <FaWhatsapp size={24} />
                </a>
              </div>
            </div>

            <div className="card overflow-hidden">
              <iframe
                src={MAPS.embedUrl}
                width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Ubicación Nano's Ferretería" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
