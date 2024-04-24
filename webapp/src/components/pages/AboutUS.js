import React from 'react';
import './AboutUS.css';
import CardItem from '../CardItem';

function AboutUS() {
  return (
    <div className='cards'>
      <h1>Conoce las áreas clave manejadas por los estudiantes en el proyecto WIQ</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/design.jpg'
              text='Estudiantes innovadores que transformaron la visión del proyecto con su diseño gráfico.'
              label='Diseño Gráfico'
              path='https://arquisoft.github.io/wiq_es04d/'
            />
            <CardItem
              src='images/api-logic.jpg'
              text='Desarrollo de la lógica de integración con la API de Wikidata para enriquecer nuestro proyecto.'
              label='API de Wikidata'
              path='https://arquisoft.github.io/wiq_es04d/'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/database.jpg'
              text='Implementación de soluciones de bases de datos para gestionar eficientemente la información.'
              label='Base de Datos'
              path='https://arquisoft.github.io/wiq_es04d/'
            />
            {/* Documentación */}
            <CardItem
              src='images/documentation.jpg'
              text='Creación de documentación detallada para facilitar la comprensión y el uso del proyecto.'
              label='Documentación'
              path='https://arquisoft.github.io/wiq_es04d/'
            />
            {/* Despliegue de la Aplicación */}
            <CardItem
              src='images/deployment.jpg' // Asegúrate de cambiar esta imagen por una representativa del despliegue
              text='Técnicas y estrategias de despliegue aplicadas para poner en marcha nuestra aplicación.'
              label='Despliegue'
              path=
              'https://arquisoft.github.io/wiq_es04d/'
            />
            {/*Creditos */}
            <CardItem
              src='images/creditos.jpg' // Asegúrate de cambiar esta imagen por una representativa del despliegue
              text='Creditos de la Aplicacion'
              label='Creditos'
              path='/creditos' 
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutUS;
