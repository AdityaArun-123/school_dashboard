package com.demo.jwt.authify.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherRequest {
    private String name;
    private String gender;
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String religion;
    private String email;
    private String classTeacherOf;
    private String address;
    private String phoneNumber;
    private String salary;
}
