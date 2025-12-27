# Nari Swasthya Samuday - Authentication Flow Implementation Guide

## 🌸 Overview
This document provides a comprehensive guide for implementing the authentication and account creation system for Nari Swasthya Samuday, designed specifically for women's safety, privacy, and user experience in both Indian and global markets.

---

## 🎨 Design Theme
- **Primary Color**: Rose Pink (#E91E63)
- **Accent Colors**: #FF4081, #FF80AB, #FFB6C1
- **Background**: Gradient from #FFF5F7 to #FFFFFF
- **Focus**: Women-centric, safe, welcoming, and trustworthy

---

## 📱 Complete Authentication Flow

### Screen 1: Splash/Welcome Screen
**Purpose**: First impression, brand introduction
**Elements**:
- App logo with rose pink gradient background
- App name: "Nari Swasthya Samuday"
- Tagline: "Your Trusted Women's Health Community"
- Two action buttons:
  - "Get Started" (Primary - White with pink text)
  - "Sign In" (Secondary - Transparent with white text)

**Key Features**:
- Beautiful gradient background (#E91E63 → #FF4081 → #FF80AB)
- Decorative circles for visual appeal
- Clear call-to-action

---

### Screen 2: Region Selection
**Purpose**: Customize experience based on user location
**Elements**:
- Two region cards:
  1. **India** 🇮🇳
     - Phone number + OTP (Primary)
     - Regional language support
     - Aadhaar verification (optional)
  
  2. **Global** 🌍
     - Email or phone signup
     - Multi-language support
     - International standards

**Implementation Notes**:
- Selected card shows pink border
- Each card displays relevant features
- Sets user flow for subsequent screens

---

### Screen 3: Sign Up - India (Phone-Based)
**Purpose**: Primary signup method for Indian users
**Elements**:
- Progress bar (33% filled)
- Phone number input with country code dropdown (+91 fixed)
- Email input (Optional but Recommended)
- Privacy checkboxes:
  - Keep my location private
  - Hide my real name in community

**Technical Implementation**:
```javascript
{
  region: "india",
  primary_auth: "phone",
  phone_number: "+91XXXXXXXXXX",
  email: "optional@example.com",
  privacy_settings: {
    location_private: true,
    name_hidden: true
  }
}
```

**Security Features**:
- SMS OTP verification required
- Email for account recovery
- Privacy-first approach

---

### Screen 4: Sign Up - Global (Email/Phone Options)
**Purpose**: Flexible signup for international users
**Elements**:
- Tab switcher: Email | Phone
- Email input (Primary for email tab)
- Phone number with international country codes
- Same privacy options

**Technical Implementation**:
```javascript
{
  region: "global",
  primary_auth: "email", // or "phone"
  email: "user@example.com",
  phone_number: "+1XXXXXXXXXX", // optional
  privacy_settings: {
    location_private: true,
    display_name_only: true
  }
}
```

**Country Codes Supported**:
- 🇺🇸 +1 (US/Canada)
- 🇬🇧 +44 (UK)
- 🇦🇺 +61 (Australia)
- 🇮🇳 +91 (India)
- And more...

---

### Screen 5: OTP Verification
**Purpose**: Verify phone number or email
**Elements**:
- Progress bar (66% filled)
- Large phone/email icon illustration
- 6-digit OTP input fields
- Resend OTP button with countdown timer
- Masked contact display (e.g., +91 98765 ***10)

**Technical Implementation**:
```javascript
// OTP Generation
{
  otp_code: "XXXXXX", // 6 digits
  sent_to: "+91987654XXXX",
  expires_in: 300, // 5 minutes
  attempts_remaining: 3
}

// Verification
{
  otp_entered: "123456",
  verified: true,
  verified_at: "2024-01-15T10:30:00Z"
}
```

**Security Features**:
- Auto-focus next input field
- 5-minute expiration
- Maximum 3 attempts
- Resend after 45 seconds
- SMS gateway: Use services like Twilio, MSG91, or AWS SNS

---

### Screen 6: Profile Setup
**Purpose**: Create user profile with privacy options
**Elements**:
- Progress bar (100% filled)
- Avatar upload with camera icon
- Display Name / Alias (Required)
- Full Name (Optional - for clinical use only)
- Date of Birth
- Privacy notice explaining alias vs real name

**Technical Implementation**:
```javascript
{
  user_profile: {
    display_name: "RoseBloom23", // Public alias
    full_name: null, // Optional, only for doctor consultations
    date_of_birth: "1990-01-15",
    avatar_url: "https://cdn.example.com/avatars/user123.jpg",
    privacy_mode: "alias" // or "full_name"
  }
}
```

**Privacy-First Approach**:
- Display name is mandatory
- Real name is optional
- Clear separation: Community vs Clinical
- Users can update anytime in settings

---

### Screen 7: Password/PIN Setup
**Purpose**: Secure account with password or PIN
**Elements**:
- Tab switcher: Password | 4-Digit PIN
- Password input with show/hide toggle
- Confirm password field
- Real-time password strength indicator
- Security tips checklist

**Technical Implementation**:
```javascript
// Password Option
{
  auth_type: "password",
  password_hash: "bcrypt_hashed_password",
  strength: "strong", // weak, medium, strong
  requires_update: false
}

// PIN Option
{
  auth_type: "pin",
  pin_hash: "bcrypt_hashed_pin",
  pin_length: 4,
  requires_device_lock: true
}
```

**Password Requirements**:
- Minimum 8 characters
- Uppercase + lowercase letters
- At least one number
- Special characters recommended

**Security Best Practices**:
- Use bcrypt or Argon2 for hashing
- Store only hashes, never plaintext
- Implement rate limiting
- Force update for weak passwords

---

### Screen 8: Sign In
**Purpose**: Return user authentication
**Elements**:
- Tab switcher: Phone | Email
- Contact input (phone/email)
- Password input
- "Forgot Password?" link
- "Sign In with OTP" button (passwordless option)
- Link to sign up

**Technical Implementation**:
```javascript
// Password-based sign in
{
  identifier: "+919876543210", // or email
  password: "user_entered_password",
  device_id: "unique_device_identifier",
  fcm_token: "firebase_cloud_messaging_token"
}

// OTP-based sign in (passwordless)
{
  identifier: "+919876543210",
  otp_requested: true,
  otp_sent_at: "2024-01-15T10:30:00Z"
}
```

**Multi-Factor Authentication (MFA)**:
- Trigger OTP for:
  - New device login
  - Password reset
  - Sensitive actions (profile changes)
  - Suspicious activity detected

---

### Screen 9: Account Recovery
**Purpose**: Help users regain account access
**Elements**:
- Two recovery options:
  1. Via Phone Number (sends SMS OTP)
  2. Via Email (sends recovery link)
- Masked contact display
- Security notice about MFA

**Technical Implementation**:
```javascript
// Recovery Request
{
  recovery_method: "phone", // or "email"
  identifier: "+919876543210",
  recovery_token: "secure_random_token",
  expires_in: 900, // 15 minutes
  created_at: "2024-01-15T10:30:00Z"
}

// Password Reset
{
  recovery_token: "token_from_email_or_sms",
  new_password_hash: "bcrypt_hashed_new_password",
  reset_at: "2024-01-15T10:45:00Z",
  invalidate_all_sessions: true
}
```

**Security Features**:
- Short-lived recovery tokens (15 minutes)
- One-time use tokens
- Invalidate all existing sessions on reset
- Send notification to all registered contacts

---

### Screen 10: Success State
**Purpose**: Confirm successful account creation
**Elements**:
- Green gradient background (#4CAF50 → #00E676)
- Large checkmark icon
- "Account Created!" message
- Welcome text
- "Start Exploring" button

**Post-Registration Actions**:
1. Send welcome email/SMS
2. Log user in automatically
3. Track registration completion
4. Start onboarding tutorial (optional)

---

## 🔐 Security Implementation Details

### 1. Phone Number + OTP (Primary for India)
**SMS Gateway Integration**:
```javascript
// Example using Twilio
const twilio = require('twilio');
const client = twilio(accountSid, authToken);

async function sendOTP(phoneNumber, otp) {
  return await client.messages.create({
    body: `Your Nari Swasthya Samuday verification code is: ${otp}. Valid for 5 minutes.`,
    from: '+1234567890',
    to: phoneNumber
  });
}
```

**Alternative Providers for India**:
- MSG91 (Indian provider)
- Kaleyra
- AWS SNS
- Firebase Phone Auth

### 2. Email Verification
```javascript
// Email verification with token
const nodemailer = require('nodemailer');

async function sendVerificationEmail(email, token) {
  const verificationLink = `https://app.example.com/verify?token=${token}`;
  
  return await transporter.sendMail({
    from: 'noreply@nariswasthya.com',
    to: email,
    subject: 'Verify Your Email - Nari Swasthya Samuday',
    html: `
      <h2>Welcome to Nari Swasthya Samuday!</h2>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `
  });
}
```

### 3. Password Storage
```javascript
const bcrypt = require('bcrypt');

// Hash password
async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
```

### 4. Session Management
```javascript
// JWT-based sessions
const jwt = require('jsonwebtoken');

function generateToken(userId, deviceId) {
  return jwt.sign(
    { 
      user_id: userId,
      device_id: deviceId,
      issued_at: Date.now()
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}
```

---

## 🇮🇳 Aadhaar eKYC Integration (Optional - For Regulated Features)

**When Required**:
- Financial transactions (wallets, payments)
- Insurance purchase
- Telemedicine prescriptions
- Any regulated service under RBI/PMLA

**Implementation**:
```javascript
// Aadhaar OTP-based eKYC
const aadhaarAPI = require('@uidai/ekycgateway');

async function initiateAadhaarKYC(aadhaarNumber) {
  // Step 1: Send OTP to Aadhaar-linked mobile
  const txnId = await aadhaarAPI.generateOTP(aadhaarNumber);
  
  return { txnId, message: "OTP sent to Aadhaar-linked mobile" };
}

async function verifyAadhaarOTP(txnId, otp) {
  // Step 2: Verify OTP and get eKYC data
  const kycData = await aadhaarAPI.verifyOTP(txnId, otp);
  
  return {
    name: kycData.name,
    dob: kycData.dob,
    gender: kycData.gender,
    address: kycData.address,
    photo: kycData.photo,
    verified: true
  };
}
```

**Important Notes**:
- Only use for regulated features
- NOT required for basic health content/community
- Privacy-negative for general use
- Requires UIDAI licensing and compliance

---

## 🌍 Global Market Considerations

### 1. Multi-Language Support
```javascript
// i18n configuration
const languages = {
  'en': 'English',
  'hi': 'हिन्दी',
  'bn': 'বাংলা',
  'ta': 'தமிழ்',
  'te': 'తెలుగు',
  'mr': 'मराठी',
  'es': 'Español',
  'fr': 'Français',
  'ar': 'العربية'
};
```

### 2. International Phone Formats
```javascript
// Use libphonenumber for validation
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

function validatePhoneNumber(number, countryCode) {
  try {
    const phoneNumber = phoneUtil.parse(number, countryCode);
    return phoneUtil.isValidNumber(phoneNumber);
  } catch (e) {
    return false;
  }
}
```

### 3. GDPR Compliance (European Users)
```javascript
// User data export
async function exportUserData(userId) {
  return {
    personal_info: await getUserProfile(userId),
    activity_log: await getUserActivity(userId),
    consent_records: await getConsentHistory(userId),
    format: 'JSON',
    requested_at: new Date().toISOString()
  };
}

// Right to be forgotten
async function deleteUserData(userId) {
  await anonymizeUserPosts(userId);
  await deletePersonalInfo(userId);
  await revokeAllSessions(userId);
  await logDeletionRequest(userId);
}
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE,
    phone_verified BOOLEAN DEFAULT FALSE,
    email VARCHAR(255) UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255),
    region VARCHAR(10) DEFAULT 'india', -- 'india' or 'global'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### User Profiles Table
```sql
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    display_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(255), -- Optional
    date_of_birth DATE,
    avatar_url TEXT,
    privacy_settings JSONB DEFAULT '{"location_private": true, "name_hidden": true}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### OTP Verification Table
```sql
CREATE TABLE otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier VARCHAR(255) NOT NULL, -- phone or email
    otp_code VARCHAR(6) NOT NULL,
    purpose VARCHAR(50), -- 'signup', 'login', 'recovery'
    attempts INT DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_otp_identifier ON otp_verifications(identifier, expires_at);
```

### Sessions Table
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    device_id VARCHAR(255),
    device_info JSONB,
    token_hash VARCHAR(255) NOT NULL,
    last_active TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON user_sessions(user_id);
```

### Audit Log Table
```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- 'login', 'password_reset', etc.
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_log(user_id, created_at);
```

---

## 🎯 API Endpoints

### 1. Registration
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "region": "india",
  "phone_number": "+919876543210",
  "email": "user@example.com",
  "privacy_settings": {
    "location_private": true,
    "name_hidden": true
  }
}

Response:
{
  "success": true,
  "user_id": "uuid",
  "otp_sent": true,
  "message": "OTP sent to +91 98765 ***10"
}
```

### 2. OTP Verification
```
POST /api/v1/auth/verify-otp
Content-Type: application/json

{
  "identifier": "+919876543210",
  "otp_code": "123456"
}

Response:
{
  "success": true,
  "verified": true,
  "temp_token": "jwt_token_for_profile_setup"
}
```

### 3. Complete Profile
```
POST /api/v1/auth/complete-profile
Authorization: Bearer {temp_token}
Content-Type: application/json

{
  "display_name": "RoseBloom23",
  "full_name": "Optional Name",
  "date_of_birth": "1990-01-15",
  "avatar": "base64_encoded_image"
}

Response:
{
  "success": true,
  "profile_created": true
}
```

### 4. Set Password
```
POST /api/v1/auth/set-password
Authorization: Bearer {temp_token}
Content-Type: application/json

{
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!"
}

Response:
{
  "success": true,
  "access_token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token",
  "expires_in": 2592000
}
```

### 5. Sign In
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "identifier": "+919876543210",
  "password": "SecurePass123!",
  "device_id": "unique_device_id"
}

Response:
{
  "success": true,
  "access_token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token",
  "user": {
    "id": "uuid",
    "display_name": "RoseBloom23",
    "avatar_url": "https://..."
  }
}
```

### 6. Sign In with OTP
```
POST /api/v1/auth/login-otp
Content-Type: application/json

{
  "identifier": "+919876543210"
}

Response:
{
  "success": true,
  "otp_sent": true,
  "message": "OTP sent to +91 98765 ***10"
}
```

### 7. Password Recovery
```
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "identifier": "+919876543210",
  "recovery_method": "phone" // or "email"
}

Response:
{
  "success": true,
  "recovery_sent": true,
  "message": "Recovery code sent"
}
```

---

## 🔒 Privacy & Safety Features

### 1. Alias/Display Name System
```javascript
// Public-facing (Community, Q&A)
{
  display_name: "RoseBloom23",
  avatar_url: "https://cdn.example.com/avatars/user123.jpg",
  user_id: "uuid"
}

// Clinical Consultation Only
{
  full_name: "Priya Sharma",
  dob: "1990-01-15",
  medical_id: "encrypted_medical_record_id"
}
```

### 2. Granular Consent Management
```javascript
const consentOptions = {
  location_tracking: false, // Default: OFF
  contact_access: false, // Default: OFF
  data_analytics: true, // Default: ON (for app improvement)
  marketing_emails: false, // Default: OFF
  community_visibility: true, // Default: ON
  clinical_data_sharing: false // Explicit consent required
};
```

### 3. Content Safety
```javascript
// Report & Block functionality
async function reportContent(reporterId, contentId, reason) {
  return await db.reports.create({
    reporter_id: reporterId,
    content_id: contentId,
    reason: reason, // 'harassment', 'inappropriate', 'spam'
    status: 'pending',
    created_at: new Date()
  });
}

async function blockUser(blockerId, blockedId) {
  await db.blocks.create({
    blocker_id: blockerId,
    blocked_id: blockedId,
    created_at: new Date()
  });
  
  // Hide all content from blocked user
  await hideUserContent(blockerId, blockedId);
}
```

---

## 📱 Mobile App Implementation

### React Native Example
```jsx
// SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const SignUpScreen = ({ route }) => {
  const { region } = route.params; // 'india' or 'global'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  
  const sendOTP = async () => {
    try {
      const response = await fetch('https://api.example.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region,
          phone_number: `+91${phoneNumber}`,
          email
        })
      });
      
      const data = await response.json();
      if (data.success) {
        navigation.navigate('OTPVerification', { identifier: phoneNumber });
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* UI Components */}
    </View>
  );
};
```

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] Password strength validation
- [ ] Phone number format validation
- [ ] Email format validation
- [ ] OTP generation and verification
- [ ] Token generation and validation

### Integration Tests
- [ ] Complete signup flow (phone)
- [ ] Complete signup flow (email)
- [ ] OTP resend functionality
- [ ] Password reset flow
- [ ] Multi-device login
- [ ] Session management

### Security Tests
- [ ] SQL injection attempts
- [ ] XSS vulnerability testing
- [ ] CSRF protection
- [ ] Rate limiting on OTP requests
- [ ] Brute force protection
- [ ] Password hash security

### UX Tests
- [ ] Auto-focus on OTP inputs
- [ ] Tab switching between login methods
- [ ] Error message clarity
- [ ] Loading states
- [ ] Success confirmations
- [ ] Accessibility (screen readers)

---

## 📈 Analytics & Monitoring

### Key Metrics to Track
```javascript
// Registration funnel
{
  splash_viewed: 10000,
  region_selected: 8500,
  signup_started: 7000,
  otp_sent: 6500,
  otp_verified: 6000,
  profile_completed: 5500,
  password_set: 5200,
  signup_completed: 5000
}

// Calculate conversion rate
const conversionRate = (signup_completed / splash_viewed) * 100; // 50%
```

### Error Monitoring
```javascript
// Log authentication errors
function logAuthError(error) {
  console.error({
    type: 'auth_error',
    error_code: error.code,
    error_message: error.message,
    user_id: error.userId || 'anonymous',
    timestamp: new Date().toISOString(),
    stack: error.stack
  });
}
```

---

## 🚀 Deployment Checklist

### Pre-Launch
- [ ] SSL/TLS certificates configured
- [ ] Environment variables secured
- [ ] Database backups automated
- [ ] SMS gateway credits purchased
- [ ] Email service configured (SendGrid/SES)
- [ ] Rate limiting configured
- [ ] Monitoring and alerts set up
- [ ] Terms of Service and Privacy Policy published
- [ ] GDPR compliance verified (for EU users)
- [ ] Security audit completed

### Post-Launch
- [ ] Monitor registration success rate
- [ ] Track OTP delivery failures
- [ ] Monitor authentication errors
- [ ] Review user feedback
- [ ] Optimize based on analytics
- [ ] A/B test different flows

---

## 📞 Support & Recovery

### Common Issues & Solutions

**Issue: OTP not received**
```
Solutions:
1. Check phone number format
2. Verify SMS gateway status
3. Check spam folder (email OTP)
4. Offer alternative: Call-based OTP
5. Provide support contact
```

**Issue: Account locked**
```
Solutions:
1. Password reset via email/phone
2. Security questions (if configured)
3. Contact support with verification
4. Temporary access code
```

**Issue: Device change**
```
Solutions:
1. Send OTP to registered phone/email
2. Verify with security questions
3. Require re-authentication
4. Invalidate old device sessions
```

---

## 🎓 Best Practices Summary

1. **Security First**
   - Never store plaintext passwords
   - Use bcrypt/Argon2 for hashing
   - Implement rate limiting
   - Use HTTPS everywhere

2. **Privacy by Design**
   - Collect minimal data
   - Offer alias/display names
   - Granular consent controls
   - Clear data deletion

3. **Women's Safety**
   - Anonymous community participation
   - Robust blocking/reporting
   - Content moderation
   - Safe space guidelines

4. **User Experience**
   - Simple, clear flows
   - Helpful error messages
   - Progress indicators
   - Quick authentication options

5. **Regional Adaptation**
   - India: Phone + OTP primary
   - Global: Email + Phone options
   - Multi-language support
   - Local compliance (GDPR, etc.)

---

## 📚 Additional Resources

### SMS Gateways (India)
- [Twilio](https://www.twilio.com/)
- [MSG91](https://msg91.com/)
- [Kaleyra](https://www.kaleyra.com/)
- [AWS SNS](https://aws.amazon.com/sns/)

### Email Services
- [SendGrid](https://sendgrid.com/)
- [AWS SES](https://aws.amazon.com/ses/)
- [Mailgun](https://www.mailgun.com/)

### Aadhaar eKYC
- [UIDAI eKYC Documentation](https://uidai.gov.in/ecosystem/authentication-devices-documents/about-aadhaar-paperless-offline-ekyc.html)

### Security Libraries
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [helmet](https://www.npmjs.com/package/helmet)

### Phone Validation
- [libphonenumber](https://github.com/google/libphonenumber)

---

## ✅ Implementation Timeline

**Week 1-2**: Backend Setup
- Database schema
- API endpoints
- Authentication logic
- OTP integration

**Week 3-4**: Frontend Development
- UI components
- Form validation
- Screen navigation
- Error handling

**Week 5**: Integration & Testing
- End-to-end testing
- Security testing
- UX testing
- Bug fixes

**Week 6**: Deployment
- Production deployment
- Monitoring setup
- Documentation
- Team training

---

## 📞 Contact & Support

For implementation questions or technical support:
- Email: tech@nariswasthya.com
- Slack: #auth-implementation
- Documentation: docs.nariswasthya.com/auth

---

**Last Updated**: January 2024
**Version**: 1.0
**Author**: Nari Swasthya Samuday Tech Team