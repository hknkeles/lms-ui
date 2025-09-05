"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Circle, 
  Lock, 
  Unlock, 
  Download, 
  Share2, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Eye, 
  EyeOff, 
  Menu, 
  X, 
  Search, 
  Filter, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  MoreVertical, 
  PlayCircle, 
  PauseCircle, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  RotateCw, 
  Zap, 
  Target, 
  FileText, 
  Video, 
  Image, 
  Link, 
  BarChart3, 
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
  WifiOff,
  Maximize2,
  Minimize2,
  Volume1,
  Volume3,
  Square,
  Circle as CircleIcon,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon
} from "lucide-react";

// Mock data - gerçek uygulamada API'den gelecek
const lessonData = {
  "web-gelistirme-101": {
    course: {
      id: "c1",
      title: "Web Geliştirme 101",
      teacher: "Dr. Ayşe Yılmaz",
      progress: 45,
      slug: "web-gelistirme-101"
    },
    lessons: {
      "l1": {
        id: "l1",
        title: "HTML Giriş",
        description: "HTML'in temellerini öğrenin ve ilk web sayfanızı oluşturun",
        duration: "15:30",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop",
        isCompleted: true,
        notes: [
          { id: "n1", timestamp: "02:15", content: "HTML5 semantik elementler çok önemli", type: "note" },
          { id: "n2", timestamp: "05:30", content: "div vs section farkı", type: "question" },
          { id: "n3", timestamp: "08:45", content: "Accessibility için alt text kullan", type: "reminder" }
        ],
        resources: [
          { id: "r1", title: "HTML5 Cheat Sheet", type: "pdf", url: "#" },
          { id: "r2", title: "Semantic HTML Guide", type: "link", url: "#" }
        ],
        transcript: [
          { timestamp: "00:00", speaker: "Dr. Ayşe Yılmaz", text: "Merhaba, bugün HTML'in temellerini öğreneceğiz." },
          { timestamp: "00:15", speaker: "Dr. Ayşe Yılmaz", text: "HTML, web sayfalarının yapı taşıdır." },
          { timestamp: "00:30", speaker: "Dr. Ayşe Yılmaz", text: "İlk olarak temel HTML yapısını inceleyelim." }
        ]
      },
      "l2": {
        id: "l2",
        title: "Semantik HTML",
        description: "HTML5 semantik elementlerini kullanarak anlamlı yapılar oluşturun",
        duration: "25:45",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=450&fit=crop",
        isCompleted: true,
        notes: [],
        resources: [],
        transcript: []
      },
      "l3": {
        id: "l3",
        title: "Form Elementleri",
        description: "HTML form elementlerini ve validasyon tekniklerini öğrenin",
        duration: "20:15",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a6d3?w=800&h=450&fit=crop",
        isCompleted: false,
        notes: [],
        resources: [],
        transcript: []
      }
    }
  },
  "veri-yapilari-algoritmalar": {
    course: {
      id: "c2",
      title: "Veri Yapıları ve Algoritmalar",
      teacher: "Prof. Mehmet Demir",
      progress: 12,
      slug: "veri-yapilari-algoritmalar"
    },
    lessons: {
      "l1": {
        id: "l1",
        title: "Algoritma Temelleri",
        description: "Algoritma kavramını ve temel algoritma türlerini öğrenin",
        duration: "18:20",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
        isCompleted: false,
        notes: [],
        resources: [],
        transcript: []
      }
    }
  },
  "veritabani-temelleri": {
    course: {
      id: "c3",
      title: "Veritabanı Temelleri",
      teacher: "Ece Kaya",
      progress: 78,
      slug: "veritabani-temelleri"
    },
    lessons: {
      "l1": {
        id: "l1",
        title: "SQL Giriş",
        description: "SQL'in temellerini ve veritabanı sorgularını öğrenin",
        duration: "22:10",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a6d3?w=800&h=450&fit=crop",
        isCompleted: true,
        notes: [],
        resources: [],
        transcript: []
      }
    }
  },
  "matematik-101": {
    course: {
      id: "c4",
      title: "Matematik 101",
      teacher: "Prof. Dr. Ahmet Yılmaz",
      progress: 75,
      slug: "matematik-101"
    },
    lessons: {
      "l1": {
        id: "l1",
        title: "Fonksiyonlar",
        description: "Matematiksel fonksiyonların temellerini öğrenin",
        duration: "30:45",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=450&fit=crop",
        isCompleted: true,
        notes: [],
        resources: [],
        transcript: []
      }
    }
  },
  "ingilizce-kompozisyon": {
    course: {
      id: "c5",
      title: "İngilizce Kompozisyon",
      teacher: "Dr. Sarah Johnson",
      progress: 60,
      slug: "ingilizce-kompozisyon"
    },
    lessons: {
      "l1": {
        id: "l1",
        title: "Essay Writing Basics",
        description: "İngilizce kompozisyon yazmanın temellerini öğrenin",
        duration: "25:30",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=450&fit=crop",
        isCompleted: false,
        notes: [],
        resources: [],
        transcript: []
      }
    }
  },
  "bilgisayar-programlama": {
    course: {
      id: "c6",
      title: "Bilgisayar Programlama",
      teacher: "Prof. Dr. Mehmet Kaya",
      progress: 90,
      slug: "bilgisayar-programlama"
    },
    lessons: {
      "l1": {
        id: "l1",
        title: "Python Giriş",
        description: "Python programlama dilinin temellerini öğrenin",
        duration: "35:20",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop",
        isCompleted: true,
        notes: [],
        resources: [],
        transcript: []
      }
    }
  }
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [course, setCourse] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState("lessons");
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("note");
  const [showTranscript, setShowTranscript] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const courseSlug = params.slug as string;
    const courseInfo = lessonData[courseSlug as keyof typeof lessonData];
    
    if (courseInfo) {
      setCourse(courseInfo.course);
      // İlk dersi otomatik olarak seç
      const firstLesson = Object.values(courseInfo.lessons)[0];
      setCurrentLesson(firstLesson);
      setLessons(Object.values(courseInfo.lessons));
    }
  }, [params.slug]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Video player'a odaklanmışken çalışsın
      if (document.activeElement?.tagName === 'VIDEO' || e.target === document.body) {
        switch (e.code) {
          case 'Space':
            e.preventDefault();
            handlePlayPause();
            break;
          case 'KeyM':
            e.preventDefault();
            handleMute();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (videoRef.current) {
              videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
            }
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (videoRef.current) {
              videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
            }
            break;
          case 'KeyF':
            e.preventDefault();
            handleFullscreen();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isMuted, duration]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Video container'ı tam ekran yap
      const videoContainer = videoRef.current?.parentElement?.parentElement;
      if (videoContainer) {
        videoContainer.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handlePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const addNote = () => {
    if (newNote.trim() && currentLesson) {
      const note = {
        id: Date.now().toString(),
        timestamp: formatTime(currentTime),
        content: newNote,
        type: noteType
      };
      // Burada notu API'ye göndereceksiniz
      setNewNote("");
    }
  };

  const getNoteIcon = (type: string) => {
    switch (type) {
      case "question": return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "reminder": return <Bookmark className="h-4 w-4 text-yellow-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCurrentLessonIndex = () => {
    return lessons.findIndex(lesson => lesson.id === currentLesson.id);
  };

  const goToPreviousLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex > 0) {
      setCurrentLesson(lessons[currentIndex - 1]);
    }
  };

  const goToNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex < lessons.length - 1) {
      setCurrentLesson(lessons[currentIndex + 1]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 280;
    const maxWidth = 600;
    
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
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  // Fullscreen event listeners
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Ders yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Modern Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm rounded-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/courses')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentLesson.title}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.title} • {currentLesson.duration}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`p-2 rounded-lg transition-colors ${
                  showNotes 
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                <FileText className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className={`p-2 rounded-lg transition-colors ${
                  showSidebar 
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div 
          className="flex-1 transition-all duration-300"
          style={{ marginRight: showSidebar ? `${sidebarWidth}px` : '0' }}
        >
          <div className={`relative bg-black rounded-xl m-4 lg:m-6 overflow-hidden shadow-2xl max-w-4xl mx-auto ${isFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none' : ''}`}>
            {/* Video Player */}
            <div className={`relative w-full ${isFullscreen ? 'h-full' : 'aspect-video'}`}>
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                poster={currentLesson.thumbnail}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onLoadStart={() => setIsVideoLoading(true)}
                onCanPlay={() => setIsVideoLoading(false)}
                onWaiting={() => setIsVideoLoading(true)}
                onPlaying={() => setIsVideoLoading(false)}
              >
                <source src={currentLesson.videoUrl} type="video/mp4" />
              </video>
            </div>

            {/* Loading Skeleton */}
            {isVideoLoading && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white text-sm">Video yükleniyor...</p>
                </div>
              </div>
            )}

            {/* Center Play/Pause Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayPause}
                className="p-4 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 hover:scale-110 opacity-0 hover:opacity-100"
              >
                {isPlaying ? (
                  <Pause className="h-12 w-12 text-white" />
                ) : (
                  <Play className="h-12 w-12 text-white" />
                )}
              </button>
            </div>

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="relative">
                    {/* Background track */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-white/20 rounded-full"></div>
                    {/* Progress fill */}
                    <div 
                      className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full pointer-events-none"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    ></div>
                    {/* Input range - transparent */}
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-transparent appearance-none cursor-pointer slider relative z-10"
                      style={{
                        background: 'transparent',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={handlePlayPause}
                      className="p-3 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
                    >
                      {isPlaying ? (
                        <Pause className="h-7 w-7" />
                      ) : (
                        <Play className="h-7 w-7" />
                      )}
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleMute}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="h-5 w-5" />
                        ) : volume > 0.5 ? (
                          <Volume2 className="h-5 w-5" />
                        ) : volume > 0 ? (
                          <Volume1 className="h-5 w-5" />
                        ) : (
                          <VolumeX className="h-5 w-5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                      />
                    </div>

                    <span className="text-sm font-medium bg-black/30 px-3 py-1 rounded-full">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <Settings className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <button
                      onClick={handleFullscreen}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      {isFullscreen ? (
                        <Minimize className="h-5 w-5" />
                      ) : (
                        <Maximize className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Note Taking Overlay */}
            {showNotes && (
              <div className="absolute top-4 right-4 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-4 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notlar</h3>
                  <button
                    onClick={() => setShowNotes(false)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-3 mb-4">
                  {currentLesson.notes.map((note: any) => (
                    <div key={note.id} className="flex items-start gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                      <div className="flex-shrink-0 mt-1">
                        {getNoteIcon(note.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            {note.timestamp}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {note.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {note.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex gap-2 mb-3">
                    <select
                      value={noteType}
                      onChange={(e) => setNoteType(e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="note">Not</option>
                      <option value="question">Soru</option>
                      <option value="reminder">Hatırlatma</option>
                    </select>
                    <button
                      onClick={addNote}
                      className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                    >
                      Ekle
                    </button>
                  </div>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Not ekle..."
                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={goToPreviousLesson}
              disabled={getCurrentLessonIndex() === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                getCurrentLessonIndex() === 0
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="font-medium">Önceki Ders</span>
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">
                {getCurrentLessonIndex() + 1} / {lessons.length}
              </span>
            </div>

            <button
              onClick={goToNextLesson}
              disabled={getCurrentLessonIndex() === lessons.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                getCurrentLessonIndex() === lessons.length - 1
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg"
              }`}
            >
              <span className="font-medium">Sonraki Ders</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Lesson Info */}
          <div className="px-6 pb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
                <div className="flex-1">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentLesson.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg">
                    {currentLesson.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {currentLesson.isCompleted ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        Tamamlandı
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <Circle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Devam ediyor
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">{currentLesson.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Video className="h-5 w-5" />
                  <span className="font-medium">Video Ders</span>
                </div>
              </div>

              {/* Resources */}
              {currentLesson.resources.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">Kaynaklar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentLesson.resources.map((resource: any) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {resource.title}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {resource.type} dosyası
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modern Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: sidebarWidth }}
              animate={{ x: 0 }}
              exit={{ x: sidebarWidth }}
              transition={{ duration: 0.3 }}
              className="fixed right-0 top-[120px] bottom-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 z-30 shadow-xl"
              style={{ width: `${sidebarWidth}px` }}
            >
              {/* Resize Handle */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-col-resize transition-colors"
                onMouseDown={handleMouseDown}
              />
              
              <div className="h-full flex flex-col">
                {/* Sidebar Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      Ders İçeriği
                    </h3>
                    <button
                      onClick={() => setShowSidebar(false)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    {["lessons", "transcript", "notes"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                          activeTab === tab
                            ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        {tab === "lessons" ? "Dersler" : 
                         tab === "transcript" ? "Transkript" : "Notlar"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {activeTab === "lessons" && (
                    <div className="space-y-3">
                      {lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                            lesson.id === currentLesson.id
                              ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 shadow-sm"
                              : "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                          }`}
                          onClick={() => setCurrentLesson(lesson)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              {lesson.isCompleted ? (
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                              ) : lesson.id === currentLesson.id ? (
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                  <PlayCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                  <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate mb-1">
                                {lesson.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {lesson.duration}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "transcript" && (
                    <div className="space-y-3">
                      {currentLesson.transcript.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="p-3 bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-600/30"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                              {item.timestamp}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {item.speaker}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "notes" && (
                    <div className="space-y-3">
                      {currentLesson.notes.map((note: any) => (
                        <div
                          key={note.id}
                          className="p-3 bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-600/30"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {getNoteIcon(note.type)}
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                              {note.timestamp}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {note.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {note.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowQuickNote(!showQuickNote)}
          className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          <FileText className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Quick Note Modal */}
      <AnimatePresence>
        {showQuickNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowQuickNote(false)}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Hızlı Not Ekle
                </h3>
                <button
                  onClick={() => setShowQuickNote(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="note">Not</option>
                    <option value="question">Soru</option>
                    <option value="reminder">Hatırlatma</option>
                  </select>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    {formatTime(currentTime)}
                  </span>
                </div>
                
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Notunuzu yazın..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  rows={4}
                  autoFocus
                />
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addNote();
                      setShowQuickNote(false);
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => setShowQuickNote(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
