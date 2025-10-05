# Postman Testing Guide for Spotify Clone API

## 🚀 Base URL
```
http://localhost:5001
```

## 📋 Testing Steps

### 1. Test User Registration

**Method:** `POST`
**URL:** `http://localhost:5001/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (Raw JSON):**
```json
{
  "firstName": "Тест",
  "lastName": "Користувач",
  "email": "test@example.com",
  "password": "TestPassword123!",
  "confirmPassword": "TestPassword123!",
  "birthDate": "1990-01-01"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "guid-here",
    "email": "test@example.com",
    "firstName": "Тест",
    "lastName": "Користувач",
    "avatar": null,
    "birthDate": "1990-01-01T00:00:00",
    "isEmailConfirmed": false,
    "createdDate": "2025-10-05T11:34:29.123Z"
  }
}
```

---

### 2. Test User Login

**Method:** `POST`
**URL:** `http://localhost:5001/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (Raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "TestPassword123!"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "guid-here",
    "email": "test@example.com",
    "firstName": "Тест",
    "lastName": "Користувач",
    "avatar": null,
    "birthDate": "1990-01-01T00:00:00",
    "isEmailConfirmed": false,
    "createdDate": "2025-10-05T11:34:29.123Z"
  }
}
```

---

### 3. Test Get Current User Profile

**Method:** `GET`
**URL:** `http://localhost:5001/api/auth/me`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_FROM_LOGIN_RESPONSE
```

**Expected Response (200 OK):**
```json
{
  "id": "guid-here",
  "email": "test@example.com",
  "firstName": "Тест",
  "lastName": "Користувач",
  "avatar": null,
  "birthDate": "1990-01-01T00:00:00",
  "isEmailConfirmed": false,
  "createdDate": "2025-10-05T11:34:29.123Z"
}
```

---

### 4. Test Email Confirmation

**Method:** `POST`
**URL:** `http://localhost:5001/api/auth/confirm-email`

**Headers:**
```
Content-Type: application/json
```

**Body (Raw JSON):**
```json
{
  "email": "test@example.com",
  "token": "email-confirmation-token-from-email"
}
```

---

## 🔧 Postman Setup Instructions

### Step 1: Create New Request
1. Open Postman
2. Click "New" → "Request"
3. Name it "Register User"
4. Create a new collection called "Spotify Clone API"

### Step 2: Configure Registration Request
1. Set method to `POST`
2. Enter URL: `http://localhost:5001/api/auth/register`
3. Go to **Headers** tab:
   - Add `Content-Type` with value `application/json`
4. Go to **Body** tab:
   - Select "raw"
   - Choose "JSON" from dropdown
   - Paste the registration JSON

### Step 3: Save JWT Token Automatically
1. Go to **Tests** tab in your login request
2. Add this script to automatically save the token:

```javascript
if (pm.response.code === 200) {
    const responseData = pm.response.json();
    if (responseData.token) {
        pm.globals.set("auth_token", responseData.token);
        console.log("Token saved: " + responseData.token);
    }
}
```

### Step 4: Use Token in Protected Routes
1. For the `/api/auth/me` request
2. Go to **Headers** tab
3. Add `Authorization` with value `Bearer {{auth_token}}`
4. The `{{auth_token}}` will automatically use the saved token

---

## 🎯 Testing Workflow

1. **First:** Test registration endpoint
2. **Second:** Test login endpoint (save the JWT token)
3. **Third:** Test protected endpoints using the JWT token
4. **Fourth:** Test different scenarios (invalid data, wrong passwords, etc.)

---

## ❌ Common Error Responses

### 400 Bad Request - Validation Error
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Password": ["Password must be at least 6 characters long"]
  }
}
```

### 401 Unauthorized - Invalid Credentials
```json
{
  "message": "Невірний email або пароль"
}
```

### 409 Conflict - User Already Exists
```json
{
  "message": "Користувач з таким email вже існує"
}
```

---

## 🔍 Debugging Tips

1. **Check Console:** Look at VS Code terminal for any errors
2. **Verify URL:** Make sure the app is running on `http://localhost:5001`
3. **Check Headers:** Ensure `Content-Type: application/json` is set
4. **JWT Format:** Authorization header should be `Bearer <token>` (note the space)
5. **JSON Format:** Validate your JSON syntax in Postman

---

## 🌐 Alternative: Use REST Client Extension

If you prefer VS Code, you can use the `test-auth.http` file I created:
1. Install "REST Client" extension in VS Code
2. Open `test-auth.http` file
3. Click "Send Request" above each request block