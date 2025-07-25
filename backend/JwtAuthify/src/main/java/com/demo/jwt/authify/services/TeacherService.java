package com.demo.jwt.authify.services;

import com.demo.jwt.authify.entity.TeacherEntity;
import com.demo.jwt.authify.io.TeacherRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface TeacherService {
    void addTeacher(TeacherRequest teacherRequest, MultipartFile file);
    Page<TeacherEntity> getAllTeachers(int page, int size, String sortBy, String sortDir);
    Optional<TeacherEntity> getTeacher(Long id);
    void updateTeacher(TeacherRequest teacherRequest, MultipartFile file, Long id);
    void deleteTeacher(Long id);
    Page<TeacherEntity> searchTeachers(Long teacherId, String name, String classTeacherOf, String phoneNumber, String salary, int page, int size, String sortBy, String sortDir);
}
