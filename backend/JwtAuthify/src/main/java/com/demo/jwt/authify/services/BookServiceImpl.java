package com.demo.jwt.authify.services;

import com.demo.jwt.authify.constants.ErrorMessages;
import com.demo.jwt.authify.entity.BookEntity;
import com.demo.jwt.authify.exceptions.AppExceptions;
import com.demo.jwt.authify.io.BookRequest;
import com.demo.jwt.authify.repository.BookRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    @PersistenceContext
    private final EntityManager entityManager;
    private final BookRepository bookRepository;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addBook(BookRequest bookRequest) {
        BookEntity book = convertToBookEntity(bookRequest);
        bookRepository.save(book);
    }

    @Override
    public Page<BookEntity> getAllBooks(int page, int size, String sortBy, String sortDir) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<BookEntity> query = cb.createQuery(BookEntity.class);
        Root<BookEntity> book = query.from(BookEntity.class);

        // Apply sorting
        if (sortDir.equalsIgnoreCase("asc")) {
            query.orderBy(cb.asc(book.get(sortBy)));
        } else {
            query.orderBy(cb.desc(book.get(sortBy)));
        }

        // Fetch paginated data
        List<BookEntity> resultList = entityManager.createQuery(query)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();

        // Total count
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        countQuery.select(cb.count(countQuery.from(BookEntity.class)));
        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, PageRequest.of(page, size), totalRecords);
    }

    @Override
    public Optional<BookEntity> getBook(Long id) {
        return bookRepository.findById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateBook(BookRequest bookRequest, Long id) {
        BookEntity existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new AppExceptions.BookNotFoundException(ErrorMessages.BOOK_NOT_FOUND));

        BeanUtils.copyProperties(bookRequest, existingBook, "bookId", "createdAt", "updatedAt");
        bookRepository.save(existingBook);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteBook(Long id) {
        bookRepository.findById(id)
                .orElseThrow(() -> new AppExceptions.BookNotFoundException(ErrorMessages.BOOK_NOT_FOUND));
        bookRepository.deleteById(id);
    }

    @Override
    public Page<BookEntity> searchBooks(Long bookId, String bookTitle, String author, String genre, int page, int size, String sortBy, String sortDir) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<BookEntity> query = cb.createQuery(BookEntity.class);
        Root<BookEntity> book = query.from(BookEntity.class);

        List<Predicate> predicates = buildPredicates(cb, book, bookId, bookTitle, author, genre);
        query.where(cb.and(predicates.toArray(new Predicate[0])));

        if (sortDir.equalsIgnoreCase("asc")) {
            query.orderBy(cb.asc(book.get(sortBy)));
        } else {
            query.orderBy(cb.desc(book.get(sortBy)));
        }

        List<BookEntity> resultList = entityManager.createQuery(query)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<BookEntity> countRoot = countQuery.from(BookEntity.class);

        List<Predicate> countPredicates = buildPredicates(cb, countRoot, bookId, bookTitle, author, genre);

        countQuery.select(cb.count(countRoot)).where(cb.and(countPredicates.toArray(new Predicate[0])));
        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, PageRequest.of(page, size), totalRecords);
    }

    private List<Predicate> buildPredicates(CriteriaBuilder cb, Root<BookEntity> root,
                                            Long bookId, String bookTitle, String author, String genre) {
        List<Predicate> predicates = new ArrayList<>();

        if (bookId != null) {
            predicates.add(cb.equal(root.get("bookId"), bookId));
        }
        if (bookTitle != null && !bookTitle.trim().isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("bookTitle")), "%" + bookTitle.trim().toLowerCase() + "%"));
        }
        if (author != null && !author.trim().isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("author")), "%" + author.trim().toLowerCase() + "%"));
        }
        if (genre != null && !genre.trim().isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("genre")), "%" + genre.trim().toLowerCase() + "%"));
        }
        return predicates;
    }

    private BookEntity convertToBookEntity(BookRequest bookRequest) {
        return BookEntity.builder()
                .bookTitle(bookRequest.getBookTitle())
                .genre(bookRequest.getGenre())
                .availableCopies(bookRequest.getAvailableCopies())
                .edition(bookRequest.getEdition())
                .language(bookRequest.getLanguage())
                .publisher(bookRequest.getPublisher())
                .quantity(bookRequest.getQuantity())
                .author(bookRequest.getAuthor())
                .build();
    }
}
