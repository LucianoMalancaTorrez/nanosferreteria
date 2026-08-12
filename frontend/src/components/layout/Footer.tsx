import Link from 'next/link';
import Image from 'next/image';
import { FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { CONTACT, SOCIAL, SITE, getPhoneLink, getWhatsAppLink } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt={SITE.name} width={48} height={48} className="rounded-lg bg-cream p-1" />
              <div>
                <h3 className="text-xl font-extrabold">Nano&apos;s</h3>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase">Ferretería y Sanitarios</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Tu ferretería de confianza en Mendoza. Herramientas, materiales, sanitarios y todo lo que necesitás para tu obra o tu hogar.
            </p>
            <div className="flex gap-3 mt-4">
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-xl bg-whatsapp/20 text-whatsapp flex items-center justify-center hover:bg-whatsapp hover:text-white transition-all duration-200">
                <FaWhatsapp size={20} />
              </a>
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-primary-500 transition-all duration-200">
                <FaInstagram size={20} />
              </a>
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-blue-600 transition-all duration-200">
                <FaFacebookF size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Navegación</h4>
            <ul className="space-y-2">
              {[
                { href: '/catalogo', label: 'Catálogo' },
                { href: '/mayoristas', label: 'Mayoristas' },
                { href: '/cotizador', label: 'Cotizador' },
                { href: '/blog', label: 'Blog & Tips' },
                { href: '/contacto', label: 'Contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                        className="text-slate-300 hover:text-primary-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-4">Categorías</h4>
            <ul className="space-y-2">
              {[
                'Herramientas Manuales', 'Herramientas Eléctricas', 'Sanitarios',
                'Electricidad', 'Pinturas', 'Jardín y Piscina', 'Herrajes',
              ].map((cat) => (
                <li key={cat}>
                  <Link href={`/catalogo?categoria=${cat.toLowerCase().replace(/ /g, '-').replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')}`}
                        className="text-slate-300 hover:text-primary-400 transition-colors text-sm">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <FiMapPin size={18} className="shrink-0 mt-0.5 text-primary-400" />
                {CONTACT.address}
              </li>
              <li>
                <a href={getPhoneLink()} className="flex items-center gap-3 text-sm text-slate-300 hover:text-primary-400 transition-colors">
                  <FiPhone size={16} className="shrink-0 text-primary-400" />
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 text-sm text-slate-300 hover:text-green-400 transition-colors">
                  <FaWhatsapp size={16} className="shrink-0 text-green-400" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 text-sm text-slate-300 hover:text-primary-400 transition-colors">
                  <FiMail size={16} className="shrink-0 text-primary-400" />
                  {CONTACT.email}
                </a>
              </li>
              <li className="text-sm text-slate-400">{CONTACT.hours}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.</p>
          <p>Precios sujetos a cambio sin previo aviso.</p>
        </div>
      </div>
    </footer>
  );
}
