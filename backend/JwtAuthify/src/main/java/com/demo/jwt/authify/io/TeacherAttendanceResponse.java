package com.demo.jwt.authify.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherAttendanceResponse {
    Long teacherId;
    String teacherImageUrl;
    String teacherName;
    String classTeacherOf;
    String attendanceStatus;
    LocalDate attendanceDate;
}
