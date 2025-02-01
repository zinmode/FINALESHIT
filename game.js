const loginButton = document.getElementById('loginButton');
const usernameInput = document.getElementById('usernameInput');
const usernameDisplay = document.getElementById('usernameDisplay');
const gameSection = document.getElementById('gameSection');
const loginSection = document.getElementById('loginSection');
const timerDisplay = document.getElementById('timer');
const questionDisplay = document.getElementById('question');
const speechBubble = document.getElementById('speechBubble');
const answerButtons = document.querySelectorAll('.answerButton');
const scoreDisplay = document.getElementById('score');
const resultSection = document.getElementById('resultSection');
const resultMessage = document.getElementById('resultMessage');
const finalScore = document.getElementById('finalScore');
const feedback = document.getElementById('feedback');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const restartButton = document.getElementById('restartButton');

let score = 0;
let timeLeft = 30; // Endret til 30 sekunder
let timer;
let currentQuestion;
let bestScore = localStorage.getItem('bestScore') || 0;

const operations = ['multiplikasjon', 'addisjon', 'subtraksjon', 'divisjon', 'blanding'];
let selectedOperation = 'multiplikasjon'; // Standardvalg

function generateQuestions(operation) {
    const questions = [];
    for (let i = 1; i <= 10; i++) {
        for (let j = 1; j <= 10; j++) {
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
                const wrongAnswer = Math.floor(Math.random() * 100) + 1;
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

let questions = generateQuestions(selectedOperation);

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
    { threshold: 20, message: "Skynd deg! Tiden renner ut!" },
    { threshold: 10, message: "Bare 10 sekunder igjen! Raskere!" },
    { threshold: 5, message: "5 sekunder! Fort, fort!" }
];

loginButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        usernameDisplay.textContent = username;
        loginSection.style.display = 'none';
        gameSection.style.display = 'block';
        startGame();
    }
});

function startGame() {
    score = 0;
    timeLeft = 30; // Endret til 30 sekunder
    timerDisplay.textContent = timeLeft;
    scoreDisplay.textContent = `Poeng: ${score}`;
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
        button.style.top = `${Math.random() * 80 + 10}%`;
        button.style.left = `${Math.random() * 80 + 10}%`;
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
    alert(`Din beste poengsum er: ${bestScore}`);
});