package com.nanosweb.ferreteria.seed;

import com.nanosweb.ferreteria.model.*;
import com.nanosweb.ferreteria.model.enums.Rol;
import com.nanosweb.ferreteria.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final BannerRepository bannerRepository;
    private final BlogPostRepository blogPostRepository;
    private final SucursalRepository sucursalRepository;
    private final ImagenProductoRepository imagenProductoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (categoriaRepository.count() > 0) {
            log.info("Datos ya existentes, omitiendo seed.");
            return;
        }

        log.info("=== Cargando datos de prueba ===");
        seedUsuarios();
        List<Categoria> categorias = seedCategorias();
        seedProductos(categorias);
        seedBanners();
        seedBlogPosts();
        seedSucursales();
        log.info("=== Datos de prueba cargados exitosamente ===");
    }

    private void seedUsuarios() {
        usuarioRepository.saveAll(List.of(
            Usuario.builder()
                .nombre("Admin").apellido("Ferretería")
                .email("admin@nanosweb.com")
                .passwordHash(passwordEncoder.encode("Admin123!"))
                .rol(Rol.ADMIN).aprobado(true).build(),
            Usuario.builder()
                .nombre("Carlos").apellido("Mayorista")
                .email("mayorista@test.com")
                .passwordHash(passwordEncoder.encode("Mayor123!"))
                .telefono("1155667788").empresa("Construcciones López SRL")
                .cuit("30-71234567-8")
                .rol(Rol.MAYORISTA).aprobado(true).build(),
            Usuario.builder()
                .nombre("María").apellido("Pendiente")
                .email("pendiente@test.com")
                .passwordHash(passwordEncoder.encode("Mayor123!"))
                .telefono("1144556677").empresa("Ferretería San Martín")
                .cuit("20-34567890-1")
                .rol(Rol.MAYORISTA).aprobado(false).build()
        ));
        log.info("Usuarios creados: admin, mayorista aprobado, mayorista pendiente");
    }

    private List<Categoria> seedCategorias() {
        // Categorías principales
        Categoria herramientasManuales = categoriaRepository.save(Categoria.builder()
            .nombre("Herramientas Manuales").slug("herramientas-manuales")
            .descripcion("Destornilladores, llaves, martillos, pinzas y más")
            .imagenUrl("/uploads/categorias/herramientas-manuales.jpg").activo(true).build());

        Categoria herramientasElectricas = categoriaRepository.save(Categoria.builder()
            .nombre("Herramientas Eléctricas").slug("herramientas-electricas")
            .descripcion("Taladros, amoladoras, sierras y más")
            .imagenUrl("/uploads/categorias/herramientas-electricas.jpg").activo(true).build());

        Categoria sanitarios = categoriaRepository.save(Categoria.builder()
            .nombre("Sanitarios").slug("sanitarios")
            .descripcion("Grifería, accesorios de baño, caños y conexiones")
            .imagenUrl("/uploads/categorias/sanitarios.jpg").activo(true).build());

        Categoria electricidad = categoriaRepository.save(Categoria.builder()
            .nombre("Electricidad").slug("electricidad")
            .descripcion("Cables, interruptores, iluminación y más")
            .imagenUrl("/uploads/categorias/electricidad.jpg").activo(true).build());

        Categoria pinturas = categoriaRepository.save(Categoria.builder()
            .nombre("Pinturas").slug("pinturas")
            .descripcion("Pinturas de interior, exterior, esmaltes y accesorios")
            .imagenUrl("/uploads/categorias/pinturas.jpg").activo(true).build());

        Categoria jardinPiscina = categoriaRepository.save(Categoria.builder()
            .nombre("Jardín y Piscina").slug("jardin-y-piscina")
            .descripcion("Mangueras, herramientas de jardín, artículos de piscina")
            .imagenUrl("/uploads/categorias/jardin-piscina.jpg").activo(true).build());

        Categoria herrajes = categoriaRepository.save(Categoria.builder()
            .nombre("Herrajes").slug("herrajes")
            .descripcion("Cerraduras, bisagras, manijas y accesorios")
            .imagenUrl("/uploads/categorias/herrajes.jpg").activo(true).build());

        // Subcategorías
        categoriaRepository.saveAll(List.of(
            Categoria.builder().nombre("Destornilladores").slug("destornilladores").categoriaPadre(herramientasManuales).activo(true).build(),
            Categoria.builder().nombre("Llaves").slug("llaves").categoriaPadre(herramientasManuales).activo(true).build(),
            Categoria.builder().nombre("Martillos").slug("martillos").categoriaPadre(herramientasManuales).activo(true).build(),
            Categoria.builder().nombre("Taladros").slug("taladros").categoriaPadre(herramientasElectricas).activo(true).build(),
            Categoria.builder().nombre("Amoladoras").slug("amoladoras").categoriaPadre(herramientasElectricas).activo(true).build(),
            Categoria.builder().nombre("Grifería").slug("griferia").categoriaPadre(sanitarios).activo(true).build(),
            Categoria.builder().nombre("Cables").slug("cables").categoriaPadre(electricidad).activo(true).build(),
            Categoria.builder().nombre("Iluminación").slug("iluminacion").categoriaPadre(electricidad).activo(true).build(),
            Categoria.builder().nombre("Pintura Interior").slug("pintura-interior").categoriaPadre(pinturas).activo(true).build(),
            Categoria.builder().nombre("Pintura Exterior").slug("pintura-exterior").categoriaPadre(pinturas).activo(true).build(),
            Categoria.builder().nombre("Cerraduras").slug("cerraduras").categoriaPadre(herrajes).activo(true).build()
        ));

        log.info("Categorías y subcategorías creadas");
        return List.of(herramientasManuales, herramientasElectricas, sanitarios, electricidad, pinturas, jardinPiscina, herrajes);
    }

    private void seedProductos(List<Categoria> cats) {
        Categoria hm = cats.get(0), he = cats.get(1), san = cats.get(2),
                  elec = cats.get(3), pin = cats.get(4), jar = cats.get(5), herr = cats.get(6);

        List<Producto> productos = List.of(
            // Herramientas Manuales
            buildProducto("Juego de Destornilladores Profesional 10 Piezas", hm, "29990.00", "23990.00", 45, "HM-001", "Stanley", true),
            buildProducto("Martillo Carpintero 450g Mango Fibra", hm, "18500.00", "14800.00", 30, "HM-002", "Tramontina", true),
            buildProducto("Llave Ajustable Cromada 250mm", hm, "15990.00", "12790.00", 50, "HM-003", "Bahco", false),
            buildProducto("Pinza Pico de Loro 250mm", hm, "12990.00", "10390.00", 35, "HM-004", "Knipex", false),
            buildProducto("Cinta Métrica 5m x 25mm Doble Freno", hm, "8990.00", "7190.00", 80, "HM-005", "Stanley", false),

            // Herramientas Eléctricas
            buildProducto("Taladro Percutor 13mm 750W", he, "89990.00", "71990.00", 15, "HE-001", "Bosch", true),
            buildProducto("Amoladora Angular 115mm 900W", he, "62990.00", "50390.00", 20, "HE-002", "DeWalt", true),
            buildProducto("Sierra Caladora 650W Velocidad Variable", he, "74990.00", "59990.00", 12, "HE-003", "Bosch", false),
            buildProducto("Atornillador Inalámbrico 12V con 2 Baterías", he, "109990.00", "87990.00", 8, "HE-004", "Makita", true),
            buildProducto("Lijadora Orbital 240W", he, "45990.00", "36790.00", 18, "HE-005", "Black+Decker", false),

            // Sanitarios
            buildProducto("Grifería Monocomando para Cocina Cromada", san, "45990.00", "36790.00", 25, "SA-001", "FV", true),
            buildProducto("Inodoro Largo Blanco con Mochila", san, "129990.00", "103990.00", 10, "SA-002", "Ferrum", false),
            buildProducto("Caño Termofusión 20mm x 4m", san, "3990.00", "2990.00", 200, "SA-003", "Amanco", false),
            buildProducto("Flexible de Acero Inoxidable 40cm", san, "5990.00", "4790.00", 100, "SA-004", "FV", false),

            // Electricidad
            buildProducto("Cable Unipolar 2.5mm² x 100m Verde/Amarillo", elec, "42990.00", "34390.00", 40, "EL-001", "IMSA", true),
            buildProducto("Térmicas DIN 2x20A Curva C", elec, "12990.00", "10390.00", 60, "EL-002", "Schneider", false),
            buildProducto("Foco LED 12W E27 Luz Fría Pack x 10", elec, "19990.00", "15990.00", 50, "EL-003", "Philips", true),
            buildProducto("Tomacorriente Doble con Toma USB", elec, "8990.00", "7190.00", 70, "EL-004", "Sica", false),

            // Pinturas
            buildProducto("Látex Interior Mate Blanco 20L", pin, "59990.00", "47990.00", 30, "PI-001", "Alba", true),
            buildProducto("Esmalte Sintético Brillante 4L Negro", pin, "34990.00", "27990.00", 25, "PI-002", "Colorín", false),
            buildProducto("Rodillo de Lana 22cm con Bandeja", pin, "7990.00", "6390.00", 40, "PI-003", "Prestigio", false),
            buildProducto("Fijador Sellador al Agua 20L", pin, "39990.00", "31990.00", 20, "PI-004", "Alba", false),

            // Jardín y Piscina
            buildProducto("Manguera Reforzada 1/2\" x 25m con Kit", jar, "22990.00", "18390.00", 35, "JP-001", "Tramontina", true),
            buildProducto("Bordeadora a Explosión 43cc", jar, "159990.00", "127990.00", 6, "JP-002", "Stihl", false),
            buildProducto("Bomba para Piscina 1/2 HP", jar, "189990.00", "151990.00", 5, "JP-003", "Vulcano", false),
            buildProducto("Tijera de Podar Profesional", jar, "14990.00", "11990.00", 20, "JP-004", "Tramontina", false),

            // Herrajes
            buildProducto("Cerradura de Seguridad Doble Paleta", herr, "34990.00", "27990.00", 40, "HR-001", "Prive", true),
            buildProducto("Bisagra Cazoleta 35mm Cierre Suave Pack x 4", herr, "8990.00", "7190.00", 100, "HR-002", "Blum", false),
            buildProducto("Manija de Puerta Roseta Redonda Acero Inox", herr, "15990.00", "12790.00", 30, "HR-003", "Prive", false),
            buildProducto("Pasador Tipo Mariposa 150mm Zincado", herr, "3990.00", "3190.00", 0, "HR-004", "Lioi", false)
        );

        for (Producto p : productos) {
            Producto saved = productoRepository.save(p);
            // Add a placeholder image per product
            imagenProductoRepository.save(ImagenProducto.builder()
                .producto(saved)
                .url("https://placehold.co/600x600/1E3A5F/F97316?text=" + saved.getSku())
                .altText(saved.getNombre())
                .orden(0).principal(true).build());
        }
        log.info("{} productos creados con imágenes placeholder", productos.size());
    }

    private Producto buildProducto(String nombre, Categoria cat, String precioMin, String precioMay,
                                    int stock, String sku, String marca, boolean destacado) {
        String slug = nombre.toLowerCase()
                .replaceAll("[áà]", "a").replaceAll("[éè]", "e").replaceAll("[íì]", "i")
                .replaceAll("[óò]", "o").replaceAll("[úù]", "u").replaceAll("ñ", "n")
                .replaceAll("[^a-z0-9\\s-]", "").replaceAll("[\\s]+", "-")
                .replaceAll("-+", "-").replaceAll("^-|-$", "");

        return Producto.builder()
                .nombre(nombre).slug(slug)
                .descripcion("Descripción detallada de " + nombre + ". Producto de alta calidad marca " + marca + ". Ideal para uso profesional y doméstico.")
                .categoria(cat)
                .precioMinorista(new BigDecimal(precioMin))
                .precioMayorista(new BigDecimal(precioMay))
                .cantidadMinimaMayorista(10)
                .stock(stock).sku(sku).marca(marca)
                .activo(true).destacado(destacado).build();
    }

    private void seedBanners() {
        bannerRepository.saveAll(List.of(
            Banner.builder()
                .titulo("¡Ofertas de Temporada!").subtitulo("Hasta 30% OFF en Herramientas Eléctricas")
                .imagenUrl("https://placehold.co/1200x400/F97316/FFFFFF?text=OFERTAS+DE+TEMPORADA")
                .link("/catalogo/herramientas-electricas").orden(1).activo(true)
                .fechaInicio(LocalDate.now().minusDays(1))
                .fechaFin(LocalDate.now().plusMonths(1)).build(),
            Banner.builder()
                .titulo("Nuevos Productos").subtitulo("Descubrí las últimas novedades en pinturas")
                .imagenUrl("https://placehold.co/1200x400/1E3A5F/FFFFFF?text=NUEVOS+PRODUCTOS")
                .link("/catalogo/pinturas").orden(2).activo(true).build(),
            Banner.builder()
                .titulo("Mayoristas").subtitulo("Registrate y accedé a precios especiales")
                .imagenUrl("https://placehold.co/1200x400/22C55E/FFFFFF?text=PRECIOS+MAYORISTAS")
                .link("/mayoristas").orden(3).activo(true).build()
        ));
        log.info("3 banners creados");
    }

    private void seedBlogPosts() {
        Usuario admin = usuarioRepository.findByEmail("admin@nanosweb.com").orElse(null);

        blogPostRepository.saveAll(List.of(
            BlogPost.builder()
                .titulo("Cómo Elegir el Taladro Perfecto para tu Proyecto")
                .slug("como-elegir-taladro-perfecto")
                .contenido("""
                    ## ¿Taladro percutor o atornillador?

                    Elegir el taladro correcto depende del tipo de trabajo que vayas a realizar. Acá te contamos las diferencias principales.

                    ### Taladro Percutor
                    Ideal para perforar **mampostería, hormigón y ladrillo**. La función de percusión permite que la broca golpee mientras gira, facilitando la penetración en materiales duros.

                    ### Atornillador Inalámbrico
                    Perfecto para **atornillar y desatornillar** en madera, yeso y materiales blandos. Su diseño compacto y portátil lo hace ideal para trabajos cotidianos.

                    ### ¿Qué potencia necesito?
                    - **Uso doméstico**: 500-700W
                    - **Uso semi-profesional**: 700-1000W
                    - **Uso profesional**: 1000W en adelante

                    ### Recomendación Nano's Ferretería
                    Para el hogar, te recomendamos nuestro **Taladro Percutor Bosch 750W** que combina potencia y versatilidad a un precio accesible.

                    ¡Consultanos por WhatsApp para asesoramiento personalizado!
                    """)
                .imagenUrl("https://placehold.co/800x400/1E3A5F/F97316?text=TALADROS")
                .metaDescription("Guía completa para elegir el taladro perfecto. Diferencias entre percutor y atornillador, potencias recomendadas y más.")
                .publicado(true).autor(admin).publishedAt(LocalDateTime.now().minusDays(5)).build(),

            BlogPost.builder()
                .titulo("5 Herramientas Esenciales que Todo Hogar Necesita")
                .slug("5-herramientas-esenciales-hogar")
                .contenido("""
                    ## Las herramientas que no pueden faltar

                    No hace falta ser un profesional para tener un set básico de herramientas en casa. Estas 5 te van a sacar de apuros:

                    ### 1. Destornillador Múltiple
                    Un buen juego de destornilladores con puntas intercambiables te permite resolver la mayoría de los arreglos domésticos.

                    ### 2. Cinta Métrica
                    Imprescindible para cualquier medición. Recomendamos una de 5 metros como mínimo.

                    ### 3. Martillo Carpintero
                    El clásico que nunca falla. Elegí uno con mango de fibra para mayor durabilidad.

                    ### 4. Pinza Pico de Loro
                    Versátil para plomería y tareas generales. La boca ajustable la hace útil en muchas situaciones.

                    ### 5. Llave Ajustable
                    Una llave francesa de 250mm cubre la mayoría de las tuercas y bulones domésticos.

                    ### Conclusión
                    Con estas 5 herramientas básicas vas a poder resolver la mayoría de los arreglos del hogar. ¡Visitá nuestra ferretería para armar tu kit!
                    """)
                .imagenUrl("https://placehold.co/800x400/F97316/FFFFFF?text=5+HERRAMIENTAS")
                .metaDescription("Descubrí las 5 herramientas esenciales que todo hogar necesita. Guía práctica para armar tu kit básico de herramientas.")
                .publicado(true).autor(admin).publishedAt(LocalDateTime.now().minusDays(10)).build()
        ));
        log.info("2 blog posts creados");
    }

    private void seedSucursales() {
        sucursalRepository.save(
            Sucursal.builder()
                .nombre("Nano's Ferretería")
                .direccion("Los Pescadores 871, Mendoza, Argentina")
                .telefono("(0261) 541-4663")
                .whatsapp("5492615414663")
                .horarios("Lunes a Sábados: 10:00 a 13:00")
                .googleMapsUrl("https://www.google.com/maps/search/?api=1&query=Los+Pescadores+871+Mendoza+Argentina")
                .latitud(new BigDecimal("-32.8900000"))
                .longitud(new BigDecimal("-68.8450000"))
                .principal(true).build()
        );
        log.info("Sucursal Mendoza creada");
    }
}
