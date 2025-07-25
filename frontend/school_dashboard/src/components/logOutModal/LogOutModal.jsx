import React, { useContext } from 'react';
import './logOutModal.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

export const LogOutModal = ({onclose}) => {

  const navigate = useNavigate();
  const {backendUrl, setIsLoggedIn, setUserData} = useContext(AppContext);

  const closeLogoutModal = () => {
        onclose();
    }

  const handleLogout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(backendUrl + "/auth/logout");
            if (response.status === 200) {
                setIsLoggedIn(false);
                setUserData({});
                navigate("/log-in", {replace : true});
                const message = response.data?.message || "Logged out successfully!";
                toast.success(message);
            }
        } catch (error) {
          console.log(error.response);
            if (error.response?.status === 400) {
                toast.error("Bad request: Logout request is invalid.");
            } else {
                toast.error(error.response?.data?.data?.message || "Logout failed. Please try again.");
            }
        }
    }

  return (
    <>
      <div className="logout-confirm-modal-bg-container" onClick={closeLogoutModal}></div>
      <div class="logout-condirm-modal">
        <div class="modal-header">
          <img src="Gallery/log_out_icon.png" alt="" />
          <span>LogOut Account</span>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to logout? Once you logout you need to login again. Are you Ok?</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" onClick={closeLogoutModal}>Cancel</button>
          <button class="btn btn-logout" onClick={handleLogout}>Yes, LogOut !</button>
        </div>
      </div>
    </>
  )
}
