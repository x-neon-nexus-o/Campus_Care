const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const updateAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campuscare');
    console.log('Connected to MongoDB');

    // Find and update admin user
    const admin = await User.findOne({ email: 'admin@famt.ac.in' });
    if (admin) {
      // Update password to admin@123
      admin.password = 'admin@123';
      await admin.save();
      console.log('Admin user updated successfully:');
      console.log('Email: admin@famt.ac.in');
      console.log('Password: admin@123');
      console.log('Role: admin');
    } else {
      // Create new admin user if it doesn't exist
      const newAdmin = new User({
        email: 'admin@famt.ac.in',
        password: 'admin@123',
        role: 'admin'
      });
      await newAdmin.save();
      console.log('Admin user created successfully:');
      console.log('Email: admin@famt.ac.in');
      console.log('Password: admin@123');
      console.log('Role: admin');
    }

  } catch (error) {
    console.error('Error updating admin:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

updateAdmin();
