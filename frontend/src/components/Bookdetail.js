import React from 'react';
import './Bookdetail.css'; // Make sure to import the CSS file

function BookDetail({ title, author, ratings, reviews, price }) {
  return (
    <div className="book-detail-container">
      <h2 className="book-title">{title}</h2>
      <p className="book-author">Author: {author}</p>
      <p className="book-ratings">Ratings: {ratings}</p>
      <p className="book-reviews">Reviews: {reviews}</p>
      <p className="book-price">Price: ${price}</p>
    </div>
  );
}

export default BookDetail;
