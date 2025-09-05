"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, GraduationCap } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import CourseCard from "@/components/ui/CourseCard";
import { getDashboardStats, getRecentCourses } from "@/data/mock/dashboard";

export default function DashboardPage() {
  const stats = getDashboardStats();
  const recentCourses = getRecentCourses();
  
  console.log('Recent Courses:', recentCourses);
  console.log('Recent Courses Length:', recentCourses.length);

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-8 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Hoş Geldin, Merve! 👋</h2>
        <p className="text-lg text-gray-600">
          Bugün öğrenmeye devam etmeye hazır mısın? İşte güncel durumun:
        </p>
      </motion.div>
      
      {/* Stats Cards */}
      <div className="grid gap-8 max-w-5xl mx-auto" style={{ 
        gridTemplateColumns: 'repeat(3, 1fr) !important',
        display: 'grid !important',
        width: '100%',
        maxWidth: '1200px'
      }}>
        <StatCard
          title="Toplam Ders"
          value={stats.totalCourses}
          subtitle="Bu dönem"
          icon={<BookOpen className="h-8 w-8" />}
          color="primary"
          delay={0.1}
        />
        
        <StatCard
          title="Devam Eden"
          value={stats.ongoingCourses}
          subtitle="Aktif dersler"
          icon={<Clock className="h-8 w-8" />}
          color="green"
          delay={0.2}
        />
        
        <StatCard
          title="Ortalama Not"
          value={stats.averageGrade}
          subtitle="Genel başarı"
          icon={<GraduationCap className="h-8 w-8" />}
          color="blue"
          delay={0.3}
        />
      </div>
      
      {/* Recent Courses Section */}
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-between"
        >
          <h3 className="text-2xl font-semibold text-gray-900">Son Dersler</h3>
          <p className="text-base text-gray-500">Hızlı erişim için son 3 dersin</p>
        </motion.div>
        
        <div className="grid gap-8 max-w-5xl mx-auto" style={{ 
          gridTemplateColumns: 'repeat(3, 1fr) !important',
          display: 'grid !important',
          width: '100%',
          maxWidth: '1200px'
        }}>
          {recentCourses.slice(0, 3).map((course, index) => (
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
        className="bg-gradient-to-r from-primary-50 to-pastel-blue rounded-xl p-8 border border-primary-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Hızlı Erişim</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="p-6 bg-white rounded-xl border border-primary-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 text-left">
            <div className="text-primary-600 mb-3">
              <BookOpen className="h-7 w-7" />
            </div>
            <h4 className="font-medium text-gray-900 text-lg">Tüm Derslerim</h4>
            <p className="text-sm text-gray-600">Tüm dersleri görüntüle</p>
          </button>
          
          <button className="p-6 bg-white rounded-xl border border-primary-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 text-left">
            <div className="text-primary-600 mb-3">
              <Clock className="h-7 w-7" />
            </div>
            <h4 className="font-medium text-gray-900 text-lg">Yaklaşan Ödevler</h4>
            <p className="text-sm text-gray-600">Teslim tarihlerini kontrol et</p>
          </button>
          
          <button className="p-6 bg-white rounded-xl border border-primary-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 text-left">
            <div className="text-primary-600 mb-3">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h4 className="font-medium text-gray-900 text-lg">Notlarım</h4>
            <p className="text-sm text-gray-600">Başarı durumunu görüntüle</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
