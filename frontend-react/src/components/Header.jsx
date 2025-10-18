import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/Header.css"; // CSS riêng cho Header

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          AuctionHub
        </Link>

        {/* Desktop Menu */}
        <nav className="nav-menu">
          <Link to="/">Home</Link>
          <Link to="/auctions">Auctions</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <Link to="/login" className="btn-login">Login</Link>
          <Link to="/register" className="btn-register">Sign Up</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
