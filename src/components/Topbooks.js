import React, { useState, useEffect } from 'react';
import './Topbooks.css'; // Make sure to import the CSS file
import UserNavbar from '../Navbar_user.js';
import axios from 'axios';
import Select from 'react-select';

const TopBooks = () => {
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [excludeGenres, setExcludeGenres] = useState([]);
  const [excludeTags, setExcludeTags] = useState([]);
  const [bookName, setBookName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Fetch genres and tags from your API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/taggenre');

        setGenres(response.data.genres);
        setTags(response.data.tags);
      } catch (error) {
        console.error('Error fetching tag and genres in frontend:', error);
      }
    };

    fetchData();
  }, []);

  const handleGenreChange = (selectedOptions) => {
    setSelectedGenres(selectedOptions);
  };

  const handleTagChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
  };

  const handleExcludeGenreChange = (selectedOptions) => {
    setExcludeGenres(selectedOptions);
  };

  const handleExcludeTagChange = (selectedOptions) => {
    setExcludeTags(selectedOptions);
  };

  // const handleSearch = async () => {
  //   try {
  //     // Combine selected genres, tags, book name, and author name for searching
  //     const searchParams = {
  //       genres: selectedGenres.map((genre) => genre.label),
  //       tags: selectedTags.map((tag) => tag.label),
  //       excludeGenres: excludeGenres.map((genre) => genre.label),
  //       excludeTags: excludeTags.map((tag) => tag.label),
  //       bookName,
  //       authorName,
  //     };

  //     const searchResponse = await axios.get('http://localhost:3000/topbooks', searchParams);

  //     setSearchResults(searchResponse.data);
  //     console.log(searchResults);
  //   } catch (error) {
  //     console.error('Error searching in the database:', error);
  //   }
  // };

  const handleSearch = async () => {
    try {
      // Combine selected genres, tags, book name, and author name for searching
      const searchParams = {
        genres: selectedGenres.map((genre) => genre.value), // Using genre IDs instead of labels
        tags: selectedTags.map((tag) => tag.label),
        excludeGenres: excludeGenres.map((genre) => genre.value), // Using genre IDs instead of labels
        excludeTags: excludeTags.map((tag) => tag.label),
        bookName,
        authorName,
      };
  
      // Replace the hardcoded logic with your actual API request
      // For now, let's just check if genre_id is [1] or [3, 2]
      let searchResults = [];
  
      if (searchParams.genres.length === 1 && searchParams.genres[0] === 1) {
        searchResults = [
          { id: 1, name: 'New Change', author: 'Shashwat' },
        ];
      } else if (searchParams.genres.length === 2 && searchParams.genres.includes(2) && searchParams.genres.includes(3)) {
        searchResults = [{ id: 2, name: 'One Hundred Years of Solitude', author: 'Gabriel Garcia Marquez' }];
      }
      else{
        searchResults = [
          { id: 1, name: 'New Change', author: 'Shashwat' },
          { id: 2, name: 'F. Scott Fitzgerald', author: 'The Great Gatsby' },
        ];
      }
  
      setSearchResults(searchResults);
    } catch (error) {
      console.error('Error searching in the database:', error);
    }
  };

  
  // Redirect to book detail page
  const handleBookClick = (bookId) => {
    // You can use react-router or other navigation methods to navigate to the book detail page
    // Example using react-router: history.push(`/book/${bookId}`);
    console.log(`Redirect to book detail page for book ID: ${bookId}`);
  };

  return (
    <div>
      <UserNavbar />
      <h2 className='outermost-div' > Genre and Tag Selector with Books Display</h2>
      <div className='searching-divs'>
        <label>Select Genres:</label>
        <Select
          options={genres.map((genre) => ({ value: genre.genre_id, label: genre.genre_name }))}
          isMulti
          onChange={handleGenreChange}
          value={selectedGenres}
        />
      </div>
      <div className='searching-divs'>
        <label>Select Tags:</label>
        <Select
          options={tags.map((tag) => ({ value: tag.id, label: tag.name }))}
          isMulti
          onChange={handleTagChange}
          value={selectedTags}
        />
      </div>
      <div className='searching-divs'>
        <label>Exclude Genres:</label>
        <Select
          options={genres.map((genre) => ({ value: genre.genre_id, label: genre.genre_name }))}
          isMulti
          onChange={handleExcludeGenreChange}
          value={excludeGenres}
        />
      </div>
      <div className='searching-divs'>
        <label>Exclude Tags:</label>
        <Select
          options={tags.map((tag) => ({ value: tag.id, label: tag.name }))}
          isMulti
          onChange={handleExcludeTagChange}
          value={excludeTags}
        />
      </div>
      <div className='searching-divs'>
        <label>Book Name:</label>
        <input type="text" value={bookName} onChange={(e) => setBookName(e.target.value)} />
      </div>
      <div className='searching-divs'>
        <label>Author Name:</label>
        <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
      <button className='search-button' onClick={handleSearch}>Search </button>
      </div>

      <div className='results'>
        <h3>Search Results:</h3>
        <ul>
          {searchResults.map((book) => (
            <li key={book.id} onClick={() => handleBookClick(book.id)}>
              {book.name} by {book.author}
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
};

export default TopBooks;
