"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
  teacher: string;
  cover: string;
  progress: number;
  slug: string;
}

interface CourseCardProps {
  course: Course;
  delay?: number;
}

export default function CourseCard({ course, delay = 0 }: CourseCardProps) {
  const router = useRouter();

  const handleContinue = () => {
    router.push(`/courses/${course.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Course Cover */}
      <div className="h-32 bg-gradient-to-br from-primary-100 to-pastel-blue relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {course.title}
          </h3>
          <p className="text-sm text-gray-700">{course.teacher}</p>
        </div>
      </div>

      {/* Course Info */}
      <div className="p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">İlerleme</span>
            <span className="font-medium text-primary-600">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{ duration: 1, delay: delay + 0.3 }}
              className="bg-primary-500 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Play className="h-4 w-4" />
          Devam Et
        </button>
      </div>
    </motion.div>
  );
}
