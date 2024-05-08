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

checkinSchema.post('save', async function (doc) {
    const dashboardStats = await DashboardStats.findOne();
    dashboardStats.visitors += 1;
    await dashboardStats.save();
});

const Checkin = mongoose.model('checkin', checkinSchema);
module.exports = Checkin;