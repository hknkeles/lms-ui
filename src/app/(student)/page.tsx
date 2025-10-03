"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Clock, 
  GraduationCap, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Bell,
  Search,
  Filter,
  Play,
  Target,
  Zap,
  ChevronLeft,
  ChevronRight,
  Maximize
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useCallback, useState } from "react";
import { getDashboardStats, getRecentCourses } from "@/data/mock/dashboard";
import { useSidebar } from "@/contexts/SidebarContext";
import StudentNavbar from "@/components/student/StudentNavbar";
import { Home } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { sidebarOpen } = useSidebar();
  const stats = getDashboardStats();
  const recentCourses = getRecentCourses();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock events for calendar
  const calendarEvents = useMemo(() => [
    { date: new Date().getDate(), title: "Matematik Dersi", time: "09:00", type: "ders" },
    { date: new Date().getDate() + 1, title: "İngilizce Quiz", time: "14:00", type: "quiz" },
    { date: new Date().getDate() + 2, title: "Fizik Lab", time: "10:00", type: "laboratuvar" },
    { date: new Date().getDate() + 5, title: "Kimya Sınavı", time: "09:00", type: "sınav" },
    { date: new Date().getDate() + 7, title: "Proje Teslimi", time: "23:59", type: "proje" }
  ], []);

  // Calendar functions
  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  }, []);

  const getCalendarDays = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 35; i++) { // 5 sıra x 7 gün = 35
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayEvents = calendarEvents.filter(event => event.date === date.getDate());
      const isToday = date.toDateString() === today.toDateString();
      const isCurrentMonth = date.getMonth() === month;
      
      days.push({
        date: date.getDate(),
        fullDate: new Date(date),
        isCurrentMonth,
        isToday,
        events: dayEvents
      });
    }
    
    return days;
  }, [currentDate, calendarEvents]);

  // Memoized quick actions to prevent unnecessary re-renders
  const quickActions = useMemo(() => [
    {
      title: "Derslerim",
      description: "Tüm derslerinizi görüntüleyin",
      icon: BookOpen,
      href: "/courses",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Ödevler",
      description: "Yaklaşan teslim tarihleri",
      icon: FileText,
      href: "/assignments",
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "Notlar",
      description: "Başarı durumunuzu kontrol edin",
      icon: TrendingUp,
      href: "/grades",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Program",
      description: "Ders programınızı görün",
      icon: Calendar,
      href: "/schedule",
      gradient: "from-purple-500 to-pink-500"
    }
  ], []);

  // Memoized upcoming tasks
  const upcomingTasks = useMemo(() => [
    { id: 1, title: "Matematik Ödevi", due: "2 gün", priority: "high", type: "assignment" },
    { id: 2, title: "İngilizce Quiz", due: "5 gün", priority: "medium", type: "quiz" },
    { id: 3, title: "Fizik Projesi", due: "1 hafta", priority: "low", type: "project" }
  ], []);

  // Memoized priority color function
  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "medium": return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "low": return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      default: return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800";
    }
  }, []);

  // Memoized stats data with proper gradient handling
  const statsData = useMemo(() => [
    { 
      title: "Toplam Ders", 
      value: stats.totalCourses, 
      icon: BookOpen, 
      gradient: "from-blue-500 to-cyan-500",
      change: "+2 bu ay"
    },
    { 
      title: "Devam Eden", 
      value: stats.ongoingCourses, 
      icon: Clock, 
      gradient: "from-green-500 to-emerald-500",
      change: "Aktif"
    },
    { 
      title: "Ortalama Not", 
      value: stats.averageGrade, 
      icon: GraduationCap, 
      gradient: "from-purple-500 to-pink-500",
      change: "+5% artış"
    },
    { 
      title: "Başarı Oranı", 
      value: `${Math.round(Math.random() * 20 + 80)}%`, 
      icon: Target, 
      gradient: "from-orange-500 to-red-500",
      change: "Mükemmel"
    }
  ], [stats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <StudentNavbar 
        title="Dashboard"
        subtitle="Genel bakış ve hızlı erişim"
        icon={<Target className="h-5 w-5 text-white" />}
        breadcrumb={{
          items: [
            {
              label: "Ana Sayfa",
              active: true
            }
          ]
        }}
      />

      {/* Content with top padding for navbar */}
      <div className="pt-24">
        <div className="w-full space-y-6 lg:space-y-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                >
                  Hoş Geldin! 👋
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-slate-600 dark:text-slate-400"
                >
                  Bugün öğrenmeye devam etmeye hazır mısın?
                </motion.p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Bugün</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-white">
                    {new Date().toLocaleDateString('tr-TR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{stat.change}</p>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Hızlı Erişim</h3>
                <div className="flex items-center gap-2">
                  <button 
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                    aria-label="Arama"
                  >
                    <Search className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button 
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                    aria-label="Filtrele"
                  >
                    <Filter className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(action.href)}
                    className="group relative p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300/50 dark:hover:border-slate-600/50 transition-all duration-300 text-left bg-gradient-to-br from-white/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                    aria-label={`${action.title} sayfasına git`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 bg-gradient-to-br ${action.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {action.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{action.description}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                          <Zap className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Takvim</h3>
              <button 
                onClick={() => router.push("/schedule")}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Detaylı Görünüm
              </button>
            </div>
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </button>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
              </h4>
              <button
                onClick={() => navigateMonth('next')}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-1">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {getCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square p-1 text-center cursor-pointer rounded-lg transition-all duration-200 relative ${
                    !day.isCurrentMonth
                      ? 'text-slate-300 dark:text-slate-600'
                      : day.isToday
                      ? 'bg-blue-500 text-white font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-xs">{day.date}</span>
                  {day.events.length > 0 && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                      {day.events.slice(0, 2).map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className={`w-1 h-1 rounded-full ${
                            event.type === 'ders' ? 'bg-blue-500' :
                            event.type === 'quiz' ? 'bg-orange-500' :
                            event.type === 'sınav' ? 'bg-red-500' :
                            event.type === 'laboratuvar' ? 'bg-green-500' :
                            'bg-purple-500'
                          }`}
                        />
                      ))}
                      {day.events.length > 2 && (
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Today's Events */}
            <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
              <h5 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Bugünkü Etkinlikler</h5>
              <div className="space-y-1">
                {calendarEvents.filter(event => event.date === new Date().getDate()).map((event, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      event.type === 'ders' ? 'bg-blue-500' :
                      event.type === 'quiz' ? 'bg-orange-500' :
                      event.type === 'sınav' ? 'bg-red-500' :
                      event.type === 'laboratuvar' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`} />
                    <span className="text-slate-700 dark:text-slate-300 truncate">{event.title}</span>
                    <span className="text-slate-500 dark:text-slate-400 ml-auto">{event.time}</span>
                  </div>
                ))}
                {calendarEvents.filter(event => event.date === new Date().getDate()).length === 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">Bugün etkinlik yok</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Yaklaşan Görevler</h3>
              <button 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                aria-label="Bildirimler"
              >
                <Bell className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-700/50 dark:to-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">{task.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{task.due} kaldı</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority === "high" ? "Yüksek" : 
                       task.priority === "medium" ? "Orta" : "Düşük"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Son Dersler</h3>
            <button 
              onClick={() => router.push("/courses")}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
              aria-label="Tüm dersleri görüntüle"
            >
              <span className="text-sm font-medium">Tümünü Gör</span>
              <Play className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {recentCourses.slice(0, 3).map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => router.push(`/courses/${course.slug}`)}
                className="group relative p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300/50 dark:hover:border-slate-600/50 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                aria-label={`${course.title} dersini aç`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{course.teacher}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">İlerleme</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
