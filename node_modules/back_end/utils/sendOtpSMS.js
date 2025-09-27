import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export const sendOtpSMS = async (number, otp) => {
  try {
    await client.messages.create({
      body: `Your Qwipo OTP is ${otp}. It expires in 5 minutes.`,
      from: process.env.TWILIO_SMS_NUMBER,
      to: `+91${number}`,
    });
    console.log(`✅ OTP SMS sent to ${number}`);
  } catch (err) {
    console.error('❌ SMS error:', err.message);
  }
};