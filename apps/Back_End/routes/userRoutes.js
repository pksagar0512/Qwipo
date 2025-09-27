import express from "express";
import {
  sendOtpToUser,
  verifyOtpAndRegister,
  authUserWithoutOtp,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/pre-register", sendOtpToUser);           // Step 1: Send OTP
router.post("/verify-otp", verifyOtpAndRegister);      // Step 2: Verify and create user
router.post("/direct-login", authUserWithoutOtp);      // Step 3: Login

export default router;