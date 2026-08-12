package com.nanosweb.ferreteria.service;

import com.nanosweb.ferreteria.dto.response.CotizacionResponse;
import com.nanosweb.ferreteria.exception.ResourceNotFoundException;
import com.nanosweb.ferreteria.model.Cotizacion;
import com.nanosweb.ferreteria.repository.CotizacionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CotizacionService {

    private final CotizacionRepository cotizacionRepository;

    @Transactional
    public CotizacionResponse procesarCotizacion(String nombre, String email, String telefono,
                                                  String materiales, String mensaje) {
        Cotizacion cotizacion = Cotizacion.builder()
                .nombre(nombre)
                .email(email)
                .telefono(telefono)
                .materiales(materiales)
                .mensaje(mensaje)
                .leida(false)
                .build();

        cotizacion = cotizacionRepository.save(cotizacion);

        log.info("Nueva cotización #{} de {} ({})", cotizacion.getId(), nombre, email);
        return toResponse(cotizacion);
    }

    public List<CotizacionResponse> findAll() {
        return cotizacionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void marcarLeida(Long id) {
        Cotizacion cotizacion = cotizacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cotización", "id", id));
        cotizacion.setLeida(true);
        cotizacionRepository.save(cotizacion);
    }

    private CotizacionResponse toResponse(Cotizacion c) {
        return CotizacionResponse.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .email(c.getEmail())
                .telefono(c.getTelefono())
                .materiales(c.getMateriales())
                .mensaje(c.getMensaje())
                .leida(c.getLeida())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
