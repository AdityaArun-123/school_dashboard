package com.demo.jwt.authify.repository;

import com.demo.jwt.authify.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<StudentEntity, Long> {
    List<StudentEntity> findByStudentClassAndSection(Integer studentClass, String section);
}
