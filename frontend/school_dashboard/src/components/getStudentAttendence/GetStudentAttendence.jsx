import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

export const GetStudentAttendence = () => {
  const [allStudentData, setAllStudentData] = useState([]);

  const [attendanceForm, setAttendanceForm] = useState({
    attendanceDate: '',
    name: '',
    studentClass: '',
    section: ''
  });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { backendUrl, api } = useContext(AppContext);

  useEffect(() => {
    if (attendanceForm.studentClass && attendanceForm.section && attendanceForm.attendanceDate) {
      handleGetAllStudentSubmit();
    }
  }, [page]);

  const handleAttendanceInputChange = (e) => {
    setAttendanceForm({ ...attendanceForm, [e.target.name]: e.target.value });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) setPage(newPage);
  };

  const handleGetAllStudentSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      const queryParams = new URLSearchParams();

      if (attendanceForm.attendanceDate.trim() !== '') queryParams.append('attendanceDate', attendanceForm.attendanceDate);
      if (attendanceForm.name.trim() !== '') queryParams.append('name', attendanceForm.name);
      if (attendanceForm.studentClass.trim() !== '') queryParams.append('studentClass', attendanceForm.studentClass);
      if (attendanceForm.section.trim() !== '') queryParams.append('section', attendanceForm.section);

      queryParams.append('page', page);
      queryParams.append('size', 5);

      const response = await api.get(`${backendUrl}/attendance/fetch-all-student-attendance?${queryParams.toString()}`);
      if (response.status === 200) {
        setAllStudentData(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed.");
    }
  };

  const handleAttendanceReset = () => {
    setAttendanceForm({ attendanceDate: '', name: '', studentClass: '', section: '' });
  };

  const handleClearSearch = () => {
    attendanceForm({ name: '' });
    handleGetAllStudentSubmit();
  };

  return (
    <div className="common-container">
      <div className="get-attendance-container">
        <h4 className="common-container-heading">Get Student Attendance</h4>

        <form onSubmit={handleGetAllStudentSubmit} onReset={handleAttendanceReset}>
          <div className="form-group">
            <label className="form-label">Attendance Date</label>
            <input type="date" name="attendanceDate" required value={attendanceForm.attendanceDate} onChange={handleAttendanceInputChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Class</label>
            <select name="studentClass" onChange={handleAttendanceInputChange} required value={attendanceForm.studentClass}>
              <option value="" disabled>Please Select Class</option>
              {[...Array(6)].map((_, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {idx + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Section</label>
            <select name="section" onChange={handleAttendanceInputChange} required value={attendanceForm.section}>
              <option value="" disabled>
                Please Select Section
              </option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
          <button type='submit' className="btn btn-save special-attendance-btn">Get Students</button>
        </form>

        <div className="search-bar">
          <input type="text" name="name" placeholder='Search by name ...' value={attendanceForm.name} onChange={handleAttendanceInputChange} />
          <button onClick={handleGetAllStudentSubmit} className="search-btn">Search</button>
          <button onClick={handleClearSearch} className="clear-btn">Clear</button>
        </div>

        <div className="attendance-container">
          <table>
            <thead>
              <tr>
                <th>Adminssion Id</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Attendance Date</th>
                <th>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {allStudentData.length > 0 ? (
                allStudentData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.studentAdmissionId}</td>
                    <td className="photo">
                      <img src={item.studentImageUrl ? `${backendUrl}${item.studentImageUrl}` : "Gallery/avatar_img.avif"} alt="Profile" />
                    </td>
                    <td>{item.studentName}</td>
                    <td>{item.studentClass}</td>
                    <td>{item.section}</td>
                    <td>{item.attendanceDate}</td>
                    <td className="attendance-status">
                      <span className={item.attendanceStatus === "ABSENT" ? "absent" : "present"}>{item.attendanceStatus}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" style={{ textAlign: "center" }}>No students found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 0} onClick={() => handlePageChange(page - 1)} className='prev-btn'>« Prev</button>
              {Array.from({ length: totalPages }, (_, index) => index)
                .filter((p) => {
                  const groupStart = Math.floor(page / 5) * 5;
                  return p >= groupStart && p < groupStart + 5;
                })
                .map((p) => (
                  <button key={p} className={page === p ? "active" : ""} onClick={() => handlePageChange(p)}>
                    {p + 1}
                  </button>
                ))}

              <button disabled={page === totalPages - 1} onClick={() => handlePageChange(page + 1)} className='next-btn'>Next »</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}