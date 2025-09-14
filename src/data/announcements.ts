export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  category: "general" | "academic" | "event" | "urgent" | "system";
  priority: "high" | "medium" | "low";
  publishDate: string;
  expiryDate?: string;
  isRead: boolean;
  isPinned: boolean;
  attachments?: Array<{
    name: string;
    type: string;
    size: string;
    url: string;
  }>;
  tags?: string[];
  readCount: number;
  likeCount: number;
  isLiked: boolean;
}

export const announcements: Announcement[] = [
  {
    id: "ann_1",
    title: "Yarıyıl Tatili Duyurusu",
    content: "Sevgili öğrenciler, 2024-2025 eğitim öğretim yılı güz yarıyılı tatili 1 Şubat 2025 tarihinde başlayacaktır. Tatil süresince kampüs hizmetleri sınırlı olarak devam edecektir. Kütüphane ve bilgisayar laboratuvarları hafta içi 09:00-17:00 saatleri arasında açık olacaktır.",
    author: {
      name: "Prof. Dr. Ayşe Demir",
      role: "Rektör Yardımcısı",
      avatar: "AD"
    },
    category: "general",
    priority: "high",
    publishDate: "2025-01-15T10:00:00Z",
    expiryDate: "2025-02-01T00:00:00Z",
    isRead: false,
    isPinned: true,
    tags: ["tatil", "kampüs", "hizmetler"],
    readCount: 1247,
    likeCount: 89,
    isLiked: false
  },
  {
    id: "ann_2",
    title: "Final Sınav Programı Açıklandı",
    content: "Final sınav programı sisteme yüklenmiştir. Sınavlar 20-31 Ocak 2025 tarihleri arasında yapılacaktır. Sınav yerlerinizi ve saatlerinizi kontrol etmeyi unutmayın. Geç kalma durumunda sınava alınmayacaksınız.",
    author: {
      name: "Dr. Mehmet Kaya",
      role: "Öğrenci İşleri Müdürü",
      avatar: "MK"
    },
    category: "academic",
    priority: "high",
    publishDate: "2025-01-14T14:30:00Z",
    expiryDate: "2025-01-31T23:59:00Z",
    isRead: true,
    isPinned: true,
    attachments: [
      {
        name: "final_sinav_programi.pdf",
        type: "pdf",
        size: "1.2 MB",
        url: "/files/final_sinav_programi.pdf"
      }
    ],
    tags: ["final", "sınav", "program"],
    readCount: 2156,
    likeCount: 156,
    isLiked: true
  },
  {
    id: "ann_3",
    title: "Teknoloji Sempozyumu Kayıtları Başladı",
    content: "Üniversitemiz tarafından düzenlenen 'Geleceğin Teknolojileri' sempozyumu için kayıtlar başlamıştır. Sempozyum 15-16 Şubat 2025 tarihlerinde gerçekleştirilecektir. Alanında uzman konuşmacıların yer alacağı bu etkinliğe katılım ücretsizdir.",
    author: {
      name: "Dr. Zeynep Arslan",
      role: "Etkinlik Koordinatörü",
      avatar: "ZA"
    },
    category: "event",
    priority: "medium",
    publishDate: "2025-01-13T09:00:00Z",
    expiryDate: "2025-02-10T23:59:00Z",
    isRead: false,
    isPinned: false,
    tags: ["sempozyum", "teknoloji", "etkinlik"],
    readCount: 892,
    likeCount: 67,
    isLiked: false
  },
  {
    id: "ann_4",
    title: "Sistem Bakımı Duyurusu",
    content: "LMS sisteminde 18 Ocak 2025 Cumartesi günü 02:00-06:00 saatleri arasında planlı bakım çalışması yapılacaktır. Bu süre zarfında sistem erişimi kesintiye uğrayacaktır. Çalışmaların tamamlanmasının ardından sistem normal şekilde hizmet verecektir.",
    author: {
      name: "Bilgi İşlem Daire Başkanlığı",
      role: "Sistem Yöneticisi",
      avatar: "Bİ"
    },
    category: "system",
    priority: "medium",
    publishDate: "2025-01-12T16:00:00Z",
    expiryDate: "2025-01-18T06:00:00Z",
    isRead: true,
    isPinned: false,
    tags: ["bakım", "sistem", "kesinti"],
    readCount: 3421,
    likeCount: 23,
    isLiked: false
  },
  {
    id: "ann_5",
    title: "Staj Başvuru Son Tarihi Yaklaşıyor",
    content: "Yaz dönemi staj başvurularının son tarihi 25 Ocak 2025'tir. Başvuru yapmak isteyen öğrencilerin gerekli belgeleri hazırlayarak öğrenci işlerine teslim etmeleri gerekmektedir. Eksik belge ile yapılan başvurular kabul edilmeyecektir.",
    author: {
      name: "Dr. Can Özkan",
      role: "Staj Koordinatörü",
      avatar: "CO"
    },
    category: "academic",
    priority: "high",
    publishDate: "2025-01-11T11:15:00Z",
    expiryDate: "2025-01-25T17:00:00Z",
    isRead: false,
    isPinned: false,
    attachments: [
      {
        name: "staj_basvuru_formu.pdf",
        type: "pdf",
        size: "856 KB",
        url: "/files/staj_basvuru_formu.pdf"
      },
      {
        name: "staj_rehberi.pdf",
        type: "pdf",
        size: "2.1 MB",
        url: "/files/staj_rehberi.pdf"
      }
    ],
    tags: ["staj", "başvuru", "son tarih"],
    readCount: 1567,
    likeCount: 134,
    isLiked: true
  },
  {
    id: "ann_6",
    title: "Kampüs Wi-Fi Ağı Güncellendi",
    content: "Kampüs genelindeki Wi-Fi ağları güncellenmiştir. Yeni ağ adı 'UNI-STUDENT-2025' olarak değiştirilmiştir. Bağlantı şifresi öğrenci numaranızın son 6 hanesidir. Bağlantı sorunları yaşarsanız bilgi işlem birimine başvurabilirsiniz.",
    author: {
      name: "Bilgi İşlem Daire Başkanlığı",
      role: "Ağ Yöneticisi",
      avatar: "Bİ"
    },
    category: "system",
    priority: "low",
    publishDate: "2025-01-10T08:30:00Z",
    expiryDate: "2025-02-28T23:59:00Z",
    isRead: true,
    isPinned: false,
    tags: ["wi-fi", "ağ", "güncelleme"],
    readCount: 2789,
    likeCount: 98,
    isLiked: false
  },
  {
    id: "ann_7",
    title: "Öğrenci Konseyi Seçimleri",
    content: "2025-2026 eğitim öğretim yılı öğrenci konseyi seçimleri 20 Ocak 2025 tarihinde yapılacaktır. Seçimler online olarak gerçekleştirilecektir. Aday listesi ve seçim programı önümüzdeki hafta açıklanacaktır.",
    author: {
      name: "Öğrenci Konseyi",
      role: "Seçim Kurulu",
      avatar: "ÖK"
    },
    category: "event",
    priority: "medium",
    publishDate: "2025-01-09T15:45:00Z",
    expiryDate: "2025-01-20T23:59:00Z",
    isRead: false,
    isPinned: false,
    tags: ["seçim", "öğrenci konseyi", "demokrasi"],
    readCount: 1123,
    likeCount: 78,
    isLiked: false
  },
  {
    id: "ann_8",
    title: "Kütüphane Yeni E-Kitap Koleksiyonu",
    content: "Kütüphanemize 500 yeni e-kitap eklendi. Erişim için kütüphane web sitesinden giriş yapabilirsiniz. Akademik kaynaklar, romanlar ve ders kitapları kategorilerinde geniş bir seçenek sunulmaktadır.",
    author: {
      name: "Merkez Kütüphane",
      role: "Kütüphane Müdürü",
      avatar: "MK"
    },
    category: "academic",
    priority: "low",
    publishDate: "2025-01-08T10:20:00Z",
    isRead: true,
    isPinned: false,
    tags: ["kütüphane", "e-kitap", "kaynak"],
    readCount: 654,
    likeCount: 45,
    isLiked: false
  }
];

export const getAnnouncementsByCategory = (category: string) => {
  if (category === "all") return announcements;
  return announcements.filter(ann => ann.category === category);
};

export const getPinnedAnnouncements = () => {
  return announcements.filter(ann => ann.isPinned);
};

export const getUnreadAnnouncements = () => {
  return announcements.filter(ann => !ann.isRead);
};

export const getAnnouncementsByPriority = (priority: string) => {
  if (priority === "all") return announcements;
  return announcements.filter(ann => ann.priority === priority);
};
