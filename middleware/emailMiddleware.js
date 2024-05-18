// Import necessary modules
const User = require('../models/user');
const nodemailer = require("nodemailer");
const DashboardStats = require('../models/dashboardStats');
const Transaction = require('../models/transaction');

const updateReservationStatus = async (req, res, next) => {
    let overdueBooks = 0;
    let pendingFees = 0;

    try {
      // Fetch transactions from the database
      const transactions = await Transaction.find();
      
      await Promise.all(transactions.map(async (transaction) => {
        if (transaction.returnDate < Date.now() && transaction.status != 'Returned') {
          await Transaction.findByIdAndUpdate(
            transaction._id, 
            { 
              $set: { 
                status: 'Overdue',
                fine: 1000 * Math.floor((Date.now() - new Date(transaction.returnDate)) / (1000 * 60 * 60 * 24))
              }
            },
            { new: true },
          );
  
          const user = await User.findById(transaction.userId);
          sendOverdueEmail(user.email, transaction.returnDate);

          overdueBooks += 1;
          pendingFees += transaction.fine;
        }
      }));
        
        const dashboardStats = await DashboardStats.findOne();
        dashboardStats.overdueBooks = overdueBooks;
        dashboardStats.pendingFees = pendingFees;
        await dashboardStats.save();
    } catch (error) {
      console.error('Error processing transactions:', error);
      res.status(500).send('Internal Server Error');
    }
};
  
async function sendOverdueEmail(recipentEmail, returnDate) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", 
        port: 587, 
        secure: false, 
        auth: {
        user: "lattebook.rmit@gmail.com",
        pass: "nehywywzqwmjaxdc",
        },
    });

    // Convert the returnDate to a readable string
    let returnDateString = returnDate.toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });

    let info = await transporter.sendMail({
        from: '"Latte Book" lattebook.rmit@gmail.com',
        to: recipentEmail,
        subject: "Reminder for Overdue Book Return - Latte Book Co.",
        html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #A79277; padding: 30px; background-color: #FFFFFF; border: 2px solid #EAD8C0; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #A79277; border-bottom: 2px solid #D1BB9E; padding-bottom: 15px; text-align: center; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">Greetings,</h1>
        <div style="border: 1px solid #D1BB9E; margin: 20px 0; padding: 20px; border-radius: 5px; background-color: #FFFFFF;">
        <p style="font-size: 18px; line-height: 1.8;">We hope this email finds you well. We noticed that you currently have a book in your possession that was due for return on ${returnDateString}. We kindly request your prompt action in returning the book at your earliest convenience to avoid incurring any late fees.</p>
        <p style="font-size: 18px; line-height: 1.8;">Should you have any inquiries or require further assistance, please do not hesitate to reach out to us. Our dedicated team is here to help you with any questions or concerns you may have.</p>
        <p style="font-size: 18px; line-height: 1.8;">We greatly appreciate your timely attention to this matter and look forward to receiving the book back in our collection soon.</p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 18px; line-height: 1.8;">Warm regards,</p>
        <p style="font-size: 22px; line-height: 1.8; font-weight: bold; color: #A79277;">Latte Book Co.</p>
        </div>
    </div>
        `,
    });

    console.log('Email sent to recipent: ', recipentEmail);
}

module.exports = { updateReservationStatus };