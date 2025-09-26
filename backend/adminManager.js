const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const adminManager = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campuscare');
    console.log('Connected to MongoDB');

    const action = process.argv[2];
    const email = process.argv[3];
    const password = process.argv[4];

    switch (action) {
      case 'create':
        if (!email || !password) {
          console.log('Usage: node adminManager.js create <email> <password>');
          return;
        }
        await createAdmin(email, password);
        break;
      
      case 'update':
        if (!email || !password) {
          console.log('Usage: node adminManager.js update <email> <password>');
          return;
        }
        await updateAdmin(email, password);
        break;
      
      case 'list':
        await listAdmins();
        break;
      
      case 'delete':
        if (!email) {
          console.log('Usage: node adminManager.js delete <email>');
          return;
        }
        await deleteAdmin(email);
        break;
      
      default:
        console.log('Admin Manager - Available commands:');
        console.log('  create <email> <password>  - Create new admin user');
        console.log('  update <email> <password>  - Update admin password');
        console.log('  list                       - List all admin users');
        console.log('  delete <email>             - Delete admin user');
        console.log('');
        console.log('Examples:');
        console.log('  node adminManager.js create admin@famt.ac.in admin123');
        console.log('  node adminManager.js update admin@famt.ac.in newpassword');
        console.log('  node adminManager.js list');
        console.log('  node adminManager.js delete admin@famt.ac.in');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

const createAdmin = async (email, password) => {
  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    console.log(`Admin user with email ${email} already exists`);
    return;
  }

  const admin = new User({
    email,
    password,
    role: 'admin'
  });

  await admin.save();
  console.log(`Admin user created successfully:`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Role: admin`);
};

const updateAdmin = async (email, password) => {
  const admin = await User.findOne({ email, role: 'admin' });
  if (!admin) {
    console.log(`Admin user with email ${email} not found`);
    return;
  }

  admin.password = password;
  await admin.save();
  console.log(`Admin user updated successfully:`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Role: admin`);
};

const listAdmins = async () => {
  const admins = await User.find({ role: 'admin' }, 'email createdAt');
  console.log('Admin users:');
  if (admins.length === 0) {
    console.log('No admin users found');
  } else {
    admins.forEach(admin => {
      console.log(`- ${admin.email} (Created: ${admin.createdAt || 'Unknown'})`);
    });
  }
};

const deleteAdmin = async (email) => {
  const admin = await User.findOne({ email, role: 'admin' });
  if (!admin) {
    console.log(`Admin user with email ${email} not found`);
    return;
  }

  await User.deleteOne({ email, role: 'admin' });
  console.log(`Admin user ${email} deleted successfully`);
};

adminManager();
