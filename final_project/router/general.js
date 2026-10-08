const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Internal endpoint that returns the raw book data (fetched by the Axios calls below)
public_users.get('/books-data', (req, res) => {
    return res.status(200).json(books);
});

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Task 10: Get the list of all books (async/await with Axios)
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/books-data`);
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list", error: error.message });
    }
});

// Task 11: Get book details by ISBN (async/await with Axios)
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/books-data`);
        const book = response.data[req.params.isbn];
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
    }
});

// Task 12: Get book details by author (async/await with Axios)
public_users.get('/author/:author', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/books-data`);
        const allBooks = response.data;
        const result = Object.keys(allBooks)
            .filter(key => allBooks[key].author === req.params.author)
            .map(key => ({ isbn: key, ...allBooks[key] }));

        if (result.length === 0) {
            return res.status(404).json({ message: "No books found for this author" });
        }
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book by author", error: error.message });
    }
});

// Task 13: Get book details by title (async/await with Axios)
public_users.get('/title/:title', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/books-data`);
        const allBooks = response.data;
        const result = Object.keys(allBooks)
            .filter(key => allBooks[key].title === req.params.title)
            .map(key => ({ isbn: key, ...allBooks[key] }));

        if (result.length === 0) {
            return res.status(404).json({ message: "No books found with this title" });
        }
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book by title", error: error.message });
    }
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    }
    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;