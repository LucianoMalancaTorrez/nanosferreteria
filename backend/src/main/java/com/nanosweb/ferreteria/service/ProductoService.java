package com.nanosweb.ferreteria.service;

import com.nanosweb.ferreteria.dto.request.ProductoRequest;
import com.nanosweb.ferreteria.dto.response.PageResponse;
import com.nanosweb.ferreteria.dto.response.ProductoResponse;
import com.nanosweb.ferreteria.exception.ResourceNotFoundException;
import com.nanosweb.ferreteria.model.Categoria;
import com.nanosweb.ferreteria.model.ImagenProducto;
import com.nanosweb.ferreteria.model.Producto;
import com.nanosweb.ferreteria.repository.CategoriaRepository;
import com.nanosweb.ferreteria.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public PageResponse<ProductoResponse> findAll(Long categoriaId, String marca,
                                                   BigDecimal precioMin, BigDecimal precioMax,
                                                   Boolean disponible, int page, int size, String sort) {
        Sort sorting = parseSort(sort);
        Pageable pageable = PageRequest.of(page, size, sorting);

        Page<Producto> productos = productoRepository.findWithFilters(
                categoriaId, marca, precioMin, precioMax, disponible, pageable);

        List<ProductoResponse> content = productos.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<ProductoResponse>builder()
                .content(content)
                .page(productos.getNumber())
                .size(productos.getSize())
                .totalElements(productos.getTotalElements())
                .totalPages(productos.getTotalPages())
                .first(productos.isFirst())
                .last(productos.isLast())
                .build();
    }

    public ProductoResponse findBySlug(String slug) {
        Producto producto = productoRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "slug", slug));
        return toResponse(producto);
    }

    public ProductoResponse findById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        return toResponse(producto);
    }

    public List<ProductoResponse> findDestacados() {
        return productoRepository.findByDestacadoTrueAndActivoTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PageResponse<ProductoResponse> search(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Producto> productos = productoRepository.search(query, pageable);

        List<ProductoResponse> content = productos.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<ProductoResponse>builder()
                .content(content)
                .page(productos.getNumber())
                .size(productos.getSize())
                .totalElements(productos.getTotalElements())
                .totalPages(productos.getTotalPages())
                .first(productos.isFirst())
                .last(productos.isLast())
                .build();
    }

    public List<String> findAllMarcas() {
        return productoRepository.findAllMarcas();
    }

    public List<ProductoResponse> findRelacionados(String slug, int limit) {
        Producto producto = productoRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "slug", slug));

        return productoRepository.findByCategoriaIdAndActivoTrueAndIdNot(
                        producto.getCategoria().getId(), producto.getId(), PageRequest.of(0, limit))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductoResponse create(ProductoRequest request) {
        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", request.getCategoriaId()));

        Producto producto = Producto.builder()
                .nombre(request.getNombre())
                .slug(generateSlug(request.getNombre()))
                .descripcion(request.getDescripcion())
                .categoria(categoria)
                .precioMinorista(request.getPrecioMinorista())
                .precioMayorista(request.getPrecioMayorista())
                .cantidadMinimaMayorista(request.getCantidadMinimaMayorista())
                .stock(request.getStock())
                .sku(request.getSku())
                .marca(request.getMarca())
                .activo(request.getActivo())
                .destacado(request.getDestacado())
                .build();

        producto = productoRepository.save(producto);
        return toResponse(producto);
    }

    @Transactional
    public ProductoResponse update(Long id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));

        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", request.getCategoriaId()));

        producto.setNombre(request.getNombre());
        producto.setSlug(generateSlug(request.getNombre()));
        producto.setDescripcion(request.getDescripcion());
        producto.setCategoria(categoria);
        producto.setPrecioMinorista(request.getPrecioMinorista());
        producto.setPrecioMayorista(request.getPrecioMayorista());
        producto.setCantidadMinimaMayorista(request.getCantidadMinimaMayorista());
        producto.setStock(request.getStock());
        producto.setSku(request.getSku());
        producto.setMarca(request.getMarca());
        producto.setActivo(request.getActivo());
        producto.setDestacado(request.getDestacado());

        producto = productoRepository.save(producto);
        return toResponse(producto);
    }

    @Transactional
    public void delete(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto", "id", id);
        }
        productoRepository.deleteById(id);
    }

    public long count() {
        return productoRepository.countByActivoTrue();
    }

    // --- Helpers ---

    public ProductoResponse toResponse(Producto p) {
        List<ProductoResponse.ImagenResponse> imagenes = p.getImagenes().stream()
                .map(img -> ProductoResponse.ImagenResponse.builder()
                        .id(img.getId())
                        .url(img.getUrl())
                        .altText(img.getAltText())
                        .orden(img.getOrden())
                        .principal(img.getPrincipal())
                        .build())
                .sorted((a, b) -> a.getOrden().compareTo(b.getOrden()))
                .collect(Collectors.toList());

        return ProductoResponse.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .slug(p.getSlug())
                .descripcion(p.getDescripcion())
                .categoriaId(p.getCategoria().getId())
                .categoriaNombre(p.getCategoria().getNombre())
                .categoriaSlug(p.getCategoria().getSlug())
                .precioMinorista(p.getPrecioMinorista())
                .precioMayorista(p.getPrecioMayorista())
                .cantidadMinimaMayorista(p.getCantidadMinimaMayorista())
                .stock(p.getStock())
                .sku(p.getSku())
                .marca(p.getMarca())
                .activo(p.getActivo())
                .destacado(p.getDestacado())
                .imagenes(imagenes)
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    public String generateSlug(String text) {
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
        String slug = normalized.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");

        // Ensure uniqueness
        String baseSlug = slug;
        int counter = 1;
        while (productoRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + counter++;
        }
        return slug;
    }

    private Sort parseSort(String sort) {
        if (sort == null || sort.isEmpty()) return Sort.by(Sort.Direction.DESC, "createdAt");
        return switch (sort) {
            case "precio_asc" -> Sort.by(Sort.Direction.ASC, "precioMinorista");
            case "precio_desc" -> Sort.by(Sort.Direction.DESC, "precioMinorista");
            case "nombre_asc" -> Sort.by(Sort.Direction.ASC, "nombre");
            case "nombre_desc" -> Sort.by(Sort.Direction.DESC, "nombre");
            case "recientes" -> Sort.by(Sort.Direction.DESC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}
