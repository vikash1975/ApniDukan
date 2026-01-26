
import dotenv from "dotenv";
dotenv.config(); 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import adminProductRoutes from './routes/adminProductRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import filteredRoutes from './routes/filteredRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import razorpayRoutes from './routes/razorpayRoutes.js';
import cloudinary from "./config/cloudinary.js";

const app=express();

// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:5173',           // Local development
    'http://localhost:3000',           // Local development
    'https://apnidukan.netlify.app',   // Production (update with your actual URL)
    'https://apnidukan.vercel.app',    // Alternative frontend URL
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/product", adminProductRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product", filteredRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", checkoutRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/razorpay", razorpayRoutes);


 mongoose.connect(process.env.MONGO_URI)
 .then(()=>console.log("MongoDB is connected"))
 .catch((err)=>console.log(err));

app.get("/test", (req, res) => {
  res.json({ message: "SERVER WORKING" });
});

// Health check endpoint for monitoring
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "ApniDukan API is running",
    uptime: process.uptime()
  });
});

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
 

 const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
