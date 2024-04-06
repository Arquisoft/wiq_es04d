import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
    const [username, setUsername] = useState(localStorage.getItem("username") || "unknown");

    const handleLogin = (username) => {
        setIsLoggedIn(true);
        setUsername(username); // Establecer el nombre de usuario al iniciar sesión
        localStorage.setItem("isLoggedIn", "true"); // Asegúrate de guardar como string
        localStorage.setItem("username", username);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername("unknown");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
