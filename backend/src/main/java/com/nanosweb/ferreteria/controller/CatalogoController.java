package com.nanosweb.ferreteria.controller;

import com.nanosweb.ferreteria.service.CatalogoPdfService;
import com.nanosweb.ferreteria.service.CategoriaService;
import com.nanosweb.ferreteria.service.ProductoService;
import com.nanosweb.ferreteria.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CatalogoController {

    private final CatalogoPdfService catalogoPdfService;
    private final ProductoService productoService;
    private final CategoriaService categoriaService;
    private final UsuarioService usuarioService;

    @GetMapping("/api/catalogo/pdf")
    public ResponseEntity<Resource> downloadCatalog() throws IOException {
        Path pdfPath = catalogoPdfService.getCatalogPath();
        if (!Files.exists(pdfPath)) {
            catalogoPdfService.generateCatalog();
        }

        Resource resource = new FileSystemResource(pdfPath);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"catalogo-nanosweb.pdf\"")
                .body(resource);
    }

    @PostMapping("/api/admin/catalogo/generar")
    public ResponseEntity<Map<String, String>> regenerateCatalog() throws IOException {
        catalogoPdfService.generateCatalog();
        return ResponseEntity.ok(Map.of("message", "Catálogo PDF regenerado exitosamente"));
    }

    @GetMapping("/api/admin/dashboard/stats")
    public ResponseEntity<Map<String, Object>> dashboardStats() {
        return ResponseEntity.ok(Map.of(
                "totalProductos", productoService.count(),
                "totalCategorias", categoriaService.count(),
                "mayoristasPendientes", usuarioService.countPendientes()
        ));
    }
}
