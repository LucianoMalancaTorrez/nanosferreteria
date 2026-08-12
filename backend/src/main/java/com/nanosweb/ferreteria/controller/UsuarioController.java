package com.nanosweb.ferreteria.controller;

import com.nanosweb.ferreteria.dto.response.UsuarioResponse;
import com.nanosweb.ferreteria.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> findAll() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @GetMapping("/mayoristas")
    public ResponseEntity<List<UsuarioResponse>> findMayoristas() {
        return ResponseEntity.ok(usuarioService.findMayoristas());
    }

    @GetMapping("/mayoristas/pendientes")
    public ResponseEntity<List<UsuarioResponse>> findPendientes() {
        return ResponseEntity.ok(usuarioService.findMayoristasPendientes());
    }

    @PutMapping("/{id}/aprobar")
    public ResponseEntity<UsuarioResponse> aprobar(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.aprobar(id));
    }

    @PutMapping("/{id}/rechazar")
    public ResponseEntity<UsuarioResponse> rechazar(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.rechazar(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Usuario eliminado"));
    }
}
