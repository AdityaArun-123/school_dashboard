package com.demo.jwt.authify.util;

import com.demo.jwt.authify.constants.ErrorMessages;
import com.demo.jwt.authify.entity.UserEntity;
import com.demo.jwt.authify.exceptions.AppExceptions;
import com.demo.jwt.authify.io.ProfileRequest;
import com.demo.jwt.authify.io.ProfileResponse;
import com.demo.jwt.authify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Component
@RequiredArgsConstructor
public class ProfileServiceUtil {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final int MAX_ATTEMPTS = 5;

    public UserEntity findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppExceptions.UserNotFoundException(ErrorMessages.USER_NOT_FOUND));
    }

    public UserEntity findByPasswordResetToken(String token) {
        return userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new AppExceptions.InvalidTokenException(ErrorMessages.INVALID_TOKEN));
    }

    public String generateOtp() {
        return String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
    }

    public long computeBackoffTime(Integer attempts) {
        if (attempts == null || attempts < MAX_ATTEMPTS) return 0;
        int exponent = attempts - (MAX_ATTEMPTS - 1);
        return (long) (Math.pow(2, exponent) * 60 * 1000);
    }

    public void resetVerifyOtpAttempts(UserEntity user) {
        user.setVerifyEmailOtpAttemptCount(0);
        user.setLastVerifyEmailOtpAttemptTime(0L);
    }

    public void resetResetOtpAttempts(UserEntity user) {
        user.setPasswordResetOtpAttemptCount(0);
        user.setLastPasswordResetOtpAttemptTime(0L);
    }

    @Transactional(rollbackFor = Exception.class)
    public void validateOtpWithAttempts(String actualOtp, String providedOtp,
                                         Integer attemptCount, Long lastAttemptTime,
                                         boolean isReset, UserEntity user) {
        long now = System.currentTimeMillis();
        long blockTime = computeBackoffTime(attemptCount);
        int currentAttempts = Optional.ofNullable(attemptCount).orElse(0);
        long lastAttempt = Optional.ofNullable(lastAttemptTime).orElse(0L);
        if (currentAttempts >= MAX_ATTEMPTS) {
            if ((now - lastAttempt) < blockTime) {
                throw new AppExceptions.TooManyRequestsException("Too many failed attempts. Try again in some time.");
            } else {
                if (isReset) {
                    resetResetOtpAttempts(user);
                } else {
                    resetVerifyOtpAttempts(user);
                }
                userRepository.save(user);
                currentAttempts = 0;
            }
        }
        if (actualOtp == null || !actualOtp.equals(providedOtp)) {
            int newAttempts = currentAttempts + 1;
            if (isReset) {
                user.setPasswordResetOtpAttemptCount(newAttempts);
                user.setLastPasswordResetOtpAttemptTime(now);
            } else {
                user.setVerifyEmailOtpAttemptCount(newAttempts);
                user.setLastVerifyEmailOtpAttemptTime(now);
            }
            userRepository.save(user);
            throw new AppExceptions.InvalidOtpException(ErrorMessages.INVALID_OTP);
        }
    }

    public ProfileResponse convertToProfileResponse(UserEntity user) {
        return ProfileResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .gender(user.getGender())
                .phoneNumber(user.getPhoneNumber())
                .profileImageUrl(user.getProfileImageUrl())
                .userId(user.getUserId())
                .isAccountVerified(user.getIsAccountVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public UserEntity convertToUserEntity(ProfileRequest request) {
        return UserEntity.builder()
                .email(request.getEmail())
                .userId(UUID.randomUUID().toString())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .gender(request.getGender())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .isAccountVerified(false)
                .profileImageUrl(null)
                .resetPasswordOtp(null)
                .resetPasswordOtpExpireAt(0L)
                .isPasswordResetOtpVerified(false)
                .verifyEmailOtp(null)
                .verifyEmailOtpExpiredAt(0L)
                .verifyEmailOtpAttemptCount(0)
                .lastVerifyEmailOtpAttemptTime(0L)
                .passwordResetOtpAttemptCount(0)
                .lastPasswordResetOtpAttemptTime(0L)
                .passwordResetToken(null)
                .passwordResetTokenExpiry(0L)
                .build();
    }
}
