package com.nanosweb.ferreteria.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class UsuarioResponse {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String empresa;
    private String cuit;
    private String rol;
    private Boolean aprobado;
    private LocalDateTime createdAt;
}
