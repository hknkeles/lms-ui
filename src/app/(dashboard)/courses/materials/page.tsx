"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Image, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  X, 
  ChevronLeft, 
  Maximize, 
  FolderOpen,
  Calendar,
  User,
  Clock,
  Star,
  Bookmark,
  MoreVertical,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { toast } from "sonner";

// Mock data - gerçek uygulamada API'den gelecek
const materials = [
  {
    id: "m1",
    title: "Davranış Bilimi Temelleri - Ders Notları",
    type: "pdf",
    course: "Davranış Bilimi Temelleri",
    teacher: "Prof. Dr. Mehmet Özkan",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    downloadCount: 156,
    isFavorite: true,
    tags: ["ders notları", "temel kavramlar", "psikoloji"],
    description: "Davranış biliminin temel kavramları ve teorileri hakkında kapsamlı ders notları."
  },
  {
    id: "m2",
    title: "Matematik - Türev ve İntegral Videoları",
    type: "video",
    course: "MATEMATİK",
    teacher: "Prof. Dr. Ahmet Yılmaz",
    size: "45.2 MB",
    uploadDate: "2024-01-12",
    downloadCount: 89,
    isFavorite: false,
    tags: ["video", "türev", "integral", "hesaplama"],
    description: "Türev ve integral konularının detaylı anlatımı ve örnek çözümler."
  },
  {
    id: "m3",
    title: "Kimya - Atom Yapısı Animasyonu",
    type: "link",
    course: "Kimya Temelleri",
    teacher: "Dr. Ayşe Demir",
    size: "External",
    uploadDate: "2024-01-10",
    downloadCount: 234,
    isFavorite: true,
    tags: ["animasyon", "atom", "kimyasal bağlar"],
    description: "Atom yapısı ve kimyasal bağların görsel animasyonu."
  },
  {
    id: "m4",
    title: "Biyoloji - Hücre Yapısı Şemaları",
    type: "image",
    course: "Biyoloji Temelleri",
    teacher: "Prof. Dr. Fatma Kaya",
    size: "8.7 MB",
    uploadDate: "2024-01-08",
    downloadCount: 178,
    isFavorite: false,
    tags: ["şema", "hücre", "organeller"],
    description: "Hücre yapısı ve organellerin detaylı şemaları."
  },
  {
    id: "m5",
    title: "İngilizce - Gramer Kuralları PDF",
    type: "pdf",
    course: "İngilizce Dil Öğrenimi",
    teacher: "Dr. Sarah Johnson",
    size: "1.8 MB",
    uploadDate: "2024-01-05",
    downloadCount: 267,
    isFavorite: true,
    tags: ["gramer", "dil", "kurallar"],
    description: "İngilizce gramer kurallarının kapsamlı rehberi."
  },
  {
    id: "m6",
    title: "Geometri - Uzay Geometrisi Videoları",
    type: "video",
    course: "Geometri ve Analitik Geometri",
    teacher: "Prof. Dr. Mustafa Öz",
    size: "67.3 MB",
    uploadDate: "2024-01-03",
    downloadCount: 145,
    isFavorite: false,
    tags: ["video", "uzay", "geometri", "3D"],
    description: "3D uzay geometrisi konularının görsel anlatımı."
  },
  {
    id: "m7",
    title: "Online Quiz Platformu",
    type: "link",
    course: "Davranış Bilimi Temelleri",
    teacher: "Prof. Dr. Mehmet Özkan",
    size: "External",
    uploadDate: "2024-01-01",
    downloadCount: 89,
    isFavorite: false,
    tags: ["quiz", "online", "test"],
    description: "Davranış bilimi konularında online quiz çözebileceğiniz platform."
  },
  {
    id: "m8",
    title: "Matematik Formül Tablosu",
    type: "pdf",
    course: "MATEMATİK",
    teacher: "Prof. Dr. Ahmet Yılmaz",
    size: "3.2 MB",
    uploadDate: "2023-12-28",
    downloadCount: 312,
    isFavorite: true,
    tags: ["formül", "tablo", "referans"],
    description: "Matematik derslerinde kullanabileceğiniz kapsamlı formül tablosu."
  }
];

const typeIcons = {
  pdf: FileText,
  video: Video,
  link: LinkIcon,
  image: Image
};

const typeColors = {
  pdf: "text-red-600 bg-red-50 dark:bg-red-900/20",
  video: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  link: "text-green-600 bg-green-50 dark:bg-green-900/20",
  image: "text-purple-600 bg-purple-50 dark:bg-purple-900/20"
};

export default function MaterialsPage() {
  const { sidebarOpen } = useSidebar();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Tümü");
  const [selectedCourse, setSelectedCourse] = useState("Tümü");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"date" | "name" | "downloads">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [favoriteMaterials, setFavoriteMaterials] = useState<Set<string>>(new Set());

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteMaterials');
    if (savedFavorites) {
      setFavoriteMaterials(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const filteredMaterials = useMemo(() => {
    let filtered = materials.filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedType === "Tümü" || material.type === selectedType;
      const matchesCourse = selectedCourse === "Tümü" || material.course === selectedCourse;
      
      return matchesSearch && matchesType && matchesCourse;
    });

    // Sort materials
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.title.localeCompare(b.title);
          break;
        case "downloads":
          comparison = a.downloadCount - b.downloadCount;
          break;
        case "date":
        default:
          comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered.map(material => ({
      ...material,
      isFavorite: favoriteMaterials.has(material.id)
    }));
  }, [searchTerm, selectedType, selectedCourse, sortBy, sortOrder, favoriteMaterials]);

  const toggleFavorite = useCallback((materialId: string) => {
    setFavoriteMaterials(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(materialId)) {
        newFavorites.delete(materialId);
        toast.success("Favorilerden kaldırıldı");
      } else {
        newFavorites.add(materialId);
        toast.success("Favorilere eklendi");
      }
      
      localStorage.setItem('favoriteMaterials', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  }, []);

  const handleDownload = (material: any) => {
    toast.success(`${material.title} indiriliyor...`);
    // Gerçek uygulamada dosya indirme işlemi burada yapılacak
  };

  const handleView = (material: any) => {
    if (material.type === "link") {
      window.open(material.url, "_blank");
    } else {
      toast.info(`${material.title} görüntüleniyor...`);
      // Gerçek uygulamada dosya görüntüleme işlemi burada yapılacak
    }
  };

  // Get unique courses and types for filters
  const courses = ["Tümü", ...Array.from(new Set(materials.map(material => material.course)))];
  const types = ["Tümü", ...Array.from(new Set(materials.map(material => material.type)))];

  return (
    <div className="min-h-screen">
      {/* Modern Navbar */}
      <div className={`fixed top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm rounded-b-2xl transition-all duration-300 ${
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
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FolderOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Ders Materyalleri</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Tüm ders materyallerinizi buradan yönetin</p>
                </div>
              </div>
            </div>
            
            {/* Search Bar - Center */}
            <div className="flex-1 max-w-sm mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Materyal ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm shadow-sm"
                />
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

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "grid" 
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm" 
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "list" 
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm" 
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
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

          {/* Filters and Sort - Conditional */}
          {isFilterOpen && (
            <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-lg p-1.5 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {types.map(type => (
                      <option key={type} value={type}>
                        {type === "Tümü" ? "Tüm Türler" : type.toUpperCase()}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-[120px]"
                  >
                    {courses.map(course => (
                      <option key={course} value={course}>
                        {course === "Tümü" ? "Tüm Dersler" : course}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedType("Tümü");
                      setSelectedCourse("Tümü");
                    }}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-all duration-200 text-xs font-medium"
                  >
                    <X className="h-3 w-3" />
                    Temizle
                  </button>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-1">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "date" | "name" | "downloads")}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="date">Tarih</option>
                    <option value="name">İsim</option>
                    <option value="downloads">İndirme</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="p-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {sortOrder === "asc" ? (
                      <SortAsc className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <SortDesc className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Materials Grid/List */}
      <div className={`px-4 py-4 pb-16 transition-all duration-300 ${
        isFilterOpen ? 'pt-32' : 'pt-16'
      }`}>
        {filteredMaterials.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
            : "space-y-3"
          }>
            {filteredMaterials.map((material, index) => {
              const TypeIcon = typeIcons[material.type as keyof typeof typeIcons];
              const typeColor = typeColors[material.type as keyof typeof typeColors];
              
              if (viewMode === "grid") {
                return (
                  <div
                    key={material.id}
                    className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Material Header */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${typeColor}`}>
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleFavorite(material.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              material.isFavorite
                                ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                                : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                            }`}
                          >
                            <Star className={`h-4 w-4 ${material.isFavorite ? "fill-current" : ""}`} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
                        {material.title}
                      </h3>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {material.description}
                      </p>
                    </div>

                    {/* Material Info */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <User className="h-3 w-3" />
                        <span className="truncate">{material.teacher}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(material.uploadDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Download className="h-3 w-3" />
                        <span>{material.downloadCount} indirme</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {material.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                        {material.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                            +{material.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 pt-0 flex gap-2">
                      <button
                        onClick={() => handleView(material)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        Görüntüle
                      </button>
                      <button
                        onClick={() => handleDownload(material)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                      >
                        <Download className="h-4 w-4" />
                        İndir
                      </button>
                    </div>
                  </div>
                );
              } else {
                // List view
                return (
                  <div
                    key={material.id}
                    className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${typeColor}`}>
                        <TypeIcon className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {material.title}
                          </h3>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => toggleFavorite(material.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                material.isFavorite
                                  ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                                  : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                              }`}
                            >
                              <Star className={`h-4 w-4 ${material.isFavorite ? "fill-current" : ""}`} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                          {material.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {material.teacher}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(material.uploadDate).toLocaleDateString('tr-TR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {material.downloadCount}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span>{material.size}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(material)}
                          className="p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(material)}
                          className="p-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Materyal bulunamadı
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Arama kriterlerinize uygun materyal bulunamadı.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedType("Tümü");
                setSelectedCourse("Tümü");
              }}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
