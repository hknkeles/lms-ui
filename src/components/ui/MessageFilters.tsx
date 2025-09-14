"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  X, 
  Mail, 
  MailOpen, 
  Star, 
  Archive,
  Tag,
  Calendar,
  User
} from "lucide-react";

interface MessageFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
  unreadCount: number;
  totalCount: number;
}

interface FilterState {
  status: "all" | "unread" | "read";
  priority: "all" | "high" | "medium" | "low";
  category: "all" | "academic" | "grades" | "schedule" | "career";
  dateRange: "all" | "today" | "week" | "month";
}

export default function MessageFilters({ 
  onSearch, 
  onFilterChange, 
  unreadCount, 
  totalCount 
}: MessageFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    priority: "all",
    category: "all",
    dateRange: "all"
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: "all",
      priority: "all",
      category: "all",
      dateRange: "all"
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "all");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Mesajlarda ara..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showFilters || hasActiveFilters
              ? "bg-primary-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <Filter className="h-4 w-4" />
          Filtreler
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-white rounded-full"></span>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>{totalCount} toplam mesaj</span>
        </div>
        <div className="flex items-center gap-2">
          <MailOpen className="h-4 w-4" />
          <span>{unreadCount} okunmamış</span>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Durum
            </label>
            <div className="flex gap-2">
              {[
                { value: "all", label: "Tümü", icon: Mail },
                { value: "unread", label: "Okunmamış", icon: MailOpen },
                { value: "read", label: "Okunmuş", icon: Archive }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleFilterChange("status", value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.status === value
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Öncelik
            </label>
            <div className="flex gap-2">
              {[
                { value: "all", label: "Tümü", color: "gray" },
                { value: "high", label: "Yüksek", color: "red" },
                { value: "medium", label: "Orta", color: "yellow" },
                { value: "low", label: "Düşük", color: "green" }
              ].map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => handleFilterChange("priority", value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.priority === value
                      ? `bg-${color}-500 text-white`
                      : `bg-${color}-100 dark:bg-${color}-900/20 text-${color}-700 dark:text-${color}-400 hover:bg-${color}-200 dark:hover:bg-${color}-900/30`
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kategori
            </label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "all", label: "Tümü" },
                { value: "academic", label: "Akademik", color: "blue" },
                { value: "grades", label: "Notlar", color: "purple" },
                { value: "schedule", label: "Program", color: "orange" },
                { value: "career", label: "Kariyer", color: "green" }
              ].map(({ value, label, color = "gray" }) => (
                <button
                  key={value}
                  onClick={() => handleFilterChange("category", value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.category === value
                      ? `bg-${color}-500 text-white`
                      : `bg-${color}-100 dark:bg-${color}-900/20 text-${color}-700 dark:text-${color}-400 hover:bg-${color}-200 dark:hover:bg-${color}-900/30`
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tarih Aralığı
            </label>
            <div className="flex gap-2">
              {[
                { value: "all", label: "Tümü" },
                { value: "today", label: "Bugün" },
                { value: "week", label: "Bu Hafta" },
                { value: "month", label: "Bu Ay" }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleFilterChange("dateRange", value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.dateRange === value
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="pt-2">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-4 w-4" />
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
