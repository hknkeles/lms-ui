"use client";

import { motion } from "framer-motion";
import { Play, Clock, BookOpen, Award, Star, Users, Calendar, User, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

interface CourseListItemProps {
  course: Course;
  delay?: number;
}

export default function CourseListItem({ course, delay = 0 }: CourseListItemProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(course.isFavorite || false);

  const handleContinue = () => {
    router.push(`/courses/${course.slug}`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
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
      initial={{ opacity: 0, x: -20, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ 
        x: 4,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      onClick={handleContinue}
      className="group relative bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 p-4 hover:bg-white/15 dark:hover:bg-gray-800/30 transition-all duration-500 cursor-pointer shadow-xl hover:shadow-2xl dark:shadow-gray-900/20 overflow-hidden"
    >
      {/* Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 dark:from-gray-700/5 dark:to-gray-700/10 rounded-3xl"></div>
      
      {/* Subtle Decorative Elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/10 dark:from-primary/20 to-transparent rounded-full -translate-y-24 translate-x-24 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-50/20 dark:from-blue-400/10 to-transparent rounded-full translate-y-16 -translate-x-16 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-4">
                 {/* Course Cover with Color Gradient */}
         <div className="lg:w-48 h-28 rounded-2xl relative flex-shrink-0 group-hover:shadow-lg transition-all duration-300">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent"></div>
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
            className="absolute top-2 right-2"
          >
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full border backdrop-blur-sm ${getStatusColor(course.status)}`}>
              {getStatusText(course.status)}
            </span>
          </motion.div>
        )}

        {/* Favorite Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.25 }}
          onClick={handleFavorite}
          className="absolute top-2 left-2 z-20 p-1.5 bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-full border border-white/30 dark:border-gray-600/40 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-200 group/fav relative"
        >
          <Heart 
            className={`h-3.5 w-3.5 transition-all duration-200 ${
              isFavorite 
                ? "text-red-500 dark:text-red-400 fill-current" 
                : "text-white/80 dark:text-gray-300 group-hover/fav:text-red-400 dark:group-hover/fav:text-red-300"
            }`}
          />
          
          {/* Modern Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover/fav:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
            {isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
          </div>
        </motion.button>
          
                  {/* Level Badge */}
        {course.level && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.3 }}
            className="absolute top-2 left-12"
          >
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full border backdrop-blur-sm ${getLevelColor(course.level)}`}>
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
              className="absolute bottom-2 left-2"
            >
              <div className="w-8 h-8 bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-full flex items-center justify-center text-sm border border-white/30 dark:border-gray-600/40">
                {getCategoryIcon(course.category)}
              </div>
            </motion.div>
          )}
        </div>

        {/* Course Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-primary transition-colors truncate">
                {course.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300 mb-4">
                <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 dark:border-gray-600/30">
                  <User className="h-4 w-4 text-primary/70" />
                  <span className="font-medium">{course.teacher}</span>
                </div>
                
                {course.category && (
                  <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 dark:border-gray-600/30">
                    <BookOpen className="h-4 w-4 text-primary/70" />
                    <span className="font-medium">{course.category}</span>
                  </div>
                )}
                
                {course.duration && (
                  <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 dark:border-gray-600/30">
                    <Clock className="h-4 w-4 text-primary/70" />
                    <span className="font-medium">{course.duration}</span>
                  </div>
                )}
              </div>

              {/* Progress Section */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">İlerleme</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{course.progress}%</span>
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

              {/* Course Resources Stats */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {/* Quiz Count */}
                  {course.quizCount !== undefined && (
                    <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-white/20 dark:border-gray-600/30">
                      <div className="w-6 h-6 bg-purple-400/20 dark:bg-purple-500/20 rounded-md flex items-center justify-center">
                        <span className="text-purple-600 dark:text-purple-400 text-xs font-bold">?</span>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-300">{course.quizCount} Quiz</span>
                    </div>
                  )}

                  {/* Material Count */}
                  {course.materialCount !== undefined && (
                    <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-white/20 dark:border-gray-600/30">
                      <div className="w-6 h-6 bg-blue-400/20 dark:bg-blue-500/20 rounded-md flex items-center justify-center">
                        <BookOpen className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-300">{course.materialCount} Materyal</span>
                    </div>
                  )}

                  {/* Video Count */}
                  {course.videoCount !== undefined && (
                    <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-white/20 dark:border-gray-600/30">
                      <div className="w-6 h-6 bg-red-400/20 dark:bg-red-500/20 rounded-md flex items-center justify-center">
                        <Play className="h-3 w-3 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-300">{course.videoCount} Video</span>
                    </div>
                  )}

                  {/* Live Session Count */}
                  {course.liveSessionCount !== undefined && (
                    <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-white/20 dark:border-gray-600/30">
                      <div className="w-6 h-6 bg-green-400/20 dark:bg-green-500/20 rounded-md flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-300">{course.liveSessionCount} Canlı</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Live Session Info */}
              {course.nextLiveSession && (
                <div className="mb-4 p-2 bg-gradient-to-r from-green-400/10 to-blue-400/10 dark:from-green-500/10 dark:to-blue-500/10 backdrop-blur-sm rounded-lg border border-green-300/20 dark:border-green-500/20">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">Sonraki Canlı Ders</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{course.nextLiveSession}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Last Updated Info */}
              {course.lastUpdated && (
                <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                  Son güncelleme: {course.lastUpdated}
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
              <motion.div
                className="bg-gradient-to-r from-primary/90 to-primary/80 backdrop-blur-sm text-white py-3 px-6 rounded-2xl transition-all duration-200 flex items-center gap-3 font-medium shadow-lg whitespace-nowrap border border-white/20 dark:border-gray-600/30 pointer-events-none"
              >
                <Play className="h-4 w-4" />
                {course.progress === 100 ? "Tekrar İzle" : "Devam Et"}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
