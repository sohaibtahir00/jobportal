import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Employers - Post Jobs & Hire Top AI/ML Talent",
  description:
    "Hire exceptional AI Engineers, Data Scientists, and ML Researchers. Post jobs, browse qualified candidates, and build your tech team with top talent from our platform.",
  openGraph: {
    title: "For Employers - Post Jobs & Hire Top AI/ML Talent",
    description:
      "Hire exceptional AI Engineers, Data Scientists, and ML Researchers. Post jobs and build your tech team.",
    type: "website",
    url: "https://aiml-jobs.com/employers",
    images: [
      {
        url: "/og-image-employers.png",
        width: 1200,
        height: 630,
        alt: "Hire Top AI/ML Talent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "For Employers - Hire Top AI/ML Talent",
    description: "Post jobs, browse qualified candidates, and build your tech team.",
    images: ["/og-image-employers.png"],
  },
};

export default function EmployersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
