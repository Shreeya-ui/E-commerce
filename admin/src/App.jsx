// src/App.jsx
import React from 'react';
import { AuthProvider } from './AuthContext'; // Import AuthProvider
import Navbar from './Components/Navbar/Navbar';
import Admin from './Pages/Admin/Admin';

const App = () => {
    return (
        <AuthProvider>
            <Navbar />
            <Admin />
        </AuthProvider>
    );
};

export default App;