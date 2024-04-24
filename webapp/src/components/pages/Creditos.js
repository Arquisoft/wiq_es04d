import React, { useRef, useEffect } from 'react';
import '../../App.css';

function Creditos() {
    const videoRef = useRef(null); // Crear la referencia

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.7; // Establecer la velocidad de reproducción al 80%
        }
    }, []);

    return (
        <div className='hero-container'>
            <video ref={videoRef} src='/videos/creditos.mp4' autoPlay loop muted playsInline data-testid="creditos-video"/>
        </div>
    );
}

export default Creditos;
