import React, { useState, useContext } from "react";
import { AppContext } from '../../context/AppContext';
import { toast } from "react-toastify";

export const AddStudents = () => {
  const [studentData, setStudentData] = useState({
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
    address: ""
  });

  const [studentPhoto, setStudentPhoto] = useState(null);
  const { backendUrl, api } = useContext(AppContext);
  const [loading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStudentData({ ...studentData, [name]: value });
  };
  console.log(studentPhoto);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 2) {
        toast.error("Student photo must be less than 2MB.");
        setStudentPhoto(null);
        e.target.value = "";
        return;
      }
      setStudentPhoto(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", studentPhoto);
      formData.append(
        "student",
        new Blob([JSON.stringify(studentData)], { type: "application/json" })
      );

      const response = await api.post(`${backendUrl}/student/add-student`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      });
      if (response.status === 201) {
        toast.success(response.data?.message || "Student added successfully..");
        handleReset();
      }
    } catch (error) {
      toast.error(error.response?.data?.data?.message || "Something went wrong! Try again in some time.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStudentData({
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
    setStudentPhoto(null);
  };

  return (
    <div className="common-container add-student-container">
      <h4 className="common-container-heading">Add New Student</h4>

      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input type="text" name="name" value={studentData.name} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Gender</label>
          <select name="gender" value={studentData.gender} onChange={handleInputChange} required >
            <option value="" disabled>Please Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Date Of Birth</label>
          <input type="date" name="dob" value={studentData.dob} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Father's Name</label>
          <input type="text" name="fatherName" value={studentData.fatherName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Father's Occupation</label>
          <input type="text" name="fatherOccupation" value={studentData.fatherOccupation} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Mother's Name</label>
          <input type="text" name="motherName" value={studentData.motherName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Mother's Occupation</label>
          <input type="text" name="motherOccupation" value={studentData.motherOccupation} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Blood Group</label>
          <select name="bloodGroup" value={studentData.bloodGroup} onChange={handleInputChange} required>
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
          <select name="religion" value={studentData.religion} onChange={handleInputChange} required >
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
          <input type="email" name="email" value={studentData.email} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Class</label>
          <select name="studentClass" value={studentData.studentClass} onChange={handleInputChange} required >
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
          <label className="form-label">Section</label>
          <select name="section" value={studentData.section} onChange={handleInputChange} required>
            <option value="" disabled>Please Select Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input type="text" name="phoneNumber" value={studentData.phoneNumber} onChange={handleInputChange} required />
        </div>
        <div className="form-group full-width">
          <label className="form-label">Address</label>
          <textarea rows={3} name="address" value={studentData.address} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Upload Student Photo (Max 2MB)</label>
          <input type="file" name="photo" onChange={handleFileChange} accept="image/*" />
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
            {loading ? "Adding..." : "Add"}
          </button>
          <button type="reset" className="btn btn-reset">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};
