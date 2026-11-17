const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios')
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!users.filter(user => user.username === username).length > 0) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const fetchBooks = new Promise((resolve, reject) => {
        if(books) {
            resolve(books)
        } else {
            reject(new Error("No data for books available"))
        }
    })

    fetchBooks
    .then(data => res.send(JSON.stringify(data, null, 4)))
    .catch(err => res.send(err.message))
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const fetchBookByISBN = new Promise((resolve, reject) => {
    if(books[isbn]) {
        resolve(books[isbn])
    } else {
        reject(new Error("No data for book with ISBN: " + isbn))
    }
})

fetchBookByISBN
.then(data => res.send(data))
.catch(err => res.send(err.message))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  const fetchBookByAuthor = new Promise((resolve, reject) => {
    for (const key in books) {
        if (books[key].author === author) {
            resolve(books[key])
        }
      }
      reject(new Error("No data for book by author: " + author))
})

fetchBookByAuthor
.then(data => res.send(data))
.catch(err => res.send(err.message))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title
    const fetchBookByTitle = new Promise((resolve, reject) => {
        for (const key in books) {
            if (books[key].title === title) {
                resolve(books[key])
            }
          }
          reject(new Error("No data for book with title: " + title))
    })
    
    fetchBookByTitle
    .then(data => res.send(data))
    .catch(err => res.send(err.message))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
  res.send(books[isbn].reviews)
});

module.exports.general = public_users;
