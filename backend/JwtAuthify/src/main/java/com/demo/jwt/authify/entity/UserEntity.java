package com.demo.jwt.authify.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users_table")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(unique = true)
    private String userId;
    private String firstName;
    private String lastName;
    @Column(unique = true)
    private String email;
    private String gender;
    @Column(unique = true)
    private Long phoneNumber;
    private String password;
    private String verifyEmailOtp;
    private Long verifyEmailOtpExpiredAt;
    private Boolean isAccountVerified;
    private String resetPasswordOtp;
    private Long resetPasswordOtpExpireAt;
    private Boolean isPasswordResetOtpVerified;
    private String profileImageUrl;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private Integer verifyEmailOtpAttemptCount;
    private Long lastVerifyEmailOtpAttemptTime;

    private Integer passwordResetOtpAttemptCount;
    private Long lastPasswordResetOtpAttemptTime;

    private String passwordResetToken;
    private Long passwordResetTokenExpiry;
}
