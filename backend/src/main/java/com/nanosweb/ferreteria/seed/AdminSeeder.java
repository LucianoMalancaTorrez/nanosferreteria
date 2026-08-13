package com.nanosweb.ferreteria.seed;

import com.nanosweb.ferreteria.model.Usuario;
import com.nanosweb.ferreteria.model.enums.Rol;
import com.nanosweb.ferreteria.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Crea el usuario admin por defecto si no existe.
 * Corre en TODOS los perfiles (dev, prod, etc.) para garantizar
 * que siempre haya un admin disponible.
 */
@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "admin@nanosweb.com";
    private static final String ADMIN_PASSWORD = "Admin123!";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (usuarioRepository.findByEmail(ADMIN_EMAIL).isPresent()) {
            log.info("Usuario admin ya existe, omitiendo creación.");
            return;
        }

        Usuario admin = Usuario.builder()
                .nombre("Admin")
                .apellido("Ferretería")
                .email(ADMIN_EMAIL)
                .passwordHash(passwordEncoder.encode(ADMIN_PASSWORD))
                .rol(Rol.ADMIN)
                .aprobado(true)
                .build();

        usuarioRepository.save(admin);
        log.info("Usuario admin creado: {}", ADMIN_EMAIL);
    }
}
