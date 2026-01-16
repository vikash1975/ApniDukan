import Order from '../models/order.js';

// Simulated payment processing
export const processPayment = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;
    const userId = req.user._id;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify order belongs to user
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Simulate payment processing (in real world, integrate Stripe/Razorpay)
    // For now, we'll accept all payments with a random delay
    const paymentSuccessful = Math.random() > 0.1; // 90% success rate for demo

    if (!paymentSuccessful) {
      return res.status(400).json({ 
        message: 'Payment failed. Please try again.',
        transactionId: null 
      });
    }

    // Update order status to paid
    order.status = 'paid';
    order.paymentMethod = paymentMethod;
    order.paymentDate = new Date();
    order.transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await order.save();

    res.status(200).json({
      message: 'Payment successful',
      order,
      transactionId: order.transactionId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json({
      orderId,
      status: order.status,
      paymentMethod: order.paymentMethod || null,
      transactionId: order.transactionId || null,
      totalAmount: order.totalPrice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
