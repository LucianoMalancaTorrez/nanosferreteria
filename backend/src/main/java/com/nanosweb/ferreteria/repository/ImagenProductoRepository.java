package com.nanosweb.ferreteria.repository;

import com.nanosweb.ferreteria.model.ImagenProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImagenProductoRepository extends JpaRepository<ImagenProducto, Long> {

    List<ImagenProducto> findByProductoIdOrderByOrdenAsc(Long productoId);
}
