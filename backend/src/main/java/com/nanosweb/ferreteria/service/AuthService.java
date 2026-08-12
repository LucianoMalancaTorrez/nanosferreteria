package com.nanosweb.ferreteria.service;

import com.nanosweb.ferreteria.dto.request.LoginRequest;
import com.nanosweb.ferreteria.dto.request.RegisterRequest;
import com.nanosweb.ferreteria.dto.response.AuthResponse;
import com.nanosweb.ferreteria.exception.BusinessException;
import com.nanosweb.ferreteria.model.Usuario;
import com.nanosweb.ferreteria.model.enums.Rol;
import com.nanosweb.ferreteria.repository.UsuarioRepository;
import com.nanosweb.ferreteria.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(request.getEmail());

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));

        if (usuario.getRol() == Rol.MAYORISTA && !usuario.getAprobado()) {
            throw new BusinessException("Tu cuenta mayorista aún no fue aprobada. Contactanos por WhatsApp para más info.");
        }

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .rol(usuario.getRol().name())
                .expiresIn(tokenProvider.getJwtExpiration())
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Ya existe una cuenta con ese email");
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .telefono(request.getTelefono())
                .empresa(request.getEmpresa())
                .cuit(request.getCuit())
                .rol(Rol.MAYORISTA)
                .aprobado(false)
                .build();

        usuarioRepository.save(usuario);

        return AuthResponse.builder()
                .token(null)
                .refreshToken(null)
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .rol(usuario.getRol().name())
                .expiresIn(0L)
                .build();
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BusinessException("Refresh token inválido o expirado");
        }

        String email = tokenProvider.getEmailFromToken(refreshToken);
        String newToken = tokenProvider.generateToken(email);
        String newRefresh = tokenProvider.generateRefreshToken(email);

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));

        return AuthResponse.builder()
                .token(newToken)
                .refreshToken(newRefresh)
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .rol(usuario.getRol().name())
                .expiresIn(tokenProvider.getJwtExpiration())
                .build();
    }
}
