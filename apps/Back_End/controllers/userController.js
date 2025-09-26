import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendOtpSMS } from '../utils/sendOtpSMS.js';
import { sendWhatsAppMessage } from '../utils/sendWhatsApp.js';

// ✅ Step 1: Pre-register user and send OTP via SMS
export const preRegisterUser = async (req, res) => {
  try {
    const { name, email, password, whatsapp } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    // Temporarily store user data in memory (for demo purposes)
    req.app.locals.pendingUser = { name, email, password, whatsapp, otp, otpExpires };

    await sendOtpSMS(whatsapp, otp);

    res.json({ message: 'OTP sent. Please verify to complete registration.' });
  } catch (error) {
    console.error('❌ Pre-registration error:', error.message);
    res.status(500).json({ message: 'Server error during pre-registration' });
  }
};

// ✅ Step 2: Verify OTP and create user + send WhatsApp welcome
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const pending = req.app.locals.pendingUser;

    if (!pending || pending.email !== email) {
      return res.status(400).json({ message: 'No pending registration found' });
    }

    if (pending.otp !== otp || Date.now() > pending.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      whatsapp: pending.whatsapp,
    });

    await sendWhatsAppMessage(user.whatsapp, user.name);

    req.app.locals.pendingUser = null;

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      token: generateToken(user._id),
      message: 'OTP verified. Registration complete. Welcome to Qwipo!',
    });
  } catch (error) {
    console.error('❌ OTP verification error:', error.message);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

// ✅ Login user
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp,
        token: generateToken(user._id),
        message: `Welcome back, ${user.name}!`,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};