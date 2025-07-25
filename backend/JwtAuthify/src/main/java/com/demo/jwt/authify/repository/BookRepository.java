package com.demo.jwt.authify.repository;

import com.demo.jwt.authify.entity.BookEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<BookEntity, Long> {
}
