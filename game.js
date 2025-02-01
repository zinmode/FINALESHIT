const startButton = document.getElementById('startButton');
const usernameInput = document.getElementById('usernameInput');
const operationSelect = document.getElementById('operationSelect');
const usernameDisplay = document.getElementById('usernameDisplay');
const gameSection = document.getElementById('gameSection');
const loginSection = document.getElementById('loginSection');
const timerDisplay = document.getElementById('timer');
const questionDisplay = document.getElementById('question');
const speechBubble = document.getElementById('speechBubble');
const answerButtons = document.querySelectorAll('.answerButton');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('bestScoreDisplay');
const resultSection = document.getElementById('resultSection');
const resultMessage = document.getElementById('resultMessage');
const finalScore = document.getElementById('finalScore');
const feedback = document.getElementById('feedback');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const restartButton = document.getElementById('restartButton');
const restartButtonInGame = document.getElementById('restartButtonInGame');

const multiplikasjonScore = document.getElementById('multiplikasjonScore');
const addisjonScore = document.getElementById('addisjonScore');
const subtraksjonScore = document.getElementById('subtraksjonScore
let score = 0;
let timeLeft = 20; // Endret til 20 sekunder
let timer;
let currentQuestion;
let bestScore = localStorage.getItem('bestScore') || 0;

let selectedOperation = 'multiplikasjon'; // Standardvalg

function generateQuestions(operation, difficulty) {
    const questions = [];
    const maxNumber = 10 + difficulty * 5; // Øker vanskelighetsgraden ved å øke maksnummeret
    for (let i = 1; i <= maxNumber; i++) {
        for (let j = 1; j <= maxNumber; j++) {
            let question, correctAnswer;
            switch (operation) {
                case 'addisjon':
                    question = `${i} + ${j}`;
                    correctAnswer = i + j;
                    break;
                case 'subtraksjon':
                    question = `${i} - ${j}`;
                    correctAnswer = i - j;
                    break;
                case 'divisjon':
                    if (j !== 0) {
                        question = `${i * j} / ${j}`;
                        correctAnswer = i;
                    }
                    break;
                case 'blanding':
                    const ops = ['+', '-', '*', '/'];
                    const op = ops[Math.floor(Math.random() * ops.length)];
                    question = `${i} ${op} ${j}`;
                    correctAnswer = eval(question);
                    break;
                default:
                    question = `${i} x ${j}`;
                    correctAnswer = i * j;
            }
            const answers = [correctAnswer];
            while (answers.length < 4) {
                const wrongAnswer = Math.floor(Math.random() * (maxNumber * maxNumber)) + 1;
                if (!answers.includes(wrongAnswer)) {
                    answers.push(wrongAnswer);
                }
            }
            answers.sort(() => Math.random() - 0.5);
            questions.push({ question, answers, correct: correctAnswer });
        }
    }
    return questions;
}

const complimentsAndInsults = [
    { threshold: 90, message: "Fantastisk! Du er et mattegeni!" },
    { threshold: 80, message: "Utmerket arbeid! Du er et mattevidunder!" },
    { threshold: 70, message: "Flott jobb! Du kan virkelig dette!" },
    { threshold: 60, message: "God innsats! Fortsett å øve!" },
    { threshold: 50, message: "Ikke verst, men du kan gjøre det bedre!" },
    { threshold: 40, message: "Du må jobbe med matteferdighetene dine." },
    { threshold: 30, message: "Kom igjen, du kan gjøre det bedre enn det!" },
    { threshold: 20, message: "Det var ganske dårlig. Prøv hardere neste gang." },
    { threshold: 10, message: "Prøver du i det hele tatt? Det var forferdelig." },
    { threshold: 0, message: "Wow, det var elendig. Bedre lykke neste gang." }
];

const stressMessages = [
    { threshold: 15, message: "Skynd deg! Tiden renner ut!" },
    { threshold: 10, message: "Bare 10 sekunder igjen! Raskere!" },
    { threshold: 5, message: "5 sekunder! Fort, fort!" }
];

startButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    selectedOperation = operationSelect.value;
    if (username) {
        usernameDisplay.textContent = username;
        loginSection.style.display = 'none';
        gameSection.style.display = 'block';
        bestScoreDisplay.textContent = `Beste poengsum: ${bestScore}`;
        startGame();
    }
});

restartButtonInGame.addEventListener('click', () => {
    clearInterval(timer);
    startGame();
});

function startGame() {
    score = 0;
    timeLeft = 20; // Endret til 20 sekunder
    timerDisplay.textContent = timeLeft;
    scoreDisplay.textContent = `Poeng: ${score}`;
    questions = generateQuestions(selectedOperation, Math.floor(score / 50)); // Øker vanskelighetsgraden basert på poengsum
    timer = setInterval(updateTimer, 1000);
    showNextQuestion();
}

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    updateSpeechBubble();
    if (timeLeft <= 0) {
        clearInterval(timer);
        endGame();
    }
}

function updateSpeechBubble() {
    speechBubble.style.display = 'block';
    let message = "";
    for (let i = 0; i < stressMessages.length; i++) {
        if (timeLeft <= stressMessages[i].threshold) {
            message = stressMessages[i].message;
            break;
        }
    }
    speechBubble.textContent = message;
}

function showNextQuestion() {
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    questionDisplay.textContent = currentQuestion.question;
    answerButtons.forEach((button, index) => {
        button.textContent = currentQuestion.answers[index];
        button.style.top = `${Math.random() * 60 + 20}%`; // Justerer posisjoneringen for å unngå overlapping
        button.style.left = `${Math.random() * 60 + 20}%`; // Justerer posisjoneringen for å unngå overlapping
        button.onclick = () => checkAnswer(currentQuestion.answers[index]);
    });
}

function checkAnswer(answer) {
    if (answer === currentQuestion.correct) {
        score += 10;
        feedback.textContent = "Riktig!";
        feedback.style.color = "green";
        correctSound.play();
    } else {
        score -= 5;
        feedback.textContent = "Feil!";
        feedback.style.color = "red";
        wrongSound.play();
    }
    scoreDisplay.textContent = `Poeng: ${score}`;
    questions = generateQuestions(selectedOperation, Math.floor(score / 50)); // Oppdaterer spørsmålene basert på ny poengsum
    showNextQuestion();
}

function endGame() {
    gameSection.style.display = 'none';
    resultSection.style.display = 'block';
    finalScore.textContent = `Din endelige poengsum er: ${score}`;
    
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }

    let resultMessageText;
    
    for (let i = 0; i < complimentsAndInsults.length; i++) {
        if (score >= complimentsAndInsults[i].threshold) {
            resultMessageText = complimentsAndInsults[i].message;
            break;
        }
    }
    resultMessage.textContent = resultMessageText;
}

restartButton.addEventListener('click', () => {
    resultSection.style.display = 'none';
    loginSection.style.display = 'block';
    bestScoreDisplay.textContent = `Beste poengsum: ${bestScore}`;
});
