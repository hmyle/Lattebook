const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection URI
const mongoUri = 'mongodb+srv://hmyle:C6lrHMWYYDO2K5Bz@cluster0.sujlcna.mongodb.net/isys2101?retryWrites=true&w=majority';

// Collection name
const collectionName = 'uid_data';

app.use(bodyParser.json());

app.post('/api/uid', (req, res) => {
  const uidData = req.body;

  mongodb.MongoClient.connect(mongoUri, (err, client) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const db = client.db();
    const collection = db.collection(collectionName);

    collection.insertOne(uidData, (err, result) => {
      if (err) {
        console.error('Error inserting UID data:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log('UID data inserted successfully');
        res.status(200).json({ message: 'UID data received and stored' });
      }

      client.close();
    });
  });
});

app.get('/test', (req, res) => {
    res.send('Server is reachable');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});