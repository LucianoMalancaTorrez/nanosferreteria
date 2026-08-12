package com.nanosweb.ferreteria.repository;

import com.nanosweb.ferreteria.model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {

    @Query("SELECT b FROM Banner b WHERE b.activo = true " +
           "AND (b.fechaInicio IS NULL OR b.fechaInicio <= CURRENT_DATE) " +
           "AND (b.fechaFin IS NULL OR b.fechaFin >= CURRENT_DATE) " +
           "ORDER BY b.orden ASC")
    List<Banner> findActiveBanners();

    List<Banner> findAllByOrderByOrdenAsc();
}
