package com.demo.jwt.authify.controllers;

import com.demo.jwt.authify.io.*;
import com.demo.jwt.authify.services.AuthService;
import com.demo.jwt.authify.services.ProfileServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final ProfileServiceImpl profileService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody AuthRequest request) {
        return authService.loginAuth(request);
    }

    @GetMapping("/is-authenticated")
    public ResponseEntity<ApiResponse<Boolean>> isAuthenticated(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        boolean isLoggedIn = email != null;
        if (isLoggedIn)
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(true, "You are successfully authenticated."));
        else
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(false, "You are not logged in."));
    }

    @PostMapping("/send-password-reset-otp")
    public ResponseEntity<ApiResponse<Void>> sendPasswordResetOtp(@RequestBody EmailRequest request) {
        profileService.sendPasswordResetOtp(request.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null, "If an account with that email exists, we’ve sent a password reset OTP."));
    }

    @PostMapping("/verify-password-reset-otp")
    public ResponseEntity<ApiResponse<String>> verifyPasswordResetOtp(@RequestBody PasswordResetVerifyRequest request) {
        String passwordResetToken = profileService.verifyPasswordResetOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(passwordResetToken, "OTP has been successfully verified"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody ResetPasswordRequest request) {
        profileService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null, "Your password has been successfully reset."));
    }

    @PostMapping("/send-verify-otp")
    public ResponseEntity<ApiResponse<Void>> sendVerifyOtp(@RequestBody EmailRequest request) {
        profileService.sendEmailVerifyOtp(request.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null, "If an account with that email exists, we’ve sent a verification OTP."));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestBody VerifyEmailRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Please provide a valid email."));
        }
        if (request.getOtp() == null || request.getOtp().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Please provide a valid OTP."));
        }
        profileService.verifyOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null, "Your email has been successfully verified. Please log in.."));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(HttpServletRequest request) {
        return authService.refreshJwtToken(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logOut(HttpServletRequest request) {
        ResponseCookie cookie1 = ResponseCookie.from("accessToken", "")
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(0)
                    .sameSite("Strict")
                    .build();
        ResponseCookie cookie2 = ResponseCookie.from("refreshToken", "")
                    .httpOnly(true)
                    .secure(false)
                    .path("/auth/refresh-token")
                    .maxAge(0)
                    .sameSite("Strict")
                    .build();
        return ResponseEntity.status(HttpStatus.OK)
                    .header(HttpHeaders.SET_COOKIE, cookie1.toString())
                    .header(HttpHeaders.SET_COOKIE, cookie2.toString())
                    .body(ApiResponse.success(null, "Logged out successfully!"));
    }
}
