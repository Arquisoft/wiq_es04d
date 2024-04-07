import React, {createContext, useEffect, useRef, useState} from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from "axios"; // Ajuste en la importación

export const AuthContext = createContext();
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
export const AuthProvider = ({ children }) => {

    const initialToken = window.localStorage.getItem("token");
    // Decodifica el token para obtener el username, si el token está presente
    const decodedToken = initialToken ? jwtDecode(initialToken) : null; // Uso correcto de jwtDecode
    const initialUsername = decodedToken ? decodedToken.username : undefined;
    const handleLogoutRef = useRef(null);
    // Establece el estado inicial basado en la presencia del token y el username decodificado
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(initialToken));
    const [username, setUsername] = useState(initialUsername);
    const [token, setToken] = useState(initialToken);

    const handleLogin = (token) => {
        setToken(token);
        window.localStorage.setItem("token", token);
        const decoded = jwtDecode(token); // Uso correcto de jwtDecode
        if (decoded && decoded.username) {
            setUsername(decoded.username);
        }
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setToken(null);
        setIsLoggedIn(false);
        setUsername(undefined);
        window.localStorage.removeItem("token");
    };

    handleLogoutRef.current=handleLogout;

    useEffect(() => {
        axios.get(`${apiEndpoint}/validate/${token}`)
            .then(res => {
                if(!res.data.valid) {
                    handleLogoutRef.current()
                }
            })
            .catch(() => handleLogoutRef.current())
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, isLoggedIn, username, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
