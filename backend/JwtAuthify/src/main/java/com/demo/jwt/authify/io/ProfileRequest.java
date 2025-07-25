package com.demo.jwt.authify.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String gender;
    private Long phoneNumber;
    private String password;
}
