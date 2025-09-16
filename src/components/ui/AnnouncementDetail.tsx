"use client";

import { useState } from "react";
import { 
  X, 
  Heart, 
  Eye, 
  Download, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Pin,
  Share2,
  Bookmark,
  CheckCircle,
  AlertCircle,
  Info,
  Star
} from "lucide-react";
import { Announcement } from "@/data/announcements";
import { Button } from "@/components/ui/button";
import Card from "@/components/shared/Card";
import { Badge } from "@/components/ui/badge";

interface AnnouncementDetailProps {
  announcement: Announcement;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onToggleLike: (id: string) => void;
}

export default function AnnouncementDetail({
  announcement,
  isOpen,
  onClose,
  onMarkAsRead,
  onToggleLike
}: AnnouncementDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "general": return <Info className="h-5 w-5" />;
      case "academic": return <Star className="h-5 w-5" />;
      case "event": return <Calendar className="h-5 w-5" />;
      case "urgent": return <AlertCircle className="h-5 w-5" />;
      case "system": return <CheckCircle className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "general": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "academic": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "event": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "urgent": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "system": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500";
      case "medium": return "border-l-yellow-500";
      case "low": return "border-l-green-500";
      default: return "border-l-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: announcement.title,
        text: announcement.content,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${announcement.title}\n\n${announcement.content}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-2xl max-h-[90vh] overflow-hidden border-l-4 ${getPriorityColor(announcement.priority)}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Author Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {announcement.author.avatar}
                </div>
              </div>

              {/* Title and Author Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {announcement.isPinned && (
                    <Pin className="h-4 w-4 text-yellow-500" />
                  )}
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {announcement.title}
                  </h2>
                  {!announcement.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {announcement.author.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">•</span>
                    {announcement.author.role}
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Meta Information */}
          <div className="flex items-center gap-4 flex-wrap">
            <Badge className={`${getCategoryColor(announcement.category)} text-sm`}>
              {getCategoryIcon(announcement.category)}
              <span className="ml-1 capitalize">{announcement.category}</span>
            </Badge>
            
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              {formatDate(announcement.publishDate)}
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Eye className="h-4 w-4" />
              {announcement.readCount} okundu
            </div>

            {announcement.expiryDate && (
              <div className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400">
                <Clock className="h-4 w-4" />
                Son geçerlilik: {formatDate(announcement.expiryDate)}
              </div>
            )}
          </div>

          {/* Tags */}
          {announcement.tags && announcement.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <Tag className="h-4 w-4 text-gray-400" />
              <div className="flex gap-2 flex-wrap">
                {announcement.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {announcement.content}
            </p>
          </div>

          {/* Attachments */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Ekler
              </h4>
              <div className="space-y-2">
                {announcement.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {attachment.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {attachment.type.toUpperCase()} • {attachment.size}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      İndir
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onToggleLike(announcement.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  announcement.isLiked 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Heart className={`h-4 w-4 ${announcement.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">
                  {announcement.likeCount}
                </span>
              </button>

              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">Kaydet</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span className="text-sm font-medium">Paylaş</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {!announcement.isRead && (
                <Button
                  variant="outline"
                  onClick={() => onMarkAsRead(announcement.id)}
                  className="text-sm"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Okundu İşaretle
                </Button>
              )}
              <Button onClick={onClose} className="text-sm">
                Kapat
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
