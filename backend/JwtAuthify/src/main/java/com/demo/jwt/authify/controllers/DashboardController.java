package com.demo.jwt.authify.controllers;

import com.demo.jwt.authify.io.ApiResponse;
import com.demo.jwt.authify.repository.BookRepository;
import com.demo.jwt.authify.repository.StudentRepository;
import com.demo.jwt.authify.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final BookRepository bookRepository;

    @GetMapping("/dashboard-counts")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getDashboardCounts() {
        long totalStudents = studentRepository.count();
        long totalTeachers = teacherRepository.count();
        long totalBooks = bookRepository.count();

        Map<String, Long> counts = new HashMap<>();
        counts.put("totalStudents", totalStudents);
        counts.put("totalTeachers", totalTeachers);
        counts.put("totalBooks", totalBooks);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(counts, ""));
    }
}
