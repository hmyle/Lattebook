const mongoose = require('mongoose');
const DashboardStats = require('./dashboardStats');

const bookSchema = new mongoose.Schema(
  {
    ISBN: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      require: true,
    },
    bookImage: {
      type: String,
      default: "https://i.ibb.co/K05xQk1/book7.png",
      require: true,
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'publisher'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'author'
    },
    numberOfPages: {
      type: Number,
      required: true,
    },
    bookCountAvailable: {
      type: Number,
      require: true,
    },
    bookStatus: {
      type: String,
      default: "Available",
      enum: ['Available', 'Borrowed'],
    },
    category:
    {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
    transactions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "transaction",
      },
    ],
    description: {
      type: String
    },
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        stars: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
      }
    ],
    totalStars: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('reviews')) {
    const lastReview = this.reviews[this.reviews.length - 1];
    if (lastReview) {
      this.totalStars += lastReview.stars;
      this.totalReviews += 1;
      this.rate = this.totalStars / this.totalReviews;
    } else {
      this.totalStars = 0;
      this.totalReviews = 0;
      this.rate = 0;
    }

    // Update number of books
    let dashboardStats = DashboardStats.findOne();
    dashboardStats.totalReviews += 1;
    
    try {
      await dashboardStats.save();
      console.log('Dashboard Stats was updated', dashboardStats);
    } catch (err) {
      console.error('Error saving Dashboard Stats', err);
    }
  }
  next();
});

bookSchema.post('save', async (doc, next) => {
  if (doc.isNew) {
    // If the book is new, increment the totalBooks count
    const dashboardStats = await DashboardStats.findOne();
    dashboardStats.totalBooks += 1;
    await dashboardStats.save();
  }
  console.log('Book was created & saved', doc);
  console.log('Dashboard stats updated');

  next();
});

bookSchema.post('updateOne', async (doc, next) => {
  const dashboardStats = await DashboardStats.findOne();
  if (doc.updatedFields.bookStatus === 'Borrowed') {
    dashboardStats.booksBorrowed += 1;
    dashboardStats.booksReturned -= 1;
  } else if (doc.updatedFields.bookStatus === 'Available') {
    dashboardStats.booksBorrowed -= 1;
    dashboardStats.booksReturned += 1;
  }
  await dashboardStats.save();

  console.log('Book was created & saved', doc);
  console.log('Dashboard stats updated');

  next();
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;