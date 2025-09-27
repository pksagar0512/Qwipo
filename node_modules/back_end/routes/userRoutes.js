import express from 'express';
import { preRegisterUser, verifyOtp, authUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/pre-register', preRegisterUser); // Step 1
router.post('/verify-otp', verifyOtp);         // Step 2
router.post('/login', authUser);               // Login

export default router;