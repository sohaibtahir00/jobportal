# Error Boundary Implementation Guide

## Overview

This application implements React Error Boundaries to catch and handle JavaScript errors in the component tree, preventing the entire app from crashing and providing a better user experience.

## What is an Error Boundary?

Error boundaries are React components that:
- Catch JavaScript errors anywhere in their child component tree
- Log those errors
- Display a fallback UI instead of crashing the entire app
- Only work with class components (functional components can't be error boundaries)

## Implementation

### Error Boundary Component

**Location:** `src/components/ErrorBoundary.tsx`

**Features:**
- ✅ Catches errors in child components
- ✅ Shows friendly error message to users
- ✅ Displays technical details in development mode
- ✅ Hides technical details in production
- ✅ Provides "Reload", "Try Again", and "Go Home" buttons
- ✅ Logs errors to console (ready for error reporting service integration)

### Where Error Boundaries are Used

#### 1. Root Layout (Global Protection)
**File:** `src/app/layout.tsx`
```tsx
<ErrorBoundary>
  <ToastProvider>
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  </ToastProvider>
</ErrorBoundary>
```

This catches errors in:
- All pages
- Header component
- Footer component
- Toast system

#### 2. Dashboard Layout
**File:** `src/app/(dashboard)/layout.tsx`
```tsx
<main className="p-4 lg:p-8">
  <ErrorBoundary>{children}</ErrorBoundary>
</main>
```

This catches errors in:
- Candidate dashboard pages
- Employer dashboard pages
- Dashboard-specific components

#### 3. Job Detail Page
**File:** `src/app/jobs/[id]/page.tsx`
```tsx
<ErrorBoundary>
  <div className="bg-secondary-50 py-8">
    {/* Job detail content */}
  </div>
</ErrorBoundary>
```

This catches errors in:
- Job detail content
- Application form modal
- Similar jobs section

## Error UI Behavior

### Development Mode
When an error occurs in development:
1. Shows "Something went wrong" heading
2. Displays friendly user message
3. **Shows error details:**
   - Error message
   - Component stack trace
4. Provides action buttons:
   - Reload Page
   - Try Again
   - Go Home
5. Shows helpful tips for users

### Production Mode
When an error occurs in production:
1. Shows "Something went wrong" heading
2. Displays friendly user message
3. **Hides technical details** (no error messages or stack traces)
4. Provides action buttons:
   - Reload Page
   - Try Again
   - Go Home
5. Shows helpful tips for users

## Testing Error Boundaries

### Test Page
Visit `/test-error` in development to test the error boundary:

**What it does:**
- Provides a button to trigger an intentional error
- Shows how the error boundary catches and displays errors
- Demonstrates the difference between working and error states
- Allows resetting to test recovery

**Note:** This page should be removed or protected in production.

### Manual Testing
To test error boundaries in any component:
```tsx
// Add this to any component to throw an error
if (someCondition) {
  throw new Error("Test error message");
}
```

## Adding Error Boundaries to New Pages

### Pattern 1: Wrap Entire Page
```tsx
export default function MyPage() {
  return (
    <ErrorBoundary>
      <div>
        {/* Your page content */}
      </div>
    </ErrorBoundary>
  );
}
```

### Pattern 2: Wrap Specific Sections
```tsx
export default function MyPage() {
  return (
    <div>
      <SafeHeader />
      <ErrorBoundary>
        <RiskyComponent />
      </ErrorBoundary>
      <SafeFooter />
    </div>
  );
}
```

### Pattern 3: Custom Fallback UI
```tsx
<ErrorBoundary fallback={<CustomErrorPage />}>
  <MyComponent />
</ErrorBoundary>
```

## Error Logging and Monitoring

The error boundary is set up to log errors but doesn't yet send them to a monitoring service. To integrate with an error reporting service:

1. Install your error monitoring service (e.g., Sentry):
```bash
npm install @sentry/nextjs
```

2. Update `ErrorBoundary.tsx`:
```tsx
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  console.error("Error Boundary caught an error:", error, errorInfo);

  // Send to error reporting service
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: errorInfo.componentStack,
      },
    },
  });
}
```

## Best Practices

### ✅ Do:
- Place error boundaries at strategic locations in your app
- Use multiple error boundaries to isolate errors
- Provide helpful user feedback in the error UI
- Log errors for debugging and monitoring
- Test error scenarios during development
- Hide technical details in production

### ❌ Don't:
- Wrap every single component (over-engineering)
- Ignore error logs
- Show raw error messages to users in production
- Forget to test error states
- Use error boundaries for control flow

## Common Errors Caught

Error boundaries will catch:
- ✅ Rendering errors
- ✅ Lifecycle method errors
- ✅ Constructor errors in child components
- ✅ Event handler errors (if they throw during render)

Error boundaries will NOT catch:
- ❌ Event handlers (use try-catch)
- ❌ Asynchronous code (use try-catch)
- ❌ Server-side rendering errors
- ❌ Errors in the error boundary itself

## Example Error Scenarios

### 1. Undefined Property Access
```tsx
function BrokenComponent({ user }) {
  return <div>{user.name.first}</div>; // Error if user.name is undefined
}
```

### 2. Failed API Response
```tsx
function DataComponent({ data }) {
  return <div>{data.map(item => item.value)}</div>; // Error if data is not an array
}
```

### 3. Type Errors
```tsx
function MathComponent({ numbers }) {
  return <div>{numbers.reduce((a, b) => a + b)}</div>; // Error if numbers is not an array
}
```

All of these will be caught by the error boundary and show the error UI.

## Future Improvements

Consider adding:
- [ ] Error categorization (network errors, validation errors, etc.)
- [ ] Retry logic with exponential backoff
- [ ] Integration with error monitoring service (Sentry, Rollbar, etc.)
- [ ] User feedback form in error UI
- [ ] Different error UIs for different error types
- [ ] Error recovery strategies
- [ ] A/B testing different error messages

## Resources

- [React Error Boundaries Documentation](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Error Boundaries in Next.js](https://nextjs.org/docs/pages/building-your-application/configuring/error-handling)
- [Sentry for Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
