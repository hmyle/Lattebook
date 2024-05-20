const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Checkin = require('./models/checkin');
const User = require('./models/user');
const Book = require('./models/book');
const { sendHighTemperatureEmail, sendLowTemperatureEmail } = require('./middleware/emailMiddleware');
const TemperatureHumidity = require('./models/temperatureHumidity');

const app = express();
const port = 3001;

// MongoDB connection URI
const mongoURI = 'mongodb+srv://hmyle:mjWS3$-2FvgUwNU@iotlibrary.tdjdpmt.mongodb.net/librarysystem';

app.use(bodyParser.json());

mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.log(error.message));


app.post('/api/uid', async (req, res) => {
  const uidData = req.body;
  const checkInUid = new Checkin(uidData);

  let uid = checkInUid.uid.replace(/\s+/, '');

  const user = await User.findOne({ RFID: uid });
  const book = await Book.findOne({ RFID: uid });

  if (book) {
    console.log("Book found:", book);
    res.json(book);
  }

  try {
    checkInUid.save().then(console.log('Data saved to database')).catch((error) => console.log(error.message));
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

app.post('/api/temperature', async (req, res) => {
  const { temperature, humidity } = req.body;
  
  if (temperature < 10) {
    console.log('Temperature is too low:', temperature);
    sendLowTemperatureEmail(temperature);
  }

  if (temperature > 30) {
    console.log('Temperature is too high:', temperature);
    sendHighTemperatureEmail(temperature);
  }

  try {
    const temperatureHumidityData = new TemperatureHumidity({ temperature, humidity });
    const savedData = await temperatureHumidityData.save();
    console.log('Temperature and humidity data saved:', savedData);
    res.json({ message: 'Temperature and humidity data saved' });
  } catch (error) {
    console.error('Error saving temperature and humidity data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});