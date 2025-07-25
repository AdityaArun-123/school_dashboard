import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

export const UpdateStudents = () => {
    const [updateStudentData, setUpdateStudentData] = useState({});
    const [studentOriginalData, setStudentOriginalData] = useState({});
    const [studentPhoto, setStudentPhoto] = useState(null);
    const [studentUpdatedPhoto, setStudentUpdatedPhoto] = useState(false);
    const { backendUrl, api } = useContext(AppContext);
    const [loading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        getStudent();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUpdateStudentData({ ...updateStudentData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > 2) {
                toast.error("Student photo must be less than 2MB.");
                setStudentUpdatedPhoto(null);
                e.target.value = "";
                return;
            }
            setStudentPhoto(file);
            setStudentUpdatedPhoto(true);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const isFormChanged = hasStudentDataChanged();
        if (!isFormChanged && !studentUpdatedPhoto) {
            toast.info('No changes made.');
            return;
        }
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", studentPhoto);
            formData.append(
                "student",
                new Blob([JSON.stringify(updateStudentData)], { type: "application/json" })
            );

            const response = await api.post(`${backendUrl}/student/update-student?id=${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            });

            if (response.status === 201) {
                toast.success(response.data?.message || "Student record updated successfully..");
                navigate("/view-all-students", { replace: true });
            }
        } catch (error) {
            toast.error(error.response?.data?.data?.message || "Something went wrong! Try again in some time.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateReset = () => {
        setUpdateStudentData({
            name: "",
            gender: "",
            dob: "",
            fatherName: "",
            fatherOccupation: "",
            motherName: "",
            motherOccupation: "",
            bloodGroup: "",
            religion: "",
            email: "",
            studentClass: "",
            section: "",
            phoneNumber: "",
            address: "",
        });
        setStudentUpdatedPhoto(null);
    };

    const hasStudentDataChanged = () => {
        for (let key in updateStudentData) {
            if (updateStudentData[key] !== studentOriginalData[key]) {
                return true;
            }
        }
        return false;
    }

    const getStudent = async () => {
        try {
            const response = await api.get(`${backendUrl}/student/fetch-student?id=${id}`, { withCredentials: true });
            if (response.status === 200) {
                toast.success(response.data?.message || "Successfully fetched the student details..");
                setStudentOriginalData(response.data.data);
                setUpdateStudentData(response.data.data);
                console.log(response.data.data);

            }
        } catch (error) {
            toast.error(error.response?.data?.data?.message || "Something went wrong! Try again in some time.");
        }
    }

    return (
        <div className="common-container add-student-container">
            <h4 className="common-container-heading">Update Student</h4>

            <form onSubmit={handleUpdateSubmit} onReset={handleUpdateReset}>
                <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={updateStudentData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                        name="gender"
                        value={updateStudentData.gender}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>
                            Please Select Gender
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Date Of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={updateStudentData.dob}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Father's Name</label>
                    <input
                        type="text"
                        name="fatherName"
                        value={updateStudentData.fatherName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Father's Occupation</label>
                    <input
                        type="text"
                        name="fatherOccupation"
                        value={updateStudentData.fatherOccupation}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Mother's Name</label>
                    <input
                        type="text"
                        name="motherName"
                        value={updateStudentData.motherName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Mother's Occupation</label>
                    <input
                        type="text"
                        name="motherOccupation"
                        value={updateStudentData.motherOccupation}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select
                        name="bloodGroup"
                        value={updateStudentData.bloodGroup}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>
                            Please Select Blood Group
                        </option>
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
                    <select
                        name="religion"
                        value={updateStudentData.religion}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>
                            Please Select Religion
                        </option>
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
                    <input
                        type="email"
                        name="email"
                        value={updateStudentData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Class</label>
                    <select
                        name="studentClass"
                        value={updateStudentData.studentClass}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>
                            Please Select Class
                        </option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Section</label>
                    <select
                        name="section"
                        value={updateStudentData.section}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>
                            Please Select Section
                        </option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={updateStudentData.phoneNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group full-width">
                    <label className="form-label">Address</label>
                    <textarea
                        rows={3}
                        name="address"
                        value={updateStudentData.address}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group student-photo-group">
                    <label className="form-label">Upload Student Photo (Max 2MB)</label>
                    <input
                        type="file"
                        name="photo"
                        onChange={handleFileChange}
                        accept="image/*"
                    />

                    {!studentUpdatedPhoto && updateStudentData.studentImageUrl && (
                        <div style={{ marginTop: "10px", fontSize: "0.9rem" }}>
                            Current Photo:
                            <br />
                            <img
                                src={`${backendUrl}${updateStudentData.studentImageUrl}`}
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

                    {studentPhoto && (
                        <div style={{ marginTop: "10px", fontSize: "0.9rem" }}>
                            Selected: <strong>{studentPhoto.name}</strong> ({(studentPhoto.size / (1024 * 1024)).toFixed(2)} MB)
                            <br />
                            <img
                                src={URL.createObjectURL(studentPhoto)}
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
    )
}
