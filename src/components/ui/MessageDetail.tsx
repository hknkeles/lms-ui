"use client";

import { useState } from "react";
import { 
  ArrowLeft, 
  Reply, 
  Forward, 
  Archive, 
  Star, 
  Download,
  Paperclip,
  Clock,
  User,
  Mail,
  Calendar,
  Tag
} from "lucide-react";

import { Message } from "@/data/messages";

interface MessageDetailProps {
  message: Message;
  onBack: () => void;
  onReply: (message: Message) => void;
  onForward: (message: Message) => void;
  onArchive: (messageId: string) => void;
  onMarkAsRead: (messageId: string) => void;
}

export default function MessageDetail({ 
  message, 
  onBack, 
  onReply, 
  onForward, 
  onArchive, 
  onMarkAsRead 
}: MessageDetailProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700";
      case "medium": return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700";
      case "low": return "text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700";
      default: return "text-gray-500 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic": return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700";
      case "grades": return "text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700";
      case "schedule": return "text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700";
      case "career": return "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700";
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

  const handleSendReply = () => {
    if (replyContent.trim()) {
      // Burada gerçek uygulamada API çağrısı yapılacak
      console.log("Yanıt gönderiliyor:", replyContent);
      setReplyContent("");
      setShowReplyForm(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mesaj Detayı
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onArchive(message.id)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Arşivle"
          >
            <Archive className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => onForward(message)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="İlet"
          >
            <Forward className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Message Header */}
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-lg">
                {message.fromAvatar}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {message.from}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(message.category)}`}>
                  {getCategoryLabel(message.category)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(message.priority)}`}>
                  {message.priority === "high" ? "Yüksek Öncelik" : message.priority === "medium" ? "Orta Öncelik" : "Düşük Öncelik"}
                </span>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {message.fromRole}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDate(message.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {message.to}
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {message.subject}
          </h1>
        </div>

        {/* Message Body */}
        <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Ekler ({message.attachments.length})
            </h4>
            <div className="space-y-2">
              {message.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 dark:text-red-400 font-semibold text-xs">
                        {attachment.type.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {attachment.size}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Yanıtla
            </h4>
            <div className="space-y-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Yanıtınızı yazın..."
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendReply}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Yanıtı Gönder
                </button>
                <button
                  onClick={() => setShowReplyForm(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReplyForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Reply className="h-4 w-4" />
            Yanıtla
          </button>
          <button
            onClick={() => onForward(message)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Forward className="h-4 w-4" />
            İlet
          </button>
          {!message.isRead && (
            <button
              onClick={() => onMarkAsRead(message.id)}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Okundu Olarak İşaretle
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
