"use client";

import * as React from "react";
import { AlertTriangle, MessageSquare, Info, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./Dialog";
import { Button } from "./Button";
import { Input } from "./Input";

export type InputModalVariant = "danger" | "warning" | "info" | "default";

export interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void | Promise<void>;
  title: string;
  message: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  submitText?: string;
  cancelText?: string;
  variant?: InputModalVariant;
  isLoading?: boolean;
  required?: boolean;
  multiline?: boolean;
  defaultValue?: string;
}

const variantConfig: Record<
  InputModalVariant,
  {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    buttonClass: string;
  }
> = {
  danger: {
    icon: AlertTriangle,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    buttonClass: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    buttonClass: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    buttonClass: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  },
  default: {
    icon: MessageSquare,
    iconBg: "bg-primary-100",
    iconColor: "text-primary-600",
    buttonClass: "bg-primary-600 hover:bg-primary-700 focus:ring-primary-500",
  },
};

export const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  message,
  inputLabel,
  inputPlaceholder = "Enter your response...",
  submitText = "Submit",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
  required = false,
  multiline = false,
  defaultValue = "",
}) => {
  const [value, setValue] = React.useState(defaultValue);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const config = variantConfig[variant];
  const Icon = config.icon;

  // Reset value when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
    }
  }, [isOpen, defaultValue]);

  const handleSubmit = async () => {
    if (required && !value.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(value.trim());
      onClose();
      setValue("");
    } catch (error) {
      console.error("Input modal submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline && !loading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const loading = isLoading || isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !loading && onClose()}>
      <DialogContent showClose={!loading} onClose={onClose} className="sm:max-w-md">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
          {/* Icon */}
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${config.iconBg}`}
          >
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 text-center sm:text-left w-full">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-secondary-900">
                {title}
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-secondary-600">
                {message}
              </DialogDescription>
            </DialogHeader>

            {/* Input Field */}
            <div className="mt-4">
              {inputLabel && (
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  {inputLabel}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}
              {multiline ? (
                <textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={inputPlaceholder}
                  rows={3}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:bg-secondary-100 disabled:cursor-not-allowed"
                />
              ) : (
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={inputPlaceholder}
                  disabled={loading}
                  className="w-full"
                />
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || (required && !value.trim())}
            className={`w-full sm:w-auto ${config.buttonClass}`}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              submitText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InputModal;
