const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'faculty', 'head', 'admin'], 
    default: 'student' 
  },
  department: { 
    type: String, 
    enum: [
      'IT Department', 
      'Maintenance', 
      'Security', 
      'Mess', 
      'Hostel', 
      'Library', 
      'Sports', 
      'Transport', 
      'Finance', 
      'Academic',
      'General'
    ],
    default: 'General'
  },
  name: { type: String },
  studentId: { type: String },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  resetToken: String,
  resetTokenExpiry: Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add method to check if user can access department
userSchema.methods.canAccessDepartment = function(department) {
  if (this.role === 'admin') return true;
  if (this.role === 'head' && this.department === department) return true;
  if (this.role === 'faculty' && this.department === department) return true;
  return false;
};

module.exports = mongoose.model('User', userSchema);