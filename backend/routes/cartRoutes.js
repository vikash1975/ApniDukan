import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "../controllers/cartController.js";
import { userAuth } from "../middleware/userAuth.js";

const cartRoutes = express.Router();

// All cart routes require user authentication
cartRoutes.get("/", userAuth, getCart);
cartRoutes.post("/add", userAuth, addToCart);
cartRoutes.delete("/:productId", userAuth, removeFromCart);
cartRoutes.put("/:productId", userAuth, updateCartQuantity);
cartRoutes.delete("/", userAuth, clearCart);

export default cartRoutes;
