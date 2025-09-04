"use client";

import { useState, useMemo } from "react";
import { Search, Filter, BookOpen, Clock, Award, Calendar } from "lucide-react";
import CourseCard from "@/components/ui/CourseCard";
import CourseListItem from "@/components/ui/CourseListItem";

// Mock data - gerçek uygulamada API'den gelecek
const courses = [
  {
    id: "c1",
    title: "Web Geliştirme 101",
    teacher: "Dr. Ayşe Yılmaz",
    cover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&crop=center",
    progress: 45,
    slug: "web-gelistirme-101",
    category: "Bilgisayar",
    duration: "12 hafta",
    level: "Başlangıç",
    status: "aktif"
  },
  {
    id: "c2",
    title: "Veri Yapıları ve Algoritmalar",
    teacher: "Prof. Mehmet Demir",
    cover: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop&crop=center",
    progress: 12,
    slug: "veri-yapilari-algoritmalar",
    category: "Bilgisayar",
    duration: "16 hafta",
    level: "Orta",
    status: "aktif"
  },
  {
    id: "c3",
    title: "Veritabanı Temelleri",
    teacher: "Ece Kaya",
    cover: "https://images.unsplash.com/photo-1544383835-bda2bc66a6d3?w=400&h=250&fit=crop&crop=center",
    progress: 78,
    slug: "veritabani-temelleri",
    category: "Bilgisayar",
    duration: "14 hafta",
    level: "Başlangıç",
    status: "aktif"
  },
  {
    id: "c4",
    title: "Matematik 101",
    teacher: "Prof. Dr. Ahmet Yılmaz",
    cover: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop&crop=center",
    progress: 75,
    slug: "matematik-101",
    category: "Matematik",
    duration: "15 hafta",
    level: "Başlangıç",
    status: "aktif"
  },
  {
    id: "c5",
    title: "İngilizce Kompozisyon",
    teacher: "Dr. Sarah Johnson",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=250&fit=crop&crop=center",
    progress: 60,
    slug: "ingilizce-kompozisyon",
    category: "Dil",
    duration: "10 hafta",
    level: "Orta",
    status: "aktif"
  },
  {
    id: "c6",
    title: "Bilgisayar Programlama",
    teacher: "Prof. Dr. Mehmet Kaya",
    cover: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop&crop=center",
    progress: 90,
    slug: "bilgisayar-programlama",
    category: "Bilgisayar",
    duration: "18 hafta",
    level: "İleri",
    status: "tamamlanan"
  }
];

const categories = ["Tümü", "Bilgisayar", "Matematik", "Dil"];
const levels = ["Tümü", "Başlangıç", "Orta", "İleri"];
const statuses = ["Tümü", "aktif", "tamamlanan", "gelecek"];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [selectedLevel, setSelectedLevel] = useState("Tümü");
  const [selectedStatus, setSelectedStatus] = useState("Tümü");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  const stats = useMemo(() => {
    const total = courses.length;
    const active = courses.filter(c => c.status === "aktif").length;
    const completed = courses.filter(c => c.status === "tamamlanan").length;
    const averageProgress = Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / total);
    
    return { total, active, completed, averageProgress };
  }, []);

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header ve İstatistikler */}
      <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Tüm Derslerim</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Bu dönem kayıtlı olduğun dersler ve detaylı ilerleme durumun
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  viewMode === "grid" 
                    ? "bg-primary-500/90 text-white shadow-lg" 
                    : "bg-white/20 dark:bg-gray-700/20 text-gray-700 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-700/30 border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  viewMode === "list" 
                    ? "bg-primary-500/90 text-white shadow-lg" 
                    : "bg-white/20 dark:bg-gray-700/20 text-gray-700 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-700/30 border border-white/20 dark:border-gray-600/30 backdrop-blur-sm"
                }`}
              >
                Liste
              </button>
            </div>
          </div>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30 dark:border-gray-600/30 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/80 backdrop-blur-sm rounded-xl">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Toplam Ders</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30 dark:border-gray-600/30 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/80 backdrop-blur-sm rounded-xl">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">Aktif Ders</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.active}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30 dark:border-gray-600/30 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/80 backdrop-blur-sm rounded-xl">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Tamamlanan</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.completed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30 dark:border-gray-600/30 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/80 backdrop-blur-sm rounded-xl">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">Ortalama İlerleme</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.averageProgress}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtreler ve Arama */}
      <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Arama */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Ders adı veya öğretmen ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-white/30 dark:border-gray-600/30 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-300 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-700 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Kategori Filtresi */}
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-white/30 dark:border-gray-600/30 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-300 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm text-gray-700 dark:text-gray-200"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 border border-white/30 dark:border-gray-600/30 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-300 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm text-gray-700 dark:text-gray-200"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-white/30 dark:border-gray-600/30 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-300 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm text-gray-700 dark:text-gray-200"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === "aktif" ? "Aktif" : status === "tamamlanan" ? "Tamamlanan" : status === "gelecek" ? "Gelecek" : "Tümü"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sonuç Sayısı */}
        <div className="mt-4 pt-4 border-t border-white/20 dark:border-gray-600/30">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">{filteredCourses.length}</span> ders bulundu
          </p>
        </div>
      </div>

      {/* Ders Kartları */}
      {filteredCourses.length > 0 ? (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {filteredCourses.map((course, index) => (
            viewMode === "grid" ? (
              <CourseCard 
                key={course.id} 
                course={course} 
                delay={index * 0.1}
              />
            ) : (
              <CourseListItem 
                key={course.id} 
                course={course} 
                delay={index * 0.1}
              />
            )
          ))}
        </div>
      ) : (
        <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-12 text-center">
          <div className="max-w-md mx-auto">
            <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Ders bulunamadı</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Arama kriterlerinize uygun ders bulunamadı. Filtreleri değiştirmeyi deneyin.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Tümü");
                setSelectedLevel("Tümü");
                setSelectedStatus("Tümü");
              }}
              className="bg-primary-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-2xl hover:bg-primary-500 transition-all duration-300 border border-white/20 dark:border-gray-600/30 shadow-lg"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
