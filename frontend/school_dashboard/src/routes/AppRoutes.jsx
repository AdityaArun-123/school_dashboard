import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

import { SideMenuBar } from "../components/sideMenuBar/SideMenuBar";
import { ProfileDropDown } from "../components/profileDropDown/ProfileDropDown";

import { HomeDashBoard } from "../components/homeDashBoard/HomeDashBoard";
import { AddBooks } from "../components/addBooks/AddBooks";
import { AddStudents } from "../components/addStudents/AddStudents";
import { AddTeachers } from "../components/addTeachers/AddTeachers";
import { AddTransport } from "../components/addTransport/AddTransport";
import { AdminInfo } from "../components/adminInfo/AdminInfo";
import { Settings } from "../components/settings/Settings";
import { MarkStudentAttendence } from "../components/markStudentAttendence/MarkStudentAttendence";
import { MarkTeachersAttendence } from "../components/markTeachersAttendence/MarkTeachersAttendence";
import { ViewAllTransport } from "../components/viewAllTransport/ViewAllTransport";
import { GetStudentAttendence } from "../components/getStudentAttendence/GetStudentAttendence";
import { GetTeacherAttendence } from "../components/getTeacherAttendence/GetTeacherAttendence";
import { ViewAllBooks } from "../components/viewAllBooks/ViewAllBooks";
import { ViewAllStudents } from "../components/viewAllStudents/ViewAllStudents";
import { ViewAllTeachers } from "../components/viewAllTeachers/ViewAllTeachers";
import { UpdateStudents } from "../components/updateStudents/UpdateStudents";
import { UpdateTeacher } from "../components/updateTeacher/UpdateTeacher";
import { UpdateBook } from "../components/updateBook/UpdateBook";
import { UpdateTransport } from "../components/updateTransport/UpdateTransport";

import { SignUpModal } from "../components/signUpModal/SignUpModal";
import { LoginModal } from "../components/loginModal/LoginModal";
import { VerifyEmailOtp } from "../components/verifyEmailOtp/VerifyEmailOtp";
import { ForgetPassword } from "../components/forgetPassword/ForgetPassword";
import { ChangePassword } from "../components/changePassword/ChangePassword";

import PublicRoute from "../routes/PublicRoute";
import ProtectedRoute from "../routes/ProtectedRoute";
import { Spinner } from "../components/spinner/Spinner";

function AppRoutes() {

    const { isLoggedIn, authLoading } = useContext(AppContext);

    if (authLoading) {
        return <Spinner />
    }

    return (
        <>
            {isLoggedIn && (
                <>
                    <SideMenuBar />
                    <ProfileDropDown />
                </>
            )}
            <Routes>
                <Route path="/" element={<ProtectedRoute><HomeDashBoard /></ProtectedRoute>} />
                <Route path="/add-books" element={<ProtectedRoute><AddBooks /></ProtectedRoute>} />
                <Route path="/add-student" element={<ProtectedRoute><AddStudents /></ProtectedRoute>} />
                <Route path="/add-teacher" element={<ProtectedRoute><AddTeachers /></ProtectedRoute>} />
                <Route path="/add-transport" element={<ProtectedRoute><AddTransport /></ProtectedRoute>} />
                <Route path="/admin-info" element={<ProtectedRoute><AdminInfo /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/mark-student-attendence" element={<ProtectedRoute><MarkStudentAttendence /></ProtectedRoute>} />
                <Route path="/mark-teacher-attendence" element={<ProtectedRoute><MarkTeachersAttendence /></ProtectedRoute>} />
                <Route path="/get-student-attendence" element={<ProtectedRoute><GetStudentAttendence /></ProtectedRoute>} />
                <Route path="/get-teacher-attendence" element={<ProtectedRoute><GetTeacherAttendence /></ProtectedRoute>} />
                <Route path="/view-all-books" element={<ProtectedRoute><ViewAllBooks /></ProtectedRoute>} />
                <Route path="/view-all-students" element={<ProtectedRoute><ViewAllStudents /></ProtectedRoute>} />
                <Route path="/view-all-teachers" element={<ProtectedRoute><ViewAllTeachers /></ProtectedRoute>} />
                <Route path="/view-all-transport" element={<ProtectedRoute><ViewAllTransport /></ProtectedRoute>} />
                <Route path="/update-student/:id" element={<ProtectedRoute><UpdateStudents /></ProtectedRoute>} />
                <Route path="/update-teacher/:id" element={<ProtectedRoute><UpdateTeacher /></ProtectedRoute>} />
                <Route path="/update-book/:id" element={<ProtectedRoute><UpdateBook /></ProtectedRoute>} />
                <Route path="/update-transport/:id" element={<ProtectedRoute><UpdateTransport /></ProtectedRoute>} />

                <Route path="/sign-up" element={<PublicRoute><SignUpModal /></PublicRoute>} />
                <Route path="/log-in" element={<PublicRoute><LoginModal /></PublicRoute>} />
                <Route path="/verify-email" element={<PublicRoute><VerifyEmailOtp /></PublicRoute>} />
                <Route path="/forget-password" element={<PublicRoute><ForgetPassword /></PublicRoute>} />
                <Route path="/change-password" element={<PublicRoute><ChangePassword /></PublicRoute>} />

                {!authLoading && (
                    <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/log-in"} replace />} />
                )}
            </Routes>
        </>
    );
}

export default AppRoutes;
