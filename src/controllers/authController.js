const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register user baru
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validasi input
    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Username, password, dan role wajib diisi",
      });
    }

    // Cek username sudah ada
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username sudah digunakan",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = new User({
      username,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User berhasil dibuat",
      data: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi",
      });
    }

    // Cari user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }

    // Buat token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login berhasil",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};


// logout (hanya untuk klien, token dihapus di sisi klien)
exports.logout = (req, res) => {
  res.json({
    success: true,
    message: "Logout berhasil di sisi klien. Hapus token di aplikasi klien.",
  });
};
