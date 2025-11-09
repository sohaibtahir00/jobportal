"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Briefcase,
  Award,
  Mail,
  Eye,
  Download,
  ChevronDown,
  Loader2,
  Users,
  TrendingUp,
  Code,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";

interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  skillsScore: number;
  tier: string;
  skills: string[];
  seeking: string;
  available: boolean;
}

export default function EmployerSearchPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    minScore: 70,
    location: "",
    experience: "all",
    tier: "all",
    skills: [] as string[],
    availability: "all",
  });

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Redirect if not logged in or not employer
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/employer/search");
    }
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load candidates
  useEffect(() => {
    const loadCandidates = async () => {
      try {
        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockCandidates: Candidate[] = [
          {
            id: "1",
            name: "Sarah Chen",
            title: "Senior ML Engineer",
            location: "San Francisco, CA",
            experience: "7 years",
            skillsScore: 92,
            tier: "Elite",
            skills: ["Python", "PyTorch", "AWS", "Kubernetes"],
            seeking: "Full-time",
            available: true,
          },
          {
            id: "2",
            name: "Michael Rodriguez",
            title: "Full Stack Developer",
            location: "Austin, TX",
            experience: "5 years",
            skillsScore: 85,
            tier: "Advanced",
            skills: ["React", "Node.js", "PostgreSQL", "Docker"],
            seeking: "Full-time",
            available: true,
          },
          {
            id: "3",
            name: "Emily Watson",
            title: "DevOps Engineer",
            location: "Seattle, WA",
            experience: "6 years",
            skillsScore: 88,
            tier: "Advanced",
            skills: ["Kubernetes", "Terraform", "AWS", "CI/CD"],
            seeking: "Full-time / Contract",
            available: false,
          },
          {
            id: "4",
            name: "David Kim",
            title: "Backend Engineer",
            location: "New York, NY",
            experience: "4 years",
            skillsScore: 78,
            tier: "Proficient",
            skills: ["Java", "Spring Boot", "MySQL", "Redis"],
            seeking: "Full-time",
            available: true,
          },
          {
            id: "5",
            name: "Lisa Patel",
            title: "Data Scientist",
            location: "Boston, MA",
            experience: "8 years",
            skillsScore: 95,
            tier: "Elite",
            skills: ["Python", "R", "TensorFlow", "SQL"],
            seeking: "Full-time",
            available: true,
          },
          {
            id: "6",
            name: "James Wilson",
            title: "Security Engineer",
            location: "Remote",
            experience: "6 years",
            skillsScore: 89,
            tier: "Advanced",
            skills: ["Penetration Testing", "SIEM", "Python", "Cloud Security"],
            seeking: "Full-time",
            available: true,
          },
          {
            id: "7",
            name: "Maria Garcia",
            title: "Frontend Developer",
            location: "Los Angeles, CA",
            experience: "4 years",
            skillsScore: 82,
            tier: "Advanced",
            skills: ["React", "TypeScript", "CSS", "Webpack"],
            seeking: "Full-time / Part-time",
            available: true,
          },
          {
            id: "8",
            name: "Robert Brown",
            title: "Cloud Architect",
            location: "Chicago, IL",
            experience: "10 years",
            skillsScore: 93,
            tier: "Elite",
            skills: ["AWS", "Azure", "Terraform", "Kubernetes"],
            seeking: "Full-time",
            available: false,
          },
        ];

        setCandidates(mockCandidates);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      loadCandidates();
    }
  }, [status]);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      searchQuery === "" ||
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesScore = candidate.skillsScore >= filters.minScore;

    const matchesLocation =
      filters.location === "" ||
      candidate.location.toLowerCase().includes(filters.location.toLowerCase());

    const matchesExperience =
      filters.experience === "all" ||
      (filters.experience === "junior" && parseInt(candidate.experience) < 3) ||
      (filters.experience === "mid" && parseInt(candidate.experience) >= 3 && parseInt(candidate.experience) < 7) ||
      (filters.experience === "senior" && parseInt(candidate.experience) >= 7);

    const matchesTier =
      filters.tier === "all" || candidate.tier === filters.tier;

    const matchesAvailability =
      filters.availability === "all" ||
      (filters.availability === "available" && candidate.available) ||
      (filters.availability === "not-available" && !candidate.available);

    return (
      matchesSearch &&
      matchesScore &&
      matchesLocation &&
      matchesExperience &&
      matchesTier &&
      matchesAvailability
    );
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Elite":
        return "text-yellow-600 bg-yellow-50";
      case "Advanced":
        return "text-accent-600 bg-accent-50";
      case "Proficient":
        return "text-primary-600 bg-primary-50";
      default:
        return "text-secondary-600 bg-secondary-50";
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-secondary-900">
            Search Candidates
          </h1>
          <p className="text-secondary-600">
            Find verified candidates matching your requirements
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-bold text-secondary-900">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                <div className={`space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}>
                  {/* Min Skills Score */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Minimum Skills Score: {filters.minScore}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={filters.minScore}
                      onChange={(e) =>
                        setFilters({ ...filters, minScore: parseInt(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Location
                    </label>
                    <Input
                      value={filters.location}
                      onChange={(e) =>
                        setFilters({ ...filters, location: e.target.value })
                      }
                      placeholder="e.g. San Francisco"
                    />
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Experience Level
                    </label>
                    <select
                      value={filters.experience}
                      onChange={(e) =>
                        setFilters({ ...filters, experience: e.target.value })
                      }
                      className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-600 focus:outline-none"
                    >
                      <option value="all">All Levels</option>
                      <option value="junior">Junior (0-3 years)</option>
                      <option value="mid">Mid (3-7 years)</option>
                      <option value="senior">Senior (7+ years)</option>
                    </select>
                  </div>

                  {/* Performance Tier */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Performance Tier
                    </label>
                    <select
                      value={filters.tier}
                      onChange={(e) =>
                        setFilters({ ...filters, tier: e.target.value })
                      }
                      className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-600 focus:outline-none"
                    >
                      <option value="all">All Tiers</option>
                      <option value="Elite">Elite (90+)</option>
                      <option value="Advanced">Advanced (80-89)</option>
                      <option value="Proficient">Proficient (70-79)</option>
                    </select>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Availability
                    </label>
                    <select
                      value={filters.availability}
                      onChange={(e) =>
                        setFilters({ ...filters, availability: e.target.value })
                      }
                      className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-600 focus:outline-none"
                    >
                      <option value="all">All</option>
                      <option value="available">Available</option>
                      <option value="not-available">Not Available</option>
                    </select>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      setFilters({
                        minScore: 70,
                        location: "",
                        experience: "all",
                        tier: "all",
                        skills: [],
                        availability: "all",
                      })
                    }
                  >
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
                <Input
                  type="text"
                  placeholder="Search by name, title, or skills..."
                  className="pl-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="mx-auto mb-2 h-6 w-6 text-primary-600" />
                  <div className="text-2xl font-bold text-secondary-900">
                    {filteredCandidates.length}
                  </div>
                  <div className="text-xs text-secondary-600">Matches Found</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="mx-auto mb-2 h-6 w-6 text-yellow-600" />
                  <div className="text-2xl font-bold text-secondary-900">
                    {filteredCandidates.filter((c) => c.tier === "Elite").length}
                  </div>
                  <div className="text-xs text-secondary-600">Elite Candidates</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="mx-auto mb-2 h-6 w-6 text-success-600" />
                  <div className="text-2xl font-bold text-secondary-900">
                    {filteredCandidates.filter((c) => c.available).length}
                  </div>
                  <div className="text-xs text-secondary-600">Available Now</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="mx-auto mb-2 h-6 w-6 text-accent-600" />
                  <div className="text-2xl font-bold text-secondary-900">
                    {Math.round(
                      filteredCandidates.reduce((sum, c) => sum + c.skillsScore, 0) /
                        filteredCandidates.length || 0
                    )}
                  </div>
                  <div className="text-xs text-secondary-600">Avg Score</div>
                </CardContent>
              </Card>
            </div>

            {/* Candidate List */}
            <div className="space-y-4">
              {filteredCandidates.map((candidate) => (
                <Card key={candidate.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <h3 className="mb-1 text-xl font-bold text-secondary-900">
                              {candidate.name}
                            </h3>
                            <p className="mb-2 text-secondary-600">{candidate.title}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className={`flex items-center gap-1 rounded px-2 py-1 text-sm font-bold ${getTierColor(candidate.tier)}`}>
                              <Star className="h-4 w-4" />
                              {candidate.skillsScore}
                            </div>
                            <Badge variant="secondary" size="sm">
                              {candidate.tier}
                            </Badge>
                          </div>
                        </div>

                        <div className="mb-3 flex flex-wrap gap-4 text-sm text-secondary-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {candidate.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {candidate.experience} experience
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            {candidate.seeking}
                          </span>
                          {candidate.available && (
                            <Badge variant="success" size="sm">
                              Available
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.slice(0, 5).map((skill, idx) => (
                            <Badge key={idx} variant="secondary" size="sm">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 5 && (
                            <Badge variant="secondary" size="sm">
                              +{candidate.skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 md:w-48">
                        <Button variant="primary" size="sm" className="w-full" asChild>
                          <Link href={`/employer/applicants/${candidate.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Mail className="mr-2 h-4 w-4" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Resume
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredCandidates.length === 0 && (
                <div className="py-12 text-center">
                  <p className="mb-2 text-secondary-600">
                    No candidates found matching your criteria
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        minScore: 70,
                        location: "",
                        experience: "all",
                        tier: "all",
                        skills: [],
                        availability: "all",
                      })
                    }
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
