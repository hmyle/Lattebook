// Import the necessary libraries
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('express');
const profileControllers = require('../controllers/profileControllers');

// Importing middleware
const { requireAuth, checkUser, isAdmin } = require('../middleware/authMiddleware');

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

router.post('/uploadProfileImage', checkUser, requireAuth, upload.single('profileImage'), profileControllers.updateProfilePicturePost);

// Export the router
module.exports = router;