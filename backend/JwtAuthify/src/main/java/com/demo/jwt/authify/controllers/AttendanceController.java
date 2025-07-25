package com.demo.jwt.authify.controllers;

import com.demo.jwt.authify.entity.StudentAttendanceEntity;
import com.demo.jwt.authify.entity.TeacherAttendanceEntity;
import com.demo.jwt.authify.io.*;
import com.demo.jwt.authify.repository.StudentAttendanceRepository;
import com.demo.jwt.authify.services.AttendanceServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceServiceImpl attendanceService;
    private final StudentAttendanceRepository attendanceRepository;

    @PostMapping("/mark-student-attendance")
    public ResponseEntity<ApiResponse<Void>> markStudentAttendance(@RequestBody StudentAttendanceRequest request) {
        Boolean isAttendanceMarked = attendanceService.markStudentAttendance(request);
        if(Boolean.TRUE.equals(isAttendanceMarked)) {
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(null, "Attendance marked successfully.."));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("Failed to upload attendance."));
    }

    @PostMapping("/mark-teacher-attendance")
    public ResponseEntity<ApiResponse<Void>> markTeacherAttendance(@RequestBody TeacherAttendanceRequest request) {
        Boolean isAttendanceMarked = attendanceService.markTeacherAttendance(request);
        if(Boolean.TRUE.equals(isAttendanceMarked)) {
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(null, "Attendance marked successfully.."));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("Failed to upload attendance."));
    }

    @GetMapping("/fetch-all-student-attendance")
    public ResponseEntity<ApiResponse<Page<StudentAttendanceResponse>>> getAllAttendances(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam Integer studentClass,
            @RequestParam String section,
            @RequestParam LocalDate attendanceDate,
            @RequestParam(required = false) String name // Optional
    ) {
        Page<StudentAttendanceEntity> attendancePage =
                attendanceService.getAllStudentAttendances(page, size, studentClass, section, attendanceDate, name);
        if (attendancePage.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("No student attendance records found for the given date."));
        }
        Page<StudentAttendanceResponse> students = attendancePage.map(entity -> new StudentAttendanceResponse(
                entity.getStudent().getAdmissionId(),
                entity.getStudent().getName(),
                entity.getStudent().getStudentClass(),
                entity.getStudent().getSection(),
                entity.getStudent().getStudentImageUrl(),
                entity.getStatus(),
                entity.getAttendanceDate()
        ));
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(students, ""));
    }

    @GetMapping("/fetch-all-teacher-attendance")
    public ResponseEntity<ApiResponse<Page<TeacherAttendanceResponse>>> getAllTeacherAttendances(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam LocalDate attendanceDate,
            @RequestParam(required = false) String name
    ) {
        Page<TeacherAttendanceEntity> attendancePage =
                attendanceService.getAllTeacherAttendances(page, size, attendanceDate, name);
        if (attendancePage.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("No teacher attendance records found for the given date."));
        }
        Page<TeacherAttendanceResponse> teachers = attendancePage.map(entity -> new TeacherAttendanceResponse(
                entity.getTeacher().getTeacherId(),
                entity.getTeacher().getTeacherImageUrl(),
                entity.getTeacher().getName(),
                entity.getTeacher().getClassTeacherOf(),
                entity.getStatus(),
                entity.getAttendanceDate()
        ));

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(teachers, ""));
    }

    @GetMapping("/get-student-teacher-attendance-percent")
    public ResponseEntity<ApiResponse<List<AttendancePercentageResponse>>> getAttendancePercentages(@RequestParam int year) {
        List<AttendancePercentageResponse> data = attendanceService.calculateAttendancePercentages(year);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(data, ""));
    }

}
