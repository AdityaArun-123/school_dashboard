package com.demo.jwt.authify.services;

import com.demo.jwt.authify.entity.StudentEntity;
import com.demo.jwt.authify.io.StudentRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface StudentService {
    void addStudent(StudentRequest studentRequest, MultipartFile file);
    Page<StudentEntity> getAllStudents(int page, int size, String sortBy, String sortDir);
    Optional<StudentEntity> getStudent(Long id);
    void updateStudent(StudentRequest studentRequest, MultipartFile file, Long id);
    void deleteStudent(Long id);
    Page<StudentEntity> searchStudents(Long admissionId, String name, Integer studentClass, Long phoneNumber, int page, int size, String sortBy, String sortDir);
    Page<StudentEntity> getStudentsByClassAndSection(int page, int size, Integer studentClass, String section);
}
