package com.nanosweb.ferreteria.service;

import com.nanosweb.ferreteria.dto.request.BannerRequest;
import com.nanosweb.ferreteria.dto.response.BannerResponse;
import com.nanosweb.ferreteria.exception.ResourceNotFoundException;
import com.nanosweb.ferreteria.model.Banner;
import com.nanosweb.ferreteria.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    public List<BannerResponse> findActive() {
        return bannerRepository.findActiveBanners().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<BannerResponse> findAll() {
        return bannerRepository.findAllByOrderByOrdenAsc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BannerResponse create(BannerRequest request) {
        Banner banner = Banner.builder()
                .titulo(request.getTitulo())
                .subtitulo(request.getSubtitulo())
                .imagenUrl(request.getImagenUrl())
                .link(request.getLink())
                .orden(request.getOrden())
                .activo(request.getActivo())
                .fechaInicio(request.getFechaInicio())
                .fechaFin(request.getFechaFin())
                .build();

        banner = bannerRepository.save(banner);
        return toResponse(banner);
    }

    @Transactional
    public BannerResponse update(Long id, BannerRequest request) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner", "id", id));

        banner.setTitulo(request.getTitulo());
        banner.setSubtitulo(request.getSubtitulo());
        banner.setImagenUrl(request.getImagenUrl());
        banner.setLink(request.getLink());
        banner.setOrden(request.getOrden());
        banner.setActivo(request.getActivo());
        banner.setFechaInicio(request.getFechaInicio());
        banner.setFechaFin(request.getFechaFin());

        banner = bannerRepository.save(banner);
        return toResponse(banner);
    }

    @Transactional
    public void delete(Long id) {
        if (!bannerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Banner", "id", id);
        }
        bannerRepository.deleteById(id);
    }

    private BannerResponse toResponse(Banner b) {
        return BannerResponse.builder()
                .id(b.getId())
                .titulo(b.getTitulo())
                .subtitulo(b.getSubtitulo())
                .imagenUrl(b.getImagenUrl())
                .link(b.getLink())
                .orden(b.getOrden())
                .activo(b.getActivo())
                .fechaInicio(b.getFechaInicio())
                .fechaFin(b.getFechaFin())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
