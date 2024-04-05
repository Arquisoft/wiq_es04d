import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'
// Este es tu componente Footer
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
function Footer() {

    return (
        <footer>
            <a href={`${apiEndpoint}/api-doc`}>API Doc</a>
            <a href="WIQ_ES04D">WIQ_ES04D</a>
            <a href="/aboutus"> About us</a>
        </footer>
    );
}

export default Footer;
