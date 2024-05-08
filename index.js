// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Importing models
const Review = require('./models/review');
const Book = require('./models/book');
const User = require('./models/user');
const Author = require('./models/author');
const Category = require('./models/category');
const Publisher = require('./models/publisher');

// Importing routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Importing middleware
const { requireAuth, checkUser} = require('./middleware/authMiddleware');

// Initializing express app
const app = express();
const port = 3000;

// Setting up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Variables for book of the day feature
let selectedBook;
let selectedDate;


// Checking user for all routes
app.get('*', checkUser);

// Setting up session
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      maxAge: 60 * 60 * 24 * 24 * 7,
      secure: false 
    },
  })
);

// Setting up routes
app.use(authRoutes);
app.use(profileRoutes);

// Database Connection
const mongoURI = 'mongodb+srv://hmyle:mjWS3$-2FvgUwNU@iotlibrary.tdjdpmt.mongodb.net/librarysystem';

mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.log(error.message));

// Route for all types of users
app.get('/', checkUser, async (req,res) => {
  try {
    // Fetch all authors, categories, and publishers from the database
    const authors = await Author.find();
    const categories = await Category.find();
    const publishers = await Publisher.find();
  
    // Fetch all books and populate their author, category, and publisher fields
    let books = await Book.find().populate('author').populate('category').populate('publisher');
  
    // Get the total count of books
    const count = await Book.countDocuments();
  
    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().slice(0,10);
  
    // If there is no selected book or the selected date is not the current date
    if (!selectedBook || selectedDate !== currentDate) {
      // Generate a random number within the range of the total book count
      const random = Math.floor(Math.random() * count);
  
      // Select a random book and set it as the selected book
      selectedBook = await Book.findOne().skip(random);
  
      // Set the selected date as the current date
      selectedDate = currentDate;
    }
  
    // Fetch the latest 5 reviews
    const reviews = await Review.find().limit(5);
  
    // Map over the reviews to fetch the user who made each review
    const reviewsWithUser = await Promise.all(reviews.map(async (review) => {
      const user = await User.findById(review.userId);
      return {
        ...review._doc,
        reviewedUser: user
      };
    }));
  
    // Render the index page with the fetched data
    res.render('home', { books, authors, categories, publishers, bookoftheday: selectedBook, reviews: reviewsWithUser });
  
  } catch (err) {
    // Log any error that occurs and redirect to the home page
    console.error(err);
    res.redirect('/');
  }
}); 

app.get('/settings', checkUser, requireAuth, (req, res) => {
  res.render('settings', { user: res.locals.user });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
