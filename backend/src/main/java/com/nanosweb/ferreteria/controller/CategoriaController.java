package com.nanosweb.ferreteria.controller;

import com.nanosweb.ferreteria.dto.request.CategoriaRequest;
import com.nanosweb.ferreteria.dto.response.CategoriaResponse;
import com.nanosweb.ferreteria.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping("/api/categorias")
    public ResponseEntity<List<CategoriaResponse>> findAll(@RequestParam(defaultValue = "true") boolean tree) {
        if (tree) {
            return ResponseEntity.ok(categoriaService.findAllTree());
        }
        return ResponseEntity.ok(categoriaService.findAll());
    }

    @GetMapping("/api/categorias/{slug}")
    public ResponseEntity<CategoriaResponse> findBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(categoriaService.findBySlug(slug));
    }

    @PostMapping("/api/admin/categorias")
    public ResponseEntity<CategoriaResponse> create(@Valid @RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(categoriaService.create(request));
    }

    @PutMapping("/api/admin/categorias/{id}")
    public ResponseEntity<CategoriaResponse> update(@PathVariable Long id, @Valid @RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(categoriaService.update(id, request));
    }

    @DeleteMapping("/api/admin/categorias/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        categoriaService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Categoría eliminada"));
    }
}
