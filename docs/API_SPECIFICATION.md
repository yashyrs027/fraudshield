# REST API Specification Document
## Project: FraudShield — AI-Powered Digital Payment Fraud Prevention Platform
**Document Version:** 1.0.0  
**Base URL:** `https://api.fraudshield.in/api/v1` (Production) / `http://localhost:5000/api/v1` (Development)  
**Protocol:** HTTPS / REST  
**Data Exchange:** JSON (`application/json`) / Multipart (`multipart/form-data`)  

---

## 1. Global Standards & Conventions

### 1.1 HTTP Status Codes
- `200 OK`: Request succeeded. Returned with data payloads.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure or malformed payload.
- `401 Unauthorized`: Missing or invalid Bearer JWT.
- `403 Forbidden`: Authenticated user does not have permission.
- `404 Not Found`: Target resource does not exist.
- `413 Payload Too Large`: Uploaded file exceeds size ceiling (10 MB).
- `422 Unprocessable Entity`: File or QR payload cannot be decoded.
- `429 Too Many Requests`: Rate limit quota exceeded.
- `500 Internal Server Error`: Unhandled server exception.
- `503 Service Unavailable`: AI detection subsystem experiencing temporary failure.

### 1.2 Unified Success Response Wrapper
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "req_a91b2c3d4e",
    "timestamp": "2026-11-15T08:45:00.000Z"
  }
}
```

### 1.3 Unified Error Response Wrapper
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Input validation failed on one or more fields.",
    "details": [
      {
        "field": "phoneNumber",
        "issue": "Phone number must follow Indian format (+91XXXXXXXXXX)"
      }
    ],
    "requestId": "req_a91b2c3d4e",
    "timestamp": "2026-11-15T08:45:00.000Z"
  }
}
```

---

## 2. Authentication APIs

### 2.1 Register New User
- **Endpoint:** `POST /auth/register`
- **Auth Required:** No
- **Rate Limit:** 5 requests / 15 mins / IP
- **Request Body:**
```json
{
  "email": "ramesh.chandra@example.com",
  "password": "SecurePassword#2026",
  "fullName": "Ramesh Chandra",
  "phoneNumber": "+919876543210",
  "consentGiven": true
}
```
- **Validation Rules (Zod):**
  - `email`: valid email string, max 255 chars
  - `password`: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special symbol
  - `fullName`: min 2 chars, max 150 chars
  - `phoneNumber`: optional, regex `^\+91[6-9][0-9]{9}$`
  - `consentGiven`: boolean, must be `true`
- **Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "ramesh.chandra@example.com",
      "fullName": "Ramesh Chandra",
      "role": "USER",
      "isVerified": false,
      "createdAt": "2026-11-15T08:45:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```
*Note: Sets HTTP-only cookie `refreshToken`.*

---

### 2.2 Login User
- **Endpoint:** `POST /auth/login`
- **Auth Required:** No
- **Rate Limit:** 5 attempts / 15 mins / IP
- **Request Body:**
```json
{
  "email": "ramesh.chandra@example.com",
  "password": "SecurePassword#2026"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "ramesh.chandra@example.com",
      "fullName": "Ramesh Chandra",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```

---

### 2.3 Refresh Access Token
- **Endpoint:** `POST /auth/refresh`
- **Auth Required:** No (Extracts `refreshToken` from HTTP-only cookie)
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```

---

### 2.4 Logout User
- **Endpoint:** `POST /auth/logout`
- **Auth Required:** Bearer JWT
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Successfully logged out and session cleared."
  }
}
```

---

## 3. Threat Analysis APIs

### 3.1 Analyze Text / SMS Message
- **Endpoint:** `POST /analyze/message`
- **Auth Required:** Optional (Supports guest scans)
- **Rate Limit:** 15 scans/min (Authenticated), 5 scans/min (Guest)
- **Request Body:**
```json
{
  "content": "Dear Customer, your electricity power will be disconnected tonight at 9:30 PM due to pending bill update. Immediately call Electricity Officer at 9876543210 or visit bit.ly/power-bill-updt",
  "senderHeader": "VM-POWERT",
  "consentGranted": true
}
```
- **Validation Rules (Zod):**
  - `content`: min 10 chars, max 5,000 chars
  - `senderHeader`: optional, string max 20 chars
  - `consentGranted`: boolean, must be `true`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "analysisType": "TEXT_MESSAGE",
    "riskAssessment": {
      "score": 94,
      "level": "CRITICAL",
      "summaryVerdict": "High-danger utility bill disconnection phishing scam.",
      "actionableAdvice": "Do not call the mobile number or click the link. Electricity departments never send personal 10-digit mobile numbers for bill payments."
    },
    "threatBreakdown": {
      "urgencyScore": 92.5,
      "scamCategory": "ELECTRICITY_BILL_SCAM",
      "detectedLanguage": "en",
      "factorContributions": {
        "linguisticUrgency": 28,
        "unregisteredContact": 22,
        "suspiciousShortLink": 34,
        "headerMismatch": 10
      }
    },
    "indicators": [
      {
        "code": "URGENCY_THREAT_DISCONNECTION",
        "severity": "CRITICAL",
        "description": "Uses artificial immediate deadline (<2 hours) to provoke panic"
      },
      {
        "code": "SUSPICIOUS_SHORTENER_LINK",
        "severity": "HIGH",
        "description": "Contains shortened link masking the actual web host"
      },
      {
        "code": "UNAUTHORIZED_PERSONAL_MOBILE",
        "severity": "HIGH",
        "description": "Directs customer to call a private 10-digit mobile number instead of an official toll-free helpline"
      }
    ],
    "extractedEntities": {
      "phoneNumbers": ["9876543210"],
      "urls": ["http://bit.ly/power-bill-updt"],
      "deadlineMentioned": "tonight at 9:30 PM"
    }
  }
}
```

---

### 3.2 Analyze QR Code & UPI Deep Link
- **Endpoint:** `POST /analyze/qr`
- **Content-Type:** `multipart/form-data` OR `application/json`
- **Auth Required:** Optional
- **Request Form-Data:**
  - `file`: Binary image file (JPEG, PNG, WebP <= 10MB)
  - `consentGranted`: "true"
  *OR JSON payload for pre-decoded QR text:*
  - `qrPayload`: `"upi://pay?pa=fraudster@ybl&pn=RefundDesk&mc=0000&tr=998877&tn=Cashback%20Credit&am=4999.00&cu=INR"`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "b3e028aa-381c-4b55-a228-56832ad41c42",
    "analysisType": "QR_IMAGE",
    "isUpiScheme": true,
    "upiPayload": {
      "vpa": "fraudster@ybl",
      "payeeName": "RefundDesk",
      "merchantCode": "0000",
      "amount": "4999.00",
      "currency": "INR",
      "transactionNote": "Cashback Credit",
      "isCollectRequest": true
    },
    "riskAssessment": {
      "score": 88,
      "level": "HIGH",
      "summaryVerdict": "Deceptive UPI Collect / Debit disguised as a cashback refund.",
      "actionableAdvice": "DO NOT ENTER YOUR UPI PIN. Entering your UPI PIN will DEBIT ₹4,999 from your bank account. You never need to enter a PIN to receive money."
    },
    "indicators": [
      {
        "code": "DECEPTIVE_CASHBACK_DEBIT",
        "severity": "CRITICAL",
        "description": "Transaction note claims 'Cashback Credit' but technical payload executes a debit"
      },
      {
        "code": "UNVERIFIED_INDIVIDUAL_VPA",
        "severity": "MEDIUM",
        "description": "VPA uses an individual handle rather than a verified merchant MCC"
      }
    ]
  }
}
```

---

### 3.3 Analyze URL & Web Link Safety
- **Endpoint:** `POST /analyze/url`
- **Auth Required:** Optional
- **Request Body:**
```json
{
  "url": "http://sbi-kyc-verify-portal.in/login.php",
  "consentGranted": true
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "4d1b8e1a-8c34-4b5a-93f8-8a8b1a3e9c52",
    "originalUrl": "http://sbi-kyc-verify-portal.in/login.php",
    "resolvedDestinationUrl": "http://sbi-kyc-verify-portal.in/login.php",
    "redirectHops": 0,
    "domainMetadata": {
      "domainName": "sbi-kyc-verify-portal.in",
      "domainAgeDays": 4,
      "isTyposquatting": true,
      "targetedBrand": "State Bank of India (SBI)",
      "similarityScore": 0.88,
      "hasSsl": false,
      "containsDirectApk": false
    },
    "riskAssessment": {
      "score": 96,
      "level": "CRITICAL",
      "summaryVerdict": "Active phishing domain impersonating State Bank of India.",
      "actionableAdvice": "Never enter banking username, password, or OTP on this site. Official SBI online banking is exclusively hosted at onlinesbi.sbi."
    },
    "indicators": [
      {
        "code": "BRAND_TYPOSQUATTING",
        "severity": "CRITICAL",
        "description": "Domain mimics official bank brand 'sbi' with recent registration (4 days old)"
      },
      {
        "code": "INSECURE_CONNECTION",
        "severity": "HIGH",
        "description": "Site lacks valid TLS/SSL certificate"
      }
    ]
  }
}
```

---

## 4. Assessment History & Details APIs

### 4.1 Get Unified Assessment by Session ID
- **Endpoint:** `GET /assessments/:sessionId`
- **Auth Required:** Optional (Owner verification if authenticated)
- **Success Response (200 OK):** Full analysis object containing metadata, threat indicators, factor contributions, and tailored emergency actions.

### 4.2 List User Analysis History
- **Endpoint:** `GET /assessments/history?page=1&limit=10&riskLevel=HIGH`
- **Auth Required:** Bearer JWT
- **Query Parameters:**
  - `page`: integer, default `1`
  - `limit`: integer, default `10`, max `50`
  - `riskLevel`: optional filter (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
  - `inputType`: optional filter (`TEXT_MESSAGE`, `QR_IMAGE`, `URL`)
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "sessionId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "inputType": "TEXT_MESSAGE",
        "riskScore": 94,
        "riskLevel": "CRITICAL",
        "scamCategory": "ELECTRICITY_BILL_SCAM",
        "createdAt": "2026-11-15T08:45:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalRecords": 28
    }
  }
}
```

---

## 5. User Profile & Preferences APIs

### 5.1 Get User Profile & Preferences
- **Endpoint:** `GET /users/profile`
- **Auth Required:** Bearer JWT
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "ramesh.chandra@example.com",
    "fullName": "Ramesh Chandra",
    "phoneNumber": "+919876543210",
    "role": "USER",
    "preferences": {
      "highContrastMode": true,
      "fontSize": "LARGE",
      "languageCode": "hi",
      "autoSosAlert": true,
      "emailNotifications": true,
      "smsNotifications": true
    }
  }
}
```

### 5.2 Update User Preferences
- **Endpoint:** `PATCH /users/preferences`
- **Auth Required:** Bearer JWT
- **Request Body:**
```json
{
  "highContrastMode": true,
  "fontSize": "LARGE",
  "languageCode": "hi",
  "autoSosAlert": true
}
```
- **Success Response (200 OK):** Updated preference object.

---

## 6. Trusted Contacts APIs

### 6.1 List Trusted Contacts
- **Endpoint:** `GET /contacts`
- **Auth Required:** Bearer JWT
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "contacts": [
      {
        "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
        "contactName": "Ananya Chandra (Daughter)",
        "relationship": "Daughter",
        "phoneNumber": "+919845012345",
        "email": "ananya.chandra@example.com",
        "isActive": true
      }
    ]
  }
}
```

### 6.2 Add Trusted Contact
- **Endpoint:** `POST /contacts`
- **Auth Required:** Bearer JWT
- **Request Body:**
```json
{
  "contactName": "Ananya Chandra",
  "relationship": "Daughter",
  "phoneNumber": "+919845012345",
  "email": "ananya.chandra@example.com"
}
```
- **Validation Rules (Zod):** Max 3 contacts per user, valid phone number format.
- **Success Response (201 Created):** Created contact record.

### 6.3 Trigger SOS Alert to Contacts
- **Endpoint:** `POST /contacts/notify`
- **Auth Required:** Bearer JWT
- **Request Body:**
```json
{
  "sessionId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "customNote": "Father scanned this suspicious message. Please check."
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "alertsDispatched": 1,
    "recipients": ["Ananya Chandra (+919845012345)"],
    "deliveryStatus": "QUEUED"
  }
}
```

---

## 7. Incident Response & Playbook APIs

### 7.1 Report New Fraud Incident
- **Endpoint:** `POST /incidents/report`
- **Auth Required:** Bearer JWT
- **Request Body:**
```json
{
  "sessionId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "incidentType": "UNAUTHORIZED_UPI_DEBIT",
  "financialLossInr": 15000.00,
  "bankName": "State Bank of India",
  "transactionRefRrn": "334455667788",
  "incidentTime": "2026-11-15T08:15:00.000Z",
  "notes": "Money debited after scanning refund QR code sent on WhatsApp."
}
```
- **Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "incidentId": "8f3b2a1c-9e4d-4c5b-8a7e-1b2c3d4e5f6a",
    "cybercrimeComplaintDraft": {
      "portalUrl": "https://cybercrime.gov.in",
      "helpline": "1930",
      "prefilledSummary": "Unauthorized UPI Debit of INR 15,000 via forged QR code. Ref RRN: 334455667788."
    },
    "bankEmergencyActions": {
      "bankName": "State Bank of India",
      "tollFree": "1800-1234",
      "smsBlockSyntax": "BLOCK <Last 4 Digits of Card> to 567676",
      "portalUrl": "https://www.onlinesbi.sbi"
    }
  }
}
```

### 7.2 Get Emergency Bank Hotlines Directory
- **Endpoint:** `GET /incidents/guidance/bank-hotlines`
- **Auth Required:** No
- **Success Response (200 OK):** Directory of verified fraud numbers for Indian public & private banks.

---

## 8. Summary & Contract Stability

All API endpoints follow strict schema validation, enforce security headers, and maintain unified response contracts, enabling smooth frontend-backend integration.
