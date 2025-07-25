package com.demo.jwt.authify.io;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileResponse {
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String gender;
    private Long phoneNumber;
    private String profileImageUrl;
    @JsonProperty("isAccountVerified")
    private boolean isAccountVerified;
    @JsonProperty("isPasswordResetOtpVerified")
    private boolean isPasswordResetOtpVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
