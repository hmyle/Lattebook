const fs = require('fs');
const path = require('path');
const multer = require('multer');

const User = require('../models/user');

module.exports.updateProfilePicturePost = async (req, res) => {
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
        const oldImagePath = path.join(__dirname, '..', 'public', oldImageLink);
        console.log(oldImagePath);
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
};

module.exports.updateProfilePost = async (req, res) => {
    try {
        const { fullName, email, phone, address } = req.body;
    
        const user = await User.findOneAndUpdate(
          { _id: res.locals.user._id },
          { fullName: fullName, email: email, phone: phone, address: address },
        );
        
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ message: 'Profile updated successfully' });
      } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

module.exports.updatePasswordPost = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    let user = res.locals.user;

    if (!user.isValidPassword(currentPassword)){
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirm password do not match' });
    }

    // Update the password
    user.password = newPassword;

    // Save the user
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};