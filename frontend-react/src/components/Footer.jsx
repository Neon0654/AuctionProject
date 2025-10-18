import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/Footer.css"; // CSS riêng cho Footer

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About */}
        <div className="footer-section">
          <h3>About AuctionHub</h3>
          <p>
            AuctionHub is your trusted online auction platform, offering a wide range of products and seamless bidding experience.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/auctions">Active Auctions</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@auctionhub.com</p>
          <p>Phone: +84 123 456 789</p>
          <p>Address: 123 Auction Street, Hanoi, Vietnam</p>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} AuctionHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
