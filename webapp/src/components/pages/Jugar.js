import React, {useContext, useEffect, useRef, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../../AuthContext';
import { Snackbar } from '@mui/material';
import "./Jugar.css";
import axios from 'axios';

// Configuración inicial y datos
const INITIAL_TIMER = 20;
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';



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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('default');
  const { isLoggedIn, username } = useContext(AuthContext);
  const [questions, setQuestions] = useState([{
    question: "Se están generando nuevas preguntas. Por favor espere, no debería tardar más de 1 minuto.",
    answers: [
      { answer: "No responda", correct: true },
      { answer: "Por favor no responda en serio", correct: false },
      { answer: "Si responde un gatito muere ", correct: false },
      { answer: "Ninguna de las anteriores", correct: false },
    ]
  }]);

  const timerIntervalRef = useRef(null);
  const handleNextQuestionRef = useRef(null);
  const handleSaveHistoryRef = useRef(null);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        console.log("Requesting random questions to " + apiEndpoint);
        const response = await axios.get(`${apiEndpoint}/question/randoms`);
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
      getQuestions();
    }
  }, [isLoggedIn, navigate]);


  const handleNextQuestion = (timeExpired = false) => {
    if (selectedAnswerIndex !== null || timeExpired) {
      const question = questions[currentQuestionIndex];
      const isCorrect =
          selectedAnswerIndex !== null &&
          questions[currentQuestionIndex].answers[selectedAnswerIndex]?.correct;
      if (isCorrect) {
        setCorrectAnswers(correctAnswers + 1);
        setMessage('¡Respuesta Correcta!');
        setSnackbarColor('green');
      }
      else {
        const correctAnswer = question.answers.find(ans => ans.correct);
        setMessage(`Fallo: La correcta era: ${correctAnswer.answer}`);
        setSnackbarColor('red');
      }
      setOpenSnackbar(true);
    }
    setTimer(INITIAL_TIMER);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswerIndex(null);
    } else {
      // Finaliza el quiz
      setQuizFinished(true);
    }
  };

  handleSaveHistoryRef.current = () => {
    axios.post(`${apiEndpoint}/savehistory`, {
      username: username,
      NumPreguntasJugadas: questions.length,
      NumAcertadas: correctAnswers,
    }).then(response => {
      console.log(response.data);
    }).catch(error => {
      console.error('Error al guardar el historial:', error);
    });
  };

  handleNextQuestionRef.current = handleNextQuestion;

  useEffect(() => {
    if (!quizFinished && questionsLoaded) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); // Limpia el intervalo si ya existe

      timerIntervalRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            handleNextQuestionRef.current(true); // Tiempo expirado
            return INITIAL_TIMER;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    // Limpia el intervalo cuando el componente se desmonta o el quiz finaliza
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [quizFinished, questionsLoaded]);

  useEffect(() => {
    if (quizFinished && questionsLoaded) {
      handleSaveHistoryRef.current();
    }
  }, [quizFinished, questionsLoaded]);
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const videoSource = quizFinished ? "/videos/celebracion.mp4" : "/videos/question.mp4";
  // Renderizado del componente
  return (
    <>
      <div className="video-background">
        {/* Usar una clave que cambie con videoSource asegura que el componente video se remonte */}
        <video key={videoSource} autoPlay loop muted playsInline>
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
                onClick={() => setSelectedAnswerIndex(index)}
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
      <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={message}
          ContentProps={{
            sx: {
              bgcolor: snackbarColor,
              color: 'white',
              fontWeight: 'bold'
            }
          }}
      />
    </>
  );
}

export default Jugar;
