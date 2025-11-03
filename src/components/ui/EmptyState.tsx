import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-secondary-300 bg-secondary-50 px-6 py-12 text-center">
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary-100">
          <Icon className="h-8 w-8 text-secondary-400" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-secondary-900">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-secondary-600">{description}</p>
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}
