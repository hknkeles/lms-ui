"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Card from "./Card";

export interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (value: any, item: T) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  onRowClick?: (item: T) => void;
  className?: string;
  role?: "admin" | "student" | "teacher";
}

export default function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = "Veri bulunamadı",
  onSort,
  onRowClick,
  className = "",
  role = "student"
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    let newDirection: "asc" | "desc" = "asc";
    if (sortKey === key && sortDirection === "asc") {
      newDirection = "desc";
    }

    setSortKey(key);
    setSortDirection(newDirection);
    onSort?.(key, newDirection);
  };

  const getRoleStyles = () => {
    switch (role) {
      case "admin":
        return {
          header: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
          row: "hover:bg-red-50 dark:hover:bg-red-900/10",
          text: "text-red-900 dark:text-red-100"
        };
      case "teacher":
        return {
          header: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
          row: "hover:bg-blue-50 dark:hover:bg-blue-900/10",
          text: "text-blue-900 dark:text-blue-100"
        };
      default:
        return {
          header: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
          row: "hover:bg-gray-50 dark:hover:bg-gray-800",
          text: "text-gray-900 dark:text-gray-100"
        };
    }
  };

  const roleStyles = getRoleStyles();

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${roleStyles.header}`}>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-4 py-3 text-left text-sm font-medium ${roleStyles.text} ${
                    column.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className={`flex items-center gap-2 ${column.align === "center" ? "justify-center" : column.align === "right" ? "justify-end" : ""}`}>
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUpIcon 
                          className={`w-3 h-3 ${
                            sortKey === column.key && sortDirection === "asc" 
                              ? "text-primary" 
                              : "text-gray-400"
                          }`} 
                        />
                        <ChevronDownIcon 
                          className={`w-3 h-3 -mt-1 ${
                            sortKey === column.key && sortDirection === "desc" 
                              ? "text-primary" 
                              : "text-gray-400"
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`border-b border-gray-200 dark:border-gray-700 ${roleStyles.row} ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-4 py-3 text-sm ${roleStyles.text} ${
                        column.align === "center" ? "text-center" : 
                        column.align === "right" ? "text-right" : ""
                      }`}
                    >
                      {column.render 
                        ? column.render(item[column.key], item)
                        : item[column.key]
                      }
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

