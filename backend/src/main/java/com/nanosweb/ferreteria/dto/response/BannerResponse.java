package com.nanosweb.ferreteria.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class BannerResponse {
    private Long id;
    private String titulo;
    private String subtitulo;
    private String imagenUrl;
    private String link;
    private Integer orden;
    private Boolean activo;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private LocalDateTime createdAt;
}
