import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { AuthContext } from '../AuthContext';
import { Button } from './Button';

function Navbar() {
  const [isClicked, setIsClicked] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const { isLoggedIn } = useContext(AuthContext);

  const toggleClick = () => setIsClicked(!isClicked);
  const closeMenu = () => setIsClicked(false);
  const handleResize = () => setShowButton(window.innerWidth > 960);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const NavLinks = ({ isLoggedIn }) => (
    <ul className={isClicked ? 'nav-menu active' : 'nav-menu'}>
      <li className='nav-item'>
        <Link to='/' className='nav-links' onClick={closeMenu}>Inicio</Link>
      </li>
      {isLoggedIn ? (
        <>
            <li className='nav-item'>
                <Link to='/jugar' className='nav-links' onClick={closeMenu} data-testid="Jugar-button-navbar">Jugar</Link>
            </li>
            <li className='nav-item'>
                <Link to='/historial' className='nav-links' onClick={closeMenu} data-testid="historial-button-navbar">Historial</Link>
            </li>
            <li className='nav-item'>
                <Link to='/ranking' className='nav-links' onClicks={closeMenu} data-testid="Ranking-button-navbar">Ranking</Link>
            </li>
            <li>
                <Link to='/logout' className='nav-links-mobile' onClick={closeMenu} data-testid="Salir-button-navbar">Salir</Link>
            </li>
        </>
      ) : (
        <>
            <li>
                <Link to='/sign-up' className='nav-links-mobile' onClick={closeMenu} data-testid="Registrarse-button-navbar">Registrarse</Link>
            </li>
            <li>
                <Link to='/login' className='nav-links-mobile' onClick={closeMenu} data-testid="Entrar-button-navbar">Entrar</Link>
            </li>
        </>
      )}
    </ul>
  );

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <Link to='/' className='navbar-logo' onClick={closeMenu}>WIQ<i className='fab fa-typo3' /></Link>
        <div className='menu-icon' onClick={toggleClick}>
          <button aria-label="Menu toggle" data-testid="Menu-toggle-button">
            <i className={isClicked ? 'fas fa-times' : 'fas fa-bars'}/>
          </button>
        </div>

        <NavLinks isLoggedIn={isLoggedIn}/>
        {isLoggedIn ? (
            <>
              {showButton && <Button buttonStyle='btn--outline' to='/logout' testId="Salir-button-navbar-large">Salir</Button>}
            </>
        ) : (
          <>
            {showButton && <Button buttonStyle='btn--outline' to='/sign-up' testId="Registrarse-button-navbar-large">Registrarse</Button>}
            {showButton && <Button buttonStyle='btn--outline' to='/login' testId="Entrar-button-navbar-large">Entrar</Button>}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
