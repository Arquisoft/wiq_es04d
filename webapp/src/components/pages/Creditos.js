import React, {useState } from 'react';
import './Creditos.css'
function Creditos() {
  return (
      <div className="wrapper">
          <img src="images/creditos-fondo.jpg" alt="Fondo" className="background-image"/>
          <div className="scroll-text">
              <h1 className="h1-creditos">WIQ 4D</h1>
              <h2>LA ARQUITECTURA DEL SOFTWARE</h2>
              <p>En una universidad no muy lejana, estudiantes de ingeniería informática enfrentan el desafío más grande
                  de su carrera académica: el curso de Arquitectura del Software. En medio de complejas teorías y
                  códigos intrincados, un valiente grupo de cinco estudiantes se embarca en una misión para desarrollar
                  una Aplicacion web revolucionaria.</p>
              <p>La tarea no es sencilla: deben crear un juego de preguntas generado automáticamente a través de
                  Wikidata, una fuente de conocimiento libre y colaborativa que desafía incluso a los más habilidosos
                  programadores. Sin embargo, los primeros intentos no son prometedores y tras dos entregas fallidas, el
                  descontento y la frustración amenazan con desintegrar el equipo.</p>
              <p>Cuando parecía que todo estaba perdido, el destino del proyecto toma un giro inesperado. El grupo se
                  reduce a tres miembros decididos a enfrentar los desafíos. Lejos de rendirse, este trío de
                  perseverantes estudiantes encuentra en la adversidad la chispa que necesitaban.</p>
              <p>Con renovadas energías y un enfoque más claro, se embarcan en un viaje épico a través de líneas de
                  código y arquitecturas de software. Noches sin dormir y sesiones maratónicas de programación se
                  convierten en su día a día, mientras la fecha de entrega se acerca inexorablemente.</p>
              <p>Contra todo pronóstico, el juego comienza a tomar forma. Las preguntas fluyen de Wikidata, los
                  algoritmos se optimizan y la interfaz de usuario se vuelve intuitiva y atractiva. Lo que una vez fue
                  un grupo dividido ahora es un equipo unido y fuerte, listo para demostrar que incluso en los momentos
                  más oscuros, la colaboración y la determinación pueden llevar a la creación de algo
                  extraordinario.</p>
              <p>Ahora, mientras se preparan para la presentación final, los tres programadores no solo esperan aprobar
                  con una excelente calificación, sino también dejar una marca en la historia de la universidad,
                  demostrando que incluso los mayores obstáculos pueden superarse con pasión y perseverancia. El destino
                  de su proyecto está ahora en manos de los jueces... pero en sus corazones, ya son vencedores.</p>
          </div>

      </div>
  );
}

export default Creditos;