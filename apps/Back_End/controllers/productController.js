import Product from "../models/Product.js";
import User from "../models/User.js";
import { sendWhatsappMessage } from "../utils/sendWhatsapp.js";

export const addProduct = async (req, res) => {
  try {
    const { name, price, image, colors, sizes, description } = req.body;
    const manufacturerId = req.user._id;

    const user = await User.findById(manufacturerId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.create({
      name,
      price,
      image,
      colors,
      sizes,
      description,
      category: user.category,
      brand: user.brandName,
      manufacturer: manufacturerId,
      brandLogo: user.brandLogo || "", // optional: store logo reference on product too
    });

    const retailers = await User.find({ role: "retailer", category: user.category });
    const message = `🆕 New product "${name}" added under brand "${user.brandName}". Check it out now!`;

    retailers.forEach(retailer => {
      if (retailer.whatsapp) {
        if (retailer.whatsapp === "+918951060512") {
          sendWhatsappMessage(retailer.whatsapp, message)
            .then(() => console.log("WhatsApp sent to:", retailer.whatsapp))
            .catch(err => console.error("WhatsApp failed:", err.message));
        } else {
          console.log(`🧪 Simulated WhatsApp to ${retailer.whatsapp}: ${message}`);
        }
      }
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Product creation error:", err.message);
    res.status(500).json({ message: "Failed to add product" });
  }
};

export const getProductsByManufacturer = async (req, res) => {
  try {
    const products = await Product.find({ manufacturer: req.user._id });
    res.json(products);
  } catch (err) {
    console.error("Fetch products error:", err.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductsByRetailerCategory = async (req, res) => {
  try {
    const retailer = await User.findById(req.user._id);
    if (!retailer || retailer.role !== "retailer") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Use 'category' field on retailer to fetch matching manufacturers
    const manufacturers = await User.find({
      role: "manufacturer",
      category: retailer.category,
    });

    const brandNames = manufacturers.map(m => m.brandName);

    const products = await Product.find({
      brand: { $in: brandNames },
    });

    res.json(products);
  } catch (err) {
    console.error("Retailer product fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// NEW: get brands (manufacturers) by category — returns brandName and brandLogo
export const getBrandsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const brands = await User.find(
      { role: "manufacturer", category },
      "brandName brandLogo category"
    ).sort({ brandName: 1 });

    res.json(brands);
  } catch (err) {
    console.error("Fetch brands error:", err.message);
    res.status(500).json({ message: "Failed to fetch brands" });
  }
};
