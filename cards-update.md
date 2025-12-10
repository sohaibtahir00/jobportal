# Card Components Audit - Job Portal Frontend

## Summary
- **Total Card Instances**: ~1,137
- **Files Using Cards**: 88
- **Dedicated Card Components**: 12

---

## SECTION 1: REUSABLE CARD COMPONENTS

### 1. JobCard
- **File**: `src/components/jobs/JobCard.tsx`
- **Purpose**: Display job listings on public `/jobs` page
- **Custom Styling**:
  - `className="h-full transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden rounded-lg"`
  - Inline: `border: '1px solid #e2e8f0'`, `borderLeft: '3px solid #3b82f6'`

### 2. CandidateJobCard
- **File**: `src/components/jobs/CandidateJobCard.tsx`
- **Purpose**: Job listings in candidate dashboard with save functionality
- **Custom Styling**:
  - `className="h-full transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden relative"`

### 3. CompanyCard
- **File**: `src/components/companies/CompanyCard.tsx`
- **Purpose**: Display company profiles on companies listing page
- **Custom Styling**:
  - `className="h-full transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"`

### 4. ApplicationCard
- **File**: `src/components/applications/ApplicationCard.tsx`
- **Purpose**: Display application status in candidate dashboard
- **Custom Styling**:
  - `className="transition-all hover:shadow-lg"`

### 5. SavedJobCard
- **File**: `src/components/saved-jobs/SavedJobCard.tsx`
- **Purpose**: Display saved jobs in candidate saved jobs page
- **Custom Styling**:
  - `className="transition-all hover:shadow-lg"`

### 6. MatchScoreCard
- **File**: `src/components/jobs/MatchScoreCard.tsx`
- **Purpose**: Display job match compatibility scores
- **Variants**: `full`, `compact`, `mini`

### 7. SkillsScoreCard
- **File**: `src/components/skills/SkillsScoreCard.tsx`
- **Purpose**: Display skills assessment results
- **Custom Styling**:
  - Full: `className="border-2 border-accent-200 bg-white shadow-xl"`
  - Compact: `className="border-2 border-primary-200"`

### 8. ApplicationDetailModal
- **File**: `src/components/applications/ApplicationDetailModal.tsx`
- **Card Count**: 12 instances

### 9. ContactInfoGate
- **File**: `src/components/employer/ContactInfoGate.tsx`
- **Card Count**: 12 instances

### 10. DecisionModal
- **File**: `src/components/interviews/DecisionModal.tsx`
- **Card Count**: 2 instances

### 11. FiltersSidebar
- **File**: `src/components/jobs/FiltersSidebar.tsx`
- **Card Count**: 2 instances

### 12. RecommendedJobs
- **File**: `src/components/jobs/RecommendedJobs.tsx`
- **Card Count**: 6 instances

---

## SECTION 2: PUBLIC PAGES

| Page | File Path | Card Count | Notes |
|------|-----------|------------|-------|
| Homepage | `src/app/(public)/page.tsx` | ~15+ | Hero, featured jobs, benefits |
| Jobs Listing | `src/app/(public)/jobs/page.tsx` | Uses JobCard | Main job listings |
| Job Detail | `src/app/(public)/jobs/[id]/page.tsx` | Multiple | Job details, company info |
| AI/ML Jobs | `src/app/(public)/ai-ml-jobs/page.tsx` | Uses JobCard | Niche category |
| Cybersecurity Jobs | `src/app/(public)/cybersecurity-jobs/page.tsx` | Uses JobCard | Niche category |
| FinTech Jobs | `src/app/(public)/fintech-jobs/page.tsx` | Uses JobCard | Niche category |
| Healthcare IT Jobs | `src/app/(public)/healthcare-it-jobs/page.tsx` | Uses JobCard | Niche category |
| Companies Listing | `src/app/(public)/companies/page.tsx` | Uses CompanyCard | Company grid |
| Company Detail | `src/app/(public)/companies/[slug]/page.tsx` | Multiple | Company profile |
| About | `src/app/(public)/about/page.tsx` | Multiple | Company values |
| Pricing | `src/app/(public)/pricing/page.tsx` | Multiple | Pricing tiers |
| FAQ | `src/app/(public)/faq/page.tsx` | Multiple | FAQ items |
| How It Works | `src/app/(public)/how-it-works/page.tsx` | Multiple | Process steps |
| Skills Assessment | `src/app/(public)/skills-assessment/start/page.tsx` | Multiple | Assessment intro |
| Assessment Results | `src/app/(public)/skills-assessment/results/[id]/page.tsx` | Uses SkillsScoreCard | Results display |
| Assessment Prep | `src/app/(public)/skills-assessment/prep/page.tsx` | Multiple | Prep resources |
| Practice Questions | `src/app/(public)/skills-assessment/prep/practice/page.tsx` | Multiple | Practice |
| Sample Questions | `src/app/(public)/skills-assessment/prep/sample-questions/page.tsx` | Multiple | Samples |
| Study Guide | `src/app/(public)/skills-assessment/prep/study-guide/page.tsx` | Multiple | Guide |
| Tips | `src/app/(public)/skills-assessment/prep/tips/page.tsx` | Multiple | Tips |
| Blog | `src/app/(public)/blog/page.tsx` | Multiple | Blog list |
| Blog Post | `src/app/(public)/blog/[slug]/page.tsx` | Multiple | Blog article |
| Resources | `src/app/(public)/resources/page.tsx` | Multiple | Learning resources |
| Contact | `src/app/(public)/contact/page.tsx` | 1 | Contact form |
| Claim | `src/app/(public)/claim/page.tsx` | Multiple | Claim info |
| Claim Success | `src/app/(public)/claim/success/page.tsx` | 1 | Success message |
| Claim Job | `src/app/(public)/claim/[job-id]/page.tsx` | Multiple | Job details |
| Privacy | `src/app/(public)/privacy/page.tsx` | Multiple | Privacy policy |
| Terms | `src/app/(public)/terms/page.tsx` | Multiple | Terms of service |
| Employers Info | `src/app/(public)/employers/page.tsx` | Multiple | Employer benefits |
| Components | `src/app/(public)/components/page.tsx` | Multiple | UI showcase |

---

## SECTION 3: CANDIDATE DASHBOARD

| Page | File Path | Card Count | Custom Styling |
|------|-----------|------------|----------------|
| Dashboard | `src/app/(dashboard)/candidate/dashboard/page.tsx` | 11 | Gradient banners, highlight cards |
| Applications | `src/app/(dashboard)/candidate/applications/page.tsx` | 9 | Stat cards with gradients |
| Jobs | `src/app/(dashboard)/candidate/jobs/page.tsx` | Uses CandidateJobCard | - |
| Saved Jobs | `src/app/(dashboard)/candidate/saved/page.tsx` | Uses SavedJobCard | - |
| Assessment | `src/app/(dashboard)/candidate/assessment/page.tsx` | 8 | Warning cards (red), assessment cards (gradient) |
| Interviews | `src/app/(dashboard)/candidate/interviews/page.tsx` | 14+ | Action-required styling |
| Interview Select | `src/app/(dashboard)/candidate/interviews/select/[id]/page.tsx` | 2+ | Info cards |
| Offers | `src/app/(dashboard)/candidate/offers/page.tsx` | Multiple | - |
| Placements | `src/app/(dashboard)/candidate/placements/page.tsx` | Multiple | - |
| Profile | `src/app/(dashboard)/candidate/profile/page.tsx` | Multiple | Profile sections |
| Profile Views | `src/app/(dashboard)/candidate/profile-views/page.tsx` | Multiple | - |
| Recommendations | `src/app/(dashboard)/candidate/recommendations/page.tsx` | Multiple | - |
| Exclusive Jobs | `src/app/(dashboard)/candidate/exclusive-jobs/page.tsx` | 2+ | shadow-xl |
| Messages | `src/app/(dashboard)/candidate/messages/page.tsx` | Multiple | - |
| Settings | `src/app/(dashboard)/candidate/settings/page.tsx` | Multiple | - |

---

## SECTION 4: EMPLOYER DASHBOARD

| Page | File Path | Card Count | Notes |
|------|-----------|------------|-------|
| Dashboard | `src/app/(dashboard)/employer/dashboard/page.tsx` | Multiple | Stats, job listings |
| Jobs | `src/app/(dashboard)/employer/jobs/page.tsx` | Multiple | Job management |
| New Job | `src/app/(dashboard)/employer/jobs/new/page.tsx` | Multiple | Job form |
| Edit Job | `src/app/(dashboard)/employer/jobs/[id]/edit/page.tsx` | Multiple | Edit form |
| Job Applicants | `src/app/(dashboard)/employer/jobs/[id]/applicants/page.tsx` | Multiple | Applicant list |
| All Applicants | `src/app/(dashboard)/employer/applicants/page.tsx` | Multiple | Filtered list |
| Applicant Detail | `src/app/(dashboard)/employer/applicants/[id]/page.tsx` | Multiple | Full profile |
| Candidate Profile | `src/app/(dashboard)/employer/candidates/[id]/page.tsx` | Multiple | Candidate info |
| Interviews | `src/app/(dashboard)/employer/interviews/page.tsx` | Multiple | Interview management |
| Interview Availability | `src/app/(dashboard)/employer/interviews/availability/[applicationId]/page.tsx` | Multiple | Scheduling |
| Interview Confirm | `src/app/(dashboard)/employer/interviews/confirm/[id]/page.tsx` | Multiple | Confirmation |
| Offers | `src/app/(dashboard)/employer/offers/page.tsx` | Multiple | Offer management |
| Placements | `src/app/(dashboard)/employer/placements/page.tsx` | Multiple | Placement records |
| Placement Detail | `src/app/(dashboard)/employer/placements/[id]/page.tsx` | Multiple | Payment status |
| Candidate Search | `src/app/(dashboard)/employer/search/page.tsx` | Multiple | Search results |
| Invoices | `src/app/(dashboard)/employer/invoices/page.tsx` | Multiple | Billing history |
| Agreement | `src/app/(dashboard)/employer/agreement/page.tsx` | 12 | Agreement sections |
| Claim | `src/app/(dashboard)/employer/claim/page.tsx` | Multiple | Claim info |
| Settings | `src/app/(dashboard)/employer/settings/page.tsx` | Multiple | Account settings |
| Messages | `src/app/(dashboard)/employer/messages/page.tsx` | Multiple | Messaging |

---

## SECTION 5: ADMIN DASHBOARD

| Page | File Path | Card Count | Custom Styling |
|------|-----------|------------|----------------|
| Dashboard | `src/app/admin/page.tsx` | 30 | Various gradient backgrounds |
| Users | `src/app/admin/users/page.tsx` | 12 | User listings |
| Jobs | `src/app/admin/jobs/page.tsx` | Multiple | Job management |
| Candidates | `src/app/admin/candidates/page.tsx` | Multiple | Candidate listings |
| Employers | `src/app/admin/employers/page.tsx` | Multiple | Employer listings |
| Assessments | `src/app/admin/assessments/page.tsx` | Multiple | Assessment management |
| Check-ins | `src/app/admin/check-ins/page.tsx` | 16 | Survey records |
| Introductions | `src/app/admin/introductions/page.tsx` | 26 | Expiration tracking |
| Placements | `src/app/admin/placements/page.tsx` | 14 | Payment status |
| Create Placement | `src/app/(dashboard)/admin/placements/create/page.tsx` | 8 | Error/success cards |
| Bulk Payment | `src/app/(dashboard)/admin/placements/bulk-payment/page.tsx` | 5 | Upload sections |
| Pipeline | `src/app/admin/pipeline/page.tsx` | 12 | Charts |
| Reports | `src/app/admin/reports/page.tsx` | 20 | Report sections |
| Settings | `src/app/admin/settings/page.tsx` | 8 | Config sections |
| Circumvention | `src/app/admin/circumvention/page.tsx` | Multiple | Violation records |
| Invoices | `src/app/admin/invoices/page.tsx` | Multiple | Invoice management |

---

## SECTION 6: OTHER PAGES

| Page | File Path | Card Count | Notes |
|------|-----------|------------|-------|
| Notifications | `src/app/(dashboard)/notifications/page.tsx` | Multiple | Notification list |
| Check-in Response | `src/app/check-in/respond/[token]/page.tsx` | 16 | Survey questions |
| Introduction Response | `src/app/introductions/respond/[token]/page.tsx` | 26 | Decision options |

---

## COMMON STYLING PATTERNS

### Hover Effects
```
hover:shadow-lg
hover:-translate-y-1
transition-all
```

### Gradient Backgrounds
```
bg-gradient-to-r from-primary-600 to-accent-600
bg-gradient-to-br from-blue-50 to-blue-100
bg-gradient-to-br from-primary-50 to-accent-50
```

### Border Styling
```
border-2 border-primary-200
border-l-4 border-primary-500
border-red-200 bg-red-50 (error states)
border-green-200 bg-green-50 (success states)
```

### Shadow Variants
```
shadow-lg
shadow-xl
```

### Padding
```
p-4  (compact)
p-6  (standard)
p-8  (prominent)
p-12 (full-width)
```

---

## CARDS TO UPDATE

### Priority 1: Reusable Components (Update here = affects multiple pages)
- [ ] `JobCard.tsx` - Already has left accent border
- [ ] `CandidateJobCard.tsx`
- [ ] `CompanyCard.tsx`
- [ ] `ApplicationCard.tsx`
- [ ] `SavedJobCard.tsx`
- [ ] `MatchScoreCard.tsx`
- [ ] `SkillsScoreCard.tsx`

### Priority 2: High-Traffic Public Pages
- [ ] Homepage cards
- [ ] Job Detail page cards
- [ ] Company Detail page cards

### Priority 3: Dashboard Cards
- [ ] Candidate Dashboard stat cards
- [ ] Employer Dashboard stat cards
- [ ] Admin Dashboard metric cards

### Priority 4: Page-Specific Cards
- [ ] All remaining inline Card usages

---

## NOTES

- Base Card component: `src/components/ui/Card.tsx`
- Default styling: `rounded-lg border border-secondary-200 bg-white shadow-sm`
- Current JobCard accent: `borderLeft: '3px solid #3b82f6'` (primary-500)
