const Question = require('./question-model');

const questions = [
    new Question({
      question: "¿Cuál es la capital de Francia?",
      answers: [
        { answer: "París", correct: true },
        { answer: "Londres", correct: false },
        { answer: "Madrid", correct: false },
        { answer: "Berlín", correct: false },
      ],
      questionCategory: "a"
    }),
    new Question({
      question: "¿Cuántos continentes hay en el mundo?",
      answers: [
        { answer: "5", correct: false },
        { answer: "6", correct: false },
        { answer: "7", correct: true },
        { answer: "8", correct: false },
      ],
      questionCategory: "a"
    }),
    new Question({
      question: "¿Cuál es el río más largo del mundo?",
      answers: [
        { answer: "Amazonas", correct: true },
        { answer: "Nilo", correct: false },
        { answer: "Yangtsé", correct: false },
        { answer: "Misisipi", correct: false },
      ],
      questionCategory: "a"
    }),
    new Question({
      question: "¿Cuál es el país más grande del mundo?",
      answers: [
        { answer: "China", correct: false },
        { answer: "Estados Unidos", correct: false },
        { answer: "Canadá", correct: false },
        { answer: "Rusia", correct: true },
      ],
      questionCategory: "a"
    }),
    new Question({
      question: "¿En qué año llegó el hombre a la Luna?",
      answers: [
        { answer: "1965", correct: false },
        { answer: "1969", correct: true },
        { answer: "1971", correct: false },
        { answer: "1973", correct: false },
      ],
      questionCategory: "a"
    })
  ];

module.exports = questions;