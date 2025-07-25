import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { DeleteConfirmModal } from '../deleteConfirmModal/DeleteConfirmModal';

export const ViewAllTransport = () => {
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [allTransportData, setAllTransportData] = useState([]);
    const [transportId, setTransportId] = useState(0);

    const [sortBy, setSortBy] = useState("transportId");
    const [sortDir, setSortDir] = useState("asc");

    const [searchFilters, setSearchFilters] = useState({
        routeNumber: '',
        busNo: '',
        driverName: '',
        phoneNumber: ''
    });

    const [isSearchMode, setIsSearchMode] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const navigate = useNavigate();
    const { backendUrl, api } = useContext(AppContext);

    const fetchAllTransports = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (sortBy && sortDir) {
                queryParams.append('sortBy', sortBy);
                queryParams.append('sortDir', sortDir);
            }
            queryParams.append('page', page);
            queryParams.append('size', 5); // page size

            const response = await api.get(`${backendUrl}/transport/fetch-all-transports?${queryParams.toString()}`);

            if (response.status === 200) {
                setAllTransportData(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load Teachers.");
        }
    };

    const searchTransports = async () => {
        try {
            const queryParams = new URLSearchParams();

            if (searchFilters.routeNumber.trim() !== '') queryParams.append('routeNumber', searchFilters.routeNumber);
            if (searchFilters.busNo.trim() !== '') queryParams.append('busNo', searchFilters.busNo);
            if (searchFilters.driverName.trim() !== '') queryParams.append('driverName', searchFilters.driverName);
            if (searchFilters.phoneNumber.trim() !== '') queryParams.append('phoneNumber', searchFilters.phoneNumber);

            if (sortBy && sortDir) {
                queryParams.append('sortBy', sortBy);
                queryParams.append('sortDir', sortDir);
            }

            queryParams.append('page', page);
            queryParams.append('size', 5);

            const response = await api.get(`${backendUrl}/transport/search-transport?${queryParams.toString()}`);

            if (response.status === 200) {
                setAllTransportData(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Search failed.");
        }
    };

    useEffect(() => {
        isSearchMode ? searchTransports() : fetchAllTransports();
    }, [page, sortBy, sortDir]);

    const handleSearchInputChange = (e) => {
        setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        setPage(0);
        setIsSearchMode(true);
        searchTransports();
    };

    const handleClearSearch = () => {
        setSearchFilters({ routeNumber: '', busNo: '', driverName: '', phoneNumber: '' });
        setIsSearchMode(false);
        setPage(0);
        fetchAllTransports();
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) setPage(newPage);
    };

    const deleteConfirm = async () => {
        try {
            const response = await api.delete(`${backendUrl}/transport/delete-transport?id=${transportId}`);
            if (response.status === 204) {
                toast.success(response.data?.message || "Record deleted successfully.");
                isSearchMode ? searchTransports() : fetchAllTransports();
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
                <h4 className='common-container-heading'>All Transport Data</h4>
                <div className="search-bar">
                    <input type="text" name="routeNumber" placeholder="Search By Route No ..." value={searchFilters.teacherId} onChange={handleSearchInputChange} />
                    <input type="text" name="busNo" placeholder="Search By Bus No ..." value={searchFilters.name} onChange={handleSearchInputChange} />
                    <input type="text" name="driverName" placeholder="Search By Driver Name ..." value={searchFilters.classTeacherOf} onChange={handleSearchInputChange} />
                    <input type="text" name="phoneNumber" placeholder="Search By Driver Phone No ..." value={searchFilters.phoneNumber} onChange={handleSearchInputChange} />
                    <button onClick={handleSearch} className='search-btn'>Search</button>
                    <button onClick={handleClearSearch} className='clear-btn'>Clear</button>
                </div>

                <div className="sorting-block">
                    <div className="sort-by">
                        <label htmlFor="sortBy">Sort By:</label>
                        <select id="sortBy" name="sortBy" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setSortDir(""); }} >
                            <option value="">-- Select Field --</option>
                            <option value="transportId">Transport Id</option>
                            <option value="routeNumber">Route Number</option>
                            <option value="driverName">Driver Name</option>
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
                            <th>Transport ID</th>
                            <th>Bus No.</th>
                            <th>Route No.</th>
                            <th>Driver Name</th>
                            <th>License No.</th>
                            <th>Phone No.</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allTransportData.length > 0 ? (
                            allTransportData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.transportId}</td>
                                    <td>{item.busNo}</td>
                                    <td>{item.routeNumber}</td>
                                    <td>{item.driverName}</td>
                                    <td>{item.licenseNumber}</td>
                                    <td>{item.phoneNumber}</td>
                                    <td className="actions">
                                        <img src="Gallery/edit_icon.png" alt="Edit" onClick={() => navigate(`/update-transport/${item.transportId}`)} />
                                        <img src="Gallery/delete_icon.png" alt="Delete" onClick={() => { setShowDeleteConfirmModal(true); setTransportId(item.transportId); }} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="13" style={{ textAlign: "center" }}>No Transports Found.</td>
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
