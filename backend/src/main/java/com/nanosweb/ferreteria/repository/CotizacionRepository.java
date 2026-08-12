package com.nanosweb.ferreteria.repository;

import com.nanosweb.ferreteria.model.Cotizacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CotizacionRepository extends JpaRepository<Cotizacion, Long> {
    List<Cotizacion> findAllByOrderByCreatedAtDesc();
}
