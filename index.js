// Importing required modules
const cron = require('node-cron');
const express = require('express');
const { OpenAI } = require("openai");
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Importing models
const Book = require('./models/book');
const User = require('./models/user');
const Review = require('./models/review');
const Author = require('./models/author');
const Category = require('./models/category');
const Publisher = require('./models/publisher');
const Transaction = require('./models/transaction');
const DashboardStats = require('./models/dashboardStats');

// Importing routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const profileRoutes = require('./routes/profileRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Importing middleware
const { updateReservationStatus } = require('./middleware/emailMiddleware');
const { requireAuth, checkUser, isAdmin } = require('./middleware/authMiddleware');
const TemperatureHumidity = require('./models/temperatureHumidity');

// Initializing express app
const app = express();
const port = 3000;
const openai = new OpenAI({ apiKey: "sk-proj-DY9awujayyspaSzeCMVRT3BlbkFJMFujWBBJZkFcgnO2pXHA" });

// Setting up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Variables for book of the day feature
let selectedBook;
let selectedDate;

// Checking user for all routes
app.get('*', checkUser);

// Setting up session
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      maxAge: 60 * 60 * 24 * 24 * 7,
      secure: false 
    },
  })
);

// Setting up routes
app.use(authRoutes);
app.use(bookRoutes);
app.use(profileRoutes);
app.use(reviewRoutes);
app.use(reservationRoutes);

// Database Connection
const mongoURI = 'mongodb+srv://hmyle:mjWS3$-2FvgUwNU@iotlibrary.tdjdpmt.mongodb.net/librarysystem';

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');

    // Check if a DashboardStats document exists
    const existingDashboardStats = await DashboardStats.findOne();

    if (!existingDashboardStats) {
      // If no DashboardStats document exists, create a new one
      const newDashboardStats = new DashboardStats();
      await newDashboardStats.save();
      console.log('DashboardStats document created and saved');
    } else {
      console.log('DashboardStats document already exists');
    }
  })
  .catch((error) => console.log(error.message));

// Schedule a job to run at 00:00 every day
cron.schedule('* * * * *', async function() {
  console.log("Running scheduled job...");
  // Update reservation status by day and send emails to users with overdue books
  updateReservationStatus();

  const dashboardStats = await DashboardStats.findOne();

  // If dashboardStats is null, create a new document
  if (!dashboardStats) {
    dashboardStats = new DashboardStats();
  }

  dashboardStats.visitors = 0;

  try {
    await dashboardStats.save();
  } catch (err) {
    console.error('Error resetting visitors', err);
  }

  console.log("Scheduled job completed");
});

// Route for all types of users
app.get('/', checkUser, async (req,res) => {
  try {
    // Fetch all authors, categories, and publishers from the database
    const authors = await Author.find();
    const categories = await Category.find();
    const publishers = await Publisher.find();
  
    // Fetch all books and populate their author, category, and publisher fields
    let books = await Book.find().populate('author').populate('category').populate('publisher');

    let newArrivals = await Book.find().sort({ createdAt: -1 }).limit(5).populate('author').populate('category').populate('publisher');
  
    // Get the total count of books
    const count = await Book.countDocuments();
  
    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().slice(0,10);
  
    // If there is no selected book or the selected date is not the current date
    if (!selectedBook || selectedDate !== currentDate) {
      // Generate a random number within the range of the total book count
      const random = Math.floor(Math.random() * count);
  
      // Select a random book and set it as the selected book
      selectedBook = await Book.findOne().skip(random);
  
      // Set the selected date as the current date
      selectedDate = currentDate;
    }
  
    // Fetch the latest 5 reviews
    const reviews = await Review.find().limit(5);
  
    // Map over the reviews to fetch the user who made each review
    const reviewsWithUser = await Promise.all(reviews.map(async (review) => {
      const user = await User.findById(review.userId);
      return {
        ...review._doc,
        reviewedUser: user
      };
    }));
  
    // Render the home page with the fetched data
    res.render('home', { books, newArrivals, authors, categories, publishers, bookoftheday: selectedBook, reviews: reviewsWithUser });
  
  } catch (err) {
    // Log any error that occurs and redirect to the home page
    console.error(err);
    res.redirect('/');
  }
}); 

// My Account page
app.get('/management', requireAuth, checkUser, isAdmin, async (req, res) => {
  try {
    let dashboardStats = await DashboardStats.findOne();

    // Get the user from res.locals
    let user = res.locals.user;
  
    // Fetch all authors and publishers from the database
    const authors = await Author.find();
    const publishers = await Publisher.find();

    let overdueTransactions = await Transaction.find({ status: 'Overdue' });

    // Fetch user and book details for overdue transactions
    const overdueTransactionsWithDetails = await Promise.all(
      overdueTransactions.map(async (transaction) => {
        const user = await User.findById(transaction.userId).exec();
        const book = await Book.findById(transaction.bookId).exec();

        const userName = user ? user.fullName : 'User not found';
        const bookTitle = book ? book.title : 'Book not found';

        return {
          _id: transaction._id,
          userName: userName,
          bookTitle: bookTitle,
          status: transaction.status,
          pickUpDate: transaction.pickUpDate,
          returnDate: transaction.returnDate,
          fine: transaction.fine,
        };
      })
    );

    console.log(overdueTransactionsWithDetails);
  
    // Fetch the user's favorite books and populate their author and category details
    let books = await Book.find();

    // Fetch the user's details and populate their active and previous transactions
    const userDetails = await User.findById(user._id)
      .populate('activeTransactions')
      .populate('prevTransactions')
      .exec();
  
    // If the user details are not found, return a 404 error
    if (!userDetails) {
      console.error('User not found:', userDetails._id);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  
    // Fetch all transactions
    const transactions = await Transaction.find();
  
    // Update the status and fine of overdue transactions
    await Promise.all(transactions.map(async (transaction) => {
      if ((transaction.returnDate < Date.now() && transaction.status == 'Reserved') || (transaction.returnDate < Date.now() && transaction.status == 'Overdue')) {
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
      }
    }));
  
    // Fetch the book details for each of the user's active transactions
    const allActiveTransactions = await Promise.all(
      userDetails.activeTransactions.map(async (transaction) => {
        const book = await getBookById(transaction.bookId);
        return {
          bookTitle: book.title,
          status: transaction.status,
          pickUpDate: transaction.pickUpDate,
          returnDate: transaction.returnDate,
          fine: transaction.fine,
        };
      })
    );
  
    // Fetch the book details for each of the user's previous transactions
    const allPrevTransactions = await Promise.all(
      userDetails.prevTransactions.map(async (transaction) => {
        const book = await getBookById(transaction.bookId);
        return {
          bookTitle: book.title,
          status: transaction.status,
          pickUpDate: transaction.pickUpDate,
          returnDate: transaction.returnDate,
          fine: transaction.fine,
        };
      })
    );
  
    // Fetch the user and book details for each transaction
    const transactionsWithDetails = await Promise.all(
      transactions.map(async (transaction) => {
        const user = await User.findById(transaction.userId).exec();
        const book = await Book.findById(transaction.bookId).exec();
  
        const userEmail = user ? user.email : 'User not found';
        const bookTitle = book ? book.title : 'Book not found';
  
        return {
          _id: transaction._id,
          userEmail: userEmail,
          bookTitle: bookTitle,
          status: transaction.status,
          pickUpDate: transaction.pickUpDate,
          returnDate: transaction.returnDate,
          fine: transaction.fine,
        };
      })
    );

    const users = await User.find();

    // Render the management page with the fetched data
    res.render('management', { dashboardStats, overdueTransactions: overdueTransactionsWithDetails, user: user, books: books, allActiveTransactions, allPrevTransactions, transactions: transactionsWithDetails, authors, publishers , users});
  
  } catch (error) {
    // Log any error that occurs and return a 500 error
    console.error('Error processing transactions:', error);
    res.status(500).send('Internal Server Error');
  }
}); 

app.get('/tempData', async (req, res) => {
  const tempData = await TemperatureHumidity.findOne().sort({createdAt: -1});
  res.json({temp: parseFloat(tempData.temperature.toFixed(1)), hum: parseFloat(tempData.humidity.toFixed(1))});
});

app.get('/recommendation', checkUser, requireAuth, (req, res) => {
res.render('recommendation');
});

app.post("/recommend", checkUser, requireAuth, async (req, res) => {
try {
  const userInput = req.body.input;
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are helpful in recommending books." },
      { role: "user", content: userInput + "\\n list out all books" },
    ],
    model: "gpt-3.5-turbo",
  });
  console.log(completion);

  const recommendedBooks = completion.choices[0].message.content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '' && line.includes('"'))
    .map(line => line.split('"')[1].trim());
  console.log(recommendedBooks);

  let foundBooks = [];
  for (const bookTitle of recommendedBooks) {
    let book = await Book.findOne({ title: bookTitle }).populate('author').populate('category');
    if (book) {
      foundBooks.push(book);
    }
  }

  console.log(foundBooks);

  res.render('recommendationResult', { query: userInput, books: foundBooks });
} catch (error) {
  console.error(error);
  res.status(500).send(`An error occurred while processing your request.`);
}
});

// app.get('/api/visitorData', async (req, res) => {
//   try {
//     const visitorData = await Checkin.aggregate([
//       {
//         $group: {
//           _id: { $dayOfWeek: '$createdAt' },
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           dayOfWeek: {
//             $arrayElemAt: [
//               ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//               '$_id'
//             ]
//           },
//           count: 1
//         }
//       },
//       {
//         $sort: { dayOfWeek: 1 }
//       }
//     ]);

//     res.json(visitorData);
//   } catch (error) {
//     console.error('Error retrieving visitor data:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.get('/api/visitorData', async (req, res) => {
  try {
    const visitorData = [
      { dayOfWeek: 'Mon', count: 10 },
      { dayOfWeek: 'Tue', count: 20 },
      { dayOfWeek: 'Wed', count: 15 },
      { dayOfWeek: 'Thu', count: 25 },
      { dayOfWeek: 'Fri', count: 30 },
      { dayOfWeek: 'Sat', count: 40 },
      { dayOfWeek: 'Sun', count: 35 }
    ];
    res.json(visitorData);
  } catch (error) {
    console.error('Error retrieving visitor data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
