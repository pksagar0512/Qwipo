import Order from "../models/Purchase.js";

export const placeOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to place order" });
  }
};