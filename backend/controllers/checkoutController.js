import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/adminProducts.js";

/* ================= CREATE ORDER (CHECKOUT) ================= */
export const checkout = async (req, res) => {
  try {
    const userId = req.userId;
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address required" });
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

    // Create order
    const order = await Order.create({
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
      shippingAddress,
      status: "pending",
    });

    // Reduce product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error('Checkout error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET USER ORDERS ================= */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Get orders error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ORDER BY ID ================= */
export const getOrderById = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify order belongs to user
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Get order by ID error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

/* ================= CANCEL ORDER (Admin Only) ================= */
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: "cancelled" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    res.status(200).json({ message: "Order cancelled", order });
  } catch (error) {
    console.error('Cancel order error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE ORDER STATUS (Admin Only) ================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error('Update order status error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ORDERS (Admin Only) ================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Get all orders error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
