import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Asegúrate de importar el nuevo componente Layout
import Home from './components/pages/Home';
import Historial from './components/pages/Historial';
import Jugar from './components/pages/Jugar';
import SignUp from './components/AddUser';
import LogIn from './components/Login';
import { AuthProvider } from './AuthContext';
import Logout from "./components/Logout";
import AboutUS from "./components/pages/AboutUS";
import Error404Page from "./components/pages/Error404Page";

function App() {
    useEffect(() => {
        document.title = "WIQ"; // Titulo de la paginma
    }, []);

    return (

        <AuthProvider> {/* Envolver con AuthProvider */}
            <Router>
                <Routes>
                    {/* Rutas que incluyen el Navbar a través del componente Layout */}
                    <Route path="/" element={<Layout><Home /></Layout>} />
                    <Route path="/historial" element={<Layout><Historial /></Layout>} />
                    <Route path="/jugar" element={<Layout><Jugar /></Layout>} />
                    <Route path="/sign-up" element={<Layout><SignUp /></Layout>} />
                    <Route path="/logout" element={<Layout><Logout /></Layout>} />
                    <Route path="/login" element={<Layout><LogIn /></Layout>} />
                    <Route path="/aboutus" element={<Layout><AboutUS/></Layout>} />

                    {/* Ruta NotFoundPage sin Layout para evitar mostrar el Navbar */}
                    <Route path="*" element={<Error404Page />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
