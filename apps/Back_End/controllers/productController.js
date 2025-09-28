import Product from "../models/Product.js";
import User from "../models/User.js";
import { sendWhatsappMessage } from "../utils/sendWhatsapp.js"; // ✅ matches your file name

export const addProduct = async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const manufacturerId = req.user._id;

    // Get brandName and category from manufacturer
    const user = await User.findById(manufacturerId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.create({
      name,
      price,
      image,
      category: user.category,
      brand: user.brandName,
      manufacturer: manufacturerId,
    });

    // 🔔 Notify retailers in the same category
    const retailers = await User.find({ role: "retailer", retailerType: user.category });
    const message = `🆕 New product "${name}" added under brand "${user.brandName}". Check it out now!`;

    retailers.forEach(retailer => {
      if (retailer.whatsapp) {
        if (retailer.whatsapp === "+918951060512") {
          // ✅ Send only to your own number
          sendWhatsappMessage(retailer.whatsapp, message)
            .then(() => console.log("✅ WhatsApp sent to:", retailer.whatsapp))
            .catch(err => console.error("❌ WhatsApp failed:", err.message));
        } else {
          // 🧪 Simulate for others
          console.log(`🧪 Simulated WhatsApp to ${retailer.whatsapp}: ${message}`);
        }
      }
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Product creation error:", err.message);
    res.status(500).json({ message: "Failed to add product" });
  }
};

export const getProductsByManufacturer = async (req, res) => {
  try {
    const products = await Product.find({ manufacturer: req.user._id });
    res.json(products);
  } catch (err) {
    console.error("❌ Fetch products error:", err.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};