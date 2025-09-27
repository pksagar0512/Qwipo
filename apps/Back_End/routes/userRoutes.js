import express from 'express';
import {
  preRegisterUser,
  verifyOtp,
  authUser,
  verifyLoginOtp
} from '../controllers/userController.js';

const router = express.Router();

// Registration flow
router.post('/pre-register', preRegisterUser); // Step 1: Send OTP
router.post('/verify-otp', verifyOtp);         // Step 2: Verify OTP & create user

// Login flow
router.post('/login', authUser);               // Step 1: Verify credentials & send OTP
router.post('/verify-login-otp', verifyLoginOtp); // Step 2: Verify OTP & complete login

export default router;