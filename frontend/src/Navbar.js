import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';


function Navbar() {
  const handleLogout = () => {
    // Implement your logout logic here
    console.log('Logout clicked');
  }
  return (
    <div>
      {/* Your Navbar code here */}
      <nav className="tabs">
        <Link to="/purchase" className="tab">Purchases</Link>
        <Link to="/modify" className="tab">Update Details</Link>
        <Link to="/summary" className="tab">Summary</Link>
        <Link to="/taggenre" className="tab">Add Tags / Genres</Link>

        <Link to="/" className=" tab logout-button" onClick={handleLogout}>Logout</Link>
      </nav>

    </div>
  );
}

export default Navbar;
