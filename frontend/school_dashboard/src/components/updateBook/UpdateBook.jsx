import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

export const UpdateBook = () => {
  const [updateBookData, setUpdateBookData] = useState({});
  const [bookOriginalData, setBookOriginalData] = useState({});
  const { backendUrl, api } = useContext(AppContext);
  const [loading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getBook();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdateBookData({ ...updateBookData, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const isFormChanged = hasBookDataChanged();
    if (!isFormChanged) {
      toast.info('No changes made.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(`${backendUrl}/book/update-book?id=${id}`,
        JSON.stringify(updateBookData),
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      if (response.status === 201) {
        toast.success(response.data?.message || "Book record updated successfully.");
        navigate("/view-all-books", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.data?.message || "Something went wrong! Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateReset = () => {
    setUpdateBookData({
      bookTitle: "",
      author: "",
      genre: "",
      publisher: "",
      edition: "",
      quantity: "",
      availableCopies: "",
      language: "",
    });
  };

  const hasBookDataChanged = () => {
    for (let key in updateBookData) {
      if (updateBookData[key] !== bookOriginalData[key]) {
        return true;
      }
    }
    return false;
  };

  const getBook = async () => {
    try {
      const response = await api.get(`${backendUrl}/book/fetch-book?id=${id}`);
      if (response.status === 200) {
        toast.success(response.data?.message || "Successfully fetched the book details.");
        setBookOriginalData(response.data.data);
        setUpdateBookData(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.data?.message || "Something went wrong! Try again later.");
    }
  };

  return (
    <div className="common-container add-books-container">
      <h4 className="common-container-heading">Update Book</h4>
      <form onSubmit={handleUpdateSubmit} onReset={handleUpdateReset}>
        <div className="form-group">
          <label className="form-label">Book Title</label>
          <input type="text" name="bookTitle" value={updateBookData.bookTitle} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Author</label>
          <input type="text" name="author" value={updateBookData.author} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Genre</label>
          <select name="genre" value={updateBookData.genre} onChange={handleInputChange} required >
            <option value="" disabled>-- Select Genre --</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
            <option value="mystery">Mystery</option>
            <option value="thriller">Thriller</option>
            <option value="fantasy">Fantasy</option>
            <option value="science-fiction">Science Fiction</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="historical">Historical</option>
            <option value="biography">Biography</option>
            <option value="self-help">Self-Help</option>
            <option value="philosophy">Philosophy</option>
            <option value="poetry">Poetry</option>
            <option value="graphic-novel">Graphic Novel</option>
            <option value="children">Children's</option>
            <option value="young-adult">Young Adult</option>
            <option value="classics">Classics</option>
            <option value="education">Education</option>
            <option value="religion">Religion</option>
            <option value="travel">Travel</option>
            <option value="cookbook">Cookbook</option>
            <option value="true-crime">True Crime</option>
            <option value="business">Business</option>
            <option value="sports">Sports</option>
            <option value="art">Art</option>
            <option value="politics">Politics</option>
            <option value="technology">Technology</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Publisher</label>
          <input type="text" name="publisher" value={updateBookData.publisher} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Edition</label>
          <input type="text" name="edition" value={updateBookData.edition} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Quantity</label>
          <input type="number" name="quantity" value={updateBookData.quantity} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Available Copies</label>
          <input type="number" name="availableCopies" value={updateBookData.availableCopies} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Language</label>
          <select name="language" value={updateBookData.language} onChange={handleInputChange} required>
            <option value="" disabled>Please Select Language</option>
            <option value="hindi">Hindi</option>
            <option value="english">English</option>
            <option value="french">French</option>
          </select>
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
  );
};
