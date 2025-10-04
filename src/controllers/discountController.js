const Discount = require("../models/Discount");

// Get semua diskon
exports.getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.json({
      success: true,
      count: discounts.length,
      data: discounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

// Get diskon by ID
exports.getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Diskon tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

// Cek diskon by code (untuk kasir)
exports.checkDiscountCode = async (req, res) => {
  try {
    const { code } = req.params;
    const discount = await Discount.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Kode diskon tidak valid atau sudah tidak aktif",
      });
    }

    // Cek tanggal berlaku
    const now = new Date();
    if (discount.endDate && now > discount.endDate) {
      return res.status(400).json({
        success: false,
        message: "Kode diskon sudah kadaluarsa",
      });
    }

    if (now < discount.startDate) {
      return res.status(400).json({
        success: false,
        message: "Kode diskon belum berlaku",
      });
    }

    // Cek usage limit
    if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Kode diskon sudah mencapai batas penggunaan",
      });
    }

    res.json({
      success: true,
      data: discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

// Tambah diskon baru (Admin only)
exports.createDiscount = async (req, res) => {
  try {
    const {
      code,
      name,
      type,
      value,
      minPurchase,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
    } = req.body;

    const existingDiscount = await Discount.findOne({
      code: code.toUpperCase(),
    });
    if (existingDiscount) {
      return res.status(400).json({
        success: false,
        message: "Kode diskon sudah digunakan",
      });
    }

    const discount = new Discount({
      code: code.toUpperCase(),
      name,
      type,
      value,
      minPurchase,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
    });

    await discount.save();

    res.status(201).json({
      success: true,
      message: "Diskon berhasil ditambahkan",
      data: discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

// Update diskon (Admin only)
exports.updateDiscount = async (req, res) => {
  try {
    const {
      name,
      type,
      value,
      minPurchase,
      maxDiscount,
      startDate,
      endDate,
      isActive,
      usageLimit,
    } = req.body;

    const discount = await Discount.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        value,
        minPurchase,
        maxDiscount,
        startDate,
        endDate,
        isActive,
        usageLimit,
      },
      { new: true, runValidators: true }
    );

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Diskon tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Diskon berhasil diupdate",
      data: discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

// Hapus diskon (Admin only)
exports.deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Diskon tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Diskon berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};
