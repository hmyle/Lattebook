const mongoose = require('mongoose');
const Category = require('./category'); // adjust the path as needed

mongoose.connect('mongodb+srv://hmyle:mjWS3$-2FvgUwNU@iotlibrary.tdjdpmt.mongodb.net/librarysystem', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection Open!")
    })
    .catch(err => {
        console.log("Mongo Connection ERROR: ")
        console.log(err)
    })

const seedCategories = [
    { name: 'Fiction' },
    { name: 'Non-fiction' },
    { name: 'Science' },
    { name: 'Biography' },
    { name: 'History' },
    // add more categories as needed
];

Category.insertMany(seedCategories)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })