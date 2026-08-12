package com.nanosweb.ferreteria.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class ProductoResponse {
    private Long id;
    private String nombre;
    private String slug;
    private String descripcion;
    private Long categoriaId;
    private String categoriaNombre;
    private String categoriaSlug;
    private BigDecimal precioMinorista;
    private BigDecimal precioMayorista;
    private Integer cantidadMinimaMayorista;
    private Integer stock;
    private String sku;
    private String marca;
    private Boolean activo;
    private Boolean destacado;
    private List<ImagenResponse> imagenes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @AllArgsConstructor
    public static class ImagenResponse {
        private Long id;
        private String url;
        private String altText;
        private Integer orden;
        private Boolean principal;
    }
}
