import Cart from "../models/cart.js";
import Product from "../models/adminProducts.js";

/* ================= GET CART ================= */
export const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= ADD TO CART ================= */
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity required" });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check stock

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({ message: "Added to cart", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= REMOVE FROM CART ================= */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({ message: "Removed from cart", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE CART QUANTITY ================= */
export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    // Verify product stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    item.quantity = quantity;
    item.price = product.price;

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= CLEAR CART ================= */
export const clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    console.error('Clear cart error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
