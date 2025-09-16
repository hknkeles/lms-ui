"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  RefreshCw,
  ChevronLeft,
  Maximize,
  Search,
  Filter,
  Pin,
  Eye,
  Heart,
  Download,
  Calendar,
  Clock,
  User,
  Tag,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  X,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Bookmark,
  Share2,
  MessageCircle
} from "lucide-react";
import { 
  mockPosts, 
  Post, 
  getPostsByCategory,
  formatTimestamp 
} from "@/data/social";
import { useSidebar } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Card from "@/components/shared/Card";
import { Badge } from "@/components/ui/badge";
import CreatePostForm from "@/components/ui/CreatePostForm";
import SocialPost from "@/components/ui/SocialPost";

export default function ForumPage() {
  const { sidebarOpen } = useSidebar();
  const router = useRouter();
  const [postsData, setPostsData] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<"date" | "priority" | "title" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load posts
  useEffect(() => {
    const loadPosts = () => {
      try {
        setPostsData(mockPosts);
      } catch (error) {
        console.error("Gönderiler yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = postsData;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Priority filter
    if (selectedPriority !== "all") {
      filtered = filtered.filter(post => post.priority === selectedPriority);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    // Sort posts
    filtered.sort((a, b) => {
      // Pinned posts always come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      let comparison = 0;
      
      switch (sortBy) {
        case "title":
          comparison = a.content.localeCompare(b.content);
          break;
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "date":
        default:
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [postsData, selectedCategory, selectedPriority, searchQuery, sortBy, sortOrder]);

  const totalPosts = postsData.length;
  const pinnedPosts = postsData.filter(post => post.isPinned).length;
  const solvedQuestions = postsData.filter(post => post.category === "question" && post.isSolved).length;

  // Social media interaction handlers
  const handlePostLike = (postId: string) => {
    setPostsData(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          } 
        : post
    ));
  };

  const handlePostShare = (postId: string) => {
    setPostsData(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isShared: !post.isShared,
            shares: post.isShared ? post.shares - 1 : post.shares + 1
          } 
        : post
    ));
  };

  const handlePostBookmark = (postId: string) => {
    // Bookmark functionality
    console.log("Bookmark post:", postId);
  };

  const handlePostComment = (postId: string, content: string) => {
    const newComment = {
      id: `comment_${Date.now()}`,
      content,
      author: {
        id: "user_1",
        name: "Merve Özkan",
        role: "Öğrenci",
        avatar: "MÖ",
        isOnline: true
      },
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      isSolution: false
    };

    setPostsData(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));
  };

  const handleCommentLike = (postId: string, commentId: string) => {
    setPostsData(prev => prev.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments: post.comments.map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    isLiked: !comment.isLiked,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
                  }
                : comment
            )
          }
        : post
    ));
  };

  const handleMarkSolution = (postId: string, commentId: string) => {
    setPostsData(prev => prev.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments: post.comments.map(comment =>
              comment.id === commentId
                ? { ...comment, isSolution: true }
                : { ...comment, isSolution: false }
            ),
            isSolved: true
          }
        : post
    ));
  };

  const handleCreatePost = (postData: {
    content: string;
    category: "question" | "announcement" | "discussion" | "resource";
    priority: "high" | "medium" | "low";
    tags: string[];
    attachments: File[];
    images: File[];
  }) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      content: postData.content,
      author: {
        id: "user_1",
        name: "Merve Özkan",
        role: "Öğrenci",
        avatar: "MÖ",
        isOnline: true
      },
      timestamp: new Date().toISOString(),
      category: postData.category,
      priority: postData.priority,
      tags: postData.tags,
      attachments: postData.attachments.map((file, index) => ({
        id: `att_${Date.now()}_${index}`,
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        url: URL.createObjectURL(file)
      })),
      images: postData.images.map((file, index) => ({
        id: `img_${Date.now()}_${index}`,
        url: URL.createObjectURL(file),
        caption: file.name
      })),
      likes: 0,
      isLiked: false,
      comments: [],
      shares: 0,
      isShared: false,
      isPinned: false,
      views: 0
    };

    setPostsData(prev => [newPost, ...prev]);
    setShowCreatePost(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Forum yükleniyor...
        </div>
      </div>
    );
  }

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
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Öğrenci Forumu</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {totalPosts} gönderi • {solvedQuestions} çözülmüş soru
                  </p>
                </div>
              </div>
            </div>
            
            {/* Search Bar - Center */}
            <div className="flex-1 max-w-sm mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Forum ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

              {/* Create Post Button */}
              <Button
                onClick={() => setShowCreatePost(true)}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Gönderi Oluştur
              </Button>

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
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">Tüm Kategoriler</option>
                    <option value="discussion">Tartışma</option>
                    <option value="question">Soru</option>
                    <option value="announcement">Duyuru</option>
                    <option value="resource">Kaynak</option>
                  </select>

                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">Tüm Öncelikler</option>
                    <option value="high">Yüksek</option>
                    <option value="medium">Orta</option>
                    <option value="low">Düşük</option>
                  </select>

                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedPriority("all");
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
                    onChange={(e) => setSortBy(e.target.value as "date" | "priority" | "title" | "category")}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="date">Tarih</option>
                    <option value="priority">Öncelik</option>
                    <option value="title">Başlık</option>
                    <option value="category">Kategori</option>
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

      {/* Content */}
      <div className={`px-4 py-4 pb-16 transition-all duration-300 ${
        isFilterOpen ? 'pt-32' : 'pt-20'
      }`}>
        <div className="max-w-4xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Gönderi</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{totalPosts}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Pin className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sabitlenmiş</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{pinnedPosts}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Çözülmüş</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{solvedQuestions}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Create Post Form */}
          {showCreatePost && (
            <CreatePostForm
              onSubmit={handleCreatePost}
              onCancel={() => setShowCreatePost(false)}
            />
          )}

          {/* Social Posts Feed */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <SocialPost
                key={post.id}
                post={post}
                onLike={handlePostLike}
                onShare={handlePostShare}
                onBookmark={handlePostBookmark}
                onComment={handlePostComment}
                onCommentLike={handleCommentLike}
                onMarkSolution={handleMarkSolution}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Gönderi bulunamadı
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Arama kriterlerinize uygun gönderi bulunamadı.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  İlk Gönderiyi Oluştur
                </button>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedPriority("all");
                  }}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Filtreleri Sıfırla
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
