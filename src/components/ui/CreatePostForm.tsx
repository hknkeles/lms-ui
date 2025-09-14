"use client";

import { useState, useRef } from "react";
import { 
  Image, 
  FileText, 
  Tag, 
  X, 
  Send,
  Camera,
  Paperclip,
  Smile,
  MapPin,
  Users,
  AlertCircle,
  Star,
  MessageCircle,
  BookOpen
} from "lucide-react";
import { currentUser } from "@/data/social";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";

interface CreatePostFormProps {
  onSubmit: (post: {
    content: string;
    category: "question" | "announcement" | "discussion" | "resource";
    priority: "high" | "medium" | "low";
    tags: string[];
    attachments: File[];
    images: File[];
  }) => void;
  onCancel?: () => void;
}

export default function CreatePostForm({ onSubmit, onCancel }: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"question" | "announcement" | "discussion" | "resource">("discussion");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit({
      content: content.trim(),
      category,
      priority,
      tags,
      attachments,
      images
    });

    // Reset form
    setContent("");
    setCategory("discussion");
    setPriority("medium");
    setTags([]);
    setNewTag("");
    setAttachments([]);
    setImages([]);
    setIsExpanded(false);
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setImages([...images, ...imageFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "question": return <AlertCircle className="h-4 w-4" />;
      case "announcement": return <MessageCircle className="h-4 w-4" />;
      case "discussion": return <Users className="h-4 w-4" />;
      case "resource": return <BookOpen className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "question": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "announcement": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "discussion": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "resource": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getPriorityColor = (prio: string) => {
    switch (prio) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <Card className="p-6 mb-6">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {currentUser.avatar}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{currentUser.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</p>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Content Input */}
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ne düşünüyorsun? Bir soru sor, düşünce paylaş veya kaynak ekle..."
            className="w-full min-h-[120px] p-3 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            onFocus={() => setIsExpanded(true)}
          />
        </div>

        {/* Expanded Options */}
        {isExpanded && (
          <div className="space-y-4 mb-4">
            {/* Category and Priority */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="discussion">Tartışma</option>
                  <option value="question">Soru</option>
                  <option value="announcement">Duyuru</option>
                  <option value="resource">Kaynak</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Öncelik
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Etiketler
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Etiket ekle..."
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                />
                <Button
                  type="button"
                  onClick={handleTagAdd}
                  variant="outline"
                  size="sm"
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dosya Ekle
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="sm"
                >
                  <Paperclip className="h-4 w-4 mr-1" />
                  Dosya
                </Button>
                <Button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  variant="outline"
                  size="sm"
                >
                  <Camera className="h-4 w-4 mr-1" />
                  Fotoğraf
                </Button>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.zip,.rar"
              />
              <input
                ref={imageInputRef}
                type="file"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />

              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <X className="h-3 w-3 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Images Preview */}
              {images.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preview */}
        {content && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getCategoryColor(category)}>
                {getCategoryIcon(category)}
                <span className="ml-1 capitalize">{category}</span>
              </Badge>
              <Badge className={getPriorityColor(priority)}>
                <Star className="h-3 w-3" />
                <span className="ml-1 capitalize">{priority}</span>
              </Badge>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{content}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Fotoğraf ekle"
            >
              <Image className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Dosya ekle"
            >
              <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Konum ekle"
            >
              <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Emoji ekle"
            >
              <Smile className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                size="sm"
              >
                İptal
              </Button>
            )}
            <Button
              type="submit"
              disabled={!content.trim()}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="h-4 w-4 mr-1" />
              Paylaş
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
