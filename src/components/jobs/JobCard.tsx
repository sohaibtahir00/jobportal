import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
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

  // Format salary for display (e.g., "$150k - $220k")
  const formatSalaryRange = () => {
    if (!job.salaryMin || !job.salaryMax) return null;
    const minK = Math.round(job.salaryMin / 1000);
    const maxK = Math.round(job.salaryMax / 1000);
    return `$${minK}k - $${maxK}k`;
  };

  return (
    <Card className="h-full transition-all hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header with Logo and Title */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 text-2xl shadow-sm overflow-hidden">
              {job.employer?.companyLogo ? (
                <img
                  src={resolveImageUrl(job.employer.companyLogo) || ''}
                  alt={job.employer.companyName}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <span className="font-semibold text-primary-600">
                  {job.employer?.companyName?.charAt(0) || 'J'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-secondary-900 line-clamp-1">
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
                <p className="mt-1 text-xs text-amber-600">Skills verified candidates preferred</p>
              )}
            </div>
          </div>
          {job.requiresAssessment && (
            <Badge
              variant="warning"
              size="sm"
              className="ml-2 flex-shrink-0 bg-amber-100 text-amber-700 border-amber-200"
            >
              ⭐ Verified Talent
            </Badge>
          )}
        </div>

        {/* Badges Section */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="secondary" size="sm">
            {formatJobType(job.type)}
          </Badge>
          {job.remote && (
            <Badge variant="success" size="sm">
              Remote
            </Badge>
          )}
        </div>

        {/* Location */}
        <div className="mb-4 flex items-center gap-4 text-sm text-secondary-600">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
        </div>

        {/* Skills Tags */}
        {job.skills && job.skills.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {job.skills.slice(0, 3).map((tag: string, idx: number) => (
              <Badge key={idx} variant="outline" size="sm">
                {tag}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="outline" size="sm">
                +{job.skills.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-secondary-200 pt-4 mt-auto">
          <span className="text-sm font-semibold text-secondary-900">
            {formatSalaryRange() || 'Competitive'}
          </span>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:border-primary-300 transition-all"
          >
            <Link href={`/jobs/${job.id}`}>View Details</Link>
          </Button>
        </div>

        {/* Posted Time */}
        <p className="mt-3 text-xs text-secondary-500">
          Posted {getRelativeTime(job.createdAt)}
        </p>
      </CardContent>
    </Card>
  );
}
