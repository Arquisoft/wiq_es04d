// AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("unknown"); // Cambio de "unknow" a "unknown"

    const handleLogin = (username) => {
        setIsLoggedIn(true);
        setUsername(username); // Establecer el nombre de usuario al iniciar sesión
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername("unknown"); // Restablecer el nombre de usuario al cerrar sesión
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
