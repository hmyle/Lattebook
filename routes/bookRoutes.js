// Import the necessary libraries
const path = require('path');
const multer = require('multer');
const express = require('express');
const bookController = require('../controllers/bookControllers');
const { checkUser, isAdmin } = require('../middleware/authMiddleware');

// Initialize the Express router
const router = express.Router();

// Setting up multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads/')  // Change this to your desired directory
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Appending extension
  }
})

const upload = multer({ storage: storage });

// Define the routes for book details
router.get('/allBooks', checkUser, bookController.allBooksGet);
router.get('/bookDetail/:id', checkUser, bookController.bookDetailGet);

// Define the routes for searching books
router.get('/searchResult', checkUser, bookController.searchGet);

// Define the routes for adding books
router.get('/addbook', checkUser, isAdmin, bookController.addBookGet);
router.post('/addbook', checkUser, isAdmin, upload.single('bookImage'), bookController.addBookPost);

// Define the routes for updating books
router.get('/updateBook/:id', checkUser, isAdmin, bookController.updateBookGet);
router.post('/updateBook/:id', checkUser, isAdmin, upload.single('bookImage'), bookController.updateBookPost);
router.post('/updateBookDetail/:id', checkUser, isAdmin, bookController.updateBookDetailPost);
router.post('/updateBookImage/:id', checkUser, isAdmin, upload.single('bookImage'), bookController.updateBookImagePost);

// Define the routes for deleting books
router.post('/deleteBook/:id', checkUser, isAdmin, bookController.deleteBook);

// Define the routes for managing authors, categories, and publishers
router.post('/author', checkUser, isAdmin, bookController.authorPost);
router.post('/category', checkUser, isAdmin, bookController.categoryPost);;
router.post('/publisher', checkUser, isAdmin, bookController.publisherPost);
router.post('/deleteAuthor/:id', checkUser, isAdmin, bookController.deleteAuthor);
router.post('/deleteCategory/:id', checkUser, isAdmin, bookController.deleteCategory);
router.post('/deletePublisher/:id', checkUser, isAdmin, bookController.deletePublisher);

// get for category
router.get('/category', checkUser, isAdmin, bookController.categoryGet);
// Export the router
module.exports = router;