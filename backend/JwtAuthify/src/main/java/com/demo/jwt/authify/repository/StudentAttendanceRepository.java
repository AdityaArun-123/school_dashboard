package com.demo.jwt.authify.repository;

import com.demo.jwt.authify.entity.StudentAttendanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface StudentAttendanceRepository extends JpaRepository<StudentAttendanceEntity, Long> {
    List<StudentAttendanceEntity> findByAttendanceDateAndStudent_StudentClassAndStudent_Section(
            LocalDate attendanceDate, Integer studentClass, String section);
}
