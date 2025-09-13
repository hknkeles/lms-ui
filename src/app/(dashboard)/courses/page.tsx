"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/ui/CourseCard";
import BehavioralScienceCard from "@/components/ui/BehavioralScienceCard";
import NotesSidebar from "@/components/ui/NotesSidebar";
import { BookOpen, Plus, Search, StickyNote, X, ChevronLeft, Maximize, Filter } from "lucide-react";
import ModernSelect from "@/components/ui/ModernSelect";
import { useSidebar } from "@/contexts/SidebarContext";
import { toast } from "sonner";

// Mock data - gerçek uygulamada API'den gelecek
const courses = [
  {
    id: "c1",
    title: "Davranış Bilimi Temelleri: İnsan Davranışlarını Anlama ve Analiz Etme Rehberi",
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
    isFavorite: true,
    endDate: "15.08.2024"
  },
  {
    id: "c2",
    title: "MATEMATİK",
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
    isFavorite: false,
    endDate: "20.09.2024"
  },
  {
    id: "c3",
    title: "Kimya Temelleri: Atom Yapısı ve Kimyasal Bağlar Rehberi",
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
    isFavorite: true,
    endDate: "10.08.2024"
  },
  {
    id: "c4",
    title: "Biyoloji Temelleri: Hücre Yapısı ve Canlı Sistemler Analizi",
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
    isFavorite: false,
    endDate: "25.08.2024"
  },
  {
    id: "c5",
    title: "İngilizce Dil Öğrenimi: Temel Gramer ve Konuşma Becerileri",
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
    isFavorite: true,
    endDate: "05.08.2024"
  },
  {
    id: "c6",
    title: "Geometri ve Analitik Geometri: Uzay ve Düzlem Geometrisi",
    teacher: "Prof. Dr. Mustafa Öz",
    progress: 100,
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
    isFavorite: false,
    endDate: "30.07.2024"
  }
];

export default function CoursesPage() {
  const { sidebarOpen } = useSidebar();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [selectedLevel, setSelectedLevel] = useState("Tümü");
  const [selectedStatus, setSelectedStatus] = useState("Tümü");
  const [isNotesSidebarOpen, setIsNotesSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [visibleCourses, setVisibleCourses] = useState(12); // Initial load
  const [favoriteCourses, setFavoriteCourses] = useState<Set<string>>(new Set());
  // Load data from localStorage on mount
  useEffect(() => {
    const savedSearchHistory = localStorage.getItem('searchHistory');
    const savedFavorites = localStorage.getItem('favoriteCourses');
    
    if (savedSearchHistory) setSearchHistory(JSON.parse(savedSearchHistory));
    if (savedFavorites) setFavoriteCourses(new Set(JSON.parse(savedFavorites)));
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
    }).map(course => ({
      ...course,
      isFavorite: favoriteCourses.has(course.id)
    }));
  }, [searchTerm, selectedCategory, selectedLevel, selectedStatus, favoriteCourses]);

  const toggleFavorite = useCallback((courseId: string) => {
    setFavoriteCourses(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(courseId)) {
        newFavorites.delete(courseId);
      } else {
        newFavorites.add(courseId);
      }
      
      // Save to localStorage
      localStorage.setItem('favoriteCourses', JSON.stringify([...newFavorites]));
      
      return newFavorites;
    });
  }, []);


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
      <div className={`fixed top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-all duration-300 ${
        sidebarOpen ? 'left-[22rem] right-0' : 'left-16 right-0'
      }`}>
        <div className="px-4 py-2">
          {/* Navbar Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Derslerim</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Tüm derslerinizi buradan yönetin</p>
                </div>
              </div>
            </div>
            
            {/* Search Bar - Center */}
            <div className="flex-1 max-w-sm mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ders ara..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm shadow-sm"
                  list="search-history"
                />
                <datalist id="search-history">
                  {searchHistory.map((term, index) => (
                    <option key={index} value={term} />
                  ))}
                </datalist>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="relative group">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${
                    isFilterOpen ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }`}
                >
                  <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Filtrele
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
                </div>
              </div>
              <div className="relative group">
                <button 
                  onClick={() => setIsNotesSidebarOpen(true)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <StickyNote className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Not Ekle
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
                </div>
              </div>
              <div className="relative group">
                <button
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen();
                    } else {
                      document.exitFullscreen();
                      toast.info("Tam ekran modu kapatıldı");
                    }
                  }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Maximize className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Tam Ekran
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters - Conditional */}
          {isFilterOpen && (
            <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-lg p-1.5 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex flex-wrap items-center justify-center gap-1">
                <ModernSelect
                  options={categories.map(category => ({
                    value: category,
                    label: category === "Tümü" ? "Tüm Kategoriler" : category
                  }))}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="Kategori"
                  className="min-w-[100px] text-xs"
                />

                <ModernSelect
                  options={levels.map(level => ({
                    value: level,
                    label: level === "Tümü" ? "Tüm Seviyeler" : level
                  }))}
                  value={selectedLevel}
                  onChange={setSelectedLevel}
                  placeholder="Seviye"
                  className="min-w-[80px] text-xs"
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
                  className="min-w-[80px] text-xs"
                />

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Tümü");
                    setSelectedLevel("Tümü");
                    setSelectedStatus("Tümü");
                  }}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-all duration-200 text-xs font-medium"
                >
                  <X className="h-3 w-3" />
                  Temizle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      <div className={`px-4 py-4 pb-16 transition-all duration-300 ${
        isFilterOpen ? 'pt-32' : 'pt-16'
      }`}>
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {filteredCourses.slice(0, visibleCourses).map((course, index) => (
              <CourseCard 
                key={course.id}
                course={course} 
                delay={index * 0.1}
                onToggleFavorite={toggleFavorite}
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

        {/* Özel Tasarım Kartları - En Altta */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Özel Tasarım Kartları
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            {/* Davranış Bilimi Kartı */}
            <div className="w-full max-w-xs">
              <BehavioralScienceCard />
            </div>
            
            {/* Modern Course Card - Skeleton Tasarımından İlham */}
            <div className="w-full max-w-xs">
              <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                {/* Course Cover - Gradient Background */}
                <div className="relative h-28 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900">
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* Bookmark Icon */}
                  <div className="absolute top-3 right-3 z-10">
                    <button className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-200">
                      <svg className="h-4 w-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>

                  {/* Level Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-md backdrop-blur-sm">
                      İleri
                    </span>
                  </div>
                  
                  {/* Center Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-white/40 rounded"></div>
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
                        <span>24 video</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>12 quiz</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>6 canlı</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="px-4 pb-4 pt-2 flex flex-col flex-grow">
                  {/* Course Title */}
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 leading-tight line-clamp-2">
                    Yapay Zeka ve Makine Öğrenmesi
                  </h3>

                  {/* Next Live Session */}
                  <div className="mb-3 p-2 bg-green-50/50 dark:bg-green-900/20 rounded-md border border-green-200/30 dark:border-green-700/30">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                        Yarın 15:00
                      </span>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-grow"></div>

                  {/* Bottom Section - Eğitmen ve İlerleme */}
                  <div className="flex items-center justify-between mb-3">
                    {/* Eğitmen */}
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        <span className="text-white text-xs font-medium">AY</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          Dr. Ayşe Yılmaz
                        </p>
                      </div>
                    </div>

                    {/* İlerleme */}
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8">
                        <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                          <path
                            d="M16 2.0845 a 13.9155 13.9155 0 0 1 0 27.831 a 13.9155 13.9155 0 0 1 0 -27.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          />
                          <path
                            d="M16 2.0845 a 13.9155 13.9155 0 0 1 0 27.831 a 13.9155 13.9155 0 0 1 0 -27.831"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="2"
                            strokeDasharray="18.2, 9.8"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">65%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Duration */}
                  <div className="mb-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      20 hafta
                    </span>
                  </div>

                  {/* Continue Button */}
                  <button className="w-full bg-gray-900 dark:bg-gray-700 text-white py-2.5 px-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium hover:bg-gray-800 dark:hover:bg-gray-600 text-sm">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Devam Et
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
