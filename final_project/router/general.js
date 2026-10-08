const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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

// Task 1: Get the list of all books
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn], null, 4));
    }
    return res.status(404).json({ message: "Book not found" });
});

// Task 3: Get book details by author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const keys = Object.keys(books);
    const result = keys
        .filter(key => books[key].author === author)
        .map(key => ({ isbn: key, ...books[key] }));

    if (result.length > 0) {
        return res.status(200).send(JSON.stringify(result, null, 4));
    }
    return res.status(404).json({ message: "No books found for this author" });
});

// Task 4: Get book details by title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const keys = Object.keys(books);
    const result = keys
        .filter(key => books[key].title === title)
        .map(key => ({ isbn: key, ...books[key] }));

    if (result.length > 0) {
        return res.status(200).send(JSON.stringify(result, null, 4));
    }
    return res.status(404).json({ message: "No books found with this title" });
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    }
    return res.status(404).json({ message: "Book not found" });
});
const BASE_URL = "http://localhost:5000";

// Task 10: Get the list of all books (async/await with Axios)
public_users.get('/async/books', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list" });
    }
});

// Task 11: Get book details by ISBN (async/await with Axios)
public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/isbn/${req.params.isbn}`);
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Task 12: Get book details by author (async/await with Axios)
public_users.get('/async/author/:author', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(req.params.author)}`);
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        return res.status(404).json({ message: "No books found for this author" });
    }
});

// Task 13: Get book details by title (async/await with Axios)
public_users.get('/async/title/:title', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(req.params.title)}`);
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        return res.status(404).json({ message: "No books found with this title" });
    }
});
module.exports.general = public_users;