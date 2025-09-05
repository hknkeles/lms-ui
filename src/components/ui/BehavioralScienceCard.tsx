"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Bookmark, Users, Star, Play } from "lucide-react";

const BehavioralScienceCard = () => {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/courses/davranis-bilimi");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700"
      onClick={handleContinue}
    >
      {/* Course Cover - Minimal İllüstrasyon */}
      <div className="relative h-36 bg-gradient-to-br from-teal-600 via-teal-700 to-blue-800 dark:from-teal-800 dark:via-teal-900 dark:to-blue-900">
        {/* Bookmark Icon */}
        <div className="absolute top-4 right-4">
          <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 shadow-lg">
            <Bookmark className="h-5 w-5 text-white/90 hover:text-white transition-colors" />
          </div>
        </div>

        {/* Başlangıç Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
            Başlangıç
          </span>
        </div>

        
        {/* Minimal İllüstrasyon - Merkezi konumlandırma */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Basit kafa profili */}
          <div className="w-20 h-20 bg-blue-800/90 rounded-full relative flex items-center justify-center shadow-lg">
            {/* Basit dişli */}
            <div className="w-8 h-8 bg-teal-400 rounded transform rotate-45"></div>
            {/* Işık */}
            <div className="absolute -top-3 -left-3 w-1.5 h-8 bg-yellow-300 transform rotate-12"></div>
          </div>
          
          {/* Basit tırmanan kişi */}
          <div className="absolute top-8 left-8 w-10 h-10 bg-blue-800/90 rounded-full relative shadow-lg">
            <div className="absolute -right-1 top-2 w-2.5 h-2.5 bg-blue-600 rounded-sm"></div>
            <div className="absolute -bottom-1 -right-1 w-1.5 h-4 bg-blue-600 transform rotate-12"></div>
          </div>
        </div>
      </div>

      {/* Devam Ediyor Badge and Course Stats */}
      <div className="pl-0 pr-6 pb-4 pt-0">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-br">
            Devam Ediyor
          </span>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>36 video</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>8 quiz</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>4 canlı</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Info */}
      <div className="px-6 pb-6 pt-0">
        {/* Course Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 leading-tight">
          Davranış Bilimi Temelleri: İnsan Davranışlarını Anlama ve Analiz Etme Rehberi
        </h3>

        {/* Next Live Session */}
        <div className="mb-4 p-3 bg-green-50/50 dark:bg-green-900/20 rounded-lg border border-green-200/30 dark:border-green-700/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-700 dark:text-green-300 font-medium">
              Sonraki canlı ders: Yarın 14:00
            </span>
          </div>
        </div>

        {/* Instructor and Progress Circle */}
        <div className="flex items-center justify-between mb-4">
          {/* Instructor */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                alt="Admin Admin"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <span className="text-white text-sm font-medium hidden">AA</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Eğitmen</p>
              <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                Admin Admin
              </span>
            </div>
          </div>

          {/* Dairesel Yüzde Göstergesi */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
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
                strokeDasharray="6, 94"
                strokeLinecap="round"
              />
            </svg>
            {/* Yüzde sayısı */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">6%</span>
            </div>
          </div>
        </div>

        {/* Course Duration and End Date */}
        <div className="mb-4">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>12 hafta</span>
            <span>•</span>
            <span>Bitiş: 06.07.2033</span>
          </div>
        </div>

        {/* Continue Button */}
        <motion.div
          className="w-full bg-gray-900 dark:bg-gray-700 text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium hover:bg-gray-800 dark:hover:bg-gray-600"
        >
          <Play className="h-4 w-4" />
          Devam Et
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BehavioralScienceCard;
