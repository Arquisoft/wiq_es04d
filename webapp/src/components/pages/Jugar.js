import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import "./Jugar.css";
import axios from 'axios';

// Configuración inicial y datos
const INITIAL_TIMER = 20;




function calculateColor(percent) {
  const green = Math.min(255, Math.floor(255 * (percent / 100)));
  const red = Math.min(255, Math.floor(255 * ((100 - percent) / 100)));
  return `rgb(${red},${green},0)`;
}

function Jugar() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, username } = useContext(AuthContext);
  const [questions, setQuestions] = useState([{
    question: "¿Cuál es la capital de Francia?",
    answers: [
      { answer: "París", correct: true },
      { answer: "Londres", correct: false },
      { answer: "Madrid", correct: false },
      { answer: "Berlín", correct: false },
    ]
  }]);

  useEffect(() => {
    const getQuestions = async() => {
      try {
        console.log("Requesting random questions to " + apiEndpoint);
        const response = await axios.get(`${apiEndpoint}/getquestions`);
        console.log(response);
        setQuestions(response.data);
        setQuestionsLoaded(true);
      } catch (error) {
        console.error('Error getting questions', error);
      }
    };

    if (!isLoggedIn) {
      navigate('/login');
    } else {
      getQuestions().then(r =>{});
    }
  }, [isLoggedIn, navigate]);

  const handleNextQuestion = (timeExpired = false) => {
    setTimer(INITIAL_TIMER);
    if (selectedAnswerIndex !== null || timeExpired) {
      const isCorrect =
          selectedAnswerIndex !== null &&
          questions[currentQuestionIndex].answers[selectedAnswerIndex]?.correct;
      if (isCorrect) {
        setCorrectAnswers(correctAnswers + 1);
      }
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswerIndex(null);
    } else {
      //Finaliza el quiz
      setQuizFinished(true);

      //Guardamos en el historial los datos de la partida
      axios.post(`${apiEndpoint}/savehistory`, {
        username: username,
        NumPreguntasJugadas: questions.length, // Número total de preguntas jugadas (la longitud de la matriz de preguntas)
        NumAcertadas: correctAnswers, // Número de preguntas respondidas correctamente
      })
          .then(response => {
            console.log(response.data); // Mensaje de confirmación del servidor
          })
          .catch(error => {
            console.error('Error al guardar el historial:', error);
          });
    }
  };

  useEffect(() => {
    if (!quizFinished && questionsLoaded) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            handleNextQuestion(true); // Agrega un indicador de que el cambio fue por tiempo
            return INITIAL_TIMER;
          }
          return prevTimer - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [quizFinished, questionsLoaded, currentQuestionIndex, timer, handleNextQuestion]);

  const handleAnswerSelect = (index) => {
    setSelectedAnswerIndex(index);
  };

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';


  const videoSource = quizFinished ? "/videos/celebracion.mp4" : "/videos/question.mp4";
  // Renderizado del componente
  return (
    <>
      <div className="video-background">
        {/* Usar una clave que cambie con videoSource asegura que el componente video se remonte */}
        <video key={videoSource} autoPlay loop muted>
          <source src={videoSource} type="video/mp4" />
        </video>
      </div>
      {quizFinished ? (
        <div className="result-container">
          <div className="quiz-header">
            <h2>Quiz Finalizado</h2>
          </div>
          <p>Aciertos: {correctAnswers}</p>
          <p>Errores: {questions.length - correctAnswers}</p>
        </div>
      ) : (
        <div className="quiz-container">
          <div className="quiz-header">
            <div>
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </div>
            <h2>{questions[currentQuestionIndex].question}</h2>
          </div>
          <div
            className="timer-bar"
            style={{
              width: `${(timer / INITIAL_TIMER) * 100}%`,
              backgroundColor: calculateColor((timer / INITIAL_TIMER) * 100), // Utiliza la función para cambiar el color
            }}
          ></div>
          <ul className="answers-list">
            {questions[currentQuestionIndex].answers.map((answer, index) => (
              <li
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={selectedAnswerIndex === index ? "selected" : ""}
              >
                {answer.answer}
              </li>
            ))}
          </ul>
          <div className="quiz-next">
            <button onClick={handleNextQuestion}>Siguiente</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Jugar;
