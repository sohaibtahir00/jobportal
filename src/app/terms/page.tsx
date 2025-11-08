"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { useState, useEffect } from "react";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let currentSection = "";

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 150) {
          currentSection = section.getAttribute("id") || "";
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "service-description", title: "2. Service Description" },
    { id: "success-fees", title: "3. Success Fee Terms" },
    { id: "payment-terms", title: "4. Payment Terms" },
    { id: "replacement-guarantee", title: "5. 90-Day Replacement Guarantee" },
    { id: "job-aggregation", title: "6. Job Aggregation and Claiming" },
    { id: "skills-assessment", title: "7. Skills Assessment Terms" },
    { id: "user-accounts", title: "8. User Accounts and Registration" },
    { id: "user-responsibilities", title: "9. User Responsibilities" },
    { id: "intellectual-property", title: "10. Intellectual Property Rights" },
    { id: "privacy-data", title: "11. Privacy and Data Usage" },
    { id: "limitation-liability", title: "12. Limitation of Liability" },
    { id: "dispute-resolution", title: "13. Dispute Resolution" },
    { id: "termination", title: "14. Termination" },
    { id: "changes-terms", title: "15. Changes to Terms" },
    { id: "severability", title: "16. Severability" },
    { id: "contact", title: "17. Contact Information" },
  ];

  return (
    <div className="bg-secondary-50 py-12">
      <div className="container">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-secondary-900">
            Terms of Service
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600">
            Last updated: January 8, 2025
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents - Sticky Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <Card className="p-4">
                  <h2 className="text-sm font-semibold text-secondary-900 mb-3 uppercase tracking-wide">
                    Table of Contents
                  </h2>
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-all ${
                          activeSection === section.id
                            ? "bg-primary-50 text-primary-700 font-semibold"
                            : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                        }`}
                      >
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </Card>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <Card>
                <CardContent className="p-8 md:p-12 space-y-12">
                  {/* Section 1: Acceptance of Terms */}
                  <section id="acceptance">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      1. Acceptance of Terms
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        Welcome to our AI/ML Job Portal ("Platform", "Service", "we", "us", or "our"). By accessing or using our Platform, you agree to be bound by these Terms of Service ("Terms").
                      </p>
                      <p>
                        If you do not agree to these Terms, you may not access or use the Service. Your continued use of the Platform constitutes acceptance of any modifications to these Terms.
                      </p>
                      <p>
                        These Terms apply to all users of the Platform, including candidates seeking employment and employers posting job opportunities.
                      </p>
                    </div>
                  </section>

                  {/* Section 2: Service Description */}
                  <section id="service-description">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      2. Service Description
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        Our Platform provides a specialized job matching service focused on AI/ML and technology positions. Our services include:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Job aggregation from public sources and direct employer postings</li>
                        <li>Skills-verified candidate profiles with proctored assessments</li>
                        <li>AI-powered job matching and recommendations</li>
                        <li>Application tracking and management tools</li>
                        <li>Direct messaging between employers and candidates</li>
                        <li>Success-based placement services for employers</li>
                      </ul>
                      <p>
                        We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time without prior notice.
                      </p>
                    </div>
                  </section>

                  {/* Section 3: Success Fee Terms */}
                  <section id="success-fees">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      3. Success Fee Terms
                    </h2>
                    <div className="space-y-4 text-secondary-700">
                      <p>
                        Employers using our Platform to hire candidates agree to pay a success-based placement fee upon successful hire. The fee structure is tiered based on the candidate's annual base salary:
                      </p>

                      <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-secondary-900">Junior/Mid-Level Positions</p>
                            <p className="text-sm text-secondary-600">Annual salary: $80,000 - $130,000</p>
                          </div>
                          <p className="text-2xl font-bold text-primary-700">15%</p>
                        </div>
                        <div className="border-t border-primary-200 pt-3 flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-secondary-900">Senior Positions</p>
                            <p className="text-sm text-secondary-600">Annual salary: $130,000 - $170,000</p>
                          </div>
                          <p className="text-2xl font-bold text-primary-700">18%</p>
                        </div>
                        <div className="border-t border-primary-200 pt-3 flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-secondary-900">Lead/Staff Positions</p>
                            <p className="text-sm text-secondary-600">Annual salary: $170,000+</p>
                          </div>
                          <p className="text-2xl font-bold text-primary-700">20%</p>
                        </div>
                      </div>

                      <p className="font-semibold text-secondary-900 mt-4">Fee Calculation:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>The success fee is calculated as a percentage of the candidate's first-year annual base salary</li>
                        <li>Base salary includes guaranteed compensation only (excludes bonuses, equity, or benefits)</li>
                        <li>For hourly positions, annual salary is calculated as: hourly rate × 2,080 hours</li>
                        <li>For contract-to-hire positions, fees apply upon conversion to full-time employment</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">When Fees Apply:</p>
                      <p>
                        Success fees are due when an employer extends a written offer of employment to a candidate that was sourced through or matched by our Platform, and the candidate accepts that offer. This includes:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Direct hires through the Platform</li>
                        <li>Candidates who applied through aggregated job listings claimed by the employer</li>
                        <li>Candidates contacted through our messaging system</li>
                        <li>Re-hires of candidates within 12 months of initial introduction through our Platform</li>
                      </ul>
                    </div>
                  </section>

                  {/* Section 4: Payment Terms */}
                  <section id="payment-terms">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      4. Payment Terms
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p className="font-semibold text-secondary-900">Payment Schedule:</p>
                      <p>
                        Success fees are payable in two installments:
                      </p>
                      <div className="bg-accent-50 border-2 border-accent-200 rounded-lg p-6 space-y-3">
                        <div>
                          <p className="font-semibold text-secondary-900">First Payment (50%)</p>
                          <p className="text-sm">Due within 7 business days of candidate's acceptance of written offer</p>
                        </div>
                        <div className="border-t border-accent-200 pt-3">
                          <p className="font-semibold text-secondary-900">Second Payment (50%)</p>
                          <p className="text-sm">Due 30 calendar days after candidate's start date</p>
                        </div>
                      </div>

                      <p className="font-semibold text-secondary-900 mt-4">Payment Methods:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>ACH bank transfer (preferred)</li>
                        <li>Wire transfer</li>
                        <li>Credit card (subject to 3% processing fee)</li>
                        <li>Check (must be received within payment deadline)</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Late Payments:</p>
                      <p>
                        Late payments are subject to a 1.5% monthly interest charge (18% APR) on the outstanding balance. Accounts with payments overdue by more than 30 days may result in suspension of Platform access and referral to collections.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Invoicing:</p>
                      <p>
                        Invoices will be sent electronically to the employer's registered email address. Employers are responsible for maintaining accurate billing contact information.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Disputes:</p>
                      <p>
                        Payment disputes must be raised in writing within 15 days of invoice date. Undisputed portions of invoices remain due according to the payment schedule.
                      </p>
                    </div>
                  </section>

                  {/* Section 5: 90-Day Replacement Guarantee */}
                  <section id="replacement-guarantee">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      5. 90-Day Replacement Guarantee
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        We stand behind the quality of our placements. If a hired candidate voluntarily leaves or is terminated for cause within 90 days of their start date, we will provide a replacement candidate at no additional placement fee.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Guarantee Coverage:</p>
                      <p>This guarantee applies when:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>The candidate voluntarily resigns within 90 days of start date</li>
                        <li>The candidate is terminated for cause (performance, conduct, or attendance issues) within 90 days</li>
                        <li>The employer has paid all invoiced fees in full and on time</li>
                        <li>The employer notifies us in writing within 5 business days of the candidate's departure</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Guarantee Exclusions:</p>
                      <p>This guarantee does NOT apply if:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>The candidate is laid off due to company restructuring, downsizing, or budget cuts</li>
                        <li>The position is eliminated or substantially changed from the original job description</li>
                        <li>The candidate's departure is due to workplace harassment, discrimination, or hostile work environment</li>
                        <li>The employer breaches the employment agreement (salary, benefits, or working conditions)</li>
                        <li>Outstanding payment obligations exist</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Replacement Process:</p>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>Employer notifies us in writing within 5 business days with termination documentation</li>
                        <li>We review the circumstances to confirm guarantee eligibility</li>
                        <li>Upon approval, we initiate a replacement search with the same urgency as the original search</li>
                        <li>Replacement candidates are presented within 30 days</li>
                        <li>No additional placement fee is charged for the replacement hire</li>
                      </ol>

                      <p className="font-semibold text-secondary-900 mt-4">Limitations:</p>
                      <p>
                        This guarantee is limited to one replacement per original placement. If the replacement candidate also departs within 90 days, the employer may request a partial refund (50% of fees paid) in lieu of a second replacement.
                      </p>

                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-yellow-900">
                          <strong>Note:</strong> This guarantee is our sole liability for unsuccessful placements. All other warranties, express or implied, are disclaimed to the fullest extent permitted by law.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 6: Job Aggregation and Claiming */}
                  <section id="job-aggregation">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      6. Job Aggregation and Claiming
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p className="font-semibold text-secondary-900">Job Aggregation:</p>
                      <p>
                        Our Platform aggregates job listings from publicly available sources including company career pages, job boards, and public APIs. This service helps candidates discover opportunities and allows employers to increase visibility for their openings.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Employer Job Claiming:</p>
                      <p>
                        Employers can "claim" aggregated job listings that belong to their organization. By claiming a job, employers:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Gain access to candidates who apply through our Platform</li>
                        <li>Can view candidate profiles and skills assessments</li>
                        <li>Receive application notifications and analytics</li>
                        <li>Can update or remove the job listing</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Fee Applicability for Aggregated Jobs:</p>
                      <p>
                        <strong>Important:</strong> Success fees apply to hires made through candidates who applied via aggregated job listings that were claimed by the employer. By claiming a job listing, employers acknowledge:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>They accept our success fee terms for any resulting hires</li>
                        <li>Candidates applying through the Platform are introduced by our Service</li>
                        <li>The 90-day replacement guarantee applies to these hires</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Removal Requests:</p>
                      <p>
                        Employers may request removal of aggregated job listings by contacting us at jobs@example.com. We will remove listings within 48 hours. However, success fees still apply to candidates who applied before removal.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Job Posting Rights:</p>
                      <p>
                        Employers may also post jobs directly to our Platform. Direct postings receive:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Higher visibility in search results</li>
                        <li>Featured placement in candidate recommendations</li>
                        <li>Priority access to skills-verified candidates</li>
                        <li>Advanced analytics and tracking</li>
                      </ul>

                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-blue-900">
                          <strong>For Candidates:</strong> Jobs marked as "Aggregated" link to external application systems. Jobs marked as "Direct" allow you to apply directly through our Platform with your verified profile.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 7: Skills Assessment Terms */}
                  <section id="skills-assessment">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      7. Skills Assessment Terms
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        Our Platform offers proctored skills assessments to verify candidate competencies. These assessments are designed to provide employers with objective measures of technical abilities.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Assessment Process:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Assessments are proctored using webcam monitoring and screen recording</li>
                        <li>Candidates must complete assessments in one sitting within the allotted time</li>
                        <li>Code execution and browser activity are monitored for integrity</li>
                        <li>Results are reviewed by our technical team before badge issuance</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Skill Tiers:</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">P</div>
                          <div>
                            <p className="font-semibold text-secondary-900">Pro (80-100%)</p>
                            <p className="text-sm text-secondary-600">Expert-level proficiency</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">A</div>
                          <div>
                            <p className="font-semibold text-secondary-900">Advanced (60-79%)</p>
                            <p className="text-sm text-secondary-600">Strong working knowledge</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold">I</div>
                          <div>
                            <p className="font-semibold text-secondary-900">Intermediate (40-59%)</p>
                            <p className="text-sm text-secondary-600">Foundational competency</p>
                          </div>
                        </div>
                      </div>

                      <p className="font-semibold text-secondary-900 mt-4">Candidate Responsibilities:</p>
                      <p>By taking an assessment, candidates agree to:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Complete assessments independently without outside assistance</li>
                        <li>Not share assessment questions or answers</li>
                        <li>Allow proctoring through webcam and screen recording</li>
                        <li>Provide a quiet, private environment for testing</li>
                        <li>Accept that cheating or integrity violations result in permanent account suspension</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Employer Use of Assessments:</p>
                      <p>
                        Skills badges are provided as supplementary information. Employers should use assessments as one factor among many in hiring decisions. We make no guarantees about job performance based solely on assessment scores.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Retake Policy:</p>
                      <p>
                        Candidates may retake assessments once every 60 days. Previous scores remain visible to employers with a timestamp indicating when each assessment was completed.
                      </p>

                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-red-900">
                          <strong>Academic Integrity:</strong> We use sophisticated proctoring technology to detect cheating. Violations result in immediate account termination and potential legal action for fraud.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 8: User Accounts and Registration */}
                  <section id="user-accounts">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      8. User Accounts and Registration
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        To access certain features of the Platform, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Account Security:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                        <li>You are responsible for all activities that occur under your account</li>
                        <li>You must notify us immediately of any unauthorized access or security breach</li>
                        <li>We are not liable for any loss or damage arising from your failure to protect your account</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Account Types:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Candidate Accounts:</strong> For individuals seeking employment opportunities</li>
                        <li><strong>Employer Accounts:</strong> For companies and organizations hiring talent</li>
                      </ul>

                      <p>
                        You may only create one account per email address. Creating multiple accounts to circumvent Platform restrictions or fees is prohibited and may result in termination of all associated accounts.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Account Verification:</p>
                      <p>
                        We may require verification of your identity or company affiliation before granting full Platform access. Employer accounts may require business verification through domain confirmation or documentation.
                      </p>
                    </div>
                  </section>

                  {/* Section 9: User Responsibilities */}
                  <section id="user-responsibilities">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      9. User Responsibilities
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p className="font-semibold text-secondary-900">You agree NOT to:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Post false, misleading, or fraudulent job listings or candidate information</li>
                        <li>Discriminate based on race, gender, age, religion, disability, or other protected characteristics</li>
                        <li>Harass, abuse, or threaten other users through messaging or communications</li>
                        <li>Scrape, copy, or extract Platform data using automated tools</li>
                        <li>Reverse engineer or attempt to access Platform source code</li>
                        <li>Circumvent success fees by moving candidates off-platform before hire</li>
                        <li>Share account credentials with others</li>
                        <li>Spam users with unsolicited messages or job offers</li>
                        <li>Post content containing viruses, malware, or malicious code</li>
                        <li>Violate any applicable laws or regulations</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Candidate Responsibilities:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Provide truthful and accurate information in your profile and applications</li>
                        <li>Maintain professional conduct in all communications with employers</li>
                        <li>Respond promptly to interview requests and job offers</li>
                        <li>Update your profile if you are no longer seeking opportunities</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Employer Responsibilities:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Post only legitimate job openings with intent to hire</li>
                        <li>Provide accurate salary ranges and job requirements</li>
                        <li>Respond to candidate applications in a timely manner</li>
                        <li>Comply with all employment laws and regulations</li>
                        <li>Pay success fees promptly according to payment terms</li>
                        <li>Report hires made through the Platform honestly and completely</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Consequences of Violations:</p>
                      <p>
                        Violation of these responsibilities may result in warning, account suspension, permanent termination, withholding of services, legal action, or reporting to relevant authorities.
                      </p>
                    </div>
                  </section>

                  {/* Section 10: Intellectual Property Rights */}
                  <section id="intellectual-property">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      10. Intellectual Property Rights
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        The Platform and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Platform Content:</p>
                      <p>
                        All text, graphics, logos, icons, images, audio clips, video clips, data compilations, software, and the compilation and organization thereof (collectively, "Content") are our exclusive property or that of our licensors.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">User-Generated Content:</p>
                      <p>
                        You retain ownership of content you submit to the Platform (profiles, job postings, messages, etc.). However, by submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content for the purpose of operating and improving the Platform.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Restrictions:</p>
                      <p>You may not:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Reproduce, distribute, or create derivative works from Platform content</li>
                        <li>Use our trademarks, logos, or branding without written permission</li>
                        <li>Frame or mirror any part of the Platform</li>
                        <li>Use automated systems to access the Platform without authorization</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">DMCA Compliance:</p>
                      <p>
                        We respect intellectual property rights. If you believe content on our Platform infringes your copyright, please contact us at legal@example.com with detailed information about the alleged infringement.
                      </p>
                    </div>
                  </section>

                  {/* Section 11: Privacy and Data Usage */}
                  <section id="privacy-data">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      11. Privacy and Data Usage
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        Your privacy is important to us. Our collection, use, and disclosure of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Data Collection:</p>
                      <p>We collect the following types of information:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Account Information:</strong> Name, email, phone, profile details</li>
                        <li><strong>Professional Information:</strong> Resume, work history, skills, assessments</li>
                        <li><strong>Usage Data:</strong> How you interact with the Platform, search queries, clicks</li>
                        <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                        <li><strong>Communication Data:</strong> Messages sent through the Platform</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">How We Use Your Data:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>To provide and improve our Services</li>
                        <li>To match candidates with relevant job opportunities</li>
                        <li>To facilitate communication between employers and candidates</li>
                        <li>To verify skills and assess candidate qualifications</li>
                        <li>To prevent fraud and ensure Platform security</li>
                        <li>To comply with legal obligations</li>
                        <li>To send service-related notifications and updates</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Data Sharing:</p>
                      <p>
                        We do not sell your personal information. We may share your data with:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Employers when you apply to jobs or grant profile access</li>
                        <li>Service providers who help us operate the Platform</li>
                        <li>Legal authorities when required by law</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Your Data Rights:</p>
                      <p>
                        You have the right to access, correct, delete, or export your personal data. Contact us at privacy@example.com to exercise these rights.
                      </p>

                      <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-primary-900">
                          <strong>Full Privacy Policy:</strong> For complete details on how we handle your data, please review our <Link href="/privacy" className="underline font-semibold hover:text-primary-700">Privacy Policy</Link>.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 12: Limitation of Liability */}
                  <section id="limitation-liability">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      12. Limitation of Liability
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        TO THE FULLEST EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Loss of profits, revenue, or business opportunities</li>
                        <li>Loss of data or information</li>
                        <li>Cost of substitute services</li>
                        <li>Damage to reputation or goodwill</li>
                        <li>Personal injury or emotional distress</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Service Disclaimers:</p>
                      <p>
                        THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>That the Service will be uninterrupted, timely, secure, or error-free</li>
                        <li>That any defects or errors will be corrected</li>
                        <li>That the Service is free of viruses or harmful components</li>
                        <li>Regarding the accuracy, reliability, or completeness of content</li>
                        <li>That job listings are current, accurate, or represent legitimate opportunities</li>
                        <li>That candidate profiles or assessments accurately reflect qualifications</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Employment Outcomes:</p>
                      <p>
                        We do not guarantee that candidates will find employment or that employers will find suitable candidates. Employment decisions are solely between employers and candidates.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Maximum Liability:</p>
                      <p>
                        Our total liability for any claims arising from your use of the Platform shall not exceed the total fees paid by you to us in the 12 months preceding the claim, or $500, whichever is greater.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Third-Party Content:</p>
                      <p>
                        The Platform may contain links to third-party websites or integrate with third-party services. We are not responsible for the content, accuracy, or practices of these third parties.
                      </p>

                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-red-900">
                          <strong>Important:</strong> Some jurisdictions do not allow limitation of liability for consequential damages, so these limitations may not apply to you. You may have additional rights under local law.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 13: Dispute Resolution */}
                  <section id="dispute-resolution">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      13. Dispute Resolution
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p className="font-semibold text-secondary-900">Informal Resolution:</p>
                      <p>
                        Before initiating formal dispute resolution, you agree to contact us at legal@example.com to attempt to resolve the dispute informally. We will make good-faith efforts to resolve disputes within 30 days.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Binding Arbitration:</p>
                      <p>
                        If informal resolution fails, any dispute arising from these Terms or your use of the Platform shall be resolved through binding arbitration rather than in court, except that you may assert claims in small claims court if your claims qualify.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Arbitration Rules:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Arbitration will be conducted by the American Arbitration Association (AAA) under its Commercial Arbitration Rules</li>
                        <li>The arbitration will take place in [Jurisdiction], unless both parties agree otherwise</li>
                        <li>The arbitrator's decision will be final and binding</li>
                        <li>Each party will bear their own legal costs unless the arbitrator awards costs to the prevailing party</li>
                        <li>The arbitration will be confidential</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Class Action Waiver:</p>
                      <p>
                        YOU AGREE THAT DISPUTES MUST BE BROUGHT ON AN INDIVIDUAL BASIS ONLY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING. ARBITRATORS MAY NOT CONSOLIDATE MORE THAN ONE PERSON'S CLAIMS.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Exceptions to Arbitration:</p>
                      <p>
                        Either party may seek injunctive or equitable relief in court for:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Intellectual property disputes</li>
                        <li>Data privacy violations</li>
                        <li>Unauthorized access to the Platform</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Governing Law:</p>
                      <p>
                        These Terms shall be governed by and construed in accordance with the laws of [State/Country], without regard to its conflict of law provisions.
                      </p>

                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-yellow-900">
                          <strong>Opt-Out:</strong> You have the right to opt out of arbitration by sending written notice to legal@example.com within 30 days of first accepting these Terms. Your opt-out notice must include your name, address, and a clear statement that you wish to opt out of arbitration.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 14: Termination */}
                  <section id="termination">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      14. Termination
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p className="font-semibold text-secondary-900">Termination by You:</p>
                      <p>
                        You may terminate your account at any time by contacting us at support@example.com or using the account deletion feature in your settings. Upon termination, your profile will be deactivated and removed from public view within 48 hours.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Termination by Us:</p>
                      <p>
                        We may suspend or terminate your account immediately, without prior notice or liability, for any reason, including but not limited to:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Violation of these Terms</li>
                        <li>Fraudulent activity or misrepresentation</li>
                        <li>Non-payment of owed fees</li>
                        <li>Harassment or abuse of other users</li>
                        <li>Circumventing success fees or platform restrictions</li>
                        <li>Violation of laws or regulations</li>
                        <li>Prolonged inactivity (no login for 24+ months)</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Effect of Termination:</p>
                      <p>
                        Upon termination:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Your right to access and use the Platform immediately ceases</li>
                        <li>Your profile and job postings will be removed from public view</li>
                        <li>We may retain certain information as required by law or for legitimate business purposes</li>
                        <li>Outstanding payment obligations remain due and payable</li>
                        <li>Success fees for hires initiated before termination remain applicable</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Survival:</p>
                      <p>
                        The following sections survive termination: Success Fee Terms, Payment Terms, Intellectual Property Rights, Limitation of Liability, Dispute Resolution, and any provisions that by their nature should survive.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Data Retention After Termination:</p>
                      <p>
                        After account termination, we will retain your data for 90 days to allow for account reactivation. After 90 days, your data will be permanently deleted, except for information we are required to retain by law or for legitimate business purposes (e.g., payment records, dispute resolution).
                      </p>
                    </div>
                  </section>

                  {/* Section 15: Changes to Terms */}
                  <section id="changes-terms">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      15. Changes to Terms
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        We reserve the right to modify or replace these Terms at any time at our sole discretion. If we make material changes, we will notify you by:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Posting a notice on the Platform homepage</li>
                        <li>Sending an email to the address associated with your account</li>
                        <li>Displaying a prominent notification when you next log in</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">What Constitutes Material Changes:</p>
                      <p>
                        Material changes include, but are not limited to:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Changes to success fee percentages or payment terms</li>
                        <li>Modifications to the replacement guarantee</li>
                        <li>Changes to dispute resolution or arbitration provisions</li>
                        <li>Significant changes to data collection or privacy practices</li>
                        <li>Changes to user responsibilities or prohibited activities</li>
                      </ul>

                      <p className="font-semibold text-secondary-900 mt-4">Notice Period:</p>
                      <p>
                        For material changes, we will provide at least 30 days' notice before the changes take effect. Non-material changes may take effect immediately upon posting.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Your Acceptance:</p>
                      <p>
                        By continuing to use the Platform after changes take effect, you agree to be bound by the revised Terms. If you do not agree to the new Terms, you must stop using the Platform and may terminate your account.
                      </p>

                      <p className="font-semibold text-secondary-900 mt-4">Version History:</p>
                      <p>
                        We maintain a version history of these Terms. You can view previous versions by contacting legal@example.com.
                      </p>

                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-blue-900">
                          <strong>Recommendation:</strong> We encourage you to review these Terms periodically for any changes. Changes are effective when posted to this page.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 16: Severability */}
                  <section id="severability">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      16. Severability
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        If any provision of these Terms is found to be unenforceable or invalid under applicable law, such unenforceability or invalidity shall not render these Terms unenforceable or invalid as a whole.
                      </p>
                      <p>
                        In such cases, the unenforceable or invalid provisions will be modified to the minimum extent necessary to make them enforceable and valid while preserving their intent. If such modification is not possible, the provision will be severed from these Terms.
                      </p>
                      <p>
                        The remaining provisions of these Terms will continue in full force and effect and will not be affected by the modification or severance.
                      </p>
                    </div>
                  </section>

                  {/* Section 17: Contact Information */}
                  <section id="contact">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      17. Contact Information
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        If you have questions, concerns, or feedback about these Terms of Service, please contact us:
                      </p>

                      <div className="bg-secondary-50 rounded-lg p-6 space-y-4 mt-4">
                        <div>
                          <p className="font-semibold text-secondary-900">General Inquiries:</p>
                          <p>Email: <a href="mailto:support@example.com" className="text-primary-600 hover:underline">support@example.com</a></p>
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900">Legal & Compliance:</p>
                          <p>Email: <a href="mailto:legal@example.com" className="text-primary-600 hover:underline">legal@example.com</a></p>
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900">Payment & Billing:</p>
                          <p>Email: <a href="mailto:billing@example.com" className="text-primary-600 hover:underline">billing@example.com</a></p>
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900">Privacy & Data:</p>
                          <p>Email: <a href="mailto:privacy@example.com" className="text-primary-600 hover:underline">privacy@example.com</a></p>
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900">Mailing Address:</p>
                          <p>
                            AI/ML Job Portal<br />
                            [Street Address]<br />
                            [City, State ZIP]<br />
                            [Country]
                          </p>
                        </div>
                      </div>

                      <p className="font-semibold text-secondary-900 mt-6">Response Time:</p>
                      <p>
                        We strive to respond to all inquiries within 2-3 business days. For urgent matters, please mark your subject line as "URGENT."
                      </p>

                      <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4 mt-6">
                        <p className="text-sm text-primary-900">
                          <strong>Document Information:</strong><br />
                          Terms of Service Version 1.0<br />
                          Last Updated: January 8, 2025<br />
                          Effective Date: January 8, 2025
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Bottom CTA */}
                  <div className="border-t border-secondary-200 pt-8 mt-12 text-center">
                    <p className="text-secondary-700 mb-4">
                      By using our Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                    </p>
                    <Button asChild className="gap-2">
                      <Link href="/">
                        Return to Home
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
