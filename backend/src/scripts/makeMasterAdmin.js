import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const makeMasterAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find and update the admin@streamnet.com user to be master admin
    const admin = await User.findOneAndUpdate(
      { email: 'admin@streamnet.com' },
      { 
        isMasterAdmin: true,
        isAdmin: true 
      },
      { new: true }
    );

    if (admin) {
      console.log('✅ Master admin updated successfully!');
      console.log(`   👤 Name: ${admin.fullName}`);
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   👑 Master Admin: ${admin.isMasterAdmin}`);
      console.log(`   🛡️ Admin: ${admin.isAdmin}`);
    } else {
      console.log('❌ Admin user not found with email: admin@streamnet.com');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error updating master admin:', error);
    process.exit(1);
  }
};

makeMasterAdmin();
