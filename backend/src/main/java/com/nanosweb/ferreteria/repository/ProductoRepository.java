package com.nanosweb.ferreteria.repository;

import com.nanosweb.ferreteria.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    Optional<Producto> findBySlug(String slug);

    List<Producto> findByDestacadoTrueAndActivoTrueOrderByCreatedAtDesc();

    @Query("SELECT p FROM Producto p WHERE p.activo = true " +
           "AND (:categoriaId IS NULL OR p.categoria.id = :categoriaId) " +
           "AND (:marca IS NULL OR p.marca = :marca) " +
           "AND (:precioMin IS NULL OR p.precioMinorista >= :precioMin) " +
           "AND (:precioMax IS NULL OR p.precioMinorista <= :precioMax) " +
           "AND (:disponible IS NULL OR (:disponible = true AND p.stock > 0) OR :disponible = false)")
    Page<Producto> findWithFilters(
            @Param("categoriaId") Long categoriaId,
            @Param("marca") String marca,
            @Param("precioMin") BigDecimal precioMin,
            @Param("precioMax") BigDecimal precioMax,
            @Param("disponible") Boolean disponible,
            Pageable pageable
    );

    @Query("SELECT p FROM Producto p WHERE p.activo = true " +
           "AND (LOWER(p.nombre) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Producto> search(@Param("query") String query, Pageable pageable);

    @Query("SELECT DISTINCT p.marca FROM Producto p WHERE p.marca IS NOT NULL AND p.activo = true ORDER BY p.marca")
    List<String> findAllMarcas();

    long countByActivoTrue();

    List<Producto> findByCategoriaIdAndActivoTrueAndIdNot(Long categoriaId, Long productoId, Pageable pageable);

    @Query("SELECT p.slug FROM Producto p WHERE p.activo = true")
    List<String> findAllSlugsActivos();
}
