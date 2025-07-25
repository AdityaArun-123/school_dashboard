package com.demo.jwt.authify.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentAttendanceResponse {
    Long studentAdmissionId;
    String studentName;
    Integer studentClass;
    String section;
    String studentImageUrl;
    String attendanceStatus;
    LocalDate attendanceDate;
}
