# School Dashboard

A full-stack School Management Dashboard built with **React.js** (Frontend) and **Spring Boot** (Backend), featuring secure JWT authentication, real-time data visualization, and CRUD operations for teachers, students, books, transport, and attendance.

---

## 🚀 Features

### Backend (Spring Boot)
- JWT Authentication with role-based access control
- Refresh Token via HttpOnly Cookie
- Manage Teachers, Students, Books, Transport, and Attendance
- RESTful APIs for smooth frontend integration
- Built with Spring Boot + Hibernate (JPA)

### Frontend (React.js)
- Secure Routing using context and token validation
- Real-time charts with ApexCharts
- Search and Sort on all data tables
- Secure token handling via access + refresh token flow
- Clean UI with reusable components

---

## 🛠️ Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Security + JWT
- Hibernate (JPA)
- MySQL

### Frontend
- React.js
- React Router
- ApexCharts
- Axios
- Toastify


## Run Locally

**Step 1:** Clone the project

```bash
  git clone https://github.com/AdityaArun-123/school_dashboard.git
```

**Step 2:** Start the Backend (Spring Boot)

Go to the project directory

```bash
  cd backend/JwtAuthify
```

Create the database in MySQL

```bash
  CREATE DATABASE your_DB_name;
```

Configure application.properties

```bash
  spring.datasource.url=jdbc:mysql://localhost:3306/your_DB_name
  spring.datasource.username=your_mysql_user
  spring.datasource.password=your_mysql_password
  spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
  spring.jpa.hibernate.ddl-auto=update
  server.servlet.context-path=/authify-app
  jwt.secret.key=your_jwt_secret (Very long random string of characters)
  spring.servlet.multipart.max-file-size=4MB
  spring.servlet.multipart.max-request-size=4MB
```

Configure Email (Spring Mail with Brevo)

Make an account on Brevo to send emails and then add this in your backend/src/main/resources/application.properties

```bash
  spring.mail.host=smtp-relay.brevo.com
  spring.mail.port=587
  spring.mail.username=your_brevo_account_username
  spring.mail.password=your_brevo_account_password
  spring.mail.properties.mail.smtp.auth=true
  spring.mail.properties.mail.smtp.starttls.enable=true
  spring.mail.protocol=smtp
  spring.mail.properties.mail.smtp.from=your_email_id_used_to_send_emails_from
```

Start the Spring Boot app

```bash
  ./mvnw spring-boot:run
  Or run the main() method from your IDE (IntelliJ/Eclipse).
```

**Step 3:** Start the Frontend (React.js)

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend/school_dashboard
```
Install dependencies:

```bash
npm install
```
Start the React app:
```bash
npm start
```

Frontend runs at http://localhost:3000 and
Backend runs at http://localhost:8080



# API Reference

All backend APIs are prefixed with: `http://localhost:8080/authify-app`

> *All routes are protected with JWT authentication*

---

## User/Admin Routes

| Method | Endpoint             | Description                          |
|--------|----------------------|--------------------------------------|
|POST| `/profile/register`| Register new user |
|GET| `/profile/get-profile`| Get user profile|
|POST| `/profile/update-profile`| Update user profile|
|POST| `/auth/login`| Login the user|
|GET| `/auth/is-authenticated`| Check wheather user is authenticated or not|
|POST| `/auth/send-password-reset-otp`| send OTP for password reset|
|POST| `/auth/verify-password-reset-otp`| Verify OTP for password reset|
|POST| `/auth/reset-password`| Reset the password|
|POST| `/auth/send-verify-otp`| Send OTP email verification|
|POST| `/auth/verify-email`| Verify OTP for email verification|
|POST| `/auth/refresh-token`| Refresh JWT token if expired|
|POST| `/auth/logout`| Logout the user|

---

## Student Routes

| Method | Endpoint                    | Description                               |
|--------|-----------------------------|-------------------------------------------|
| POST| `/student/add-student`             |Add new Student|
| GET| `/student/fetch-all-students`        | Get all students list (with pagination and sorting)                     |
| GET| `/student/fetch-students-by-class-section`             | Filter students list by class and section (with pagination and sorting)|
| GET    | `/student/fetch-student`        | Get student by ID                       |
| POST | `/student/update-student`| Update the student|
| DELETE | `/student/delete-student`| Delete the student|
| GET | `/student/search-student`| Search students (with pagination and sorting)|

---

## Teacher Routes

| Method | Endpoint                    | Description                         |
|--------|-----------------------------|-------------------------------------|
| POST| `/teacher/add-teacher`             |Add new Teacher|
| GET| `/teacher/fetch-all-teachers`        | Get all teachers list (with pagination and sorting)                     |
| GET    | `/teacher/fetch-teacher`        | Get teacher by ID                       |
| POST | `/teacher/update-teacher`| Update the teacher|
| DELETE | `/teacher/delete-teacher`| Delete the teacher|
| GET | `/teacher/search-teacher`| Search teachers (with pagination and sorting)|

---

## Book Routes

| Method | Endpoint                    | Description                         |
|--------|-----------------------------|-------------------------------------|
| POST| `/book/add-book`             |Add new Book|
| GET| `/book/fetch-all-books`        | Get all books list (with pagination and sorting)                     |
| GET    | `/book/fetch-book`        | Get book by ID                       |
| POST | `/book/update-book`| Update the book|
| DELETE | `/book/delete-book`| Delete the book|
| GET | `/book/search-book`| Search books (with pagination and sorting)|

---

## Attendance Routes

| Method | Endpoint                           | Description                            |
|--------|------------------------------------|----------------------------------------|
| POST    | `/attendance/mark-student-attendance`         | Mark student attendance            |
| POST   | `/attendance/mark-teacher-attendance`    | Mark teacher attendance                |
| GET    | `/attendance/fetch-all-student-attendance`         | Get all student attendance list            |
| GET   | `/attendance/fetch-all-teacher-attendance`    | Get all teacher attendance list                |
| GET   | `/attendance/get-student-teacher-attendance-percent`    | Get attendance percentage for students and teachers            |

---

## Transport Routes

| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| POST| `/transport/add-transport`             |Add new Transport|
| GET| `/transport/fetch-all-transports`        | Get all transports list (with pagination and sorting)                     |
| GET    | `/transport/fetch-transport`        | Get transport by ID                       |
| POST | `/transport/update-transport`| Update the transport|
| DELETE | `/transport/delete-transport`| Delete the transport|
| GET | `/transport/search-transport`| Search transports (with pagination and sorting)|

---

> For detailed request/response formats, refer to individual controller classes.

## Author

[@Aditya Arun](https://github.com/AdityaArun-123)

