# AI/ML Job Portal

A modern, full-featured job portal built with Next.js 14, TypeScript, and Tailwind CSS, specializing in AI, Machine Learning, Data Science, and tech positions.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### For Job Seekers
- 🔍 **Advanced Job Search** - Filter by niche, location, remote type, experience level, salary
- 📊 **Personalized Dashboard** - Track applications, scheduled interviews, and messages
- 👤 **Comprehensive Profile** - Multi-tab profile with skills, experience, preferences
- 🎯 **Job Recommendations** - AI-powered job matching based on profile
- 📝 **Easy Applications** - One-click apply with saved profile information
- 🔔 **Real-time Notifications** - Toast notifications for all actions

### For Employers
- 💼 **Job Posting** - Multi-step wizard for creating detailed job listings
- 📈 **Analytics Dashboard** - Track applications, views, and hiring metrics
- 👥 **Candidate Management** - Review applications and manage hiring pipeline
- 🎨 **Company Branding** - Showcase company culture and benefits
- 📊 **Performance Charts** - Visualize hiring data with interactive charts

### Technical Features
- ⚡ **Next.js 14 App Router** - Modern React framework with server components
- 🎨 **Tailwind CSS** - Utility-first CSS with custom design system
- 📱 **Fully Responsive** - Mobile-first design (375px+)
- ♿ **Accessible** - WCAG 2.1 compliant with keyboard navigation
- 🔍 **SEO Optimized** - Complete metadata, Open Graph, JSON-LD structured data
- 🚀 **Performance** - Optimized builds, code splitting, lazy loading
- 🎯 **Type Safe** - Full TypeScript coverage with strict mode
- 🧪 **Form Validation** - Zod schemas with React Hook Form
- 🎭 **Loading States** - Skeleton loaders for better UX
- 🛡️ **Error Handling** - Error boundaries and custom 404 pages

## 📁 Project Structure

```
job-portal/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (auth)/              # Auth pages (login, signup, forgot password)
│   │   ├── (dashboard)/         # Protected dashboard routes
│   │   │   ├── candidate/       # Candidate dashboard & profile
│   │   │   └── employer/        # Employer dashboard & job posting
│   │   ├── jobs/                # Job listings and details
│   │   ├── employers/           # Employers landing page
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── page.tsx             # Homepage
│   │   ├── not-found.tsx        # Custom 404 page
│   │   ├── error.tsx            # Error boundary
│   │   └── globals.css          # Global styles & utilities
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI components (Button, Input, Card, etc.)
│   │   ├── layout/              # Layout components (Header, Footer, Dashboard)
│   │   ├── jobs/                # Job-specific components
│   │   └── auth/                # Auth components
│   │
│   ├── lib/                     # Utility functions & helpers
│   │   ├── mockData.ts          # Mock data (50 jobs, 20 candidates, 10 employers)
│   │   ├── validations.ts       # Zod validation schemas
│   │   ├── seo.ts               # SEO helpers (JSON-LD generators)
│   │   └── utils.ts             # Utility functions
│   │
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts             # All types (Job, Candidate, Employer, etc.)
│   │
│   └── hooks/                   # Custom React hooks
│
├── public/                      # Static assets
│   ├── robots.txt               # Search engine crawler instructions
│   └── sitemap.xml              # Sitemap for search engines
│
├── tailwind.config.ts           # Tailwind configuration with custom colors
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/job-portal.git
   cd job-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design System

### Color Palette

```css
Primary (Blue):   #2563eb (600), #1d4ed8 (700)
Secondary (Gray): #f9fafb (50), #e5e7eb (200), #111827 (900)
Accent (Purple):  #9333ea (600)
Success (Green):  #16a34a (600)
Warning (Amber):  #d97706 (600)
Danger (Red):     #dc2626 (600)
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Semibold, tracking-tight
- **Body**: Regular, 16px base size

### Component Patterns
- **Composition**: Components can be composed (e.g., `<Card>`, `<CardHeader>`, `<CardContent>`)
- **Variants**: Multiple visual variants (primary, secondary, outline, etc.)
- **Sizes**: Small, medium, large variants where applicable
- **forwardRef**: All components support ref forwarding
- **TypeScript**: Fully typed with interfaces

## 🗺️ Key Pages & Routes

### Public Routes
- `/` - Homepage with hero, stats, featured jobs
- `/jobs` - Job listings with filters and search
- `/jobs/[id]` - Individual job detail page
- `/employers` - Employers landing page

### Auth Routes
- `/login` - Sign in
- `/signup` - Create account (candidate or employer)
- `/forgot-password` - Password reset

### Candidate Dashboard
- `/candidate/dashboard` - Overview with applications and recommendations
- `/candidate/profile` - Edit profile (5 tabs: Info, Experience, Links, Skills, Preferences)

### Employer Dashboard
- `/employer/dashboard` - Analytics and job management
- `/employer/jobs/new` - Post new job (3-step wizard)

## 📊 Mock Data

The app includes comprehensive mock data for development:
- **50 Jobs** across 6 niches (AI/ML, Healthcare IT, FinTech, Cybersecurity, Data Science, Cloud)
- **20 Candidates** with varied skills and experience levels
- **10 Employers** representing different company sizes and industries
- **100 Applications** with various statuses

## 🔍 SEO & Metadata

### Implemented Features
- ✅ Unique meta titles and descriptions for every page
- ✅ Open Graph tags for social media sharing
- ✅ Twitter Card metadata
- ✅ JSON-LD structured data for job postings (Google Jobs)
- ✅ Sitemap.xml for search engines
- ✅ Robots.txt with proper crawler instructions
- ✅ Dynamic metadata for job pages

## 📝 Form Validation

All forms use **React Hook Form** + **Zod** for validation with:
- Real-time validation
- Error message display
- Loading states
- Success/error toast notifications

## ♿ Accessibility

- ✅ Semantic HTML elements
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus visible states
- ✅ Touch-friendly targets (44px minimum)
- ✅ Color contrast compliance (WCAG AA)

## 🚀 Future Enhancements

### Backend Integration
- [ ] Connect to database (PostgreSQL + Prisma)
- [ ] Implement authentication (NextAuth.js)
- [ ] Add API routes for CRUD operations
- [ ] File upload for resumes and company logos

### Features
- [ ] Real-time chat
- [ ] Email notifications
- [ ] AI-powered matching
- [ ] Video interview scheduling
- [ ] Salary insights
- [ ] Company reviews

### Testing & DevOps
- [ ] Unit tests (Jest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Deployment to Vercel

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Recharts](https://recharts.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---

**Built with ❤️ using Next.js 14 and TypeScript**
