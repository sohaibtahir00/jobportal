"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { useState, useEffect } from "react";

export default function PrivacyPage() {
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
    { id: "introduction", title: "1. Introduction" },
    { id: "information-collect", title: "2. Information We Collect" },
    { id: "how-we-use", title: "3. How We Use Information" },
    { id: "information-sharing", title: "4. Information Sharing" },
    { id: "data-security", title: "5. Data Storage and Security" },
    { id: "user-rights", title: "6. User Rights" },
    { id: "cookies-policy", title: "7. Cookies Policy" },
    { id: "gdpr-compliance", title: "8. GDPR Compliance" },
    { id: "ccpa-compliance", title: "9. CCPA Compliance" },
    { id: "childrens-privacy", title: "10. Children's Privacy" },
    { id: "policy-changes", title: "11. Changes to Privacy Policy" },
    { id: "contact-info", title: "12. Contact Information" },
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
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-secondary-900">
            Privacy Policy
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
                            ? "bg-green-50 text-green-700 font-semibold"
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
                  {/* Section 1: Introduction */}
                  <section id="introduction">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      1. Introduction
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        Welcome to our AI/ML Job Portal ("Platform", "Service", "we", "us", or "our"). We are committed to protecting your privacy and ensuring the security of your personal information.
                      </p>
                      <p>
                        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform. By accessing or using our Services, you agree to the collection and use of information in accordance with this policy.
                      </p>
                      <p>
                        This policy applies to all users of our Platform, including job seekers (candidates), employers, and visitors to our website.
                      </p>
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-blue-900">
                          <strong>Quick Summary:</strong> We collect information to help match candidates with jobs, verify skills, and improve our Platform. We never sell your personal information to third parties.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 2: Information We Collect */}
                  <section id="information-collect">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      2. Information We Collect
                    </h2>
                    <div className="space-y-4 text-secondary-700">
                      <p>
                        We collect various types of information to provide and improve our Services:
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Personal Information</h3>
                      <p>Information you provide directly to us:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Account Information:</strong> Name, email address, phone number, password</li>
                        <li><strong>Candidate Profile Data:</strong>
                          <ul className="list-circle pl-6 mt-2 space-y-1">
                            <li>Resume/CV (work history, education, skills)</li>
                            <li>Current role and years of experience</li>
                            <li>Salary expectations and preferences</li>
                            <li>Portfolio links and GitHub profiles</li>
                            <li>Profile photo (optional)</li>
                          </ul>
                        </li>
                        <li><strong>Employer Information:</strong>
                          <ul className="list-circle pl-6 mt-2 space-y-1">
                            <li>Company name and website</li>
                            <li>Company logo and description</li>
                            <li>Industry and company size</li>
                            <li>Job postings and requirements</li>
                            <li>Billing and payment information</li>
                          </ul>
                        </li>
                        <li><strong>Skills Assessment Data:</strong>
                          <ul className="list-circle pl-6 mt-2 space-y-1">
                            <li>Test results and scores</li>
                            <li>Proctoring recordings (webcam, screen)</li>
                            <li>Code submissions and answers</li>
                            <li>Time spent on assessments</li>
                          </ul>
                        </li>
                      </ul>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Usage Data</h3>
                      <p>Information collected automatically when you use our Platform:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>IP address and geolocation data</li>
                        <li>Browser type, version, and language</li>
                        <li>Device information (type, OS, screen resolution)</li>
                        <li>Pages visited, time spent, and navigation paths</li>
                        <li>Search queries and filters applied</li>
                        <li>Job applications submitted and interview activity</li>
                        <li>Referral source (how you found our Platform)</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Cookies and Tracking Technologies</h3>
                      <p>We use cookies, web beacons, and similar technologies to:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Remember your login and preferences</li>
                        <li>Analyze Platform usage and performance</li>
                        <li>Personalize content and job recommendations</li>
                        <li>Track conversions and advertising effectiveness</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Communication Data</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Messages sent through our Platform messaging system</li>
                        <li>Email communications with our support team</li>
                        <li>Feedback, reviews, and survey responses</li>
                      </ul>
                    </div>
                  </section>

                  {/* Section 3: How We Use Information */}
                  <section id="how-we-use">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      3. How We Use Information
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        We use the collected information for the following purposes:
                      </p>

                      <div className="space-y-4 mt-4">
                        <div className="bg-primary-50 border-l-4 border-primary-600 rounded-r-lg p-4">
                          <h4 className="font-semibold text-secondary-900 mb-2">Job Matching and Recommendations</h4>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Match candidates with relevant job opportunities based on skills and experience</li>
                            <li>Provide personalized job recommendations using AI algorithms</li>
                            <li>Recommend qualified candidates to employers</li>
                            <li>Improve matching accuracy over time</li>
                          </ul>
                        </div>

                        <div className="bg-green-50 border-l-4 border-green-600 rounded-r-lg p-4">
                          <h4 className="font-semibold text-secondary-900 mb-2">Skills Assessment and Verification</h4>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Conduct proctored technical assessments</li>
                            <li>Verify candidate competencies and skill levels</li>
                            <li>Issue skill badges (Pro, Advanced, Intermediate)</li>
                            <li>Detect and prevent cheating or fraudulent activity</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-4">
                          <h4 className="font-semibold text-secondary-900 mb-2">Communication and Notifications</h4>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Send job alerts and application status updates</li>
                            <li>Facilitate messaging between candidates and employers</li>
                            <li>Notify about interview requests and offers</li>
                            <li>Send service-related emails (password resets, account updates)</li>
                            <li>Send marketing emails (with your consent - you can opt out)</li>
                          </ul>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-r-lg p-4">
                          <h4 className="font-semibold text-secondary-900 mb-2">Platform Improvement and Analytics</h4>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Analyze usage patterns to improve features</li>
                            <li>Conduct A/B testing for new functionality</li>
                            <li>Generate aggregate statistics and insights</li>
                            <li>Optimize search and recommendation algorithms</li>
                          </ul>
                        </div>

                        <div className="bg-red-50 border-l-4 border-red-600 rounded-r-lg p-4">
                          <h4 className="font-semibold text-secondary-900 mb-2">Security and Fraud Prevention</h4>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Detect and prevent fraudulent accounts and activity</li>
                            <li>Monitor for security threats and vulnerabilities</li>
                            <li>Enforce our Terms of Service</li>
                            <li>Investigate violations and respond to support requests</li>
                          </ul>
                        </div>

                        <div className="bg-purple-50 border-l-4 border-purple-600 rounded-r-lg p-4">
                          <h4 className="font-semibold text-secondary-900 mb-2">Legal and Compliance</h4>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Comply with legal obligations and regulations</li>
                            <li>Respond to lawful requests from authorities</li>
                            <li>Process payments and manage billing</li>
                            <li>Resolve disputes and enforce agreements</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section 4: Information Sharing */}
                  <section id="information-sharing">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      4. Information Sharing
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p className="font-semibold text-secondary-900">
                        We do NOT sell your personal information to third parties.
                      </p>
                      <p>
                        We may share your information in the following circumstances:
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">With Employers (For Candidates)</h3>
                      <p>When you apply to a job or grant profile access, we share:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Your profile information, resume, and skills</li>
                        <li>Skills assessment results and badges</li>
                        <li>Application materials (cover letter, availability)</li>
                        <li>Communication history related to the application</li>
                      </ul>
                      <p className="text-sm italic mt-2">
                        Note: Employers can only see candidates who have applied to their jobs or whose profiles match their searches.
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">With Candidates (For Employers)</h3>
                      <p>Candidates can see:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Company name, logo, and description</li>
                        <li>Job details and requirements</li>
                        <li>Company website and social links</li>
                        <li>Verification status (verified employer badge)</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">With Service Providers</h3>
                      <p>We share data with trusted third-party providers who help us operate our Platform:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Skills Assessment Partners:</strong> iMocha, HackerRank (proctoring and testing)</li>
                        <li><strong>Cloud Infrastructure:</strong> AWS, Vercel (hosting and storage)</li>
                        <li><strong>Analytics Services:</strong> Google Analytics, Mixpanel (usage tracking)</li>
                        <li><strong>Email Services:</strong> SendGrid, Mailgun (transactional emails)</li>
                        <li><strong>Payment Processors:</strong> Stripe (payment processing for employers)</li>
                        <li><strong>Authentication:</strong> Auth0, Google OAuth, LinkedIn OAuth</li>
                      </ul>
                      <p className="text-sm mt-2">
                        These providers are contractually bound to protect your data and may only use it for specified purposes.
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Business Transfers</h3>
                      <p>
                        If we are involved in a merger, acquisition, or sale of assets, your information may be transferred. We will notify you before your data is transferred and becomes subject to a different privacy policy.
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Legal Requirements</h3>
                      <p>We may disclose your information if required to:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Comply with legal obligations or court orders</li>
                        <li>Respond to lawful requests from law enforcement</li>
                        <li>Protect our rights, property, or safety</li>
                        <li>Prevent fraud, security threats, or illegal activity</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">With Your Consent</h3>
                      <p>
                        We may share your information for other purposes with your explicit consent, such as featuring your success story in our marketing materials.
                      </p>
                    </div>
                  </section>

                  {/* Section 5: Data Storage and Security */}
                  <section id="data-security">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      5. Data Storage and Security
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <h3 className="text-lg font-semibold text-secondary-900">Data Storage</h3>
                      <p>
                        Your data is stored on secure servers provided by Amazon Web Services (AWS) in the United States. We use industry-leading cloud infrastructure with built-in redundancy and backup systems.
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Security Measures</h3>
                      <p>We implement multiple layers of security to protect your information:</p>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-secondary-900 mb-2">Encryption</h4>
                          <ul className="text-sm space-y-1">
                            <li>• SSL/TLS encryption for all data transmission</li>
                            <li>• AES-256 encryption for data at rest</li>
                            <li>• Encrypted database backups</li>
                            <li>• Hashed and salted passwords</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-secondary-900 mb-2">Access Controls</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Multi-factor authentication (MFA)</li>
                            <li>• Role-based access control (RBAC)</li>
                            <li>• Least privilege principle</li>
                            <li>• Regular access audits</li>
                          </ul>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h4 className="font-semibold text-secondary-900 mb-2">Monitoring</h4>
                          <ul className="text-sm space-y-1">
                            <li>• 24/7 security monitoring</li>
                            <li>• Intrusion detection systems</li>
                            <li>• Real-time threat alerts</li>
                            <li>• Activity logging and auditing</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h4 className="font-semibold text-secondary-900 mb-2">Compliance</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Annual security audits</li>
                            <li>• Penetration testing</li>
                            <li>• SOC 2 compliance (in progress)</li>
                            <li>• GDPR and CCPA compliance</li>
                          </ul>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Employee Training</h3>
                      <p>
                        All employees with access to personal data receive regular training on data protection, security best practices, and privacy regulations.
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Data Retention</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Active accounts:</strong> Data retained as long as your account is active</li>
                        <li><strong>Deleted accounts:</strong> Data retained for 90 days, then permanently deleted</li>
                        <li><strong>Legal obligations:</strong> Some data may be retained longer if required by law (e.g., payment records for tax purposes)</li>
                        <li><strong>Backups:</strong> Backup copies deleted within 90 days of account deletion</li>
                      </ul>

                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-red-900">
                          <strong>Important:</strong> While we implement industry-standard security measures, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security but continuously work to improve our protections.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 6: User Rights */}
                  <section id="user-rights">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      6. User Rights
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        Under applicable data protection laws (GDPR, CCPA, and others), you have the following rights regarding your personal data:
                      </p>

                      <div className="space-y-4 mt-4">
                        <div className="border-l-4 border-primary-600 pl-4">
                          <h4 className="font-semibold text-secondary-900">Right to Access</h4>
                          <p className="text-sm">Request a copy of all personal data we hold about you. We will provide this in a portable, machine-readable format within 30 days.</p>
                        </div>

                        <div className="border-l-4 border-green-600 pl-4">
                          <h4 className="font-semibold text-secondary-900">Right to Correction</h4>
                          <p className="text-sm">Update or correct inaccurate or incomplete information. You can do this directly in your profile settings or by contacting us.</p>
                        </div>

                        <div className="border-l-4 border-red-600 pl-4">
                          <h4 className="font-semibold text-secondary-900">Right to Deletion ("Right to be Forgotten")</h4>
                          <p className="text-sm">Request deletion of your personal data. We will delete your data within 90 days unless we have a legal obligation to retain it.</p>
                        </div>

                        <div className="border-l-4 border-blue-600 pl-4">
                          <h4 className="font-semibold text-secondary-900">Right to Data Portability</h4>
                          <p className="text-sm">Export your data in JSON or CSV format to use with another service. Available in account settings.</p>
                        </div>

                        <div className="border-l-4 border-yellow-600 pl-4">
                          <h4 className="font-semibold text-secondary-900">Right to Object</h4>
                          <p className="text-sm">Object to processing of your data for direct marketing, profiling, or other purposes. We will stop processing unless we have legitimate grounds.</p>
                        </div>

                        <div className="border-l-4 border-purple-600 pl-4">
                          <h4 className="font-semibold text-secondary-900">Right to Restriction</h4>
                          <p className="text-sm">Request limitation of how we process your data while you contest accuracy or legitimacy of processing.</p>
                        </div>

                        <div className="border-l-4 border-orange-600 pl-4">
                          <h4 className="font-semibold text-secondary-900">Right to Withdraw Consent</h4>
                          <p className="text-sm">Opt out of marketing communications or withdraw consent for data processing at any time. Click "Unsubscribe" in emails or update preferences in settings.</p>
                        </div>

                        <div className="border-l-4 border-pink-600 pl-4">
                          <h4 className="font-semibold text-secondary-900">Right to Lodge a Complaint</h4>
                          <p className="text-sm">File a complaint with your local data protection authority if you believe we have violated your privacy rights.</p>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">How to Exercise Your Rights</h3>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li><strong>Through your account settings:</strong> Many actions can be performed directly in your profile</li>
                        <li><strong>Email us:</strong> Send requests to privacy@example.com</li>
                        <li><strong>Submit a request form:</strong> Use our data rights request form (link in contact section)</li>
                      </ol>

                      <p className="text-sm italic mt-4">
                        We will verify your identity before processing requests to prevent unauthorized access to your data. We will respond to valid requests within 30 days (or as required by local law).
                      </p>
                    </div>
                  </section>

                  {/* Section 7: Cookies Policy */}
                  <section id="cookies-policy">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      7. Cookies Policy
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        We use cookies and similar tracking technologies to enhance your experience on our Platform. This section explains what cookies are, how we use them, and how you can manage them.
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">What Are Cookies?</h3>
                      <p>
                        Cookies are small text files stored on your device (computer, tablet, or phone) when you visit a website. They help websites remember your preferences and improve functionality.
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Types of Cookies We Use</h3>

                      <div className="space-y-3 mt-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-secondary-900 flex items-center gap-2">
                            <span className="text-green-600">✓</span> Essential Cookies (Required)
                          </h4>
                          <p className="text-sm mt-2">These cookies are necessary for the Platform to function and cannot be disabled.</p>
                          <ul className="text-sm mt-2 space-y-1">
                            <li>• Authentication and session management</li>
                            <li>• Security and fraud prevention</li>
                            <li>• Load balancing and performance</li>
                            <li>• Cookie consent preferences</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-secondary-900">Functional Cookies (Optional)</h4>
                          <p className="text-sm mt-2">Remember your preferences and settings.</p>
                          <ul className="text-sm mt-2 space-y-1">
                            <li>• Language and region preferences</li>
                            <li>• Search filters and saved searches</li>
                            <li>• Job application drafts</li>
                            <li>• Theme preferences (light/dark mode)</li>
                          </ul>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h4 className="font-semibold text-secondary-900">Analytics Cookies (Optional)</h4>
                          <p className="text-sm mt-2">Help us understand how users interact with our Platform.</p>
                          <ul className="text-sm mt-2 space-y-1">
                            <li>• Google Analytics (page views, sessions, bounce rate)</li>
                            <li>• Mixpanel (feature usage, conversion tracking)</li>
                            <li>• Hotjar (heatmaps, session recordings)</li>
                          </ul>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h4 className="font-semibold text-secondary-900">Marketing Cookies (Optional)</h4>
                          <p className="text-sm mt-2">Used for targeted advertising and remarketing.</p>
                          <ul className="text-sm mt-2 space-y-1">
                            <li>• Google Ads conversion tracking</li>
                            <li>• LinkedIn Insight Tag</li>
                            <li>• Facebook Pixel</li>
                            <li>• Retargeting campaigns</li>
                          </ul>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Managing Cookies</h3>
                      <p>You can control cookies through:</p>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li><strong>Cookie Consent Banner:</strong> Customize preferences when you first visit our Platform</li>
                        <li><strong>Cookie Settings:</strong> Update preferences anytime in your account settings</li>
                        <li><strong>Browser Settings:</strong> Configure your browser to block or delete cookies
                          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                            <li>Chrome: Settings → Privacy and Security → Cookies</li>
                            <li>Firefox: Settings → Privacy & Security → Cookies</li>
                            <li>Safari: Preferences → Privacy → Cookies</li>
                          </ul>
                        </li>
                      </ol>

                      <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-orange-900">
                          <strong>Note:</strong> Disabling certain cookies may affect Platform functionality. For example, blocking essential cookies will prevent you from logging in.
                        </p>
                      </div>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Third-Party Cookies</h3>
                      <p>
                        Some cookies are set by third-party services we use (e.g., Google Analytics, payment processors). These are subject to the respective third party's privacy policies:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                        <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-primary-600 hover:underline">Google Privacy Policy</a></li>
                        <li><a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener" className="text-primary-600 hover:underline">LinkedIn Privacy Policy</a></li>
                        <li><a href="https://stripe.com/privacy" target="_blank" rel="noopener" className="text-primary-600 hover:underline">Stripe Privacy Policy</a></li>
                      </ul>
                    </div>
                  </section>

                  {/* Section 8: GDPR Compliance */}
                  <section id="gdpr-compliance">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      8. GDPR Compliance (European Users)
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, the General Data Protection Regulation (GDPR) provides additional protections for your personal data.
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Legal Basis for Processing</h3>
                      <p>We process your personal data under the following legal bases:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Contract Performance:</strong> To provide services you've requested (job matching, assessments)</li>
                        <li><strong>Legitimate Interests:</strong> To improve our Platform, prevent fraud, and conduct analytics</li>
                        <li><strong>Consent:</strong> For marketing communications and optional cookies</li>
                        <li><strong>Legal Obligations:</strong> To comply with applicable laws and regulations</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">International Data Transfers</h3>
                      <p>
                        Your data may be transferred to and processed in the United States or other countries where our service providers operate. We ensure adequate protection through:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                        <li>Data Processing Agreements (DPAs) with all processors</li>
                        <li>Adequacy decisions where applicable</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Your GDPR Rights</h3>
                      <p>In addition to the rights listed in Section 6, GDPR provides:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Right to lodge a complaint:</strong> Contact your local supervisory authority</li>
                        <li><strong>Right to object to automated decision-making:</strong> Request human review of automated decisions that significantly affect you</li>
                        <li><strong>Right to data portability:</strong> Receive your data in a structured, machine-readable format</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Data Protection Officer</h3>
                      <p>
                        For GDPR-related inquiries, contact our Data Protection Officer at:
                        <br />
                        Email: dpo@example.com
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">EU Representative</h3>
                      <p>
                        If required, we will appoint an EU representative in accordance with Article 27 of the GDPR. Contact details will be provided here when applicable.
                      </p>
                    </div>
                  </section>

                  {/* Section 9: CCPA Compliance */}
                  <section id="ccpa-compliance">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      9. CCPA Compliance (California Residents)
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        If you are a California resident, the California Consumer Privacy Act (CCPA) provides you with specific rights regarding your personal information.
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">California Privacy Rights</h3>

                      <div className="space-y-3">
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                          <h4 className="font-semibold text-secondary-900">Right to Know</h4>
                          <p className="text-sm mt-1">Request disclosure of the categories and specific pieces of personal information we've collected about you in the past 12 months.</p>
                        </div>

                        <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
                          <h4 className="font-semibold text-secondary-900">Right to Delete</h4>
                          <p className="text-sm mt-1">Request deletion of personal information we've collected from you, subject to certain exceptions.</p>
                        </div>

                        <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
                          <h4 className="font-semibold text-secondary-900">Right to Opt-Out of Sale</h4>
                          <p className="text-sm mt-1"><strong>We do NOT sell your personal information.</strong> We never have and never will sell your data to third parties.</p>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-r-lg">
                          <h4 className="font-semibold text-secondary-900">Right to Non-Discrimination</h4>
                          <p className="text-sm mt-1">We will not discriminate against you for exercising your CCPA rights. You will receive the same level of service regardless.</p>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Categories of Personal Information Collected</h3>
                      <p>In the past 12 months, we have collected the following categories:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li><strong>Identifiers:</strong> Name, email, phone, IP address</li>
                        <li><strong>Professional Information:</strong> Resume, work history, skills, education</li>
                        <li><strong>Commercial Information:</strong> Application history, job preferences</li>
                        <li><strong>Internet Activity:</strong> Browsing history, search queries, interactions</li>
                        <li><strong>Geolocation Data:</strong> Approximate location from IP address</li>
                        <li><strong>Audio/Visual Information:</strong> Profile photos, proctoring recordings</li>
                        <li><strong>Inferences:</strong> Profiles reflecting preferences and characteristics</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Business Purposes for Collection</h3>
                      <p>We collect and use personal information for:</p>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Providing job matching and placement services</li>
                        <li>Skills assessment and verification</li>
                        <li>Platform improvement and analytics</li>
                        <li>Security and fraud prevention</li>
                        <li>Marketing and communications (with consent)</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Third Parties We Share With</h3>
                      <p>We share personal information with:</p>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Employers (when you apply to jobs)</li>
                        <li>Service providers (cloud hosting, email, analytics)</li>
                        <li>Payment processors (for billing)</li>
                        <li>Skills assessment partners (for testing)</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">How to Exercise Your CCPA Rights</h3>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li><strong>Submit a request:</strong> Email privacy@example.com or use our online form</li>
                        <li><strong>Verify your identity:</strong> We'll ask for information to confirm your identity</li>
                        <li><strong>Receive a response:</strong> We'll respond within 45 days (may extend to 90 days for complex requests)</li>
                      </ol>

                      <p className="text-sm italic mt-4">
                        You may designate an authorized agent to make requests on your behalf. The agent must provide proof of authorization.
                      </p>

                      <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-primary-900">
                          <strong>Shine the Light Law:</strong> California residents may request information about disclosure of personal information to third parties for direct marketing purposes. Since we do not share personal information for direct marketing, this request will receive a "no disclosure" response.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 10: Children's Privacy */}
                  <section id="childrens-privacy">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      10. Children's Privacy
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        Our Platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18 years of age.
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Age Restrictions</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>You must be at least 18 years old to create an account</li>
                        <li>By using our Platform, you represent that you are 18 or older</li>
                        <li>We reserve the right to verify age and terminate accounts of users under 18</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Parental Notice</h3>
                      <p>
                        If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately at privacy@example.com. We will take steps to delete such information from our systems.
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">COPPA Compliance</h3>
                      <p>
                        We comply with the Children's Online Privacy Protection Act (COPPA). If we discover that we have inadvertently collected information from a child under 13, we will:
                      </p>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>Delete the information as quickly as possible</li>
                        <li>Terminate the account</li>
                        <li>Not use the information for any purpose</li>
                        <li>Not disclose the information to third parties</li>
                      </ol>

                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-red-900">
                          <strong>Important:</strong> If you are under 18, please do not use our Platform or provide any information to us. Contact your parent or guardian if you have questions.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 11: Changes to Privacy Policy */}
                  <section id="policy-changes">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      11. Changes to Privacy Policy
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">How We Notify You of Changes</h3>
                      <p>When we make changes, we will:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Update the "Last updated" date at the top of this policy</li>
                        <li>Post a notice on our Platform homepage for 30 days</li>
                        <li>Send an email notification to your registered email address for material changes</li>
                        <li>Display a prominent banner when you next log in</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Material Changes</h3>
                      <p>We consider the following to be material changes:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Changes to the types of personal data we collect</li>
                        <li>Changes to how we use or share personal data</li>
                        <li>Changes to data retention periods</li>
                        <li>Changes to your rights or how to exercise them</li>
                        <li>Changes to international data transfers</li>
                      </ul>

                      <p className="mt-4">
                        For material changes, we will provide at least 30 days' notice before the changes take effect. You will have the opportunity to review the changes and decide whether to continue using our Platform.
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Your Continued Use</h3>
                      <p>
                        By continuing to use our Platform after changes become effective, you acknowledge that you accept the updated Privacy Policy. If you do not agree to the changes, you must stop using the Platform and may delete your account.
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Version History</h3>
                      <p>
                        We maintain a history of previous versions of this Privacy Policy. You can request access to previous versions by contacting privacy@example.com.
                      </p>
                    </div>
                  </section>

                  {/* Section 12: Contact Information */}
                  <section id="contact-info">
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                      12. Contact Information
                    </h2>
                    <div className="space-y-3 text-secondary-700">
                      <p>
                        If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                      </p>

                      <div className="bg-secondary-50 rounded-lg p-6 space-y-4 mt-4">
                        <div>
                          <p className="font-semibold text-secondary-900">Privacy Inquiries:</p>
                          <p>Email: <a href="mailto:privacy@example.com" className="text-primary-600 hover:underline">privacy@example.com</a></p>
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900">Data Protection Officer (DPO):</p>
                          <p>Email: <a href="mailto:dpo@example.com" className="text-primary-600 hover:underline">dpo@example.com</a></p>
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900">CCPA Requests (California Residents):</p>
                          <p>Email: <a href="mailto:ccpa@example.com" className="text-primary-600 hover:underline">ccpa@example.com</a></p>
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900">Security Issues:</p>
                          <p>Email: <a href="mailto:security@example.com" className="text-primary-600 hover:underline">security@example.com</a></p>
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900">Mailing Address:</p>
                          <p>
                            AI/ML Job Portal<br />
                            Privacy Team<br />
                            [Street Address]<br />
                            [City, State ZIP]<br />
                            [Country]
                          </p>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Response Time</h3>
                      <p>
                        We strive to respond to all privacy inquiries within 2-3 business days. For formal data requests (access, deletion, portability), we will respond within 30 days as required by law (or notify you if we need additional time).
                      </p>

                      <h3 className="text-lg font-semibold text-secondary-900 mt-6">Data Rights Request Form</h3>
                      <p>
                        For streamlined processing of data access, deletion, or portability requests, use our online form:
                        <br />
                        <a href="/data-rights-request" className="text-primary-600 hover:underline font-semibold">Submit Data Rights Request</a>
                      </p>

                      <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4 mt-6">
                        <p className="text-sm text-primary-900">
                          <strong>Document Information:</strong><br />
                          Privacy Policy Version 1.0<br />
                          Last Updated: January 8, 2025<br />
                          Effective Date: January 8, 2025
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Bottom CTA */}
                  <div className="border-t border-secondary-200 pt-8 mt-12 text-center">
                    <p className="text-secondary-700 mb-4">
                      By using our Platform, you acknowledge that you have read and understood this Privacy Policy.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button asChild variant="outline">
                        <Link href="/terms">
                          View Terms of Service
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href="/">
                          Return to Home
                        </Link>
                      </Button>
                    </div>
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
