package com.nanosweb.ferreteria.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class SucursalResponse {
    private Long id;
    private String nombre;
    private String direccion;
    private String telefono;
    private String whatsapp;
    private String horarios;
    private String googleMapsUrl;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private Boolean principal;
}
