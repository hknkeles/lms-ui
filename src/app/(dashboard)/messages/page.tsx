"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  MessageSquare, 
  RefreshCw,
  ChevronLeft,
  Maximize
} from "lucide-react";
import ConversationList from "@/components/ui/ConversationList";
import ChatWindow from "@/components/ui/ChatWindow";
import { Conversation, conversations as initialConversations } from "@/data/conversations";
import { useSidebar } from "@/contexts/SidebarContext";

export default function MessagesPage() {
  const { sidebarOpen } = useSidebar();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Load conversations from mock data
  useEffect(() => {
    const loadConversations = () => {
      try {
        setConversations(initialConversations);
      } catch (error) {
        console.error("Konuşmalar yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Filter conversations based on search
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    
    return conversations.filter(conv =>
      conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = (content: string, attachments?: File[]) => {
    if (!selectedConversation) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      content,
      timestamp: new Date().toISOString(),
      isFromUser: true,
      isRead: true,
      attachments: attachments?.map(file => ({
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
      }))
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: {
            content,
            timestamp: newMessage.timestamp,
            isFromUser: true
          }
        };
      }
      return conv;
    }));

    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: {
        content,
        timestamp: newMessage.timestamp,
        isFromUser: true
      }
    } : null);
  };

  const handleMarkAsRead = (messageId: string) => {
    if (!selectedConversation) return;

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation.id) {
        const updatedMessages = conv.messages.map(msg =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        );
        const unreadCount = updatedMessages.filter(msg => !msg.isFromUser && !msg.isRead).length;
        
        return {
          ...conv,
          messages: updatedMessages,
          unreadCount
        };
      }
      return conv;
    }));

    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: prev.messages.map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ),
      unreadCount: prev.messages.filter(msg => !msg.isFromUser && !msg.isRead).length
    } : null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Konuşmalar yükleniyor...
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
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mesajlar</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Öğretmenlerin ve sınıf arkadaşlarınla mesajlaş</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Content with top padding for navbar */}
      <div className="pt-16">
        {/* Chat Interface */}
        <div className="flex-1 flex bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden h-[calc(100vh-5rem)]">
        {/* Conversation List */}
        <ConversationList
          conversations={filteredConversations}
          selectedConversationId={selectedConversation?.id || null}
          onSelectConversation={handleSelectConversation}
          onSearch={setSearchQuery}
          onNewConversation={() => {
            // Burada yeni konuşma modal'ı açılacak
            console.log("Yeni konuşma başlatılıyor...");
          }}
        />

        {/* Chat Window */}
        <ChatWindow
          conversation={selectedConversation}
          onBack={() => setSelectedConversation(null)}
          onSendMessage={handleSendMessage}
          onMarkAsRead={handleMarkAsRead}
        />
        </div>
      </div>
    </div>
  );
}
