import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import '../AttendanceCSS/attendance-styling.css';

export const MarkStudentAttendence = () => {
    const [allStudentData, setAllStudentData] = useState([]);
    const [checkedStudentIds, setCheckedStudentIds] = useState([]);

    const [searchFilters, setSearchFilters] = useState({
        admissionId: '',
        name: ''
    });

    const [attendanceForm, setAttendanceForm] = useState({
        attendanceDate: '',
        studentClass: '',
        section: '',
        markingMode: 'absent'
    });

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { backendUrl, api } = useContext(AppContext);

    const fetchStudents = async () => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('page', page);
            queryParams.append('size', 5);
            queryParams.append('studentClass', attendanceForm.studentClass);
            queryParams.append('section', attendanceForm.section);
            const response = await api.get(`${backendUrl}/student/fetch-students-by-class-section?${queryParams.toString()}`);
            if (response.status === 200) {
                setAllStudentData(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load students.");
        }
    };

    const searchStudents = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (searchFilters.admissionId.trim() !== '') queryParams.append('admissionId', searchFilters.admissionId);
            if (searchFilters.name.trim() !== '') queryParams.append('name', searchFilters.name);

            queryParams.append('page', page);
            queryParams.append('size', 5);

            const response = await api.get(`${backendUrl}/student/search-student?${queryParams.toString()}`);

            if (response.status === 200) {
                setAllStudentData(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Search failed.");
        }
    };

    useEffect(() => {
        if (attendanceForm.studentClass && attendanceForm.section) {
            fetchStudents();
        }
    }, [page]);

    const handleSearchInputChange = (e) => {
        setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        setPage(0);
        searchStudents();
    };

    const handleClearSearch = () => {
        setSearchFilters({ admissionId: '', name: '' });
        fetchStudents();
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) setPage(newPage);
    };

    const handleAttendanceInputChange = (e) => {
        const { name, value } = e.target;
        setAttendanceForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleGetAllStudentSubmit = (e) => {
        e.preventDefault();
        fetchStudents();
    };

    const handleAttendanceReset = () => {
        setAttendanceForm({
            attendanceDate: '',
            studentClass: '',
            section: ''
        });
    };

    const handleAttendanceStatusChange = (admissionId) => {
        setCheckedStudentIds((prev) => {
            if (prev.includes(admissionId)) {
                return prev.filter((id) => id !== admissionId);
            } else {
                return [...prev, admissionId];
            }
        });
    };

    const handleAttendanceSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            attendanceDate: attendanceForm.attendanceDate,
            studentClass: attendanceForm.studentClass,
            section: attendanceForm.section,
            markingMode: attendanceForm.markingMode,
            students: checkedStudentIds.map((id) => ({ studentId: id }))
        };
        try {
            const response = await api.post(`${backendUrl}/attendance/mark-student-attendance`, payload);
            if (response.status === 201) {
                toast.success("Attendance uploaded successfully!");
                setCheckedStudentIds([]);
                fetchStudents();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to upload attendance.");
        }
    };

    return (
        <div className="common-container">
            <div className="mark-attendance-container">
                <h4 className="common-container-heading">Mark Student Attendance</h4>

                <form onSubmit={handleGetAllStudentSubmit} onReset={handleAttendanceReset}>
                    <div className="form-group">
                        <label className="form-label">Attendance Date</label>
                        <input type="date" name="attendanceDate" required onChange={handleAttendanceInputChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Class</label>
                        <select name="studentClass" onChange={handleAttendanceInputChange} required value={attendanceForm.studentClass}>
                            <option value="" disabled>
                                Please Select Class
                            </option>
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

                    <div className="form-group">
                        <label className="form-label">Marking Mode</label>
                        <select name="markingMode" onChange={handleAttendanceInputChange} required>
                            <option value="absent">Mark Absent Students</option>
                            <option value="present">Mark Present Students</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-save">Get Students</button>
                </form>

                <div className="search-bar">
                    <input type="text" name="admissionId" placeholder="Search by Admission Id ..." value={searchFilters.admissionId} onChange={handleSearchInputChange} />
                    <input type="text" name="name" placeholder="Search by Name ..." value={searchFilters.name} onChange={handleSearchInputChange} />
                    <button onClick={handleSearch} className="search-btn">Search</button>
                    <button onClick={handleClearSearch} className="clear-btn">Clear</button>
                </div>

                <div className="attendance-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Adminssion Id</th>
                                <th>Student Name</th>
                                <th>
                                    Mark Attendence
                                    <span>
                                        {
                                            attendanceForm.markingMode === "absent" ? " (Mark Absentees Only)" : " (Mark Presentees Only)"
                                        }
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {allStudentData.map((student) => (
                                <tr key={student.admissionId}>
                                    <td>{student.admissionId}</td>
                                    <td>{student.name}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={checkedStudentIds.includes(student.admissionId)}
                                            onChange={() => handleAttendanceStatusChange(student.admissionId)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <form onSubmit={handleAttendanceSubmit}>
                        <button type="submit" className="btn btn-upload">upload</button>
                    </form>

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
    );
};
