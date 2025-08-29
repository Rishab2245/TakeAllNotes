const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  dateOfBirth: {
    type: Date,
    required: function() {
      return this.provider === 'email';
    },
    validate: {
      validator: function(value) {
        // Skip validation if date is not provided (for Google auth)
        if (!value && this.provider === 'google') return true;
        
        // Check if user is at least 13 years old
        const thirteenYearsAgo = new Date();
        thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);
        return value <= thirteenYearsAgo;
      },
      message: 'You must be at least 13 years old to register'
    }
  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'email';
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  provider: {
    type: String,
    enum: ['email', 'google'],
    default: 'email'
  },
  googleId: {
    type: String,
    sparse: true // Allow multiple null values
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get user without password
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verificationToken;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpire;
  return user;
};

module.exports = mongoose.model('User', userSchema);

