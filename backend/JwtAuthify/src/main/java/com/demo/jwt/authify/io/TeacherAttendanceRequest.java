package com.demo.jwt.authify.io;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherAttendanceRequest {
    private LocalDate attendanceDate;
    private String markingMode;
    private List<TeacherAttendanceRequest.TeacherAttendance> teachers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeacherAttendance{
        private Long teacherId;
    }
}
