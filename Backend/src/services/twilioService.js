const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const client = twilio(accountSid, authToken);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const formatPhoneNumber = (phoneNumber) => {
  // Remove any non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // If already starts with +, return as is (assume it's already in international format)
  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  // If it's a 10-digit number, assume it's Indian (prepend +91)
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  // If it's already 12 digits (like 919876543210), prepend +
  if (cleaned.length === 12) {
    return `+${cleaned}`;
  }

  // For other formats, just prepend +
  return `+${cleaned}`;
};

const sendOTP = async (phoneNumber) => {
  try {
    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials (ACCOUNT_SID, AUTH_TOKEN) not configured');
    }

    if (!messagingServiceSid && !twilioPhone) {
      throw new Error('Either TWILIO_MESSAGING_SERVICE_SID or TWILIO_PHONE_NUMBER must be configured');
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Validate phone format (must start with + and have at least 11 digits total)
    if (!/^\+\d{10,}$/.test(formattedPhone)) {
      throw new Error(`Invalid phone format. Expected international format like +919876543210. Got: ${formattedPhone}`);
    }

    const otp = generateOTP();
    
    const messageParams = {
      body: `Your kalaqx OTP is: ${otp}. Valid for 5 minutes. Do not share with anyone.`,
      to: formattedPhone,
    };

    // Use Messaging Service if available (preferred), otherwise use phone number
    if (messagingServiceSid) {
      messageParams.messagingServiceSid = messagingServiceSid;
    } else {
      messageParams.from = twilioPhone;
    }

    await client.messages.create(messageParams);

    return otp;
  } catch (err) {
    console.error('Error sending OTP:', err.message);
    throw err;
  }
};

module.exports = {
  sendOTP,
  generateOTP,
};
