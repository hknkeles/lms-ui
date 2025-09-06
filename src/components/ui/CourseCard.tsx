"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Bookmark, Play, MoreVertical, Star, Download, Share, Archive, Trash2, User, HelpCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
  endDate?: string;
}

interface CourseCardProps {
  course: Course;
  delay?: number;
  onToggleFavorite?: (courseId: string) => void;
}

const CourseCard = function CourseCard({ course, delay = 0, onToggleFavorite }: CourseCardProps) {
  const router = useRouter();
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleContinue = () => {
    router.push(`/courses/${course.slug}`);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenuPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setContextMenuOpen(true);
  };

  const handleContextMenuAction = (action: string) => {
    setContextMenuOpen(false);
    
    switch (action) {
      case 'favorite':
        // Favorilere ekle/çıkar
        if (onToggleFavorite) {
          onToggleFavorite(course.id);
        }
        break;
      case 'course-page':
        // Ders sayfasına git
        router.push(`/courses/${course.slug}`);
        break;
      case 'quiz':
        // Soru çöz
        console.log('Start quiz:', course.id);
        break;
      case 'instructor':
        // Eğitmen bilgisi
        console.log('Show instructor info:', course.teacher);
        break;
    }
  };

  // Context menüyü dışarı tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenuOpen(false);
      }
    };

    if (contextMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenuOpen]);

  const getStatusText = (status?: string) => {
    switch (status) {
      case "tamamlanan":
        return "Tamamlandı";
      case "gelecek":
        return "Gelecek";
      default:
        return "Devam Ediyor";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "tamamlanan":
        return "bg-emerald-500";
      case "gelecek":
        return "bg-blue-500";
      default:
        return "bg-orange-500";
    }
  };

  const getLevelText = (level?: string) => {
    switch (level) {
      case "Başlangıç":
        return "Başlangıç";
      case "Orta":
        return "Orta";
      case "İleri":
        return "İleri";
      default:
        return "Başlangıç";
    }
  };

  const getGradientColors = (category?: string) => {
    switch (category) {
      case "Fen Bilimleri":
        return "from-blue-600 via-blue-700 to-purple-800";
      case "Sosyal Bilimler":
        return "from-teal-600 via-teal-700 to-blue-800";
      case "Dil":
        return "from-green-600 via-green-700 to-teal-800";
      default:
        return "from-gray-600 via-gray-700 to-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 flex flex-col h-full"
      onClick={handleContinue}
      onContextMenu={handleContextMenu}
    >
      {/* Course Cover - Minimal İllüstrasyon */}
      <div className={`relative h-36 bg-gradient-to-br ${getGradientColors(course.category)} dark:from-gray-800 dark:via-gray-900 dark:to-gray-900`}>
        {/* Minimal overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        
        {/* Bookmark Icon */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onToggleFavorite) {
                onToggleFavorite(course.id);
              }
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseUp={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="p-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-200"
          >
            <Bookmark 
              className={`h-5 w-5 transition-colors ${
                course.isFavorite 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-white/90 hover:text-white'
              }`} 
            />
          </button>
        </div>

        {/* Başlangıç Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
            {getLevelText(course.level)}
          </span>
        </div>
        
        {/* Minimal İllüstrasyon - Merkezi konumlandırma */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Basit kafa profili */}
          <div className="w-20 h-20 bg-white/20 rounded-full relative flex items-center justify-center shadow-lg">
            {/* Basit dişli */}
            <div className="w-8 h-8 bg-white/40 rounded transform rotate-45"></div>
            {/* Işık */}
            <div className="absolute -top-3 -left-3 w-1.5 h-8 bg-yellow-300 transform rotate-12"></div>
          </div>
          
          {/* Basit tırmanan kişi */}
          <div className="absolute top-8 left-8 w-10 h-10 bg-white/20 rounded-full relative shadow-lg">
            <div className="absolute -right-1 top-2 w-2.5 h-2.5 bg-white/40 rounded-sm"></div>
            <div className="absolute -bottom-1 -right-1 w-1.5 h-4 bg-white/40 transform rotate-12"></div>
          </div>
        </div>
      </div>

      {/* Devam Ediyor Badge and Course Stats */}
      <div className="pl-0 pr-6 pb-4 pt-0">
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1.5 ${getStatusColor(course.status)} text-white text-xs font-medium rounded-br`}>
            {getStatusText(course.status)}
          </span>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{course.videoCount || 0} video</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>{course.quizCount || 0} quiz</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{course.liveSessionCount || 0} canlı</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Info */}
      <div className="px-6 pb-6 pt-0 flex flex-col flex-grow">
        {/* Course Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 leading-tight">
          {course.title}
        </h3>

        {/* Next Live Session */}
        {course.nextLiveSession && (
          <div className="mb-4 p-3 bg-green-50/50 dark:bg-green-900/20 rounded-lg border border-green-200/30 dark:border-green-700/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                Sonraki canlı ders: {course.nextLiveSession}
              </span>
            </div>
          </div>
        )}

        {/* Spacer to push instructor section to bottom */}
        <div className="flex-grow"></div>

        {/* Instructor and Progress Circle */}
        <div className="grid grid-cols-12 gap-4 items-center mb-4">
          {/* Eğitmen - İlk sütun */}
          <div className="col-span-6 flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {course.teacher.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Eğitmen</p>
              <span className="text-purple-600 dark:text-purple-400 text-sm font-medium truncate block">
                {course.teacher}
              </span>
            </div>
          </div>

          {/* Separator - Orta sütun */}
          <div className="col-span-2 flex justify-center">
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* İlerleme - Son sütun */}
          <div className="col-span-4 flex flex-col items-center">
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                {/* Arka plan daire */}
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                {/* İlerleme dairesi */}
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeDasharray={`${course.progress}, ${100 - course.progress}`}
                  strokeLinecap="round"
                />
              </svg>
              {/* Yüzde sayısı */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{course.progress}%</span>
              </div>
            </div>
            {/* İlerleme yazısı */}
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">İlerleme</span>
          </div>
        </div>

        {/* Course Duration and End Date */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{course.duration || '12 hafta'}</span>
            <span>Bitiş: {course.endDate || '06.07.2033'}</span>
          </div>
        </div>

        {/* Continue Button */}
        <motion.div
          className="w-full bg-gray-900 dark:bg-gray-700 text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium hover:bg-gray-800 dark:hover:bg-gray-600 mt-auto"
        >
          <Play className="h-4 w-4" />
          {course.progress === 100 ? "Tekrar İzle" : "Devam Et"}
        </motion.div>
      </div>

      {/* Context Menu */}
      {contextMenuOpen && (
        <div
          ref={contextMenuRef}
          className="absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[180px]"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleContextMenuAction('favorite');
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
          >
            <Star className="h-4 w-4" />
            {course.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleContextMenuAction('course-page');
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
          >
            <Play className="h-4 w-4" />
            Ders Sayfasına Git
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleContextMenuAction('quiz');
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
          >
            <HelpCircle className="h-4 w-4" />
            Soru Çöz
          </button>
          
          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleContextMenuAction('instructor');
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
          >
            <User className="h-4 w-4" />
            Eğitmen Bilgisi
          </button>
        </div>
      )}


    </motion.div>
  );
};

export default CourseCard;

