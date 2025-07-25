import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteConfirmModal } from '../deleteConfirmModal/DeleteConfirmModal';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

export const ViewAllStudents = () => {
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [allStudentData, setAllStudentData] = useState([]);
  const [studentId, setStudentId] = useState(0);

  const [sortBy, setSortBy] = useState("admissionId");
  const [sortDir, setSortDir] = useState("asc");

  const [searchFilters, setSearchFilters] = useState({
    admissionId: '',
    name: '',
    studentClass: '',
    phoneNumber: ''
  });

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();
  const { backendUrl, api } = useContext(AppContext);

  const fetchStudents = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (sortBy && sortDir) {
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDir', sortDir);
      }
      queryParams.append('page', page);
      queryParams.append('size', 5);

      const response = await api.get(`${backendUrl}/student/fetch-all-students?${queryParams.toString()}`);

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
      if (searchFilters.studentClass.trim() !== '') queryParams.append('studentClass', searchFilters.studentClass);
      if (searchFilters.phoneNumber.trim() !== '') queryParams.append('phoneNumber', searchFilters.phoneNumber);

      if (sortBy && sortDir) {
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDir', sortDir);
      }

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
    isSearchMode ? searchStudents() : fetchStudents();
  }, [page, sortBy, sortDir]);

  const handleSearchInputChange = (e) => {
    setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setPage(0);
    setIsSearchMode(true);
    searchStudents();
  };

  const handleClearSearch = () => {
    setSearchFilters({ admissionId: '', name: '', studentClass: '', phoneNumber: '' });
    setIsSearchMode(false);
    setPage(0);
    fetchStudents();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) setPage(newPage);
  };

  const deleteConfirm = async () => {
    try {
      const response = await api.delete(`${backendUrl}/student/delete-student?id=${studentId}`);
      if (response.status === 204) {
        toast.success(response.data?.message || "Record deleted successfully.");
        isSearchMode ? searchStudents() : fetchStudents();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <>
      {showDeleteConfirmModal && (<DeleteConfirmModal onclose={() => setShowDeleteConfirmModal(false)} deleteConfirm={deleteConfirm} />)}

      <div className="common-container">
        <h4 className='common-container-heading'>All Students Data</h4>

        <div className="search-bar">
          <input type="text" name="admissionId" placeholder="Search by Admission Id ..." value={searchFilters.admissionId} onChange={handleSearchInputChange} />
          <input type="text" name="name" placeholder="Search by Name ..." value={searchFilters.name} onChange={handleSearchInputChange} />
          <input type="text" name="studentClass" placeholder="Search by Class ..." value={searchFilters.studentClass} onChange={handleSearchInputChange} />
          <input type="text" name="phoneNumber" placeholder="Search by Phone ..." value={searchFilters.phoneNumber} onChange={handleSearchInputChange} />
          <button onClick={handleSearch} className='search-btn'>Search</button>
          <button onClick={handleClearSearch} className='clear-btn'>Clear</button>
        </div>

        <div className="sorting-block">
          <div className="sort-by">
            <label htmlFor="sortBy">Sort By:</label>
            <select id="sortBy" name="sortBy" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setSortDir(""); }} >
              <option value="">-- Select Field --</option>
              <option value="admissionId">Admission Id</option>
              <option value="name">Name</option>
              <option value="dob">Date of Birth</option>
              <option value="email">Email</option>
              <option value="studentClass">Class</option>
              <option value="section">Section</option>
            </select>
          </div>
          <div className="sort-direction">
            <label htmlFor="direction">Direction:</label>
            <select id="direction" name="sortDir" value={sortDir} onChange={(e) => setSortDir(e.target.value)} disabled={!sortBy} >
              <option value="">-- Select Direction --</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th className="fixed-width-th">Admission Id</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Gender</th>
              <th className="fixed-width-th">Blood Group</th>
              <th>Date of Birth</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Class</th>
              <th>Section</th>
              <th className="fixed-width-th">Father's Name</th>
              <th className="fixed-width-th">Mother's Name</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allStudentData.length > 0 ? (
              allStudentData.map((item, index) => (
                <tr key={index}>
                  <td>{item.admissionId}</td>
                  <td className="photo">
                    <img src={item.studentImageUrl ? `${backendUrl}${item.studentImageUrl}` : "Gallery/avatar_img.avif"} alt="Profile" />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.gender}</td>
                  <td>{item.bloodGroup}</td>
                  <td>{item.dob}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{item.email}</td>
                  <td>{item.studentClass}</td>
                  <td>{item.section}</td>
                  <td>{item.fatherName}</td>
                  <td>{item.motherName}</td>
                  <td>{item.address}</td>
                  <td className="actions">
                    <img src="Gallery/edit_icon.png" alt="Edit" onClick={() => navigate(`/update-student/${item.admissionId}`)} />
                    <img src="Gallery/delete_icon.png" alt="Delete" onClick={() => { setShowDeleteConfirmModal(true); setStudentId(item.admissionId); }} />
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
    </>
  );
}