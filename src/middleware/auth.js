const jwt = require('jsonwebtoken');

// Middleware untuk verifikasi token JWT
const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Akses ditolak. Token tidak ditemukan' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Token tidak valid atau sudah kadaluarsa' 
    });
  }
};

// Middleware khusus admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Akses ditolak. Hanya admin yang diizinkan' 
    });
  }
  next();
};

module.exports = { authMiddleware, adminOnly };