import React, { useContext } from 'react';
import './adminInfo.css';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";

export const AdminInfo = () => {

    const { userData, backendUrl } = useContext(AppContext);
    const navigate = useNavigate();
    const createdAtDate = userData.createdAt;
    const formattedCreatedAtDate = format(new Date(createdAtDate), "dd-MM-yyyy hh:mm:ss a").toUpperCase();
    const updatedAtDate = userData.updatedAt;
    const formattedUpdatedAtDate = format(new Date(updatedAtDate), "dd-MM-yyyy hh:mm:ss a").toUpperCase();

    return (
        <div className="common-container admin-info-container">
            <div className="common-container-heading">About Me</div>
            <div className="actions" onClick={() => { navigate("/settings") }}>
                <img src="Gallery/edit_icon.png" alt="edit.png" />
            </div>
            <div className="admin-profile-container">
                <div className="admin-profile-section">
                    <div className="admin-profile-img">
                        <img
                            src={
                                userData.profileImageUrl
                                    ? `${backendUrl}${userData.profileImageUrl}`
                                    : "Gallery/avatar_img.avif"
                            }
                            alt="Profile Picture" />
                    </div>
                    <div className="profile-details">
                        <h2>
                            {(userData.firstName && userData.lastName)
                                ? `${userData.firstName} ${userData.lastName}`
                                : "Guest"}
                        </h2>
                    </div>
                </div>
                <table className="details-table">
                    <tbody>
                        <tr>
                            <td>First Name :</td>
                            <td>{userData.firstName}</td>
                        </tr>
                        <tr>
                            <td>Last Name :</td>
                            <td>{userData.lastName}</td>
                        </tr>
                        <tr>
                            <td>Email Address : </td>
                            <td>{userData.email}</td>
                        </tr>
                        <tr>
                            <td>Phone Number :</td>
                            <td>{userData.phoneNumber}</td>
                        </tr>
                        <tr>
                            <td>Gender :</td>
                            <td>{userData.gender}</td>
                        </tr>
                        <tr>
                            <td>Account created at :</td>
                            <td>{formattedCreatedAtDate}</td>
                        </tr>
                        <tr>
                            <td>Account last updated at :</td>
                            <td>{formattedUpdatedAtDate}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
