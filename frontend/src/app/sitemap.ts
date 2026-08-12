import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function fetchSlugs(): Promise<{ productos: string[]; categorias: string[]; blog: string[] }> {
  try {
    const res = await fetch(`${API_URL}/api/seo/urls`, { next: { revalidate: 3600 } });
    if (!res.ok) return { productos: [], categorias: [], blog: [] };
    return res.json();
  } catch {
    return { productos: [], categorias: [], blog: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await fetchSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/catalogo`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/mayoristas`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/cotizador`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/contacto`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/carrito`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const productPages = slugs.productos.map((slug) => ({
    url: `${SITE_URL}/producto/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogPages = slugs.blog.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
