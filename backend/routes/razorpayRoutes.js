import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import {
  createRazorpayOrder,
  verifyAndCreateOrder,
  handlePaymentFailure,
  getRazorpayKey,
} from "../controllers/razorpayController.js";

const router = express.Router();

// Get Razorpay Key ID
router.get("/key", getRazorpayKey);

// Create Razorpay order (before actual payment)
router.post("/create-order", userAuth, createRazorpayOrder);

// Verify payment and create order in DB
router.post("/verify-payment", userAuth, verifyAndCreateOrder);

// Handle payment failure
router.post("/payment-failure", userAuth, handlePaymentFailure);

export default router;
