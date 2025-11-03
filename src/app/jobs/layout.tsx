import type { Metadata } from "next";
import { mockJobs } from "@/lib/mockData";

export const metadata: Metadata = {
  title: `Browse ${mockJobs.length} Jobs in AI/ML, Data Science & Tech`,
  description:
    "Find your next opportunity in AI, Machine Learning, Data Science, Healthcare IT, FinTech, Cybersecurity, and Cloud Computing. Filter by experience level, location, remote type, and salary.",
  openGraph: {
    title: `Browse ${mockJobs.length} Jobs in AI/ML, Data Science & Tech`,
    description:
      "Find your next opportunity in AI, Machine Learning, Data Science, Healthcare IT, FinTech, Cybersecurity, and Cloud Computing.",
    type: "website",
    url: "https://aiml-jobs.com/jobs",
    images: [
      {
        url: "/og-image-jobs.png",
        width: 1200,
        height: 630,
        alt: "Browse AI/ML Jobs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Browse ${mockJobs.length} Jobs in AI/ML, Data Science & Tech`,
    description:
      "Find your next opportunity in AI, Machine Learning, Data Science, Healthcare IT, FinTech, Cybersecurity, and Cloud Computing.",
    images: ["/og-image-jobs.png"],
  },
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
