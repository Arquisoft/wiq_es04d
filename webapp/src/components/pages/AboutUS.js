import React from 'react';
import './AboutUS.css';
import CardItem from '../CardItem';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

function AboutUS() {
  return (
    <div className='cards'>
      <h1>Conoce las áreas clave manejadas por los estudiantes en el proyecto WIQ</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {/*Creditos */}
            <CardItem
                src='images/creditos.jpg'
                text='Créditos de la Aplicación'
                label='Créditos'
                path='/creditos'
            />
            <CardItem
                src='images/github.jpg'
                text='Explora nuestro código en GitHub y contribuye al desarrollo del proyecto WIQ.'
                label='GitHub WIQ4D'
                path='https://github.com/Arquisoft/wiq_es04d'
            />
          </ul>
          <ul className='cards__items'>
            {/* API Doc */}
            <CardItem
              src='images/database.jpg'
              text='Implementación de soluciones de bases de datos para gestionar eficientemente la información.'
              label='Base de Datos'
              path='https://github.com/Arquisoft/wiq_es04d/wiki/ADR-4-%E2%80%90-Base-de-datos'
            />
            {/* Documentación */}
            <CardItem
              src='images/documentation.jpg'
              text='Creación de documentación detallada para facilitar la comprensión y el uso del proyecto.'
              label='Documentación'
              path='https://arquisoft.github.io/wiq_es04d/'
            />

            <CardItem
                src='images/api-logic.jpg'
                text='Desarrollo de la lógica de integración con la API de Wikidata para enriquecer nuestro proyecto.'
                label='API de Wikidata'
                path={`${apiEndpoint}/api-doc`}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutUS;
