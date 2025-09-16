"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Filter, 
  X, 
  ChevronLeft, 
  Maximize, 
  AlertTriangle,
  CheckCircle,
  Circle,
  BookOpen,
  Upload,
  Eye,
  Edit,
  MoreVertical,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Bell,
  Flag,
  Target,
  TrendingUp
} from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { toast } from "sonner";

import { pendingAssignments } from "@/data/mock/assignments";

// Use mock data from centralized file
const assignments = pendingAssignments;

const statusColors = {
  pending: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
  in_progress: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  completed: "text-green-600 bg-green-50 dark:bg-green-900/20",
  overdue: "text-red-600 bg-red-50 dark:bg-red-900/20"
};

const priorityColors = {
  high: "text-red-600 bg-red-50 dark:bg-red-900/20",
  medium: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
  low: "text-green-600 bg-green-50 dark:bg-green-900/20"
};

const submissionTypeIcons = {
  file: FileText,
  text: Edit,
  presentation: Eye
};

export default function AssignmentsPage() {
  const { sidebarOpen } = useSidebar();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tümü");
  const [selectedPriority, setSelectedPriority] = useState("Tümü");
  const [selectedCourse, setSelectedCourse] = useState("Tümü");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "progress" | "title">("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [favoriteAssignments, setFavoriteAssignments] = useState<Set<string>>(new Set());

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteAssignments');
    if (savedFavorites) {
      setFavoriteAssignments(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const filteredAssignments = useMemo(() => {
    let filtered = assignments.filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.teacher.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "Tümü" || assignment.status === selectedStatus;
      const matchesPriority = selectedPriority === "Tümü" || assignment.priority === selectedPriority;
      const matchesCourse = selectedCourse === "Tümü" || assignment.course === selectedCourse;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCourse;
    });

    // Sort assignments
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case "progress":
          comparison = a.progress - b.progress;
          break;
        case "dueDate":
        default:
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered.map(assignment => ({
      ...assignment,
      isFavorite: favoriteAssignments.has(assignment.id)
    }));
  }, [searchTerm, selectedStatus, selectedPriority, selectedCourse, sortBy, sortOrder, favoriteAssignments]);

  const toggleFavorite = useCallback((assignmentId: string) => {
    setFavoriteAssignments(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(assignmentId)) {
        newFavorites.delete(assignmentId);
        toast.success("Favorilerden kaldırıldı");
      } else {
        newFavorites.add(assignmentId);
        toast.success("Favorilere eklendi");
      }
      
      localStorage.setItem('favoriteAssignments', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  }, []);

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyLevel = (dueDate: string, priority: string) => {
    const days = getDaysUntilDue(dueDate);
    if (days < 0) return "overdue";
    if (days <= 1 && priority === "high") return "urgent";
    if (days <= 3) return "soon";
    return "normal";
  };

  // Get unique courses, statuses, and priorities for filters
  const courses = ["Tümü", ...Array.from(new Set(assignments.map(assignment => assignment.course)))];
  const statuses = ["Tümü", "pending", "in_progress", "completed", "overdue"];
  const priorities = ["Tümü", "high", "medium", "low"];

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
                <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Yaklaşan Ödevler</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Tüm ödevlerinizi ve teslim tarihlerini takip edin</p>
                </div>
              </div>
            </div>
            
            {/* Search Bar - Center */}
            <div className="flex-1 max-w-sm mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ödev ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm shadow-sm"
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
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === "Tümü" ? "Tüm Durumlar" : 
                         status === "pending" ? "Bekleyen" :
                         status === "in_progress" ? "Devam Eden" :
                         status === "completed" ? "Tamamlanan" :
                         status === "overdue" ? "Geciken" : status}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority === "Tümü" ? "Tüm Öncelikler" : 
                         priority === "high" ? "Yüksek" :
                         priority === "medium" ? "Orta" :
                         priority === "low" ? "Düşük" : priority}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:border-transparent min-w-[120px]"
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
                      setSelectedStatus("Tümü");
                      setSelectedPriority("Tümü");
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
                    onChange={(e) => setSortBy(e.target.value as "dueDate" | "priority" | "progress" | "title")}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="dueDate">Teslim Tarihi</option>
                    <option value="priority">Öncelik</option>
                    <option value="progress">İlerleme</option>
                    <option value="title">Başlık</option>
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

      {/* Assignments Grid/List */}
      <div className={`px-4 py-4 pb-16 transition-all duration-300 ${
        isFilterOpen ? 'pt-32' : 'pt-16'
      }`}>
        {filteredAssignments.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6" 
            : "space-y-3"
          }>
            {filteredAssignments.map((assignment, index) => {
              const daysUntilDue = getDaysUntilDue(assignment.dueDate);
              const urgencyLevel = getUrgencyLevel(assignment.dueDate, assignment.priority);
              const SubmissionIcon = submissionTypeIcons[assignment.submissionType as keyof typeof submissionTypeIcons];
              
              if (viewMode === "grid") {
                return (
                  <div
                    key={assignment.id}
                    className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Assignment Header */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${statusColors[assignment.status as keyof typeof statusColors]}`}>
                            <SubmissionIcon className="h-5 w-5" />
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[assignment.priority as keyof typeof priorityColors]}`}>
                            {assignment.priority === "high" ? "Yüksek" : 
                             assignment.priority === "medium" ? "Orta" : "Düşük"}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleFavorite(assignment.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              assignment.isFavorite
                                ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                                : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                            }`}
                          >
                            <Flag className={`h-4 w-4 ${assignment.isFavorite ? "fill-current" : ""}`} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
                        {assignment.title}
                      </h3>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {assignment.description}
                      </p>
                    </div>

                    {/* Assignment Info */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <BookOpen className="h-3 w-3" />
                        <span className="truncate">{assignment.course}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <User className="h-3 w-3" />
                        <span className="truncate">{assignment.teacher}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(assignment.dueDate).toLocaleDateString('tr-TR')} - {assignment.dueTime}</span>
                      </div>

                      {/* Urgency Indicator */}
                      <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded-lg ${
                        urgencyLevel === "overdue" ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400" :
                        urgencyLevel === "urgent" ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400" :
                        urgencyLevel === "soon" ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400" :
                        "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}>
                        <Clock className="h-3 w-3" />
                        <span>
                          {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} gün gecikti` :
                           daysUntilDue === 0 ? "Bugün teslim" :
                           daysUntilDue === 1 ? "Yarın teslim" :
                           `${daysUntilDue} gün kaldı`}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      {assignment.status !== "completed" && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>İlerleme</span>
                            <span>{assignment.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${assignment.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Points and Time */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {assignment.points} puan
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {assignment.estimatedTime}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 pt-0 flex gap-2">
                      <button
                        onClick={() => toast.info(`${assignment.title} açılıyor...`)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        Görüntüle
                      </button>
                      <button
                        onClick={() => toast.info(`${assignment.title} düzenleniyor...`)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                      >
                        <Edit className="h-4 w-4" />
                        Düzenle
                      </button>
                    </div>
                  </div>
                );
              } else {
                // List view
                return (
                  <div
                    key={assignment.id}
                    className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${statusColors[assignment.status as keyof typeof statusColors]}`}>
                        <SubmissionIcon className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {assignment.title}
                          </h3>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => toggleFavorite(assignment.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                assignment.isFavorite
                                  ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                                  : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                              }`}
                            >
                              <Flag className={`h-4 w-4 ${assignment.isFavorite ? "fill-current" : ""}`} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                          {assignment.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {assignment.course}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {assignment.teacher}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(assignment.dueDate).toLocaleDateString('tr-TR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {assignment.points} puan
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[assignment.priority as keyof typeof priorityColors]}`}>
                          {assignment.priority === "high" ? "Yüksek" : 
                           assignment.priority === "medium" ? "Orta" : "Düşük"}
                        </div>
                        <button
                          onClick={() => toast.info(`${assignment.title} açılıyor...`)}
                          className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toast.info(`${assignment.title} düzenleniyor...`)}
                          className="p-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
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
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ödev bulunamadı
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Arama kriterlerinize uygun ödev bulunamadı.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("Tümü");
                setSelectedPriority("Tümü");
                setSelectedCourse("Tümü");
              }}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}