import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

export const AddBooks = () => {

  const [bookData, setBookData] = useState({
    bookTitle: "",
    author: "",
    genre: "",
    publisher: "",
    edition: "",
    quantity: "",
    availableCopies: "",
    language: "",
  });
  const { backendUrl, api } = useContext(AppContext);
  const [loading, setIsLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post(`${backendUrl}/book/add-book`, bookData);
      if (response.status === 201) {
        toast.success(response.data?.message || "Book added successfully..");
        resetHandler();
      }
    } catch (error) {
      toast.error(error.response?.data?.data?.message || "Something went wrong! Try again in some time.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetHandler = () => {
    setBookData({
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

  return (
    <div className="common-container add-books-container">
      <h4 className="common-container-heading">Add New Books</h4>
      <form onSubmit={onSubmitHandler} onReset={resetHandler}>
        <div className="form-group">
          <label className="form-label">Book Title</label>
          <input type="text" name="bookTitle" required value={bookData.bookTitle} onChange={onChangeHandler} />
        </div>

        <div className="form-group">
          <label className="form-label">Author</label>
          <input type="text" name="author" value={bookData.author} onChange={onChangeHandler} />
        </div>

        <div className="form-group">
          <label className="form-label">Genre</label>
          <select name="genre" required value={bookData.genre} onChange={onChangeHandler}>
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
          <input type="text" name="publisher" value={bookData.publisher} onChange={onChangeHandler} />
        </div>

        <div className="form-group">
          <label className="form-label">Edition</label>
          <input type="text" name="edition" value={bookData.edition} onChange={onChangeHandler} required />
        </div>

        <div className="form-group">
          <label className="form-label">Quantity</label>
          <input type="number" name="quantity" required value={bookData.quantity} onChange={onChangeHandler} />
        </div>

        <div className="form-group">
          <label className="form-label">Available Copies</label>
          <input type="number" name="availableCopies" required value={bookData.availableCopies} onChange={onChangeHandler} />
        </div>

        <div className="form-group">
          <label className="form-label">Language</label>
          <select name="language" required value={bookData.language} onChange={onChangeHandler}>
            <option value="" disabled>Please Select Language</option>
            <option value="hindi">Hindi</option>
            <option value="english">English</option>
            <option value="french">French</option>
          </select>
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
