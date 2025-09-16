"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Card from "./Card";

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "select" | "textarea" | "date" | "checkbox";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
  disabled?: boolean;
}

export interface FormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  initialData?: Record<string, any>;
  className?: string;
  role?: "admin" | "student" | "teacher";
  showValidation?: boolean;
}

export default function Form({
  fields,
  onSubmit,
  onCancel,
  submitText = "Kaydet",
  cancelText = "İptal",
  loading = false,
  initialData = {},
  className = "",
  role = "student",
  showValidation = true
}: FormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const getRoleStyles = () => {
    switch (role) {
      case "admin":
        return {
          primary: "bg-red-600 hover:bg-red-700 text-white",
          secondary: "bg-red-50 hover:bg-red-100 text-red-700 border-red-200",
          accent: "border-red-200 focus:border-red-500 focus:ring-red-500",
          error: "border-red-500 focus:border-red-500 focus:ring-red-500",
          success: "border-green-500 focus:border-green-500 focus:ring-green-500"
        };
      case "teacher":
        return {
          primary: "bg-blue-600 hover:bg-blue-700 text-white",
          secondary: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
          accent: "border-blue-200 focus:border-blue-500 focus:ring-blue-500",
          error: "border-red-500 focus:border-red-500 focus:ring-red-500",
          success: "border-green-500 focus:border-green-500 focus:ring-green-500"
        };
      default:
        return {
          primary: "bg-primary-600 hover:bg-primary-700 text-white",
          secondary: "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200",
          accent: "border-gray-200 focus:border-primary-500 focus:ring-primary-500",
          error: "border-red-500 focus:border-red-500 focus:ring-red-500",
          success: "border-green-500 focus:border-green-500 focus:ring-green-500"
        };
    }
  };

  const roleStyles = getRoleStyles();

  const validateField = (field: FormField, value: any): string => {
    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label} alanı zorunludur`;
    }

    if (value && field.validation) {
      if (field.validation.min && value.length < field.validation.min) {
        return `${field.label} en az ${field.validation.min} karakter olmalıdır`;
      }

      if (field.validation.max && value.length > field.validation.max) {
        return `${field.label} en fazla ${field.validation.max} karakter olmalıdır`;
      }

      if (field.validation.pattern && !field.validation.pattern.test(value)) {
        return field.validation.message || `${field.label} formatı hatalı`;
      }
    }

    return "";
  };

  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name] && showValidation) {
      const field = fields.find(f => f.name === name);
      if (field) {
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  const handleFieldBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (showValidation) {
      const field = fields.find(f => f.name === name);
      if (field) {
        const error = validateField(field, formData[name]);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(fields.reduce((acc, field) => ({ ...acc, [field.name]: true }), {}));
    
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showValidation && !validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || "";
    const error = errors[field.name];
    const isTouched = touched[field.name];
    const hasError = error && isTouched;
    const hasSuccess = !error && isTouched && value;

    const getInputStyles = () => {
      if (hasError) return roleStyles.error;
      if (hasSuccess) return roleStyles.success;
      return roleStyles.accent;
    };

    const fieldId = `field-${field.name}`;

    return (
      <motion.div
        key={field.name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <label 
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative">
          {field.type === "select" ? (
            <Select 
              value={value} 
              onValueChange={(val) => handleFieldChange(field.name, val)}
              disabled={field.disabled}
            >
              <SelectTrigger 
                id={fieldId}
                className={`${getInputStyles()} ${field.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <SelectValue placeholder={field.placeholder || "Seçiniz..."} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : field.type === "textarea" ? (
            <Textarea
              id={fieldId}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              disabled={field.disabled}
              className={`${getInputStyles()} ${field.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              rows={4}
            />
          ) : field.type === "checkbox" ? (
            <div className="flex items-center space-x-2">
              <input
                id={fieldId}
                type="checkbox"
                checked={!!value}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                onBlur={() => handleFieldBlur(field.name)}
                disabled={field.disabled}
                className={`rounded ${field.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              <label htmlFor={fieldId} className="text-sm text-gray-600 dark:text-gray-400">
                {field.placeholder}
              </label>
            </div>
          ) : (
            <Input
              id={fieldId}
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              disabled={field.disabled}
              className={`${getInputStyles()} ${field.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          )}

          {/* Validation Icons */}
          {showValidation && isTouched && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {hasError ? (
                <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
              ) : hasSuccess ? (
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              ) : null}
            </div>
          )}
        </div>

        {/* Error Message */}
        {showValidation && hasError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
          >
            <ExclamationCircleIcon className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  };

  return (
    <Card className={`p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(renderField)}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className={roleStyles.secondary}
            >
              {cancelText}
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
            className={roleStyles.primary}
          >
            {loading ? "Kaydediliyor..." : submitText}
          </Button>
        </div>
      </form>
    </Card>
  );
}

