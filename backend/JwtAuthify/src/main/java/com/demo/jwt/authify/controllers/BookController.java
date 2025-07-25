package com.demo.jwt.authify.controllers;

import com.demo.jwt.authify.entity.BookEntity;
import com.demo.jwt.authify.io.ApiResponse;
import com.demo.jwt.authify.io.BookRequest;
import com.demo.jwt.authify.services.BookServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/book")
@RequiredArgsConstructor
public class BookController {

    private final BookServiceImpl bookService;

    @PostMapping("/add-book")
    public ResponseEntity<ApiResponse<Object>> addBook(@RequestBody BookRequest bookRequest) {
        bookService.addBook(bookRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(null, "Book added successfully.."));
    }

    @GetMapping("/fetch-all-books")
    public ResponseEntity<ApiResponse<Page<BookEntity>>> fetchAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "bookId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Page<BookEntity> books = bookService.getAllBooks(page, size, sortBy, sortDir);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(books, ""));
    }

    @GetMapping("/fetch-book")
    public ResponseEntity<ApiResponse<Optional<BookEntity>>> fetchBook(@RequestParam(value = "id") Long bookId) {
        Optional<BookEntity> book = bookService.getBook(bookId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(book, "Successfully fetched the Book details.."));
    }

    @PostMapping("/update-book")
    public ResponseEntity<ApiResponse<Object>> updateBook(@RequestParam(value = "id") Long bookId,
                                                          @RequestBody BookRequest bookRequest) {
        bookService.updateBook(bookRequest, bookId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(null, "Record updated successfully.."));
    }

    @DeleteMapping("/delete-book")
    public ResponseEntity<ApiResponse<Object>> deleteBook(@RequestParam(value = "id") Long bookId) {
        bookService.deleteBook(bookId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success(null, "Record deleted successfully.."));
    }

    @GetMapping("/search-book")
    public ResponseEntity<ApiResponse<Page<BookEntity>>> searchBooks(
            @RequestParam(required = false) Long bookId,
            @RequestParam(required = false) String bookTitle,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String genre,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "bookId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Page<BookEntity> books = bookService.searchBooks(bookId, bookTitle, author, genre, page, size, sortBy, sortDir);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(books, ""));
    }
}
