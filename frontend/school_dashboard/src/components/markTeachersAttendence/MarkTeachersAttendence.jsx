import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import '../AttendanceCSS/attendance-styling.css';

export const MarkTeachersAttendence = () => {
    const [allTeachersData, setAllTeachersData] = useState([]);
    const [checkedTeachersIds, setCheckedTeachersIds] = useState([]);

    const [searchFilters, setSearchFilters] = useState({
        teacherId: '',
        name: ''
    });

    const [attendanceForm, setAttendanceForm] = useState({
        attendanceDate: '',
        markingMode: 'absent'
    });

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { backendUrl, api } = useContext(AppContext);

    const fetchTeachers = async () => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('page', page);
            queryParams.append('size', 5);
            const response = await api.get(`${backendUrl}/teacher/fetch-all-teachers?${queryParams.toString()}`);
            if (response.status === 200) {
                setAllTeachersData(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load teachers.");
        }
    };

    const searchTeachers = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (searchFilters.admissionId.trim() !== '') queryParams.append('teacherId', searchFilters.teacherId);
            if (searchFilters.name.trim() !== '') queryParams.append('name', searchFilters.name);

            queryParams.append('page', page);
            queryParams.append('size', 5);

            const response = await api.get(`${backendUrl}/teacher/search-teacher?${queryParams.toString()}`);

            if (response.status === 200) {
                setAllTeachersData(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Search failed.");
        }
    };

    useEffect(() => {
        if(attendanceForm.attendanceDate){
            fetchTeachers();
        }
    }, [page]);

    const handleSearchInputChange = (e) => {
        setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        setPage(0);
        searchTeachers();
    };

    const handleClearSearch = () => {
        setSearchFilters({ teacherId: '', name: '' });
        fetchTeachers();
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) setPage(newPage);
    };

    const handleAttendanceInputChange = (e) => {
        const { name, value } = e.target;
        setAttendanceForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleGetAllTeachersSubmit = (e) => {
        e.preventDefault();
        fetchTeachers();
    };

    const handleAttendanceReset = () => {
        setAttendanceForm({
            attendanceDate: '',
        });
    };

    const handleAttendanceStatusChange = (teacherId) => {
        setCheckedTeachersIds((prev) => {
            if (prev.includes(teacherId)) {
                return prev.filter((id) => id !== teacherId);
            } else {
                return [...prev, teacherId];
            }
        });
    };

    const handleAttendanceSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            attendanceDate: attendanceForm.attendanceDate,
            markingMode: attendanceForm.markingMode,
            teachers: checkedTeachersIds.map((id) => ({ teacherId: id }))
        };
        try {
            const response = await api.post(`${backendUrl}/attendance/mark-teacher-attendance`, payload);
            if (response.status === 201) {
                toast.success("Attendance uploaded successfully!");
                setCheckedTeachersIds([]);
                fetchTeachers();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to upload attendance.");
        }
    };

    return (
        <div className="common-container">
            <div className="mark-attendance-container">
                <h4 className="common-container-heading">Mark Teacher Attendance</h4>

                <form onSubmit={handleGetAllTeachersSubmit} onReset={handleAttendanceReset}>
                    <div className="form-group">
                        <label className="form-label">Attendance Date</label>
                        <input type="date" name="attendanceDate" required onChange={handleAttendanceInputChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Marking Mode</label>
                        <select name="markingMode" onChange={handleAttendanceInputChange} required>
                            <option value="absent">Mark Absent Students</option>
                            <option value="present">Mark Present Students</option>
                        </select>
                    </div>
                    <div className="get-teacher-btn">
                        <button type="submit" className="btn btn-save">Get Teachers</button>
                    </div>
                </form>

                <div className="search-bar">
                    <input type="text" name="admissionId" placeholder="Search by Teacher Id ..." value={searchFilters.teacherId} onChange={handleSearchInputChange} />
                    <input type="text" name="name" placeholder="Search by Name ..." value={searchFilters.name} onChange={handleSearchInputChange} />
                    <button onClick={handleSearch} className="search-btn">Search</button>
                    <button onClick={handleClearSearch} className="clear-btn">Clear</button>
                </div>

                <div className="attendance-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Teacher Id</th>
                                <th>Teacher Name</th>
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
                            {allTeachersData.map((teacher) => (
                                <tr key={teacher.teacherId}>
                                    <td>{teacher.teacherId}</td>
                                    <td>{teacher.name}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={checkedTeachersIds.includes(teacher.teacherId)}
                                            onChange={() => handleAttendanceStatusChange(teacher.teacherId)}
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
