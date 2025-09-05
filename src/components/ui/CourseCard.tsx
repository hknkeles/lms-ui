"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, BookOpen, Award, Star, Users, Calendar, Heart, Plus, X, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, memo } from "react";
import { createPortal } from "react-dom";

interface Course {
  id: string;
  title: string;
  teacher: string;
  progress: number;
  slug: string;
  category?: string;
  duration?: string;
  level?: string;
  status?: string;
  quizCount?: number;
  materialCount?: number;
  videoCount?: number;
  liveSessionCount?: number;
  nextLiveSession?: string;
  lastUpdated?: string;
  isFavorite?: boolean;
}

interface CourseCardProps {
  course: Course;
  delay?: number;
}

const CourseCard = memo(function CourseCard({ course, delay = 0 }: CourseCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(course.isFavorite || false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const favoriteButtonRef = useRef<HTMLButtonElement>(null);

  const handleContinue = () => {
    // Seçilen dersin slug'ı ile courses sayfasına yönlendir
    router.push(`/courses/${course.slug}`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleFavoriteMouseEnter = () => {
    if (favoriteButtonRef.current) {
      const rect = favoriteButtonRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setShowTooltip(true);
    }
  };

  const handleFavoriteMouseLeave = () => {
    setShowTooltip(false);
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay, ease: "easeOut" }}
        onClick={handleContinue}
        className="group relative bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
      >
        
        {/* Course Cover - Simplified */}
        <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          {/* Simple overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
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

          {/* Favorite Button - Simplified */}
          <motion.button
            ref={favoriteButtonRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.25 }}
            onClick={handleFavorite}
            onMouseEnter={handleFavoriteMouseEnter}
            onMouseLeave={handleFavoriteMouseLeave}
            className={`absolute top-3 left-3 z-20 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full transition-all duration-200 group/fav ${
              isFavorite 
                ? "text-red-500" 
                : "text-gray-400 hover:text-red-400"
            }`}
          >
            <Heart className="h-4 w-4" />
          </motion.button>
          
          {/* Level Badge - Simplified */}
          {course.level && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.3 }}
              className="absolute top-4 left-16"
            >
              <span className="px-2 py-1 text-xs font-medium rounded-md bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300">
                {course.level}
              </span>
            </motion.div>
          )}

          {/* Category Icon - Simplified */}
          {course.category && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.4 }}
              className="absolute bottom-4 left-4"
            >
              <div className="w-8 h-8 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center text-sm">
                {getCategoryIcon(course.category)}
              </div>
            </motion.div>
          )}
          
          {/* Course Title and Teacher - Simplified */}
          <div className="absolute bottom-4 right-4 left-16 text-gray-900 dark:text-white">
            <h3 className="text-lg font-semibold mb-1 truncate">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{course.teacher}</p>
          </div>
        </div>

        {/* Course Info */}
        <div className="p-5 relative z-10">
          {/* Category and Duration - Simplified */}
          <div className="flex items-center justify-between mb-4">
            {course.category && (
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-700/30 px-2 py-1 rounded-md">
                {course.category}
              </span>
            )}
            {course.duration && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {course.duration}
              </span>
            )}
          </div>

          {/* Progress Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">İlerleme</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{course.progress}%</span>
                {course.progress === 100 && (
                  <Award className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                )}
              </div>
            </div>
            
            {/* Simple Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 0.6, delay: delay + 0.2, ease: "easeOut" }}
                className="h-full bg-gray-600 dark:bg-gray-400 rounded-full"
              ></motion.div>
            </div>
          </div>

          {/* Course Resources Stats - Simplified */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                {course.videoCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    {course.videoCount} video
                  </span>
                )}
                {course.quizCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    {course.quizCount} quiz
                  </span>
                )}
              </div>
              {course.liveSessionCount !== undefined && course.liveSessionCount > 0 && (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  {course.liveSessionCount} canlı
                </span>
              )}
            </div>
          </div>

          {/* Next Live Session Info - Simplified */}
          {course.nextLiveSession && (
            <div className="mb-3 p-2 bg-green-50/50 dark:bg-green-900/20 rounded-lg border border-green-200/30 dark:border-green-700/30">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-green-600 dark:text-green-400" />
                <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                  Sonraki: {course.nextLiveSession}
                </span>
              </div>
            </div>
          )}

          {/* Continue Button - Simplified */}
          <motion.div
            className="w-full bg-gray-900 dark:bg-gray-700 text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium pointer-events-none"
          >
            <Play className="h-4 w-4" />
            {course.progress === 100 ? "Tekrar İzle" : "Devam Et"}
          </motion.div>
        </div>
      </motion.div>

      {/* Tooltip Portal */}
      {showTooltip && typeof window !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translateX(-50%)',
            zIndex: 9999,
            pointerEvents: 'none'
          }}
          className="px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-xl transition-all duration-200 whitespace-nowrap"
        >
          {isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
        </div>,
        document.body
      )}
    </>
  );
});

export default CourseCard;

