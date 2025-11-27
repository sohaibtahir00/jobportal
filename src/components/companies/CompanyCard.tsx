"use client";

import Link from "next/link";
import { Building2, MapPin, Users, Briefcase, BadgeCheck } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui";
import { resolveImageUrl } from "@/lib/utils";

export interface PublicCompany {
  id: string;
  slug: string | null;
  companyName: string;
  companyLogo: string | null;
  industry: string | null;
  companySize: string | null;
  location: string | null;
  description: string | null;
  verified: boolean;
  activeJobsCount: number;
  totalHires: number;
}

interface CompanyCardProps {
  company: PublicCompany;
}

export function CompanyCard({ company }: CompanyCardProps) {
  // Generate company link - use slug if available, otherwise id
  const companyLink = `/companies/${company.slug || company.id}`;

  // Generate initials for fallback logo
  const initials = company.companyName
    ? company.companyName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "CO";

  // Generate a consistent color based on company name
  const colors = [
    "bg-primary-500",
    "bg-accent-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-indigo-500",
  ];
  const colorIndex = company.companyName
    ? company.companyName.charCodeAt(0) % colors.length
    : 0;
  const bgColor = colors[colorIndex];

  return (
    <Link href={companyLink}>
      <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-6">
          {/* Header with Logo and Name */}
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl overflow-hidden ${
                company.companyLogo ? "bg-white" : bgColor
              }`}
            >
              {company.companyLogo ? (
                <img
                  src={resolveImageUrl(company.companyLogo) || ''}
                  alt={company.companyName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-white">{initials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-secondary-900 text-lg truncate">
                  {company.companyName}
                </h3>
                {company.verified && (
                  <BadgeCheck className="h-5 w-5 text-primary-600 flex-shrink-0" />
                )}
              </div>
              {company.industry && (
                <Badge variant="secondary" size="sm">
                  {company.industry}
                </Badge>
              )}
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-2 mb-4">
            {company.location && (
              <div className="flex items-center gap-2 text-sm text-secondary-600">
                <MapPin className="h-4 w-4 flex-shrink-0 text-secondary-400" />
                <span className="truncate">{company.location}</span>
              </div>
            )}
            {company.companySize && (
              <div className="flex items-center gap-2 text-sm text-secondary-600">
                <Users className="h-4 w-4 flex-shrink-0 text-secondary-400" />
                <span>{company.companySize} employees</span>
              </div>
            )}
          </div>

          {/* Description */}
          {company.description && (
            <p className="text-sm text-secondary-600 line-clamp-2 mb-4">
              {company.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-secondary-900">
                {company.activeJobsCount} open position
                {company.activeJobsCount !== 1 ? "s" : ""}
              </span>
            </div>
            {company.totalHires > 0 && (
              <span className="text-xs text-secondary-500">
                {company.totalHires} hire{company.totalHires !== 1 ? "s" : ""} made
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
