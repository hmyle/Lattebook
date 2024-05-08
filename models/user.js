const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userType: {
        type: String,
        enum: ['Manager','Reader'],
        require: true
    },
    fullName: {
        type: String,
        require: [true, 'Please enter your full name']
    },
    profileImage: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
        require: true
    },
    email: {
        type: String,
        require: [true, 'Please enter your email'],
        max: 50,
        unique: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        require: [true, 'Please enter your password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    totalBookCheckedOut: {
        type: Number,
        default: 0,
    },
    points: {
        type: Number,
        default: 0
    },
    activeTransactions: [{
        type: mongoose.Types.ObjectId,
        ref: "transaction"
    }],
    prevTransactions: [{
        type: mongoose.Types.ObjectId,
        ref: "transaction"
    }],
    favoriteBook: [{
        type: mongoose.Types.ObjectId,
        ref: "book",
    }],
    isAdmin: {
        type: Boolean,
        default: false
    },
    theme: {
        type: String,
        enum: ['default', 'dark', 'light'],
        require: true,
        default: 'default',
    },
},
    {
        timestamps: true
});

userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  /* Salting and Hashing the Password */
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.post('save', async function (doc, next) {
    if (doc.isNew) {
      // If the user is new, increment the newMembers count
      const dashboardStats = await DashboardStats.findOne();
      dashboardStats.newMembers += 1;
      await dashboardStats.save();
    }
    
    console.log('New User was created & saved', doc);
    next();
});

// User method
userSchema.statics.login = async function(email, password) {
    // Find user and validate
    const user = await this.findOne({ email });

    if (user) {
        const validPass = await bcrypt.compare(password, user.password);
        if (validPass) {
            return user;
        } 
        throw Error ('Incorrect password');
    }
    throw Error('Incorrect email');
    
};

userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

// Define a model based on the schema
const User = mongoose.model('User', userSchema);

// the module exports the "Product" model so that it can be used by other parts of the application.
module.exports = User;