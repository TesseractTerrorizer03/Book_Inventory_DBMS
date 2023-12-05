import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css'; 
import Login from "./components/login.js"
import Navbar from './Navbar.js';
import Purchases from './components/Purchases.js';
import ModifyProduct from './components/ModifyBookDetails';
import Summary from './components/Summary';
import AddTagGenre from './components/AddTagGenre';
import Topbooks from './components/Topbooks.js';

const App = () => (
  <Router>
    <div>
      <Routes>
       <Route path="/" element={<Login />}/>
        <Route path="/purchase" element={<Purchases />} />
        <Route path="/modify" element={<ModifyProduct />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/taggenre" element={<AddTagGenre />} />
        <Route path="/topbooks" element={<Topbooks />} />
      </Routes>
    </div>
  </Router>
);

export default App;
