package com.demo.jwt.authify.controllers;

import com.demo.jwt.authify.io.ApiResponse;
import com.demo.jwt.authify.io.ProfileRequest;
import com.demo.jwt.authify.io.ProfileResponse;
import com.demo.jwt.authify.services.EmailService;
import com.demo.jwt.authify.services.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<ProfileResponse>> register(@RequestPart("profile") ProfileRequest request,
                                                                 @RequestPart(value = "file", required = false) MultipartFile file){
        ProfileResponse response = profileService.createProfile(request, file);
        emailService.sendWelcomeEmail(response.getEmail(), response.getFirstName(), response.getLastName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Registered SuccessFully"));
    }

    @GetMapping("/get-profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized: Invalid or expired token"));
        }
        String email = principal.getName();
        ProfileResponse response = profileService.getProfile(email);
        return ResponseEntity.ok(ApiResponse.success(response, "Successfully fetched your profile details."));
    }

    @PostMapping("/update-profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(@RequestPart("profile") ProfileRequest request,
                                           @RequestPart(value = "file", required = false) MultipartFile file) {
        ProfileResponse updatedProfile = profileService.updateProfile(request, file);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(updatedProfile, "Profile updated successfully."));
    }
}
