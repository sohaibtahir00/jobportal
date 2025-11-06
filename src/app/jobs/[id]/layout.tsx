import type { Metadata } from "next";
import { getJobById, mockJobs } from "@/lib/mockData";

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = getJobById(params.id);

  if (!job || !job.employer) {
    return {
      title: "Job Not Found",
      description: "The job posting you are looking for does not exist.",
    };
  }

  const employer = job.employer;
  const salaryRange = job.salaryMin && job.salaryMax
    ? `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k`
    : "Competitive";

  return {
    title: `${job.title} at ${employer.companyName}`,
    description: `${job.title} • ${employer.companyName} • ${job.location} • ${job.remote ? 'Remote' : 'On-site'} • ${salaryRange}. ${job.description.substring(0, 150)}...`,
    keywords: [
      job.title,
      employer.companyName,
      job.location,
      ...job.skills,
      job.experienceLevel,
      job.type,
    ],
    openGraph: {
      title: `${job.title} at ${employer.companyName}`,
      description: `${job.title} • ${job.location} • ${job.remote ? 'Remote' : 'On-site'} • ${salaryRange}. Apply now!`,
      type: "website",
      url: `https://aiml-jobs.com/jobs/${params.id}`,
      images: [
        {
          url: employer.companyLogo || "/og-image-job-default.png",
          width: 1200,
          height: 630,
          alt: `${job.title} at ${employer.companyName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.title} at ${employer.companyName}`,
      description: `${job.location} • ${job.remote ? 'Remote' : 'On-site'} • ${salaryRange}. Apply now!`,
      images: [employer.companyLogo || "/og-image-job-default.png"],
    },
  };
}

export default function JobDetailLayout({ children }: Props) {
  return <>{children}</>;
}
