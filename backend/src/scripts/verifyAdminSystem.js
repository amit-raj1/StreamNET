import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const verifyAdminSystem = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check master admin
    const masterAdmin = await User.findOne({ isMasterAdmin: true });
    if (masterAdmin) {
      console.log('✅ Master Admin found:');
      console.log(`   📧 Email: ${masterAdmin.email}`);
      console.log(`   👤 Name: ${masterAdmin.fullName}`);
      console.log(`   👑 Master Admin: ${masterAdmin.isMasterAdmin}`);
      console.log(`   🛡️  Regular Admin: ${masterAdmin.isAdmin}`);
    } else {
      console.log('❌ No Master Admin found!');
    }

    // Check all admins
    const allAdmins = await User.find({ isAdmin: true });
    console.log(`\n📊 Total Admin Accounts: ${allAdmins.length}`);
    
    allAdmins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.fullName} (${admin.email}) - ${admin.isMasterAdmin ? 'Master' : 'Regular'} Admin`);
    });

    // Security summary
    console.log('\n🔐 Security Status:');
    console.log(`   🔑 Admin Secret Key configured: ${process.env.ADMIN_SECRET_KEY ? 'YES' : 'NO'}`);
    console.log(`   👑 Master Admin exists: ${masterAdmin ? 'YES' : 'NO'}`);
    console.log(`   🛡️  Protection level: ${masterAdmin ? 'HIGH (Master Admin required for new admins)' : 'LOW (No master admin)'}`);

  } catch (error) {
    console.error('❌ Error verifying admin system:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

verifyAdminSystem();
