// Import the necessary libraries and modules
const express = require('express');
const fs = require('fs');
const User = require('../models/user');
const Book = require('../models/book');
const Author = require('../models/author');
const Category = require('../models/category');
const Publisher = require('../models/publisher');
const Review = require('../models/review');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');

// Function to post a library review
module.exports.libraryReviewPost = async (req, res) => {
    // Extract review and rate from the request body
    const { review, rate } = req.body;

    // Define the update query
    const updateQuery = {
        userId: res.locals.user._id, // User ID from the locals
        review: review, // Review text
        star: rate, // Rating
        type: 'For_Library' // Type of review
    };

    try {
        // Find the review and update it, if it doesn't exist, create it
        await Review.findOneAndUpdate(
            { userId: res.locals.user._id, type: 'For_Library' },
            updateQuery,
            { new: true, upsert: true }
        );

        res.send('<script>alert("Review submitted succesfully!"); window.location.href = "/";</script>');
    } catch (err) {
        // Return an error message if the review could not be saved
        res.status(400).json({ message: err.message });
    }
}

module.exports.bookReviewPost = async (req, res) => {
    let transactionId = req.params.id;
    let userId = res.locals.user._id;
    
    try {
      const { review, rate } = req.body;
      const transaction = await Transaction.findById(transactionId).populate('bookId');
      
      if (!transaction) {
        return res.status(404).send('Transaction not found');
      }
      
      const book = transaction.bookId;
      
      book.reviews.push({
        userId,
        description: review, 
        stars: rate,
      });
      
      await book.save();
      
      res.send('<script>alert("Review submitted successfully!"); window.location.href = "/settings";</script>');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }  
  };