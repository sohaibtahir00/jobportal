# Backend API Analysis & Documentation

## Purpose
Document the actual backend API contract to avoid constant integration issues.

---

## Issues Encountered

### 1. Signup Field Mapping Issue
**Error:** "Email, password, and name are required"
**Solution:** Backend expects `name` not `fullName`

### 2. Role Validation Issue
**Error:** "Invalid role specified"
**Solution:** Backend expects uppercase roles: `CANDIDATE`, `EMPLOYER`

### 3. Login Failure
**Error:** "Login failed. Please check your credentials"
**Issue:** Need to verify what the backend actually expects

---

## Required Backend Documentation

Please provide the following information about your Railway backend:

### 1. Authentication Endpoints

#### POST /api/auth/register
**Request Body Structure:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string",      // or "fullName"?
  "role": "CANDIDATE"    // Uppercase? Values: CANDIDATE, EMPLOYER, or other?
}
```

**Success Response:**
```json
{
  "token": "jwt-token-string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",    // or "fullName"?
    "role": "CANDIDATE"  // Uppercase or lowercase?
  }
}
```

**Error Response:**
```json
{
  "error": "string",
  "message": "string"
}
```

#### POST /api/auth/login
**Request Body Structure:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response:**
```json
{
  "token": "jwt-token-string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string"
  }
}
```

#### GET /api/auth/me
**Headers:**
```
Authorization: Bearer <token>
```

**Success Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string"
  }
}
```
OR
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string"
}
```

---

## Questions for Backend Team

1. **Field Names:**
   - Is it `name` or `fullName` in responses?
   - Should we send `name` or `fullName` in requests?

2. **Role Values:**
   - What are the exact valid role values?
   - Are they uppercase (CANDIDATE, EMPLOYER) or lowercase (candidate, employer)?
   - Are there other roles (admin, recruiter, etc.)?

3. **Response Structure:**
   - Does the response always have a `user` object, or is the user data at the root level?
   - What fields are guaranteed vs optional?

4. **Error Format:**
   - Is the error message in `error`, `message`, or both?
   - What HTTP status codes are used for different errors?

5. **Token Format:**
   - Is the token a JWT?
   - What's in the JWT payload?
   - How long does the token last?

6. **Password Requirements:**
   - Minimum length?
   - Required characters (uppercase, lowercase, numbers, special)?

---

## Recommended Backend Files to Review

To answer these questions, I would need to see:

### Option 1: OpenAPI/Swagger Documentation
- `swagger.json` or `openapi.yaml`
- API documentation URL

### Option 2: Backend Source Files
- **Authentication Controller/Routes:**
  - `routes/auth.js` or `controllers/authController.js`
  - `api/auth/register` endpoint implementation
  - `api/auth/login` endpoint implementation
  - `api/auth/me` endpoint implementation

- **User Model/Schema:**
  - `models/User.js` or `schemas/userSchema.js`
  - Shows exact field names and structure

- **Validation Schemas:**
  - Request validation middleware
  - Shows required fields and formats

- **Example API Responses:**
  - Postman collection
  - Example JSON responses

### Option 3: Quick Test
Run these commands to test the API:

```bash
# Test registration
curl -X POST https://job-portal-backend-production-cd05.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "Test User",
    "role": "CANDIDATE"
  }'

# Test login
curl -X POST https://job-portal-backend-production-cd05.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'

# Test /me endpoint
curl -X GET https://job-portal-backend-production-cd05.up.railway.app/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Current Frontend Assumptions

Based on trial and error, here's what we're currently assuming:

### Signup Request
```typescript
{
  email: string,
  password: string,
  name: string,           // Not "fullName"
  role: "CANDIDATE" | "EMPLOYER"  // Uppercase
}
```

### Login Request
```typescript
{
  email: string,
  password: string
}
```

### Expected User Object
```typescript
{
  id: string,
  email: string,
  name: string,  // or fullName?
  role: "CANDIDATE" | "EMPLOYER"  // Uppercase from backend, converted to lowercase in frontend
}
```

---

## Next Steps

1. **Get API documentation** or **see backend source code**
2. **Test actual API responses** with curl/Postman
3. **Update frontend** based on actual backend contract
4. **Create adapter layer** if backend changes frequently

Would you prefer to:
- A) Share the backend controller files?
- B) Run the curl tests and share responses?
- C) Share Postman collection or OpenAPI spec?
- D) Give me access to the backend repository?
