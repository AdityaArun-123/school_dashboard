import React, { useContext, useEffect, useState } from 'react';
import './loginModal.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export const LoginModal = () => {
  const [adminLoginData, setAdminLoginData] = useState({
    email: "",
    password: ""
  });
  const { backendUrl, setIsLoggedIn, getUserData, isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleLoginFormInput = (event) => {
    const { name, value } = event.target;
    setAdminLoginData({ ...adminLoginData, [name]: value });
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/auth/login`, adminLoginData, { withCredentials: true });
      if (response.status === 200) {
        const message = response.data?.message || "Login Successfully...";
        toast.success(message);

        await getUserData();
        setIsLoggedIn(true);

        sessionStorage.setItem("justLoggedIn", "true");

        navigate("/", { replace: true });
      }
    } catch (error) {
      const message = error.response?.data?.data?.message || "Login failed";
      toast.error(message);
    }
  }

  return (
    <div className="log-in-container">
      <h1>Login</h1>
      <form onSubmit={onSubmitHandler} method='post'>
        <div className="log-in-form-group">
          <input type="email" required name='email' onChange={handleLoginFormInput} />
          <label>Email</label>
        </div>
        <div className="log-in-form-group">
          <input type="password" required name='password' onChange={handleLoginFormInput} />
          <label>Enter Password</label>
          <span className="forget-password"><Link to="/forget-password" state={{ internalNav: true }}>Forget Password?</Link></span>
        </div>
        <button type="submit" className="btn">Login</button>
      </form>
      <span className="sign-up-action">Don't have an account? <Link to="/sign-up">Sign Up</Link></span>
    </div>
  );
};
