import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendOtpSMS } from "../utils/sendOtpSMS.js";

const otpStore = new Map();

export const sendOtpToUser = async (req, res) => {
  const { email, whatsapp } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore.set(email, { otp, userData: req.body });

    await sendOtpSMS(whatsapp, otp);
    res.status(200).json({ message: "OTP sent via SMS", otpSent: true });
  } catch (err) {
    console.error("OTP send error:", err.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtpAndRegister = async (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore.get(email);

  if (!stored || parseInt(otp) !== stored.otp) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  const {
    name,
    password,
    whatsapp,
    role,
    brandName,
    gstNumber,
    category,
    retailerType,
  } = stored.userData;

  try {
    const user = await User.create({
      name,
      email,
      password,
      whatsapp,
      role,
      brandName: role === "manufacturer" ? brandName : undefined,
      gstNumber: role === "manufacturer" ? gstNumber : undefined,
      category: role === "manufacturer" ? category : undefined,
      retailerType: role === "retailer" ? retailerType : undefined,
      isVerified: true,
    });

    otpStore.delete(email);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      role: user.role,
      brandName: user.brandName,
      category: user.category,
      retailerType: user.retailerType,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const authUserWithoutOtp = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "User not verified. Complete OTP first." });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      role: user.role,
      brandName: user.brandName,
      category: user.category,
      retailerType: user.retailerType,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
};