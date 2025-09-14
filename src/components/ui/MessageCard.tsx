"use client";

import { useState } from "react";
import { 
  Clock, 
  Paperclip, 
  Reply, 
  Eye, 
  Star, 
  Archive,
  MoreVertical,
  User
} from "lucide-react";

import { Message } from "@/data/messages";

interface MessageCardProps {
  message: Message;
  onReply: (message: Message) => void;
  onView: (message: Message) => void;
  onToggleRead: (messageId: string) => void;
  onArchive: (messageId: string) => void;
}

export default function MessageCard({ 
  message, 
  onReply, 
  onView, 
  onToggleRead, 
  onArchive 
}: MessageCardProps) {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Az önce";
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    if (diffInHours < 48) return "Dün";
    return date.toLocaleDateString("tr-TR", { 
      day: "numeric", 
      month: "short" 
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500 bg-red-50 dark:bg-red-900/20";
      case "medium": return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case "low": return "text-green-500 bg-green-50 dark:bg-green-900/20";
      default: return "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic": return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
      case "grades": return "text-purple-600 bg-purple-50 dark:bg-purple-900/20";
      case "schedule": return "text-orange-600 bg-orange-50 dark:bg-orange-900/20";
      case "career": return "text-green-600 bg-green-50 dark:bg-green-900/20";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "academic": return "Akademik";
      case "grades": return "Notlar";
      case "schedule": return "Program";
      case "career": return "Kariyer";
      default: return "Genel";
    }
  };

  return (
    <div 
      className={`group relative bg-white dark:bg-gray-800 rounded-xl border transition-all duration-200 hover:shadow-md ${
        message.isRead 
          ? "border-gray-200 dark:border-gray-700" 
          : "border-primary-200 dark:border-primary-700 bg-primary-50/30 dark:bg-primary-900/10"
      }`}
    >
      {/* Unread indicator */}
      {!message.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-l-xl"></div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {message.fromAvatar}
                </span>
              </div>
              {!message.isRead && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>

            {/* Sender info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                  {message.from}
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(message.category)}`}>
                  {getCategoryLabel(message.category)}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {message.fromRole}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
              {message.priority === "high" ? "Yüksek" : message.priority === "medium" ? "Orta" : "Düşük"}
            </span>
            
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
              
              {showActions && (
                <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <button
                    onClick={() => {
                      onToggleRead(message.id);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {message.isRead ? "Okunmadı olarak işaretle" : "Okundu olarak işaretle"}
                  </button>
                  <button
                    onClick={() => {
                      onArchive(message.id);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Archive className="h-4 w-4" />
                    Arşivle
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subject */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {message.subject}
        </h3>

        {/* Content preview */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {message.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(message.date)}
            </span>
            
            {message.attachments && message.attachments.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                {message.attachments.length} ek
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onReply(message)}
              className="px-3 py-1.5 bg-primary-500 text-white text-xs rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-1"
            >
              <Reply className="h-3 w-3" />
              Yanıtla
            </button>
            <button
              onClick={() => onView(message)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
            >
              <Eye className="h-3 w-3" />
              Görüntüle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
