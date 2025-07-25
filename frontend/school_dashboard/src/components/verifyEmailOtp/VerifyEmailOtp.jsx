import React, { useContext, useEffect, useState } from 'react'
import { OtpInput } from '../otpInput/OtpInput'
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const VerifyEmailOtp = () => {

    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const { backendUrl, userData } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem("verifyEmail");
        setUserEmail(storedEmail);
    }, []);

    const resendOtp = async () => {
        try {
            const response = await axios.post(`${backendUrl}/auth/send-verify-otp`, { email: userData.email });
            if (response.status === 200) {
                toast.success("Verification OTP has been sent to your email.");
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

    const verifyOtp = async (otp) => {
        const verifyEmailPayload = {
            email: userEmail,
            otp: otp
        };
        setLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/auth/verify-email`, verifyEmailPayload);
            if (response.status === 200) {
                toast.success(response.data?.message || "Your email has been successfully verified. Please log in..");
                setTimeout(() => {
                    localStorage.removeItem("verifyEmail");
                    navigate("/log-in", {replace : true, state: {internalNav: true}});
                }, 500);
            }
        } catch (error) {
            toast.error(error.response?.data?.data?.message || "Something went wrong! Try again in some time.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <OtpInput
            title="Verify Your Email"
            subtitle1="Enter the verification code we sent to"
            subtitle2="to complete your verification."
            email={maskEmail(userEmail)}
            onResendClick={resendOtp}
            onVerifyClick={verifyOtp}
            isVerifying={loading}
        />
    )
}
