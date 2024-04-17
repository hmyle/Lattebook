const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
    uid: {
        type: String,
        require: true
    }
},
    {
        timestamps: true
});

const Checkin = mongoose.model('Uid', uidSchema);
module.exports = Checkin;