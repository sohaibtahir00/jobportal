# Layout Components

Professional, responsive layout components for the Job Portal recruitment platform.

## Components

### Header

A sticky header with navigation, authentication buttons, and a responsive mobile menu.

**Features:**
- Sticky positioning with scroll effect
- Desktop navigation menu
- Mobile hamburger menu
- Sign In / Post a Job CTA buttons
- Smooth transitions and animations
- Body scroll lock when mobile menu is open
- Auto-closes mobile menu on window resize

**Props:**
```tsx
interface HeaderProps {
  className?: string;
}
```

**Navigation Links:**
- Find Jobs → `/jobs`
- Companies → `/companies`
- For Employers → `/employers`
- Resources → `/resources`

**Usage:**
```tsx
import { Header } from "@/components/layout";

<Header />
```

**Mobile Menu:**
- Opens with hamburger icon (Menu icon from lucide-react)
- Closes with X icon
- Full-screen overlay on mobile
- Prevents body scroll when open
- Includes navigation links and CTA buttons

---

### Footer

A comprehensive footer with multiple link sections, social media icons, and newsletter signup.

**Features:**
- Multi-column link organization
- Social media icons with hover effects
- Newsletter subscription form
- Responsive grid layout (6 columns on large screens)
- Dynamic copyright year
- Professional styling with Tailwind CSS

**Props:**
```tsx
interface FooterProps {
  className?: string;
}
```

**Link Sections:**
1. **For Job Seekers**
   - Browse Jobs
   - Job Alerts
   - Career Advice
   - Resume Builder
   - Salary Guide

2. **For Employers**
   - Post a Job
   - Browse Candidates
   - Employer Solutions
   - Pricing
   - Resources

3. **Company**
   - About Us
   - Contact
   - Careers
   - Press
   - Partners

4. **Legal**
   - Privacy Policy
   - Terms of Service
   - Cookie Policy
   - Accessibility
   - Sitemap

**Social Media:**
- Facebook
- Twitter
- LinkedIn
- Instagram
- GitHub

**Usage:**
```tsx
import { Footer } from "@/components/layout";

<Footer />
```

---

## Layout Integration

Both components are integrated into the root layout:

```tsx
// src/app/layout.tsx
import { Header, Footer } from "@/components/layout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
```

## Styling Details

### Header
- **Height**: 64px (h-16)
- **Position**: Fixed top with z-50
- **Background**: White with backdrop blur on scroll
- **Logo**: Primary blue background with white briefcase icon
- **Mobile breakpoint**: 768px (md)

### Footer
- **Background**: Light gray (secondary-50)
- **Border**: Top border in secondary-200
- **Padding**: 48px vertical on mobile, 64px on desktop
- **Grid**: 1 column → 2 columns (md) → 6 columns (lg)

### Colors Used
- **Primary**: Blue (#2563eb) - CTAs, links on hover
- **Secondary**: Grays - Text and backgrounds
- **White**: Main surfaces

## Icons

All icons from **lucide-react**:
- Briefcase (logo)
- Menu (hamburger menu)
- X (close menu)
- Facebook, Twitter, LinkedIn, Instagram, GitHub (social)
- Mail (newsletter)

## Responsive Behavior

### Desktop (≥768px)
- Full navigation visible in header
- Multi-column footer layout
- Hover states on all interactive elements

### Mobile (<768px)
- Hamburger menu button
- Full-screen mobile menu overlay
- Stacked footer columns
- Touch-optimized tap targets

## Accessibility

- Semantic HTML elements
- ARIA labels on icon-only buttons
- Keyboard navigation support
- Focus visible states
- Proper heading hierarchy
- External links open in new tab with rel="noopener noreferrer"

## Performance

- Client components only where needed (`"use client"` on Header)
- Optimized event listeners with cleanup
- Memoized logo and navigation items
- Minimal re-renders

## Customization

Both components accept a `className` prop for additional styling:

```tsx
<Header className="shadow-lg" />
<Footer className="bg-gradient-to-r from-secondary-50 to-secondary-100" />
```

## Dependencies

- **Next.js** - Link component for client-side navigation
- **React** - Hooks (useState, useEffect)
- **lucide-react** - Icon components
- **Tailwind CSS** - Utility-first styling
- **@/lib/utils** - cn() utility for class name merging
- **@/components/ui** - Button component
