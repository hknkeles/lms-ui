export interface Message {
  id: string;
  content: string;
  timestamp: string;
  isFromUser: boolean;
  isRead: boolean;
  attachments?: Array<{
    name: string;
    type: string;
    size: string;
    url?: string;
  }>;
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    isOnline: boolean;
    lastSeen?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isFromUser: boolean;
  };
  unreadCount: number;
  isPinned: boolean;
  category: "academic" | "grades" | "schedule" | "career" | "general";
  priority: "high" | "medium" | "low";
  messages: Message[];
}

export const conversations: Conversation[] = [
  {
    id: "conv1",
    participant: {
      id: "prof1",
      name: "Prof. Dr. Ahmet Yılmaz",
      role: "Öğretim Üyesi",
      avatar: "AY",
      isOnline: true,
      lastSeen: "2 dakika önce"
    },
    lastMessage: {
      content: "Final projeni inceledim. Çok güzel bir çalışma olmuş. Sadece birkaç küçük düzeltme yapman gerekiyor.",
      timestamp: "2025-01-15T14:30:00Z",
      isFromUser: false
    },
    unreadCount: 2,
    isPinned: true,
    category: "academic",
    priority: "high",
    messages: [
      {
        id: "msg1",
        content: "Merhaba Profesör, final projem hakkında bir sorum var.",
        timestamp: "2025-01-15T14:00:00Z",
        isFromUser: true,
        isRead: true
      },
      {
        id: "msg2",
        content: "Merhaba Merve, tabii ki. Hangi konuda yardımcı olabilirim?",
        timestamp: "2025-01-15T14:05:00Z",
        isFromUser: false,
        isRead: true
      },
      {
        id: "msg3",
        content: "Metodoloji bölümünde hangi yaklaşımı kullanmamı önerirsiniz?",
        timestamp: "2025-01-15T14:10:00Z",
        isFromUser: true,
        isRead: true
      },
      {
        id: "msg4",
        content: "Final projeni inceledim. Çok güzel bir çalışma olmuş. Sadece birkaç küçük düzeltme yapman gerekiyor.",
        timestamp: "2025-01-15T14:30:00Z",
        isFromUser: false,
        isRead: false,
        attachments: [
          {
            name: "proje_geribildirim.pdf",
            type: "pdf",
            size: "2.3 MB"
          }
        ]
      }
    ]
  },
  {
    id: "conv2",
    participant: {
      id: "dr1",
      name: "Dr. Sarah Johnson",
      role: "Doçent",
      avatar: "SJ",
      isOnline: false,
      lastSeen: "1 saat önce"
    },
    lastMessage: {
      content: "Essay'ini aldım. Çok iyi yazılmış! Sadece birkaç gramer hatası var.",
      timestamp: "2025-01-14T09:15:00Z",
      isFromUser: false
    },
    unreadCount: 0,
    isPinned: false,
    category: "academic",
    priority: "medium",
    messages: [
      {
        id: "msg5",
        content: "Essay ödevimi gönderdim, inceleyebilir misiniz?",
        timestamp: "2025-01-14T08:00:00Z",
        isFromUser: true,
        isRead: true
      },
      {
        id: "msg6",
        content: "Essay'ini aldım. Çok iyi yazılmış! Sadece birkaç gramer hatası var, onları düzeltebilirsin.",
        timestamp: "2025-01-14T09:15:00Z",
        isFromUser: false,
        isRead: true
      }
    ]
  },
  {
    id: "conv3",
    participant: {
      id: "prof2",
      name: "Prof. Dr. Mehmet Kaya",
      role: "Profesör",
      avatar: "MK",
      isOnline: true,
      lastSeen: "5 dakika önce"
    },
    lastMessage: {
      content: "Programlama ödevini başarıyla tamamladın. Tebrikler!",
      timestamp: "2025-01-12T16:45:00Z",
      isFromUser: false
    },
    unreadCount: 0,
    isPinned: false,
    category: "academic",
    priority: "low",
    messages: [
      {
        id: "msg7",
        content: "Programlama ödevini başarıyla tamamladın. Tebrikler! Kod kaliten çok yüksek ve algoritma yaklaşımın çok etkili.",
        timestamp: "2025-01-12T16:45:00Z",
        isFromUser: false,
        isRead: true
      }
    ]
  },
  {
    id: "conv4",
    participant: {
      id: "dr2",
      name: "Dr. Elif Demir",
      role: "Öğretim Üyesi",
      avatar: "ED",
      isOnline: false,
      lastSeen: "3 saat önce"
    },
    lastMessage: {
      content: "Vize sınavının sonuçları açıklandı. 85 puan aldın!",
      timestamp: "2025-01-10T11:20:00Z",
      isFromUser: false
    },
    unreadCount: 1,
    isPinned: false,
    category: "grades",
    priority: "high",
    messages: [
      {
        id: "msg8",
        content: "Vize sınavının sonuçları açıklandı. 85 puan aldın, bu çok iyi bir sonuç! Sınıf ortalaması 72 puan.",
        timestamp: "2025-01-10T11:20:00Z",
        isFromUser: false,
        isRead: false
      }
    ]
  },
  {
    id: "conv5",
    participant: {
      id: "dr3",
      name: "Dr. Can Özkan",
      role: "Öğretim Üyesi",
      avatar: "CO",
      isOnline: true,
      lastSeen: "Az önce"
    },
    lastMessage: {
      content: "Proje sunumunuz 25 Ocak'ta saat 14:00'te yapılacak.",
      timestamp: "2025-01-08T13:30:00Z",
      isFromUser: false
    },
    unreadCount: 0,
    isPinned: true,
    category: "schedule",
    priority: "high",
    messages: [
      {
        id: "msg9",
        content: "Proje sunumunuz 25 Ocak'ta saat 14:00'te yapılacak. Sunum süreniz 15 dakika olacak.",
        timestamp: "2025-01-08T13:30:00Z",
        isFromUser: false,
        isRead: true
      }
    ]
  }
];
