"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge, Card, CardContent, Button } from "@/components/ui";
import { blogPosts, blogCategories } from "@/lib/blog-data";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Articles");

  // Filter posts based on selected category
  const filteredPosts =
    selectedCategory === "All Articles"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-20 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Career Resources & Insights
            </h1>
            <p className="text-xl text-primary-100">
              Expert guides, salary data, interview tips, and industry trends for tech
              engineers
            </p>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="bg-white py-8 shadow-sm">
        <div className="container">
          {/* Desktop: Horizontal tabs */}
          <div className="hidden md:block">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {blogCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-primary-600 text-white shadow-md"
                      : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile: Dropdown */}
          <div className="md:hidden">
            <label htmlFor="category-select" className="sr-only">
              Select article category
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-secondary-300 bg-white px-4 py-3 text-sm font-medium text-secondary-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {blogCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8">
            <p className="text-sm text-secondary-600">
              Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="h-full transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="flex h-full flex-col p-0">
                  {/* Featured Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100">
                    <div className="flex h-full items-center justify-center text-6xl">
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

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    {/* Category Badge */}
                    <div className="mb-3">
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
                        size="sm"
                      >
                        {post.category}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 text-xl font-bold text-secondary-900 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="mb-4 flex-1 text-sm text-secondary-600 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-secondary-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{post.date}</span>
                      </div>
                    </div>

                    {/* Read More Link */}
                    <Link
                      href={`/blog/${post.slug}`}
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

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg text-secondary-600">
                No articles found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-16 text-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Advance Your Career?</h2>
            <p className="mb-8 text-xl text-primary-100">
              Explore thousands of opportunities from top tech companies
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
