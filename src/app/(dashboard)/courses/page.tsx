"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import CourseCard from "@/components/ui/CourseCard";
import CourseListItem from "@/components/ui/CourseListItem";
import ModernSelect from "@/components/ui/ModernSelect";

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

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header ve Filtreler */}
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

        {/* Filtreler ve Arama */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Arama */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Derse göre filtrele..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-white/30 dark:border-gray-600/30 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-300 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-700 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Kategori Filtresi */}
          <div className="flex gap-2">
            <ModernSelect
              options={[
                { value: "Tümü", label: "Eğitmene göre filtrele" },
                { value: "Bilgisayar", label: "Bilgisayar" },
                { value: "Matematik", label: "Matematik" },
                { value: "Dil", label: "Dil" }
              ]}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Eğitmene göre filtrele"
            />

            <ModernSelect
              options={[
                { value: "Tümü", label: "Seviyeye göre filtrele" },
                { value: "Başlangıç", label: "Başlangıç" },
                { value: "Orta", label: "Orta" },
                { value: "İleri", label: "İleri" }
              ]}
              value={selectedLevel}
              onChange={setSelectedLevel}
              placeholder="Seviyeye göre filtrele"
            />

            <ModernSelect
              options={[
                { value: "Tümü", label: "Duruma göre filtrele" },
                { value: "aktif", label: "Aktif" },
                { value: "tamamlanan", label: "Tamamlanan" },
                { value: "gelecek", label: "Gelecek" }
              ]}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Duruma göre filtrele"
            />

            {/* Minimal Temizleme Butonu */}
            {(selectedCategory !== "Tümü" || selectedLevel !== "Tümü" || selectedStatus !== "Tümü" || searchTerm) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Tümü");
                  setSelectedLevel("Tümü");
                  setSelectedStatus("Tümü");
                }}
                className="px-3 py-3 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 rounded-2xl transition-all duration-200"
                title="Filtreleri Temizle"
              >
                <X className="h-4 w-4" />
              </button>
            )}
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
            <Search className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
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
