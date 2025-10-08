import express from "express";
import {
  sendOtpToUser,
  verifyOtpAndRegister,
  authUserWithoutOtp,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/pre-register", sendOtpToUser);           
router.post("/verify-otp", verifyOtpAndRegister);      
router.post("/direct-login", authUserWithoutOtp);      

export default router;