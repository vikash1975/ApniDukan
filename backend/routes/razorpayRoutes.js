import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import {
  createRazorpayOrder,
  verifyAndCreateOrder,
  handlePaymentFailure,
  getRazorpayKey,
} from "../controllers/razorpayController.js";

const router = express.Router();

router.post("/create-order", userAuth, createRazorpayOrder);
router.post("/verify", userAuth, verifyAndCreateOrder);
router.post("/failure", userAuth, handlePaymentFailure);
router.get("/key", getRazorpayKey);

export default router;