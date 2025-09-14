"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Info,
  ArrowLeft,
  Pin,
  Archive,
  Trash2
} from "lucide-react";
import { Conversation, Message } from "@/data/conversations";

interface ChatWindowProps {
  conversation: Conversation | null;
  onBack: () => void;
  onSendMessage: (content: string, attachments?: File[]) => void;
  onMarkAsRead: (messageId: string) => void;
}

export default function ChatWindow({ 
  conversation, 
  onBack, 
  onSendMessage,
  onMarkAsRead 
}: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (conversation) {
      conversation.messages.forEach(message => {
        if (!message.isFromUser && !message.isRead) {
          onMarkAsRead(message.id);
        }
      });
    }
  }, [conversation, onMarkAsRead]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("tr-TR", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Bugün";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Dün";
    } else {
      return date.toLocaleDateString("tr-TR", { 
        day: "numeric", 
        month: "long" 
      });
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onSendMessage("", files);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Bir konuşma seçin
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Sol panelden bir konuşma seçerek mesajlaşmaya başlayın
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">
                  {conversation.participant.avatar}
                </span>
              </div>
              {conversation.participant.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {conversation.participant.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {conversation.participant.isOnline 
                  ? "Çevrimiçi" 
                  : conversation.participant.lastSeen || "Çevrimdışı"
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Video className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Info className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((message, index) => {
          const showDate = index === 0 || 
            formatDate(message.timestamp) !== formatDate(conversation.messages[index - 1].timestamp);
          
          return (
            <div key={message.id}>
              {showDate && (
                <div className="flex justify-center mb-4">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              )}
              
              <div className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.isFromUser
                    ? 'bg-primary-500 text-white rounded-br-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 bg-white/10 dark:bg-gray-600/20 rounded-lg"
                        >
                          <Paperclip className="h-4 w-4" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {attachment.name}
                            </p>
                            <p className="text-xs opacity-75">
                              {attachment.size}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className={`flex items-center justify-end gap-1 mt-1 ${
                    message.isFromUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <span className="text-xs">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.isFromUser && (
                      <div className="ml-1">
                        {message.isRead ? (
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        ) : (
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-end gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          >
            <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesajınızı yazın..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none max-h-32"
              rows={1}
            />
          </div>
          
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          >
            <Smile className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
