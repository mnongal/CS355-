const axios = require('axios');

async function fetchQuestions(number, category, difficulty, type) {
    const url = `https://opentdb.com/api.php?amount=${number}&category=${category}&difficulty=${difficulty}&type=${type}`;

    try {
        const response = await axios.get(url);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw new Error('Error fetching questions');
    }
}

async function fetchCategories() {
    const url = `https://opentdb.com/api_category.php`;

    try {
        const response = await axios.get(url);
        return response.data.trivia_categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Error fetching categories');
    }
}

module.exports = { fetchQuestions, fetchCategories };
