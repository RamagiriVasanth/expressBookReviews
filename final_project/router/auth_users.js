const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if the username is valid
const isValid = (username) => {
    // Check if the username exists in the users array
    return users.some(user => user.username === username);
}
// Function to authenticate the user
const authenticatedUser = (username, password) => {
    // Check if the username and password match any user in the users array
    return users.some(user => user.username === username && user.password === password);
}
// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body; // Extract username and password from the request body

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    // Validate the user credentials
    if (authenticatedUser(username, password)) {
        // Create a JWT token for the user
        const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });
        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body; // Assuming review is sent in the request body
    const username = req.session.username; // Assuming username is stored in session

    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    // Find if the user has already reviewed this ISBN
    const existingReviewIndex = reviews.findIndex(r => r.isbn === isbn && r.username === username);

    if (existingReviewIndex !== -1) {
        // Modify existing review
        reviews[existingReviewIndex].review = review;
        return res.status(200).json({ message: "Review updated successfully" });
    } else {
        // Add new review
        reviews.push({ isbn, username, review });
        return res.status(201).json({ message: "Review added successfully" });
    }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username; // Assuming the username is stored in the session
    if (!reviews[isbn]) {
        return res.status(404).send("No reviews found for this ISBN.");
    }

    // Filter out the review by the current user
    const userReviews = reviews[isbn].filter(review => review.username !== username);

    if (userReviews.length === reviews[isbn].length) {
        return res.status(403).send("You can only delete your own reviews.");
    }

    // Update the reviews for the ISBN
    reviews[isbn] = userReviews;

    return res.status(200).send("Review deleted successfully.");
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
