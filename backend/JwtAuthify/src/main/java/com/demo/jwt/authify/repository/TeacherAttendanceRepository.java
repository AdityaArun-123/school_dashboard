package com.demo.jwt.authify.repository;

import com.demo.jwt.authify.entity.TeacherAttendanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TeacherAttendanceRepository extends JpaRepository<TeacherAttendanceEntity, Long> {
    List<TeacherAttendanceEntity> findByAttendanceDate(LocalDate attendanceDate);
}
