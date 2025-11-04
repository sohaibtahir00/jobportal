import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Our privacy policy and how we handle your data.",
};

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "information-we-collect", title: "Information We Collect" },
  { id: "how-we-use", title: "How We Use Your Information" },
  { id: "data-security", title: "Data Security" },
  { id: "your-rights", title: "Your Rights" },
  { id: "cookies", title: "Cookies & Tracking" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "children", title: "Children's Privacy" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-16">
        <div className="container">
          <div className="mb-6">
            <Button variant="ghost" asChild className="text-white hover:bg-white/10">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Privacy Policy
              </h1>
            </div>
          </div>
          <p className="text-xl text-primary-100">
            Last updated: January 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12 max-w-4xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-white/20 shadow-lg">
          {/* Table of Contents */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
            <nav className="space-y-2">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  {index + 1}. {section.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Sections */}
          <div className="prose max-w-none">
            {/* Introduction */}
            <section id="introduction" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                  1
                </div>
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to JobPortal. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our AI/ML job portal platform.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This policy applies to all information collected through our website, mobile applications, and any related services (collectively, the "Services").
              </p>
            </section>

            {/* Information We Collect */}
            <section id="information-we-collect" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                  2
                </div>
                Information We Collect
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect several types of information for various purposes to provide and improve our Services:
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Personal Information</h3>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li>Name, email address, and phone number</li>
                <li>Professional information (resume, work history, skills)</li>
                <li>Educational background and certifications</li>
                <li>Profile photo and portfolio links</li>
                <li>Salary expectations and preferences</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Usage Data</h3>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Search queries and filters applied</li>
                <li>IP address and device information</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section id="how-we-use" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                  3
                </div>
                How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li><strong>Job Matching:</strong> To match candidates with relevant job opportunities based on skills, experience, and preferences</li>
                <li><strong>Communication:</strong> To send you job alerts, application updates, and platform notifications</li>
                <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our platform features</li>
                <li><strong>Security:</strong> To detect, prevent, and address fraud and security issues</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and respond to legal requests</li>
                <li><strong>Marketing:</strong> To send promotional materials (with your consent)</li>
              </ul>
            </section>

            {/* Data Security */}
            <section id="data-security" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-md">
                  4
                </div>
                Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Encrypted storage of sensitive information</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and authentication protocols</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                While we strive to protect your data, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security but continuously work to improve our security measures.
              </p>
            </section>

            {/* Your Rights */}
            <section id="your-rights" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                  5
                </div>
                Your Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under applicable data protection laws (GDPR, CCPA), you have the following rights:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Objection:</strong> Object to processing of your data for certain purposes</li>
                <li><strong>Restriction:</strong> Request limitation of data processing</li>
                <li><strong>Withdraw Consent:</strong> Opt-out of marketing communications at any time</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, please contact us using the information provided at the end of this policy.
              </p>
            </section>

            {/* Cookies */}
            <section id="cookies" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
                  6
                </div>
                Cookies & Tracking
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to improve your experience:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                You can control cookie preferences through your browser settings. Note that disabling certain cookies may affect platform functionality.
              </p>
            </section>

            {/* Third-Party Services */}
            <section id="third-party" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-md">
                  7
                </div>
                Third-Party Services
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may share your information with trusted third-party service providers:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li>Potential employers (when you apply for jobs)</li>
                <li>Analytics providers (Google Analytics, etc.)</li>
                <li>Email service providers</li>
                <li>Payment processors</li>
                <li>Cloud storage providers</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                These third parties are contractually obligated to protect your data and use it only for specified purposes.
              </p>
            </section>

            {/* Children's Privacy */}
            <section id="children" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                  8
                </div>
                Children's Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal data, please contact us immediately.
              </p>
            </section>

            {/* Changes */}
            <section id="changes" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center text-white font-bold shadow-md">
                  9
                </div>
                Changes to This Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. You are advised to review this policy periodically for any changes. Changes are effective immediately upon posting.
              </p>
            </section>

            {/* Contact */}
            <section id="contact" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                  10
                </div>
                Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                If you have any questions or concerns about this privacy policy or our data practices, please don't hesitate to contact us:
              </p>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Email:</strong> privacy@jobportal.com</p>
                  <p><strong>Data Protection Officer:</strong> dpo@jobportal.com</p>
                  <p><strong>Address:</strong> 123 Tech Street, San Francisco, CA 94105</p>
                </div>
                <a
                  href="mailto:privacy@jobportal.com"
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Mail className="w-5 h-5" />
                  Email Privacy Team
                </a>
              </div>
            </section>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 p-6">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> This is a demo application. In production, this page would contain a comprehensive privacy policy drafted by legal counsel and compliant with all applicable laws including GDPR, CCPA, and other data protection regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
