package com.nanosweb.ferreteria.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CotizacionResponse {
    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    private String materiales;
    private String mensaje;
    private Boolean leida;
    private LocalDateTime createdAt;
}
