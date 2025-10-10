import Order from "../models/Order.js";
import User from "../models/User.js";

export const placeOrder = async (req, res) => {
  try {
    const { cart, subtotal, gst, total, billNumber } = req.body;
    const buyer = req.user._id;

    const order = await Order.create({
      buyer,
      items: cart,
      subtotal,
      gst,
      total,
      billNumber,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Order placement error:", err.message);
    res.status(500).json({ message: "Failed to place order" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};