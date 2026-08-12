package com.nanosweb.ferreteria.controller;

import com.nanosweb.ferreteria.dto.request.CotizacionRequest;
import com.nanosweb.ferreteria.service.CotizacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cotizaciones")
@RequiredArgsConstructor
public class CotizacionController {

    private final CotizacionService cotizacionService;

    @PostMapping
    public ResponseEntity<Map<String, String>> crear(@Valid @RequestBody CotizacionRequest request) {
        cotizacionService.procesarCotizacion(
                request.getNombre(), request.getEmail(), request.getTelefono(),
                request.getMateriales(), request.getMensaje()
        );
        return ResponseEntity.ok(Map.of(
                "message", "Solicitud de cotización recibida. Nos comunicaremos pronto."
        ));
    }
}
