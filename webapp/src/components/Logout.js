import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Logout = () => {
    const { handleLogout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        handleLogout();
        navigate('/');
    }, [handleLogout, navigate]);

    return null;
};

export default Logout;
