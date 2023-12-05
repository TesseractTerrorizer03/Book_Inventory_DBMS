import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

function UserNavbar() {
  const handleLogout = () => {
    // Implement your logout logic here
    console.log('Logout clicked');
  };

  return (
     <nav className="tabs">
    <Link to="/top-books" className="tab">Top Books</Link>
    <Link to="/my-reviews" className="tab">My Reviews</Link>
    {/* <Link to="/" className="tab">Summary</Link> */}
    <Link to="/" className=" tab logout-button" onclick={handleLogout}>Logout</Link>

     </nav>
  );
}

export default UserNavbar;

// import React from 'react';
// import './Navbar.css';
// import { Link } from 'react-router-dom';

// function Navbar() {
//   return (
//     <div>
//       {/* Your Navbar code here */}
      

//     </div>
//   );
// }

// export default Navbar;
