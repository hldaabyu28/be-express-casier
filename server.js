require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const taxRoutes = require('./src/routes/taxRoutes');
const discountRoutes = require('./src/routes/discountRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Koneksi database
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Kasir berjalan',
    version: '1.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/taxes', taxRoutes);
app.use('/api/discounts', discountRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: err.message || 'Terjadi kesalahan server'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Endpoint tidak ditemukan' 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});