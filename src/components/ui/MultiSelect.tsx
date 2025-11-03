"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  maxSelections?: number;
}

export function MultiSelect({
  label,
  options,
  value = [],
  onChange,
  placeholder = "Select options...",
  error,
  helperText,
  required,
  maxSelections,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !value.includes(option.value)
  );

  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      if (maxSelections && value.length >= maxSelections) {
        return;
      }
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-secondary-700">
          {label}
          {required && <span className="text-danger-600"> *</span>}
        </label>
      )}

      <div ref={containerRef} className="relative">
        {/* Selected Tags */}
        {selectedOptions.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700"
              >
                {option.label}
                <button
                  type="button"
                  onClick={() => handleRemove(option.value)}
                  className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-600 hover:bg-primary-200 hover:text-primary-800 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500",
            error
              ? "border-danger-300 focus:border-danger-500"
              : "border-secondary-300 focus:border-primary-500",
            isOpen && "ring-2 ring-primary-500"
          )}
        >
          <span className={value.length === 0 ? "text-secondary-400" : "text-secondary-900"}>
            {value.length === 0
              ? placeholder
              : `${value.length} selected`}
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-secondary-400 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 mt-2 w-full rounded-lg border border-secondary-200 bg-white shadow-lg">
            {/* Search */}
            <div className="border-b border-secondary-200 p-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-secondary-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            {/* Options */}
            <div className="max-h-60 overflow-y-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-center text-sm text-secondary-500">
                  {searchTerm ? "No results found" : "All options selected"}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleToggle(option.value)}
                    className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-secondary-50"
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(option.value)}
                      onChange={() => {}}
                      className="mr-3 h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-secondary-900">{option.label}</span>
                  </button>
                ))
              )}
            </div>

            {maxSelections && (
              <div className="border-t border-secondary-200 px-3 py-2 text-xs text-secondary-500">
                {value.length} / {maxSelections} selected
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helper Text or Error */}
      {(helperText || error) && (
        <p
          className={cn(
            "mt-1.5 text-sm",
            error ? "text-danger-600" : "text-secondary-500"
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
