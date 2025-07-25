import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeleteConfirmModal } from '../deleteConfirmModal/DeleteConfirmModal';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

export const ViewAllBooks = () => {

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [allBookData, setAllBookData] = useState([]);
  const [bookId, setBookId] = useState(0);

  const [sortBy, setSortBy] = useState("bookId");
  const [sortDir, setSortDir] = useState("asc");

  const [searchFilters, setSearchFilters] = useState({
    bookId: '',
    bookTitle: '',
    author: '',
    genre: ''
  });

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();
  const { backendUrl, api } = useContext(AppContext);

  const fetchAllBooks = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (sortBy && sortDir) {
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDir', sortDir);
      }
      queryParams.append('page', page);
      queryParams.append('size', 5);

      const response = await api.get(`${backendUrl}/book/fetch-all-books?${queryParams.toString()}`);

      if (response.status === 200) {
        setAllBookData(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load Books.");
    }
  };

  const searchBooks = async () => {
    try {
      const queryParams = new URLSearchParams();

      if (searchFilters.bookId.trim() !== '') queryParams.append('bookId', searchFilters.bookId);
      if (searchFilters.bookTitle.trim() !== '') queryParams.append('bookTitle', searchFilters.bookTitle);
      if (searchFilters.author.trim() !== '') queryParams.append('author', searchFilters.author);
      if (searchFilters.genre.trim() !== '') queryParams.append('genre', searchFilters.genre);

      if (sortBy && sortDir) {
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDir', sortDir);
      }

      queryParams.append('page', page);
      queryParams.append('size', 5);

      const response = await api.get(`${backendUrl}/book/search-book?${queryParams.toString()}`);

      if (response.status === 200) {
        setAllBookData(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed.");
    }
  };

  useEffect(() => {
    isSearchMode ? searchBooks() : fetchAllBooks();
  }, [page, sortBy, sortDir]);

  const handleSearchInputChange = (e) => {
    setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setPage(0);
    setIsSearchMode(true);
    searchBooks();
  };

  const handleClearSearch = () => {
    setSearchFilters({ bookId: '', bookTitle: '', author: '', genre: '' });
    setIsSearchMode(false);
    setPage(0);
    fetchAllBooks();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) setPage(newPage);
  };

  const deleteConfirm = async () => {
    try {
      const response = await api.delete(`${backendUrl}/book/delete-book?id=${bookId}`);
      if (response.status === 204) {
        toast.success(response.data?.message || "Record deleted successfully.");
        isSearchMode ? searchBooks() : fetchAllBooks();
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
        <h4 className='common-container-heading'>All Books</h4>
        <div className="search-bar">
          <input type="text" name="bookId" placeholder="Search by book ID ..." value={searchFilters.bookId} onChange={handleSearchInputChange} />
          <input type="text" name="bookTitle" placeholder="Search by book title ..." value={searchFilters.bookTitle} onChange={handleSearchInputChange} />
          <input type="text" name="author" placeholder="Search by author ..." value={searchFilters.author} onChange={handleSearchInputChange} />
          <input type="text" name="genre" placeholder="Search by Genre ..." value={searchFilters.genre} onChange={handleSearchInputChange} />
          <button onClick={handleSearch} className='search-btn'>Search</button>
          <button onClick={handleClearSearch} className='clear-btn'>Clear</button>
        </div>

        <div className="sorting-block">
          <div className="sort-by">
            <label htmlFor="sortBy">Sort By:</label>
            <select id="sortBy" name="sortBy" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setSortDir(""); }} >
              <option value="">-- Select Field --</option>
              <option value="bookId">Book Id</option>
              <option value="bookTitle">Book Title</option>
              <option value="edition">Edition</option>
              <option value="quantity">Quantity</option>
              <option value="availableCopies">Available Copies</option>
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
              <th>Book ID</th>
              <th>Book Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>Edition</th>
              <th>Genre</th>
              <th>Quantity</th>
              <th>Available Copies</th>
              <th>Language</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allBookData.length > 0 ? (
              allBookData.map((item, index) => (
                <tr key={index}>
                  <td>{item.bookId}</td>
                  <td>{item.bookTitle}</td>
                  <td>{item.author}</td>
                  <td>{item.publisher}</td>
                  <td>{item.edition}</td>
                  <td>{item.genre}</td>
                  <td>{item.quantity}</td>
                  <td>{item.availableCopies}</td>
                  <td>{item.language}</td>
                  <td className="actions">
                    <img src="Gallery/edit_icon.png" alt="Edit" onClick={() => navigate(`/update-book/${item.bookId}`)} />
                    <img src="Gallery/delete_icon.png" alt="Delete" onClick={() => { setShowDeleteConfirmModal(true); setBookId(item.bookId); }} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" style={{ textAlign: "center" }}>No Books Found.</td>
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
  )
}
