"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Pin, 
  Calendar,
  BookOpen,
  Save,
  FileText,
  Clock,
  Star
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Note {
  id: string;
  title: string;
  content: string;
  courseId?: string;
  courseTitle?: string;
  isPinned: boolean;
  isImportant: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

interface NotesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
  courseTitle?: string;
}

export default function NotesSidebar({ isOpen, onClose, courseId, courseTitle }: NotesSidebarProps) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "React Hooks Kullanımı",
      content: "useState ve useEffect hook'larının temel kullanımı. State yönetimi ve side effect'ler için önemli.",
      courseId: "react-basics",
      courseTitle: "React Temelleri",
      isPinned: true,
      isImportant: true,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      tags: ["react", "hooks", "state"]
    },
    {
      id: "2",
      title: "JavaScript Async/Await",
      content: "Asenkron programlama için async/await syntax'ı. Promise'ları daha okunabilir hale getirir.",
      courseId: "js-advanced",
      courseTitle: "JavaScript İleri Seviye",
      isPinned: false,
      isImportant: true,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-12"),
      tags: ["javascript", "async", "promise"]
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteIsPinned, setNewNoteIsPinned] = useState(false);
  const [newNoteIsImportant, setNewNoteIsImportant] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "pinned" | "important" | "recent">("all");
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen && !showNewNoteModal && !showEditNoteModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, showNewNoteModal, showEditNoteModal]);

  // Focus search on open
  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Filter notes based on search and filter type
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === "all" ||
                         (filterType === "pinned" && note.isPinned) ||
                         (filterType === "important" && note.isImportant) ||
                         (filterType === "recent" && isRecent(note.updatedAt));
    
    return matchesSearch && matchesFilter;
  });

  function isRecent(date: Date): boolean {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }

  function handleCreateNote() {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    
    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      courseId,
      courseTitle,
      isPinned: newNoteIsPinned,
      isImportant: newNoteIsImportant,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: []
    };
    
    setNotes(prev => [newNote, ...prev]);
    setNewNoteTitle("");
    setNewNoteContent("");
    setNewNoteIsPinned(false);
    setNewNoteIsImportant(false);
    setShowNewNoteModal(false);
    setSelectedNote(newNote);
  }

  function handleOpenEditModal(note: Note) {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setShowEditNoteModal(true);
  }

  function handleTogglePinEdit() {
    if (!editingNote) return;
    setEditingNote({ ...editingNote, isPinned: !editingNote.isPinned });
  }

  function handleToggleImportantEdit() {
    if (!editingNote) return;
    setEditingNote({ ...editingNote, isImportant: !editingNote.isImportant });
  }

  function handleUpdateNote() {
    if (!editingNote || !editTitle.trim() || !editContent.trim()) return;
    
    const updatedNote = {
      ...editingNote,
      title: editTitle,
      content: editContent,
      updatedAt: new Date()
    };
    
    setNotes(prev => prev.map(note => note.id === editingNote.id ? updatedNote : note));
    setShowEditNoteModal(false);
    setEditingNote(null);
    setSelectedNote(updatedNote);
  }

  function handleSaveNote() {
    if (!selectedNote || !editTitle.trim() || !editContent.trim()) return;
    
    const updatedNote = {
      ...selectedNote,
      title: editTitle,
      content: editContent,
      updatedAt: new Date()
    };
    
    setNotes(prev => prev.map(note => note.id === selectedNote.id ? updatedNote : note));
    setSelectedNote(updatedNote);
    setIsEditing(false);
  }

  function handleDeleteNote(noteId: string) {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  }

  function togglePin(noteId: string) {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ));
  }

  function toggleImportant(noteId: string) {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, isImportant: !note.isImportant } : note
    ));
  }

  function formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Bugün";
    if (diffDays === 1) return "Dün";
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString("tr-TR");
  }

  // Resize functionality
  const [isResizing, setIsResizing] = useState(false);
  const [modalWidth, setModalWidth] = useState(600); // Default width for new note modal

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const sidebarRight = window.innerWidth - 28 * 16; // 28rem = 28 * 16px
      const newWidth = sidebarRight - e.clientX;
      const clampedWidth = Math.max(320, Math.min(600, newWidth)); // Min: 320px, Max: 600px
      setModalWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
          />
          
          {/* Sidebar */}
          <motion.div
            ref={sidebarRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[28rem] bg-white dark:bg-gray-900 shadow-2xl z-50 border-l border-gray-200 dark:border-gray-700"
          >
            {/* Navbar */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">Notlarım</h2>
                    {courseTitle && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{courseTitle}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Search and Filters */}
              <div className="px-4 pb-4 space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Notlarda ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-xl w-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                  {[
                    { key: "all", label: "Tümü", icon: BookOpen },
                    { key: "pinned", label: "Sabitlenen", icon: Pin },
                    { key: "important", label: "Önemli", icon: Star },
                    { key: "recent", label: "Son", icon: Clock }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setFilterType(key as any)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex-1 ${
                        filterType === key
                          ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* New Note Button */}
            <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200/50 dark:border-gray-700/50">
              <button
                onClick={() => setShowNewNoteModal(true)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                Yeni Not
              </button>
            </div>

            {/* Notes List */}
            <ScrollArea className="flex-1 px-4 pb-4">
              <div className="space-y-2">
                {filteredNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`group cursor-pointer rounded-lg border transition-all duration-200 ${
                      selectedNote?.id === note.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                    onClick={() => handleOpenEditModal(note)}
                  >
                    <div className="p-3">
                      {/* Note Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {note.isPinned && (
                            <Pin className="h-3 w-3 text-red-500" />
                          )}
                          {note.isImportant && (
                            <Star className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePin(note.id);
                            }}
                            className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                              note.isPinned ? "text-red-500" : "text-gray-400"
                            }`}
                          >
                            <Pin className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleImportant(note.id);
                            }}
                            className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                              note.isImportant ? "text-yellow-500" : "text-gray-400"
                            }`}
                          >
                            <Star className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNote(note.id);
                            }}
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Note Title */}
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {note.title}
                      </h3>

                      {/* Note Content */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {note.content}
                      </p>

                      {/* Note Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(note.updatedAt)}
                        </div>
                        {note.courseTitle && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                            {note.courseTitle}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredNotes.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    {searchTerm ? "Arama sonucu bulunamadı" : "Henüz not eklenmemiş"}
                  </p>
                </div>
              )}
            </ScrollArea>

            {/* Note Detail Panel */}
            {selectedNote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="p-4">
                  {/* Detail Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Not Detayı</h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  {isEditing ? (
                    /* Edit Mode */
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveNote}
                          className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                          <Save className="h-4 w-4 inline mr-2" />
                          Kaydet
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditTitle(selectedNote.title);
                            setEditContent(selectedNote.content);
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                        >
                          İptal
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {selectedNote.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                        {selectedNote.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>Oluşturulma: {formatDate(selectedNote.createdAt)}</span>
                        <span>•</span>
                        <span>Güncelleme: {formatDate(selectedNote.updatedAt)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* New Note Modal */}
          <AnimatePresence>
            {showNewNoteModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-end pr-[28rem]"
              >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" />
                
                {/* Modal */}
                <motion.div
                  initial={{ x: 400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 400, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: `${modalWidth}px` }}
                  className="relative h-[700px] bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-l-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden"
                >
                  {/* Glass Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 dark:from-gray-700/5 dark:to-gray-700/10 rounded-l-3xl"></div>
                  
                  {/* Modal Header */}
                  <div className="relative z-10 p-6 border-b border-emerald-300/30 dark:border-emerald-400/30 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 dark:from-emerald-500/20 dark:to-teal-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-100">
                        Yeni Not
                        {courseTitle && (
                          <span className="block text-sm font-normal text-emerald-600 dark:text-emerald-300 mt-1">
                            {courseTitle}
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setNewNoteIsPinned(!newNoteIsPinned)}
                          className={`p-2 rounded-full transition-colors ${
                            newNoteIsPinned 
                              ? "bg-red-400/20 text-red-600 dark:text-red-400" 
                              : "hover:bg-emerald-300/20 dark:hover:bg-emerald-400/20 text-emerald-700 dark:text-emerald-300"
                          }`}
                        >
                          <Pin className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setNewNoteIsImportant(!newNoteIsImportant)}
                          className={`p-2 rounded-full transition-colors ${
                            newNoteIsImportant 
                              ? "bg-yellow-400/20 text-yellow-600 dark:text-yellow-400" 
                              : "hover:bg-emerald-300/20 dark:hover:bg-emerald-400/20 text-emerald-700 dark:text-emerald-300"
                          }`}
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowNewNoteModal(false)}
                          className="p-2 hover:bg-emerald-300/20 dark:hover:bg-emerald-400/20 rounded-full transition-colors"
                        >
                          <X className="h-5 w-4 text-emerald-700 dark:text-emerald-300" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="relative z-10 p-6 space-y-4 h-[calc(700px-140px)]">
                    {/* Note Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Not Başlığı
                      </label>
                      <input
                        type="text"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        placeholder="Not başlığını girin..."
                        className="w-full px-4 py-3 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-2xl text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                      />
                    </div>

                    {/* Note Content */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Not İçeriği
                      </label>
                      <textarea
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="Notunuzu buraya yazın..."
                        rows={12}
                        className="w-full h-full px-4 py-3 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-2xl text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 resize-none"
                      />
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={handleCreateNote}
                      disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
                      className="w-full bg-gradient-to-r from-emerald-500/90 to-teal-600/90 backdrop-blur-sm text-white py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 font-medium shadow-lg border border-white/20 dark:border-gray-600/30 hover:from-emerald-600/90 hover:to-teal-700/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Save className="h-4 w-4" />
                      Notu Kaydet
                    </button>
                  </div>

                  {/* Resize Handle */}
                  <div
                    onMouseDown={handleMouseDown}
                    className="absolute bottom-0 left-0 w-6 h-6 cursor-nw-resize hover:bg-emerald-400/30 dark:hover:bg-emerald-400/30 transition-all duration-200 group rounded-br-lg"
                  >
                    <div className="absolute bottom-1 left-1 w-4 h-4 bg-emerald-400/50 dark:bg-emerald-300/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-2 left-2 w-2 h-2 bg-emerald-400/70 dark:bg-emerald-300/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-bl from-emerald-100/10 dark:from-emerald-400/5 to-transparent rounded-full translate-y-12 -translate-x-12 pointer-events-none"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tr from-teal-100/10 dark:from-teal-400/5 to-transparent rounded-full -translate-y-10 translate-x-10 pointer-events-none"></div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Note Modal */}
          <AnimatePresence>
            {showEditNoteModal && editingNote && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-end pr-[28rem]"
              >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" />
                
                {/* Modal */}
                <motion.div
                  initial={{ x: 400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 400, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: `${modalWidth}px` }}
                  className="relative h-[700px] bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-l-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden"
                >
                  {/* Glass Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 dark:from-gray-700/5 dark:to-gray-700/10 rounded-l-3xl"></div>
                  
                  {/* Modal Header */}
                  <div className="relative z-10 p-6 border-b border-emerald-300/30 dark:border-emerald-400/30 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 dark:from-emerald-500/20 dark:to-teal-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-100">
                        Notu Düzenle
                        {editingNote.courseTitle && (
                          <span className="block text-sm font-normal text-emerald-600 dark:text-emerald-300 mt-1">
                            {editingNote.courseTitle}
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleTogglePinEdit}
                          className={`p-2 rounded-full transition-colors ${
                            editingNote.isPinned 
                              ? "bg-red-400/20 text-red-600 dark:text-red-400" 
                              : "hover:bg-emerald-300/20 dark:hover:bg-emerald-400/20 text-emerald-700 dark:text-emerald-300"
                          }`}
                        >
                          <Pin className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleToggleImportantEdit}
                          className={`p-2 rounded-full transition-colors ${
                            editingNote.isImportant 
                              ? "bg-yellow-400/20 text-yellow-600 dark:text-yellow-400" 
                              : "hover:bg-emerald-300/20 dark:hover:bg-emerald-400/20 text-emerald-700 dark:text-emerald-300"
                          }`}
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowEditNoteModal(false)}
                          className="p-2 hover:bg-emerald-300/20 dark:hover:bg-emerald-400/20 rounded-full transition-colors"
                        >
                          <X className="h-5 w-4 text-emerald-700 dark:text-emerald-300" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="relative z-10 p-6 space-y-4 h-[calc(700px-140px)]">
                    {/* Note Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Not Başlığı
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Not başlığını girin..."
                        className="w-full px-4 py-3 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-2xl text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                      />
                    </div>

                    {/* Note Content */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Not İçeriği
                      </label>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Notunuzu buraya yazın..."
                        rows={12}
                        className="w-full h-full px-4 py-3 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-2xl text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 resize-none"
                      />
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={handleUpdateNote}
                      disabled={!editTitle.trim() || !editContent.trim()}
                      className="w-full bg-gradient-to-r from-emerald-500/90 to-teal-600/90 backdrop-blur-sm text-white py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 font-medium shadow-lg border border-white/20 dark:border-gray-600/30 hover:from-emerald-600/90 hover:to-teal-700/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Save className="h-4 w-4" />
                      Değişiklikleri Kaydet
                    </button>
                  </div>

                  {/* Resize Handle */}
                  <div
                    onMouseDown={handleMouseDown}
                    className="absolute bottom-0 left-0 w-6 h-6 cursor-nw-resize hover:bg-emerald-400/30 dark:hover:bg-emerald-400/30 transition-all duration-200 group rounded-br-lg"
                  >
                    <div className="absolute bottom-1 left-1 w-4 h-4 bg-emerald-400/50 dark:bg-emerald-300/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-2 left-2 w-2 h-2 bg-emerald-400/70 dark:bg-emerald-300/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-bl from-emerald-100/10 dark:from-emerald-400/5 to-transparent rounded-full translate-y-12 -translate-x-12 pointer-events-none"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tr from-teal-100/10 dark:from-teal-400/5 to-transparent rounded-full -translate-y-10 translate-x-10 pointer-events-none"></div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
