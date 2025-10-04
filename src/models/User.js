const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username wajib diisi'],
    unique: true,
    trim: true,
    minlength: [3, 'Username minimal 3 karakter']
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi'],
    minlength: [6, 'Password minimal 6 karakter']
  },
  role: {
    type: String,
    enum: ['admin', 'kasir'],
    required: true,
    default: 'kasir'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);