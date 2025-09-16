"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Megaphone, 
  Search, 
  Filter, 
  ChevronLeft, 
  Maximize, 
  Calendar, 
  Clock, 
  User, 
  Download, 
  Eye, 
  Bookmark, 
  MoreVertical, 
  Pin, 
  Heart, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Star, 
  X, 
  SortAsc, 
  SortDesc, 
  Grid3X3, 
  List,
  Bell,
  Flag
} from "lucide-react";
import { 
  announcements, 
  Announcement, 
  getAnnouncementsByCategory, 
  getPinnedAnnouncements,
  getUnreadAnnouncements,
  getAnnouncementsByPriority 
} from "@/data/announcements";
import { useSidebar } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Card from "@/components/shared/Card";
import { Badge } from "@/components/ui/badge";
import AnnouncementDetail from "@/components/ui/AnnouncementDetail";

export default function AnnouncementsPage() {
  const { sidebarOpen } = useSidebar();
  const router = useRouter();
  const [announcementsData, setAnnouncementsData] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"date" | "priority" | "title" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [favoriteAnnouncements, setFavoriteAnnouncements] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load announcements and favorites
  useEffect(() => {
    const loadAnnouncements = () => {
      try {
        setAnnouncementsData(announcements);
      } catch (error) {
        console.error("Duyurular yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    const savedFavorites = localStorage.getItem('favoriteAnnouncements');
    if (savedFavorites) {
      setFavoriteAnnouncements(new Set(JSON.parse(savedFavorites)));
    }

    loadAnnouncements();
  }, []);

  // Filter and sort announcements
  const filteredAnnouncements = useMemo(() => {
    let filtered = announcementsData;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(announcement => announcement.category === selectedCategory);
    }

    // Priority filter
    if (selectedPriority !== "all") {
      filtered = filtered.filter(announcement => announcement.priority === selectedPriority);
    }

    // Unread filter
    if (showUnreadOnly) {
      filtered = filtered.filter(announcement => !announcement.isRead);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(announcement =>
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (announcement.tags && announcement.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    // Sort announcements
    filtered.sort((a, b) => {
      // Pinned announcements always come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      let comparison = 0;
      
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "date":
        default:
          comparison = new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered.map(announcement => ({
      ...announcement,
      isFavorite: favoriteAnnouncements.has(announcement.id)
    }));
  }, [announcementsData, selectedCategory, selectedPriority, showUnreadOnly, searchQuery, sortBy, sortOrder, favoriteAnnouncements]);

  const totalUnreadCount = announcementsData.filter(ann => !ann.isRead).length;
  const pinnedCount = announcementsData.filter(ann => ann.isPinned).length;

  const handleMarkAsRead = (announcementId: string) => {
    setAnnouncementsData(prev => prev.map(announcement => 
      announcement.id === announcementId 
        ? { ...announcement, isRead: true }
        : announcement
    ));
  };

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailModal(true);
    if (!announcement.isRead) {
      handleMarkAsRead(announcement.id);
    }
  };

  const toggleFavorite = useCallback((announcementId: string) => {
    setFavoriteAnnouncements(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(announcementId)) {
        newFavorites.delete(announcementId);
      } else {
        newFavorites.add(announcementId);
      }
      
      localStorage.setItem('favoriteAnnouncements', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "general": return <Info className="h-4 w-4" />;
      case "academic": return <Star className="h-4 w-4" />;
      case "event": return <Calendar className="h-4 w-4" />;
      case "urgent": return <AlertCircle className="h-4 w-4" />;
      default: return <Megaphone className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "general": return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      case "academic": return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      case "event": return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
      case "urgent": return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      default: return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50 dark:bg-red-900/20";
      case "medium": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
      case "low": return "text-green-600 bg-green-50 dark:bg-green-900/20";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Megaphone className="h-5 w-5 animate-pulse" />
          Duyurular yükleniyor...
        </div>
      </div>
    );
  }

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
                  <Megaphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Duyurular</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Önemli duyurular ve güncellemeler</p>
                </div>
              </div>
            </div>
            
            {/* Search Bar - Center */}
            <div className="flex-1 max-w-sm mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Duyuru ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm shadow-sm"
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
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tüm Kategoriler</option>
                    <option value="general">Genel</option>
                    <option value="academic">Akademik</option>
                    <option value="event">Etkinlik</option>
                    <option value="urgent">Acil</option>
                  </select>

                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tüm Öncelikler</option>
                    <option value="high">Yüksek</option>
                    <option value="medium">Orta</option>
                    <option value="low">Düşük</option>
                  </select>

                  <label className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showUnreadOnly}
                      onChange={(e) => setShowUnreadOnly(e.target.checked)}
                      className="rounded"
                    />
                    Sadece Okunmamışlar
                  </label>

                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedPriority("all");
                      setShowUnreadOnly(false);
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
                    onChange={(e) => setSortBy(e.target.value as "date" | "priority" | "title" | "category")}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date">Tarih</option>
                    <option value="priority">Öncelik</option>
                    <option value="title">Başlık</option>
                    <option value="category">Kategori</option>
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

      {/* Announcements Grid/List */}
      <div className={`px-4 py-4 pb-16 transition-all duration-300 ${
        isFilterOpen ? 'pt-32' : 'pt-16'
      }`}>
        {filteredAnnouncements.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6" 
            : "space-y-3"
          }>
            {filteredAnnouncements.map((announcement, index) => {
              if (viewMode === "grid") {
                return (
                  <div
                    key={announcement.id}
                    className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleAnnouncementClick(announcement)}
                  >
                    {/* Announcement Header */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${getCategoryColor(announcement.category)}`}>
                            {getCategoryIcon(announcement.category)}
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(announcement.priority)}`}>
                            {announcement.priority === "high" ? "Yüksek" : announcement.priority === "medium" ? "Orta" : "Düşük"}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(announcement.id);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              announcement.isFavorite
                                ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                                : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                            }`}
                          >
                            <Bookmark className={`h-4 w-4 ${announcement.isFavorite ? "fill-current" : ""}`} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
                        {announcement.title}
                      </h3>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {announcement.content}
                      </p>
                    </div>

                    {/* Announcement Info */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <User className="h-3 w-3" />
                        <span className="truncate">{announcement.author.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(announcement.publishDate)}</span>
                      </div>

                      {/* Status Indicator */}
                      <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded-lg ${
                        announcement.isPinned ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400" :
                        !announcement.isRead ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" :
                        "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}>
                        <Clock className="h-3 w-3" />
                        <span>
                          {announcement.isPinned ? "Sabitlenmiş" :
                           !announcement.isRead ? "Okunmamış" : "Okundu"}
                        </span>
                      </div>

                      {/* Attachments */}
                      {announcement.attachments && announcement.attachments.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                          <Download className="h-3 w-3" />
                          <span>{announcement.attachments.length} ek dosya</span>
                        </div>
                      )}

                      {/* Tags */}
                      {announcement.tags && announcement.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {announcement.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                          {announcement.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                              +{announcement.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 pt-0 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnnouncementClick(announcement);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        Görüntüle
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(announcement.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                      >
                        <Bookmark className={`h-4 w-4 ${announcement.isFavorite ? "fill-current" : ""}`} />
                        {announcement.isFavorite ? "Favoriden Çıkar" : "Favoriye Ekle"}
                      </button>
                    </div>
                  </div>
                );
              } else {
                // List view
                return (
                  <div
                    key={announcement.id}
                    className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${getCategoryColor(announcement.category)}`}>
                        {getCategoryIcon(announcement.category)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {announcement.title}
                          </h3>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => toggleFavorite(announcement.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                announcement.isFavorite
                                  ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                                  : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                              }`}
                            >
                              <Bookmark className={`h-4 w-4 ${announcement.isFavorite ? "fill-current" : ""}`} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                          {announcement.content}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {announcement.author.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(announcement.publishDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {announcement.attachments?.length || 0} ek
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(announcement.priority)}`}>
                          {announcement.priority === "high" ? "Yüksek" : 
                           announcement.priority === "medium" ? "Orta" : "Düşük"}
                        </div>
                        <button
                          onClick={() => handleAnnouncementClick(announcement)}
                          className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleFavorite(announcement.id)}
                          className="p-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Bookmark className={`h-4 w-4 ${announcement.isFavorite ? "fill-current" : ""}`} />
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
              <Megaphone className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Duyuru bulunamadı
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Arama kriterlerinize uygun duyuru bulunamadı.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedPriority("all");
                setShowUnreadOnly(false);
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <AnnouncementDetail
          announcement={selectedAnnouncement}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onMarkAsRead={() => handleMarkAsRead(selectedAnnouncement.id)}
          onToggleFavorite={() => toggleFavorite(selectedAnnouncement.id)}
        />
      )}
    </div>
  );
}