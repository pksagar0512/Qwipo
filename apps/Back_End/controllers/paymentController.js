import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js"; // adjust path/name if different
import User from "../models/User.js";
import PDFDocument from "pdfkit";
import path from "path";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body; // amount in rupees
    if (!amount) return res.status(400).json({ message: "Amount required" });

    const options = {
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1, // auto-capture
    };

    const order = await razorpay.orders.create(options);
    res.json({ order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("createRazorpayOrder error:", err);
    res.status(500).json({ message: "Failed to create razorpay order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart, subtotal, gst, total, billNumber } = req.body;
    // verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // create order in DB
    const buyer = req.user?._id;
    const orderDoc = await Order.create({
      buyer,
      items: cart,
      subtotal,
      gst,
      total,
      billNumber,
      paymentStatus: "paid",
      paymentProvider: "razorpay",
      paymentIntentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      paidAt: new Date(),
    });

    res.json({ message: "Payment verified and order saved", order: orderDoc });
  } catch (err) {
    console.error("verifyPayment error:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

// optional webhook endpoint (recommended) — also verifies signature
export const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];
  const payload = req.rawBody; // we need raw body for webhook verification

  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  if (expected !== signature) {
    return res.status(400).send("Invalid webhook signature");
  }

  const event = req.body;
  // handle payment captured event
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    // you may find order by payment.order_id and update DB accordingly
    await Order.findOneAndUpdate({ razorpayOrderId: payment.order_id }, { paymentStatus: "paid", paymentIntentId: payment.id, paidAt: new Date() });
  }
  res.json({ ok: true });
};

// invoice generation
export const downloadInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("buyer", "name whatsapp email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${order.billNumber || order._id}.pdf`);

    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice No: ${order.billNumber || order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.text(`Buyer: ${order.buyer?.name || ""}`);
    doc.text(`Email/Whatsapp: ${order.buyer?.email || order.buyer?.whatsapp || ""}`);
    doc.moveDown();

    doc.fontSize(14).text("Items:");
    order.items.forEach((it, idx) => {
      doc.fontSize(12).text(`${idx + 1}. ${it.name} | ${it.selectedColor || ""} | ${it.selectedSize || ""} | Qty: ${it.quantity} | ₹${it.price}`);
    });
    doc.moveDown();
    doc.fontSize(12).text(`Subtotal: ₹${order.subtotal.toFixed(2)}`);
    doc.text(`GST: ₹${order.gst.toFixed(2)}`);
    doc.fontSize(14).text(`Total: ₹${order.total.toFixed(2)}`);
    doc.moveDown();
    doc.fontSize(10).text("Paid to: Your Platform Name");
    doc.end();
    doc.pipe(res);
  } catch (err) {
    console.error("downloadInvoice error:", err);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};
