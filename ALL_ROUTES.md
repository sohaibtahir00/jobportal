# Complete Route List - Job Portal

**Domain:** https://jobportal-rouge-mu.vercel.app

---

## Static Routes (20 routes)

### Main Pages
1. **Homepage**
   - https://jobportal-rouge-mu.vercel.app/

2. **About**
   - https://jobportal-rouge-mu.vercel.app/about

3. **Jobs Listing**
   - https://jobportal-rouge-mu.vercel.app/jobs

4. **Employers Page**
   - https://jobportal-rouge-mu.vercel.app/employers

5. **Skills Assessment**
   - https://jobportal-rouge-mu.vercel.app/skills-assessment

6. **Claim Your Jobs**
   - https://jobportal-rouge-mu.vercel.app/claim

7. **Blog Listing**
   - https://jobportal-rouge-mu.vercel.app/blog

8. **Components Showcase**
   - https://jobportal-rouge-mu.vercel.app/components

---

### Authentication Routes (3 routes)
9. **Login**
   - https://jobportal-rouge-mu.vercel.app/login

10. **Sign Up**
    - https://jobportal-rouge-mu.vercel.app/signup

11. **Forgot Password**
    - https://jobportal-rouge-mu.vercel.app/forgot-password

---

### Candidate Dashboard Routes (2 routes)
12. **Candidate Dashboard**
    - https://jobportal-rouge-mu.vercel.app/candidate/dashboard

13. **Candidate Profile**
    - https://jobportal-rouge-mu.vercel.app/candidate/profile

---

### Employer Dashboard Routes (2 routes)
14. **Employer Dashboard**
    - https://jobportal-rouge-mu.vercel.app/employer/dashboard

15. **Post New Job**
    - https://jobportal-rouge-mu.vercel.app/employer/jobs/new

---

### Legal & Other Pages (3 routes)
16. **Privacy Policy**
    - https://jobportal-rouge-mu.vercel.app/privacy

17. **Terms of Service**
    - https://jobportal-rouge-mu.vercel.app/terms

18. **Test Error Page** (for testing)
    - https://jobportal-rouge-mu.vercel.app/test-error

---

## Dynamic Routes

### Blog Posts (10 posts)
19. **How to Become an AI/ML Engineer in 2025**
    - https://jobportal-rouge-mu.vercel.app/blog/how-to-become-ai-ml-engineer-2025

20. **2025 AI Engineer Salary Guide**
    - https://jobportal-rouge-mu.vercel.app/blog/2025-ai-engineer-salary-guide

21. **Top 20 Machine Learning Interview Questions**
    - https://jobportal-rouge-mu.vercel.app/blog/top-20-machine-learning-interview-questions

22. **How to Ace the AI/ML Skills Assessment**
    - https://jobportal-rouge-mu.vercel.app/blog/how-to-ace-ai-ml-skills-assessment

23. **Junior to Senior: ML Engineer Career Path**
    - https://jobportal-rouge-mu.vercel.app/blog/junior-to-senior-ml-engineer-career-path

24. **Remote vs. On-site: What Pays More?**
    - https://jobportal-rouge-mu.vercel.app/blog/remote-vs-onsite-tech-salary-comparison

25. **5 Ways to Prepare for Your Skills Assessment**
    - https://jobportal-rouge-mu.vercel.app/blog/5-ways-prepare-skills-assessment

26. **What Employers Look for in Skills Score Cards**
    - https://jobportal-rouge-mu.vercel.app/blog/what-employers-look-for-skills-score-cards

27. **System Design for ML Engineers**
    - https://jobportal-rouge-mu.vercel.app/blog/system-design-for-ml-engineers

28. **Negotiating Your Tech Salary: A Complete Guide**
    - https://jobportal-rouge-mu.vercel.app/blog/negotiating-tech-salary-complete-guide

---

### Job Detail Pages (Dynamic - Examples with Mock IDs)
The site uses dynamic routing for job details. Here are sample URLs:

29. **Job #1 - Senior Machine Learning Engineer**
    - https://jobportal-rouge-mu.vercel.app/jobs/1

30. **Job #2 - AI Research Scientist**
    - https://jobportal-rouge-mu.vercel.app/jobs/2

31. **Job #3-20+** (Additional job postings)
    - https://jobportal-rouge-mu.vercel.app/jobs/3
    - https://jobportal-rouge-mu.vercel.app/jobs/4
    - ... (and so on for all mock jobs in the system)

---

## Summary

### Total Routes: **31 Pages**
- **20 Static Pages** (including auth, dashboards, legal)
- **10 Blog Post Pages** (dynamic via slug)
- **1+ Job Detail Pages** (dynamic via ID)

### Route Organization:
- ✅ Public pages (no auth required)
- ✅ Authentication pages (login, signup, forgot password)
- ✅ Candidate-protected routes (dashboard, profile)
- ✅ Employer-protected routes (dashboard, post jobs)
- ✅ Dynamic content routes (blog posts, job details)
- ✅ Legal & informational pages

---

## Query Parameters Support

Several pages support query parameters for filtering:

**Jobs Page with Filters:**
- By niche: `https://jobportal-rouge-mu.vercel.app/jobs?niche=ai-ml`
- By location: `https://jobportal-rouge-mu.vercel.app/jobs?location=remote`
- Combined: `https://jobportal-rouge-mu.vercel.app/jobs?niche=fintech&location=New+York`

**Blog with Category:**
- By category: `https://jobportal-rouge-mu.vercel.app/blog?category=Career+Guide`

---

## Notes

1. All routes use Next.js 14 App Router
2. Dynamic routes are pre-rendered at build time (SSG)
3. Protected routes redirect to login if user not authenticated
4. All routes are SEO-optimized with proper metadata
5. Mobile-responsive across all routes

---

**Generated:** January 2025
**Build Status:** ✅ Production Ready
