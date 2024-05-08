const mongoose = require('mongoose');

const dashboardStatsSchema = new mongoose.Schema({
  booksBorrowed: { type: Number, default: 0 },
  booksReturned: { type: Number, default: 0 },
  overdueBooks: { type: Number, default: 0 },
  missingBooks: { type: Number, default: 0 },
  totalBooks: { type: Number, default: 0 },
  visitors: { type: Number, default: 0 },
  newMembers: { type: Number, default: 0 },
  pendingFees: { type: Number, default: 0 },
});

const DashboardStats = mongoose.model('DashboardStats', dashboardStatsSchema);

module.exports = DashboardStats;