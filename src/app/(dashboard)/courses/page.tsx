"use client";

import { useState, useMemo, useEffect, useCallback, memo } from "react";
import CourseCard from "@/components/ui/CourseCard";
import BehavioralScienceCard from "@/components/ui/BehavioralScienceCard";
import NotesSidebar from "@/components/ui/NotesSidebar";
import { BookOpen, Plus, Search, StickyNote, X } from "lucide-react";
import ModernSelect from "@/components/ui/ModernSelect";

// Mock data - gerçek uygulamada API'den gelecek
const courses = [
  {
    id: "c1",
    title: "Tarih",
    teacher: "Prof. Dr. Mehmet Özkan",
    progress: 45,
    slug: "tarih",
    category: "Sosyal Bilimler",
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
    title: "Matematik",
    teacher: "Prof. Dr. Ahmet Yılmaz",
    progress: 12,
    slug: "matematik",
    category: "Fen Bilimleri",
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
    title: "Kimya",
    teacher: "Dr. Ayşe Demir",
    progress: 78,
    slug: "kimya",
    category: "Fen Bilimleri",
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
    title: "Biyoloji",
    teacher: "Prof. Dr. Fatma Kaya",
    progress: 75,
    slug: "biyoloji",
    category: "Fen Bilimleri",
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
    title: "İngilizce",
    teacher: "Dr. Sarah Johnson",
    progress: 60,
    slug: "ingilizce",
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
    title: "Geometri",
    teacher: "Prof. Dr. Mustafa Öz",
    progress: 90,
    slug: "geometri",
    category: "Fen Bilimleri",
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
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [visibleCourses, setVisibleCourses] = useState(12); // Initial load
  // Load data from localStorage on mount
  useEffect(() => {
    const savedSearchHistory = localStorage.getItem('searchHistory');
    
    if (savedSearchHistory) setSearchHistory(JSON.parse(savedSearchHistory));
  }, []);

  // Save search to history - memoized
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim() && !searchHistory.includes(term.trim())) {
      const newHistory = [term.trim(), ...searchHistory.slice(0, 9)]; // Keep last 10
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  }, [searchHistory]);

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


  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lazy loading with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCourses < filteredCourses.length) {
          setVisibleCourses(prev => Math.min(prev + 8, filteredCourses.length));
        }
      },
      { threshold: 0.1 }
    );

    const loadMoreTrigger = document.getElementById('load-more-trigger');
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger);
    }

    return () => {
      if (loadMoreTrigger) {
        observer.unobserve(loadMoreTrigger);
      }
    };
  }, [visibleCourses, filteredCourses.length]);

  // Get unique categories and levels for filters
  const categories = ["Tümü", ...Array.from(new Set(courses.map(course => course.category).filter(Boolean)))];
  const levels = ["Tümü", ...Array.from(new Set(courses.map(course => course.level).filter(Boolean)))];
  const statuses = ["Tümü", "aktif", "tamamlanan", "gelecek"];

  return (
    <div className="min-h-screen">
      {/* Modern Navbar */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="px-6 py-4">
          {/* Navbar Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Derslerim</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tüm derslerinizi buradan yönetin</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button 
                onClick={() => setIsNotesSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <StickyNote className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ders ara..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  list="search-history"
                />
                <datalist id="search-history">
                  {searchHistory.map((term, index) => (
                    <option key={index} value={term} />
                  ))}
                </datalist>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <ModernSelect
                  options={categories.map(category => ({
                    value: category,
                    label: category === "Tümü" ? "Tüm Kategoriler" : category
                  }))}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="Kategori"
                  className="min-w-[140px]"
                />

                <ModernSelect
                  options={levels.map(level => ({
                    value: level,
                    label: level === "Tümü" ? "Tüm Seviyeler" : level
                  }))}
                  value={selectedLevel}
                  onChange={setSelectedLevel}
                  placeholder="Seviye"
                  className="min-w-[120px]"
                />

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
                  placeholder="Durum"
                  className="min-w-[120px]"
                />

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Tümü");
                    setSelectedLevel("Tümü");
                    setSelectedStatus("Tümü");
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  <X className="h-4 w-4" />
                  Temizle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="px-6 py-6 pb-16">
        {/* Özel Davranış Bilimi Kartı */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Özel Tasarım Kartı
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <BehavioralScienceCard />
            </div>
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.slice(0, visibleCourses).map((course, index) => (
              <CourseCard 
                key={course.id}
                course={course} 
                delay={index * 0.1}
              />
            ))}
            
            {/* Load More Trigger */}
            {visibleCourses < filteredCourses.length && (
              <div id="load-more-trigger" className="col-span-full flex justify-center py-8">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                  <span>Daha fazla yükleniyor...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ders bulunamadı
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Arama kriterlerinize uygun ders bulunamadı.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Tümü");
                setSelectedLevel("Tümü");
                setSelectedStatus("Tümü");
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}
      </div>

      {/* Floating Notes Button */}
      <button
        onClick={() => setIsNotesSidebarOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 z-40 flex items-center justify-center group"
      >
        <StickyNote className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
      </button>

      {/* Notes Sidebar */}
      <NotesSidebar
        isOpen={isNotesSidebarOpen}
        onClose={() => setIsNotesSidebarOpen(false)}
      />
    </div>
  );
}
