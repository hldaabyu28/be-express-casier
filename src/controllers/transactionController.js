const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const Discount = require('../models/Discount');
const Tax = require('../models/Tax');

// Buat transaksi baru
exports.createTransaction = async (req, res) => {
  try {
    const { items, discountCode, taxId } = req.body;
    // items: [{productId, quantity}]
    // discountCode: kode diskon (opsional)
    // taxId: ID pajak yang dipilih (opsional, jika tidak ada ambil default)

    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Items transaksi tidak boleh kosong' 
      });
    }

    let subtotal = 0;
    const transactionItems = [];

    // Proses setiap item
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: `Produk dengan ID ${item.productId} tidak ditemukan` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false,
          message: `Stok ${product.name} tidak cukup. Tersisa: ${product.stock}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      transactionItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

      // Kurangi stok produk
      product.stock -= item.quantity;
      await product.save();
    }

    // === PROSES DISKON ===
    let discount = null;
    let discountAmount = 0;

    if (discountCode) {
      discount = await Discount.findOne({ 
        code: discountCode.toUpperCase(),
        isActive: true
      });

      if (!discount) {
        return res.status(404).json({ 
          success: false,
          message: 'Kode diskon tidak valid' 
        });
      }

      // Validasi tanggal
      const now = new Date();
      if (discount.endDate && now > discount.endDate) {
        return res.status(400).json({ 
          success: false,
          message: 'Kode diskon sudah kadaluarsa' 
        });
      }

      if (now < discount.startDate) {
        return res.status(400).json({ 
          success: false,
          message: 'Kode diskon belum berlaku' 
        });
      }

      // Validasi usage limit
      if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
        return res.status(400).json({ 
          success: false,
          message: 'Kode diskon sudah mencapai batas penggunaan' 
        });
      }

      // Validasi minimum purchase
      if (subtotal < discount.minPurchase) {
        return res.status(400).json({ 
          success: false,
          message: `Minimum pembelian untuk diskon ini adalah Rp ${discount.minPurchase}` 
        });
      }

      // Hitung diskon
      if (discount.type === 'percent') {
        discountAmount = (subtotal * discount.value) / 100;
        // Cek max discount
        if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
          discountAmount = discount.maxDiscount;
        }
      } else {
        discountAmount = discount.value;
      }

      // Update usage count
      discount.usageCount += 1;
      await discount.save();
    }

    // Hitung setelah diskon
    const afterDiscount = subtotal - discountAmount;

    // === PROSES PAJAK ===
    let tax = null;
    let taxAmount = 0;

    if (taxId) {
      tax = await Tax.findOne({ _id: taxId, isActive: true });
    } else {
      // Ambil pajak default
      tax = await Tax.findOne({ isDefault: true, isActive: true });
    }

    if (tax) {
      taxAmount = (afterDiscount * tax.percentage) / 100;
    }

    // Total akhir
    const total = afterDiscount + taxAmount;

    // Buat transaksi
    const transaction = new Transaction({
      items: transactionItems,
      subtotal: subtotal,
      discount: discount ? discount._id : null,
      discountAmount: discountAmount,
      tax: tax ? tax._id : null,
      taxAmount: taxAmount,
      total: total,
      cashier: req.user.userId
    });

    await transaction.save();

    // Populate data untuk response
    await transaction.populate([
      { path: 'items.product', select: 'name price' },
      { path: 'cashier', select: 'username' },
      { path: 'discount' },
      { path: 'tax' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil',
      data: transaction
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error server',
      error: error.message 
    });
  }
};

// Get semua transaksi
exports.getAllTransactions = async (req, res) => {
  try {
    const query = req.user.role === 'admin' 
      ? {} 
      : { cashier: req.user.userId };

    const transactions = await Transaction.find(query)
      .populate('items.product', 'name')
      .populate('cashier', 'username')
      .populate('discount')
      .populate('tax')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error server',
      error: error.message 
    });
  }
};

// Get transaksi by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('items.product')
      .populate('cashier', 'username')
      .populate('discount')
      .populate('tax');

    if (!transaction) {
      return res.status(404).json({ 
        success: false,
        message: 'Transaksi tidak ditemukan' 
      });
    }

    if (req.user.role === 'kasir' && 
        transaction.cashier._id.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Akses ditolak' 
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error server',
      error: error.message 
    });
  }
};