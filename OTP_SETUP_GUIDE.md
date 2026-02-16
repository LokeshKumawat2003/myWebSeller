# OTP Login & Registration Setup Guide

This guide explains how to set up OTP (One-Time Password) based authentication using Twilio for your web application.

## Features
- Mobile number based OTP login
- Mobile number based OTP registration
- 6-digit OTP sent via SMS using Twilio
- OTP expiry after 5 minutes
- Maximum 5 verification attempts per OTP
- Secure OTP storage in MongoDB
- Automatic OTP cleanup after expiry

## Setup Steps

### 1. Get Twilio Credentials

1. Go to [Twilio Console](https://www.twilio.com/console)
2. Sign up or log in to your Twilio account
3. In the Dashboard, find your:
   - **Account SID** - This is your account identifier
   - **Auth Token** - This is your account password
   - **Phone Number** - A Twilio number to send SMS from (usually provided upon signup or purchase)

### 2. Update Backend Configuration

Add the following environment variables to your `.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number
```

**For India (recommended for Indian users):**
- Country Code: +91
- Example: `+919876543210`

**For US:**
- Country Code: +1
- Example: `+11234567890`

### 3. Database Schema

The backend automatically creates an OTP collection in MongoDB with the following structure:

```javascript
{
  phone: String,           // User's phone number (unique per OTP)
  otp: String,            // 6-digit OTP
  email: String,          // User's email (for registration)
  name: String,           // User's name (for registration)
  expiresAt: Date,        // OTP expiry time (5 minutes from creation)
  attempts: Number,       // Number of verification attempts (max 5)
  verified: Boolean,      // Whether OTP is verified
  type: String,           // 'login' or 'register'
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Update timestamp
}
```

### 4. Available Endpoints

#### Send OTP for Registration
```
POST /auth/otp/send-register
Content-Type: application/json

{
  "phone": "9876543210",     // 10-digit Indian number or full international format
  "name": "John Doe",         // Optional but recommended
  "email": "john@example.com" // Optional but recommended
}

Response:
{
  "message": "OTP sent successfully",
  "phone": "9876543210"
}
```

#### Send OTP for Login
```
POST /auth/otp/send-login
Content-Type: application/json

{
  "phone": "9876543210"  // Must be a registered phone number
}

Response:
{
  "message": "OTP sent successfully",
  "phone": "9876543210"
}
```

#### Verify OTP for Registration
```
POST /auth/otp/verify-register
Content-Type: application/json

{
  "phone": "9876543210",
  "otp": "123456",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"  // Optional for social login users
}

Response:
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "user"
  }
}
```

#### Verify OTP for Login
```
POST /auth/otp/verify-login
Content-Type: application/json

{
  "phone": "9876543210",
  "otp": "123456"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "user"
  }
}
```

### 5. Frontend Integration

The OTP login page is available at `/otp-login` route. To add it to your router:

```jsx
// In your App.jsx or routing configuration
import OTPLoginPage from './MainWeb/pages/OTPLoginPage';

// Add route
<Route path="/otp-login" element={<OTPLoginPage />} />
```

### 6. Error Handling

Common error responses:

| Error | Cause | Solution |
|-------|-------|----------|
| Phone number already registered | Used during signup | Use login instead |
| Phone number not registered | Used during login | Register first |
| OTP expired or not found | OTP was not sent or expired | Request a new OTP |
| OTP has expired | More than 5 minutes passed | Request a new OTP |
| Invalid OTP | Wrong code entered | Check the SMS and try again |
| Maximum OTP attempts exceeded | Entered wrong OTP 5 times | Request a new OTP |

### 7. Testing

You can test the OTP feature using Postman or any HTTP client:

```bash
# 1. Send OTP for registration
curl -X POST http://localhost:5000/auth/otp/send-register \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","name":"Test User","email":"test@example.com"}'

# 2. Verify OTP for registration (use OTP from SMS)
curl -X POST http://localhost:5000/auth/otp/verify-register \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","otp":"123456","name":"Test User","email":"test@example.com","password":"password123"}'
```

### 8. Security Best Practices

1. **Use HTTPS** - Always use HTTPS in production
2. **Validate Phone Numbers** - Implement proper phone number validation on frontend
3. **Rate Limiting** - Consider adding rate limiting to prevent OTP spam
4. **Token Storage** - Store JWT tokens securely (use httpOnly cookies if possible)
5. **OTP Delivery** - Twilio will handle SMS delivery, but ensure your Twilio account is verified
6. **Monitor Usage** - Check Twilio dashboard for any abuse

### 9. Troubleshooting

#### OTP not being sent?
1. Check Twilio Account SID and Auth Token in `.env`
2. Verify you have enough credits in your Twilio account
3. Check that TWILIO_PHONE_NUMBER is a valid Twilio number
4. For Indian numbers, ensure proper country code (+91)

#### OTP working but slow delivery?
1. This is normal for SMS delivery (usually 1-5 seconds)
2. Check Twilio dashboard for delivery status
3. May be slower during high SMS volume periods

#### User created but can't login?
1. Ensure the same phone number is used for both registration and login
2. Check the OTP verification response message
3. Verify user was created in MongoDB

### 10. Frontend Implementation Details

The OTP login page includes:
- **Two-step flow**: Phone number → OTP verification
- **Auto-validation**: Automatically formats phone numbers and limits OTP to 6 digits
- **Resend Timer**: 60-second timer before allowing OTP resend
- **Clear Error Messages**: Displays specific error messages for debugging
- **Loading States**: Shows feedback during API calls
- **Password Optional**: For registration, password is optional (can be used for social logins)

## API Response Codes

| Status | Code | Meaning |
|--------|------|---------|
| Success | 200 | OTP sent or login successful |
| Created | 201 | User registered successfully |
| Bad Request | 400 | Missing fields, invalid data, or OTP errors |
| Server Error | 500 | Server-side error |

## Next Steps

1. Deploy Twilio service in production
2. Configure rate limiting for OTP endpoints
3. Add SMS templates for better branding
4. Implement OTP analytics
5. Set up monitoring for OTP delivery failures

## Support

For Twilio-related issues:
- [Twilio Documentation](https://www.twilio.com/docs)
- [Twilio Support](https://www.twilio.com/help/contact)

For application-related issues:
- Check backend logs with `npm run dev`
- Verify MongoDB connections
- Check Firebase/Cloudinary configurations if used
