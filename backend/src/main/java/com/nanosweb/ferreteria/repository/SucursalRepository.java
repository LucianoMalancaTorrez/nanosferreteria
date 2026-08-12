package com.nanosweb.ferreteria.repository;

import com.nanosweb.ferreteria.model.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SucursalRepository extends JpaRepository<Sucursal, Long> {

    List<Sucursal> findAllByOrderByPrincipalDescNombreAsc();
}
