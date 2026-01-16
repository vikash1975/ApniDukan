import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function cleanupAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const result = await mongoose.connection.collection('admins').deleteMany({});
    console.log('✅ Deleted', result.deletedCount, 'admins from database');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected');
    process.exit(0);
  } catch (err) {
    console.log('❌ Error:', err.message);
    process.exit(1);
  }
}

cleanupAdmins();
