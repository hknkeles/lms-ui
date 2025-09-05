"use client";

import { useState, useMemo } from "react";
import CourseCard from "@/components/ui/CourseCard";
import NotesSidebar from "@/components/ui/NotesSidebar";
import { BookOpen, Plus, Search, Filter, StickyNote, X } from "lucide-react";
import ModernSelect from "@/components/ui/ModernSelect";

// Mock data - gerçek uygulamada API'den gelecek
const courses = [
  {
    id: "c1",
    title: "Web Geliştirme 101",
    teacher: "Dr. Ayşe Yılmaz",
    progress: 45,
    slug: "web-gelistirme-101",
    category: "Bilgisayar",
    duration: "12 hafta",
    level: "Başlangıç",
    status: "aktif",
    quizCount: 8,
    materialCount: 24,
    videoCount: 36,
    liveSessionCount: 4,
    nextLiveSession: "Yarın 14:00",
    lastUpdated: "2 saat önce",
    isFavorite: true
  },
  {
    id: "c2",
    title: "Veri Yapıları ve Algoritmalar",
    teacher: "Prof. Mehmet Demir",
    progress: 12,
    slug: "veri-yapilari-algoritmalar",
    category: "Bilgisayar",
    duration: "16 hafta",
    level: "Orta",
    status: "aktif",
    quizCount: 12,
    materialCount: 32,
    videoCount: 48,
    liveSessionCount: 6,
    nextLiveSession: "Cuma 16:00",
    lastUpdated: "1 gün önce",
    isFavorite: false
  },
  {
    id: "c3",
    title: "Veritabanı Temelleri",
    teacher: "Ece Kaya",
    progress: 78,
    slug: "veritabani-temelleri",
    category: "Bilgisayar",
    duration: "14 hafta",
    level: "Başlangıç",
    status: "aktif",
    quizCount: 6,
    materialCount: 18,
    videoCount: 28,
    liveSessionCount: 3,
    nextLiveSession: "Pazartesi 10:00",
    lastUpdated: "3 saat önce",
    isFavorite: true
  },
  {
    id: "c4",
    title: "Matematik 101",
    teacher: "Prof. Dr. Ahmet Yılmaz",
    progress: 75,
    slug: "matematik-101",
    category: "Matematik",
    duration: "15 hafta",
    level: "Başlangıç",
    status: "aktif",
    quizCount: 10,
    materialCount: 22,
    videoCount: 30,
    liveSessionCount: 5,
    nextLiveSession: "Salı 15:00",
    lastUpdated: "5 saat önce",
    isFavorite: false
  },
  {
    id: "c5",
    title: "İngilizce Kompozisyon",
    teacher: "Dr. Sarah Johnson",
    progress: 60,
    slug: "ingilizce-kompozisyon",
    category: "Dil",
    duration: "10 hafta",
    level: "Orta",
    status: "aktif",
    quizCount: 5,
    materialCount: 15,
    videoCount: 20,
    liveSessionCount: 2,
    nextLiveSession: "Çarşamba 11:00",
    lastUpdated: "1 gün önce",
    isFavorite: true
  },
  {
    id: "c6",
    title: "Bilgisayar Programlama",
    teacher: "Prof. Dr. Mehmet Kaya",
    progress: 90,
    slug: "bilgisayar-programlama",
    category: "Bilgisayar",
    duration: "18 hafta",
    level: "İleri",
    status: "tamamlanan",
    quizCount: 15,
    materialCount: 40,
    videoCount: 60,
    liveSessionCount: 8,
    lastUpdated: "1 hafta önce",
    isFavorite: false
  }
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [selectedLevel, setSelectedLevel] = useState("Tümü");
  const [selectedStatus, setSelectedStatus] = useState("Tümü");
  const [isNotesSidebarOpen, setIsNotesSidebarOpen] = useState(false);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.teacher.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Tümü" || course.category === selectedCategory;
      const matchesLevel = selectedLevel === "Tümü" || course.level === selectedLevel;
      const matchesStatus = selectedStatus === "Tümü" || course.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
    });
  }, [searchTerm, selectedCategory, selectedLevel, selectedStatus]);

  // Get unique categories and levels for filters
  const categories = ["Tümü", ...Array.from(new Set(courses.map(course => course.category).filter(Boolean)))];
  const levels = ["Tümü", ...Array.from(new Set(courses.map(course => course.level).filter(Boolean)))];
  const statuses = ["Tümü", "aktif", "tamamlanan", "gelecek"];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border-b border-white/30 dark:border-gray-700/30 sticky top-0 z-30 rounded-b-3xl">
        <div className="w-full px-8 sm:px-12 lg:px-16 py-4 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white">Tüm Dersler</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mt-3">
                  {filteredCourses.length} ders bulundu
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="w-full px-8 sm:px-12 lg:px-16 py-6 transition-all duration-300">
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/30 p-6 shadow-xl">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[400px]">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Ders ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-8 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
              />
            </div>

            {/* Category Filter */}
            <ModernSelect
              options={categories.map(category => ({
                value: category,
                label: category === "Tümü" ? "Tüm Kategoriler" : category
              }))}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Kategori Seçin"
              className="min-w-[180px]"
            />

            {/* Level Filter */}
            <ModernSelect
              options={levels.map(level => ({
                value: level,
                label: level === "Tümü" ? "Tüm Seviyeler" : level
              }))}
              value={selectedLevel}
              onChange={setSelectedLevel}
              placeholder="Seviye Seçin"
              className="min-w-[160px]"
            />

            {/* Status Filter */}
            <ModernSelect
              options={statuses.map(status => ({
                value: status,
                label: status === "Tümü" ? "Tüm Durumlar" : 
                       status === "aktif" ? "Aktif" :
                       status === "tamamlanan" ? "Tamamlanan" :
                       status === "gelecek" ? "Gelecek" : status
              }))}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Durum Seçin"
              className="min-w-[160px]"
            />

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Tümü");
                setSelectedLevel("Tümü");
                setSelectedStatus("Tümü");
              }}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-2xl transition-all duration-200 font-medium"
            >
              <X className="h-4 w-4" />
              Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="w-full px-8 sm:px-12 lg:px-16 pb-20 transition-all duration-300">
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                delay={index * 0.1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Ders bulunamadı
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Arama kriterlerinize uygun ders bulunamadı. Farklı filtreler deneyin.
            </p>
          </div>
        )}
      </div>

      {/* Floating Notes Button */}
      <button
        onClick={() => setIsNotesSidebarOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 z-40 flex items-center justify-center group"
      >
        <StickyNote className="h-8 w-8 group-hover:rotate-12 transition-transform duration-300" />
      </button>

      {/* Notes Sidebar */}
      <NotesSidebar
        isOpen={isNotesSidebarOpen}
        onClose={() => setIsNotesSidebarOpen(false)}
      />
    </div>
  );
}
