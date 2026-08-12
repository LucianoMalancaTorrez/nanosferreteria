package com.nanosweb.ferreteria.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BannerRequest {

    @NotBlank(message = "La imagen es obligatoria")
    private String imagenUrl;

    private String titulo;
    private String subtitulo;
    private String link;
    private Integer orden = 0;
    private Boolean activo = true;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}
