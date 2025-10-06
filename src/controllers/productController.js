const Product = require("../models/Product");
const Category = require("../models/Category");

// Get semua produk
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    await Product.populate(products, { path: "category", select: "name" });
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
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
        message: "Produk tidak ditemukan",
      });
    }

    await Product.populate(product, { path: "category", select: "name" });

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

// Tambah produk baru
exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, description, categoryId } = req.body;
    const image = req.file ? req.file.path : null; // URL Cloudinary

    const product = new Product({
      name,
      price,
      stock,
      category: categoryId,
      description,
      image,
    });

    await product.save();

    await product.populate("category", "name");

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

// Update produk
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, stock, description, categoryId } = req.body;
    const updateData = {
      name,
      price,
      stock,
      description,
      categoryId,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Produk berhasil diupdate",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

// Hapus produk
// Import cloudinary di bagian atas file

exports.deleteProduct = async (req, res) => {
  try {
    // Cari produk dulu sebelum dihapus
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    // Hapus gambar dari Cloudinary jika ada
    if (product.image) {
      try {
        // Ekstrak public_id dari URL Cloudinary
        // Format URL: https://res.cloudinary.com/[cloud_name]/image/upload/v[version]/[public_id].[format]
        const urlParts = product.image.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const publicId = fileName.split(".")[0]; // Ambil nama file tanpa extension

        // Atau jika Anda menyimpan folder di Cloudinary:
        // const publicId = 'products/' + fileName.split('.')[0];

        await cloudinary.uploader.destroy(publicId);
        console.log(`Image deleted from Cloudinary: ${publicId}`);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // Lanjutkan hapus produk meskipun gagal hapus gambar
        // Atau bisa return error jika gambar harus dihapus:
        return res.status(500).json({
          success: false,
          message: "Gagal menghapus gambar dari Cloudinary",
        });
      }
    }

    // Hapus produk dari database
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Produk dan gambar berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};
