package com.nanosweb.ferreteria.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "productos")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(nullable = false, unique = true, length = 220)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(name = "precio_minorista", nullable = false, precision = 12, scale = 2)
    private BigDecimal precioMinorista;

    @Column(name = "precio_mayorista", precision = 12, scale = 2)
    private BigDecimal precioMayorista;

    @Column(name = "cantidad_minima_mayorista")
    @Builder.Default
    private Integer cantidadMinimaMayorista = 10;

    @Column(nullable = false)
    @Builder.Default
    private Integer stock = 0;

    @Column(length = 50)
    private String sku;

    @Column(length = 100)
    private String marca;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean destacado = false;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<ImagenProducto> imagenes = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addImagen(ImagenProducto imagen) {
        imagenes.add(imagen);
        imagen.setProducto(this);
    }

    public void removeImagen(ImagenProducto imagen) {
        imagenes.remove(imagen);
        imagen.setProducto(null);
    }
}
