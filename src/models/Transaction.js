const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  subtotal: {
    type: Number,
    required: true,
  },
  //   relasi dengan model Discount
  discount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Discount",
    default: null,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  //   relasi dengan model Tax
  tax: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tax",
    default: null,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  //   relasi dengan model User
  cashier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
