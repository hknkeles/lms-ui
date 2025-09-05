"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Clock, 
  BookOpen, 
  Award, 
  Star, 
  Users, 
  Calendar, 
  User, 
  Heart, 
  Download, 
  Share2, 
  MessageCircle, 
  CheckCircle, 
  Circle, 
  ChevronRight, 
  ChevronDown,
  Video,
  FileText,
  Image,
  Link,
  BarChart3,
  Target,
  Trophy,
  Bookmark,
  Settings,
  Bell,
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Zap,
  TrendingUp,
  Activity,
  Brain,
  Lightbulb,
  Code,
  Database,
  Globe,
  Smartphone,
  Monitor,
  Headphones,
  Mic,
  Camera,
  Wifi,
  WifiOff
} from "lucide-react";

// Mock data - gerçek uygulamada API'den gelecek
const courseData = {
  "web-gelistirme-101": {
    id: "c1",
    title: "Web Geliştirme 101",
    teacher: "Dr. Ayşe Yılmaz",
    teacherAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    progress: 45,
    slug: "web-gelistirme-101",
    category: "Bilgisayar",
    duration: "12 hafta",
    level: "Başlangıç",
    status: "aktif",
    description: "Modern web geliştirme teknolojilerini öğrenin. HTML, CSS, JavaScript ve React ile profesyonel web uygulamaları geliştirin.",
    longDescription: "Bu kapsamlı web geliştirme kursunda, sıfırdan başlayarak modern web teknolojilerini öğreneceksiniz. HTML5, CSS3, JavaScript ES6+ ve React.js kullanarak responsive ve interaktif web uygulamaları geliştirmeyi öğreneceksiniz. Kurs boyunca gerçek projeler üzerinde çalışacak ve portföyünüzü oluşturacaksınız.",
    rating: 4.8,
    studentCount: 1250,
    lastUpdated: "2 saat önce",
    isFavorite: true,
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop&crop=center",
    color: "from-blue-500 via-purple-600 to-indigo-700",
    modules: [
      {
        id: "m1",
        title: "HTML Temelleri",
        description: "HTML5 yapısı ve semantik elementler",
        duration: "2 saat",
        progress: 100,
        isCompleted: true,
        lessons: [
          { id: "l1", title: "HTML Giriş", duration: "15 dk", isCompleted: true, type: "video" },
          { id: "l2", title: "Semantik HTML", duration: "25 dk", isCompleted: true, type: "video" },
          { id: "l3", title: "Form Elementleri", duration: "20 dk", isCompleted: true, type: "video" },
          { id: "l4", title: "HTML Quiz", duration: "10 dk", isCompleted: true, type: "quiz" }
        ]
      },
      {
        id: "m2",
        title: "CSS Styling",
        description: "CSS3 ile modern tasarım teknikleri",
        duration: "3 saat",
        progress: 75,
        isCompleted: false,
        lessons: [
          { id: "l5", title: "CSS Temelleri", duration: "20 dk", isCompleted: true, type: "video" },
          { id: "l6", title: "Flexbox Layout", duration: "30 dk", isCompleted: true, type: "video" },
          { id: "l7", title: "Grid Layout", duration: "35 dk", isCompleted: true, type: "video" },
          { id: "l8", title: "CSS Animasyonlar", duration: "25 dk", isCompleted: false, type: "video" },
          { id: "l9", title: "Responsive Design", duration: "40 dk", isCompleted: false, type: "video" },
          { id: "l10", title: "CSS Quiz", duration: "15 dk", isCompleted: false, type: "quiz" }
        ]
      },
      {
        id: "m3",
        title: "JavaScript Fundamentals",
        description: "Modern JavaScript programlama",
        duration: "4 saat",
        progress: 30,
        isCompleted: false,
        lessons: [
          { id: "l11", title: "JavaScript Giriş", duration: "25 dk", isCompleted: true, type: "video" },
          { id: "l12", title: "Variables ve Functions", duration: "30 dk", isCompleted: true, type: "video" },
          { id: "l13", title: "DOM Manipulation", duration: "35 dk", isCompleted: false, type: "video" },
          { id: "l14", title: "Event Handling", duration: "30 dk", isCompleted: false, type: "video" },
          { id: "l15", title: "Async JavaScript", duration: "40 dk", isCompleted: false, type: "video" },
          { id: "l16", title: "JavaScript Quiz", duration: "20 dk", isCompleted: false, type: "quiz" }
        ]
      },
      {
        id: "m4",
        title: "React.js Giriş",
        description: "React ile component-based development",
        duration: "5 saat",
        progress: 0,
        isCompleted: false,
        isLocked: true,
        lessons: [
          { id: "l17", title: "React Temelleri", duration: "30 dk", isCompleted: false, type: "video" },
          { id: "l18", title: "Components ve Props", duration: "35 dk", isCompleted: false, type: "video" },
          { id: "l19", title: "State Management", duration: "40 dk", isCompleted: false, type: "video" },
          { id: "l20", title: "React Hooks", duration: "45 dk", isCompleted: false, type: "video" },
          { id: "l21", title: "React Quiz", duration: "25 dk", isCompleted: false, type: "quiz" }
        ]
      }
    ],
    resources: [
      { id: "r1", title: "HTML5 Cheat Sheet", type: "pdf", size: "2.3 MB", downloads: 1250 },
      { id: "r2", title: "CSS Grid Layout Guide", type: "pdf", size: "1.8 MB", downloads: 980 },
      { id: "r3", title: "JavaScript ES6+ Features", type: "pdf", size: "3.1 MB", downloads: 1100 },
      { id: "r4", title: "React Component Examples", type: "zip", size: "5.2 MB", downloads: 750 }
    ],
    assignments: [
      { id: "a1", title: "HTML Portfolio Sayfası", dueDate: "2024-01-15", status: "completed", grade: 95 },
      { id: "a2", title: "CSS Responsive Layout", dueDate: "2024-01-22", status: "submitted", grade: null },
      { id: "a3", title: "JavaScript Calculator", dueDate: "2024-01-29", status: "pending", grade: null }
    ],
    discussions: [
      { id: "d1", title: "CSS Grid vs Flexbox ne zaman kullanmalı?", author: "Mehmet K.", replies: 12, lastActivity: "2 saat önce" },
      { id: "d2", title: "JavaScript async/await kullanımı", author: "Ayşe Y.", replies: 8, lastActivity: "5 saat önce" },
      { id: "d3", title: "React hooks best practices", author: "Can D.", replies: 15, lastActivity: "1 gün önce" }
    ]
  }
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedModules, setExpandedModules] = useState<string[]>(["m1", "m2"]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    const courseSlug = params.slug as string;
    const courseInfo = courseData[courseSlug as keyof typeof courseData];
    if (courseInfo) {
      setCourse(courseInfo);
      setIsFavorite(courseInfo.isFavorite);
    }
  }, [params.slug]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Ders yükleniyor...</p>
        </div>
      </div>
    );
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "quiz": return <Target className="h-4 w-4" />;
      case "assignment": return <FileText className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="h-5 w-5 text-red-500" />;
      case "zip": return <Download className="h-5 w-5 text-blue-500" />;
      case "image": return <Image className="h-5 w-5 text-green-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={course.coverImage} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/80 mb-6">
              <button 
                onClick={() => router.push('/courses')}
                className="hover:text-white transition-colors"
              >
                Dersler
              </button>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{course.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 bg-gradient-to-br ${course.color} rounded-2xl shadow-lg`}>
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/30">
                        {course.category}
                      </span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/30">
                        {course.level}
                      </span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                      {course.title}
                    </h1>
                    <p className="text-xl text-white/90 mb-6 max-w-2xl">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-white/80" />
                      <div>
                        <p className="text-white/60 text-sm">Öğrenci</p>
                        <p className="text-white font-semibold">{course.studentCount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="text-white/60 text-sm">Puan</p>
                        <p className="text-white font-semibold">{course.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-white/80" />
                      <div>
                        <p className="text-white/60 text-sm">Süre</p>
                        <p className="text-white font-semibold">{course.duration}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-white/60 text-sm">İlerleme</p>
                        <p className="text-white font-semibold">{course.progress}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                  {/* Teacher Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={course.teacherAvatar} 
                      alt={course.teacher}
                      className="w-12 h-12 rounded-full border-2 border-white/30"
                    />
                    <div>
                      <p className="text-white/60 text-sm">Öğretmen</p>
                      <p className="text-white font-semibold">{course.teacher}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80 text-sm">İlerleme</span>
                      <span className="text-white font-semibold">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg">
                      <Play className="h-5 w-5" />
                      {course.progress === 100 ? "Tekrar İzle" : "Devam Et"}
                    </button>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                          isFavorite 
                            ? "bg-red-500 hover:bg-red-600 text-white" 
                            : "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                        {isFavorite ? "Favori" : "Favorile"}
                      </button>
                      
                      <button className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 border border-white/30">
                        <Share2 className="h-5 w-5" />
                        Paylaş
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Tabs */}
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "overview", label: "Genel Bakış", icon: Eye },
              { id: "modules", label: "Modüller", icon: BookOpen },
              { id: "resources", label: "Kaynaklar", icon: Download },
              { id: "assignments", label: "Ödevler", icon: FileText },
              { id: "discussions", label: "Tartışmalar", icon: MessageCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-gray-700/10"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Kurs Hakkında</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {course.longDescription}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-600/30">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Öğrenecekleriniz
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Modern HTML5 ve CSS3 teknikleri
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      JavaScript ES6+ özellikleri
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      React.js ile component geliştirme
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Responsive web tasarım
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-600/30">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    Kurs İstatistikleri
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Toplam Ders</span>
                      <span className="font-semibold text-gray-900 dark:text-white">21</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Video Süresi</span>
                      <span className="font-semibold text-gray-900 dark:text-white">14 saat</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Quiz Sayısı</span>
                      <span className="font-semibold text-gray-900 dark:text-white">4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Proje</span>
                      <span className="font-semibold text-gray-900 dark:text-white">3</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "modules" && (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {course.modules.map((module: any, index: number) => (
                <div
                  key={module.id}
                  className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
                >
                  <div
                    className="p-6 cursor-pointer hover:bg-white/10 dark:hover:bg-gray-700/10 transition-colors"
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {expandedModules.includes(module.id) ? (
                            <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          )}
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {module.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {module.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{module.duration}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {module.progress}% tamamlandı
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {module.isLocked ? (
                            <Lock className="h-5 w-5 text-gray-400" />
                          ) : module.isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedModules.includes(module.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/20 dark:border-gray-700/30"
                      >
                        <div className="p-6 pt-0">
                          <div className="space-y-3">
                            {module.lessons.map((lesson: any) => (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 dark:hover:bg-gray-700/10 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  {lesson.isCompleted ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-gray-400" />
                                  )}
                                  {getLessonIcon(lesson.type)}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {lesson.title}
                                  </h4>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {lesson.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "resources" && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Kurs Kaynakları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.resources.map((resource: any) => (
                  <div
                    key={resource.id}
                    className="flex items-center gap-4 p-4 bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-600/30 hover:bg-white/20 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                  >
                    {getResourceIcon(resource.type)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {resource.size} • {resource.downloads} indirme
                      </p>
                    </div>
                    <Download className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "assignments" && (
            <motion.div
              key="assignments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ödevler</h2>
              <div className="space-y-4">
                {course.assignments.map((assignment: any) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-600/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        assignment.status === "completed" 
                          ? "bg-green-100 dark:bg-green-900/30" 
                          : assignment.status === "submitted"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "bg-gray-100 dark:bg-gray-700/50"
                      }`}>
                        {assignment.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : assignment.status === "submitted" ? (
                          <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Teslim: {new Date(assignment.dueDate).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {assignment.grade ? (
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {assignment.grade}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {assignment.status === "completed" ? "Tamamlandı" : 
                           assignment.status === "submitted" ? "Değerlendiriliyor" : "Bekliyor"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "discussions" && (
            <motion.div
              key="discussions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tartışmalar</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors">
                  Yeni Konu
                </button>
              </div>
              <div className="space-y-4">
                {course.discussions.map((discussion: any) => (
                  <div
                    key={discussion.id}
                    className="p-4 bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-600/30 hover:bg-white/20 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      {discussion.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>👤 {discussion.author}</span>
                      <span>💬 {discussion.replies} yanıt</span>
                      <span>🕒 {discussion.lastActivity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
