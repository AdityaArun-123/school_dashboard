import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteConfirmModal } from '../deleteConfirmModal/DeleteConfirmModal';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

export const ViewAllTeachers = () => {

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [allTeachersData, setAllTeachersData] = useState([]);
  const [teacherId, setTeacherId] = useState(0);

  const [sortBy, setSortBy] = useState("teacherId");
  const [sortDir, setSortDir] = useState("asc");

  const [searchFilters, setSearchFilters] = useState({
    teacherId: '',
    name: '',
    classTeacherOf: '',
    phoneNumber: ''
  });

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();
  const { backendUrl, api } = useContext(AppContext);

  const fetchAllTeachers = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (sortBy && sortDir) {
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDir', sortDir);
      }
      queryParams.append('page', page);
      queryParams.append('size', 5);

      const response = await api.get(`${backendUrl}/teacher/fetch-all-teachers?${queryParams.toString()}`);

      if (response.status === 200) {
        setAllTeachersData(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load Teachers.");
    }
  };

  const searchTeachers = async () => {
    try {
      const queryParams = new URLSearchParams();

      if (searchFilters.teacherId.trim() !== '') queryParams.append('teacherId', searchFilters.teacherId);
      if (searchFilters.name.trim() !== '') queryParams.append('name', searchFilters.name);
      if (searchFilters.classTeacherOf.trim() !== '') queryParams.append('classTeacherOf', searchFilters.classTeacherOf);
      if (searchFilters.phoneNumber.trim() !== '') queryParams.append('phoneNumber', searchFilters.phoneNumber);

      if (sortBy && sortDir) {
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDir', sortDir);
      }

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
    isSearchMode ? searchTeachers() : fetchAllTeachers();
  }, [page, sortBy, sortDir]);

  const handleSearchInputChange = (e) => {
    setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setPage(0);
    setIsSearchMode(true);
    searchTeachers();
  };

  const handleClearSearch = () => {
    setSearchFilters({ teacherId: '', name: '', classTeacherOf: '', phoneNumber: '' });
    setIsSearchMode(false);
    setPage(0);
    fetchAllTeachers();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) setPage(newPage);
  };

  const deleteConfirm = async () => {
    try {
      const response = await api.delete(`${backendUrl}/teacher/delete-teacher?id=${teacherId}`);
      if (response.status === 204) {
        toast.success(response.data?.message || "Record deleted successfully.");
        isSearchMode ? searchTeachers() : fetchAllTeachers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <>
      {
        showDeleteConfirmModal && <DeleteConfirmModal onclose={() => { setShowDeleteConfirmModal(false) }} deleteConfirm={deleteConfirm} />
      }
      <div className="common-container">
        <h4 className='common-container-heading'>All Teachers Data</h4>
        <div className="search-bar">
          <input type="text" name="teacherId" placeholder="Search by teacher ID ..." value={searchFilters.teacherId} onChange={handleSearchInputChange} />
          <input type="text" name="name" placeholder="Search by Name ..." value={searchFilters.name} onChange={handleSearchInputChange} />
          <input type="text" name="classTeacherOf" placeholder="Search by Class ..." value={searchFilters.classTeacherOf} onChange={handleSearchInputChange} />
          <input type="text" name="phoneNumber" placeholder="Search by Phone ..." value={searchFilters.phoneNumber} onChange={handleSearchInputChange} />
          <button onClick={handleSearch} className='search-btn'>Search</button>
          <button onClick={handleClearSearch} className='clear-btn'>Clear</button>
        </div>

        <div className="sorting-block">
          <div className="sort-by">
            <label htmlFor="sortBy">Sort By:</label>
            <select id="sortBy" name="sortBy" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setSortDir(""); }} >
              <option value="">-- Select Field --</option>
              <option value="teacherId">Teacher Id</option>
              <option value="name">Name</option>
              <option value="dateOfBirth">Date of Birth</option>
              <option value="email">Email</option>
              <option value="salary">Salary</option>
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
              <th>Teacher ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Class Teacher of</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allTeachersData.length > 0 ? (
              allTeachersData.map((item, index) => (
                <tr key={index}>
                  <td>{item.teacherId}</td>
                  <td className="photo">
                    <img src={item.teacherImageUrl ? `${backendUrl}${item.teacherImageUrl}` : "Gallery/avatar_img.avif"} alt="Profile" />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.gender}</td>
                  <td>{item.dateOfBirth}</td>
                  <td>{item.email}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{item.address}</td>
                  <td>{item.classTeacherOf}</td>
                  <td>{item.salary}</td>
                  <td className="actions">
                    <img src="Gallery/edit_icon.png" alt="Edit" onClick={() => navigate(`/update-teacher/${item.teacherId}`)} />
                    <img src="Gallery/delete_icon.png" alt="Delete" onClick={() => { setShowDeleteConfirmModal(true); setTeacherId(item.teacherId); }} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" style={{ textAlign: "center" }}>No Teachers Found.</td>
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
};
