// src/Components/Navbar/Login/Login.jsx
import React, { useState } from 'react';
import './Login.css'; // Ensure this path is correct
import { useAuth } from '../../../AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const { login } = useAuth(); // Get login function from context
    const navigate = useNavigate(); // Initialize navigate

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { username, password } = credentials;

        // Check credentials
        if (username === 'admin123' && password === 'admin@123') {
            login(); // Call login function
            navigate('/addproduct'); // Redirect to add product page
        } else {
            alert('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="login-field">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="login-field">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="login-btn">Login</button>
            </form>
        </div>
    );
};

export default Login;