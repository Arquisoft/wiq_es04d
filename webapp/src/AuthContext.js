// AuthContext.js
import React, {createContext, useEffect, useState} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("unknown"); // "unknown"

    useEffect(() => {
        const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const storedUsername = localStorage.getItem("username") || "unknown";

        if (storedIsLoggedIn) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
        }
    }, []);
    const handleLogin = (username) => {
        setIsLoggedIn(true);
        setUsername(username); // Establecer el nombre de usuario al iniciar sesión
        localStorage.setItem("isLoggedIn", true);
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
