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
    // İlk dersi otomatik olarak aç
    router.push(`/courses/${course.slug}/lesson`);
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
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        whileHover={{ 
          y: -2, 
          scale: 1.01,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        onClick={handleContinue}
        className="group relative bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 overflow-hidden hover:bg-white/15 dark:hover:bg-gray-800/30 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-lg dark:shadow-gray-900/20"
      >
        {/* Glass Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 dark:from-gray-700/5 dark:to-gray-700/10 rounded-3xl"></div>
        
        {/* Course Cover with Color Gradient */}
        <div className="relative h-36">
          {/* Dynamic Color Gradient based on category */}
          <div className={`absolute inset-0 ${
            course.category === "Bilgisayar" 
              ? "bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700"
              : course.category === "Matematik"
              ? "bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700"
              : course.category === "Dil"
              ? "bg-gradient-to-br from-orange-500 via-red-600 to-pink-700"
              : "bg-gradient-to-br from-gray-500 via-slate-600 to-zinc-700"
          }`}></div>
          
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3)_0%,transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.2)_0%,transparent_50%)]"></div>
          </div>
          
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

          {/* Favorite Button */}
          <motion.button
            ref={favoriteButtonRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.25 }}
            onClick={handleFavorite}
            onMouseEnter={handleFavoriteMouseEnter}
            onMouseLeave={handleFavoriteMouseLeave}
            className={`absolute top-3 left-3 z-20 p-2.5 backdrop-blur-md rounded-full border transition-all duration-200 group/fav relative ${
              isFavorite 
                ? "bg-red-500/90 dark:bg-red-600/90 border-red-600 dark:border-red-500 shadow-lg shadow-red-500/25" 
                : "bg-white/20 dark:bg-gray-800/40 border-white/30 dark:border-gray-600/40 hover:bg-white/30 dark:hover:bg-gray-700/50 hover:scale-110"
            }`}
          >
            {/* Modern Kalp İkonu */}
            <div className={`relative w-5 h-5 transition-all duration-200 ${
              isFavorite 
                ? "text-white" 
                : "text-white/90 dark:text-gray-200 group-hover/fav:text-red-400 dark:group-hover/fav:text-red-300"
            }`}>
              {/* Kalp Ana Şekli */}
              <svg 
                viewBox="0 0 24 24" 
                fill={isFavorite ? "currentColor" : "none"} 
                stroke="currentColor" 
                strokeWidth="2" 
                className="w-full h-full transition-all duration-200"
              >
                <path 
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  className="transition-all duration-200"
                />
              </svg>
              
              {/* Favori değilken hover efekti */}
              {!isFavorite && (
                <div className="absolute inset-0 bg-red-500/20 rounded-full scale-0 group-hover/fav:scale-100 transition-all duration-200"></div>
              )}
            </div>
          </motion.button>
          
          {/* Level Badge */}
          {course.level && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.3 }}
              className="absolute top-4 left-16"
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
            <h3 className="text-xl font-bold mb-2 truncate group-hover:text-primary-200 transition-colors drop-shadow-lg">
              {course.title}
            </h3>
            <p className="text-sm text-gray-100 opacity-95 font-medium">{course.teacher}</p>
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

          {/* Continue Button */}
          <motion.div
            className="w-full bg-gradient-to-r from-primary-500/90 to-primary-600/90 backdrop-blur-sm text-white py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 font-medium shadow-lg border border-white/20 dark:border-gray-600/30 pointer-events-none"
          >
            <Play className="h-4 w-4" />
            {course.progress === 100 ? "Tekrar İzle" : "Devam Et"}
          </motion.div>
        </div>

        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-100/10 dark:from-primary-400/5 to-transparent rounded-full -translate-y-12 translate-x-12 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-100/10 dark:from-blue-400/5 to-transparent rounded-full translate-y-10 -translate-x-10 pointer-events-none"></div>
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

