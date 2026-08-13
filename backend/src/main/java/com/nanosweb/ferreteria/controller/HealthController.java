package com.nanosweb.ferreteria.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Health check endpoint for diagnostics.
 * Helps verify that Railway has deployed the latest code.
 */
@RestController
public class HealthController {

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "version", "2.0-cors-fix",
                "timestamp", LocalDateTime.now().toString(),
                "cors", "servlet-filter-enabled"
        ));
    }
}
