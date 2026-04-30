import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    const existingAdmin = await Admin.findOne({ email: 'admin@portfolio.com' });
    if (existingAdmin) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    const newAdmin = new Admin({
      email: 'admin@portfolio.com',
      password: 'admin1234' // This will be hashed by the pre-save middleware in the model
    });

    await newAdmin.save();
    console.log('Admin account created successfully!');
    console.log('Email: admin@portfolio.com');
    console.log('Password: admin1234');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedAdmin();
