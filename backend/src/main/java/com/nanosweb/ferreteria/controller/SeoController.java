package com.nanosweb.ferreteria.controller;

import com.nanosweb.ferreteria.repository.BlogPostRepository;
import com.nanosweb.ferreteria.repository.CategoriaRepository;
import com.nanosweb.ferreteria.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seo")
@RequiredArgsConstructor
public class SeoController {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final BlogPostRepository blogPostRepository;

    @GetMapping("/urls")
    public ResponseEntity<Map<String, List<String>>> getUrls() {
        Map<String, List<String>> urls = new HashMap<>();
        urls.put("productos", productoRepository.findAllSlugsActivos());
        urls.put("categorias", categoriaRepository.findAllSlugsActivos());
        urls.put("blog", blogPostRepository.findAllSlugsPublicados());
        return ResponseEntity.ok(urls);
    }
}
