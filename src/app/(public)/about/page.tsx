import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Target, Users, Award, Shield, Sparkles, TrendingUp, CheckCircle, Globe, Building2, UserCheck, Briefcase } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Us | SkillProof",
  description: "Learn about SkillProof - the AI/ML job portal connecting verified talent with innovative companies. Discover our mission, values, and what makes us different.",
};

export default function AboutPage() {
  const stats = [
    { number: "10,000+", label: "Verified Candidates" },
    { number: "500+", label: "Partner Companies" },
    { number: "2,500+", label: "Successful Placements" },
    { number: "95%", label: "Satisfaction Rate" },
  ];

  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're committed to bridging the gap between exceptional AI/ML talent and companies building the future.",
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "Our skills verification system ensures authentic talent assessment, building trust between candidates and employers.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "We foster a thriving community of AI/ML professionals, providing resources, networking, and career growth opportunities.",
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "We continuously improve our platform with cutting-edge technology to deliver the best hiring experience.",
    },
  ];

  const whyChooseUs = [
    {
      icon: Award,
      title: "Skills-Based Assessment",
      description: "Our proprietary assessment platform evaluates candidates on real-world AI/ML skills, not just resumes. Employers see verified skill scores and tier rankings.",
    },
    {
      icon: UserCheck,
      title: "Quality Over Quantity",
      description: "We focus on quality matches. Candidates are verified through assessments, ensuring employers connect with genuinely qualified professionals.",
    },
    {
      icon: TrendingUp,
      title: "Career Growth Focus",
      description: "Beyond job matching, we help candidates build their skills profile, track industry trends, and access exclusive opportunities.",
    },
    {
      icon: Building2,
      title: "Employer Partnership",
      description: "We work closely with employers to understand their needs, providing tailored candidate recommendations and streamlined hiring workflows.",
    },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former ML Engineer at Google with 10+ years in AI recruitment.",
      image: "/team/sarah.jpg",
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-Founder",
      bio: "Built AI hiring platforms at scale. PhD in Computer Science from Stanford.",
      image: "/team/michael.jpg",
    },
    {
      name: "Emily Watson",
      role: "Head of Talent",
      bio: "15 years recruiting top tech talent for Fortune 500 companies.",
      image: "/team/emily.jpg",
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 py-20 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        </div>

        <div className="container relative z-10">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              asChild
              className="gap-2 text-white/90 hover:text-white hover:bg-white/10 transition-all"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Connecting AI/ML Talent with
              <span className="block text-accent-300">Innovative Companies</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
              SkillProof is the premier job platform for AI, Machine Learning, and Data Science professionals.
              We use skills-based assessments to match verified talent with companies building the future.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 -mt-10">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <Card className="border-0 shadow-2xl bg-white">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-primary-600 md:text-4xl">
                        {stat.number}
                      </div>
                      <div className="text-sm text-secondary-600 md:text-base">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary-900 md:text-4xl mb-4">
                Our Story
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full" />
            </div>

            <div className="prose prose-lg mx-auto text-secondary-700">
              <p className="text-lg leading-relaxed mb-6">
                SkillProof was founded in 2023 with a simple but powerful vision: to transform how AI and ML talent connects with opportunity.
                Our founders, who spent years in both technical and recruitment roles, saw a fundamental problem in the industry.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Traditional hiring focused too heavily on credentials and keywords, missing genuinely talented individuals while flooding companies
                with mismatched candidates. We knew there had to be a better way.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                That's why we built SkillProof - a platform that puts verified skills at the center of hiring. Through our proprietary assessment system,
                candidates demonstrate their real-world abilities, earning tier rankings that give employers confidence in their capabilities.
              </p>
              <p className="text-lg leading-relaxed">
                Today, SkillProof serves thousands of candidates and hundreds of companies, from innovative startups to industry leaders.
                We're proud to have facilitated thousands of successful placements, helping build teams that are shaping the future of AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 md:text-4xl mb-4">
              Our Values
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-accent-100">
                        <Icon className="h-7 w-7 text-primary-600" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-secondary-900">
                      {value.title}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 md:text-4xl mb-4">
              Why Choose SkillProof?
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              What makes us different from traditional job boards
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-secondary-900">
                      {item.title}
                    </h3>
                    <p className="text-secondary-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-accent-700 text-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl mb-4">
              How SkillProof Works
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              A streamlined process for both candidates and employers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {/* For Candidates */}
            <Card className="border-0 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Briefcase className="h-6 w-6" />
                  For Candidates
                </h3>
                <div className="space-y-4">
                  {[
                    "Create your profile and showcase your experience",
                    "Take our AI/ML skills assessment to get verified",
                    "Earn your skill tier ranking (Bronze to Diamond)",
                    "Get matched with jobs that fit your verified skills",
                    "Apply with confidence and track your applications",
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-accent-300 flex-shrink-0 mt-0.5" />
                      <span className="text-white/90">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Button
                    variant="secondary"
                    asChild
                    className="w-full bg-white text-primary-600 hover:bg-white/90"
                  >
                    <Link href="/signup?role=candidate">Get Started as Candidate</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* For Employers */}
            <Card className="border-0 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Building2 className="h-6 w-6" />
                  For Employers
                </h3>
                <div className="space-y-4">
                  {[
                    "Create your company profile and verify your business",
                    "Post jobs with detailed requirements and skill needs",
                    "Browse pre-verified candidates with skill scores",
                    "Use our matching algorithm to find ideal candidates",
                    "Streamline interviews and make confident hiring decisions",
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-accent-300 flex-shrink-0 mt-0.5" />
                      <span className="text-white/90">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Button
                    variant="secondary"
                    asChild
                    className="w-full bg-white text-primary-600 hover:bg-white/90"
                  >
                    <Link href="/signup?role=employer">Get Started as Employer</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 md:text-4xl mb-4">
              Industries We Serve
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Connecting talent across the entire AI/ML ecosystem
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {[
              "Machine Learning",
              "Artificial Intelligence",
              "Data Science",
              "Natural Language Processing",
              "Computer Vision",
              "Robotics & Automation",
              "Deep Learning",
              "MLOps & Infrastructure",
              "Healthcare AI",
              "Fintech & Trading",
              "Autonomous Vehicles",
              "Research & Academia",
            ].map((industry, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-white">
        <div className="container">
          <Card className="mx-auto max-w-4xl border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                    Ready to Get Started?
                  </h2>
                  <p className="text-secondary-600 mb-8">
                    Whether you're looking for your next AI/ML opportunity or searching for top talent,
                    SkillProof is here to help you succeed.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="primary"
                      size="lg"
                      asChild
                      className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700"
                    >
                      <Link href="/jobs">Browse Jobs</Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link href="/employers">For Employers</Link>
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block bg-gradient-to-br from-primary-500 to-accent-600 p-12">
                  <div className="h-full flex items-center justify-center">
                    <Globe className="h-32 w-32 text-white/20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white border-t border-secondary-100">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              Have Questions?
            </h2>
            <p className="text-secondary-600 mb-6">
              We'd love to hear from you. Reach out to our team for support or partnership inquiries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/help">Visit Help Center</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
