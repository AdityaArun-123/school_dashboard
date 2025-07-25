package com.demo.jwt.authify.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookRequest {
    private String bookTitle;
    private String author;
    private String genre;
    private String publisher;
    private String edition;
    private Integer quantity;
    private Integer availableCopies;
    private String language;
}
