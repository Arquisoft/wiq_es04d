import React from 'react';
import './Ayuda.css';

function Ayuda() {
    return (
        <div className="center-wrapper">
            <video src='/videos/help.mp4' autoPlay loop muted playsInline data-testid="help-video"/>
            <h1>AYUDA (WIQ 4D)</h1>
            <div className="help-container">     
                <section>
                    <h2>1. Registro e Inicio de Sesión</h2>
                    <h3>¿Cómo me registro?</h3>
                    <p>Para registrarte, haz clic en el botón "Registrarse" en la página principal. Completa el formulario con la información requerida (nombre de usuario y contraseña). ¡Listo! Ahora puedes iniciar sesión y empezar a jugar.</p>

                    <h3>¿Cómo inicio sesión?</h3>
                    <p>Ingresa a la página principal y haz clic en "Entrar". Escribe tu nombre de usuario y contraseña. Si tus credenciales son correctas, serás redirigido a la pagina principal para poder jugar o realizar otras funciones.</p>
                </section>
                <br />
                <section>
                    <h2>2. Cómo Jugar</h2>
                    <h3>Inicio del Juego</h3>
                    <p>Una vez iniciada la sesión, serás llevado a la pantalla principal del juego donde podrás empezar una nueva partida haciendo clic en "Jugar".</p>

                    <h3>Jugando</h3>
                    <p>El juego consiste en responder a 5 preguntas de tipo test de cultura general. Las preguntas son generadas automáticamente desde Wikidata, asegurando una variedad y actualización constante. Selecciona la respuesta que consideres correcta de las opciones proporcionadas y luego haz clic en "Siguiente" o espera a que termine el tiempo para avanzar a la siguiente pregunta.</p>

                    <h3>Final del Juego</h3>
                    <p>Al terminar de responder las 5 preguntas, verás tu puntuación en la pantalla. Podrás revisar las respuestas correctas e incorrectas.</p>
                </section>
                <br />
                <section>
                    <h2>3. Historial y Ranking</h2>
                    <h3>¿Cómo puedo ver mi historial de juego?</h3>
                    <p>En la barra de navegación, encuentra y selecciona "Historial". Aquí podrás ver el registro de los juegos que has jugado, incluyendo el numero de veces que has jugado, preguntas jugadas, respuestas correctas e incorrectas.</p>

                    <h3>¿Cómo funciona el ranking?</h3>
                    <p>El ranking se basa en una metrica Bayesiana que calcula los 10 mejores jugadores a partir de sus resultados. Para ver el ranking, ve a la sección "Ranking" en la barra de navegación. Compararás tus puntuaciones con las de otros jugadores y ver tu posición en la tabla de líderes.</p>
                </section>
                <br />
                <section>
                    <h2>4. API REST de la aplicación</h2>
                    <p>La API REST proporciona acceso programático a funciones clave del juego, permitiendo a los desarrolladores interactuar con la base de datos de jugadores y el sistema de preguntas de manera eficiente. A continuación, se detallan los endpoints principales y cómo utilizarlos.</p>

                    <h3>Endpoints de la API</h3>
                    <h4>Usuarios</h4>
                    <ul>
                        <li>
                            <strong>GET /api/user</strong> - Obtiene una lista de todos los usuarios registrados.
                        </li>
                        <li>
                            <strong>POST /api/user</strong> - Registra un nuevo usuario en el sistema.
                        </li>
                        <li>
                            <strong>PATCH /api/user/id</strong> - Actualiza un usuario del sistema.
                        </li>
                        <li>
                            <strong>DELETE /api/user/id</strong> - Borra un usuario del sistema.
                        </li>
                    </ul>
                    <h4>Preguntas</h4>
                    <ul>
                        <li>
                            <strong>POST /api/question/randoms</strong> - Obtiene preguntas aleatorias de la base de datos.
                        </li>
                        <li>
                            <strong>GET /api/question</strong> - Obtiene todas las preguntas de la base de datos.
                        </li>
                        <li>
                            <strong>POST /api/question</strong> - Añade una nueva pregunta al sistema.
                        </li>
                        <li>
                            <strong>PATCH /api/question/id</strong> - Modifica una nueva pregunta del sistema.
                        </li>
                        <li>
                            <strong>DELETE /api/question/id</strong> - Elimina una nueva pregunta del sistema.
                        </li>
                    </ul>
                    <h4>Historial</h4>
                    <ul>
                        <li>
                            <strong>GET /api/history/username</strong> - Obtiene todas el historial de un usuario.
                        </li>
                    </ul>
                    <h4>Otros</h4>
                    <ul>
                        <li>
                            <strong>GET /api/health</strong> - Revisa el estado del servicio.
                        </li>
                        <li>
                            <strong>GET /api/login</strong> - Inicia sesion en el sistema.
                        </li>
                    </ul>


                    <h3>Autenticación y Seguridad</h3>
                    <p>Todos los endpoints requieren una autenticación para asegurar que solo usuarios autorizados puedan acceder a la información sensible. La autenticación se realiza mediante tokens JWT que deben ser incluidos en las cabeceras de cada solicitud.</p>
                </section>
                <br />
                <section>
                    <h2>5. Otras Funcionalidades</h2>
                    <ul>
                        <li>Se pueder revisar metricas de la aplicacion a traves de los enlaces de Prometheus y Graphana</li>
                        <li>¿El juego tiene algún costo? No, el juego es completamente gratuito. Solo necesitas registrarte para jugar.</li>
                    </ul>
                </section>
                <br />
                <section>
                    <h2>6. Contacto</h2>
                    <p>¿Necesitas más ayuda? Si tienes preguntas adicionales o necesitas asistencia, no dudes en contactarnos. Puedes enviarnos un correo electrónico a :</p>
                    <ul>
                        <li>
                            <a href="mailto:uo287746@uniovi.es">uo287746@uniovi.es</a>, 
                        </li>
                        <li>
                            <a href="mailto:uo291060@uniovi.es">uo291060@uniovi.es</a>, 
                        </li>
                        <li>
                            <a href="mailto:uo277269@uniovi.es">uo277269@uniovi.es</a>, 
                        </li>
                    </ul>        
                </section>
            </div>
        </div>

    );
}

export default Ayuda;
