package com.demo.jwt.authify.services;

import com.demo.jwt.authify.entity.BookEntity;
import com.demo.jwt.authify.io.BookRequest;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface BookService {
    void addBook(BookRequest bookRequest);
    Page<BookEntity> getAllBooks(int page, int size, String sortBy, String sortDir);
    Optional<BookEntity> getBook(Long id);
    void updateBook(BookRequest bookRequest, Long id);
    void deleteBook(Long id);
    Page<BookEntity> searchBooks(Long bookId, String bookTitle, String author, String genre, int page, int size, String sortBy, String sortDir);
}
