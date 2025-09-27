import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

/**
 * Sends OTP via SMS using Twilio
 * @param {string} number - Mobile number in +91XXXXXXXXXX format
 * @param {number} otp - The OTP to send
 */
export const sendOtpSMS = async (number, otp) => {
  if (!/^\+91\d{10}$/.test(number)) {
    throw new Error('Invalid mobile number. Use +91XXXXXXXXXX format');
  }

  try {
    await client.messages.create({
      body: `Your Qwipo OTP is ${otp}. It expires in 5 minutes.`,
      from: process.env.TWILIO_SMS_NUMBER,
      to: number,
    });

    console.log(`✅ OTP SMS sent to ${number}`);
  } catch (err) {
    console.error('❌ SMS error:', err.message);
    throw err;
  }
};