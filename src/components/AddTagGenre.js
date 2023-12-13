import React, { useState,useEffect} from 'react';
import './AddTagGenre.css';
import axios from 'axios';
import Navbar from '../Navbar';
const AddTagGenre = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [bookId, setBookId] = useState('');
  const [submittedBookId, setSubmittedBookId] = useState(false);
  const [submittedGenres, setSubmittedGenres] = useState(false);

  const genresList = [
    { id: 1, name: "Science Fiction" },
    { id: 2, name: "Mystery" },
    { id: 3, name: "Fantasy" },
    { id: 4, name: "Romance" },
    { id: 5, name: "Thriller" },
    { id: 6, name: "Historical Fiction" },
    { id: 7, name: "Non-Fiction" },
    { id: 8, name: "Biography" },
    { id: 9, name: "Adventure" },
    { id: 10, name: "Drama" }
  ];

  const handleCheckboxChange = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleBookIdChange = (e) => {
    setBookId(e.target.value);
  };

  const handleSubmitBookId = (e) => {
    e.preventDefault();
    console.log("Book ID:", bookId);
    setSubmittedBookId(true);
    fetchGenres();
  };

  const handleSubmitGenres = async (e) => {
    // const { bid, title, publish, quantity } = post;
    const jsonarr = {
      bid: bookId,
      selects: selectedGenres
    };
  
    try {
      const response = await axios.post('http://localhost:3000/addgen', jsonarr, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log(response.data);
    } catch (error) {
      console.error('Error adding book:', error.message);
    }
  
    setSubmittedGenres(true);
  };  

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/addgen?book_id=${bookId}`);
      const genresArray = response.data.orders.map(genre => genre.genre_id);
      console.log(genresArray);
      setSelectedGenres(genresArray);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };

  return (
    <div>
    <Navbar />
      <h2 style={{ marginLeft: '30px', marginTop: '50px' }}>Add Tags/Genres</h2>
      <form>
        <label htmlFor="bookId" style={{ marginLeft: '30px' }}>Book ID:</label>
        <input
          type="text"
          id="bookId"
          value={bookId}
          onChange={handleBookIdChange}
          style={{ marginLeft: '30px' }}
        />
        <button type="submit" onClick={handleSubmitBookId} style={{ marginLeft: '10px' }}>Enter</button>

        {submittedBookId && (
          <div className="genres-form">
            {genresList.map((genre) => (
              <div key={genre.id} className="genre-checkbox">
                <input
                  type="checkbox"
                  id={genre.id}
                  value={genre.id}
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => handleCheckboxChange(genre.id)}
                />
                <label htmlFor={genre.id}>{genre.name}</label>
              </div>
            ))}
            <button type="submit" onClick={handleSubmitGenres}>
              Change
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTagGenre;
