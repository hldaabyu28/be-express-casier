const Category = require("../models/Category");


exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json({
      success: true,
        message: "Kategori berhasil ditambahkan",
        data: category,
    });
    } catch (error) {
    res.status(500).json({
        success: false,
        message: "Error server",
        error: error.message,
    });
    }
};


// Get semua kategori
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
        message: "Error server",
        error: error.message,
    });
  }
};