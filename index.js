// Importing required modules
const fs = require('fs');
const path = require('path');
const multer = require('multer');
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
const { requireAuth, checkUser, isAdmin } = require('./middleware/authMiddleware');

// Initializing express app
const app = express();
const port = 3000;

// Setting up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Setting up multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/')  // Change this to your desired directory
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Appending extension
  }
})

const upload = multer({ storage: storage });

app.get('/settings', checkUser, requireAuth, (req, res) => {
  res.render('settings', { user: res.locals.user });
});

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

app.post('/uploadProfileImage', checkUser, requireAuth, upload.single('profileImage'), async (req, res) => {
  try {
    // req.file is the `profileImage` file
    const imageLink = '/uploads/' + req.file.filename;
    console.log(imageLink);

    // Find the user
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the old image file if it's not the default image
    const oldImageLink = user.profileImage;
    const defaultImageLink = "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";
    if (oldImageLink !== defaultImageLink) {
      const oldImagePath = path.join(__dirname, 'public', oldImageLink);
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    // Update the user's profile image
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { profileImage: imageLink },
      { new: true }
    );

    res.json({ message: 'Profile image updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
