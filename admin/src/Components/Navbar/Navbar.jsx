// src/Components/Navbar/Navbar.jsx
import React from 'react';
import './Navbar.css';
import navlogo from '../../assets/nav-logo.svg';
import navProfile from '../../assets/nav-profile.svg';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useAuth } from '../../AuthContext'; // Import useAuth

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth(); // Get authentication status and logout function

    const handleLogout = () => {
        logout(); // Call logout function
        window.location.href = '/login'; // Redirect to login page
    };

    return (
        <div className='navbar'>
            <img src={navlogo} alt="Logo" className="nav-logo" />
            <div className="nav-links">
                {isAuthenticated ? (
                    <>
                        <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
                        <img src={navProfile} className='navprofile' alt="Profile" />
                    </>
                ) : (
                    <Link to="/login" className="nav-link login-btn">Login</Link>
                )}
            </div>
        </div>
    );
}

export default Navbar;