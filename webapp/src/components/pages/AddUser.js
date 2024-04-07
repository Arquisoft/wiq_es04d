import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import {Link, useNavigate} from "react-router-dom";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate(); // Instancia de useNavigate

    const addUser = async () => {
        try {
            await axios.post(`${apiEndpoint}/adduser`, { username, password });
            setOpenSnackbar(true);
            // Redirigir al usuario a /login después de mostrar el Snackbar
            setTimeout(() => navigate('/login'), 750); // Espera 1 segundos antes de redirigir
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
