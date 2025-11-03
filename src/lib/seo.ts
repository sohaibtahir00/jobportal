import type { Job } from "@/types";

/**
 * Generate JSON-LD structured data for a job posting
 * Following Google's JobPosting schema: https://developers.google.com/search/docs/appearance/structured-data/job-posting
 */
export function generateJobPostingJsonLd(job: Job) {
  const employer = job.employer;

  if (!employer) {
    return null;
  }

  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: employer.companyName,
      value: job.id,
    },
    datePosted: job.postedAt.toISOString(),
    validThrough: new Date(
      job.postedAt.getTime() + 90 * 24 * 60 * 60 * 1000
    ).toISOString(), // 90 days from posting
    employmentType: job.employmentType.toUpperCase().replace("-", "_"), // FULL_TIME, PART_TIME, CONTRACT, INTERN
    hiringOrganization: {
      "@type": "Organization",
      name: employer.companyName,
      sameAs: employer.companyWebsite,
      logo: employer.companyLogo,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location.split(",")[0]?.trim() || job.location,
        addressRegion: job.location.split(",")[1]?.trim() || "",
        addressCountry: "US",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: job.salaryCurrency,
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salaryMin,
        maxValue: job.salaryMax,
        unitText: "YEAR",
      },
    },
    responsibilities: job.responsibilities.join(". "),
    skills: job.techStack.join(", "),
    qualifications: job.requirements.join(". "),
    experienceRequirements: {
      "@type": "OccupationalExperienceRequirements",
      monthsOfExperience: getMonthsOfExperience(job.experienceLevel),
    },
    // Remote work options
    ...(job.remoteType === "remote" && {
      jobLocationType: "TELECOMMUTE",
    }),
    applicantLocationRequirements: {
      "@type": "Country",
      name: "US",
    },
  };
}

function getMonthsOfExperience(level: string): number {
  switch (level) {
    case "entry":
      return 12; // 1 year
    case "mid":
      return 36; // 3 years
    case "senior":
      return 60; // 5 years
    case "lead":
      return 120; // 10 years
    default:
      return 0;
  }
}

/**
 * Generate JSON-LD structured data for the organization
 */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AI/ML Job Portal",
    url: "https://aiml-jobs.com",
    logo: "https://aiml-jobs.com/logo.png",
    description:
      "Leading job board for AI, Machine Learning, Data Science, and tech professionals",
    sameAs: [
      "https://twitter.com/aiml_jobs",
      "https://linkedin.com/company/aiml-jobs",
      "https://github.com/aiml-jobs",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "Customer Service",
      email: "support@aiml-jobs.com",
      areaServed: "US",
      availableLanguage: "English",
    },
  };
}

/**
 * Generate JSON-LD structured data for website search
 */
export function generateWebsiteSearchJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI/ML Job Portal",
    url: "https://aiml-jobs.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://aiml-jobs.com/jobs?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate JSON-LD breadcrumb list
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
