import React, { useContext, useState } from "react";
import "./signUpModal.css";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export const SignUpModal = () => {
    const [adminSignUpData, setAdminSignUpData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        password: "",
        confirmPassword: ""
    });
    const [profilePhoto, setProfilePhoto] = useState(null);

    const { backendUrl} = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setIsLoading] = useState(false);

    const handleSignUpFormInput = (event) => {
        const { name, value } = event.target;
        setAdminSignUpData({ ...adminSignUpData, [name]: value });
    }

    const sendEmailVerifyOtp = async () => {
        try {
            const response = await axios.post(backendUrl + "/auth/send-verify-otp", { email: adminSignUpData.email });
            return response.status === 200;
        } catch (error) {
            console.log("Unable to send OTP");
            return false;
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > 4) {
                toast.error("Profile image must be less than 4MB.");
                setProfilePhoto(null);
                e.target.value = "";
                return;
            }

            setProfilePhoto(file);
        }
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (adminSignUpData.password !== adminSignUpData.confirmPassword) {
            toast.info("Passwords do not match");
            return;
        }
        try {

            const formData = new FormData();
            formData.append("file", profilePhoto);
            formData.append("profile", new Blob([JSON.stringify(adminSignUpData)], { type: "application/json" }));
            const response = await axios.post(`${backendUrl}/profile/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (response.status === 201) {
                const otpSent = await sendEmailVerifyOtp();
                if (otpSent) {
                    toast.success(response.data?.message || "Registered Successfully...");
                    localStorage.setItem("verifyEmail", adminSignUpData.email);
                    localStorage.setItem("otp_start_time", Date.now().toString());
                    navigate("/verify-email", { replace: true, state: { internalNav: true } });
                } else {
                    toast.error("Something went wrong! Try again in some time.");
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.data?.message || "Something went wrong! Try again in some time.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="sign-up-container">
            <h1>Sign Up</h1>
            <form onSubmit={onSubmitHandler} method="post">
                <div className="row">
                    <div className="sign-up-form-group">
                        <input type="text" required name="firstName" onChange={handleSignUpFormInput} />
                        <label>First Name</label>
                    </div>
                    <div className="sign-up-form-group">
                        <input type="text" required name="lastName" onChange={handleSignUpFormInput} />
                        <label>Last Name</label>
                    </div>
                </div>
                <div className="sign-up-form-group">
                    <input type="email" required name="email" onChange={handleSignUpFormInput} />
                    <label>Email Address</label>
                </div>
                <div className="sign-up-form-group">
                    <input type="text" required name="phoneNumber" onChange={handleSignUpFormInput} />
                    <label>Phone Number</label>
                </div>
                <div className="sign-up-form-group gender-field">
                    <span>Gender</span>
                    <div className="gender-category">
                        <label>
                            <input type="radio" name="gender" value="Male" required onChange={handleSignUpFormInput} /> Male
                        </label>
                        <label>
                            <input type="radio" name="gender" value="Female" onChange={handleSignUpFormInput} /> Female
                        </label>
                        <label>
                            <input type="radio" name="gender" value="Prefer not to say" onChange={handleSignUpFormInput} /> Prefer not to say
                        </label>
                    </div>
                </div>

                <div className="row">
                    <div className="sign-up-form-group">
                        <input type="password" required name="password" onChange={handleSignUpFormInput} />
                        <label>Enter Password</label>
                    </div>
                    <div className="sign-up-form-group">
                        <input type="password" required name="confirmPassword" onChange={handleSignUpFormInput} />
                        <label>Confirm Password</label>
                    </div>
                </div>

                <div className="sign-up-form-group profile-photo-field">
                    <span>Upload Profile Photo</span>
                    <input type="file" accept="image/*" name="profilePhoto" onChange={handleFileChange} />
                    {profilePhoto && (
                        <div style={{ marginTop: "10px", fontSize: "0.9rem" }}>
                            Selected: <strong>{profilePhoto.name}</strong> ({(profilePhoto.size / (1024 * 1024)).toFixed(2)} MB)
                            <br />
                            <img
                                src={URL.createObjectURL(profilePhoto)}
                                alt="Preview"
                                style={{
                                    marginTop: "10px",
                                    height: "80px",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                    padding: "4px"
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="checkbox-group">
                    <label className="checkbox-label">
                        <input type="checkbox" required />
                        <span className="checkbox-text">
                            I confirm that the email and phone number entered are <span>Active</span> and agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>.
                        </span>
                    </label>
                </div>

                <button type="submit" className="btn" disabled={loading}>Sign Up</button>
            </form>
            <span className='login-action'>Have an account? <Link to={'/log-in'}>Login</Link></span>
        </div>
    );
};
