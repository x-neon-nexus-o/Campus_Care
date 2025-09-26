const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Hydrate user with latest role/department
    const user = await User.findById(decoded.id).select('role department email');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = {
      id: decoded.id,
      _id: decoded.id,
      role: user.role,
      department: user.department,
      email: user.email,
    };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token'});
  }
};