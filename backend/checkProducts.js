import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/adminProducts.js';

dotenv.config();

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const products = await Product.find();
    console.log(`✅ Found ${products.length} products`);
    
    if (products.length > 0) {
      console.log('\n📦 First Product:');
      console.log(JSON.stringify(products[0], null, 2));
    } else {
      console.log('❌ No products found in database');
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.log('❌ Error:', err.message);
    process.exit(1);
  }
}

checkProducts();
