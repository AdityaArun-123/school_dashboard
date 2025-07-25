import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

export const AddTeachers = () => {
  const [teacherData, setTeacherData] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    religion: "",
    email: "",
    classTeacherOf: "",
    address: "",
    phoneNumber: "",
    salary : "",
  });
  const [teacherPhoto, setTeacherPhoto] = useState(null);
  const { backendUrl, api } = useContext(AppContext);
  const [loading, setIsLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setTeacherData({ ...teacherData, [name]: value });
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
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", teacherPhoto);
      formData.append(
        "teacher",
        new Blob([JSON.stringify(teacherData)], { type: "application/json" })
      );

      const response = await api.post(`${backendUrl}/teacher/add-teacher`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      if (response.status === 201) {
        toast.success(response.data?.message || "Teacher added successfully..");
        resetHandler();
      }
    } catch (error) {
      toast.error(error.response?.data?.data?.message || "Something went wrong! Try again in some time.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetHandler = () => {
    setTeacherData({
      name: "",
      gender: "",
      dateOfBirth: "",
      bloodGroup: "",
      religion: "",
      email: "",
      classTeacherOf: "",
      address: "",
      phoneNumber: "",
    });
  };

  return (
    <div className="common-container add-teacher-container">
      <h4 className="common-container-heading">Add New Teacher</h4>
      <form onSubmit={onSubmitHandler} onReset={resetHandler}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input type="text" name="name" required value={teacherData.name} onChange={onChangeHandler} />
        </div>

        <div className="form-group">
          <label className="form-label">Gender</label>
          <select name="gender" required value={teacherData.gender} onChange={onChangeHandler}>
            <option value="" disabled>Please Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Date Of Birth</label>
          <input type="date" name="dateOfBirth" required value={teacherData.dateOfBirth} onChange={onChangeHandler} />
        </div>

        <div className="form-group">
          <label className="form-label">Blood Group</label>
          <select name="bloodGroup" required value={teacherData.bloodGroup} onChange={onChangeHandler}>
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
          <select name="religion" required value={teacherData.religion} onChange={onChangeHandler}>
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
          <input type="email" name="email" value={teacherData.email} onChange={onChangeHandler} required />
        </div>

        <div className="form-group">
          <label className="form-label">Class Teacher Of</label>
          <select name="classTeacherOf" required value={teacherData.classTeacherOf} onChange={onChangeHandler}>
            <option value="" disabled selected>Please Select Class</option>
            <option value="1-A">1-A</option>
            <option value="1-B">1-B</option>
            <option value="1-C">1-C</option>
            <option value="2-A">2-A</option>
            <option value="2-B">2-B</option>
            <option value="2-C">2-C</option>
            <option value="3-A">3-A</option>
            <option value="3-B">3-B</option>
            <option value="3-C">3-C</option>
            <option value="4-A">4-A</option>
            <option value="4-B">4-B</option>
            <option value="4-C">4-C</option>
            <option value="5-A">5-A</option>
            <option value="5-B">5-B</option>
            <option value="5-C">5-C</option>
            <option value="6-A">6-A</option>
            <option value="6-B">6-B</option>
            <option value="6-C">6-C</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Phone</label>
          <input type="text" name="phoneNumber" value={teacherData.phoneNumber} onChange={onChangeHandler} required />
        </div>

        <div className="form-group">
          <label className="form-label">Salary</label>
          <input type="text" name="salary" value={teacherData.salary} onChange={onChangeHandler} required />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Address</label>
          <textarea rows={3} name="address" value={teacherData.address} onChange={onChangeHandler} required />
        </div>

        <div className="form-group">
          <label className="form-label">Upload Teacher Photo (Max 2MB)</label>
          <input type="file" name="photo" onChange={handleFileChange} accept="image/*" />
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
