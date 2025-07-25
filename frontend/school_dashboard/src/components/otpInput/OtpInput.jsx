import React, { useEffect, useRef, useState } from 'react';
import './otp-input.css';
import { toast } from 'react-toastify';

export const OtpInput = ({
    title,
    subtitle1,
    subtitle2,
    email,
    onResendClick,
    onVerifyClick,
    isVerifying
}) => {

    const length = 6;

    const [otp, setOtp] = useState(new Array(length).fill(""));
    const [finalOtp, setFinalOtp] = useState("");

    const inputRefs = useRef([]);

    const [remainingTime, setRemainingTime] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        const total = 60;
        const now = Date.now();

        let savedStart = parseInt(localStorage.getItem("otp_start_time"), 10);

        if (!savedStart || isNaN(savedStart) || now - savedStart >= total * 1000) {
            savedStart = now;
            localStorage.setItem("otp_start_time", savedStart.toString());
        }

        const elapsed = Math.floor((now - savedStart) / 1000);
        const remaining = Math.max(0, total - elapsed);

        setRemainingTime(remaining);

        timerRef.current = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, []);

    const formatTime = (seconds) => {
        const min = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        return `${min}:${sec}s`;
    };

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const resetOtp = () => {
        const emptyOtp = new Array(length).fill("");
        setOtp(emptyOtp);

        inputRefs.current.forEach((input) => {
            if (input) input.value = "";
        });

        inputRefs.current[0]?.focus();
    };

    const handleChange = (index, e) => {
        const value = e.target.value;

        if (isNaN(value)) return;

        const newOtp = [...otp];

        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        const combinedOtp = newOtp.join("");
        setFinalOtp(newOtp.join(""));
        if (value) {
            const nextEmptyIndex = newOtp.findIndex((d, i) => d === "" && i !== index);
            if (nextEmptyIndex !== -1 && inputRefs.current[nextEmptyIndex]) {
                inputRefs.current[nextEmptyIndex].focus();
            }
        }
    };

    const handleClick = (index) => {
        inputRefs.current[index]?.setSelectionRange(1, 1);

        if (index > 0 && !otp[index - 1]) {
            inputRefs.current[otp.indexOf("")]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        const key = e.key;

        if (key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = inputRefs.current[index - 1];
            if (prevInput) {
                prevInput.focus();
                setTimeout(() => prevInput.setSelectionRange(1, 1), 0);
            }
        }

        else if (key === "ArrowLeft" && index > 0) {
            const prevInput = inputRefs.current[index - 1];
            if (prevInput) {
                prevInput.focus();
                setTimeout(() => prevInput.setSelectionRange(1, 1), 0);
            }
        }

        else if (key === "ArrowRight" && index < length - 1) {
            const nextInput = inputRefs.current[index + 1];
            if (nextInput) {
                nextInput.focus();
                setTimeout(() => nextInput.setSelectionRange(1, 1), 0);
            }
        }

        else if (key === "Enter") {
            e.preventDefault(); 
            sendBackOtpToParent();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault(); 

        const paste = e.clipboardData.getData("text").trim(); 

        if (!/^\d+$/.test(paste)) return;

        const digits = paste.slice(0, length).split("");
        const newOtp = new Array(length).fill("");

        digits.forEach((digit, i) => {
            newOtp[i] = digit;

            if (inputRefs.current[i]) {
                inputRefs.current[i].value = digit;
            }
        });

        setOtp(newOtp);

        if (digits.length === length) {
            onVerifyClick(digits.join(""));
        }

        const lastFilledIndex = digits.length - 1;
        if (inputRefs.current[lastFilledIndex]) {
            inputRefs.current[lastFilledIndex].focus();
            setTimeout(() => inputRefs.current[lastFilledIndex].setSelectionRange(1, 1), 0);
        }
    };

    const sendBackOtpToParent = () => {
        if (finalOtp.length === length) {
            onVerifyClick(finalOtp);
            localStorage.removeItem("otp_start_time");
        } else {
            toast.error("Please provide all the 6 digits of the OTP");

            const firstEmptyIndex = otp.findIndex((d) => d === "");
            if (firstEmptyIndex !== -1 && inputRefs.current[firstEmptyIndex]) {
                inputRefs.current[firstEmptyIndex].focus();
                setTimeout(() => {
                    inputRefs.current[firstEmptyIndex].setSelectionRange(1, 1);
                }, 0);
            }
        }
    }

    const handleResendClick = () => {
        if (remainingTime > 0) return;

        if (onResendClick()) {
            localStorage.setItem("otp_start_time", Date.now().toString());
            setRemainingTime(60);
            clearInterval(timerRef.current);

            timerRef.current = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            toast.error("Unable to send the OTP! Try again in some time..")
        }
        inputRefs.current[0]?.focus();
    };


    return (
        <div className="otp-container">
            <h2>{title}</h2>
            <p>
                {subtitle1} <strong>{email}</strong> {subtitle2}
            </p>

            <div className="info-message">
                If you haven't received the email, please check your spam folder.
            </div>

            <div className="otp-inputs">
                {otp.map((value, index) => (
                    <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        name={`otp-${index}`}       
                        ref={(el) => (inputRefs.current[index] = el)} 
                        value={value}
                        onChange={(e) => handleChange(index, e)} 
                        onClick={() => handleClick(index)} 
                        onKeyDown={(e) => handleKeyDown(index, e)} 
                        onPaste={handlePaste}
                        className="otpInput focus-animate"
                    />
                ))}
            </div>

            <div className="bottom-row">
                <span onClick={resetOtp} className='reset-otp-btn'>Reset</span>
                <span>
                    Didn't get the code?
                    <button type="button" className="link-button" onClick={handleResendClick} disabled={remainingTime > 0}>
                        Resend <strong>{formatTime(remainingTime)}</strong>
                    </button>
                </span>
            </div>

            <button onClick={sendBackOtpToParent} disabled={isVerifying} className='btn'>
                {isVerifying ? 'Verifying...' : 'Verify'}
            </button>
        </div>
    );
};
