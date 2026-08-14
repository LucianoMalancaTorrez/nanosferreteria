package com.nanosweb.ferreteria.service;

import com.nanosweb.ferreteria.dto.request.CategoriaRequest;
import com.nanosweb.ferreteria.dto.response.CategoriaResponse;
import com.nanosweb.ferreteria.exception.ResourceNotFoundException;
import com.nanosweb.ferreteria.model.Categoria;
import com.nanosweb.ferreteria.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public List<CategoriaResponse> findAllTree() {
        List<Categoria> raices = categoriaRepository.findByCategoriaPadreIsNullAndActivoTrueOrderByNombreAsc();
        return raices.stream().map(this::toResponseWithChildren).collect(Collectors.toList());
    }

    public List<CategoriaResponse> findAll() {
        return categoriaRepository.findByActivoTrue().stream()
                .map(this::toResponseFlat)
                .collect(Collectors.toList());
    }

    public CategoriaResponse findBySlug(String slug) {
        Categoria categoria = categoriaRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "slug", slug));
        return toResponseWithChildren(categoria);
    }

    @Transactional
    public CategoriaResponse create(CategoriaRequest request) {
        Categoria categoria = Categoria.builder()
                .nombre(request.getNombre())
                .slug(generateSlug(request.getNombre()))
                .descripcion(request.getDescripcion())
                .imagenUrl(request.getImagenUrl())
                .activo(request.getActivo())
                .build();

        if (request.getCategoriaPadreId() != null) {
            Categoria padre = categoriaRepository.findById(request.getCategoriaPadreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría padre", "id", request.getCategoriaPadreId()));
            categoria.setCategoriaPadre(padre);
        }

        categoria = categoriaRepository.save(categoria);
        return toResponseFlat(categoria);
    }

    @Transactional
    public CategoriaResponse update(Long id, CategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", id));

        categoria.setNombre(request.getNombre());
        categoria.setSlug(generateSlug(request.getNombre()));
        categoria.setDescripcion(request.getDescripcion());
        categoria.setImagenUrl(request.getImagenUrl());
        categoria.setActivo(request.getActivo());

        if (request.getCategoriaPadreId() != null) {
            Categoria padre = categoriaRepository.findById(request.getCategoriaPadreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría padre", "id", request.getCategoriaPadreId()));
            categoria.setCategoriaPadre(padre);
        } else {
            categoria.setCategoriaPadre(null);
        }

        categoria = categoriaRepository.save(categoria);
        return toResponseFlat(categoria);
    }

    @Transactional
    public void delete(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoría", "id", id);
        }
        categoriaRepository.deleteById(id);
    }

    public long count() {
        return categoriaRepository.countByActivoTrue();
    }

    // --- Helpers ---

    private CategoriaResponse toResponseWithChildren(Categoria c) {
        List<CategoriaResponse> subs = c.getSubcategorias().stream()
                .filter(Categoria::getActivo)
                .map(this::toResponseWithChildren)
                .collect(Collectors.toList());

        return CategoriaResponse.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .slug(c.getSlug())
                .descripcion(c.getDescripcion())
                .imagenUrl(c.getImagenUrl())
                .categoriaPadreId(c.getCategoriaPadre() != null ? c.getCategoriaPadre().getId() : null)
                .categoriaPadreNombre(c.getCategoriaPadre() != null ? c.getCategoriaPadre().getNombre() : null)
                .activo(c.getActivo())
                .subcategorias(subs)
                .productCount((long) c.getProductos().size())
                .build();
    }

    private CategoriaResponse toResponseFlat(Categoria c) {
        return CategoriaResponse.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .slug(c.getSlug())
                .descripcion(c.getDescripcion())
                .imagenUrl(c.getImagenUrl())
                .categoriaPadreId(c.getCategoriaPadre() != null ? c.getCategoriaPadre().getId() : null)
                .categoriaPadreNombre(c.getCategoriaPadre() != null ? c.getCategoriaPadre().getNombre() : null)
                .activo(c.getActivo())
                .subcategorias(List.of())
                .productCount(0L)
                .build();
    }

    private String generateSlug(String text) {
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
        String slug = normalized.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");

        String baseSlug = slug;
        int counter = 1;
        while (categoriaRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + counter++;
        }
        return slug;
    }
}
