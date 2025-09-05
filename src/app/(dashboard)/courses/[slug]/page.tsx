"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileText, CheckCircle, Play, Link as LinkIcon, Code, ChevronUp, ChevronDown, BookOpen, Menu, StickyNote, Maximize } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "next/navigation";

// Her ders için ayrı mock veri setleri
const courseData = {
  tarih: {
    courseTitle: "Tarih",
    lessonTitle: "Osmanlı Tarihi",
    lessonType: "Video",
    description: "Osmanlı İmparatorluğu'nun kuruluşu ve gelişimi",
    progress: 45,
    modules: [
      {
        id: "osmanli-kurulus",
        title: "Osmanlı Kuruluş Dönemi",
        completed: 3,
        total: 4,
        isExpanded: true,
        lessons: [
          {
            id: "osman-bey",
            title: "Osman Bey Dönemi",
            type: "Video",
            duration: "18:30",
            isCompleted: true,
            isActive: false,
            description: "Osman Bey'in hayatı ve devlet kurma süreci",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          },
          {
            id: "orhan-bey",
            title: "Orhan Bey Dönemi",
            type: "Video",
            duration: "25:15",
            isCompleted: true,
            isActive: false,
            description: "Orhan Bey döneminde devletin genişlemesi",
            videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw"
          },
          {
            id: "murat-hudavendigar",
            title: "I. Murat Dönemi",
            type: "Video",
            duration: "22:45",
            isCompleted: true,
            isActive: false,
            description: "I. Murat'ın Balkanlardaki fetihleri",
            videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE"
          },
          {
            id: "yildirim-bayezid",
            title: "Yıldırım Bayezid Dönemi",
            type: "Video",
            duration: "28:20",
            isCompleted: false,
            isActive: true,
            description: "Yıldırım Bayezid'in hükümdarlığı ve Ankara Savaşı",
            videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0"
          }
        ]
      }
    ],
    courseInfo: {
      language: "TR",
      title: "Tarih",
      isCertified: true,
      instructor: {
        name: "Prof. Dr. Mehmet Özkan",
        role: "Tarih Profesörü"
      }
    }
  },
  matematik: {
    courseTitle: "Matematik",
    lessonTitle: "Türev ve İntegral",
    lessonType: "Video",
    description: "Türev ve integral konularının temel kavramları",
    progress: 12,
    modules: [
      {
        id: "turev-temelleri",
        title: "Türev Temelleri",
        completed: 2,
        total: 5,
        isExpanded: true,
        lessons: [
          {
            id: "turev-tanimi",
            title: "Türev Tanımı",
            type: "Video",
            duration: "20:10",
            isCompleted: true,
            isActive: false,
            description: "Türev kavramı ve geometrik anlamı",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          },
          {
            id: "turev-kurallari",
            title: "Türev Kuralları",
            type: "Video",
            duration: "26:30",
            isCompleted: true,
            isActive: false,
            description: "Temel türev kuralları ve formüller",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          },
          {
            id: "turev-uygulamalari",
            title: "Türev Uygulamaları",
            type: "Video",
            duration: "32:15",
            isCompleted: false,
            isActive: true,
            description: "Maksimum-minimum problemleri",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          }
        ]
      }
    ],
    courseInfo: {
      language: "TR",
      title: "Matematik",
      isCertified: true,
      instructor: {
        name: "Prof. Dr. Ahmet Yılmaz",
        role: "Matematik Profesörü"
      }
    }
  },
  kimya: {
    courseTitle: "Kimya",
    lessonTitle: "Atom Teorisi",
    lessonType: "Video",
    description: "Atom yapısı ve periyodik tablo",
    progress: 78,
    modules: [
      {
        id: "atom-yapisi",
        title: "Atom Yapısı",
        completed: 4,
        total: 5,
        isExpanded: true,
        lessons: [
          {
            id: "atom-modelleri",
            title: "Atom Modelleri",
            type: "Video",
            duration: "24:15",
            isCompleted: true,
            isActive: false,
            description: "Dalton, Thomson, Rutherford atom modelleri",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          },
          {
            id: "elektron-dagilimi",
            title: "Elektron Dağılımı",
            type: "Video",
            duration: "30:20",
            isCompleted: true,
            isActive: false,
            description: "Elektron kabukları ve orbital kavramı",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          },
          {
            id: "periyodik-tablo",
            title: "Periyodik Tablo",
            type: "Video",
            duration: "33:45",
            isCompleted: true,
            isActive: false,
            description: "Periyodik tablo ve element özellikleri",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          },
          {
            id: "kimyasal-baglar",
            title: "Kimyasal Bağlar",
            type: "Video",
            duration: "27:30",
            isCompleted: true,
            isActive: false,
            description: "İyonik, kovalent ve metalik bağlar",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          },
          {
            id: "molekul-geometrisi",
            title: "Molekül Geometrisi",
            type: "Video",
            duration: "31:15",
            isCompleted: false,
            isActive: true,
            description: "VSEPR teorisi ve molekül şekilleri",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          }
        ]
      }
    ],
    courseInfo: {
      language: "TR",
      title: "Kimya",
      isCertified: true,
      instructor: {
        name: "Dr. Ayşe Demir",
        role: "Kimya Doçenti"
      }
    }
  },
  biyoloji: {
    courseTitle: "Biyoloji",
    lessonTitle: "Hücre Yapısı",
    lessonType: "Video",
    description: "Hücre organelleri ve işlevleri",
    progress: 75,
    modules: [
      {
        id: "hucre-organelleri",
        title: "Hücre Organelleri",
        completed: 3,
        total: 4,
        isExpanded: true,
        lessons: [
          {
            id: "hucre-zari",
            title: "Hücre Zarı",
            type: "Video",
            duration: "26:40",
            isCompleted: true,
            isActive: false,
            description: "Hücre zarının yapısı ve işlevleri",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          },
          {
            id: "mitokondri",
            title: "Mitokondri",
            type: "Video",
            duration: "29:25",
            isCompleted: true,
            isActive: false,
            description: "Mitokondri yapısı ve enerji üretimi",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          },
          {
            id: "ribozom",
            title: "Ribozom",
            type: "Video",
            duration: "34:10",
            isCompleted: true,
            isActive: false,
            description: "Ribozom yapısı ve protein sentezi",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          },
          {
            id: "golgi-cisimcigi",
            title: "Golgi Cisimciği",
            type: "Video",
            duration: "28:30",
            isCompleted: false,
            isActive: true,
            description: "Golgi cisimciğinin yapısı ve işlevleri",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          }
        ]
      }
    ],
    courseInfo: {
      language: "TR",
      title: "Biyoloji",
      isCertified: true,
      instructor: {
        name: "Prof. Dr. Fatma Kaya",
        role: "Biyoloji Profesörü"
      }
    }
  },
  ingilizce: {
    courseTitle: "İngilizce",
    lessonTitle: "Grammar Basics",
    lessonType: "Video",
    description: "Temel İngilizce gramer kuralları",
    progress: 60,
    modules: [
      {
        id: "temel-gramer",
        title: "Temel Gramer",
        completed: 2,
        total: 3,
        isExpanded: true,
        lessons: [
          {
            id: "verb-to-be",
            title: "Verb to Be",
            type: "Video",
            duration: "37:20",
            isCompleted: true,
            isActive: false,
            description: "Am, is, are kullanımı ve örnekler",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          },
          {
            id: "present-simple",
            title: "Present Simple",
            type: "Video",
            duration: "41:15",
            isCompleted: true,
            isActive: false,
            description: "Geniş zaman kullanımı ve kuralları",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          },
          {
            id: "past-simple",
            title: "Past Simple",
            type: "Video",
            duration: "22:45",
            isCompleted: false,
            isActive: true,
            description: "Geçmiş zaman ve düzensiz fiiller",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          }
        ]
      }
    ],
    courseInfo: {
      language: "TR",
      title: "İngilizce",
      isCertified: true,
      instructor: {
        name: "Dr. Sarah Johnson",
        role: "İngilizce Öğretmeni"
      }
    }
  },
  geometri: {
    courseTitle: "Geometri",
    lessonTitle: "Üçgenler",
    lessonType: "Video",
    description: "Üçgen çeşitleri ve özellikleri",
    progress: 90,
    modules: [
      {
        id: "ucgen-cesitleri",
        title: "Üçgen Çeşitleri",
        completed: 4,
        total: 4,
        isExpanded: true,
        lessons: [
          {
            id: "eskenar-ucgen",
            title: "Eşkenar Üçgen",
            type: "Video",
            duration: "37:20",
            isCompleted: true,
            isActive: false,
            description: "Eşkenar üçgen özellikleri ve alan hesabı",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          },
          {
            id: "ikizkenar-ucgen",
            title: "İkizkenar Üçgen",
            type: "Video",
            duration: "41:15",
            isCompleted: true,
            isActive: false,
            description: "İkizkenar üçgen özellikleri",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          },
          {
            id: "dik-ucgen",
            title: "Dik Üçgen",
            type: "Video",
            duration: "22:45",
            isCompleted: true,
            isActive: false,
            description: "Dik üçgen ve Pisagor teoremi",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          },
          {
            id: "ucgen-alan",
            title: "Üçgen Alan Formülleri",
            type: "Video",
            duration: "28:30",
            isCompleted: true,
            isActive: true,
            description: "Farklı üçgen alan hesaplama yöntemleri",
            videoUrl: "https://www.youtube.com/embed/9vKqVkMQHKk"
          }
        ]
      }
    ],
    courseInfo: {
      language: "TR",
      title: "Geometri",
      isCertified: true,
      instructor: {
        name: "Prof. Dr. Mustafa Öz",
        role: "Matematik Profesörü"
      }
    }
  }
};

const getLessonIcon = (type: string) => {
  switch (type) {
    case "Video":
      return <Play className="h-4 w-4" />;
    case "Link":
      return <LinkIcon className="h-4 w-4" />;
    case "Embed":
      return <Code className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export default function LessonPage() {
  const { sidebarOpen } = useSidebar();
  const params = useParams();
  const courseSlug = params.slug as string || 'tarih'; // Varsayılan olarak tarih
  
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(390);
  const [isResizing, setIsResizing] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState("dersler");
  const [lessonData, setLessonData] = useState(courseData[courseSlug as keyof typeof courseData] || courseData.tarih);
  
  // Course slug değiştiğinde lesson data'yı güncelle
  useEffect(() => {
    const newCourseData = courseData[courseSlug as keyof typeof courseData] || courseData.tarih;
    setLessonData(newCourseData);
    
    // İlk modülü genişlet
    if (newCourseData.modules.length > 0) {
      setExpandedModules([newCourseData.modules[0].id]);
    }
  }, [courseSlug]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleLessonClick = (lessonId: string) => {
    setLessonData(prevData => {
      const updatedModules = prevData.modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => ({
          ...lesson,
          isActive: lesson.id === lessonId
        }))
      }));

      // Aktif dersi bul ve header bilgilerini güncelle
      let activeLesson = null;
      for (const module of updatedModules) {
        activeLesson = module.lessons.find(lesson => lesson.isActive);
        if (activeLesson) break;
      }

      return {
        ...prevData,
        modules: updatedModules,
        lessonTitle: activeLesson?.title || prevData.lessonTitle,
        lessonType: activeLesson?.type || prevData.lessonType,
        description: activeLesson?.description || prevData.description
      };
    });
  };

  // Tüm dersleri tek bir listede topla
  const getAllLessons = () => {
    const allLessons = [];
    for (const module of lessonData.modules) {
      for (const lesson of module.lessons) {
        allLessons.push({ ...lesson, moduleId: module.id });
      }
    }
    return allLessons;
  };

  // Aktif dersi bul
  const getActiveLesson = () => {
    const allLessons = getAllLessons();
    return allLessons.find(lesson => lesson.isActive);
  };

  // Önceki ders
  const goToPreviousLesson = () => {
    const allLessons = getAllLessons();
    const activeLesson = getActiveLesson();
    const currentIndex = allLessons.findIndex(lesson => lesson.id === activeLesson?.id);
    
    if (currentIndex > 0) {
      const previousLesson = allLessons[currentIndex - 1];
      handleLessonClick(previousLesson.id);
    }
  };

  // Sonraki ders
  const goToNextLesson = () => {
    const allLessons = getAllLessons();
    const activeLesson = getActiveLesson();
    const currentIndex = allLessons.findIndex(lesson => lesson.id === activeLesson?.id);
    
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      handleLessonClick(nextLesson.id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 390;
    const maxWidth = 500;
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Modern Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <BookOpen className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {lessonData.courseTitle}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {lessonData.lessonTitle} • {lessonData.lessonType}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
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
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Maximize className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Tam Ekran
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                </div>
              </div>
              
              <div className="relative group">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className={`p-2 rounded-lg transition-colors ${
                    showSidebar 
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {showSidebar ? "Sidebar'ı Gizle" : "Sidebar'ı Göster"}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Main Content Area */}
        <div className="flex-1 px-4 lg:px-6 py-6 relative">
          {/* Sidebar Toggle Button - Show when sidebar is hidden */}
          {!showSidebar && (
            <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
              <div className="relative group">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="p-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Ders İçeriği
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900 dark:border-l-gray-100"></div>
                </div>
              </div>
            </div>
          )}

          {/* Lesson Viewer */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
            {/* Lesson Content Area - YouTube Video */}
            <div className="p-4 sm:p-6">
              <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl mx-auto aspect-video max-w-5xl">
                <div className="relative w-full aspect-video">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`${(() => {
                      const activeLesson = getActiveLesson();
                      return activeLesson?.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ";
                    })()}?autoplay=0&controls=1&modestbranding=1&rel=0&showinfo=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">
                    {(() => {
                      const allLessons = getAllLessons();
                      const activeLesson = getActiveLesson();
                      const currentIndex = allLessons.findIndex(lesson => lesson.id === activeLesson?.id);
                      return `${currentIndex + 1} / ${allLessons.length}`;
                    })()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={goToPreviousLesson}
                    disabled={(() => {
                      const allLessons = getAllLessons();
                      const activeLesson = getActiveLesson();
                      const currentIndex = allLessons.findIndex(lesson => lesson.id === activeLesson?.id);
                      return currentIndex === 0;
                    })()}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                      (() => {
                        const allLessons = getAllLessons();
                        const activeLesson = getActiveLesson();
                        const currentIndex = allLessons.findIndex(lesson => lesson.id === activeLesson?.id);
                        return currentIndex === 0
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300";
                      })()
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Önceki</span>
                  </button>
                  <button 
                    onClick={goToNextLesson}
                    disabled={(() => {
                      const allLessons = getAllLessons();
                      const activeLesson = getActiveLesson();
                      const currentIndex = allLessons.findIndex(lesson => lesson.id === activeLesson?.id);
                      return currentIndex === allLessons.length - 1;
                    })()}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm ${
                      (() => {
                        const allLessons = getAllLessons();
                        const activeLesson = getActiveLesson();
                        const currentIndex = allLessons.findIndex(lesson => lesson.id === activeLesson?.id);
                        return currentIndex === allLessons.length - 1
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-gray-900 hover:bg-gray-800 text-white";
                      })()
                    }`}
                  >
                    <span className="hidden sm:inline">Sonraki</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
            <div className="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">Ders Açıklaması</span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{lessonData.description}</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Course Content */}
        {showSidebar && (
          <div className="relative">
            <div className="absolute -left-5 top-1/3 transform -translate-y-1/2 z-40">
              <div className="relative group">
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Gizle
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900 dark:border-l-gray-100"></div>
                </div>
              </div>
            </div>
            
            <div 
              className="bg-white dark:bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 flex flex-col sticky top-20 relative"
              style={{ width: `${sidebarWidth}px`, height: 'calc(100vh - 5rem)' }}
              data-sidebar="course-content"
            >
              <div
                className="absolute left-0 top-0 w-1 h-full bg-transparent hover:bg-blue-500 cursor-col-resize transition-colors duration-200 z-10"
                onMouseDown={handleMouseDown}
              />
              
              <div className="px-3 py-3 border-b border-gray-200/60 dark:border-gray-700/60">
                <div className="flex space-x-1 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-1 shadow-inner">
                  {[
                    { id: "dersler", label: "Dersler", icon: BookOpen },
                    { id: "odevler", label: "Ödevler", icon: FileText },
                    { id: "notlar", label: "Notlar", icon: StickyNote }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSidebarTab(tab.id)}
                                              className={`flex-1 px-3 py-2 text-xs font-semibold rounded-md transition-all duration-200 flex items-center justify-center gap-1.5 ${
                        activeSidebarTab === tab.id
                          ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-md ring-1 ring-gray-200 dark:ring-gray-700 transform scale-105"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-600/50"
                      }`}
                    >
                      <tab.icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <ScrollArea className="flex-1 p-4 sm:p-6 min-h-0">
                {activeSidebarTab === "dersler" && (
                  <div className="space-y-3 pb-4">
                    {lessonData.modules.map((module) => (
                      <div key={module.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {module.completed > 0 ? (
                                <div className="relative">
                                  <div className="h-5 w-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                                    <CheckCircle className="h-3.5 w-3.5 text-white" />
                                  </div>
                                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-pulse opacity-30"></div>
                                </div>
                              ) : (
                                <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 shadow-sm"></div>
                              )}
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{module.title}</span>
                            </div>
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                              {module.completed}/{module.total}
                            </span>
                          </div>
                          {expandedModules.includes(module.id) ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </button>

                        {expandedModules.includes(module.id) && module.lessons.length > 0 && (
                          <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-2">
                            {module.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                                  lesson.isActive
                                    ? "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                }`}
                                onClick={() => handleLessonClick(lesson.id)}
                              >
                                <div className="flex items-center space-x-2">
                                  {lesson.isCompleted ? (
                                    <div className="relative">
                                      <div className="h-4 w-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                                        <CheckCircle className="h-2.5 w-2.5 text-white" />
                                      </div>
                                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-pulse opacity-20"></div>
                                    </div>
                                  ) : (
                                    <div className="h-4 w-4 border-2 border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 shadow-sm"></div>
                                  )}
                                  <div className="text-gray-500 dark:text-gray-400">
                                    {getLessonIcon(lesson.type)}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm ${
                                    lesson.isActive
                                      ? "text-gray-900 dark:text-gray-100 font-semibold"
                                      : "text-gray-700 dark:text-gray-300"
                                  }`}>
                                    {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span>{lesson.type}</span>
                                    {lesson.duration && (
                                      <>
                                        <span>•</span>
                                        <span>{lesson.duration}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeSidebarTab === "odevler" && (
                  <div className="space-y-3 pb-4">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ödevler</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Henüz ödev bulunmuyor</p>
                    </div>
                  </div>
                )}

                {activeSidebarTab === "notlar" && (
                  <div className="space-y-3 pb-4">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notlar</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Henüz not bulunmuyor</p>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}