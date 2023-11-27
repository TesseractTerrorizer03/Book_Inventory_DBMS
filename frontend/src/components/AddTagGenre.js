import React, { useState } from 'react';
import './AddTagGenre.css';
import Navbar from '../Navbar';
const AddTagGenre = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [bookId, setBookId] = useState('');
  const [submittedBookId, setSubmittedBookId] = useState(false);
  const [submittedGenres, setSubmittedGenres] = useState(false);

  const genresList = [
    "Action", "Classic", "Comic", "Mystery", "Fantasy",
    "Horror", "Fiction", "Romance", "Sci-Fi", "Thriller",
    "Biography/Autobiography", "Educational", "History", "Poetry"
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
  };

  const handleSubmitGenres = (e) => {
    e.preventDefault();
    console.log("Selected Genres:", selectedGenres);
    setSelectedGenres([]); // here, we can re-fetch the updated tags with a query
    setSubmittedGenres(true);
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
              <div key={genre} className="genre-checkbox">
                <input
                  type="checkbox"
                  id={genre}
                  value={genre}
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleCheckboxChange(genre)}
                />
                <label htmlFor={genre}>{genre}</label>
              </div>
            ))}
            <button type="submit" onClick={handleSubmitGenres}>Change</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTagGenre;
