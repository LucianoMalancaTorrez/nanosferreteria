package com.nanosweb.ferreteria.service;

import com.nanosweb.ferreteria.dto.request.BlogPostRequest;
import com.nanosweb.ferreteria.dto.response.BlogPostResponse;
import com.nanosweb.ferreteria.dto.response.PageResponse;
import com.nanosweb.ferreteria.exception.ResourceNotFoundException;
import com.nanosweb.ferreteria.model.BlogPost;
import com.nanosweb.ferreteria.model.Usuario;
import com.nanosweb.ferreteria.repository.BlogPostRepository;
import com.nanosweb.ferreteria.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogPostRepository blogPostRepository;
    private final UsuarioRepository usuarioRepository;

    public PageResponse<BlogPostResponse> findPublished(int page, int size) {
        Page<BlogPost> posts = blogPostRepository.findByPublicadoTrueOrderByPublishedAtDesc(PageRequest.of(page, size));

        List<BlogPostResponse> content = posts.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<BlogPostResponse>builder()
                .content(content)
                .page(posts.getNumber())
                .size(posts.getSize())
                .totalElements(posts.getTotalElements())
                .totalPages(posts.getTotalPages())
                .first(posts.isFirst())
                .last(posts.isLast())
                .build();
    }

    public List<BlogPostResponse> findRecent() {
        return blogPostRepository.findTop3ByPublicadoTrueOrderByPublishedAtDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BlogPostResponse findBySlug(String slug) {
        BlogPost post = blogPostRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog Post", "slug", slug));
        return toResponse(post);
    }

    public List<BlogPostResponse> findAllAdmin() {
        return blogPostRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BlogPostResponse create(BlogPostRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario autor = usuarioRepository.findByEmail(email).orElse(null);

        BlogPost post = BlogPost.builder()
                .titulo(request.getTitulo())
                .slug(generateSlug(request.getTitulo()))
                .contenido(request.getContenido())
                .imagenUrl(request.getImagenUrl())
                .metaDescription(request.getMetaDescription())
                .publicado(request.getPublicado())
                .autor(autor)
                .publishedAt(request.getPublicado() ? LocalDateTime.now() : null)
                .build();

        post = blogPostRepository.save(post);
        return toResponse(post);
    }

    @Transactional
    public BlogPostResponse update(Long id, BlogPostRequest request) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog Post", "id", id));

        post.setTitulo(request.getTitulo());
        post.setSlug(generateSlug(request.getTitulo()));
        post.setContenido(request.getContenido());
        post.setImagenUrl(request.getImagenUrl());
        post.setMetaDescription(request.getMetaDescription());

        if (request.getPublicado() && !post.getPublicado()) {
            post.setPublishedAt(LocalDateTime.now());
        }
        post.setPublicado(request.getPublicado());

        post = blogPostRepository.save(post);
        return toResponse(post);
    }

    @Transactional
    public void delete(Long id) {
        if (!blogPostRepository.existsById(id)) {
            throw new ResourceNotFoundException("Blog Post", "id", id);
        }
        blogPostRepository.deleteById(id);
    }

    private BlogPostResponse toResponse(BlogPost p) {
        return BlogPostResponse.builder()
                .id(p.getId())
                .titulo(p.getTitulo())
                .slug(p.getSlug())
                .contenido(p.getContenido())
                .imagenUrl(p.getImagenUrl())
                .metaDescription(p.getMetaDescription())
                .publicado(p.getPublicado())
                .autorNombre(p.getAutor() != null ? p.getAutor().getNombre() : null)
                .publishedAt(p.getPublishedAt())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    private String generateSlug(String text) {
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
        String slug = normalized.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");

        String baseSlug = slug;
        int counter = 1;
        while (blogPostRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + counter++;
        }
        return slug;
    }
}
