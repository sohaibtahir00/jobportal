import type { Metadata } from "next";

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Note: In a production app, you might want to fetch job data here for SEO
  // For now, we'll use a generic metadata that works for all jobs

  return {
    title: "Job Details | AI/ML Jobs",
    description: "View job details and apply for this position. Find your next opportunity in AI, Machine Learning, and Data Science.",
    openGraph: {
      title: "Job Details | AI/ML Jobs",
      description: "View job details and apply for this position",
      type: "website",
      url: `https://aiml-jobs.com/jobs/${params.id}`,
      images: [
        {
          url: "/og-image-job-default.png",
          width: 1200,
          height: 630,
          alt: "Job Details",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Job Details | AI/ML Jobs",
      description: "View job details and apply for this position",
      images: ["/og-image-job-default.png"],
    },
  };
}

export default function JobDetailLayout({ children }: Props) {
  return <>{children}</>;
}
