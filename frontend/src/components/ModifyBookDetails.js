import React, { useState } from 'react';
// import { addProduct } from '../services/api';
import './ModifyBookDetails.css';
import Navbar from '../Navbar';
const ModifyBookDetails = () => {
  // Add your state and logic for adding a product
  const [bookId, setBookId] = useState('');
  const [anotherBookId, setAnotherBookId] = useState('');
  const [title, setTitle] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = () => {
    console.log(bookId,anotherBookId,title,publishDate,author);
  };

  return (
    <div>
      <Navbar />
        <div style={{marginTop: '50px'  }}>
          <h3 style={{ marginLeft: '200px' }}>Search for books</h3>
            <div style={{ marginLeft: '200px' }}>
              <label htmlFor="bookId">Book ID:</label>
              <input
                type="text"
                id="bookId"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                style={{ marginLeft: '30px' }}
                />
            </div>
        </div>
        <h3 style={{ marginLeft: '1230px' }}>Update Details</h3>
          <div style={{ float: 'right' , marginRight: '100px'}} className="shiftedDiv">
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="anotherBookId">Book ID:</label>
              <input
                type="text"
                id="anotherBookId"
                value={anotherBookId}
                onChange={(e) => setAnotherBookId(e.target.value)}
                style={{ marginLeft: '40px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ marginLeft: '66px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="publishDate">Publish Date:</label>
              <input
                type="text"
                id="publishDate"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                style={{ marginLeft: '8px' }}
              />
            </div>
            <div >
              <label htmlFor="author">Author:</label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={{ marginLeft: '48px' }}
              />
            </div>
          <div style={{marginTop: '10px'  }}>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
    </div>
  );
};

export default ModifyBookDetails;
