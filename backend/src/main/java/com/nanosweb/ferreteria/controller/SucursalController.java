package com.nanosweb.ferreteria.controller;

import com.nanosweb.ferreteria.dto.response.SucursalResponse;
import com.nanosweb.ferreteria.service.SucursalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SucursalController {

    private final SucursalService sucursalService;

    @GetMapping("/api/sucursales")
    public ResponseEntity<List<SucursalResponse>> findAll() {
        return ResponseEntity.ok(sucursalService.findAll());
    }
}
