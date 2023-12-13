import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from '../Navbar';

const Summary = () => {
  const [details, setDetails] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getmin');
        setDetails(response.data.orders);
        setError(null);
      } catch (error) {
        console.error('Error fetching book:', error.message);
        setError('Book not found');
      }
    };

    fetchBookDetails();
  }, []);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/hotsellers');
        setSellers(response.data.orders);
        setError(null);
      } catch (error) {
        console.error('Error fetching book:', error.message);
        setError('Book not found');
      }
    };

    fetchSellers();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('http://localhost:3000/genres');
        setGenres(response.data.orders);
        setError(null);
      } catch (error) {
        console.error('Error fetching book:', error.message);
        setError('Book not found');
      }
    };

    fetchGenres();
  }, []);
  return (
    <div>
      <Navbar />
      <div>
        <h2 style={{marginTop: '50px',marginLeft: '50px' }}>Low on Stock:</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul style={{marginLeft: '50px' }}>
          {details.map((book, index) => (
            <li key={index}>{book.title}&nbsp;&nbsp;&nbsp;({book.quantity})</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 style={{marginTop: '50px',marginLeft: '50px' }}>Top Sellers:</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul style={{marginLeft: '50px' }}>
          {sellers.map((book, index) => (
            <li key={index}>{book.title}&nbsp;&nbsp;&nbsp;({book.quantity})</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 style={{marginTop: '50px',marginLeft: '50px' }}>Genres:</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul style={{marginLeft: '50px' }}>
          {genres.map((genre, index) => (
            <li key={index}>{genre.name}&nbsp;&nbsp;&nbsp;({genre.quantity})</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Summary;
