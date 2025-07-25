package com.demo.jwt.authify.services;

import com.demo.jwt.authify.io.ProfileRequest;
import com.demo.jwt.authify.io.ProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {

    ProfileResponse createProfile(ProfileRequest request, MultipartFile file);

    ProfileResponse updateProfile(ProfileRequest request, MultipartFile file);

    ProfileResponse getProfile(String email);

    void sendPasswordResetOtp(String email);

    String verifyPasswordResetOtp(String email, String otp);

    void resetPassword(String email, String newPassword);

    void sendEmailVerifyOtp(String email);

    void verifyOtp(String email, String otp);
}
