"use client";

import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Card from "./Card";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
  role?: "admin" | "student" | "teacher";
  footer?: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = "",
  role = "student",
  footer
}: ModalProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "max-w-md";
      case "md":
        return "max-w-lg";
      case "lg":
        return "max-w-2xl";
      case "xl":
        return "max-w-4xl";
      case "full":
        return "max-w-7xl";
      default:
        return "max-w-lg";
    }
  };

  const getRoleStyles = () => {
    switch (role) {
      case "admin":
        return {
          primary: "bg-red-600 hover:bg-red-700 text-white",
          secondary: "bg-red-50 hover:bg-red-100 text-red-700 border-red-200",
          accent: "border-red-200",
          header: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        };
      case "teacher":
        return {
          primary: "bg-blue-600 hover:bg-blue-700 text-white",
          secondary: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
          accent: "border-blue-200",
          header: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
        };
      default:
        return {
          primary: "bg-primary hover:bg-primary/90 text-white",
          secondary: "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200",
          accent: "border-gray-200",
          header: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        };
    }
  };

  const roleStyles = getRoleStyles();

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full ${getSizeClasses()} ${className}`}
          >
            <Card className="overflow-hidden shadow-2xl">
              {/* Header */}
              {(title || showCloseButton) && (
                <div className={`px-6 py-4 border-b ${roleStyles.header}`}>
                  <div className="flex items-center justify-between">
                    {title && (
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {title}
                      </h2>
                    )}
                    {showCloseButton && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="p-1 h-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className={`px-6 py-4 border-t ${roleStyles.accent} bg-gray-50 dark:bg-gray-800`}>
                  {footer}
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Modal bileşenlerini kolaylaştırmak için yardımcı bileşenler
export function ModalHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function ModalBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}

export function ModalFooter({ 
  children, 
  className = "",
  role = "student"
}: { 
  children: ReactNode; 
  className?: string;
  role?: "admin" | "student" | "teacher";
}) {
  const getRoleStyles = () => {
    switch (role) {
      case "admin":
        return {
          primary: "bg-red-600 hover:bg-red-700 text-white",
          secondary: "bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
        };
      case "teacher":
        return {
          primary: "bg-blue-600 hover:bg-blue-700 text-white",
          secondary: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
        };
      default:
        return {
          primary: "bg-primary hover:bg-primary/90 text-white",
          secondary: "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
        };
    }
  };

  const roleStyles = getRoleStyles();

  return (
    <div className={`flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

