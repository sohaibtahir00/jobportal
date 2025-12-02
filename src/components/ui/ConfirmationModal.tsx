"use client";

import * as React from "react";
import { AlertTriangle, Trash2, XCircle, CheckCircle, Info, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./Dialog";
import { Button } from "./Button";

export type ConfirmationVariant = "danger" | "warning" | "info" | "success";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  isLoading?: boolean;
}

const variantConfig: Record<
  ConfirmationVariant,
  {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    buttonVariant: "primary" | "outline";
    buttonClass: string;
  }
> = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    buttonVariant: "primary",
    buttonClass: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    buttonVariant: "primary",
    buttonClass: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    buttonVariant: "primary",
    buttonClass: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  },
  success: {
    icon: CheckCircle,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    buttonVariant: "primary",
    buttonClass: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
  },
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Error handling is done by the caller
      console.error("Confirmation action failed:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  const loading = isLoading || isConfirming;

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
          <div className="flex-1 text-center sm:text-left">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-secondary-900">
                {title}
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-secondary-600">
                {message}
              </DialogDescription>
            </DialogHeader>
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
            onClick={handleConfirm}
            disabled={loading}
            className={`w-full sm:w-auto ${config.buttonClass}`}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Hook for easier usage with state management
export interface UseConfirmationModalReturn {
  isOpen: boolean;
  openModal: (config: Omit<ConfirmationModalProps, "isOpen" | "onClose">) => void;
  closeModal: () => void;
  ConfirmationModalComponent: React.FC;
}

export const useConfirmationModal = (): UseConfirmationModalReturn => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Omit<
    ConfirmationModalProps,
    "isOpen" | "onClose"
  > | null>(null);

  const openModal = React.useCallback(
    (modalConfig: Omit<ConfirmationModalProps, "isOpen" | "onClose">) => {
      setConfig(modalConfig);
      setIsOpen(true);
    },
    []
  );

  const closeModal = React.useCallback(() => {
    setIsOpen(false);
    // Delay clearing config to allow close animation
    setTimeout(() => setConfig(null), 200);
  }, []);

  const ConfirmationModalComponent: React.FC = React.useCallback(() => {
    if (!config) return null;

    return (
      <ConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        {...config}
      />
    );
  }, [isOpen, config, closeModal]);

  return {
    isOpen,
    openModal,
    closeModal,
    ConfirmationModalComponent,
  };
};

export default ConfirmationModal;
