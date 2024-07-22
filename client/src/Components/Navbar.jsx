import React, { useContext, useState } from "react";
import "boxicons/css/boxicons.min.css";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../Context/UserContext";
import "../Styles/Navbar.css";

const Navbar = () => {
  const { setUser, userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem('userId')
    setUser(null);
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home" className="navbar-logo-link">
          <i className="bx bxs-home"></i>
          <span>Home</span>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to={`/liked-posts/${userData._id}`} className="navbar-item">
          <i className="bx bxs-heart"></i>
          <span>Liked Posts</span>
        </Link>
        <Link to={`/profile/${userData._id}`} className="navbar-item">
          <i className="bx bxs-user"></i>
          <span>Profile</span>
        </Link>
        <button className="navbar-item logout-button" onClick={handleLogout}>
          <i className="bx bx-log-out"></i>
          <span>Logout</span>
        </button>
      </div>
      <div className="navbar-menu-icon" onClick={toggleMenu}>
        <i className="bx bx-menu"></i>
      </div>
      <div className={`navbar-overlay ${menuOpen ? 'open' : ''}`}>
        <div className="navbar-overlay-content">
          <div className="navbar-close-icon" onClick={toggleMenu}>
            <i className="bx bx-x"></i>
          </div>
          <Link to="/home" className="navbar-item" onClick={toggleMenu}>
            <i className="bx bxs-home"></i>
            <span>Home</span>
          </Link>
          <Link to={`/liked-posts/${userData._id}`} className="navbar-item" onClick={toggleMenu}>
            <i className="bx bxs-heart"></i>
            <span>Liked Posts</span>
          </Link>
          <Link to={`/profile/${userData._id}`} className="navbar-item" onClick={toggleMenu}>
            <i className="bx bxs-user"></i>
            <span>Profile</span>
          </Link>
          <button className="navbar-item logout-button" onClick={() => { handleLogout(); toggleMenu(); }}>
            <i className="bx bx-log-out"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
