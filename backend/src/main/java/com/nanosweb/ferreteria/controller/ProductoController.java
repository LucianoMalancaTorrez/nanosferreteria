package com.nanosweb.ferreteria.controller;

import com.nanosweb.ferreteria.dto.request.ProductoRequest;
import com.nanosweb.ferreteria.dto.response.PageResponse;
import com.nanosweb.ferreteria.dto.response.ProductoResponse;
import com.nanosweb.ferreteria.exception.ResourceNotFoundException;
import com.nanosweb.ferreteria.model.ImagenProducto;
import com.nanosweb.ferreteria.model.Producto;
import com.nanosweb.ferreteria.repository.ImagenProductoRepository;
import com.nanosweb.ferreteria.repository.ProductoRepository;
import com.nanosweb.ferreteria.service.ImagenService;
import com.nanosweb.ferreteria.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    // ==================== PUBLIC ====================

    @GetMapping("/api/productos")
    public ResponseEntity<PageResponse<ProductoResponse>> findAll(
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) BigDecimal precioMin,
            @RequestParam(required = false) BigDecimal precioMax,
            @RequestParam(required = false) Boolean disponible,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(productoService.findAll(categoriaId, marca, precioMin, precioMax, disponible, page, size, sort));
    }

    @GetMapping("/api/productos/destacados")
    public ResponseEntity<List<ProductoResponse>> findDestacados() {
        return ResponseEntity.ok(productoService.findDestacados());
    }

    @GetMapping("/api/productos/buscar")
    public ResponseEntity<PageResponse<ProductoResponse>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(productoService.search(q, page, size));
    }

    @GetMapping("/api/productos/marcas")
    public ResponseEntity<List<String>> findAllMarcas() {
        return ResponseEntity.ok(productoService.findAllMarcas());
    }

    @GetMapping("/api/productos/{slug}")
    public ResponseEntity<ProductoResponse> findBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productoService.findBySlug(slug));
    }

    @GetMapping("/api/productos/{slug}/relacionados")
    public ResponseEntity<List<ProductoResponse>> findRelacionados(
            @PathVariable String slug,
            @RequestParam(defaultValue = "4") int limit) {
        return ResponseEntity.ok(productoService.findRelacionados(slug, limit));
    }

    // ==================== ADMIN ====================

    @GetMapping("/api/admin/productos/{id}")
    public ResponseEntity<ProductoResponse> findByIdAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.findById(id));
    }

    @PostMapping("/api/admin/productos")
    public ResponseEntity<ProductoResponse> create(@Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.create(request));
    }

    @PutMapping("/api/admin/productos/{id}")
    public ResponseEntity<ProductoResponse> update(@PathVariable Long id, @Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.update(id, request));
    }

    @DeleteMapping("/api/admin/productos/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        productoService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Producto eliminado"));
    }

    @PostMapping(value = "/api/admin/productos/{id}/imagenes", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadImages(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files) throws IOException {

        productoService.uploadImages(id, files);
        return ResponseEntity.ok(Map.of("message", files.size() + " imagen(es) subida(s)"));
    }

    @DeleteMapping("/api/admin/productos/{id}/imagenes/{imgId}")
    public ResponseEntity<Map<String, String>> deleteImage(
            @PathVariable Long id, @PathVariable Long imgId) throws IOException {

        productoService.deleteImage(id, imgId);
        return ResponseEntity.ok(Map.of("message", "Imagen eliminada"));
    }
}
