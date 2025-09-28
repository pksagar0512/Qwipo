import Product from "../models/Product.js";
import User from "../models/User.js";

// ✅ Add product
export const addProduct = async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const manufacturerId = req.user._id;

    // Get brandName from user
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

    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to add product" });
  }
};

// ✅ Get all products for this manufacturer
export const getProductsByManufacturer = async (req, res) => {
  try {
    const products = await Product.find({ manufacturer: req.user._id });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
