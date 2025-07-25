package com.demo.jwt.authify.controllers;

import com.demo.jwt.authify.entity.StudentEntity;
import com.demo.jwt.authify.io.StudentRequest;
import com.demo.jwt.authify.io.ApiResponse;
import com.demo.jwt.authify.services.StudentServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentServiceImpl studentService;

    @PostMapping("/add-student")
    public ResponseEntity<ApiResponse<Object>> addStudent(@RequestPart("student") StudentRequest studentRequest,
                                                        @RequestPart(value = "file", required = false) MultipartFile file) {
        studentService.addStudent(studentRequest, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(null, "Student added successfully.."));
    }

    @GetMapping("/fetch-all-students")
    public ResponseEntity<ApiResponse<Page<StudentEntity>>> fetchAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "admissionId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Page<StudentEntity> students = studentService.getAllStudents(page, size, sortBy, sortDir);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(students, ""));
    }

    @GetMapping("/fetch-students-by-class-section")
    public ResponseEntity<ApiResponse<Page<StudentEntity>>> fetchStudentsByClassAndSection(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam Integer studentClass,
            @RequestParam String section) {

        Page<StudentEntity> students = studentService.getStudentsByClassAndSection(page, size, studentClass, section);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(students, ""));
    }

    @GetMapping("/fetch-student")
    public ResponseEntity<ApiResponse<Optional<StudentEntity>>> fetchStudent(@RequestParam(value = "id") Long admissionId) {
        Optional<StudentEntity> student = studentService.getStudent(admissionId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(student, "Successfully fetched the student details.."));
    }

    @PostMapping("/update-student")
    public ResponseEntity<ApiResponse<Object>> updateStudent(@RequestParam(value = "id") Long admissionId,
                                                             @RequestPart("student") StudentRequest studentRequest,
                                                             @RequestPart(value = "file", required = false) MultipartFile file) {
        studentService.updateStudent(studentRequest, file, admissionId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(null, "Record updated successfully.."));
    }

    @DeleteMapping("/delete-student")
    public ResponseEntity<ApiResponse<Object>> deleteStudent(@RequestParam(value = "id") Long admissionId) {
        studentService.deleteStudent(admissionId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success(null, "Record deleted successfully.."));
    }

    @GetMapping("/search-student")
    public ResponseEntity<ApiResponse<Page<StudentEntity>>> searchStudents(
            @RequestParam(required = false) Long admissionId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer studentClass,
            @RequestParam(required = false) Long phoneNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "admissionId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Page<StudentEntity> students = studentService.searchStudents(
                admissionId, name, studentClass, phoneNumber, page, size, sortBy, sortDir
        );
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(students, ""));
    }
}
