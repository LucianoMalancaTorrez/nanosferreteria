package com.nanosweb.ferreteria.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductoRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 200)
    private String nombre;

    private String descripcion;

    @NotNull(message = "La categoría es obligatoria")
    private Long categoriaId;

    @NotNull(message = "El precio minorista es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    private BigDecimal precioMinorista;

    @DecimalMin(value = "0.01", message = "El precio mayorista debe ser mayor a 0")
    private BigDecimal precioMayorista;

    @Min(value = 1, message = "La cantidad mínima mayorista debe ser al menos 1")
    private Integer cantidadMinimaMayorista = 10;

    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock = 0;

    @Size(max = 50)
    private String sku;

    @Size(max = 100)
    private String marca;

    private Boolean activo = true;
    private Boolean destacado = false;
}
