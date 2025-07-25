"use client";

import * as React from "react";
import { cn } from "./utils";

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  variant?: "default" | "neon" | "minimal" | "glass";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  animated?: boolean;
}

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({
    className,
    open,
    onOpenChange,
    children,
    variant = "default",
    size = "md",
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    animated = true,
    ...props
  }, ref) => {
    // Modal ref removed as it was unused

    // Handle escape key
    React.useEffect(() => {
      if (!open || !closeOnEscape) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onOpenChange(false);
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [open, closeOnEscape, onOpenChange]);

    // Handle body scroll lock
    React.useEffect(() => {
      if (!open) return;

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }, [open]);

    // Handle overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onOpenChange(false);
      }
    };

    if (!open) return null;

    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-4",
          animated && "openmemo-animate-fade-in-scale"
        )}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleOverlayClick}
        />

        {/* Modal */}
        <div
          ref={ref}
          className={cn(
            "relative w-full max-h-[90vh] overflow-hidden flex flex-col",
            
            // Size variations
            {
              "max-w-sm": size === "sm",
              "max-w-md": size === "md",
              "max-w-2xl": size === "lg",
              "max-w-4xl": size === "xl",
              "max-w-[95vw] max-h-[95vh]": size === "full",
            },

            // Variant styles
            {
              // Default - glass morphism
              "bg-[#1a1a1a]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl": variant === "default",
              
              // Neon - glowing accent
              "bg-[#0d0d0d]/95 backdrop-blur-md border border-[#A8FF00]/30 rounded-2xl shadow-[0_0_40px_rgba(168,255,0,0.2)]": variant === "neon",
              
              // Minimal - subtle
              "bg-white/5 backdrop-blur-sm border border-white/5 rounded-xl": variant === "minimal",
              
              // Glass - strong glass effect
              "bg-white/8 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl": variant === "glass",
            },

            className
          )}
          {...props}
        >
          {/* Close button */}
          {showCloseButton && (
            <button
              onClick={() => onOpenChange(false)}
              className={cn(
                "absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200",
                "text-white/60 hover:text-white hover:bg-white/10 active:scale-95"
              )}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          {/* Content */}
          <div className="flex-1 overflow-auto openmemo-scrollbar">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-6 py-4 border-b border-white/10",
        className
      )}
      {...props}
    />
  )
);

const ModalTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-xl font-semibold text-white leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
);

const ModalDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-sm text-white/70 mt-2",
        className
      )}
      {...props}
    />
  )
);

const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-6 py-4 flex-1",
        className
      )}
      {...props}
    />
  )
);

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3",
        className
      )}
      {...props}
    />
  )
);

// Modal hook for programmatic usage
export const useModal = (defaultOpen = false) => {
  const [open, setOpen] = React.useState(defaultOpen);

  const openModal = React.useCallback(() => setOpen(true), []);
  const closeModal = React.useCallback(() => setOpen(false), []);
  
  return {
    open,
    openModal,
    closeModal,
    setOpen,
  };
};

// Confirmation dialog hook
export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<{
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({});

  const confirm = React.useCallback((options: typeof config) => {
    setConfig(options);
    setIsOpen(true);
  }, []);

  const handleConfirm = React.useCallback(() => {
    config.onConfirm?.();
    setIsOpen(false);
  }, [config]);

  const handleCancel = React.useCallback(() => {
    config.onCancel?.();
    setIsOpen(false);
  }, [config]);

  const ConfirmModal = React.useCallback(() => (
    <Modal
      open={isOpen}
      onOpenChange={setIsOpen}
      variant="neon"
      size="sm"
    >
      <ModalHeader>
        <ModalTitle>{config.title || "Confirm Action"}</ModalTitle>
      </ModalHeader>
      
      <ModalContent>
        <p className="text-white/80">{config.message || "Are you sure you want to continue?"}</p>
      </ModalContent>
      
      <ModalFooter>
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-white/70 hover:text-white rounded-xl transition-colors"
        >
          {config.cancelText || "Cancel"}
        </button>
        <button
          onClick={handleConfirm}
          className={cn(
            "px-4 py-2 font-medium rounded-xl transition-all hover:scale-105 active:scale-95",
            config.variant === "destructive"
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
              : "bg-gradient-to-r from-[#A8FF00] to-[#85CC00] text-black"
          )}
        >
          {config.confirmText || "Confirm"}
        </button>
      </ModalFooter>
    </Modal>
  ), [isOpen, config, handleConfirm, handleCancel]);

  return {
    confirm,
    ConfirmModal,
  };
};

// Specialized modal variants
export const NeonModal = React.forwardRef<HTMLDivElement, Omit<ModalProps, "variant">>(
  (props, ref) => <Modal ref={ref} variant="neon" {...props} />
);

export const GlassModal = React.forwardRef<HTMLDivElement, Omit<ModalProps, "variant">>(
  (props, ref) => <Modal ref={ref} variant="glass" {...props} />
);

export const MinimalModal = React.forwardRef<HTMLDivElement, Omit<ModalProps, "variant">>(
  (props, ref) => <Modal ref={ref} variant="minimal" {...props} />
);

Modal.displayName = "Modal";
ModalHeader.displayName = "ModalHeader";
ModalTitle.displayName = "ModalTitle";
ModalDescription.displayName = "ModalDescription";
ModalContent.displayName = "ModalContent";
ModalFooter.displayName = "ModalFooter";
NeonModal.displayName = "NeonModal";
GlassModal.displayName = "GlassModal";
MinimalModal.displayName = "MinimalModal";

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
};