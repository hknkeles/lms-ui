"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Card from "./Card";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: "search" | "select" | "date" | "dateRange";
  options?: FilterOption[];
  placeholder?: string;
}

export interface FilterProps {
  fields: FilterField[];
  onFilter: (filters: Record<string, any>) => void;
  onClear?: () => void;
  loading?: boolean;
  className?: string;
  role?: "admin" | "student" | "teacher";
  showAdvanced?: boolean;
}

export default function Filter({
  fields,
  onFilter,
  onClear,
  loading = false,
  className = "",
  role = "student",
  showAdvanced = false
}: FilterProps) {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(showAdvanced);

  const getRoleStyles = () => {
    switch (role) {
      case "admin":
        return {
          primary: "bg-red-600 hover:bg-red-700 text-white",
          secondary: "bg-red-50 hover:bg-red-100 text-red-700 border-red-200",
          accent: "border-red-200 focus:border-red-500"
        };
      case "teacher":
        return {
          primary: "bg-blue-600 hover:bg-blue-700 text-white",
          secondary: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
          accent: "border-blue-200 focus:border-blue-500"
        };
      default:
        return {
          primary: "bg-primary hover:bg-primary/90 text-white",
          secondary: "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200",
          accent: "border-gray-200 focus:border-primary"
        };
    }
  };

  const roleStyles = getRoleStyles();

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onClear?.();
    onFilter({});
  };

  const renderField = (field: FilterField) => {
    const value = filters[field.key] || "";

    switch (field.type) {
      case "search":
        return (
          <div key={field.key} className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label}
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={field.placeholder || `Ara...`}
                value={value}
                onChange={(e) => handleFilterChange(field.key, e.target.value)}
                className={`pl-10 ${roleStyles.accent}`}
              />
            </div>
          </div>
        );

      case "select":
        return (
          <div key={field.key} className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label}
            </label>
            <Select value={value} onValueChange={(val) => handleFilterChange(field.key, val)}>
              <SelectTrigger className={roleStyles.accent}>
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
          </div>
        );

      case "date":
        return (
          <div key={field.key} className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label}
            </label>
            <Input
              type="date"
              value={value}
              onChange={(e) => handleFilterChange(field.key, e.target.value)}
              className={roleStyles.accent}
            />
          </div>
        );

      case "dateRange":
        return (
          <div key={field.key} className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label}
            </label>
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="Başlangıç"
                value={value?.start || ""}
                onChange={(e) => handleFilterChange(field.key, { 
                  ...value, 
                  start: e.target.value 
                })}
                className={roleStyles.accent}
              />
              <Input
                type="date"
                placeholder="Bitiş"
                value={value?.end || ""}
                onChange={(e) => handleFilterChange(field.key, { 
                  ...value, 
                  end: e.target.value 
                })}
                className={roleStyles.accent}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {/* Ana arama ve filtre toggle */}
        <div className="flex items-center gap-4">
          {fields.find(f => f.type === "search") && (
            <div className="flex-1">
              {renderField(fields.find(f => f.type === "search")!)}
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={roleStyles.secondary}
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filtreler
          </Button>

          <Button
            size="sm"
            onClick={handleApplyFilters}
            disabled={loading}
            className={roleStyles.primary}
          >
            {loading ? "Yükleniyor..." : "Uygula"}
          </Button>

          {Object.keys(filters).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Temizle
            </Button>
          )}
        </div>

        {/* Gelişmiş filtreler */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 dark:border-gray-700 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fields
                .filter(field => field.type !== "search")
                .map(renderField)
              }
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}

