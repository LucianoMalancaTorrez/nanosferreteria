package com.nanosweb.ferreteria.controller;

import com.nanosweb.ferreteria.dto.request.BannerRequest;
import com.nanosweb.ferreteria.dto.response.BannerResponse;
import com.nanosweb.ferreteria.service.BannerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping("/api/banners")
    public ResponseEntity<List<BannerResponse>> findActive() {
        return ResponseEntity.ok(bannerService.findActive());
    }

    @GetMapping("/api/admin/banners")
    public ResponseEntity<List<BannerResponse>> findAll() {
        return ResponseEntity.ok(bannerService.findAll());
    }

    @PostMapping("/api/admin/banners")
    public ResponseEntity<BannerResponse> create(@Valid @RequestBody BannerRequest request) {
        return ResponseEntity.ok(bannerService.create(request));
    }

    @PutMapping("/api/admin/banners/{id}")
    public ResponseEntity<BannerResponse> update(@PathVariable Long id, @Valid @RequestBody BannerRequest request) {
        return ResponseEntity.ok(bannerService.update(id, request));
    }

    @DeleteMapping("/api/admin/banners/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        bannerService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Banner eliminado"));
    }
}
