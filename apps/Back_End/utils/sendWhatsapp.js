import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

/**
 * Send a WhatsApp message to a given number.
 * @param {string} number - Must be in +91XXXXXXXXXX format.
 * @param {string} message - The message to send.
 */
export const sendWhatsappMessage = async (number, message) => {
  if (!number.startsWith('+91') || number.length !== 13) {
    throw new Error('Invalid mobile number format. Use +91XXXXXXXXXX');
  }

  try {
    const response = await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio sandbox number
      to: `whatsapp:${number}`,
      body: message,
    });

    console.log('✅ WhatsApp message sent:', response.sid);
    return response.sid;
  } catch (error) {
    console.error('❌ WhatsApp error:', error.message);
    throw error;
  }
};