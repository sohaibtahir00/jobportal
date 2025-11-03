import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li
              key={step.id}
              className={cn(
                "relative",
                index !== steps.length - 1 ? "flex-1 pr-8 sm:pr-20" : ""
              )}
            >
              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div
                  className="absolute left-0 top-4 -ml-px mt-0.5 h-0.5 w-full"
                  aria-hidden="true"
                >
                  <div
                    className={cn(
                      "h-full transition-colors",
                      isCompleted ? "bg-primary-600" : "bg-secondary-200"
                    )}
                  />
                </div>
              )}

              {/* Step Circle */}
              <div className="group relative flex flex-col items-start">
                <span className="flex items-start">
                  <span className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center">
                    {isCompleted ? (
                      <span className="flex h-full w-full items-center justify-center rounded-full bg-primary-600">
                        <Check className="h-5 w-5 text-white" />
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "flex h-full w-full items-center justify-center rounded-full border-2",
                          isCurrent
                            ? "border-primary-600 bg-white"
                            : "border-secondary-300 bg-white"
                        )}
                      >
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            isCurrent
                              ? "text-primary-600"
                              : "text-secondary-500"
                          )}
                        >
                          {stepNumber}
                        </span>
                      </span>
                    )}
                  </span>
                </span>
                <span className="mt-2 flex min-w-0 flex-col">
                  <span
                    className={cn(
                      "text-xs font-medium sm:text-sm",
                      isCurrent || isCompleted
                        ? "text-primary-600"
                        : "text-secondary-500"
                    )}
                  >
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="hidden text-xs text-secondary-500 sm:inline">
                      {step.description}
                    </span>
                  )}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
