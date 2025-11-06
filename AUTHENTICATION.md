# Authentication System Documentation

## Overview

A complete authentication system has been implemented for the Next.js 14 Job Portal frontend. This system includes user authentication, route protection, role-based access control, and secure token management.

---

## 🏗️ Architecture

### Components

1. **AuthContext** ([src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx))
   - Global authentication state management
   - User data and authentication status
   - Login, signup, and logout methods

2. **useAuth Hook** ([src/hooks/useAuth.ts](src/hooks/useAuth.ts))
   - Easy access to authentication context
   - Type-safe hook with error handling

3. **Middleware** ([src/middleware.ts](src/middleware.ts))
   - Route protection and access control
   - Role-based redirection
   - Token validation

4. **Auth Helpers** ([src/lib/auth-helpers.ts](src/lib/auth-helpers.ts))
   - Token storage utilities (localStorage + cookies)
   - JWT decoding and validation
   - Cookie management

---

## 🔐 Authentication Flow

### Login Flow

```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginComponent() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      // User is automatically redirected based on role
    } catch (err) {
      // Error is available in the error state
      console.error(err);
    }
  };
}
```

**What happens:**
1. Sends `POST /api/auth/login` with credentials
2. Receives `{ token, user }` from backend
3. Stores token in both localStorage and cookies
4. Sets axios Authorization header
5. Updates user state
6. Redirects to `/candidate/dashboard` or `/employer/dashboard` based on role

### Signup Flow

```typescript
import { useAuth } from '@/hooks/useAuth';

function SignupComponent() {
  const { signup, isLoading, error } = useAuth();

  const handleSignup = async (data: SignupData) => {
    try {
      await signup({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: data.role, // 'candidate' | 'employer'
      });
      // User is automatically redirected based on role
    } catch (err) {
      console.error(err);
    }
  };
}
```

**What happens:**
1. Sends `POST /api/auth/register` with user data
2. Receives `{ token, user }` from backend
3. Stores token and updates state (same as login)
4. Redirects based on role

### Logout Flow

```typescript
import { useAuth } from '@/hooks/useAuth';

function UserMenu() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // User is redirected to /login
  };
}
```

**What happens:**
1. Removes token from localStorage and cookies
2. Clears axios Authorization header
3. Resets user state to null
4. Redirects to `/login`

### Auto-Login on Page Load

The `AuthProvider` automatically:
1. Checks for existing token in localStorage/cookies
2. If token exists, calls `GET /api/auth/me`
3. If valid, loads user data
4. If invalid, clears token and shows login page

---

## 🛡️ Route Protection

### Protected Routes

**Candidate Routes:**
- `/candidate/dashboard`
- `/candidate/profile`
- Any route starting with `/candidate/*`

**Employer Routes:**
- `/employer/dashboard`
- `/employer/jobs/new`
- Any route starting with `/employer/*`

### Public Routes

- `/` (Homepage)
- `/login`
- `/signup`
- `/forgot-password`
- `/jobs`
- `/jobs/[id]`
- `/employers`
- `/about`
- `/blog`
- `/privacy`
- `/terms`

### Middleware Behavior

**Unauthenticated User:**
```
Tries to access: /candidate/dashboard
→ Redirected to: /login?redirect=/candidate/dashboard
```

**Wrong Role:**
```
Candidate tries to access: /employer/dashboard
→ Redirected to: /candidate/dashboard

Employer tries to access: /candidate/dashboard
→ Redirected to: /employer/dashboard
```

**Authenticated User on Auth Pages:**
```
Logged-in candidate visits: /login
→ Redirected to: /candidate/dashboard

Logged-in employer visits: /signup
→ Redirected to: /employer/dashboard
```

---

## 📦 Token Management

### Dual Storage Strategy

Tokens are stored in **both** localStorage and cookies:

**localStorage:**
- For client-side API calls
- Persists across page refreshes
- Accessible to JavaScript

**Cookies:**
- For middleware access (server-side)
- Can be made httpOnly in the future
- Enables server-side route protection

### Token Storage Functions

```typescript
import { setAuthToken, getAuthToken, removeAuthToken } from '@/lib/auth-helpers';

// Store token
setAuthToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

// Retrieve token
const token = getAuthToken();

// Remove token
removeAuthToken();
```

### JWT Decoding

```typescript
import { decodeToken, isTokenExpired } from '@/lib/auth-helpers';

const token = getAuthToken();
const payload = decodeToken(token);
console.log(payload.role); // 'candidate' or 'employer'

if (isTokenExpired(token)) {
  // Token has expired, logout user
}
```

---

## 🎯 Usage Examples

### Check Authentication Status

```typescript
import { useAuth } from '@/hooks/useAuth';

function ProtectedComponent() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.fullName}!</h1>
      <p>Role: {user?.role}</p>
    </div>
  );
}
```

### Conditional Rendering Based on Role

```typescript
import { useAuth } from '@/hooks/useAuth';

function Navigation() {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          {user?.role === 'candidate' && (
            <a href="/candidate/dashboard">My Dashboard</a>
          )}
          {user?.role === 'employer' && (
            <a href="/employer/dashboard">Employer Dashboard</a>
          )}
        </>
      ) : (
        <>
          <a href="/login">Login</a>
          <a href="/signup">Sign Up</a>
        </>
      )}
    </nav>
  );
}
```

### Error Handling

```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginForm() {
  const { login, error, clearError, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError(); // Clear previous errors

    try {
      await login({ email, password });
    } catch (err) {
      // Error is automatically set in context
      // Display error from context state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## 🔧 Backend API Requirements

### Expected Endpoints

**Login**
```
POST /api/auth/login
Body: { email: string, password: string }
Response: { token: string, user: User }
```

**Register**
```
POST /api/auth/register
Body: { email: string, password: string, fullName: string, role: 'candidate' | 'employer' }
Response: { token: string, user: User }
```

**Get Current User**
```
GET /api/auth/me
Headers: { Authorization: 'Bearer <token>' }
Response: { user: User }
or
Response: User
```

### User Object Structure

```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'candidate' | 'employer';
}
```

### JWT Token Structure

The JWT payload should include:
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "role": "candidate",
  "exp": 1234567890
}
```

---

## 🚨 Error Handling

### Common Errors

**Invalid Credentials (401)**
```typescript
error: "Login failed. Please check your credentials."
```

**Network Error**
```typescript
error: "Unable to connect to server. Please try again."
```

**Token Expired**
- Automatically handled by middleware
- User is redirected to `/login`

**User Already Exists (409)**
```typescript
error: "An account with this email already exists."
```

---

## 🔄 State Management

### AuthContext State

```typescript
{
  user: User | null;           // Current user or null if not logged in
  isAuthenticated: boolean;    // true if user is logged in
  isLoading: boolean;          // true during login/signup/load
  error: string | null;        // Error message or null
  login: (credentials) => Promise<void>;
  signup: (data) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
```

### Loading States

- `isLoading = true` during:
  - Initial app load (checking for existing token)
  - Login process
  - Signup process

- `isLoading = false` when:
  - User check complete
  - Login/signup complete (success or failure)

---

## 🎨 Integration with Existing Pages

### Update Login Page

```typescript
// src/app/(auth)/login/page.tsx

import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      // No need to redirect - AuthContext handles it
    } catch (err) {
      // Error is available in error state
    }
  };

  // Remove mock setTimeout logic
  // Use actual login function
}
```

### Update Signup Page

```typescript
// src/app/(auth)/signup/page.tsx

import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const { signup, isLoading, error } = useAuth();

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      await signup(data);
      // No need to redirect - AuthContext handles it
    } catch (err) {
      // Error is available in error state
    }
  };

  // Remove mock setTimeout logic
  // Use actual signup function
}
```

### Update Header Component

```typescript
// src/components/layout/Header.tsx

import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user?.fullName}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign Up</Link>
        </>
      )}
    </header>
  );
}
```

---

## 🧪 Testing the Authentication System

### Manual Testing Checklist

1. **Login**
   - [ ] Valid credentials → Redirect to appropriate dashboard
   - [ ] Invalid credentials → Show error message
   - [ ] Network error → Show error message
   - [ ] Candidate role → Redirect to `/candidate/dashboard`
   - [ ] Employer role → Redirect to `/employer/dashboard`

2. **Signup**
   - [ ] Valid data → Create account and redirect
   - [ ] Duplicate email → Show error
   - [ ] Weak password → Show validation error
   - [ ] Role selection → Redirect to correct dashboard

3. **Logout**
   - [ ] Click logout → Clear state and redirect to `/login`
   - [ ] Token removed from storage
   - [ ] Cannot access protected routes after logout

4. **Route Protection**
   - [ ] Unauthenticated user → Redirected to `/login`
   - [ ] Wrong role → Redirected to correct dashboard
   - [ ] Public routes → Accessible without login

5. **Auto-Login**
   - [ ] Refresh page while logged in → Stay logged in
   - [ ] Token persists across browser sessions
   - [ ] Invalid token → Auto-logout

---

## 🔐 Security Considerations

### Implemented Security Features

✅ Tokens stored securely (localStorage + cookies)
✅ Role-based access control
✅ Token validation on every protected route
✅ Auto-logout on token expiration
✅ HTTPS-only cookies (when deployed)
✅ SameSite cookie protection

### Future Security Enhancements

- [ ] Implement refresh token mechanism
- [ ] Add CSRF protection
- [ ] Implement rate limiting
- [ ] Add 2FA support
- [ ] Use httpOnly cookies for tokens
- [ ] Add session timeout warnings

---

## 📝 Next Steps

### Integration Tasks

1. **Update Login/Signup Pages**
   - Replace mock logic with actual `useAuth` hook
   - Handle errors from context
   - Show loading states

2. **Update Header Component**
   - Add user menu with profile dropdown
   - Show logout button
   - Display user name/role

3. **Update Dashboard Pages**
   - Fetch user-specific data from backend
   - Replace mock data with API calls
   - Use `user.id` for personalized content

4. **Add Loading States**
   - Show spinner while checking authentication
   - Prevent flash of login page for authenticated users

5. **Error Handling**
   - Display toast notifications for auth errors
   - Handle network failures gracefully

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Infinite redirect loop**
- Check middleware matcher configuration
- Ensure public routes are correctly defined

**Issue: Token not persisting**
- Verify token is saved to both localStorage and cookies
- Check browser's cookie settings

**Issue: User gets logged out immediately**
- Check `/api/auth/me` endpoint response format
- Verify token expiration time

**Issue: Wrong role access not blocked**
- Ensure JWT contains `role` field
- Check middleware role extraction logic

---

## 📚 Additional Resources

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [JWT.io - Token Debugger](https://jwt.io/)
- [React Context Documentation](https://react.dev/reference/react/useContext)

---

## 🤝 Support

If you encounter any issues with the authentication system:

1. Check browser console for errors
2. Verify backend API is responding correctly
3. Check token in localStorage/cookies
4. Review middleware logs

For backend integration issues, ensure your API endpoints match the expected format documented above.
