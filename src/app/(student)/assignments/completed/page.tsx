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
  CheckCircle,
  Star,
  BookOpen,
  Eye,
  Download,
  MoreVertical,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Award,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  Target,
  Trophy,
  Medal,
  Crown
} from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { toast } from "sonner";
import { completedAssignments } from "@/data/mock/assignments";

const gradeLevelColors = {
  excellent: "text-green-600 bg-green-50 dark:bg-green-900/20",
  good: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  average: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
  poor: "text-red-600 bg-red-50 dark:bg-red-900/20"
};

const gradeLevelIcons = {
  excellent: Crown,
  good: Trophy,
  average: Medal,
  poor: AlertCircle
};

const submissionTypeIcons = {
  file: FileText,
  text: FileText,
  presentation: Eye
};

export default function CompletedAssignmentsPage() {
  const { sidebarOpen } = useSidebar();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGradeLevel, setSelectedGradeLevel] = useState("Tümü");
  const [selectedCourse, setSelectedCourse] = useState("Tümü");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"grade" | "submittedDate" | "title">("submittedDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [favoriteAssignments, setFavoriteAssignments] = useState<Set<string>>(new Set());
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteCompletedAssignments');
    if (savedFavorites) {
      setFavoriteAssignments(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const filteredAssignments = useMemo(() => {
    let filtered = completedAssignments.filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.teacher.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGradeLevel = selectedGradeLevel === "Tümü" || assignment.gradeLevel === selectedGradeLevel;
      const matchesCourse = selectedCourse === "Tümü" || assignment.course === selectedCourse;
      
      return matchesSearch && matchesGradeLevel && matchesCourse;
    });

    // Sort assignments
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "grade":
          comparison = a.grade - b.grade;
          break;
        case "submittedDate":
        default:
          comparison = new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered.map(assignment => ({
      ...assignment,
      isFavorite: favoriteAssignments.has(assignment.id)
    }));
  }, [searchTerm, selectedGradeLevel, selectedCourse, sortBy, sortOrder, favoriteAssignments]);

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
      
      localStorage.setItem('favoriteCompletedAssignments', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  }, []);

  const getGradePercentage = (grade: number, maxGrade: number) => {
    return Math.round((grade / maxGrade) * 100);
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  // Get unique courses and grade levels for filters
  const courses = ["Tümü", ...Array.from(new Set(completedAssignments.map(assignment => assignment.course)))];
  const gradeLevels = ["Tümü", "excellent", "good", "average", "poor"];

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
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tamamlanan Ödevler</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Tamamladığınız ödevler ve notlarınız</p>
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
                    value={selectedGradeLevel}
                    onChange={(e) => setSelectedGradeLevel(e.target.value)}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {gradeLevels.map(level => (
                      <option key={level} value={level}>
                        {level === "Tümü" ? "Tüm Notlar" : 
                         level === "excellent" ? "Mükemmel (90-100)" :
                         level === "good" ? "İyi (80-89)" :
                         level === "average" ? "Orta (70-79)" :
                         level === "poor" ? "Zayıf (0-69)" : level}
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
                      setSelectedGradeLevel("Tümü");
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
                    onChange={(e) => setSortBy(e.target.value as "grade" | "submittedDate" | "title")}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="submittedDate">Teslim Tarihi</option>
                    <option value="grade">Not</option>
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
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-3"
          }>
            {filteredAssignments.map((assignment, index) => {
              const gradePercentage = getGradePercentage(assignment.grade, assignment.maxGrade);
              const GradeIcon = gradeLevelIcons[assignment.gradeLevel as keyof typeof gradeLevelIcons];
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
                          <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${gradeLevelColors[assignment.gradeLevel as keyof typeof gradeLevelColors]}`}>
                            <div className="flex items-center gap-1">
                              <GradeIcon className="h-3 w-3" />
                              {assignment.gradeLevel === "excellent" ? "Mükemmel" : 
                               assignment.gradeLevel === "good" ? "İyi" :
                               assignment.gradeLevel === "average" ? "Orta" : "Zayıf"}
                            </div>
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
                            <Star className={`h-4 w-4 ${assignment.isFavorite ? "fill-current" : ""}`} />
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
                        {assignment.feedback}
                      </p>
                    </div>

                    {/* Grade Display */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Not</span>
                        </div>
                        <div className={`text-lg font-bold ${getGradeColor(gradePercentage)}`}>
                          {assignment.grade}/{assignment.maxGrade}
                        </div>
                      </div>

                      {/* Grade Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            gradePercentage >= 90 ? "bg-green-500" :
                            gradePercentage >= 80 ? "bg-blue-500" :
                            gradePercentage >= 70 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${gradePercentage}%` }}
                        ></div>
                      </div>

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
                        <span>Teslim: {new Date(assignment.submittedDate).toLocaleDateString('tr-TR')}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Target className="h-3 w-3" />
                        <span>{assignment.points} puan</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 pt-0 flex gap-2">
                      <button
                        onClick={() => setShowFeedback(assignment.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Geri Bildirim
                      </button>
                      <button
                        onClick={() => toast.info(`${assignment.title} indiriliyor...`)}
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
                    key={assignment.id}
                    className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
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
                              <Star className={`h-4 w-4 ${assignment.isFavorite ? "fill-current" : ""}`} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                          {assignment.feedback}
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
                            {new Date(assignment.submittedDate).toLocaleDateString('tr-TR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {assignment.points} puan
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getGradeColor(gradePercentage)}`}>
                            {assignment.grade}/{assignment.maxGrade}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {gradePercentage}%
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowFeedback(assignment.id)}
                            className="p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toast.info(`${assignment.title} indiriliyor...`)}
                            className="p-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
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
              <CheckCircle className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tamamlanan ödev bulunamadı
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Arama kriterlerinize uygun tamamlanan ödev bulunamadı.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedGradeLevel("Tümü");
                setSelectedCourse("Tümü");
              }}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedback && (() => {
        const assignment = completedAssignments.find(a => a.id === showFeedback);
        if (!assignment) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {assignment.course} - {assignment.teacher}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFeedback(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Grade Summary */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Not</span>
                    <span className={`text-2xl font-bold ${getGradeColor(getGradePercentage(assignment.grade, assignment.maxGrade))}`}>
                      {assignment.grade}/{assignment.maxGrade}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        getGradePercentage(assignment.grade, assignment.maxGrade) >= 90 ? "bg-green-500" :
                        getGradePercentage(assignment.grade, assignment.maxGrade) >= 80 ? "bg-blue-500" :
                        getGradePercentage(assignment.grade, assignment.maxGrade) >= 70 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${getGradePercentage(assignment.grade, assignment.maxGrade)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Feedback */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Öğretmen Geri Bildirimi</h4>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{assignment.feedback}</p>
                  </div>
                </div>

                {/* Teacher Comment */}
                {assignment.teacherComment && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Öğretmen Yorumu</h4>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{assignment.teacherComment}</p>
                    </div>
                  </div>
                )}

                {/* Rubric */}
                {assignment.rubric && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Değerlendirme Kriterleri</h4>
                    <div className="space-y-2">
                      {assignment.rubric.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.criteria}</span>
                            {item.comment && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.comment}</p>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.score}/{item.maxScore}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assignment Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Teslim Tarihi:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(assignment.submittedDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Harcanan Süre:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{assignment.timeSpent}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <button
                  onClick={() => toast.info(`${assignment.title} indiriliyor...`)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  İndir
                </button>
                <button
                  onClick={() => setShowFeedback(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}