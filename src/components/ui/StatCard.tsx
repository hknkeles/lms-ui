import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: "primary" | "green" | "blue" | "purple";
  delay?: number;
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = "primary",
  delay = 0 
}: StatCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return {
          border: "border-primary-500",
          text: "text-primary-600",
          bg: "bg-primary-100"
        };
      case "green":
        return {
          border: "border-green-500",
          text: "text-green-600",
          bg: "bg-green-100"
        };
      case "blue":
        return {
          border: "border-blue-500",
          text: "text-blue-600",
          bg: "bg-blue-100"
        };
      case "purple":
        return {
          border: "border-purple-500",
          text: "text-purple-600",
          bg: "bg-purple-100"
        };
      default:
        return {
          border: "border-primary-500",
          text: "text-primary-600",
          bg: "bg-primary-100"
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${colors.border} hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-full ${colors.bg} ${colors.text}`}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
