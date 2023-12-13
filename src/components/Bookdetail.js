import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';  // Import withRouter from react-router-dom
import './Topbooks.css';
import UserNavbar from '../Navbar_user.js';
import axios from 'axios';

const BookDetail = ({ match, history }) => {
  const [book, setBook] = useState({
    title: '',
    rating: 0,
    reviews: [],
    price: 0,
    authors: [],
    publish_date: '',
  });

  const [quantity, setQuantity] = useState(1);
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const bookResponse = await axios.get(`http://localhost:3000/book/${match.params.bookId}`);
  
        setBook({
          title: bookResponse.data.bookDetails?.title || 'Title not available',
          rating: bookResponse.data.bookDetails?.rating || 'Rating not available',
          reviews: bookResponse.data.bookReviews || [],
          price: bookResponse.data.bookDetails?.price || 'Price not available',
          authors: bookResponse.data.bookAuthors || [],
          publish_date: bookResponse.data.bookDetails?.publish_date || 'Publish date not available',
        });
      } catch (error) {
        console.error('Error fetching book details:', error.message);
      }
    };
  
    fetchBookDetail();
  }, [match.params.bookId]);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10) || 1;
    setQuantity(newQuantity);
  };

  const handleOrderNow = async () => {
    try {
      const orderDetails = await axios.post('http://localhost:3000/place-order', {
        bookId: match.params.bookId,
        quantity: quantity,
      });

      setOrderStatus(orderDetails);

      // Redirect to the "My Reviews" page after placing an order
      // history.push('/my-reviews');
    } catch (error) {
      console.error('Error placing order:', error.message);
    }
  };



  return (
    <div>
      <UserNavbar />
      <h2>Book Details</h2>
      <div className="book-detail-container">
        <h2 className="book-title">{book.title}</h2>
        <p className="book-rating">Rating: {book.rating}</p>
        <p className="book-price">Price: ${book.price}</p>
        <p className="book-authors">Authors: {book.authors.join(', ')}</p>
        <p className="book-publish-date">Publish Date: {book.publish_date}</p>
      </div>
      
      <div>
        <h3>Reviews</h3>
        <ul>
          {book.reviews.map((review) => (
            <li key={review.id}>
              <p>{review.review_text}</p>
              <p>Rating: {review.rating}</p>
              <p>Review Date: {review.review_date}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
        />
      </div>

      <div>
        <button onClick={handleOrderNow}>Order Now</button>
      </div>
    </div>
  );
};
export default BookDetail;  // Wrap the component with withRouter

// export default withRouter(BookDetail);  // Wrap the component with withRouter




// function BookDetail({ title, author, ratings, reviews, price }) {
//   return (
//     <div className="book-detail-container">
//       <h2 className="book-title">{title}</h2>
//       <p className="book-author">Author: {author}</p>
//       <p className="book-ratings">Ratings: {ratings}</p>
//       <p className="book-reviews">Reviews: {reviews}</p>
//       <p className="book-price">Price: ${price}</p>
//     </div>
//   );  
// 