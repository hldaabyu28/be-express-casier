const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['percent', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usageCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Discount', discountSchema);