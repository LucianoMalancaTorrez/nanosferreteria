package com.nanosweb.ferreteria.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class BlogPostResponse {
    private Long id;
    private String titulo;
    private String slug;
    private String contenido;
    private String imagenUrl;
    private String metaDescription;
    private Boolean publicado;
    private String autorNombre;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
