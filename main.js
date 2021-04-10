//Constants

const Q_NUM = 50;

//DOM elements
let LOADER = document.getElementById('loaderAnim');
let MAIN_CONTAINER = document.querySelector('.container');
const QUESTION_P = document.getElementById('questionText');
const ANSWERS = Array.from(document.querySelectorAll('#answerText'));
const SCORE_PANNELS = document.querySelectorAll('.player--score');
const ANSWERS_BTN = Array.from(document.querySelectorAll('.btn--answer'));
const RESTART_BUTTON = document.getElementById('restart');
const SCORE_TO_WIN = 7;

///variables
let questionsList, correctAnswer;
let scores = [0, 0];
let usedQuestions = [];
let activePlayer = 0;
let finished = false;

//API call
async function getQuestions(Q_NUM) {
  try {
    const result = await fetch(
      `https://opentdb.com/api.php?amount=${Q_NUM}&type=multiple`
    );
    const data = await result.json();
    LOADER.style.display = 'none';
    return await data;
  } catch (error) {
    console.log(error);
  }
}

let Question = function (question, answers, correctAnswer) {
  this.question = question;
  this.answers = answers;
  this.correctAnswer = correctAnswer;
};

function getQuestion() {
  //Get random question
  const i = Math.floor(Math.random() * questionsList.results.length);
  //do not repeat question excluding repeated indexes
  while (usedQuestions.includes(i)) {
    i = Math.floor(Math.random() * questionsList.length);
  }
  const currQuestion = questionsList.results[i];
  console.log(currQuestion);

  //get answers
  let answers = currQuestion.incorrect_answers;
  answers.push(currQuestion.correct_answer);

  //shuffleanswers

  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  //asign correct answer
  correctAnswer =
    answers.findIndex((e) => e === currQuestion.correct_answer) + 1;
  //Create question object and return it
  let output = new Question(currQuestion.question, answers, correctAnswer);
  output;
  usedQuestions.push(i);
  return output;
}

function resetScores() {
  SCORE_PANNELS[0].classList.add('player--score-active');
  SCORE_PANNELS[1].classList.remove('player--score-active');
  document.getElementById(`score--p1`).textContent = 0;
  document.getElementById(`score--p2`).textContent = 0;
}

function restart() {
  resetScores();
  usedQuestions = [];
  scores = [0, 0];
  fillDom();
  finished = false;
}

function fillDom() {
  let data = getQuestion();
  QUESTION_P.innerHTML = data.question;
  correctAnswer = data.correctAnswer;
  for (let i = 0; i < ANSWERS.length; i++) {
    ANSWERS[i].textContent = data.answers[i];
  }
}

function checkAnswer(option) {
  if (option === correctAnswer) {
    scores[activePlayer]++;
    document.getElementById(`score--p${activePlayer + 1}`).textContent =
      scores[activePlayer];
    if (scores[activePlayer] === SCORE_TO_WIN) {
      QUESTION_P.textContent = `And the Winner is player ${activePlayer + 1}`;
      ANSWERS.forEach((e) => {
        e.textContent = `Player ${activePlayer + 1} rules!!`;
      });
      finished = true;
    } else {
      fillDom();
    }
  } else {
    SCORE_PANNELS[0].classList.toggle('player--score-active');
    SCORE_PANNELS[1].classList.toggle('player--score-active');
    activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
  }
}

function initButtons() {
  for (let i = 0; i < ANSWERS_BTN.length; i++) {
    ANSWERS_BTN[i].addEventListener('click', () => {
      finished ? restart() : checkAnswer(i + 1);
    });
  }
}

RESTART_BUTTON.addEventListener('click', () => {
  restart();
});

function init() {
  activePlayer = 0;
  resetScores();
  initButtons();
  fillDom();
  MAIN_CONTAINER.style.display = 'grid';
}

getQuestions(50)
  .then((result) => {
    questionsList = result;

    init();
  })
  .catch((err) => console.log(err));
