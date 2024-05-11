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

    // If dashboardStats is null, create a new document
    if (!dashboardStats) {
      dashboardStats = new DashboardStats();
    }

    dashboardStats.visitors += 1;

    try {
      await dashboardStats.save();
    } catch (err) {
      console.error('Error saving Dashboard Stats', err);
    }
});

const Checkin = mongoose.model('checkin', checkinSchema);
module.exports = Checkin;