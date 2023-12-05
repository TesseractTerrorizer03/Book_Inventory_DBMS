import React, { useState } from 'react';
import './Topbooks.css'; // Make sure to import the CSS file
import BookDetail from './Bookdetail.js';
// import UserNavbar from '../User.js';
import UserNavbar from '../Navbar_user.js';
function TopBooks() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    // Implement your search logic here
    console.log(`Searching for books with term: ${searchTerm}`);
    // You can further implement logic to fetch matching books based on the search term
  };

  return (
    <div>
    <UserNavbar />
    <div className="top-books-container">
      <h1 className="top-books-heading">Top Books</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for books by title or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
      {/* Add the Books component here once it's implemented */}
      <BookDetail
        title="The Alchemist // Hardcoded values for now"
        author="Paulo Coelho"
        ratings="4.5"
        reviews="1000"
        price="10"  />

     </div>
    </div>
  );
}

export default TopBooks;

