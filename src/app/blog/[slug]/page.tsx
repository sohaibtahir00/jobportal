import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, User, ArrowRight, ArrowLeft } from "lucide-react";
import { Badge, Card, CardContent, Button } from "@/components/ui";
import { blogPosts } from "@/lib/blog-data";

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

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

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

      {/* Article Content */}
      <section className="bg-white py-12">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="prose prose-lg max-w-none">
              {post.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-6 text-secondary-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
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

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-16 text-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Find Your Next Role?</h2>
            <p className="mb-8 text-xl text-primary-100">
              Browse thousands of opportunities from top tech companies
            </p>
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
          </div>
        </div>
      </section>
    </div>
  );
}
