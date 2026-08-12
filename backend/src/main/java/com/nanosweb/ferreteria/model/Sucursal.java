package com.nanosweb.ferreteria.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "sucursales")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Sucursal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 300)
    private String direccion;

    @Column(length = 30)
    private String telefono;

    @Column(length = 30)
    private String whatsapp;

    @Column(length = 500)
    private String horarios;

    @Column(name = "google_maps_url", length = 1000)
    private String googleMapsUrl;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitud;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitud;

    @Column(nullable = false)
    @Builder.Default
    private Boolean principal = false;
}
