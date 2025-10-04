const User = require('../models/User');

// Get semua user
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error server',
      error: error.message 
    });
  }
};

// Hapus user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User tidak ditemukan' 
      });
    }

    res.json({
      success: true,
      message: 'User berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error server',
      error: error.message 
    });
  }
};