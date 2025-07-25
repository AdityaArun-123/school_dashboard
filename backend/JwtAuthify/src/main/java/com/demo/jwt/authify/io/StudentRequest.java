package com.demo.jwt.authify.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequest {
    private String name;
    private String email;
    private String gender;
    private LocalDate dob;
    private String fatherName;
    private String fatherOccupation;
    private String motherName;
    private String motherOccupation;
    private String bloodGroup;
    private String religion;
    private Integer studentClass;
    private String section;
    private Long phoneNumber;
    private String address;
}
