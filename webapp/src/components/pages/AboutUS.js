import React from 'react';
import './AboutUS.css';
import CardItem from '../CardItem';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
const grafanaEndpoint = process.env.GRAFANA_ENDPOINT || 'http://localhost:9091';

function AboutUS() {
  return (
    <div className='cards'>
      <h1>Conoce las áreas clave manejadas por los estudiantes en el proyecto WIQ</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {/* Monitorización de la Aplicación */}
            <CardItem
              src='images/monitoring.jpg'
              text='Técnicas y estrategias de monitorización aplicadas con grafana para controlar nuestra aplicación.'
              label='Monitorización'
              path={`${grafanaEndpoint}/dashboards`}
            />
            {/* API Doc */}
            <CardItem
              src='images/api-logic.jpg'
              text='Desarrollo de la lógica de integración con la API de Wikidata para enriquecer nuestro proyecto.'
              label='API de Wikidata'
              path={`${apiEndpoint}/api-doc`}
            />
          </ul>
          <ul className='cards__items'>
            {/* API Doc */}
            <CardItem
              src='images/database.jpg'
              text='Implementación de soluciones de bases de datos para gestionar eficientemente la información.'
              label='Base de Datos'
              path='https://www.mongodb.com'
            />
            {/* Documentación */}
            <CardItem
              src='images/documentation.jpg'
              text='Creación de documentación detallada para facilitar la comprensión y el uso del proyecto.'
              label='Documentación'
              path='https://arquisoft.github.io/wiq_es04d/'
            />
            {/*Creditos */}
            <CardItem
              src='images/creditos.jpg'
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
