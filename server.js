if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");

// Import routes
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const discountRoutes = require("./src/routes/discountRoutes");
const taxRoutes = require("./src/routes/taxRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Koneksi database
connectDB();

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "API Kasir berjalan",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/debug/env", (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    HAS_MONGODB_URI: !!process.env.MONGODB_URI,
    HAS_JWT_SECRET: !!process.env.JWT_SECRET,
    MONGODB_URI_LENGTH: process.env.MONGODB_URI?.length || 0,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/taxes", taxRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Terjadi kesalahan server",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
  });
});

// Start server (hanya untuk local development)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
}

// Export untuk Vercel
module.exports = app;
