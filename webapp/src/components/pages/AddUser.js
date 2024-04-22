import React, { useState,useContext } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../../AuthContext";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();
    const { handleLogin } = useContext(AuthContext);

    const addUser = async () => {
        if (username.length < 4) {
            setError("El nombre de usuario debe tener al menos 4 caracteres.");
            return;
        }

        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            setError("La contraseña debe contener al menos una letra mayúscula.");
            return;
        }

        if (!/\d/.test(password)) {
            setError("La contraseña debe contener al menos un número.");
            return;
        }

        try {
            await axios.post(`${apiEndpoint}/adduser`, { username, password });
            setOpenSnackbar(true);
            setTimeout(async () => {
                const { data } = await axios.post(`${apiEndpoint}/login`, { username, password });
                handleLogin(data.token);
                navigate('/');
            }, 1000);
        } catch (error) {
            setError(error.response.data.error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
            <video src='/videos/loginregister.mp4' autoPlay loop muted data-testid="register-video"/>
  
            <Typography component="h1" variant="h5">
                Registro de Usuario
            </Typography>
            <TextField
                name="username"
                margin="normal"
                fullWidth
                label="Nombre de Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                name="password"
                margin="normal"
                fullWidth
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button name="registrarsePage" variant="contained" color="primary" onClick={addUser} sx={{ mt: 3, mb: 2 }}>
                Registrarse
            </Button>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Usuario añadido correctamente" />
            {error && (
                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
            )}
            <Container style={{ textAlign: 'center', marginTop: '15%' }}>
            <Link name="gotologin" component="button" variant="body2" to="/login">
              ¿Ya tienes una cuenta? Inicia sesión aquí.
            </Link>
          </Container>
        </Container>
    );
};

export default AddUser;
