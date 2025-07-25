package com.demo.jwt.authify.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendancePercentageResponse {
    private int month;
    private double studentPresentPercent;
    private double studentAbsentPercent;
    private double teacherPresentPercent;
    private double teacherAbsentPercent;
}
