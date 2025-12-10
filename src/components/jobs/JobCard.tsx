import Link from "next/link";
import { MapPin, Briefcase, DollarSign, Clock, Star } from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { Job } from "@/types";
import { formatCurrency, resolveImageUrl } from "@/lib/utils";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  // Helper function to format job type for display (normalize case)
  const formatJobType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Helper function to format experience level (normalize case)
  const formatExperienceLevel = (level: string) => {
    return level.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Helper function to simplify location (extract city and country)
  const simplifyLocation = (location: string) => {
    if (!location) return '';

    // Split by comma and get parts
    const parts = location.split(',').map(part => part.trim());

    if (parts.length <= 2) {
      // Already simple enough (e.g., "New York, USA")
      return location;
    }

    // Try to extract city and country
    // Common patterns: "Street Address, City, State, Country" or "Address, City, Country"
    // We want: "City, Country"

    // Get the last part (usually country)
    const country = parts[parts.length - 1];

    // Find city - usually the part before state/country
    // Skip parts that look like street addresses (contain numbers at the start)
    let city = '';
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      // Skip if it starts with a number (likely street address)
      if (!/^\d/.test(part) && part.length > 2) {
        city = part;
        break;
      }
    }

    // If we couldn't find a city, use the second-to-last part
    if (!city && parts.length >= 2) {
      city = parts[parts.length - 2];
    }

    if (city && country) {
      return `${city}, ${country}`;
    }

    return location;
  };

  // Helper function to get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Use techStack if available, otherwise fall back to skills
  const techTags = job.techStack && job.techStack.length > 0 ? job.techStack : job.skills;

  return (
    <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header with Logo and Title */}
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-2xl">
            {job.employer?.companyLogo ? (
              <img src={resolveImageUrl(job.employer.companyLogo) || ''} alt={job.employer.companyName} className="h-full w-full rounded-lg object-cover" />
            ) : (
              job.employer?.companyName?.charAt(0) || 'J'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="mb-1 font-semibold text-secondary-900 line-clamp-2 text-base">
              {job.title}
            </h3>
            {job.employer ? (
              <Link
                href={`/companies/${(job.employer as any).slug || job.employer.id}`}
                className="text-sm text-secondary-600 truncate hover:text-primary-600 hover:underline block"
                onClick={(e) => e.stopPropagation()}
              >
                {job.employer.companyName || 'Company'}
              </Link>
            ) : (
              <p className="text-sm text-secondary-600 truncate">Company</p>
            )}
            {job.requiresAssessment && (
              <p className="text-xs text-amber-600 mt-0.5">Skills verified candidates preferred</p>
            )}
            {/* Verified Talent Badge - moved to header */}
            {job.requiresAssessment && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 mt-2" size="sm">
                <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                Verified Talent
              </Badge>
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="mb-4 space-y-2 flex-grow">
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{simplifyLocation(job.location)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <Briefcase className="h-4 w-4 flex-shrink-0" />
            {(job as any).nicheCategory && (
              <>
                <span className="truncate">{(job as any).nicheCategory}</span>
                <span className="text-secondary-400">•</span>
              </>
            )}
            <span className="truncate">{formatExperienceLevel(job.experienceLevel)}</span>
          </div>
          {job.salaryMin && job.salaryMax && (
            <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              <span>
                {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
              </span>
            </div>
          )}
        </div>

        {/* Remote & Type Badges */}
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge variant="success" size="sm">
            {job.remote ? 'Remote' : 'On-site'}
          </Badge>
          <Badge className="bg-primary-100 text-primary-700 border-primary-200" size="sm">
            {formatJobType(job.type)}
          </Badge>
        </div>

        {/* Tech Stack Tags */}
        {techTags && techTags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {techTags.slice(0, 3).map((tag: string, idx: number) => (
              <Badge key={idx} variant="secondary" size="sm">
                {tag}
              </Badge>
            ))}
            {techTags.length > 3 && (
              <Link href={`/jobs/${job.id}`}>
                <Badge className="bg-primary-100 text-primary-700 border-primary-200 cursor-pointer hover:bg-primary-200" size="sm">
                  +{techTags.length - 3} more skills
                </Badge>
              </Link>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-secondary-200 pt-4 mt-auto">
          <div className="flex items-center gap-1 text-xs text-secondary-500">
            <Clock className="h-3 w-3" />
            <span>{getRelativeTime(job.createdAt)}</span>
          </div>
          <Button variant="primary" size="sm" asChild>
            <Link href={`/jobs/${job.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
