# Nano's Ferretería — Sitio Web

Sitio web completo para **Nano's Ferretería** (Mendoza, Argentina): catálogo de productos con precios minoristas y mayoristas, carrito con pedido por WhatsApp, cotizador de obras, blog, panel de administración y generación de catálogo PDF.

## Stack tecnológico

| Capa | Tecnología | Motivo |
|------|-----------|--------|
| Backend | Java 21 + Spring Boot 3 | Robusto, ideal para API REST y panel admin con seguridad |
| Base de datos | MySQL 8 + Flyway | Estándar en hosting, migraciones versionadas |
| Frontend | Next.js 14 + React 18 + Tailwind CSS | SSR/SEO, rutas amigables, mobile-first |
| Auth | JWT (Spring Security) | Stateless, simple para panel admin y mayoristas |
| Estado cliente | Zustand | Carrito y sesión sin boilerplate |
| PDF | OpenPDF | Catálogo descargable generado desde el backend |

## Estructura del proyecto

```
NANOSWEB/
├── backend/          # API REST Spring Boot
│   └── src/main/java/com/nanosweb/ferreteria/
│       ├── controller/   # Endpoints públicos y /api/admin/*
│       ├── service/      # Lógica de negocio
│       ├── repository/   # Spring Data JPA
│       ├── model/        # Entidades
│       ├── security/     # JWT
│       └── seed/         # Datos de prueba (perfil dev)
├── frontend/         # Next.js App Router
│   └── src/
│       ├── app/          # Páginas (público + /admin)
│       ├── components/   # Header, Footer, etc.
│       ├── hooks/        # useAuth, useCart
│       └── lib/          # API client, config, utils
├── docker-compose.yml    # MySQL local
└── README.md
```

## Requisitos previos

Instalá estas herramientas antes de empezar:

| Herramienta | Versión mínima |
|-------------|----------------|
| Java JDK | 21 |
| Maven | 3.9+ |
| Node.js | 18+ (recomendado 20 LTS) |
| npm | 9+ |
| MySQL | 8.0+ |
| Docker (opcional) | Para levantar MySQL sin instalarlo |

Verificá las versiones:

```bash
java -version
mvn -version
node -version
npm -version
mysql --version
```

---

## Cómo correrlo en local (paso a paso)

### 1. Clonar / abrir el proyecto

```bash
cd NANOSWEB
```

### 2. Base de datos MySQL

**Opción A — Docker (recomendada):**

```bash
docker compose up -d
```

Esto crea la base `nanosweb_ferreteria` con usuario `root` / contraseña `root`.

**Opción B — MySQL instalado localmente:**

```sql
CREATE DATABASE nanosweb_ferreteria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configurar variables de entorno

**Backend** — copiá el ejemplo (opcional, los defaults funcionan en dev):

```bash
cd backend
copy .env.example .env
```

Credenciales por defecto en `application-dev.yml`:
- URL: `jdbc:mysql://localhost:3306/nanosweb_ferreteria`
- Usuario: `root`
- Contraseña: `root`

**Frontend:**

```bash
cd frontend
copy .env.example .env.local
```

Contenido de `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=5492615414663
```

### 4. Levantar el backend

```bash
cd backend
mvn spring-boot:run
```

- API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- Flyway aplica las migraciones automáticamente
- Con perfil `dev`, se cargan **datos de prueba** al primer arranque (productos, categorías, banners, blog, sucursal Mendoza)

### 5. Levantar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Sitio: http://localhost:3000

---

## Usuarios de prueba

| Rol | Email | Contraseña | Notas |
|-----|-------|------------|-------|
| **Admin** | `admin@nanosweb.com` | `Admin123!` | Panel en `/admin/login` |
| Mayorista aprobado | `mayorista@test.com` | `Mayor123!` | Ve precios mayoristas |
| Mayorista pendiente | `pendiente@test.com` | `Mayor123!` | Espera aprobación admin |

### Panel de administración

1. Ir a http://localhost:3000/admin/login
2. Ingresar con `admin@nanosweb.com` / `Admin123!`
3. Desde ahí podés gestionar productos, categorías, banners, mayoristas, blog y generar el PDF del catálogo

---

## Datos de prueba (seed)

Los datos se cargan **automáticamente** la primera vez que levantás el backend con perfil `dev` (default).

Incluye:
- 7 categorías principales + subcategorías
- ~30 productos con imágenes placeholder
- 3 banners de ofertas
- 2 artículos de blog
- 1 sucursal: Los Pescadores 871, Mendoza

Si ya existían datos y querés recargar:

```sql
DROP DATABASE nanosweb_ferreteria;
CREATE DATABASE nanosweb_ferreteria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Luego reiniciá el backend.

---

## Páginas del sitio

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio con banners, categorías y destacados |
| `/catalogo` | Catálogo con filtros (categoría, marca, precio, stock) |
| `/producto/[slug]` | Ficha de producto + WhatsApp |
| `/carrito` | Lista de pedido → mensaje WhatsApp |
| `/mayoristas` | Login/registro mayoristas |
| `/cotizador` | Presupuesto para obras |
| `/blog` | Artículos SEO |
| `/contacto` | Sucursal, mapa, redes sociales |
| `/admin/*` | Panel de administración (protegido) |

---

## Variables de entorno

### Backend (producción)

| Variable | Descripción | ¿Subir al repo? |
|----------|-------------|-----------------|
| `SPRING_PROFILES_ACTIVE` | `prod` en producción | No |
| `DATABASE_URL` | JDBC URL completa | No |
| `DB_USERNAME` | Usuario MySQL | No |
| `DB_PASSWORD` | Contraseña MySQL | **Nunca** |
| `JWT_SECRET` | Clave JWT (mín. 256 bits) | **Nunca** |
| `JWT_EXPIRATION` | Expiración token (ms) | No |
| `UPLOAD_DIR` | Carpeta de imágenes | No |
| `WHATSAPP_NUMBER` | WhatsApp con código país | No |
| `FRONTEND_URL` | URL del frontend (CORS) | No |
| `SERVER_PORT` | Puerto (default 8080) | No |

### Frontend (producción)

| Variable | Descripción | ¿Subir al repo? |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_API_URL` | URL pública del backend | Sí (sin secretos) |
| `NEXT_PUBLIC_SITE_URL` | URL del sitio | Sí |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp | Sí |

**Nunca subas:** `.env`, `.env.local`, contraseñas, `JWT_SECRET`, credenciales de base de datos.

---

## Publicar en producción

### Opciones de hosting recomendadas

| Servicio | Uso | Costo aprox. | Por qué |
|----------|-----|--------------|---------|
| **Railway** | Backend + MySQL + Frontend | ~USD 5-20/mes | Deploy simple desde Git, variables de entorno fáciles |
| **Render** | Backend + Frontend | Gratis tier limitado | Bueno para empezar, MySQL aparte (PlanetScale/Railway) |
| **VPS (DigitalOcean, Hetzner)** | Todo en un servidor | ~USD 5-10/mes | Control total, Docker recomendado |
| **Vercel** | Solo frontend | Gratis | Ideal para Next.js; backend en Railway/Render |
| **PlanetScale / Railway MySQL** | Base de datos | Gratis tier | MySQL managed |

**Recomendación inicial:** Frontend en **Vercel** + Backend en **Railway** + MySQL en **Railway** (todo conectado por variables de entorno).

### Desplegar el backend

1. Crear proyecto en Railway/Render con el directorio `backend/`
2. Configurar build: `mvn -DskipTests package`
3. Start command: `java -jar target/ferreteria-1.0.0.jar`
4. Variables de entorno:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=jdbc:mysql://HOST:3306/nanosweb_ferreteria?useSSL=true&serverTimezone=America/Argentina/Mendoza
   DB_USERNAME=...
   DB_PASSWORD=...
   JWT_SECRET=<generar-clave-segura-256-bits>
   FRONTEND_URL=https://tudominio.com.ar
   WHATSAPP_NUMBER=5492615414663
   UPLOAD_DIR=/app/uploads
   ```
5. Flyway migrará el schema al primer deploy
6. Crear usuario admin manualmente o ejecutar seed en staging

### Desplegar el frontend

1. Conectar repo a Vercel (directorio `frontend/`)
2. Variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.tudominio.com.ar
   NEXT_PUBLIC_SITE_URL=https://tudominio.com.ar
   NEXT_PUBLIC_WHATSAPP_NUMBER=5492615414663
   ```
3. Build command: `npm run build`
4. Deploy automático en cada push

### Migrar base de datos a producción

1. Flyway corre automáticamente al iniciar el backend (`V1__initial_schema.sql`, `V2__cotizaciones.sql`)
2. Para datos iniciales en producción: exportar desde dev o cargar manualmente vía panel admin
3. Backup regular con `mysqldump`:

```bash
mysqldump -u USER -p nanosweb_ferreteria > backup.sql
```

### Conectar dominio propio (.com.ar)

1. **Comprar dominio** (NIC Argentina, DonWeb, etc.)
2. **Frontend (Vercel):**
   - Agregar dominio en Vercel → Settings → Domains
   - Configurar DNS: registro `CNAME` apuntando a `cname.vercel-dns.com`
3. **Backend (Railway/Render):**
   - Subdominio `api.tudominio.com.ar` → registro `CNAME` al host del servicio
   - Actualizar `FRONTEND_URL` y `NEXT_PUBLIC_API_URL`
4. **SSL:** Vercel y Railway proveen HTTPS automático
5. Esperar propagación DNS (hasta 48 hs, usualmente minutos)

---

## Decisiones técnicas

1. **Next.js sobre React puro:** Mejor SEO (meta tags, sitemap, SSR en blog/productos), URLs amigables con App Router.
2. **Spring Boot separado del frontend:** Permite escalar API y sitio por separado; el admin y la app móvil futura pueden consumir la misma API.
3. **Flyway:** Migraciones versionadas y reproducibles entre dev y prod.
4. **JWT sin sesión en servidor:** Simple para VPS económicos; tokens en localStorage del frontend.
5. **WhatsApp como checkout:** Sin pasarela de pago; el carrito genera un mensaje prearmado — ideal para ferreterías locales.
6. **Zustand para carrito:** Persistencia en localStorage, liviano vs Redux.
7. **OpenPDF:** Generación de catálogo PDF server-side sin dependencias externas.

---

## Datos de contacto del negocio

- **Nombre:** Nano's Ferretería
- **Dirección:** Los Pescadores 871, Mendoza
- **Teléfono / WhatsApp:** (0261) 541-4663
- **Horarios:** Lunes a Sábados 10:00 a 13:00
- **Facebook:** https://www.facebook.com/share/194vs8BgVb/
- **Instagram:** https://www.instagram.com/nanosferreteriamza/

---

## Comandos útiles

```bash
# Backend — compilar
cd backend && mvn clean package -DskipTests

# Backend — tests
cd backend && mvn test

# Frontend — build producción
cd frontend && npm run build && npm start

# Frontend — lint
cd frontend && npm run lint

# MySQL con Docker
docker compose up -d
docker compose down
```

---

## Soporte y mantenimiento

- **Productos:** Panel admin → Productos
- **Precios mayoristas:** Requieren login mayorista aprobado
- **Imágenes:** Se suben desde el admin; se guardan en `backend/uploads/`
- **Swagger:** Documentación interactiva de la API en `/swagger-ui/index.html`

Desarrollado para Nano's Ferretería — Mendoza, Argentina.
