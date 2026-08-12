package com.nanosweb.ferreteria.controller;

import com.nanosweb.ferreteria.dto.request.LoginRequest;
import com.nanosweb.ferreteria.dto.request.RegisterRequest;
import com.nanosweb.ferreteria.dto.response.AuthResponse;
import com.nanosweb.ferreteria.dto.response.UsuarioResponse;
import com.nanosweb.ferreteria.service.AuthService;
import com.nanosweb.ferreteria.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(Map.of(
                "message", "Registro exitoso. Tu cuenta mayorista será revisada y aprobada por un administrador."
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> me(Authentication authentication) {
        return ResponseEntity.ok(usuarioService.findByEmail(authentication.getName()));
    }
}
