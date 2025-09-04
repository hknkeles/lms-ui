"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, GraduationCap } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import CourseCard from "@/components/ui/CourseCard";
import { getDashboardStats, getRecentCourses } from "@/data/mock/dashboard";

export default function DashboardPage() {
  const stats = getDashboardStats();
  const recentCourses = getRecentCourses();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Hoş Geldin, Merve! 👋</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Bugün öğrenmeye devam etmeye hazır mısın? İşte güncel durumun:
        </p>
      </motion.div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Toplam Ders"
          value={stats.totalCourses}
          subtitle="Bu dönem"
          icon={<BookOpen className="h-6 w-6" />}
          color="primary"
          delay={0.1}
        />
        
        <StatCard
          title="Devam Eden"
          value={stats.ongoingCourses}
          subtitle="Aktif dersler"
          icon={<Clock className="h-6 w-6" />}
          color="green"
          delay={0.2}
        />
        
        <StatCard
          title="Ortalama Not"
          value={stats.averageGrade}
          subtitle="Genel başarı"
          icon={<GraduationCap className="h-6 w-6" />}
          color="blue"
          delay={0.3}
        />
      </div>
      
      {/* Recent Courses Section */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-between"
        >
          <h3 className="text-xl font-semibold text-gray-900">Son Dersler</h3>
          <p className="text-sm text-gray-500">Hızlı erişim için son 3 dersin</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCourses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              delay={0.5 + index * 0.1}
            />
          ))}
        </div>
      </div>
      
      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-gradient-to-r from-primary-50 to-pastel-blue dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-6 border border-primary-100 dark:border-primary-800"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hızlı Erişim</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-primary-200 dark:border-primary-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200 text-left">
            <div className="text-primary-600 dark:text-primary-400 mb-2">
              <BookOpen className="h-6 w-6" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white">Tüm Derslerim</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Tüm dersleri görüntüle</p>
          </button>
          
          <button className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-primary-200 dark:border-primary-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200 text-left">
            <div className="text-primary-600 dark:text-primary-400 mb-2">
              <Clock className="h-6 w-6" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white">Yaklaşan Ödevler</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Teslim tarihlerini kontrol et</p>
          </button>
          
          <button className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-primary-200 dark:border-primary-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200 text-left">
            <div className="text-primary-600 dark:text-primary-400 mb-2">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white">Notlarım</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Başarı durumunu görüntüle</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
