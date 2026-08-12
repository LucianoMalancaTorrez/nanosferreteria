package com.nanosweb.ferreteria.repository;

import com.nanosweb.ferreteria.model.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    Optional<BlogPost> findBySlug(String slug);

    Page<BlogPost> findByPublicadoTrueOrderByPublishedAtDesc(Pageable pageable);

    List<BlogPost> findTop3ByPublicadoTrueOrderByPublishedAtDesc();

    @Query("SELECT b.slug FROM BlogPost b WHERE b.publicado = true")
    List<String> findAllSlugsPublicados();
}
