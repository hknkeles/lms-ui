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

  useEffect(() => {
    const courseSlug = params.slug as string;
    const lessonId = params.lessonId as string;
    const courseInfo = lessonData[courseSlug as keyof typeof lessonData];
    
    if (courseInfo) {
      setCourse(courseInfo.course);
      setCurrentLesson(courseInfo.lessons[lessonId as keyof typeof courseInfo.lessons]);
      setLessons(Object.values(courseInfo.lessons));
    }
  }, [params.slug, params.lessonId]);

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
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      {/* Header */}
      <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border-b border-white/40 dark:border-gray-700/40 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/courses/${course.slug}`)}
                className="p-2 hover:bg-white/20 dark:hover:bg-gray-700/30 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentLesson.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {course.title} • {currentLesson.duration}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-white/20 dark:hover:bg-gray-700/30 rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="p-2 hover:bg-white/20 dark:hover:bg-gray-700/30 rounded-lg transition-colors"
              >
                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'mr-80' : ''}`}>
          <div className="relative bg-black rounded-lg m-4 overflow-hidden">
            {/* Video Player */}
            <video
              ref={videoRef}
              className="w-full h-full"
              poster={currentLesson.thumbnail}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            >
              <source src={currentLesson.videoUrl} type="video/mp4" />
            </video>

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePlayPause}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </button>
                    
                    <div className="flex items-center gap-2">
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
                        className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <span className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <Settings className="h-5 w-5" />
                      </button>
                      {/* Playback Speed Menu */}
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

          {/* Lesson Info */}
          <div className="p-6">
            <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {currentLesson.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {currentLesson.description}
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLesson.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {currentLesson.isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLesson.isCompleted ? "Tamamlandı" : "Devam ediyor"}
                  </span>
                </div>
              </div>

              {/* Resources */}
              {currentLesson.resources.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Kaynaklar</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentLesson.resources.map((resource: any) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        className="flex items-center gap-2 px-3 py-2 bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-600/30 hover:bg-white/20 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {resource.title}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ duration: 0.3 }}
              className="fixed right-0 top-20 bottom-0 w-80 bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border-l border-white/40 dark:border-gray-700/40 z-30"
            >
              <div className="h-full flex flex-col">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-white/20 dark:border-gray-700/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Ders İçeriği
                    </h3>
                    <button
                      onClick={() => setShowSidebar(false)}
                      className="p-1 hover:bg-white/20 dark:hover:bg-gray-700/30 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    {["lessons", "transcript", "notes"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                          activeTab === tab
                            ? "bg-blue-500 text-white"
                            : "bg-white/20 dark:bg-gray-700/20 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30"
                        }`}
                      >
                        {tab === "lessons" ? "Dersler" : 
                         tab === "transcript" ? "Transkript" : "Notlar"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {activeTab === "lessons" && (
                    <div className="space-y-2">
                      {lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            lesson.id === currentLesson.id
                              ? "bg-blue-500/20 border border-blue-500/30"
                              : "bg-white/10 dark:bg-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-700/30"
                          }`}
                          onClick={() => router.push(`/courses/${course.slug}/lesson/${lesson.id}`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {lesson.isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : lesson.id === currentLesson.id ? (
                                <PlayCircle className="h-5 w-5 text-blue-500" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                {lesson.title}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {lesson.duration}
                              </p>
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
    </div>
  );
}
