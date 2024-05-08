const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: [true, 'Name need to be filled'], 
            ref: 'user'},
        bookId: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            required: [true, 'Book need to be filled'], 
            ref: 'book'}],
        status: {
            type: String,
            default: 'Pending',
            enum: ['Reserved', 'Overdue', 'Pending', 'Borrowed', 'Returned'],
        },
        pickUpDate: {
            type: Date
        },
        returnDate: {
            type: Date,
        },
        fine: {
            type: Number,
            required: true,
            default: 0
        },
    },
    {
        timestamps: true,
    }
);

transactionSchema.post('save', async function (doc) {
    const dashboardStats = await DashboardStats.findOne();
  
    // Update pendingFees
    if (doc.status === 'Overdue') {
      dashboardStats.pendingFees += doc.fine;
    }
  
    await dashboardStats.save();

    console.log('Transaction was saved', doc);
    console.log('Dashboard Stats was updated', dashboardStats);
    next();
});

const Transaction = mongoose.model("transaction", transactionSchema);
module.exports = Transaction;