import React from 'react';
import '../../App.css';
import { Button } from '../Button';
import './Home.css';

function Home() {
  return (
    <div className='hero-container'>
      <video src='/videos/home.mp4' autoPlay loop muted data-testid="home-video"/>
      <h1>WIQ</h1>
      <p>¿A que estás esperando?</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          to='/Jugar'
        >
          JUGAR
        </Button>
      </div>
    </div>
  );
}

export default Home;
