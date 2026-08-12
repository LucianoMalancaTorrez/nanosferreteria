package com.nanosweb.ferreteria.repository;

import com.nanosweb.ferreteria.model.Usuario;
import com.nanosweb.ferreteria.model.enums.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Usuario> findByRolAndAprobadoFalse(Rol rol);

    List<Usuario> findByRol(Rol rol);

    long countByRolAndAprobadoFalse(Rol rol);
}
