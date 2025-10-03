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
import StudentNavbar from "@/components/student/StudentNavbar";
import { Home } from "lucide-react";

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
      <StudentNavbar 
        title="Mesajlar"
        subtitle="Öğretmenlerin ve sınıf arkadaşlarınla mesajlaş"
        icon={<MessageSquare className="h-5 w-5 text-white" />}
        breadcrumb={{
          items: [
            {
              label: "Ana Sayfa",
              href: "/",
              icon: <Home className="h-3 w-3" />
            },
            {
              label: "Mesajlar",
              active: true
            }
          ]
        }}
      />

      {/* Content with top padding for navbar */}
      <div className="pt-24">
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
