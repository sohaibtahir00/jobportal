import { Card, CardContent, Badge } from "@/components/ui";

export interface Filters {
  niches: string[];
  locations: string[];
  remoteTypes: string[];
  experienceLevels: string[];
  salaryMin: number;
  salaryMax: number;
}

interface FiltersSidebarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function FiltersSidebar({ filters, onFilterChange }: FiltersSidebarProps) {
  const niches = ["AI/ML", "Healthcare IT", "FinTech", "Cybersecurity"];
  const remoteTypes = ["Remote", "Hybrid", "On-site"];
  const experienceLevels = ["Entry", "Mid", "Senior", "Lead"];
  const locations = [
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
    "Boston, MA",
    "Remote",
  ];

  const toggleFilter = (
    category: keyof Pick<Filters, "niches" | "locations" | "remoteTypes" | "experienceLevels">,
    value: string
  ) => {
    const currentValues = filters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFilterChange({
      ...filters,
      [category]: newValues,
    });
  };

  const handleSalaryChange = (type: "min" | "max", value: string) => {
    const numValue = parseInt(value) || 0;
    onFilterChange({
      ...filters,
      [type === "min" ? "salaryMin" : "salaryMax"]: numValue,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      niches: [],
      locations: [],
      remoteTypes: [],
      experienceLevels: [],
      salaryMin: 0,
      salaryMax: 300000,
    });
  };

  const activeFiltersCount =
    filters.niches.length +
    filters.locations.length +
    filters.remoteTypes.length +
    filters.experienceLevels.length;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-secondary-900">Filters</h2>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear all
            </button>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {filters.niches.map((niche) => (
              <Badge
                key={niche}
                variant="primary"
                className="cursor-pointer"
                onClick={() => toggleFilter("niches", niche)}
              >
                {niche} ×
              </Badge>
            ))}
            {filters.remoteTypes.map((type) => (
              <Badge
                key={type}
                variant="success"
                className="cursor-pointer"
                onClick={() => toggleFilter("remoteTypes", type)}
              >
                {type} ×
              </Badge>
            ))}
            {filters.experienceLevels.map((level) => (
              <Badge
                key={level}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleFilter("experienceLevels", level)}
              >
                {level} ×
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-6">
          {/* Niche Filter */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-secondary-900">
              Niche
            </h3>
            <div className="space-y-2">
              {niches.map((niche) => (
                <label
                  key={niche}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={filters.niches.includes(niche)}
                    onChange={() => toggleFilter("niches", niche)}
                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-2 focus:ring-primary-600 focus:ring-offset-0"
                  />
                  <span className="text-sm text-secondary-700">{niche}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Remote Type Filter */}
          <div className="border-t border-secondary-200 pt-6">
            <h3 className="mb-3 text-sm font-semibold text-secondary-900">
              Work Location
            </h3>
            <div className="space-y-2">
              {remoteTypes.map((type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={filters.remoteTypes.includes(type)}
                    onChange={() => toggleFilter("remoteTypes", type)}
                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-2 focus:ring-primary-600 focus:ring-offset-0"
                  />
                  <span className="text-sm text-secondary-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Level Filter */}
          <div className="border-t border-secondary-200 pt-6">
            <h3 className="mb-3 text-sm font-semibold text-secondary-900">
              Experience Level
            </h3>
            <div className="space-y-2">
              {experienceLevels.map((level) => (
                <label
                  key={level}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={filters.experienceLevels.includes(level)}
                    onChange={() => toggleFilter("experienceLevels", level)}
                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-2 focus:ring-primary-600 focus:ring-offset-0"
                  />
                  <span className="text-sm text-secondary-700">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="border-t border-secondary-200 pt-6">
            <h3 className="mb-3 text-sm font-semibold text-secondary-900">
              Location
            </h3>
            <div className="space-y-2">
              {locations.map((location) => (
                <label
                  key={location}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={filters.locations.includes(location)}
                    onChange={() => toggleFilter("locations", location)}
                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-2 focus:ring-primary-600 focus:ring-offset-0"
                  />
                  <span className="text-sm text-secondary-700">{location}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Salary Range Filter */}
          <div className="border-t border-secondary-200 pt-6">
            <h3 className="mb-3 text-sm font-semibold text-secondary-900">
              Salary Range
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-secondary-600">
                  Min ($)
                </label>
                <input
                  type="number"
                  value={filters.salaryMin || ""}
                  onChange={(e) => handleSalaryChange("min", e.target.value)}
                  placeholder="0"
                  className="h-9 w-full rounded-md border border-secondary-300 px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-secondary-600">
                  Max ($)
                </label>
                <input
                  type="number"
                  value={filters.salaryMax === 300000 ? "" : filters.salaryMax}
                  onChange={(e) => handleSalaryChange("max", e.target.value)}
                  placeholder="No max"
                  className="h-9 w-full rounded-md border border-secondary-300 px-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
