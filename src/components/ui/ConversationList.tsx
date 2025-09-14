"use client";

import { useState } from "react";
import { 
  Search, 
  Pin, 
  MoreVertical,
  MessageCircle,
  Clock,
  Check,
  CheckCheck,
  Plus
} from "lucide-react";
import { Conversation } from "@/data/conversations";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  onSearch: (query: string) => void;
  onNewConversation: () => void;
}

export default function ConversationList({ 
  conversations, 
  selectedConversationId, 
  onSelectConversation,
  onSearch,
  onNewConversation
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPinned = showPinnedOnly ? conv.isPinned : true;
    return matchesSearch && matchesPinned;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
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
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mesajlar
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onNewConversation}
              className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              title="Yeni Konuşma"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowPinnedOnly(!showPinnedOnly)}
              className={`p-2 rounded-lg transition-colors ${
                showPinnedOnly 
                  ? "bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" 
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title="Sabitlenmiş Konuşmalar"
            >
              <Pin className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Konuşmalarda ara..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Konuşma bulunamadı
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Arama kriterlerinize uygun konuşma bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`relative p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1 ${
                  selectedConversationId === conversation.id
                    ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                {/* Pinned indicator */}
                {conversation.isPinned && (
                  <div className="absolute top-2 right-2">
                    <Pin className="h-3 w-3 text-primary-500" />
                  </div>
                )}

                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {conversation.participant.avatar}
                      </span>
                    </div>
                    {conversation.participant.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {conversation.participant.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                        {conversation.lastMessage.isFromUser && (
                          <div className="ml-1">
                            {conversation.lastMessage.isRead ? (
                              <CheckCheck className="h-3 w-3 text-blue-500" />
                            ) : (
                              <Check className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(conversation.category)}`}>
                        {getCategoryLabel(conversation.category)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {conversation.participant.role}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {conversation.lastMessage.isFromUser ? "Sen: " : ""}
                      {conversation.lastMessage.content}
                    </p>
                  </div>

                  {/* Unread count */}
                  {conversation.unreadCount > 0 && (
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
