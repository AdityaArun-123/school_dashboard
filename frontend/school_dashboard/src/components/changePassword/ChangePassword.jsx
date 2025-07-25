import React, { useContext, useEffect, useState } from 'react';
import './change-password.css';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ChangePassword = () => {

    const [changePasswordData, setChangePasswordData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const { backendUrl } = useContext(AppContext);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const handleConfirmFormInput = (event) => {
        const { name, value } = event.target;
        setChangePasswordData({ ...changePasswordData, [name]: value });
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/auth/reset-password`, { token : token, newPassword : changePasswordData.newPassword });
            if(response.status === 200) {
                toast.success(response.data?.message || "Your password has been successfully reset.");
                setTimeout(()=>{navigate("/log-in", {replace : true})}, 500);
            }
        } catch(error) {
            toast.error(error.response?.data?.data?.message || "Something went wrong! Try again in some time.");
        } finally{
            setIsLoading(false);
        }
    }
    return (
        <div className="change-password-container">
            <h2>Change your password</h2>
            <p>Enter a new password below to change your password</p>
            <form method='post' onSubmit={onSubmitHandler}>
                <div className="change-password-form-group">
                    <input type="password" required name='newPassword' onChange={handleConfirmFormInput} />
                    <label>New password</label>
                </div>
                <div className="change-password-form-group">
                    <input type="password" required name='confirmPassword' onChange={handleConfirmFormInput} />
                    <label>Confirm password</label>
                </div>
                <button type="submit" className="btn" disabled={isLoading}>Change Password</button>
            </form>
        </div>
    )
}
