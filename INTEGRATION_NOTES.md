# Frontend-Backend Integration Notes

**Last Updated**: 2025-11-06
**Backend API Version**: 1.0.0
**Frontend Framework**: Next.js 14 (App Router)
**Backend Documentation**: [docs/API_REFERENCE.md](docs/API_REFERENCE.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Critical Field Mappings](#critical-field-mappings)
3. [Enum Value Mappings](#enum-value-mappings)
4. [Data Type Conversions](#data-type-conversions)
5. [Authentication Flow](#authentication-flow)
6. [Files Updated](#files-updated)
7. [Resolved Issues](#resolved-issues)
8. [Known Limitations](#known-limitations)
9. [Future Improvements](#future-improvements)

---

## Overview

This document tracks all field name mappings, data transformations, and integration decisions made to align the Next.js frontend with the Railway backend API.

**Key Integration Principles**:
- Backend is the source of truth for field names and data types
- Frontend transforms data when sending to/receiving from backend
- Type safety maintained throughout the application
- Helper functions provided for common transformations

---

## Critical Field Mappings

### 1. User Model: `name` vs `fullName`

**Issue**: Frontend originally used `fullName`, backend uses `name`

**Backend Field** | **Frontend Field** | **Location** | **Status**
---|---|---|---
`name` | `name` (updated) | Registration form | ✅ Fixed
`name` | `name` (updated) | Validation schema | ✅ Fixed
`name` | `fullName` | AuthContext interface | ⚠️ Kept for compatibility
`name` | `fullName` | User type | ⚠️ Kept for compatibility

**Transformation Logic** ([src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx:139)):
```typescript
// When sending to backend:
const requestData = {
  email: data.email,
  password: data.password,
  name: data.fullName, // Map fullName → name
  role: data.role.toUpperCase()
};
```

**Files Modified**:
- ✅ [src/lib/validations.ts](src/lib/validations.ts:48) - Changed `fullName` to `name`
- ✅ [src/app/(auth)/signup/page.tsx](src/app/(auth)/signup/page.tsx:345) - Updated form field
- ✅ [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx:139) - Field mapping in signup
- ⚠️ [src/types/index.ts](src/types/index.ts:91) - New types use `name`, legacy types use `fullName`

---

### 2. Candidate Model: Field Names

**Backend Field** | **Frontend Field** | **Notes**
---|---|---
`resume` | `resume` | URL to resume file (was `resumeUrl`)
`portfolio` | `portfolio` | URL to portfolio (was `portfolioUrl`)
`linkedIn` | `linkedIn` | LinkedIn URL (was `linkedinUrl`)
`github` | `github` | GitHub URL (was `githubUrl`)
`experience` | `experience` | Years as integer (was `experienceYears`)
`preferredJobType` | `preferredJobType` | JobType enum (was `employmentType`)

**Status**: ✅ All updated in [src/types/index.ts](src/types/index.ts:106-145)

---

### 3. Job Model: Field Names

**Backend Field** | **Frontend Field** | **Notes**
---|---|---
`requirements` | `requirements` | Text field (was array `requirements[]`)
`responsibilities` | `responsibilities` | Text field (was array `responsibilities[]`)
`benefits` | `benefits` | Text field (was array `benefits[]`)
`remote` | `remote` | Boolean (was string enum)
`type` | `type` | JobType enum UPPERCASE
`experienceLevel` | `experienceLevel` | ExperienceLevel enum UPPERCASE

**Critical Change**: `remote` is **boolean**, not `"remote" | "hybrid" | "onsite"`

---

## Enum Value Mappings

### All Enums are UPPERCASE with Underscores

The backend uses UPPERCASE enum values with underscores, while the frontend UI often displays lowercase with hyphens.

### UserRole Enum

**Backend** | **Frontend Display** | **Helper Function**
---|---|---
`CANDIDATE` | `candidate` | `toBackendRole()` / `toFrontendRole()`
`EMPLOYER` | `employer` | `toBackendRole()` / `toFrontendRole()`
`ADMIN` | `admin` | `toBackendRole()` / `toFrontendRole()`

**Example** ([src/types/index.ts](src/types/index.ts:451-456)):
```typescript
export function toBackendRole(role: UserRoleType | UserRole): UserRole {
  if (typeof role === 'string') {
    return role.toUpperCase() as UserRole;
  }
  return role;
}
```

**Transformation** ([src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx:140)):
```typescript
// Sending to backend
role: data.role.toUpperCase() // "candidate" → "CANDIDATE"

// Receiving from backend
if (userData.role) {
  userData.role = userData.role.toLowerCase(); // "CANDIDATE" → "candidate"
}
```

---

### JobType Enum

**Backend** | **Frontend Display** | **Status**
---|---|---
`FULL_TIME` | `full-time` | ✅ Mapped
`PART_TIME` | `part-time` | ✅ Mapped
`CONTRACT` | `contract` | ✅ Mapped
`INTERNSHIP` | `internship` | ✅ Mapped
`TEMPORARY` | `temporary` | ✅ Mapped

**Helper Functions** ([src/types/index.ts](src/types/index.ts:462-471)):
```typescript
export function toBackendJobType(type: JobTypeType | JobType): JobType {
  if (typeof type === 'string') {
    return type.toUpperCase().replace('-', '_') as JobType;
  }
  return type;
}

export function toFrontendJobType(type: JobType): JobTypeType {
  return type.toLowerCase().replace('_', '-') as JobTypeType;
}
```

---

### ExperienceLevel Enum

**Backend** | **Frontend Display** | **Status**
---|---|---
`ENTRY_LEVEL` | `entry` | ✅ Mapped
`MID_LEVEL` | `mid` | ✅ Mapped
`SENIOR_LEVEL` | `senior` | ✅ Mapped
`EXECUTIVE` | `executive` | ✅ Mapped

**Helper Functions** ([src/types/index.ts](src/types/index.ts:473-482)):
```typescript
export function toBackendExperienceLevel(level: ExperienceLevelType | ExperienceLevel): ExperienceLevel {
  if (typeof level === 'string') {
    return level.toUpperCase().replace('-', '_') as ExperienceLevel;
  }
  return level;
}
```

---

### ApplicationStatus Enum

**Backend** | **Frontend Display** | **Status**
---|---|---
`PENDING` | `pending` | ✅ Mapped
`REVIEWED` | `reviewed` | ✅ Mapped
`SHORTLISTED` | `shortlisted` | ✅ Mapped
`INTERVIEW_SCHEDULED` | `interview_scheduled` | ✅ Mapped
`INTERVIEWED` | `interviewed` | ✅ Mapped
`OFFERED` | `offered` | ✅ Mapped
`REJECTED` | `rejected` | ✅ Mapped
`WITHDRAWN` | `withdrawn` | ✅ Mapped
`ACCEPTED` | `accepted` | ✅ Mapped

---

### JobStatus Enum

**Backend** | **Frontend Display** | **Notes**
---|---|---
`DRAFT` | `draft` | Not visible publicly
`ACTIVE` | `active` | Accepting applications
`CLOSED` | `closed` | No longer accepting
`EXPIRED` | `expired` | Past deadline

**Frontend Note**: Was using `"published"` instead of `"active"` - **updated to match backend**

---

## Data Type Conversions

### Dates: ISO 8601 Strings

**Backend**: Returns dates as ISO 8601 strings (e.g., `"2025-11-06T02:00:00.000Z"`)
**Frontend**: Must convert to `Date` objects for display

**Conversion Examples**:
```typescript
// Backend → Frontend
const date = new Date(job.createdAt); // ISO string → Date object

// Frontend → Backend
const isoString = new Date().toISOString(); // Date object → ISO string
```

**All Date Fields**:
- `createdAt`, `updatedAt`
- `appliedAt`, `reviewedAt`
- `deadline`
- `emailVerified`
- `publishedAt`
- All timestamp fields

---

### IDs: String (cuid) not Number

**Backend**: Uses cuid strings (e.g., `"cmhmqcpxq0000pc1yzke3ukj3"`)
**Frontend**: Must use `string` type for all IDs

**Updated Types** ([src/types/index.ts](src/types/index.ts)):
```typescript
export interface User {
  id: string; // ✅ NOT number
  // ...
}
```

---

### Arrays: PostgreSQL Arrays

**Backend**: Skills and similar fields are PostgreSQL string arrays
**Frontend**: Must send/receive as JavaScript arrays, not comma-separated strings

**Examples**:
```typescript
// ✅ Correct
skills: ["React", "Node.js", "TypeScript"]

// ❌ Wrong
skills: "React, Node.js, TypeScript"
```

**Fields Using Arrays**:
- `skills` (Candidate, Job)
- `techStack` (Job - **removed in backend, use `skills` instead**)

---

### Salary: Integer in Dollars

**Backend**: Salary fields are integers (check if cents or dollars - **currently dollars based on examples**)
**Frontend**: Display as currency with formatting

**Note**: Documentation mentions "in cents" but examples show dollar amounts. **Needs clarification**.

**Fields**:
- `salaryMin`, `salaryMax` (Job)
- `expectedSalary` (Candidate)
- `totalSpent` (Employer) - **definitely in cents**
- `referralEarnings` (Candidate) - **in cents**

---

### Boolean: `remote` Field

**Critical Change**: `remote` is boolean, NOT string enum

**Backend**:
```typescript
{
  remote: true // Boolean
}
```

**Frontend** (OLD - WRONG):
```typescript
{
  remoteType: "remote" | "hybrid" | "onsite" // ❌ Wrong
}
```

**Frontend** (NEW - CORRECT):
```typescript
{
  remote: true // ✅ Correct
}
```

**Status**: ⚠️ **Needs frontend UI update to change from select to checkbox + location field**

---

## Authentication Flow

### NextAuth Integration

**Discovery**: Backend uses NextAuth.js, not custom JWT authentication

**Key Findings from Testing** ([test-nextauth.js](test-nextauth.js)):
1. `/api/auth/login` **does NOT exist** - returns "This action with HTTP POST is not supported by NextAuth.js"
2. `/api/auth/register` is custom (works, returns user object, **NO TOKEN**)
3. Login uses NextAuth callback: `/api/auth/callback/credentials`
4. Requires CSRF token from `/api/auth/csrf`
5. Session managed via HTTP-only cookies (`next-auth.session-token`)

### Registration Flow

**Backend**: POST `/api/auth/register`

**Request**:
```typescript
{
  email: string;
  password: string;
  name: string; // NOT fullName!
  role: "CANDIDATE" | "EMPLOYER"; // UPPERCASE
}
```

**Response** (201 Created):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "cmhmqcpxq0000pc1yzke3ukj3",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "CANDIDATE",
    "status": "ACTIVE",
    "createdAt": "2025-11-06T01:10:29.199Z"
  }
}
```

**⚠️ CRITICAL**: No `token` field in response! Must login separately after registration.

---

### Login Flow (NextAuth)

**Backend**: POST `/api/auth/callback/credentials`

**Steps**:
1. Get CSRF token: `GET /api/auth/csrf`
2. Call callback endpoint with credentials + CSRF token
3. NextAuth sets HTTP-only cookie
4. Frontend reads session from `GET /api/auth/session`

**Implementation** ([src/lib/api/auth.ts](src/lib/api/auth.ts:65-88)):
```typescript
export async function signIn(credentials: SignInRequest): Promise<SignInResponse> {
  // 1. Get CSRF token
  const csrfResponse = await api.get<CsrfResponse>('/api/auth/csrf');
  const csrfToken = csrfResponse.data.csrfToken;

  // 2. Call callback endpoint
  const response = await api.post('/api/auth/callback/credentials', {
    email: credentials.email,
    password: credentials.password,
    csrfToken,
    redirect: false,
    json: true
  });

  return response.data;
}
```

**⚠️ TODO**: AuthContext needs update to use NextAuth flow instead of manual token management

---

### Session Management

**Current (WRONG)**:
- Frontend manually manages JWT tokens in localStorage + cookies
- Uses custom `/api/auth/me` endpoint (doesn't exist in backend)

**Correct (NextAuth)**:
- Backend sets HTTP-only `next-auth.session-token` cookie
- Frontend calls `GET /api/auth/session` to get user data
- No manual token management needed

**Recommended**: Use `next-auth/react` client library for seamless integration

---

## Files Updated

### Type Definitions

File | Status | Changes
---|---|---
[src/types/index.ts](src/types/index.ts) | ✅ Updated | Complete rewrite to match backend models exactly
[src/lib/api-types.ts](src/lib/api-types.ts) | ✅ Created | API request/response types separate from models

### Validation Schemas

File | Status | Changes
---|---|---
[src/lib/validations.ts](src/lib/validations.ts) | ✅ Updated | All schemas updated to match backend validation rules

### API Layer

File | Status | Changes
---|---|---
[src/lib/api.ts](src/lib/api.ts) | ✅ Existing | Axios client with interceptors
[src/lib/api/auth.ts](src/lib/api/auth.ts) | ✅ Created | Strongly typed auth API functions

### Authentication

File | Status | Changes
---|---|---
[src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx) | ⚠️ Needs Update | Has field mapping logic, but uses wrong auth flow (needs NextAuth)
[src/app/(auth)/signup/page.tsx](src/app/(auth)/signup/page.tsx) | ✅ Updated | Form field changed from `fullName` to `name`
[src/app/(auth)/login/page.tsx](src/app/(auth)/login/page.tsx) | ⚠️ Needs Update | Uses wrong login endpoint

### Documentation

File | Status | Changes
---|---|---
[docs/API_REFERENCE.md](docs/API_REFERENCE.md) | ✅ Created | Complete backend API documentation
[INTEGRATION_NOTES.md](INTEGRATION_NOTES.md) | ✅ Created | This file
[BACKEND_API_ANALYSIS.md](BACKEND_API_ANALYSIS.md) | ✅ Created | Backend API analysis and questions
[test-backend-api.js](test-backend-api.js) | ✅ Created | Node.js script to test backend endpoints
[test-nextauth.js](test-nextauth.js) | ✅ Created | NextAuth endpoint testing

---

## Resolved Issues

### Issue #1: Field Name Mismatch (`name` vs `fullName`)

**Error**: `"Email, password, and name are required"`

**Cause**: Frontend sent `fullName`, backend expected `name`

**Fix** (Commit: 9fe8ce0):
- Updated registration validation schema to use `name`
- Updated signup form field from `fullName` to `name`
- Added mapping in AuthContext to handle legacy code

**Files**:
- [src/lib/validations.ts](src/lib/validations.ts:48)
- [src/app/(auth)/signup/page.tsx](src/app/(auth)/signup/page.tsx:345)
- [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx:139)

---

### Issue #2: Invalid Role Value

**Error**: `"Invalid role specified"`

**Cause**: Frontend sent lowercase `"candidate"`, backend expected uppercase `"CANDIDATE"`

**Fix** (Commit: 236f604):
- Added role transformation to uppercase when sending to backend
- Added role transformation to lowercase when receiving from backend
- Applied in login, signup, and loadUser functions

**Code** ([src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx:140)):
```typescript
// Sending
role: data.role.toUpperCase() // "candidate" → "CANDIDATE"

// Receiving
if (userData.role) {
  userData.role = userData.role.toLowerCase(); // "CANDIDATE" → "candidate"
}
```

---

### Issue #3: Login Endpoint Not Found

**Error**: `"This action with HTTP POST is not supported by NextAuth.js"`

**Cause**: Frontend called `/api/auth/login`, but backend uses NextAuth with different endpoints

**Discovery**:
- Backend uses NextAuth.js for authentication
- Login endpoint is `/api/auth/callback/credentials`
- Requires CSRF token from `/api/auth/csrf`
- Session managed via HTTP-only cookies

**Status**: ⚠️ **Partially Resolved** - Created API functions, but AuthContext not updated yet

**Next Steps**:
1. Option A: Install and use `next-auth/react` client library (recommended)
2. Option B: Update AuthContext to use custom NextAuth flow
3. Remove manual token management (localStorage + cookies)
4. Use `/api/auth/session` to get user data

---

## Known Limitations

### 1. NextAuth Integration Incomplete

**Current State**:
- Frontend has manual token management logic
- Backend uses NextAuth session cookies
- Login will fail because endpoints don't match

**Impact**: ⚠️ **CRITICAL** - Login does not work

**Workaround**: None - must complete NextAuth integration

**Files Needing Update**:
- [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)
- [src/app/(auth)/login/page.tsx](src/app/(auth)/login/page.tsx)
- [src/lib/auth-helpers.ts](src/lib/auth-helpers.ts) - May need removal or update

---

### 2. Remote Type Field Mismatch

**Backend**: `remote` is boolean
**Frontend UI**: Uses select dropdown with "remote" | "hybrid" | "onsite"

**Impact**: ⚠️ **MEDIUM** - Job posting and search forms need UI update

**Recommendation**:
- Change to checkbox for "Remote OK?"
- Add separate location field for hybrid/onsite
- Update job search filters to use boolean + location

---

### 3. Text vs Array Fields

**Backend**: `requirements`, `responsibilities`, `benefits` are text fields
**Frontend Forms**: Collect as arrays with bullet points

**Current Handling**: Frontend joins arrays with newlines before sending

**Impact**: ✅ **LOW** - Works but formatting may vary

**Recommendation**: Keep current approach, add rich text editor later

---

### 4. Salary Unit Ambiguity

**Documentation**: Says "in cents"
**Examples**: Show dollar amounts (e.g., 120000 for $120k)

**Impact**: ⚠️ **MEDIUM** - May display wrong currency values

**Status**: ⚠️ **NEEDS CLARIFICATION** from backend team

**Temporary Decision**: Treat as dollars (based on examples)

---

## Future Improvements

### 1. Install NextAuth Client Library

**Recommendation**: Use `next-auth/react` instead of manual session management

**Benefits**:
- Automatic session handling
- Built-in hooks (`useSession`, `signIn`, `signOut`)
- CSRF protection handled automatically
- TypeScript support

**Install**:
```bash
npm install next-auth
```

**Update**:
- Remove manual token helpers ([src/lib/auth-helpers.ts](src/lib/auth-helpers.ts))
- Update AuthContext to use NextAuth hooks
- Simplify authentication logic

---

### 2. Backend Changes for Better Frontend DX

**Recommendations for Backend Team**:

1. **Return token in registration response** - Avoid forcing immediate login after signup
2. **Use consistent salary units** - Document if cents or dollars, use consistently
3. **Add pagination metadata** - Include `hasMore`, `total` in all paginated responses
4. **Support both role casings** - Accept lowercase or uppercase roles, normalize on backend
5. **OpenAPI/Swagger docs** - Auto-generate API documentation
6. **GraphQL consideration** - For complex nested queries (jobs with applications, etc.)

---

### 3. Frontend Type Generation

**Recommendation**: Auto-generate TypeScript types from backend Prisma schema

**Tools**:
- `prisma-typescript-generator` - Generate TS types from Prisma schema
- `openapi-typescript` - Generate types from OpenAPI spec
- `graphql-code-generator` - If backend adds GraphQL

**Benefits**:
- Types always in sync with backend
- Reduces manual maintenance
- Catches breaking changes early

---

### 4. API Request/Response Logging

**Recommendation**: Add request/response logging middleware

**Implementation**:
```typescript
// src/lib/api.ts
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('→ API Request:', config.method?.toUpperCase(), config.url, config.data);
    }
    return config;
  }
);

api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('← API Response:', response.config.url, response.status, response.data);
    }
    return response;
  }
);
```

---

### 5. Error Boundary & Retry Logic

**Recommendation**: Add exponential backoff retry for failed requests

**Library**: `axios-retry`

**Implementation**:
```typescript
import axiosRetry from 'axios-retry';

axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.response?.status === 429; // Rate limit
  }
});
```

---

## Summary

### ✅ Completed

- [x] Complete type definitions matching backend models
- [x] API request/response types
- [x] Validation schemas matching backend rules
- [x] Helper functions for enum conversions
- [x] Field name mappings documented
- [x] Signup form updated to use `name` field
- [x] Role transformation logic (uppercase ↔ lowercase)
- [x] Backend API documentation

### ⚠️ In Progress

- [ ] NextAuth integration in AuthContext
- [ ] Login page NextAuth flow
- [ ] Remove manual token management
- [ ] Test complete auth flow

### 📋 TODO

- [ ] Update job forms for `remote` boolean field
- [ ] Clarify salary units with backend team
- [ ] Add request/response logging
- [ ] Consider installing `next-auth/react`
- [ ] Update middleware for NextAuth session
- [ ] Test all CRUD operations
- [ ] Update dashboard data fetching

---

## Quick Reference

### Common Transformations

```typescript
// Role: lowercase ↔ uppercase
frontend: "candidate" → backend: "CANDIDATE"
backend: "EMPLOYER" → frontend: "employer"

// Field names
frontend: fullName → backend: name
frontend: resumeUrl → backend: resume

// Job type: hyphen ↔ underscore
frontend: "full-time" → backend: "FULL_TIME"
backend: "PART_TIME" → frontend: "part-time"

// Experience level
frontend: "entry" → backend: "ENTRY_LEVEL"
backend: "SENIOR_LEVEL" → frontend: "senior"
```

### Key Files

- **Types**: [src/types/index.ts](src/types/index.ts)
- **API Types**: [src/lib/api-types.ts](src/lib/api-types.ts)
- **Validations**: [src/lib/validations.ts](src/lib/validations.ts)
- **Auth API**: [src/lib/api/auth.ts](src/lib/api/auth.ts)
- **Auth Context**: [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)
- **Backend Docs**: [docs/API_REFERENCE.md](docs/API_REFERENCE.md)

---

**Document Status**: Living document - Update as integration progresses
