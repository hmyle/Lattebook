// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Importing models
const User = require('./models/user');

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
  res.render('home');
});

app.get('/settings', checkUser, requireAuth, (req, res) => {
  res.render('settings', { user: res.locals.user });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
