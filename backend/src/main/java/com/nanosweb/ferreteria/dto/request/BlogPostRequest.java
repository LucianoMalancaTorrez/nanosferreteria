package com.nanosweb.ferreteria.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BlogPostRequest {

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 200)
    private String titulo;

    @NotBlank(message = "El contenido es obligatorio")
    private String contenido;

    private String imagenUrl;

    @Size(max = 300)
    private String metaDescription;

    private Boolean publicado = false;
}
