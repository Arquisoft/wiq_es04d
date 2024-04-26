import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'
// Este es tu componente Footer
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
function Footer() {

    return (
        <footer>
            <a href={`${apiEndpoint}/api-doc`}>API Doc</a>
            <a href="https://arquisoft.github.io/wiq_es04d/">WIQ_ES04D</a>
            <Link to='/aboutus' className='footer-links'>Enlaces externos</Link>
            <Link to='/help' className='footer-help'>Ayuda</Link>
        </footer>
    );
}

export default Footer;
