package com.nanosweb.ferreteria.controller;

import com.nanosweb.ferreteria.dto.response.CotizacionResponse;
import com.nanosweb.ferreteria.service.CotizacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/cotizaciones")
@RequiredArgsConstructor
public class AdminCotizacionController {

    private final CotizacionService cotizacionService;

    @GetMapping
    public ResponseEntity<List<CotizacionResponse>> listar() {
        return ResponseEntity.ok(cotizacionService.findAll());
    }

    @PutMapping("/{id}/leida")
    public ResponseEntity<Map<String, String>> marcarLeida(@PathVariable Long id) {
        cotizacionService.marcarLeida(id);
        return ResponseEntity.ok(Map.of("message", "Cotización marcada como leída"));
    }
}
