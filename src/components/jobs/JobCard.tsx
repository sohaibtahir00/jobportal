import Link from "next/link";
import { MapPin, Briefcase, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { Job } from "@/lib/mock-jobs";
import { formatCurrency } from "@/lib/utils";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-2xl">
              {job.logo}
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-semibold text-secondary-900 line-clamp-1">
                {job.title}
              </h3>
              <p className="text-sm text-secondary-600">{job.company}</p>
            </div>
          </div>
        </div>

        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <Briefcase className="h-4 w-4 flex-shrink-0" />
            <span>{job.type}</span>
            <span className="text-secondary-400">•</span>
            <span>{job.experienceLevel}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <DollarSign className="h-4 w-4 flex-shrink-0" />
            <span>
              {formatCurrency(job.salary.min)} -{" "}
              {formatCurrency(job.salary.max)}
            </span>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <Badge
            variant={
              job.remote === "Remote"
                ? "success"
                : job.remote === "Hybrid"
                ? "primary"
                : "secondary"
            }
            size="sm"
          >
            {job.remote}
          </Badge>
          <Badge variant="outline" size="sm">
            {job.niche}
          </Badge>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {job.tags.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} variant="secondary" size="sm">
              {tag}
            </Badge>
          ))}
          {job.tags.length > 3 && (
            <Badge variant="secondary" size="sm">
              +{job.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-secondary-200 pt-4">
          <div className="flex items-center gap-1 text-xs text-secondary-500">
            <Clock className="h-3 w-3" />
            <span>{job.posted}</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/jobs/${job.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
