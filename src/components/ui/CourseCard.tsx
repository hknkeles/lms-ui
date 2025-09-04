"use client";

import { motion } from "framer-motion";
import { Play, Clock, BookOpen, Award, Star, Users, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  teacher: string;
  cover: string;
  progress: number;
  slug: string;
  category?: string;
  duration?: string;
  level?: string;
  status?: string;
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "tamamlanan":
        return "bg-emerald-400/20 text-emerald-700 dark:text-emerald-300 border-emerald-300/30 dark:border-emerald-400/30";
      case "gelecek":
        return "bg-blue-400/20 text-blue-700 dark:text-blue-300 border-blue-300/30 dark:border-blue-400/30";
      default:
        return "bg-orange-400/20 text-orange-700 dark:text-orange-300 border-orange-300/30 dark:border-orange-400/30";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "tamamlanan":
        return "Tamamlandı";
      case "gelecek":
        return "Gelecek";
      default:
        return "Aktif";
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case "Başlangıç":
        return "bg-blue-400/20 text-blue-700 dark:text-blue-300 border-blue-300/30 dark:border-blue-400/30";
      case "Orta":
        return "bg-yellow-400/20 text-yellow-700 dark:text-yellow-300 border-yellow-300/30 dark:border-yellow-400/30";
      case "İleri":
        return "bg-red-400/20 text-red-700 dark:text-red-300 border-red-300/30 dark:border-red-400/30";
      default:
        return "bg-gray-400/20 text-gray-700 dark:text-gray-300 border-gray-300/30 dark:border-gray-400/30";
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "Bilgisayar":
        return "💻";
      case "Matematik":
        return "📐";
      case "Dil":
        return "🌍";
      default:
        return "📚";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ 
        y: -2, 
        scale: 1.01,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className="group relative bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 overflow-hidden hover:bg-white/15 dark:hover:bg-gray-800/30 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-lg dark:shadow-gray-900/20"
    >
      {/* Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 dark:from-gray-700/5 dark:to-gray-700/10 rounded-3xl"></div>
      
      {/* Course Cover with Image */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={course.cover}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
        
        {/* Status Badge */}
        {course.status && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2 }}
            className="absolute top-4 right-4"
          >
            <span className={`px-3 py-1.5 text-xs font-medium rounded-full border backdrop-blur-sm ${getStatusColor(course.status)}`}>
              {getStatusText(course.status)}
            </span>
          </motion.div>
        )}
        
        {/* Level Badge */}
        {course.level && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.3 }}
            className="absolute top-4 left-4"
          >
            <span className={`px-3 py-1.5 text-xs font-medium rounded-full border backdrop-blur-sm ${getLevelColor(course.level)}`}>
              {course.level}
            </span>
          </motion.div>
        )}

        {/* Category Icon */}
        {course.category && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.4 }}
            className="absolute bottom-4 left-4"
          >
            <div className="w-10 h-10 bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-full flex items-center justify-center text-lg border border-white/30 dark:border-gray-600/40">
              {getCategoryIcon(course.category)}
            </div>
          </motion.div>
        )}
        
        {/* Course Title and Teacher */}
        <div className="absolute bottom-4 right-4 left-16 text-white">
          <h3 className="text-lg font-semibold mb-1 truncate group-hover:text-primary-200 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-200 opacity-90">{course.teacher}</p>
        </div>
      </div>

      {/* Course Info */}
      <div className="p-6 relative z-10">
        {/* Category and Duration */}
        <div className="flex items-center justify-between mb-5">
          {course.category && (
            <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20 dark:border-gray-600/30">
              <BookOpen className="h-4 w-4 text-primary-400 dark:text-primary-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{course.category}</span>
            </div>
          )}
          {course.duration && (
            <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20 dark:border-gray-600/30">
              <Clock className="h-4 w-4 text-primary-400 dark:text-primary-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{course.duration}</span>
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">İlerleme</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{course.progress}%</span>
              {course.progress === 100 && (
                <Award className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
              )}
            </div>
          </div>
          
          {/* Modern Progress Bar */}
          <div className="relative">
            {/* Background Track */}
            <div className="w-full bg-gradient-to-r from-gray-100/80 to-gray-200/80 dark:from-gray-700/60 dark:to-gray-800/60 backdrop-blur-sm rounded-2xl h-3 overflow-hidden border border-white/30 dark:border-gray-600/40 shadow-inner">
              {/* Progress Fill */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 1.2, delay: delay + 0.5, ease: "easeOut" }}
                className="h-full rounded-2xl relative"
              >
                {/* Dynamic Gradient based on progress */}
                <div className={`absolute inset-0 rounded-2xl ${
                  course.progress < 30 
                    ? 'bg-gradient-to-r from-red-400 via-red-500 to-red-600 dark:from-red-500 dark:via-red-600 dark:to-red-700'
                    : course.progress < 70
                    ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 dark:from-yellow-500 dark:via-yellow-600 dark:to-yellow-700'
                    : course.progress < 100
                    ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 dark:from-blue-500 dark:via-blue-600 dark:to-blue-700'
                    : 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 dark:from-green-500 dark:via-green-600 dark:to-green-700'
                }`}></div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl animate-pulse"></div>
                
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-2xl blur-sm ${
                  course.progress < 30 
                    ? 'bg-red-400/30 dark:bg-red-500/30'
                    : course.progress < 70
                    ? 'bg-yellow-400/30 dark:bg-yellow-500/30'
                    : course.progress < 100
                    ? 'bg-blue-400/30 dark:bg-blue-500/30'
                    : 'bg-green-400/30 dark:bg-green-500/30'
                }`}></div>
                
                {/* Progress Dots */}
                {course.progress > 0 && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-white/80 rounded-full shadow-sm"></div>
                )}
              </motion.div>
            </div>
            
            {/* Progress Indicator */}
            <div className={`absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-2 shadow-lg flex items-center justify-center ${
              course.progress < 30 
                ? 'border-red-500 dark:border-red-400'
                : course.progress < 70
                ? 'border-yellow-500 dark:border-yellow-400'
                : course.progress < 100
                ? 'border-blue-500 dark:border-blue-400'
                : 'border-green-500 dark:border-green-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                course.progress < 30 
                  ? 'bg-red-500 dark:bg-red-400'
                  : course.progress < 70
                  ? 'bg-yellow-500 dark:bg-yellow-400'
                  : course.progress < 100
                  ? 'bg-blue-500 dark:bg-blue-400'
                  : 'bg-green-500 dark:bg-green-400'
              }`}></div>
            </div>
          </div>
        </div>

        {/* Minimal Stats */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>1.2k</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 dark:text-yellow-400 fill-current" />
            <span>4.8</span>
          </div>
        </div>

        {/* Continue Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-primary-500/90 to-primary-600/90 backdrop-blur-sm text-white py-3 px-4 rounded-2xl hover:from-primary-500 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-white/50 dark:focus:ring-offset-gray-800 transition-all duration-300 flex items-center justify-center gap-3 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-white/20 dark:border-gray-600/30"
        >
          <Play className="h-4 w-4" />
          {course.progress === 100 ? "Tekrar İzle" : "Devam Et"}
        </motion.button>
      </div>

      {/* Subtle Decorative Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-100/10 dark:from-primary-400/5 to-transparent rounded-full -translate-y-12 translate-x-12 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-100/10 dark:from-blue-400/5 to-transparent rounded-full translate-y-10 -translate-x-10 pointer-events-none"></div>
    </motion.div>
  );
}

