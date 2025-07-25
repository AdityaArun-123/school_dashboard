import React, { useContext, useEffect, useState } from 'react';
import './profileDropDown.css';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { LogOutModal } from '../logOutModal/LogOutModal';

export const ProfileDropDown = () => {

    const [profileDropDown, setProfileDropDown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const { userData, backendUrl } = useContext(AppContext);

    const toggleProfileDropDown = () => {
        setProfileDropDown(!profileDropDown);
    }

    const handleOutsideClick = (e) => {
        if (e.target.className === "profile-drop-down-bg-container") {
            setProfileDropDown(false);
        }
    }

    return (
        <>
            {
                showLogoutModal && <LogOutModal onclose={() => { setShowLogoutModal(false) }} />
            }
            <div className={profileDropDown ? "profile-drop-down-bg-container" : ""} onClick={(e) => { handleOutsideClick(e) }}></div>
            <div className="navbar">
                <div className="profile" onClick={toggleProfileDropDown}>
                    <div className="profile-info">
                        <span className="profile-name">
                            {(userData.firstName && userData.lastName)
                                ? `${userData.firstName} ${userData.lastName}`
                                : "Guest"}
                        </span>
                    </div>
                    <img src="Gallery/chevron_down_arrow.png" alt="" className={profileDropDown ? "profile-chevron-down-icon active" : "profile-chevron-down-icon"} />
                    <div className="profile-pic">
                        <img
                            src={
                                userData.profileImageUrl
                                    ? `${backendUrl}${userData.profileImageUrl}`
                                    : "Gallery/avatar_img.avif"
                            }
                            alt="Profile Picture"
                        />
                    </div>
                </div>
                <div className={profileDropDown ? "dropdowm-top-arrow active" : "dropdowm-top-arrow"} />
                <div className={profileDropDown ? "dropdown active" : "dropdown"}>
                    <ul>
                        <li onClick={() => { toggleProfileDropDown(); navigate('/admin-info') }}>
                            <img src="Gallery/profile_icon_dark.png" alt="" />My Profile
                        </li>
                        <li onClick={() => { toggleProfileDropDown(); navigate('/settings') }}>
                            <img src="Gallery/settings_icon_dark.png" alt="" />Account Settings
                        </li>
                        <li onClick={() => { toggleProfileDropDown(); setShowLogoutModal(true); }}>
                            <img src="Gallery/logout_icon_dark.png" alt="" />Log Out
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}
