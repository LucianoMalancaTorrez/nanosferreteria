package com.nanosweb.ferreteria.repository;

import com.nanosweb.ferreteria.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    Optional<Categoria> findBySlug(String slug);

    List<Categoria> findByCategoriaPadreIsNullAndActivoTrueOrderByNombreAsc();

    List<Categoria> findByCategoriaPadreIdAndActivoTrue(Long padreId);

    List<Categoria> findByActivoTrue();

    long countByActivoTrue();

    @Query("SELECT c.slug FROM Categoria c WHERE c.activo = true")
    List<String> findAllSlugsActivos();
}
