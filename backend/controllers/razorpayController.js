import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.js";
import Product from "../models/adminProducts.js";
import Cart from "../models/cart.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ================= CREATE RAZORPAY ORDER ================= */
export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Amount in paise (Razorpay uses paise)
    const amountInPaise = Math.round(amount * 100);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: userId,
      },
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: amount,
      currency: "INR",
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res
      .status(500)
      .json({ message: "Failed to create Razorpay order", error: error.message });
  }
};

/* ================= VERIFY RAZORPAY PAYMENT & CREATE ORDER ================= */
export const verifyAndCreateOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, shippingAddress } = req.body;

    // Verify signature
    const sign = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpaySignature !== expectedSign) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Get cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Verify stock for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (!product || product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${item.productId.name}` });
      }
    }

    // Calculate total price
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order with payment details
    const order = await Order.create({
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
      shippingAddress,
      status: "paid",
      paymentMethod: "razorpay",
      transactionId: razorpayPaymentId,
      paymentDate: new Date(),
    });

    // Decrement stock for all items
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.productId._id,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    // Clear cart
    await Cart.findByIdAndUpdate(cart._id, { items: [] });

    res.json({
      success: true,
      order,
      message: "Order placed successfully!",
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res
      .status(500)
      .json({ message: "Payment verification failed", error: error.message });
  }
};

/* ================= HANDLE PAYMENT FAILURE ================= */
export const handlePaymentFailure = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, reason } = req.body;

    console.error(`Payment failed for order ${razorpayOrderId}: ${reason}`);

    res.json({
      success: false,
      message: "Payment failed. Please try again.",
      reason,
    });
  } catch (error) {
    console.error("Payment failure handler error:", error);
    res.status(500).json({ message: "Error handling payment failure" });
  }
};

/* ================= GET RAZORPAY KEY ID ================= */
export const getRazorpayKey = async (req, res) => {
  try {
    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error fetching Razorpay key:", error);
    res.status(500).json({ message: "Error fetching Razorpay key" });
  }
};
