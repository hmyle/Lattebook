const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Checkin = require('./models/checkin');
const User = require('./models/user');

const app = express();
const port = 3000;

// MongoDB connection URI
const mongoURI = 'mongodb+srv://hmyle:mjWS3$-2FvgUwNU@iotlibrary.tdjdpmt.mongodb.net/librarysystem';

app.use(bodyParser.json());

mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.log(error.message));


app.post('/api/uid', async (req, res) => {
  const uidData = req.body;
  const checkInUid = new Checkin(uidData);
  let userUid = checkInUid.uid.replace(/\s+/, '');

  checkInUid.save().then(console.log('Data saved to database')).catch((error) => console.log(error.message));

  try {
    const user = await User.findOne({ uid: userUid });
    if (user) {
      console.log("User found:", user);
      res.json(user);
    } else {
      console.log("User not found");
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving user information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});