package com.demo.jwt.authify.services;

import com.demo.jwt.authify.entity.StudentAttendanceEntity;
import com.demo.jwt.authify.entity.TeacherAttendanceEntity;
import com.demo.jwt.authify.io.AttendancePercentageResponse;
import com.demo.jwt.authify.io.StudentAttendanceRequest;
import com.demo.jwt.authify.io.TeacherAttendanceRequest;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    Boolean markStudentAttendance(StudentAttendanceRequest request);

    Boolean markTeacherAttendance(TeacherAttendanceRequest request);

    Page<StudentAttendanceEntity> getAllStudentAttendances(int page, int size, Integer studentClass, String section, LocalDate attendanceDate, String name);

    Page<TeacherAttendanceEntity> getAllTeacherAttendances(int page, int size, LocalDate attendanceDate, String name);

    List<AttendancePercentageResponse> calculateAttendancePercentages(Integer year);
}
