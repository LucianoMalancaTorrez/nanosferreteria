package com.nanosweb.ferreteria.controller;

import com.nanosweb.ferreteria.dto.request.BlogPostRequest;
import com.nanosweb.ferreteria.dto.response.BlogPostResponse;
import com.nanosweb.ferreteria.dto.response.PageResponse;
import com.nanosweb.ferreteria.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @GetMapping("/api/blog")
    public ResponseEntity<PageResponse<BlogPostResponse>> findPublished(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogService.findPublished(page, size));
    }

    @GetMapping("/api/blog/recientes")
    public ResponseEntity<List<BlogPostResponse>> findRecent() {
        return ResponseEntity.ok(blogService.findRecent());
    }

    @GetMapping("/api/blog/{slug}")
    public ResponseEntity<BlogPostResponse> findBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.findBySlug(slug));
    }

    @GetMapping("/api/admin/blog")
    public ResponseEntity<List<BlogPostResponse>> findAllAdmin() {
        return ResponseEntity.ok(blogService.findAllAdmin());
    }

    @PostMapping("/api/admin/blog")
    public ResponseEntity<BlogPostResponse> create(@Valid @RequestBody BlogPostRequest request) {
        return ResponseEntity.ok(blogService.create(request));
    }

    @PutMapping("/api/admin/blog/{id}")
    public ResponseEntity<BlogPostResponse> update(@PathVariable Long id, @Valid @RequestBody BlogPostRequest request) {
        return ResponseEntity.ok(blogService.update(id, request));
    }

    @DeleteMapping("/api/admin/blog/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        blogService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Post eliminado"));
    }
}
