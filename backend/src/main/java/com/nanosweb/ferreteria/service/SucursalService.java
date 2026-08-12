package com.nanosweb.ferreteria.service;

import com.nanosweb.ferreteria.dto.response.SucursalResponse;
import com.nanosweb.ferreteria.model.Sucursal;
import com.nanosweb.ferreteria.repository.SucursalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SucursalService {

    private final SucursalRepository sucursalRepository;

    public List<SucursalResponse> findAll() {
        return sucursalRepository.findAllByOrderByPrincipalDescNombreAsc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private SucursalResponse toResponse(Sucursal s) {
        return SucursalResponse.builder()
                .id(s.getId())
                .nombre(s.getNombre())
                .direccion(s.getDireccion())
                .telefono(s.getTelefono())
                .whatsapp(s.getWhatsapp())
                .horarios(s.getHorarios())
                .googleMapsUrl(s.getGoogleMapsUrl())
                .latitud(s.getLatitud())
                .longitud(s.getLongitud())
                .principal(s.getPrincipal())
                .build();
    }
}
