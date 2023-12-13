import React, { useState,useEffect } from 'react';
import axios from 'axios';

import './ModifyBookDetails.css';
import Navbar from '../Navbar';
import { json } from 'react-router-dom';

const ModifyBookDetails = () => {
  const [bookId, setBookId] = useState('');
  const [post, setPost] = useState({
    bid: '',
    title: '',
    publish: '',
    quantity: '',
  });  
  const [error, setError] = useState(null);
  const [details, setDetails] = useState([]);

  const AddBooks = async () => {
    const { bid, title, publish, quantity } = post;
    const jsonarr = {
      BookId: bid,
      Title: title,
      PublishDate: publish,
      Quantity: quantity,
    };
  
    try {
      const response = await axios.post('http://localhost:3000/addbook', jsonarr, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log(response.data); 
    } catch (error) {
      console.error('Error adding book:', error.message);
    }
  };  

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/modify?bookId=${bookId}`);
      setDetails(response.data.orders); // Assuming the response directly contains book details
      setError(null);
    } catch (error) {
      console.error('Error fetching book:', error.message);
      setError('Book not found');
    }
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    if (name) {
      setPost({ ...post, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/modify', post, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Handle the response if needed
      console.log(response.data); // Log the response for debugging
  
      setError(null);
    } catch (error) {
      setError(error.response.data.error || 'An error occurred');
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: '50px',display: 'flex' }}>
      <div style={{ marginLeft: '6px', marginTop:'10px',padding:'20px', width: '50%' }}>
        <h3 style={{ marginLeft: '60px' }}>Search for books</h3>
        <div style={{ marginLeft: '60px', padding:'10px' }}>
          <label htmlFor="bookId">Book ID:</label>
          <input
            type="text"
            id="bookId"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            style={{ marginLeft: '30px' }}
          />
          <button onClick={handleSearch}>Search</button>
          <div style={{marginTop:'20px'}}>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {details.map(order => (
              <div key={order.order_id} style={{ border: '1px solid black', marginBottom: '10px', padding: '10px' }}>
                <p>Book ID: {order.book_id}</p>
                <p>Title: {order.title}</p>
                <p>Publish Date: {order.publish_date}</p>
                <p>Rating: {order.rating}</p>
                <p>Quantity: {order.quantity}</p>
              </div>
              ))}
        </div>
      </div>
      
    <div className='update-div'>
    <h3 style={{ marginLeft: '10px' }}>Update Details</h3>
    <form
      style={{ float: 'right', marginRight: '100px' }}
      className="shiftedDiv"
      action = 'POST'
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="bid">Book Id:</label>
          <input
            type="text"
            name="bid"
            value={post.bid}
            onChange={handleInput}
            style={{ marginLeft: '66px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleInput}
            style={{ marginLeft: '66px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="publishDate">Publish Date:</label>
          <input
            type="text"
            name="publish"
            value={post.publishDate}
            onChange={handleInput}
            style={{ marginLeft: '8px' }}
          />
        </div>
        <div>
          <label htmlFor="author">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={post.quantity}
            onChange={handleInput}
            style={{ marginLeft: '48px' }}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
            <button type="submit">Update</button>
            <button type="button" onClick={AddBooks} style={{ marginLeft: '8px' }}>Add Book</button>
        </div>
    </form>
    </div>
    </div>
  </div>
  );
};

export default ModifyBookDetails;
