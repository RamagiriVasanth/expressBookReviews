const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body; // Extract username and password from the request body

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    if (users[username]) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Register the new user
    users[username] = { password }; // Store the user with the password

    res.status(201).json({ message: "User registered successfully" });
});
const axios = require('axios');

public_users.get('/getallbooks/:isbn', async function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters

    try {
        const response = await axios.get(`https://ramagirivasa-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/getallbooks`); // Replace with your actual API endpoint
        if (response.data) {
            res.json(response.data); // Send the book details as a JSON response
        } else {
            res.status(404).json({ message: "Book not found" }); // Send a 404 response if the book is not found
        }
    } catch (error) {
        res.status(500).send("Error fetching book details: " + error.message);
    }
});
// Get book details based on the author
const axios = require('axios');

public_users.get('/author', async function (req, res) {
    const author = req.params.author; // Retrieve the author from the request parameters

    try {
        const response = await axios.get(`https://ramagirivasa-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author`); // Replace with your actual API endpoint
        const booksByAuthor = response.data.filter(book => book.author === author);
        if (booksByAuthor.length > 0) {
            res.json(booksByAuthor); // Send the list of books by the author as a JSON response
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        res.status(500).send("Error fetching books: " + error.message);
    }
});
// Get book details based on the title
const axios = require('axios');

public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title; // Retrieve the title from the request parameters

    try {
        const response = await axios.get(`https://ramagirivasa-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title`); // Replace with your actual API endpoint
        const booksByTitle = response.data.filter(book => book.title === title);
        if (booksByTitle.length > 0) {
            res.json(booksByTitle); // Send the list of books with the title as a JSON response
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).send("Error fetching books: " + error.message);
    }
});
// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
    const book = books[isbn]; // Find the book by ISBN

    if (book && book.reviews) {
        res.json(book.reviews); // Send the book reviews as a JSON response
    } else {
        res.status(404).json({ message: "No reviews found for this book" }); // Send a 404 response if no reviews are found
    }
});
module.exports.general = public_users;
