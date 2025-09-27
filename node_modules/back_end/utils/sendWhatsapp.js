import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export const sendWhatsAppMessage = async (number, name) => {
  const message = `Hi ${name || 'there'}, welcome to Qwipo! You're now subscribed to product alerts.`;

  try {
    const response = await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio sandbox number
      to: `whatsapp:${number}`,       // Recipient number in WhatsApp format
      body: message,
    });

    console.log('✅ WhatsApp message sent:', response.sid);
    return response.sid;
  } catch (error) {
    console.error('❌ WhatsApp error:', error.message);
    throw error;
  }
};