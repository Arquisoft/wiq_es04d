import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, Button,TextField, Snackbar } from '@mui/material';
import { AuthContext } from '../../AuthContext';
import {Link, useNavigate} from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  // Consumir AuthContext
  const { handleLogin } = useContext(AuthContext);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const loginUser = async () => {
    try {
      const {data} = await axios.post(`${apiEndpoint}/login`, { username, password });

      setLoginSuccess(true);
      handleLogin(data.token);
      setOpenSnackbar(true);
      navigate('/');
    } catch (error) {
      setError(error.response.data.error);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
      <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
        <div>
        <video src='/videos/loginregister.mp4' autoPlay loop muted data-testid="login-video"/>
          <Typography component="h1" variant="h5">
            Entrar
          </Typography>
          <TextField
              margin="normal"
              fullWidth
              label="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
              margin="normal"
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={loginUser} sx={{ mt: 3, mb: 2 }}>
            Entrar
          </Button>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message={loginSuccess ? "Inicio de sesión exitoso" : `Error: ${error}`} />
          <Container style={{ textAlign: 'center', marginTop: '15%' }}>
            <Link name="gotoregister" component="button" variant="body2" to="/sign-up">
              ¿No tienes una cuenta? Registrate aquí.
            </Link>
          </Container>
        </div>
      </Container>
  );
};

export default Login;
