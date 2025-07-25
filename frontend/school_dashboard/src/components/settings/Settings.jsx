import React, { useContext, useEffect, useState } from 'react';
import './settings.css'
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

export const Settings = () => {

    const { userData, backendUrl, api, setUserData } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [editedUserData, setEditedUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: ""
    });
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profilePhotoChanged, setProfilePhotoChanged] = useState(false);

    useEffect(() => {
        setEditedUserData({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            gender: userData.gender
        });
    }, []);

    const handleSignUpFormInput = (event) => {
        const { name, value } = event.target;
        setEditedUserData({ ...editedUserData, [name]: value });
    }

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > 4) {
                toast.error("Profile image must be less than 4MB.");
                return;
            }
            setProfilePhoto(file);
            setProfilePhotoChanged(true);
        }
    }

    const hasUserDataChanged = () => {
        for (let key in editedUserData) {
            if (editedUserData[key] !== userData[key]) {
                return true;
            }
        }
        return false;
    }

    const handleSave = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const isFormChanged = hasUserDataChanged();
        if (!isFormChanged && !profilePhotoChanged) {
            toast.info('No changes made.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", profilePhoto);
            formData.append("profile", new Blob([JSON.stringify(editedUserData)], { type: "application/json" }));
            
            const response = await api.post(`${backendUrl}/profile/update-profile`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });
            if (response.status === 200) {
                setUserData(response.data?.data);
                toast.success(response.data?.data?.message || "Data edited successfully...");
            }
        } catch (error) {
            toast.error(error.response?.data?.data?.message || "Something went wrong! Try again in some time.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="common-container settings-container">
            <h4 className='common-container-heading'>Owner Account</h4>
            <p>Update your photo and personal details here.</p>
            <div className="profile-section">
                <div className="personal-info">
                    <h3>Personal Information</h3>
                    <form method='post' onSubmit={handleSave}>
                        <div className="form-group setting-form-group">
                            <label className="form-label">First Name</label>
                            <input type="text" name='firstName' required value={editedUserData.firstName} onChange={handleSignUpFormInput} />
                        </div>
                        <div className="form-group setting-form-group">
                            <label className="form-label">Last Name</label>
                            <input type="text" name='lastName' required value={editedUserData.lastName} onChange={handleSignUpFormInput} />
                        </div>
                        <div className="form-group setting-form-group full-width">
                            <label className="form-label">E-Mail</label>
                            <input type="email" name='email' value={editedUserData.email} disabled />
                        </div>
                        <div className="form-group setting-form-group">
                            <label className="form-label">Gender</label>
                            <select name="gender" required value={editedUserData.gender} onChange={handleSignUpFormInput} >
                                <option value="" disabled="">
                                    Please Select Gender
                                </option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer no to say">Prefer not to say</option>
                            </select>
                        </div>
                        <div className="form-group setting-form-group">
                            <label className="form-label">Phone Number</label>
                            <input type="number" name='phoneNumber' required value={editedUserData.phoneNumber} onChange={handleSignUpFormInput} />
                        </div>
                        <div className="buttons">
                            <button type='submit' className="save">Save</button>
                            <button className="cancel">Cancel</button>
                        </div>
                    </form>
                </div>
                <div className="profile-photo">
                    <h3>Your Photo</h3>
                    <div className="photo-container">
                        {userData.profileImageUrl ? (
                            <img
                                src={
                                    profilePhoto
                                        ? URL.createObjectURL(profilePhoto)
                                        : userData.profileImageUrl
                                            ? `${backendUrl}${userData.profileImageUrl}`
                                            : "Gallery/avatar_img.avif"
                                }
                                alt="Profile Picture"
                            />
                        ) : (
                            <div className="avatar-placeholder">
                                {editedUserData.firstName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <h4>{editedUserData.firstName + " " + editedUserData.lastName}</h4>
                        <div className="profile-photo-buttons">
                            <input type="file" accept="image/*" onChange={handlePhotoChange} hidden id="upload-photo" />
                            <label htmlFor="upload-photo" className="update">
                                Update
                            </label>
                            <button
                                className="delete"
                                type="button"
                                onClick={() => {
                                    setProfilePhoto(null);
                                    setProfilePhotoChanged(true);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
