const Product = require('../models/Product');

// Get semua produk
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error server',
      error: error.message 
    });
  }
};

// Get produk by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Produk tidak ditemukan' 
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error server',
      error: error.message 
    });
  }
};

// Tambah produk baru
// src/controllers/productController.js
exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, description } = req.body;
    const image = req.file ? req.file.path : null; // URL Cloudinary

    const product = new Product({
      name,
      price,
      stock,
      description,
      image
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error server',
      error: error.message 
    });
  }
};

// Update produk
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, stock, description } = req.body;
    const updateData = { name, price, stock, description };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Produk tidak ditemukan' 
      });
    }

    res.json({
      success: true,
      message: 'Produk berhasil diupdate',
      data: product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error server',
      error: error.message 
    });
  }
};

// Hapus produk
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Produk tidak ditemukan' 
      });
    }

    res.json({
      success: true,
      message: 'Produk berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error server',
      error: error.message 
    });
  }
};
