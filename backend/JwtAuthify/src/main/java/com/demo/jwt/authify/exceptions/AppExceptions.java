package com.demo.jwt.authify.exceptions;

public class AppExceptions {

    public static class EmailAlreadyExistsException extends RuntimeException {
        public EmailAlreadyExistsException(String message) {
            super(message);
        }
    }

    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) {
            super(message);
        }
    }

    public static class InvalidOtpException extends RuntimeException {
        public InvalidOtpException(String message) {
            super(message);
        }
    }

    public static class OtpExpiredException extends RuntimeException {
        public OtpExpiredException(String message) {
            super(message);
        }
    }

    public static class EmailSendFailureException extends RuntimeException {
        public EmailSendFailureException(String message) {
            super(message);
        }
    }

    public static class EmailAlreadyVerifiedException extends RuntimeException {
        public EmailAlreadyVerifiedException(String message) {
            super(message);
        }
    }

    public static class TooManyRequestsException extends RuntimeException {
        public TooManyRequestsException(String message) {
            super(message);
        }
    }

    public static class InvalidPasswordResetOtpVerifyException extends RuntimeException {
        public InvalidPasswordResetOtpVerifyException(String message) {
            super(message);
        }
    }

    public static class InvalidTokenException extends RuntimeException {
        public InvalidTokenException(String message) {
            super(message);
        }
    }

    public static class InvalidImageFileException extends RuntimeException {
        public InvalidImageFileException(String message) {
            super(message);
        }
    }

    public static class InvalidFileException extends RuntimeException {
        public InvalidFileException(String message) {
            super(message);
        }
    }
    
    public static class ImageUploadFailureException extends RuntimeException {
        public ImageUploadFailureException(String message) {
            super(message);
        }
    }

    public static class StudentNotFoundException extends RuntimeException {
        public StudentNotFoundException(String message) {
            super(message);
        }
    }

    public static class BookNotFoundException extends RuntimeException {
        public BookNotFoundException(String message) {
            super(message);
        }
    }

    public static class TeacherNotFoundException extends RuntimeException {
        public TeacherNotFoundException(String message) {
            super(message);
        }
    }

    public static class TransportNotFoundException extends RuntimeException {
        public TransportNotFoundException(String message) {
            super(message);
        }
    }
}
