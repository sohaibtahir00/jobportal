import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, User, ArrowRight, ArrowLeft, Briefcase, MapPin, DollarSign, Mail } from "lucide-react";
import { Badge, Card, CardContent, Button, Input } from "@/components/ui";
import { blogPosts } from "@/lib/blog-data";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Job Portal Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: [post.category],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

// Mock related jobs data (would come from API in production)
const getRelatedJobs = (category: string) => {
  const jobsByCategory: Record<string, any[]> = {
    "AI/ML": [
      {
        id: "ai-1",
        title: "Senior ML Engineer",
        company: "TechCorp AI",
        location: "San Francisco, CA",
        type: "Full-time",
        salaryMin: 150000,
        salaryMax: 200000,
      },
      {
        id: "ai-2",
        title: "AI Research Scientist",
        company: "DeepMind Labs",
        location: "Remote",
        type: "Full-time",
        salaryMin: 180000,
        salaryMax: 250000,
      },
      {
        id: "ai-3",
        title: "Machine Learning Platform Engineer",
        company: "DataScale Inc",
        location: "New York, NY",
        type: "Full-time",
        salaryMin: 140000,
        salaryMax: 190000,
      },
    ],
    "Career Guide": [
      {
        id: "cg-1",
        title: "Software Engineer",
        company: "Startup Inc",
        location: "Austin, TX",
        type: "Full-time",
        salaryMin: 100000,
        salaryMax: 140000,
      },
      {
        id: "cg-2",
        title: "Senior Developer",
        company: "BigTech Co",
        location: "Seattle, WA",
        type: "Full-time",
        salaryMin: 130000,
        salaryMax: 170000,
      },
    ],
    "Salary Data": [
      {
        id: "sd-1",
        title: "Data Analyst",
        company: "Analytics Pro",
        location: "Boston, MA",
        type: "Full-time",
        salaryMin: 80000,
        salaryMax: 110000,
      },
      {
        id: "sd-2",
        title: "Senior Data Scientist",
        company: "Data Insights",
        location: "Remote",
        type: "Full-time",
        salaryMin: 140000,
        salaryMax: 180000,
      },
    ],
    "Interview Tips": [
      {
        id: "it-1",
        title: "Full Stack Developer",
        company: "WebDev Co",
        location: "Los Angeles, CA",
        type: "Full-time",
        salaryMin: 110000,
        salaryMax: 150000,
      },
      {
        id: "it-2",
        title: "Frontend Engineer",
        company: "UI Masters",
        location: "San Diego, CA",
        type: "Full-time",
        salaryMin: 100000,
        salaryMax: 140000,
      },
    ],
  };

  return jobsByCategory[category] || [];
};

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  // Get related jobs
  const relatedJobs = getRelatedJobs(post.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Back to Blog */}
      <div className="border-b border-secondary-200 bg-white py-4">
        <div className="container">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <section className="bg-white py-12">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Category Badge */}
            <div className="mb-4">
              <Badge
                variant={
                  post.category === "AI/ML"
                    ? "primary"
                    : post.category === "Salary Data"
                    ? "success"
                    : post.category === "Interview Tips"
                    ? "warning"
                    : "secondary"
                }
              >
                {post.category}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold text-secondary-900 md:text-5xl">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-secondary-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="bg-white">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="h-96 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100">
              <div className="flex h-full items-center justify-center text-9xl">
                {post.category === "AI/ML" && "🤖"}
                {post.category === "Career Guide" && "🎯"}
                {post.category === "Salary Data" && "💰"}
                {post.category === "Interview Tips" && "💼"}
                {post.category === "Skills Assessment" && "📊"}
                {post.category === "Healthcare IT" && "🏥"}
                {post.category === "FinTech" && "💳"}
                {post.category === "Cybersecurity" && "🔒"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content with Sidebar */}
      <section className="bg-white py-12">
        <div className="container">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="prose prose-lg max-w-none">
                  {post.content.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-6 text-secondary-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  {/* Related Jobs Widget */}
                  {relatedJobs.length > 0 && (
                    <Card className="border-2 border-primary-200">
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-primary-600" />
                          <h3 className="text-lg font-bold text-secondary-900">
                            Related Jobs
                          </h3>
                        </div>
                        <p className="mb-6 text-sm text-secondary-600">
                          Opportunities matching this article
                        </p>

                        <div className="space-y-4">
                          {relatedJobs.map((job) => (
                            <div
                              key={job.id}
                              className="rounded-lg border border-secondary-200 p-4 transition-all hover:border-primary-300 hover:shadow-md"
                            >
                              <h4 className="mb-2 font-semibold text-secondary-900 line-clamp-2">
                                {job.title}
                              </h4>
                              <p className="mb-3 text-sm text-secondary-600">
                                {job.company}
                              </p>
                              <div className="mb-3 space-y-1.5 text-sm text-secondary-600">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-3.5 w-3.5" />
                                  <span>
                                    ${(job.salaryMin / 1000).toFixed(0)}k - $
                                    {(job.salaryMax / 1000).toFixed(0)}k
                                  </span>
                                </div>
                              </div>
                              <Badge variant="secondary" size="sm">
                                {job.type}
                              </Badge>
                            </div>
                          ))}
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-6 w-full"
                          asChild
                        >
                          <Link href="/jobs">
                            View All Jobs
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Newsletter Signup Widget */}
                  <Card className="bg-gradient-to-br from-accent-50 to-primary-50">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center gap-2">
                        <Mail className="h-5 w-5 text-accent-600" />
                        <h3 className="text-lg font-bold text-secondary-900">
                          Stay Updated
                        </h3>
                      </div>
                      <p className="mb-6 text-sm text-secondary-600">
                        Get weekly career tips, salary insights, and job alerts delivered to
                        your inbox.
                      </p>
                      <form className="space-y-3">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full"
                        />
                        <Button variant="primary" size="sm" className="w-full">
                          Subscribe
                        </Button>
                      </form>
                      <p className="mt-3 text-xs text-secondary-500">
                        No spam. Unsubscribe anytime.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-8 text-3xl font-bold text-secondary-900">
                Related Articles
              </h2>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Card
                    key={relatedPost.id}
                    className="transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    <CardContent className="p-0">
                      {/* Featured Image */}
                      <div className="h-40 bg-gradient-to-br from-primary-100 to-accent-100">
                        <div className="flex h-full items-center justify-center text-5xl">
                          {relatedPost.category === "AI/ML" && "🤖"}
                          {relatedPost.category === "Career Guide" && "🎯"}
                          {relatedPost.category === "Salary Data" && "💰"}
                          {relatedPost.category === "Interview Tips" && "💼"}
                          {relatedPost.category === "Skills Assessment" && "📊"}
                        </div>
                      </div>

                      <div className="p-6">
                        {/* Category */}
                        <Badge variant="secondary" size="sm" className="mb-3">
                          {relatedPost.category}
                        </Badge>

                        {/* Title */}
                        <h3 className="mb-2 font-bold text-secondary-900 line-clamp-2">
                          {relatedPost.title}
                        </h3>

                        {/* Meta */}
                        <div className="mb-4 flex items-center gap-3 text-xs text-secondary-500">
                          <span>{relatedPost.readTime}</span>
                          <span>•</span>
                          <span>{relatedPost.date}</span>
                        </div>

                        {/* Read More */}
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          Read More
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup Section */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <Card className="border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-accent-50">
              <CardContent className="p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                  <Mail className="h-8 w-8 text-primary-600" />
                </div>
                <h2 className="mb-4 text-3xl font-bold text-secondary-900">
                  Never Miss an Update
                </h2>
                <p className="mb-8 text-lg text-secondary-600">
                  Join 50,000+ tech professionals getting weekly career insights, salary data,
                  and exclusive job opportunities.
                </p>
                <form className="mx-auto max-w-md">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className="flex-1 bg-white"
                      required
                    />
                    <Button variant="primary" size="lg" type="submit">
                      Subscribe
                    </Button>
                  </div>
                  <p className="mt-4 text-sm text-secondary-500">
                    Free resources. No spam. Unsubscribe anytime.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-16 text-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Find Your Next Role?</h2>
            <p className="mb-8 text-xl text-primary-100">
              Browse thousands of opportunities from top tech companies
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/jobs">
                  Browse Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/skills-assessment">Take Skills Assessment</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
