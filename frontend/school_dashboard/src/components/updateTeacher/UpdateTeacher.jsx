import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

export const UpdateTeacher = () => {
    const [updateTeacherData, setUpdateTeacherData] = useState({});
    const [teacherOriginalData, setTeacherOriginalData] = useState({});
    const [teacherPhoto, setTeacherPhoto] = useState(null);
    const [teacherUpdatedPhoto, setTeacherUpdatedPhoto] = useState(false);
    const { backendUrl, api } = useContext(AppContext);
    const [loading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        getTeacher();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUpdateTeacherData({ ...updateTeacherData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > 2) {
                toast.error("Teacher photo must be less than 2MB.");
                setTeacherPhoto(null);
                e.target.value = "";
                return;
            }
            setTeacherPhoto(file);
            setTeacherUpdatedPhoto(true);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const isFormChanged = hasTeacherDataChanged();
        if (!isFormChanged && !teacherUpdatedPhoto) {
            toast.info('No changes made.');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", teacherPhoto);
            formData.append(
                "teacher",
                new Blob([JSON.stringify(updateTeacherData)], { type: "application/json" })
            );

            const response = await api.post(`${backendUrl}/teacher/update-teacher?id=${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.status === 201) {
                toast.success(response.data?.message || "Teacher record updated successfully.");
                navigate("/view-all-teachers", { replace: true });
            }
        } catch (error) {
            toast.error(error.response?.data?.data?.message || "Something went wrong! Try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateReset = () => {
        setUpdateTeacherData({
            name: "",
            gender: "",
            dateOfBirth: "",
            bloodGroup: "",
            religion: "",
            email: "",
            phoneNumber: "",
            classTeacherOf: "",
            address: "",
            salary: "",
        });
        setTeacherPhoto(null);
        setTeacherUpdatedPhoto(false);
    };

    const hasTeacherDataChanged = () => {
        for (let key in updateTeacherData) {
            if (updateTeacherData[key] !== teacherOriginalData[key]) {
                return true;
            }
        }
        return false;
    };

    const getTeacher = async () => {
        try {
            const response = await api.get(`${backendUrl}/teacher/fetch-teacher?id=${id}`);
            if (response.status === 200) {
                toast.success(response.data?.message || "Successfully fetched teacher details.");
                setTeacherOriginalData(response.data.data);
                setUpdateTeacherData(response.data.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.data?.message || "Something went wrong! Try again later.");
        }
    };

    return (
        <div className="common-container add-teacher-container">
            <h4 className='common-container-heading'>Update Teacher</h4>
            <form onSubmit={handleUpdateSubmit} onReset={handleUpdateReset}>
                <div className="form-group">
                    <label className="form-label">Name</label>
                    <input type="text" name="name" required value={updateTeacherData.name} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select name="gender" required value={updateTeacherData.gender} onChange={handleInputChange}>
                        <option value="" disabled>Please Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Date Of Birth</label>
                    <input type="date" name="dateOfBirth" required value={updateTeacherData.dateOfBirth} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select name="bloodGroup" required value={updateTeacherData.bloodGroup} onChange={handleInputChange}>
                        <option value="" disabled>Please Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Religion</label>
                    <select name="religion" required value={updateTeacherData.religion} onChange={handleInputChange}>
                        <option value="" disabled>Please Select Religion</option>
                        <option value="hindu">Hindu</option>
                        <option value="muslim">Muslim</option>
                        <option value="christian">Christian</option>
                        <option value="sikh">Sikh</option>
                        <option value="buddhist">Buddhist</option>
                        <option value="jain">Jain</option>
                        <option value="parsi">Parsi</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">E-Mail</label>
                    <input type="email" name="email" value={updateTeacherData.email} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                    <label className="form-label">Class Teacher Of</label>
                    <select name="classTeacherOf" required value={updateTeacherData.classTeacherOf} onChange={handleInputChange}>
                        <option value="" disabled>Please Select Class</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="text" name="phoneNumber" value={updateTeacherData.phoneNumber} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                    <label className="form-label">Salary</label>
                    <input type="text" name="salary" onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                    <label className="form-label">Address</label>
                    <textarea rows={3} name="address" value={updateTeacherData.address} onChange={handleInputChange} required />
                </div>

                <div className="form-group teacher-photo-group">
                    <label className="form-label">Upload Teacher Photo (Max 2MB)</label>
                    <input type="file" name="photo" onChange={handleFileChange} accept="image/*" />

                    {!teacherUpdatedPhoto && updateTeacherData.teacherImageUrl && (
                        <div style={{ marginTop: "10px", fontSize: "0.9rem" }}>
                            Current Photo:
                            <br />
                            <img
                                src={`${backendUrl}${updateTeacherData.teacherImageUrl}`}
                                alt="Current"
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

                    {teacherPhoto && (
                        <div style={{ marginTop: "10px", fontSize: "0.9rem" }}>
                            Selected: <strong>{teacherPhoto.name}</strong> ({(teacherPhoto.size / (1024 * 1024)).toFixed(2)} MB)
                            <br />
                            <img
                                src={URL.createObjectURL(teacherPhoto)}
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

                <div className="form-group btn-container">
                    <button type="submit" className="btn btn-save" disabled={loading}>
                        {loading ? "Updating..." : "Update"}
                    </button>
                    <button type="reset" className="btn btn-reset">
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
};
