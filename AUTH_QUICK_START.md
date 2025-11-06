# Authentication Quick Start Guide

## 🚀 Quick Setup (Already Done!)

The authentication system is fully configured and ready to use. Here's what's been set up:

### ✅ Files Created

- `src/contexts/AuthContext.tsx` - Auth state management
- `src/hooks/useAuth.ts` - Auth hook
- `src/middleware.ts` - Route protection
- `src/lib/auth-helpers.ts` - Token utilities
- `src/app/layout.tsx` - Updated with AuthProvider

---

## 📝 Using Authentication in Your Components

### 1. Import the Hook

```typescript
import { useAuth } from '@/hooks/useAuth';
```

### 2. Access Auth State

```typescript
const {
  user,           // Current user object
  isAuthenticated, // boolean
  isLoading,      // boolean
  error,          // string | null
  login,          // function
  signup,         // function
  logout,         // function
  clearError      // function
} = useAuth();
```

---

## 🔓 Common Use Cases

### Check if User is Logged In

```typescript
function MyComponent() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Hello, {user?.fullName}!</div>;
}
```

### Show Different Content by Role

```typescript
function Navigation() {
  const { user } = useAuth();

  return (
    <nav>
      {user?.role === 'candidate' && (
        <Link href="/candidate/dashboard">Dashboard</Link>
      )}
      {user?.role === 'employer' && (
        <Link href="/employer/dashboard">Employer Dashboard</Link>
      )}
    </nav>
  );
}
```

### Add Logout Button

```typescript
function UserMenu() {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>{user?.fullName}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Handle Login Form

```typescript
function LoginForm() {
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login({
        email: 'user@example.com',
        password: 'password123'
      });
      // Automatically redirected to dashboard
    } catch (err) {
      // Error is available in `error` state
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## 🛣️ Protected Routes

Routes are automatically protected by middleware:

**Protected (Requires Auth):**
- `/candidate/*` - Only candidates
- `/employer/*` - Only employers

**Public (No Auth Required):**
- `/`, `/jobs`, `/login`, `/signup`, etc.

**Auto-Redirects:**
- Logged-in user visits `/login` → Redirected to dashboard
- Candidate visits `/employer/*` → Redirected to `/candidate/dashboard`
- Employer visits `/candidate/*` → Redirected to `/employer/dashboard`
- Unauthenticated visits `/candidate/*` → Redirected to `/login`

---

## 🔧 Next Integration Steps

### Step 1: Update Login Page

File: `src/app/(auth)/login/page.tsx`

**Replace this:**
```typescript
// TODO: Replace with actual API call
await new Promise((resolve) => setTimeout(resolve, 1500));
showToast("success", "Welcome back!", "You've successfully logged in.");
router.push("/candidate/dashboard");
```

**With this:**
```typescript
await login(data);
// That's it! AuthContext handles redirect and toast
```

### Step 2: Update Signup Page

File: `src/app/(auth)/signup/page.tsx`

**Replace this:**
```typescript
// TODO: Replace with actual API call
await new Promise((resolve) => setTimeout(resolve, 1500));
showToast("success", "Account created!", "Welcome to the platform.");
if (data.role === "employer") {
  router.push("/employer/dashboard");
} else {
  router.push("/candidate/dashboard");
}
```

**With this:**
```typescript
await signup(data);
// That's it! AuthContext handles everything
```

### Step 3: Update Header

File: `src/components/layout/Header.tsx`

Add user menu:
```typescript
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header>
      {isAuthenticated ? (
        <div>
          <span>Welcome, {user?.fullName}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign Up</Link>
        </div>
      )}
    </header>
  );
}
```

---

## 📡 Backend API Endpoints

Your backend must provide these endpoints:

### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token: string, user: User }
```

### Register
```
POST /api/auth/register
Body: { email, password, fullName, role }
Response: { token: string, user: User }
```

### Get Current User
```
GET /api/auth/me
Headers: { Authorization: 'Bearer <token>' }
Response: { user: User } or just User
```

**User Object:**
```typescript
{
  id: string;
  email: string;
  fullName: string;
  role: 'candidate' | 'employer';
}
```

---

## 🐛 Quick Debugging

### Check if User is Logged In

Open browser console:
```javascript
localStorage.getItem('auth_token')
// Should show token if logged in
```

### Check Current User

In any component:
```typescript
const { user } = useAuth();
console.log('Current user:', user);
```

### Test Middleware

1. Try accessing `/candidate/dashboard` without logging in
2. Should redirect to `/login?redirect=/candidate/dashboard`

### Clear Auth State

```javascript
// In browser console
localStorage.removeItem('auth_token');
document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
window.location.reload();
```

---

## ✅ Testing Checklist

Before deploying:

- [ ] Login with valid credentials works
- [ ] Login with invalid credentials shows error
- [ ] Signup creates new account
- [ ] Logout clears session and redirects
- [ ] Refresh page keeps user logged in
- [ ] Protected routes redirect unauthenticated users
- [ ] Role-based routing works (candidate vs employer)
- [ ] Token persists in localStorage and cookies
- [ ] Expired tokens trigger logout

---

## 🎯 Common Patterns

### Loading State

```typescript
const { isLoading } = useAuth();

if (isLoading) {
  return <Spinner />;
}
```

### Conditional Redirect

```typescript
const { isAuthenticated } = useAuth();

useEffect(() => {
  if (!isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated]);
```

### Protected Component

```typescript
function ProtectedComponent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <YourComponent />;
}
```

---

## 📞 Need Help?

1. Check `AUTHENTICATION.md` for detailed documentation
2. Review the source files:
   - `src/contexts/AuthContext.tsx`
   - `src/hooks/useAuth.ts`
   - `src/middleware.ts`
3. Check browser console for errors
4. Verify backend API responses

---

**Ready to integrate? Start with the login page and work your way through each auth component!**
