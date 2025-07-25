package com.demo.jwt.authify.controllers;

import com.demo.jwt.authify.entity.TeacherEntity;
import com.demo.jwt.authify.io.ApiResponse;
import com.demo.jwt.authify.io.TeacherRequest;
import com.demo.jwt.authify.services.TeacherServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherServiceImpl teacherService;

    @PostMapping("/add-teacher")
    public ResponseEntity<ApiResponse<Object>> addTeacher(@RequestPart("teacher") TeacherRequest teacherRequest,
                                                          @RequestPart(value = "file", required = false) MultipartFile file) {
        teacherService.addTeacher(teacherRequest, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(null, "Teacher added successfully.."));
    }

    @GetMapping("/fetch-all-teachers")
    public ResponseEntity<ApiResponse<Page<TeacherEntity>>> fetchAllTeachers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "teacherId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Page<TeacherEntity> teachers = teacherService.getAllTeachers(page, size, sortBy, sortDir);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(teachers, ""));
    }

    @GetMapping("/fetch-teacher")
    public ResponseEntity<ApiResponse<Optional<TeacherEntity>>> fetchTeacher(@RequestParam(value = "id") Long teacherId) {
        Optional<TeacherEntity> teacher = teacherService.getTeacher(teacherId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(teacher, "Successfully fetched the teacher details.."));
    }

    @PostMapping("/update-teacher")
    public ResponseEntity<ApiResponse<Object>> updateTeacher(@RequestParam(value = "id") Long teacherId,
                                                             @RequestPart("teacher") TeacherRequest teacherRequest,
                                                             @RequestPart(value = "file", required = false) MultipartFile file) {
        teacherService.updateTeacher(teacherRequest, file, teacherId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(null, "Record updated successfully.."));
    }

    @DeleteMapping("/delete-teacher")
    public ResponseEntity<ApiResponse<Object>> deleteTeacher(@RequestParam(value = "id") Long teacherId) {
        teacherService.deleteTeacher(teacherId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success(null, "Record deleted successfully.."));
    }

    @GetMapping("/search-teacher")
    public ResponseEntity<ApiResponse<Page<TeacherEntity>>> searchTeachers(
            @RequestParam(required = false) Long teacherId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String classTeacherOf,
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) String salary,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "teacherId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Page<TeacherEntity> teachers = teacherService.searchTeachers(
                teacherId, name, classTeacherOf, phoneNumber,salary , page, size, sortBy,
                sortDir);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(teachers, ""));
    }
}
