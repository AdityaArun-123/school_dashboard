import React, { useContext, useState } from 'react';
import './forget-password.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { OtpInput } from '../otpInput/OtpInput';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

export const ForgetPassword = () => {

    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordResetData, setPasswordResetData] = useState({
        email : ""
    });

    const handlePasswordResetFormInput = (event) => {
        const { name, value } = event.target;
        setPasswordResetData({ ...passwordResetData, [name]: value });
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/auth/send-password-reset-otp`, { email: passwordResetData.email });
            if (response.status === 200) {
                toast.success("Verification OTP has been sent to your email.");
                localStorage.setItem("otp_start_time", Date.now().toString());
                setTimeout(() => { setShowOtpInput(true) }, 500);
            }
        } catch (error) {
            toast.error("Unable to send email at the moment. Please try again later.");
        }
    }

    const maskEmail = (email) => {
        if (!email) return "";
        const [localPart, domain] = email.split("@");
        if (localPart.length <= 6) {
            return localPart[0] + "***" + "@" + domain;
        }
        const start = localPart.slice(0, 3);
        const end = localPart.slice(-3);
        return `${start}***${end}@${domain}`;
    }

    const resendOtp = async () => {
        try {
            const response = await axios.post(`${backendUrl}/auth/send-password-reset-otp`, { email: passwordResetData.email });
            if (response.status === 200) {
                toast.success("Verification OTP has been sent to your email.");
                setTimeout(() => { setShowOtpInput(true) }, 500);
            }
        } catch (error) {
            toast.error("Unable to send email at the moment. Please try again later.");
        }
    }

    const verifyPasswordResetOtp = async (otp) => {
        try {
            const response = await axios.post(`${backendUrl}/auth/verify-password-reset-otp`, { email: passwordResetData.email, otp: otp });
            if (response.status === 200) {
                const token = response.data?.data;
                toast.success(response.data?.message || "OTP has been successfully verified");
                navigate(`/change-password?token=${token}`, {replace : true, state: {internalNav: true}});
            }
        } catch (error) {
            toast.error(error.response?.data?.data?.message || "Something went wrong! Try again in some time.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {
                showOtpInput ?
                    <OtpInput
                        title="Forget Your Password"
                        subtitle1="Enter the verification code we sent to"
                        subtitle2="to reset your password"
                        email={maskEmail(passwordResetData.email)}
                        onResendClick={resendOtp}
                        onVerifyClick={verifyPasswordResetOtp}
                        isVerifying={loading} />
                    :
                    <div className="reset-password-container">
                        <div className="forget-password-img">
                            <img src="Gallery/forgot-password-img.png" alt="" />
                        </div>
                        <h2>Forgot your password?</h2>
                        <p>
                            Enter your email so that we can send you a verify OTP to reset your
                            password.
                        </p>
                        <form onSubmit={onSubmitHandler} method='post'>
                            <div className="reset-password-form-group">
                                <input type="email" required name='email' onChange={handlePasswordResetFormInput} />
                                <label>Email</label>
                            </div>
                            <button type="submit" className="btn" disabled={loading} >Send OTP</button>
                        </form>
                        <div className="back-to-login">
                            Remembered your password?
                            <a href="#">Go back and login</a>
                        </div>
                        <div className="support-link">
                            Need more help? <a href="#">Contact Support</a>
                        </div>
                    </div>
            }
        </>
    )
}
