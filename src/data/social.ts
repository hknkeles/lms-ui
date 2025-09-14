export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
  isSolution?: boolean;
}

export interface Post {
  id: string;
  content: string;
  author: User;
  timestamp: string;
  category: "question" | "announcement" | "discussion" | "resource";
  priority: "high" | "medium" | "low";
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
    thumbnail?: string;
  }>;
  images?: Array<{
    id: string;
    url: string;
    caption?: string;
  }>;
  tags?: string[];
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  shares: number;
  isShared: boolean;
  isPinned: boolean;
  isSolved?: boolean;
  views: number;
}

export const currentUser: User = {
  id: "user_1",
  name: "Merve Özkan",
  role: "Öğrenci",
  avatar: "MÖ",
  isOnline: true
};

export const mockUsers: User[] = [
  currentUser,
  {
    id: "user_2",
    name: "Prof. Dr. Ahmet Yılmaz",
    role: "Öğretim Üyesi",
    avatar: "AY",
    isOnline: true
  },
  {
    id: "user_3",
    name: "Dr. Sarah Johnson",
    role: "Doçent",
    avatar: "SJ",
    isOnline: false
  },
  {
    id: "user_4",
    name: "Ali Demir",
    role: "Öğrenci",
    avatar: "AD",
    isOnline: true
  },
  {
    id: "user_5",
    name: "Zeynep Kaya",
    role: "Öğrenci",
    avatar: "ZK",
    isOnline: false
  }
];

export const mockPosts: Post[] = [
  {
    id: "post_1",
    content: "Merhaba arkadaşlar! Matematik dersindeki bu integral sorusunu çözemiyorum. Yardım edebilir misiniz? Çözümü adım adım açıklayabilir misiniz?",
    author: mockUsers[3], // Ali Demir
    timestamp: "2025-01-15T10:30:00Z",
    category: "question",
    priority: "high",
    images: [
      {
        id: "img_1",
        url: "/images/math-problem.jpg",
        caption: "İntegral sorusu"
      }
    ],
    tags: ["matematik", "integral", "yardım"],
    likes: 12,
    isLiked: false,
    comments: [
      {
        id: "comment_1",
        content: "Bu soruyu çözmek için önce u-substitution kullanman gerekiyor. İlk adımda u = x² + 1 dönüşümü yapabilirsin.",
        author: mockUsers[1], // Prof. Dr. Ahmet Yılmaz
        timestamp: "2025-01-15T11:15:00Z",
        likes: 8,
        isLiked: true,
        isSolution: true
      },
      {
        id: "comment_2",
        content: "Hocam teşekkürler! Şimdi daha net anladım. Bir de bu tür sorular için hangi kaynakları önerirsiniz?",
        author: mockUsers[3], // Ali Demir
        timestamp: "2025-01-15T11:45:00Z",
        likes: 3,
        isLiked: false
      }
    ],
    shares: 2,
    isShared: false,
    isPinned: false,
    isSolved: true,
    views: 45
  },
  {
    id: "post_2",
    content: "Bugün programlama dersinde öğrendiğimiz algoritma çok ilginçti! Özellikle binary search'in time complexity'si O(log n) olması harika. Sizce hangi projelerde kullanabiliriz?",
    author: mockUsers[4], // Zeynep Kaya
    timestamp: "2025-01-15T09:20:00Z",
    category: "discussion",
    priority: "medium",
    tags: ["programlama", "algoritma", "binary-search"],
    likes: 18,
    isLiked: true,
    comments: [
      {
        id: "comment_3",
        content: "Database'lerde index aramalarında çok kullanılır! Ayrıca oyunlarda high score listelerinde de binary search kullanabilirsin.",
        author: mockUsers[0], // Merve Özkan
        timestamp: "2025-01-15T09:45:00Z",
        likes: 5,
        isLiked: false
      }
    ],
    shares: 1,
    isShared: true,
    isPinned: false,
    views: 67
  },
  {
    id: "post_3",
    content: "Ders notlarımı paylaşıyorum. Bu hafta işlediğimiz konular çok önemli, final sınavında kesinlikle çıkacak!",
    author: mockUsers[1], // Prof. Dr. Ahmet Yılmaz
    timestamp: "2025-01-15T08:00:00Z",
    category: "resource",
    priority: "high",
    attachments: [
      {
        id: "att_1",
        name: "ders_notlari_hafta_3.pdf",
        type: "pdf",
        size: "2.1 MB",
        url: "/files/ders_notlari_hafta_3.pdf"
      }
    ],
    tags: ["ders-notları", "final", "önemli"],
    likes: 25,
    isLiked: true,
    comments: [
      {
        id: "comment_4",
        content: "Hocam çok teşekkürler! Notlar çok detaylı ve anlaşılır olmuş.",
        author: mockUsers[0], // Merve Özkan
        timestamp: "2025-01-15T08:30:00Z",
        likes: 7,
        isLiked: false
      }
    ],
    shares: 8,
    isShared: false,
    isPinned: true,
    views: 123
  },
  {
    id: "post_4",
    content: "Yarın yapılacak sınav için son dakika hatırlatması! Lütfen kimlik belgenizi unutmayın ve 15 dakika önce sınav salonunda olun.",
    author: mockUsers[2], // Dr. Sarah Johnson
    timestamp: "2025-01-14T16:00:00Z",
    category: "announcement",
    priority: "high",
    tags: ["sınav", "hatırlatma", "önemli"],
    likes: 15,
    isLiked: false,
    comments: [],
    shares: 12,
    isShared: false,
    isPinned: true,
    views: 89
  }
];

export const getPostsByCategory = (category: string) => {
  if (category === "all") return mockPosts;
  return mockPosts.filter(post => post.category === category);
};

export const getPostsByUser = (userId: string) => {
  return mockPosts.filter(post => post.author.id === userId);
};

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffTime < 60000) return "Az önce";
  if (diffTime < 3600000) return `${Math.floor(diffTime / 60000)} dakika önce`;
  if (diffTime < 86400000) return `${Math.floor(diffTime / 3600000)} saat önce`;
  if (diffDays === 1) return "Dün";
  if (diffDays < 7) return `${diffDays} gün önce`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
  return date.toLocaleDateString("tr-TR");
};
