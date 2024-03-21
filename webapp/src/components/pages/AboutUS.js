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
            {/* Diseño Gráfico */}
            <CardItem
              src='images/design.jpg' // Asegúrate de cambiar esta imagen por una representativa del diseño gráfico
              text='Estudiantes innovadores que transformaron la visión del proyecto con su diseño gráfico.'
              label='Diseño Gráfico'
              path='/areas/diseno-grafico'
            />
            {/* Lógica de API de Wikidata */}
            <CardItem
              src='images/api-logic.jpg' // Asegúrate de cambiar esta imagen por una representativa de la lógica de API
              text='Desarrollo de la lógica de integración con la API de Wikidata para enriquecer nuestro proyecto.'
              label='API de Wikidata'
              path='/areas/logica-api'
            />
          </ul>
          <ul className='cards__items'>
            {/* Base de Datos */}
            <CardItem
              src='images/database.jpg' // Asegúrate de cambiar esta imagen por una representativa de bases de datos
              text='Implementación de soluciones de bases de datos para gestionar eficientemente la información.'
              label='Base de Datos'
              path='/areas/base-de-datos'
            />
            {/* Documentación */}
            <CardItem
              src='images/documentation.jpg' // Asegúrate de cambiar esta imagen por una representativa de la documentación
              text='Creación de documentación detallada para facilitar la comprensión y el uso del proyecto.'
              label='Documentación'
              path='/areas/documentacion'
            />
            {/* Despliegue de la Aplicación */}
            <CardItem
              src='images/deployment.jpg' // Asegúrate de cambiar esta imagen por una representativa del despliegue
              text='Técnicas y estrategias de despliegue aplicadas para poner en marcha nuestra aplicación.'
              label='Despliegue'
              path='/areas/despliegue'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutUS;
