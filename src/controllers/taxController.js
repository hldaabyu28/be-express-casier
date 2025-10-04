const Tax = require("../models/Tax");

// Get semua pajak
exports.getAllTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find();
    res.json({
      success: true,
      count: taxes.length,
      data: taxes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

// Get pajak default
exports.getDefaultTax = async (req, res) => {
  try {
    const tax = await Tax.findOne({ isDefault: true, isActive: true });

    if (!tax) {
      return res.status(404).json({
        success: false,
        message: "Pajak default tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: tax,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

// Tambah pajak baru (Admin only)
exports.createTax = async (req, res) => {
  try {
    const { name, percentage, description, isDefault } = req.body;

    // Jika set sebagai default, unset yang lain
    if (isDefault) {
      await Tax.updateMany({}, { isDefault: false });
    }

    const tax = new Tax({
      name,
      percentage,
      description,
      isDefault,
    });

    await tax.save();

    res.status(201).json({
      success: true,
      message: "Pajak berhasil ditambahkan",
      data: tax,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

// Update pajak (Admin only)
exports.updateTax = async (req, res) => {
  try {
    const { name, percentage, description, isActive, isDefault } = req.body;

    // Jika set sebagai default, unset yang lain
    if (isDefault) {
      await Tax.updateMany({}, { isDefault: false });
    }

    const tax = await Tax.findByIdAndUpdate(
      req.params.id,
      { name, percentage, description, isActive, isDefault },
      { new: true, runValidators: true }
    );

    if (!tax) {
      return res.status(404).json({
        success: false,
        message: "Pajak tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Pajak berhasil diupdate",
      data: tax,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

// Hapus pajak (Admin only)
exports.deleteTax = async (req, res) => {
  try {
    const tax = await Tax.findByIdAndDelete(req.params.id);

    if (!tax) {
      return res.status(404).json({
        success: false,
        message: "Pajak tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Pajak berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};
