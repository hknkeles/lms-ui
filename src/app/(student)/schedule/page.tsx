"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, ChevronLeft as LeftArrow, ChevronRight as RightArrow, X, MapPin, User, BookOpen, TestTube, Presentation, FileText, Award, Maximize } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StudentNavbar from "@/components/student/StudentNavbar";
import { Home } from "lucide-react";

// Mock data for events
const mockEvents = [
  // Bugünkü etkinlikler
  {
    id: 1,
    title: "Matematik Analiz",
    time: "09:00 - 10:30",
    type: "ders",
    date: new Date().toISOString().split('T')[0], // Bugün
    instructor: "Prof. Dr. Ahmet Yılmaz",
    location: "A-101"
  },
  {
    id: 2,
    title: "Fizik Laboratuvarı",
    time: "14:00 - 16:00",
    type: "laboratuvar",
    date: new Date().toISOString().split('T')[0], // Bugün
    instructor: "Dr. Mehmet Özkan",
    location: "L-205"
  },
  
  // Yarınki etkinlikler
  {
    id: 3,
    title: "Kimya Temelleri",
    time: "10:00 - 11:30",
    type: "ders",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yarın
    instructor: "Dr. Ayşe Demir",
    location: "B-201"
  },
  {
    id: 4,
    title: "İngilizce Konuşma",
    time: "13:00 - 14:00",
    type: "ders",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yarın
    instructor: "Dr. Sarah Johnson",
    location: "B-302"
  },
  
  // Bu haftaki diğer etkinlikler
  {
    id: 5,
    title: "Biyoloji Dersi",
    time: "09:00 - 10:30",
    type: "ders",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 gün sonra
    instructor: "Prof. Dr. Fatma Kaya",
    location: "C-103"
  },
  {
    id: 6,
    title: "Tarih Semineri",
    time: "15:00 - 16:30",
    type: "seminer",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 gün sonra
    instructor: "Prof. Dr. Mustafa Öz",
    location: "D-401"
  },
  {
    id: 7,
    title: "Geometri Problem Çözme",
    time: "11:00 - 12:30",
    type: "ders",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 gün sonra
    instructor: "Dr. Zeynep Arslan",
    location: "A-205"
  },
  {
    id: 8,
    title: "Kimya Laboratuvarı",
    time: "14:00 - 16:00",
    type: "laboratuvar",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 gün sonra
    instructor: "Dr. Ayşe Demir",
    location: "L-205"
  },
  {
    id: 9,
    title: "Edebiyat Analizi",
    time: "10:00 - 11:30",
    type: "ders",
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 gün sonra
    instructor: "Dr. Elif Yılmaz",
    location: "E-102"
  },
  {
    id: 10,
    title: "Coğrafya Projesi",
    time: "13:00 - 15:00",
    type: "proje",
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 gün sonra
    instructor: "Prof. Dr. Ali Kaya",
    location: "F-301"
  },
  
  // Gelecek hafta
  {
    id: 11,
    title: "Matematik Sınavı",
    time: "09:00 - 11:00",
    type: "sınav",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 hafta sonra
    instructor: "Prof. Dr. Ahmet Yılmaz",
    location: "A-101"
  },
  {
    id: 12,
    title: "Fizik Quiz",
    time: "14:00 - 15:00",
    type: "quiz",
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 8 gün sonra
    instructor: "Dr. Mehmet Özkan",
    location: "B-201"
  },
  {
    id: 13,
    title: "İngilizce Sunum",
    time: "11:00 - 12:00",
    type: "sunum",
    date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 9 gün sonra
    instructor: "Dr. Sarah Johnson",
    location: "B-302"
  },
  {
    id: 14,
    title: "Biyoloji Laboratuvarı",
    time: "13:00 - 15:00",
    type: "laboratuvar",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 gün sonra
    instructor: "Prof. Dr. Fatma Kaya",
    location: "L-103"
  }
];

const months = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const daysOfWeek = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export default function SchedulePage() {
  const { sidebarOpen } = useSidebar();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(mockEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    type: 'ders',
    instructor: '',
    location: ''
  });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Adjust for Monday start (0 = Sunday, 1 = Monday)
  const adjustedFirstDay = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

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

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  const hasEvent = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(event => event.date === dateStr);
  };

  const getTodayEvents = () => {
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return events.filter(event => event.date === todayStr);
  };

  const getUpcomingEvents = () => {
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return events.filter(event => event.date > todayStr).slice(0, 3);
  };

  const getWeekEvents = () => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    
    const weekEvents = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === dateStr);
      weekEvents.push({
        day: daysOfWeek[i],
        date: date.getDate(),
        events: dayEvents
      });
    }
    return weekEvents;
  };

  const openModal = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    setModalDate(date);
    setIsModalOpen(true);
    setIsAddingEvent(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalDate(null);
    setIsAddingEvent(false);
    setIsAddEventModalOpen(false);
    setNewEvent({
      title: '',
      time: '',
      type: 'ders',
      instructor: '',
      location: ''
    });
  };

  const openAddEventModal = () => {
    setIsAddEventModalOpen(true);
  };

  const closeAddEventModal = () => {
    setIsAddEventModalOpen(false);
    setNewEvent({
      title: '',
      time: '',
      type: 'ders',
      instructor: '',
      location: ''
    });
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'ders':
        return <BookOpen className="h-4 w-4" />;
      case 'laboratuvar':
        return <TestTube className="h-4 w-4" />;
      case 'seminer':
        return <Presentation className="h-4 w-4" />;
      case 'proje':
        return <FileText className="h-4 w-4" />;
      case 'sınav':
      case 'quiz':
        return <Award className="h-4 w-4" />;
      case 'sunum':
        return <Presentation className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'ders':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'laboratuvar':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'seminer':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'proje':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'sınav':
      case 'quiz':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'sunum':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const addEvent = () => {
    if (!modalDate || !newEvent.title || !newEvent.time) return;
    
    const dateStr = `${modalDate.getFullYear()}-${String(modalDate.getMonth() + 1).padStart(2, '0')}-${String(modalDate.getDate()).padStart(2, '0')}`;
    
    const event = {
      id: Date.now(),
      title: newEvent.title,
      time: newEvent.time,
      type: newEvent.type,
      date: dateStr,
      instructor: newEvent.instructor,
      location: newEvent.location
    };
    
    setEvents(prev => [...prev, event]);
    closeAddEventModal();
  };

  return (
    <div className="min-h-screen">
      <StudentNavbar 
        title="Ders Programı"
        subtitle="Planlarınızı görüntüleyin ve yönetin"
        icon={<Calendar className="h-5 w-5 text-white" />}
        breadcrumb={{
          items: [
            {
              label: "Ana Sayfa",
              href: "/",
              icon: <Home className="h-3 w-3" />
            },
            {
              label: "Ders Programı",
              active: true
            }
          ]
        }}
      />

      {/* Content with top padding for navbar */}
      <div className="pt-24">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ders Programı</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Ders programınızı görüntüleyin ve planlarınızı yönetin
              </p>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {months[currentMonth]} {currentYear}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square p-2 text-center cursor-pointer rounded-lg transition-all duration-200 ${
                      day === null
                        ? 'invisible'
                        : isToday(day)
                        ? 'bg-blue-600 text-white font-semibold'
                        : isSelected(day)
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                        : hasEvent(day)
                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => day && openModal(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bugünkü Program</h3>
              </div>
              
              {getTodayEvents().length > 0 ? (
                <div className="space-y-3">
                  {getTodayEvents().map((event) => (
                    <div key={event.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{event.title}</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{event.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{event.instructor}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{event.location}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Bugün için planlanmış ders yok</p>
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Yaklaşan Etkinlikler</h3>
              
              {getUpcomingEvents().length > 0 ? (
                <div className="space-y-3">
                  {getUpcomingEvents().map((event) => (
                    <div key={event.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{event.title}</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{event.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{event.instructor}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{event.location}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Yaklaşan etkinlik yok</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* This Week Section */}
        <div className="mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bu Hafta</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bu hafta planlanmış tüm dersleriniz</p>
            </div>
            
            <div className="grid grid-cols-7 gap-4">
              {getWeekEvents().map((dayData, index) => (
                <div key={index} className="text-center">
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{dayData.day}</p>
                    <p className={`text-lg font-semibold ${
                      dayData.date === today.getDate() 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {dayData.date}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    {dayData.events.map((event) => (
                      <div key={event.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{event.title}</p>
                        <p className="text-gray-500 dark:text-gray-400">{event.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Day Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {modalDate && `${modalDate.getDate()} ${months[modalDate.getMonth()]} ${modalDate.getFullYear()}`}
            </DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Günlük program
            </p>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[60vh]">
            {/* Events List */}
            <div className="space-y-3 mb-6">
              {modalDate && getEventsForDate(modalDate).length > 0 ? (
                getEventsForDate(modalDate).map((event) => (
                    <div key={event.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                              {event.title}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {event.time}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <User className="h-3 w-3" />
                              <span>{event.instructor}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Bu gün için etkinlik yok</p>
                  </div>
                )}
              </div>

            {/* Add Event Button */}
            <Button
              onClick={openAddEventModal}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Etkinlik Ekle
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Event Modal - Sağa doğru açılan */}
      <Dialog open={isAddEventModalOpen} onOpenChange={setIsAddEventModalOpen}>
        <DialogContent className="fixed right-0 top-0 h-full w-96 max-w-[90vw] m-0 rounded-l-xl rounded-r-none transform transition-transform duration-300 ease-in-out">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Yeni Etkinlik Ekle
            </DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {modalDate && `${modalDate.getDate()} ${months[modalDate.getMonth()]} ${modalDate.getFullYear()}`} için etkinlik
            </p>
          </DialogHeader>

          <div className="flex-1 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Etkinlik Başlığı
                </label>
                <Input
                  placeholder="Örn: Matematik Dersi"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Saat
                </label>
                <Input
                  placeholder="09:00 - 10:30"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Etkinlik Türü
                </label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Etkinlik türü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ders">Ders</SelectItem>
                    <SelectItem value="laboratuvar">Laboratuvar</SelectItem>
                    <SelectItem value="seminer">Seminer</SelectItem>
                    <SelectItem value="proje">Proje</SelectItem>
                    <SelectItem value="sınav">Sınav</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="sunum">Sunum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Eğitmen
                </label>
                <Input
                  placeholder="Prof. Dr. Örnek"
                  value={newEvent.instructor}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, instructor: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Lokasyon
                </label>
                <Input
                  placeholder="A-101"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={addEvent}
                className="flex-1"
                disabled={!newEvent.title || !newEvent.time}
              >
                Etkinlik Ekle
              </Button>
              <Button
                variant="outline"
                onClick={closeAddEventModal}
                className="flex-1"
              >
                İptal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}