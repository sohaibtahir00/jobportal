import Link from "next/link";
import { MapPin, Briefcase, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { Job } from "@/types";
import { formatCurrency, resolveImageUrl } from "@/lib/utils";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  // Helper function to format job type for display
  const formatJobType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Helper function to format experience level
  const formatExperienceLevel = (level: string) => {
    return level.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
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
          </div>
        </div>

        {/* Job Details */}
        <div className="mb-4 space-y-2 flex-grow">
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <Briefcase className="h-4 w-4 flex-shrink-0" />
            <span>{formatJobType(job.type)}</span>
            <span className="text-secondary-400">•</span>
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
          <Badge
            variant={job.remote ? "success" : "secondary"}
            size="sm"
          >
            {job.remote ? 'Remote' : 'On-site'}
          </Badge>
          <Badge variant="outline" size="sm" className="capitalize">
            {formatJobType(job.type)}
          </Badge>
        </div>

        {/* Skills Tags */}
        {job.skills && job.skills.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {job.skills.slice(0, 3).map((tag: string, idx: number) => (
              <Badge key={idx} variant="secondary" size="sm">
                {tag}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="secondary" size="sm">
                +{job.skills.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-secondary-200 pt-4 mt-auto">
          <div className="flex items-center gap-1 text-xs text-secondary-500">
            <Clock className="h-3 w-3" />
            <span>{getRelativeTime(job.createdAt)}</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/jobs/${job.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
