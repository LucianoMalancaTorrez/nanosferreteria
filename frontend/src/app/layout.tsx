import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { SITE } from '@/lib/config';

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Herramientas, Sanitarios y más en Mendoza`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'ferretería', 'herramientas', 'materiales', 'construcción', 'pinturas',
    'electricidad', 'sanitarios', 'herrajes', 'mayorista', 'Mendoza', 'Argentina',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: SITE.name,
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: '#1E3A5F',
              color: '#fff',
              padding: '14px 20px',
            },
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
