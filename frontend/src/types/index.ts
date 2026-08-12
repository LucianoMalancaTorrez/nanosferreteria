export interface Producto {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  categoriaId: number;
  categoriaNombre: string;
  categoriaSlug: string;
  precioMinorista: number;
  precioMayorista: number | null;
  cantidadMinimaMayorista: number;
  stock: number;
  sku: string;
  marca: string;
  activo: boolean;
  destacado: boolean;
  imagenes: ImagenProducto[];
  createdAt: string;
  updatedAt: string;
}

export interface ImagenProducto {
  id: number;
  url: string;
  altText: string;
  orden: number;
  principal: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  imagenUrl: string;
  categoriaPadreId: number | null;
  categoriaPadreNombre: string | null;
  activo: boolean;
  subcategorias: Categoria[];
  productCount: number;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  empresa: string;
  cuit: string;
  rol: 'ADMIN' | 'MAYORISTA' | 'CLIENTE';
  aprobado: boolean;
  createdAt: string;
}

export interface Banner {
  id: number;
  titulo: string;
  subtitulo: string;
  imagenUrl: string;
  link: string;
  orden: number;
  activo: boolean;
  fechaInicio: string;
  fechaFin: string;
  createdAt: string;
}

export interface BlogPost {
  id: number;
  titulo: string;
  slug: string;
  contenido: string;
  imagenUrl: string;
  metaDescription: string;
  publicado: boolean;
  autorNombre: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  whatsapp: string;
  horarios: string;
  googleMapsUrl: string;
  latitud: number;
  longitud: number;
  principal: boolean;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  email: string;
  nombre: string;
  rol: string;
  expiresIn: number;
}

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

export interface DashboardStats {
  totalProductos: number;
  totalCategorias: number;
  mayoristasPendientes: number;
}
