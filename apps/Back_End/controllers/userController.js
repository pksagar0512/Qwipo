import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    whatsapp,
    role,
    brandName,
    brandLogo,
    gstNumber,
    category,
    retailerType,
  } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      whatsapp,
      role,
      brandName: role === "manufacturer" ? brandName : undefined,
      brandLogo: role === "manufacturer" ? brandLogo : undefined,
      gstNumber: role === "manufacturer" ? gstNumber : undefined,
      category: role === "manufacturer" ? category : undefined,
      retailerType: role === "retailer" ? retailerType : undefined,
      isVerified: true,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      role: user.role,
      brandName: user.brandName,
      brandLogo: user.brandLogo,
      category: user.category,
      retailerType: user.retailerType,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      role: user.role,
      brandName: user.brandName,
      brandLogo: user.brandLogo,
      category: user.category,
      retailerType: user.retailerType,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
};
