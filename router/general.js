const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            // console.log(users);
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
  //Write your code here
    //return res.status(300).json(books);

    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("No books available");
        }
    })
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(500).json({ error }));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  //return res.status(300).json(books[isbn]);
  new Promise((resolve, reject) => {
    if (books[isbn]) {
        resolve(books[isbn]);
    } else {
        reject("Book not found");
    }
    })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error }));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase().trim();

    const matchingBooks = Object.values(books)
                                    .filter(book => book.author
                                    .toLowerCase().split(' ').join('') === author);

    if (matchingBooks.length === 0) {
        return res.status(404).json({ message: "No books found for this author" });
    }

    // return res.status(300).json(matchingBooks);
    return new Promise((resolve, reject) => {
        const matchingBooks = Object.values(books)
            .filter(book => book.author.toLowerCase().split(' ').join('') === author);
        
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("No books found for this author");
        }
    })
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(404).json({ error }));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter(book => book.title
                                                            .toLowerCase()
                                                            .split(' ')
                                                            .join('') === title);
  if (matchingBooks.length === 0) {
    return res.status(404).json({message: " No books found for this title"});
  }
  // return res.status(300).json(matchingBooks);
  return new Promise((resolve, reject) => {
    const matchingBooks = Object.values(books)
        .filter(book => book.title.toLowerCase().split(' ').join('') === title);
    
    if (matchingBooks.length > 0) {
        resolve(matchingBooks);
    } else {
        reject("No books found for this title");
    }
    })
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(404).json({ error }));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const matchingReviews = books[isbn];
  if (matchingReviews.length === 0) {
    return res.status(404).json({message: " No books found for this ISBN"});
  }
  return res.status(300).json(matchingReviews);
});


module.exports.general = public_users;
