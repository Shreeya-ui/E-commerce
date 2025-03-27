// src/Pages/Admin/Admin.jsx
import React from 'react';
import './Admin.css';
import Sidebar from '../../Components/Navbar/Sidebar/Sidebar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Addproduct from '../../Components/Navbar/Addproduct/Addproduct';
import ListProduct from '../../Components/Navbar/ListProduct/ListProduct';
import Login from '../../Components/Navbar/Login/Login';
import { useAuth } from '../../AuthContext'; // Import useAuth

const Admin = () => {
    const { isAuthenticated } = useAuth(); // Get authentication status

    return (
        <div className='admin'>
            {isAuthenticated && <Sidebar />} {/* Render Sidebar only if authenticated */}
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/addproduct' element={isAuthenticated ? <Addproduct /> : <Navigate to="/login" />} />
                <Route path='/listproduct' element={isAuthenticated ? <ListProduct /> : <Navigate to="/login" />} />
            </Routes>
        </div>
    );
};

export default Admin;