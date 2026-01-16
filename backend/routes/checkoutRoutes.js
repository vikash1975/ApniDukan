import express from "express";
import {
  checkout,
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/checkoutController.js";
import { userAuth } from "../middleware/userAuth.js";
import { adminAuth } from "../middleware/adminAuth.js";

const checkoutRoutes = express.Router();

// Admin routes - require admin authentication (place these BEFORE dynamic routes)
checkoutRoutes.get("/admin/all", adminAuth, getAllOrders);
checkoutRoutes.put("/:orderId/status", adminAuth, updateOrderStatus);
checkoutRoutes.put("/:orderId/cancel", adminAuth, cancelOrder);

// User routes - require user authentication
checkoutRoutes.post("/", userAuth, checkout);
checkoutRoutes.get("/", userAuth, getUserOrders);
checkoutRoutes.get("/:orderId", userAuth, getOrderById);

export default checkoutRoutes;
