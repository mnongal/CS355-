const express = require('express');
const path = require('path');
const { fetchQuestions, fetchCategories } = require('./api');

const app = express();
const port = process.env.PORT || 3000;

const scores = []; // In-memory array to store scores

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    try {
        const categories = await fetchCategories();
        const topScores = scores.slice(0, 5); // Get the top 5 scores
        res.render('landing', { categories, topScores });
    } catch (error) {
        res.status(500).send('Error fetching categories');
    }
});

app.post('/quiz', async (req, res) => {
    const { number, category, difficulty, type } = req.body;

    try {
        const questions = await fetchQuestions(number, category, difficulty, type);
        res.render('quiz', { questions, score: 0, index: 0, feedback: null });
    } catch (error) {
        res.status(500).send('Error fetching questions');
    }
});

app.post('/submit', (req, res) => {
    const { answer, correctAnswer, score, index, questions, next } = req.body;
    const parsedQuestions = JSON.parse(questions); // Ensure questions are parsed correctly for the strings

    if (next) {
        const newIndex = parseInt(index) + 1;
        if (newIndex < parsedQuestions.length) {
            res.render('quiz', { questions: parsedQuestions, score: parseInt(score), index: newIndex, feedback: null });
        } else {
            scores.push(parseInt(score)); // Store the new score
            scores.sort((a, b) => b - a); // Sort scores in descending order
            const topScores = scores.slice(0, 5); // Get the top 5 scores
            res.render('score', { score: parseInt(score), topScores });
        }
    } else {
        const newScore = answer === correctAnswer ? parseInt(score) + 1 : parseInt(score);
        const feedback = {
            correct: answer === correctAnswer,
            correctAnswer: correctAnswer
        };
        res.render('quiz', { questions: parsedQuestions, score: newScore, index: parseInt(index), feedback });
    }
});

app.listen(process.env.PORT || 3000);