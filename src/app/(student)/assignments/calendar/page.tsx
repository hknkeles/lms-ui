"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Search, 
  Filter, 
  X, 
  Maximize, 
  AlertTriangle,
  CheckCircle,
  Circle,
  BookOpen,
  Eye,
  MoreVertical,
  Plus,
  Grid3X3,
  List,
  Bell,
  Flag,
  Target,
  TrendingUp,
  FileText,
  Video,
  Link as LinkIcon,
  Image,
  Zap
} from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { toast } from "sonner";
import { calendarEvents } from "@/data/mock/assignments";

// Use mock data from centralized file
const assignmentEvents = calendarEvents;

const priorityColors = {
  high: "text-red-600 bg-red-50 dark:bg-red-900/20",
  medium: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
  low: "text-green-600 bg-green-50 dark:bg-green-900/20"
};

const typeIcons = {
  assignment: FileText,
  presentation: Video,
  quiz: Target,
  exam: BookOpen
};

export default function AssignmentCalendarPage() {
  const { sidebarOpen } = useSidebar();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("Tümü");
  const [selectedPriority, setSelectedPriority] = useState("Tümü");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [favoriteEvents, setFavoriteEvents] = useState<Set<string>>(new Set());

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteCalendarEvents');
    if (savedFavorites) {
      setFavoriteEvents(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const filteredEvents = useMemo(() => {
    return assignmentEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.teacher.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = selectedCourse === "Tümü" || event.course === selectedCourse;
      const matchesPriority = selectedPriority === "Tümü" || event.priority === selectedPriority;
      
      return matchesSearch && matchesCourse && matchesPriority;
    }).map(event => ({
      ...event,
      isFavorite: favoriteEvents.has(event.id)
    }));
  }, [searchTerm, selectedCourse, selectedPriority, favoriteEvents]);

  const toggleFavorite = useCallback((eventId: string) => {
    setFavoriteEvents(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId);
        toast.success("Favorilerden kaldırıldı");
      } else {
        newFavorites.add(eventId);
        toast.success("Favorilere eklendi");
      }
      
      localStorage.setItem('favoriteCalendarEvents', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(event => event.dueDate === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

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

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month's trailing days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push(
        <div key={`prev-${day}`} className="h-20 p-1 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <span className="text-gray-400 dark:text-gray-500 text-sm">{day}</span>
        </div>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const events = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div 
          key={day} 
          className={`h-20 p-1 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
            isToday ? "bg-blue-50 dark:bg-blue-900/20" : ""
          } ${isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium ${
              isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"
            }`}>
              {day}
            </span>
            {events.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {events.length} ödev
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            {events.slice(0, 2).map(event => {
              const TypeIcon = typeIcons[event.type as keyof typeof typeIcons];
              const urgencyLevel = getUrgencyLevel(event.dueDate, event.priority);
              
              return (
                <div
                  key={event.id}
                  className={`flex items-center gap-1 p-1 rounded text-xs ${
                    urgencyLevel === "overdue" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
                    urgencyLevel === "urgent" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400" :
                    urgencyLevel === "soon" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" :
                    "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <TypeIcon className="h-3 w-3" />
                  <span className="truncate">{event.title}</span>
                </div>
              );
            })}
            {events.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                +{events.length - 2} daha
              </div>
            )}
          </div>
        </div>
      );
    }

    // Next month's leading days
    const totalCells = 42; // 6 weeks * 7 days
    const remainingCells = totalCells - days.length;
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} className="h-20 p-1 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <span className="text-gray-400 dark:text-gray-500 text-sm">{day}</span>
        </div>
      );
    }

    return days;
  };

  // Get unique courses and priorities for filters
  const courses = ["Tümü", ...Array.from(new Set(assignmentEvents.map(event => event.course)))];
  const priorities = ["Tümü", "high", "medium", "low"];

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
                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Ödev Takvimi</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Tüm ödevlerinizi takvimde görün</p>
                </div>
              </div>
            </div>
            
            {/* Calendar Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
                {currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
              </h2>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
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

          {/* Search and Filters - Conditional */}
          {isFilterOpen && (
            <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-lg p-1.5 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ödev ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm shadow-sm"
                    />
                  </div>

                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[120px]"
                  >
                    {courses.map(course => (
                      <option key={course} value={course}>
                        {course === "Tümü" ? "Tüm Dersler" : course}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCourse("Tümü");
                      setSelectedPriority("Tümü");
                    }}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-all duration-200 text-xs font-medium"
                  >
                    <X className="h-3 w-3" />
                    Temizle
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Content */}
      <div className={`px-4 py-4 pb-16 transition-all duration-300 ${
        isFilterOpen ? 'pt-32' : 'pt-16'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section - Left */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {renderCalendarDays()}
              </div>
            </div>
          </div>

          {/* Selected Date Events - Right */}
          <div className="lg:col-span-1">
            {selectedDate ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm h-fit sticky top-20">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedDate.toLocaleDateString('tr-TR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'short'
                    })}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getEventsForDate(selectedDate).length} ödev
                  </p>
                </div>

                <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {getEventsForDate(selectedDate).length > 0 ? (
                    <div className="space-y-3">
                      {getEventsForDate(selectedDate).map(event => {
                        const TypeIcon = typeIcons[event.type as keyof typeof typeIcons];
                        const daysUntilDue = getDaysUntilDue(event.dueDate);
                        const urgencyLevel = getUrgencyLevel(event.dueDate, event.priority);
                        
                        return (
                          <div
                            key={event.id}
                            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${event.color} text-white`}>
                                  <TypeIcon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                                    {event.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                                    {event.course}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => toggleFavorite(event.id)}
                                  className={`p-1 rounded-lg transition-colors ${
                                    event.isFavorite
                                      ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                                      : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                                  }`}
                                >
                                  <Flag className={`h-3 w-3 ${event.isFavorite ? "fill-current" : ""}`} />
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {event.description}
                            </p>

                            <div className="space-y-2">
                              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {event.dueTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  {event.points}p
                                </span>
                              </div>

                              <div className={`px-2 py-1 rounded-full text-xs font-medium text-center ${
                                urgencyLevel === "overdue" ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400" :
                                urgencyLevel === "urgent" ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400" :
                                urgencyLevel === "soon" ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400" :
                                "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                              }`}>
                                {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} gün gecikti` :
                                 daysUntilDue === 0 ? "Bugün teslim" :
                                 daysUntilDue === 1 ? "Yarın teslim" :
                                 `${daysUntilDue} gün kaldı`}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Bu tarihte ödev bulunmuyor
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm h-fit sticky top-20">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Ödev Detayları
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bir tarih seçin
                  </p>
                </div>

                <div className="p-4 text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Ödev detaylarını görmek için takvimden bir tarih seçin
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
