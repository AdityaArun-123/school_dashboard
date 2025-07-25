package com.demo.jwt.authify.services;

import com.demo.jwt.authify.constants.ErrorMessages;
import com.demo.jwt.authify.entity.UserEntity;
import com.demo.jwt.authify.exceptions.AppExceptions;
import com.demo.jwt.authify.io.ProfileRequest;
import com.demo.jwt.authify.io.ProfileResponse;
import com.demo.jwt.authify.repository.UserRepository;
import com.demo.jwt.authify.util.ProfileServiceUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final ProfileServiceUtil profileServiceUtil;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ProfileResponse createProfile(ProfileRequest request, MultipartFile file) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppExceptions.EmailAlreadyExistsException(ErrorMessages.EMAIL_ALREADY_EXISTS);
        }
        UserEntity newProfile = profileServiceUtil.convertToUserEntity(request);
        String imageUrl = uploadProfileImage(file, null);
        newProfile.setProfileImageUrl(imageUrl);
        userRepository.save(newProfile);
        return profileServiceUtil.convertToProfileResponse(newProfile);
    }

    @Override
    public ProfileResponse getProfile(String email) {
        UserEntity existingUser = profileServiceUtil.findUserByEmail(email);
        return profileServiceUtil.convertToProfileResponse(existingUser);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ProfileResponse updateProfile(ProfileRequest request, MultipartFile file) {
        UserEntity existingUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppExceptions.UserNotFoundException(ErrorMessages.USER_NOT_FOUND));

        existingUser.setFirstName(request.getFirstName());
        existingUser.setLastName(request.getLastName());
        existingUser.setGender(request.getGender());
        existingUser.setPhoneNumber(request.getPhoneNumber());

        String updatedImageUrl = uploadProfileImage(file, existingUser.getProfileImageUrl());
        existingUser.setProfileImageUrl(updatedImageUrl);
        userRepository.save(existingUser);
        return profileServiceUtil.convertToProfileResponse(existingUser);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void sendPasswordResetOtp(String email) {
        UserEntity existingUser = profileServiceUtil.findUserByEmail(email);
        String otp = profileServiceUtil.generateOtp();
        long otpExpiryTime = System.currentTimeMillis() + (15 * 60 * 1000);
        try {
            emailService.sendResetOtpEmail(email, otp);
        } catch (Exception e) {
            throw new AppExceptions.EmailSendFailureException(ErrorMessages.EMAIL_SEND_FAILURE);
        }
        existingUser.setResetPasswordOtp(otp);
        existingUser.setResetPasswordOtpExpireAt(otpExpiryTime);
        profileServiceUtil.resetResetOtpAttempts(existingUser);
        userRepository.save(existingUser);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String verifyPasswordResetOtp(String email, String otp) {
        UserEntity user = profileServiceUtil.findUserByEmail(email);
        profileServiceUtil.validateOtpWithAttempts(
                user.getResetPasswordOtp(), otp,
                user.getPasswordResetOtpAttemptCount(), user.getLastPasswordResetOtpAttemptTime(),
                true, user
        );

        if (user.getResetPasswordOtpExpireAt() < System.currentTimeMillis()) {
            throw new AppExceptions.OtpExpiredException(ErrorMessages.OTP_EXPIRED);
        }
        String token = UUID.randomUUID().toString();
        long expiry = System.currentTimeMillis() + (1000 * 60 * 5);

        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(expiry);
        user.setIsPasswordResetOtpVerified(true);
        user.setResetPasswordOtp(null);
        user.setResetPasswordOtpExpireAt(0L);
        profileServiceUtil.resetResetOtpAttempts(user);
        userRepository.save(user);
        return token;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void resetPassword(String token, String newPassword) {
        UserEntity user = profileServiceUtil.findByPasswordResetToken(token);

        if (user.getPasswordResetTokenExpiry() < System.currentTimeMillis()) {
            throw new AppExceptions.InvalidTokenException(ErrorMessages.TOKEN_EXPIRED);
        }
        if(Boolean.TRUE.equals(user.getIsPasswordResetOtpVerified())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setPasswordResetToken(null);
            user.setPasswordResetTokenExpiry(0L);
            user.setIsPasswordResetOtpVerified(false);
            userRepository.save(user);
        } else {
            throw new AppExceptions.InvalidPasswordResetOtpVerifyException(ErrorMessages.PASSWORD_RESET_OTP_NOT_VERIFY);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void sendEmailVerifyOtp(String email) {
        UserEntity user = profileServiceUtil.findUserByEmail(email);
        if(!Boolean.TRUE.equals(user.getIsAccountVerified())){
            String otp = profileServiceUtil.generateOtp();
            long expiry = System.currentTimeMillis() + (24 * 60 * 60 * 1000);

            try {
                emailService.sendVerifyOtpEmail(email, otp);
            } catch (Exception e) {
                userRepository.delete(user);
                throw new AppExceptions.EmailSendFailureException(ErrorMessages.EMAIL_SEND_FAILURE);
            }
            user.setVerifyEmailOtp(otp);
            user.setVerifyEmailOtpExpiredAt(expiry);
            profileServiceUtil.resetVerifyOtpAttempts(user);
            userRepository.save(user);
        } else {
            throw new AppExceptions.EmailAlreadyVerifiedException(ErrorMessages.EMAIL_ALREADY_VERIFIED);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void verifyOtp(String email, String otp) {
        UserEntity user = profileServiceUtil.findUserByEmail(email);
        profileServiceUtil.validateOtpWithAttempts(
                user.getVerifyEmailOtp(), otp,
                user.getVerifyEmailOtpAttemptCount(), user.getLastVerifyEmailOtpAttemptTime(),
                false, user
        );

        if (user.getVerifyEmailOtpExpiredAt() < System.currentTimeMillis()) {
            throw new AppExceptions.OtpExpiredException(ErrorMessages.OTP_EXPIRED);
        }

        user.setIsAccountVerified(true);
        user.setVerifyEmailOtp(null);
        user.setVerifyEmailOtpExpiredAt(0L);
        profileServiceUtil.resetVerifyOtpAttempts(user);
        userRepository.save(user);
    }

    private String uploadProfileImage(MultipartFile file, String oldImageUrlIfAny) {
        if (file == null || file.isEmpty()) {
            return oldImageUrlIfAny;
        }
        try {
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new AppExceptions.InvalidImageFileException(ErrorMessages.NOT_IMAGE_FILE);
            }
            if (oldImageUrlIfAny != null && !oldImageUrlIfAny.isBlank()) {
                Path oldFilePath = Paths.get("uploads", "profile_photos", Paths.get(oldImageUrlIfAny).getFileName().toString());
                try {
                    Files.deleteIfExists(oldFilePath);
                } catch (IOException ex) {
                    System.err.println("⚠️ Failed to delete old image: " + ex.getMessage());
                }
            }
            String uploadPath = "uploads/profile_photos/";
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            String originalFileName = Optional.ofNullable(file.getOriginalFilename())
                    .orElseThrow(() -> new AppExceptions.InvalidFileException(ErrorMessages.MISSING_IMAGE_NAME))
                    .replaceAll("\\s+", "_");

            String filename = UUID.randomUUID() + "_" + originalFileName;
            Path filepath = Paths.get(uploadPath, filename);
            Files.copy(file.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/profile_photos/" + filename;
        } catch (IOException e) {
            throw new AppExceptions.ImageUploadFailureException(ErrorMessages.IMAGE_UPLOAD_FAILURE);
        }
    }
}
