package com.demo.jwt.authify.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentAttendanceRequest {
    private LocalDate attendanceDate;
    private Integer studentClass;
    private String section;
    private String markingMode;
    private List<StudentAttendance> students;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentAttendance{
        private Long studentId;
    }
}
