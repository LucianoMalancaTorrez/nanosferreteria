package com.nanosweb.ferreteria.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class CategoriaResponse {
    private Long id;
    private String nombre;
    private String slug;
    private String descripcion;
    private String imagenUrl;
    private Long categoriaPadreId;
    private String categoriaPadreNombre;
    private Boolean activo;
    private List<CategoriaResponse> subcategorias;
    private Long productCount;
}
