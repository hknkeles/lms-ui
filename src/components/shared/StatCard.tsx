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
          border: "border-primary",
          text: "text-primary",
          bg: "bg-primary/10"
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
          border: "border-primary",
          text: "text-primary",
          bg: "bg-primary/10"
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border-l-4 ${colors.border} hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-medium text-gray-600 dark:text-gray-300 mb-2">{title}</p>
          <p className={`text-4xl font-bold ${colors.text}`}>{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`p-4 rounded-full ${colors.bg} ${colors.text} dark:opacity-90`}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
