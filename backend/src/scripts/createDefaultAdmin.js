import mongoose from 'mongoose';
import User from '../models/User.js';
import { upsertStreamUser } from '../lib/stream.js';
import dotenv from 'dotenv';

dotenv.config();

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@streamnet.com' });
    if (existingAdmin) {
      console.log('Default admin already exists');
      process.exit(0);
    }

    // Create default admin
    const adminData = {
      email: 'admin@streamnet.com',
      fullName: 'StreamNET Administrator',
      password: 'Amit@4321',
      profilePic: 'https://avatar.iran.liara.run/public/1.png',
      isAdmin: true,
      isMasterAdmin: true,
      isOnboarded: true,
      nativeLanguage: 'English',
      learningLanguage: 'Spanish',
      location: 'Global',
      bio: 'StreamNET Master Administrator',
    };

    const newAdmin = await User.create(adminData);

    // Create Stream user for admin
    try {
      await upsertStreamUser({
        id: newAdmin._id.toString(),
        name: newAdmin.fullName,
        image: newAdmin.profilePic || "",
      });
      console.log(`Stream admin user created for ${newAdmin.fullName}`);
    } catch (error) {
      console.log("Error creating Stream admin user:", error);
    }

    console.log('Master admin created successfully!');
    console.log('Email: admin@streamnet.com');
    console.log('Password: Amit@4321');
    console.log('Role: Master Administrator');
    console.log('Admin Secret Key: StreamNET_Admin_Secret_2025_Secure_Key_$#@!');

  } catch (error) {
    console.error('Error creating default admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createDefaultAdmin();
