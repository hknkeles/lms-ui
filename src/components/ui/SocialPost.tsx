"use client";

import { useState } from "react";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreVertical,
  User,
  Clock,
  Eye,
  Download,
  Image as ImageIcon,
  FileText,
  CheckCircle,
  AlertCircle,
  Star,
  BookOpen,
  Users,
  MessageCircle as MessageCircleIcon,
  ThumbsUp,
  Reply,
  Flag,
  Send
} from "lucide-react";
import { Post, Comment, formatTimestamp } from "@/data/social";
import { Button } from "@/components/ui/button";
import Card from "@/components/shared/Card";
import { Badge } from "@/components/ui/badge";
import { currentUser } from "@/data/social";

interface SocialPostProps {
  post: Post;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onCommentLike: (postId: string, commentId: string) => void;
  onMarkSolution: (postId: string, commentId: string) => void;
}

export default function SocialPost({
  post,
  onLike,
  onShare,
  onBookmark,
  onComment,
  onCommentLike,
  onMarkSolution
}: SocialPostProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "question": return <AlertCircle className="h-4 w-4" />;
      case "announcement": return <MessageCircleIcon className="h-4 w-4" />;
      case "discussion": return <Users className="h-4 w-4" />;
      case "resource": return <BookOpen className="h-4 w-4" />;
      default: return <MessageCircleIcon className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "question": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "announcement": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "discussion": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "resource": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onComment(post.id, newComment.trim());
    setNewComment("");
  };

  return (
    <Card className="p-6 mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {post.author.avatar}
            </div>
            {post.author.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">{post.author.name}</h3>
              {post.isPinned && (
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Sabitlenmiş
                </Badge>
              )}
              {post.isSolved && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Çözüldü
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{post.author.role}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTimestamp(post.timestamp)}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.views} görüntüleme
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={getCategoryColor(post.category)}>
            {getCategoryIcon(post.category)}
            <span className="ml-1 capitalize">{post.category}</span>
          </Badge>
          
          <Badge className={getPriorityColor(post.priority)}>
            <Star className="h-3 w-3" />
            <span className="ml-1 capitalize">{post.priority}</span>
          </Badge>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </button>

          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="mb-4">
          <div className={`grid gap-2 ${
            post.images.length === 1 ? "grid-cols-1" :
            post.images.length === 2 ? "grid-cols-2" :
            post.images.length === 3 ? "grid-cols-2" :
            "grid-cols-2"
          }`}>
            {post.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={image.caption || "Post image"}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm rounded-b-lg">
                    {image.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attachments */}
      {post.attachments && post.attachments.length > 0 && (
        <div className="mb-4 space-y-2">
          {post.attachments.map((attachment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {attachment.type.toUpperCase()} • {attachment.size}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                İndir
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-6">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              post.isLiked
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
            <span className="text-sm font-medium">{post.likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{post.comments.length}</span>
          </button>

          <button
            onClick={() => onShare(post.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              post.isShared
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span className="text-sm font-medium">{post.shares}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Flag className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          {/* Comment Form */}
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {currentUser.avatar}
            </div>
            <form onSubmit={handleCommentSubmit} className="flex-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Yorum yazın..."
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <Button type="submit" size="sm" disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {comment.author.avatar}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        {comment.author.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(comment.timestamp)}
                      </span>
                      {comment.isSolution && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Çözüm
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {comment.content}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 ml-3">
                    <button
                      onClick={() => onCommentLike(post.id, comment.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        comment.isLiked
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      }`}
                    >
                      <ThumbsUp className={`h-3 w-3 ${comment.isLiked ? "fill-current" : ""}`} />
                      {comment.likes}
                    </button>
                    
                    {post.category === "question" && !comment.isSolution && (
                      <button
                        onClick={() => onMarkSolution(post.id, comment.id)}
                        className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Çözüm olarak işaretle
                      </button>
                    )}
                    
                    <button className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <Reply className="h-3 w-3" />
                      Yanıtla
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
