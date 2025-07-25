package com.demo.jwt.authify.constants;

public class ErrorMessages {
    public static final String USER_NOT_FOUND = "No user account found with the provided email.";
    public static final String EMAIL_ALREADY_EXISTS = "Email already exists. Please try with a different one.";
    public static final String INVALID_OTP = "The provided OTP is incorrect.";
    public static final String OTP_EXPIRED = "The OTP has expired. Please request a new one.";
    public static final String EMAIL_SEND_FAILURE = "Unable to send email at the moment. Please try again later.";
    public static final String INTERNAL_SERVER_FAILURE = "Something went wrong! Try again in some time.";
    public static final String PASSWORD_RESET_OTP_NOT_VERIFY = "Please verify the OTP before resetting your password.";
    public static final String EMAIL_ALREADY_VERIFIED = "This email is already verified.";
    public static final String INVALID_TOKEN = "The provided token is Incorrect.";
    public static final String TOKEN_EXPIRED = "The provided token is Expired";
    public static final String NOT_IMAGE_FILE = "Only image files are allowed.";
    public static final String MISSING_IMAGE_NAME = "Uploaded file must have a name.";
    public static final String IMAGE_UPLOAD_FAILURE = "Failed to upload profile photo.";
    public static final String STUDENT_NOT_FOUND = "No student record found with the provided admission id.";
    public static final String BOOK_NOT_FOUND = "No book record found with the provided book id.";
    public static final String TEACHER_NOT_FOUND = "No teacher record found with the provided teacher id.";
    public static final String TRANSPORT_NOT_FOUND = "No transport record found with the provided bus number.";
}
