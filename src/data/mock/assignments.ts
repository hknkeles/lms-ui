// Mock data for assignments and related events
export interface Assignment {
  id: string;
  title: string;
  course: string;
  teacher: string;
  dueDate: string;
  dueTime: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  priority: "high" | "medium" | "low";
  progress: number;
  description: string;
  requirements: string[];
  attachments: string[];
  estimatedTime: string;
  points: number;
  submissionType: "file" | "text" | "presentation";
  isFavorite: boolean;
  reminderSet: boolean;
  color?: string;
  type?: "assignment" | "presentation" | "quiz" | "exam";
}

export interface CompletedAssignment extends Assignment {
  submittedDate: string;
  grade: number;
  maxGrade: number;
  feedback: string;
  teacherComment?: string;
  gradeLevel: "excellent" | "good" | "average" | "poor";
  timeSpent: string;
  rubric?: {
    criteria: string;
    score: number;
    maxScore: number;
    comment: string;
  }[];
}

// Pending/In Progress Assignments
export const pendingAssignments: Assignment[] = [
  {
    id: "a1",
    title: "Davranış Bilimi Araştırma Projesi",
    course: "Davranış Bilimi Temelleri",
    teacher: "Prof. Dr. Mehmet Özkan",
    dueDate: "2025-08-15",
    dueTime: "23:59",
    status: "pending",
    priority: "high",
    progress: 0,
    description: "İnsan davranışlarını etkileyen faktörler hakkında kapsamlı bir araştırma projesi hazırlayın. Proje, en az 3000 kelime olmalı ve akademik kaynaklarla desteklenmelidir.",
    requirements: ["Minimum 3000 kelime", "En az 5 akademik kaynak", "APA formatında yazım", "Giriş, gelişme ve sonuç bölümleri"],
    attachments: ["proje_rehberi.pdf", "örnek_araştırma.docx", "apa_format_şablonu.docx"],
    estimatedTime: "2 hafta",
    points: 100,
    submissionType: "file",
    isFavorite: true,
    reminderSet: true,
    color: "bg-red-500",
    type: "assignment"
  },
  {
    id: "a2",
    title: "Matematik Problem Seti - Türev ve İntegral",
    course: "MATEMATİK",
    teacher: "Prof. Dr. Ahmet Yılmaz",
    dueDate: "2025-08-12",
    dueTime: "14:00",
    status: "in_progress",
    priority: "high",
    progress: 65,
    description: "Türev ve integral konularında 20 problem çözün ve çözümlerinizi detaylı açıklayın. Her problemin çözüm adımlarını gösterin.",
    requirements: ["Tüm adımları gösterin", "Grafik çizimleri dahil edin", "Sonuçları kontrol edin", "Çözümleri açıklayın"],
    attachments: ["problem_seti.pdf", "çözüm_şablonu.docx", "grafik_kağıdı.pdf"],
    estimatedTime: "1 hafta",
    points: 80,
    submissionType: "file",
    isFavorite: false,
    reminderSet: false,
    color: "bg-blue-500",
    type: "assignment"
  },
  {
    id: "a3",
    title: "Kimya Laboratuvar Raporu",
    course: "Kimya Temelleri",
    teacher: "Dr. Ayşe Demir",
    dueDate: "2025-08-18",
    dueTime: "17:00",
    status: "pending",
    priority: "medium",
    progress: 0,
    description: "Atom yapısı deneyinin laboratuvar raporunu hazırlayın. Deney sürecini, gözlemlerinizi ve sonuçları detaylı şekilde açıklayın.",
    requirements: ["Deney sürecini detaylandırın", "Sonuçları analiz edin", "Grafik ve tablolar ekleyin", "Hata analizi yapın"],
    attachments: ["deney_prosedürü.pdf", "veri_tablosu.xlsx"],
    estimatedTime: "3 gün",
    points: 60,
    submissionType: "file",
    isFavorite: true,
    reminderSet: true,
    color: "bg-green-500",
    type: "assignment"
  },
  {
    id: "a4",
    title: "Biyoloji Sunum - Hücre Organelleri",
    course: "Biyoloji Temelleri",
    teacher: "Prof. Dr. Fatma Kaya",
    dueDate: "2025-08-20",
    dueTime: "10:00",
    status: "pending",
    priority: "medium",
    progress: 25,
    description: "Hücre organellerinin işlevlerini anlatan 15 dakikalık bir sunum hazırlayın. Görsel materyaller ve animasyonlar kullanın.",
    requirements: ["PowerPoint sunumu", "Görsel materyaller", "Sözlü sunum", "15 dakika süre"],
    attachments: ["sunum_rehberi.pdf", "örnek_sunum.pptx", "görsel_materyaller.zip"],
    estimatedTime: "1 hafta",
    points: 70,
    submissionType: "presentation",
    isFavorite: false,
    reminderSet: false,
    color: "bg-purple-500",
    type: "presentation"
  },
  {
    id: "a5",
    title: "İngilizce Essay - Çevre Kirliliği",
    course: "İngilizce Dil Öğrenimi",
    teacher: "Dr. Sarah Johnson",
    dueDate: "2025-08-14",
    dueTime: "23:59",
    status: "in_progress",
    priority: "high",
    progress: 80,
    description: "Çevre kirliliğinin nedenleri ve çözümleri hakkında 500 kelimelik bir essay yazın. Argümanlarınızı destekleyici örneklerle güçlendirin.",
    requirements: ["500 kelime", "İngilizce yazım", "Kaynak gösterimi", "Giriş ve sonuç paragrafları"],
    attachments: ["essay_şablonu.docx", "gramer_rehberi.pdf", "kaynak_listesi.pdf"],
    estimatedTime: "4 gün",
    points: 50,
    submissionType: "text",
    isFavorite: true,
    reminderSet: true,
    color: "bg-yellow-500",
    type: "assignment"
  },
  {
    id: "a6",
    title: "Geometri Quiz - Analitik Geometri",
    course: "Geometri ve Analitik Geometri",
    teacher: "Prof. Dr. Mustafa Öz",
    dueDate: "2025-08-10",
    dueTime: "16:00",
    status: "completed",
    priority: "low",
    progress: 100,
    description: "Analitik geometri problemlerini çözün ve çözümlerinizi sunun. Geometrik çizimler ve hesaplamalar dahil edin.",
    requirements: ["Geometrik çizimler", "Hesaplamalar", "Sonuç kontrolü", "Açıklamalar"],
    attachments: ["problem_seti.pdf", "çözüm_şablonu.docx"],
    estimatedTime: "2 gün",
    points: 40,
    submissionType: "file",
    isFavorite: false,
    reminderSet: false,
    color: "bg-indigo-500",
    type: "quiz"
  },
  {
    id: "a7",
    title: "Matematik Final Projesi",
    course: "MATEMATİK",
    teacher: "Prof. Dr. Ahmet Yılmaz",
    dueDate: "2025-08-28",
    dueTime: "23:59",
    status: "pending",
    priority: "high",
    progress: 15,
    description: "Türev ve integral konularında kapsamlı bir final projesi hazırlayın. Gerçek hayat problemlerini matematiksel olarak çözün.",
    requirements: ["Gerçek hayat uygulaması", "Matematiksel modelleme", "Çözüm adımları", "Sonuç analizi"],
    attachments: ["proje_rehberi.pdf", "örnek_projeler.zip", "matematik_yazılımları.pdf"],
    estimatedTime: "3 hafta",
    points: 150,
    submissionType: "file",
    isFavorite: true,
    reminderSet: true,
    color: "bg-blue-500",
    type: "assignment"
  },
  {
    id: "a8",
    title: "Kimya Sınavı - Atom Yapısı",
    course: "Kimya Temelleri",
    teacher: "Dr. Ayşe Demir",
    dueDate: "2025-09-05",
    dueTime: "14:00",
    status: "pending",
    priority: "high",
    progress: 0,
    description: "Atom yapısı ve kimyasal bağlar konularında kapsamlı bir sınav. Çoktan seçmeli, doğru-yanlış ve açıklamalı sorular.",
    requirements: ["Atom yapısı bilgisi", "Kimyasal bağlar", "Periyodik tablo", "Problem çözme"],
    attachments: ["sınav_rehberi.pdf", "çalışma_soruları.pdf"],
    estimatedTime: "2 saat",
    points: 100,
    submissionType: "text",
    isFavorite: false,
    reminderSet: true,
    color: "bg-green-500",
    type: "exam"
  },
  {
    id: "a9",
    title: "Biyoloji Vaka Çalışması",
    course: "Biyoloji Temelleri",
    teacher: "Prof. Dr. Fatma Kaya",
    dueDate: "2025-08-25",
    dueTime: "12:00",
    status: "pending",
    priority: "medium",
    progress: 0,
    description: "Genetik hastalıklar hakkında vaka çalışması yapın. Hastalığın nedenlerini, belirtilerini ve tedavi yöntemlerini araştırın.",
    requirements: ["Vaka analizi", "Literatür taraması", "Çözüm önerileri", "Sunum"],
    attachments: ["vaka_örnekleri.pdf", "araştırma_rehberi.pdf"],
    estimatedTime: "2 hafta",
    points: 90,
    submissionType: "presentation",
    isFavorite: false,
    reminderSet: false,
    color: "bg-purple-500",
    type: "assignment"
  },
  {
    id: "a10",
    title: "İngilizce Konuşma Sınavı",
    course: "İngilizce Dil Öğrenimi",
    teacher: "Dr. Sarah Johnson",
    dueDate: "2025-08-22",
    dueTime: "11:00",
    status: "pending",
    priority: "medium",
    progress: 0,
    description: "Verilen konular hakkında 10 dakikalık İngilizce konuşma yapın. Telaffuz, akıcılık ve kelime dağarcığı değerlendirilecek.",
    requirements: ["10 dakika konuşma", "Konu hazırlığı", "Soruları cevaplama", "Telaffuz"],
    attachments: ["konu_listesi.pdf", "değerlendirme_kriterleri.pdf"],
    estimatedTime: "1 hafta",
    points: 60,
    submissionType: "presentation",
    isFavorite: false,
    reminderSet: false,
    color: "bg-yellow-500",
    type: "exam"
  }
];

// Completed Assignments
export const completedAssignments: CompletedAssignment[] = [
  {
    id: "ca1",
    title: "Geometri Problem Çözme",
    course: "Geometri ve Analitik Geometri",
    teacher: "Prof. Dr. Mustafa Öz",
    dueDate: "2025-07-10",
    dueTime: "16:00",
    status: "completed",
    priority: "low",
    progress: 100,
    description: "Analitik geometri problemlerini çözün ve çözümlerinizi sunun.",
    requirements: ["Geometrik çizimler", "Hesaplamalar", "Sonuç kontrolü"],
    attachments: ["geometri_cozumler.pdf"],
    estimatedTime: "2 gün",
    points: 40,
    submissionType: "file",
    isFavorite: false,
    reminderSet: false,
    color: "bg-indigo-500",
    type: "quiz",
    submittedDate: "2025-07-09",
    grade: 95,
    maxGrade: 100,
    feedback: "Mükemmel çözümler! Geometrik çizimler çok net ve hesaplamalar doğru. Özellikle analitik geometri kısmında gösterdiğin detaylı açıklamalar çok başarılı.",
    teacherComment: "Harika bir çalışma. Devam et!",
    gradeLevel: "excellent",
    timeSpent: "2 gün",
    rubric: [
      { criteria: "Doğruluk", score: 20, maxScore: 20, comment: "Tüm hesaplamalar doğru" },
      { criteria: "Çizimler", score: 18, maxScore: 20, comment: "Çok net çizimler" },
      { criteria: "Açıklamalar", score: 19, maxScore: 20, comment: "Detaylı açıklamalar" },
      { criteria: "Sunum", score: 18, maxScore: 20, comment: "Düzenli sunum" },
      { criteria: "Zamanında Teslim", score: 20, maxScore: 20, comment: "1 gün erken teslim" }
    ]
  },
  {
    id: "ca2",
    title: "Matematik Final Projesi",
    course: "MATEMATİK",
    teacher: "Prof. Dr. Ahmet Yılmaz",
    dueDate: "2025-07-15",
    dueTime: "23:59",
    status: "completed",
    priority: "high",
    progress: 100,
    description: "Çok iyi bir proje. Türev ve integral konularını başarıyla uygulamışsın. Sadece birkaç küçük hesaplama hatası var, onları düzeltirsen mükemmel olur.",
    requirements: ["Kavram Anlayışı", "Hesaplamalar", "Sunum", "Yaratıcılık"],
    attachments: ["matematik_projesi.pdf", "hesaplamalar.xlsx"],
    estimatedTime: "2 hafta",
    points: 100,
    submissionType: "file",
    isFavorite: true,
    reminderSet: false,
    color: "bg-blue-500",
    type: "assignment",
    submittedDate: "2025-07-15",
    grade: 88,
    maxGrade: 100,
    feedback: "Çok iyi bir proje. Türev ve integral konularını başarıyla uygulamışsın. Sadece birkaç küçük hesaplama hatası var, onları düzeltirsen mükemmel olur.",
    teacherComment: "Güzel çalışma, tebrikler!",
    gradeLevel: "good",
    timeSpent: "2 hafta",
    rubric: [
      { criteria: "Kavram Anlayışı", score: 22, maxScore: 25, comment: "İyi anlayış" },
      { criteria: "Hesaplamalar", score: 20, maxScore: 25, comment: "Birkaç küçük hata" },
      { criteria: "Sunum", score: 23, maxScore: 25, comment: "Çok düzenli" },
      { criteria: "Yaratıcılık", score: 18, maxScore: 25, comment: "Standart yaklaşım" }
    ]
  },
  {
    id: "ca3",
    title: "İngilizce Essay - Çevre Kirliliği",
    course: "İngilizce Dil Öğrenimi",
    teacher: "Dr. Sarah Johnson",
    dueDate: "2025-07-14",
    dueTime: "23:59",
    status: "completed",
    priority: "high",
    progress: 100,
    description: "Excellent essay! Your arguments are well-structured and supported with good examples. Grammar and vocabulary usage is very good. Just work on transitions between paragraphs.",
    requirements: ["Content & Ideas", "Grammar", "Vocabulary", "Organization"],
    attachments: ["essay_cevre_kirliligi.docx"],
    estimatedTime: "4 gün",
    points: 50,
    submissionType: "text",
    isFavorite: true,
    reminderSet: false,
    color: "bg-yellow-500",
    type: "assignment",
    submittedDate: "2025-07-14",
    grade: 92,
    maxGrade: 100,
    feedback: "Excellent essay! Your arguments are well-structured and supported with good examples. Grammar and vocabulary usage is very good. Just work on transitions between paragraphs.",
    teacherComment: "Great improvement in your writing skills!",
    gradeLevel: "excellent",
    timeSpent: "4 gün",
    rubric: [
      { criteria: "Content & Ideas", score: 24, maxScore: 25, comment: "Strong arguments" },
      { criteria: "Grammar", score: 22, maxScore: 25, comment: "Very good grammar" },
      { criteria: "Vocabulary", score: 23, maxScore: 25, comment: "Rich vocabulary" },
      { criteria: "Organization", score: 23, maxScore: 25, comment: "Well-structured" }
    ]
  },
  {
    id: "ca4",
    title: "Biyoloji Sunum - Hücre Organelleri",
    course: "Biyoloji Temelleri",
    teacher: "Prof. Dr. Fatma Kaya",
    dueDate: "2025-07-20",
    dueTime: "10:00",
    status: "completed",
    priority: "medium",
    progress: 100,
    description: "İyi bir sunum hazırlamışsın. Görsel materyaller çok etkili. Sadece bazı organellerin işlevlerini daha detaylı açıklayabilirdin. Sözlü sunumun da başarılıydı.",
    requirements: ["İçerik", "Görseller", "Sunum", "Zaman Yönetimi"],
    attachments: ["hucre_organelleri.pptx", "sunum_notlari.pdf"],
    estimatedTime: "1 hafta",
    points: 70,
    submissionType: "presentation",
    isFavorite: false,
    reminderSet: false,
    color: "bg-purple-500",
    type: "presentation",
    submittedDate: "2025-07-20",
    grade: 85,
    maxGrade: 100,
    feedback: "İyi bir sunum hazırlamışsın. Görsel materyaller çok etkili. Sadece bazı organellerin işlevlerini daha detaylı açıklayabilirdin. Sözlü sunumun da başarılıydı.",
    teacherComment: "Güzel çalışma, teşekkürler!",
    gradeLevel: "good",
    timeSpent: "1 hafta",
    rubric: [
      { criteria: "İçerik", score: 20, maxScore: 25, comment: "İyi içerik" },
      { criteria: "Görseller", score: 23, maxScore: 25, comment: "Çok etkili görseller" },
      { criteria: "Sunum", score: 21, maxScore: 25, comment: "Başarılı sunum" },
      { criteria: "Zaman Yönetimi", score: 21, maxScore: 25, comment: "İyi zamanlama" }
    ]
  },
  {
    id: "ca5",
    title: "Kimya Laboratuvar Raporu",
    course: "Kimya Temelleri",
    teacher: "Dr. Ayşe Demir",
    dueDate: "2025-07-18",
    dueTime: "17:00",
    status: "completed",
    priority: "medium",
    progress: 100,
    description: "Laboratuvar raporun genel olarak iyi. Deney sürecini iyi açıklamışsın ama sonuçların analizinde biraz daha derinleşebilirdin. Grafikler güzel hazırlanmış.",
    requirements: ["Deney Süreci", "Sonuçlar", "Grafikler", "Rapor Formatı"],
    attachments: ["kimya_lab_raporu.pdf", "grafikler.xlsx"],
    estimatedTime: "3 gün",
    points: 60,
    submissionType: "file",
    isFavorite: false,
    reminderSet: false,
    color: "bg-green-500",
    type: "assignment",
    submittedDate: "2025-07-17",
    grade: 78,
    maxGrade: 100,
    feedback: "Laboratuvar raporun genel olarak iyi. Deney sürecini iyi açıklamışsın ama sonuçların analizinde biraz daha derinleşebilirdin. Grafikler güzel hazırlanmış.",
    teacherComment: "İyi çalışma, analiz kısmını geliştir.",
    gradeLevel: "average",
    timeSpent: "3 gün",
    rubric: [
      { criteria: "Deney Süreci", score: 18, maxScore: 25, comment: "İyi açıklama" },
      { criteria: "Sonuçlar", score: 15, maxScore: 25, comment: "Analiz eksik" },
      { criteria: "Grafikler", score: 20, maxScore: 25, comment: "Güzel grafikler" },
      { criteria: "Rapor Formatı", score: 20, maxScore: 25, comment: "Düzenli format" }
    ]
  },
  {
    id: "ca6",
    title: "Davranış Bilimi Araştırma Projesi",
    course: "Davranış Bilimi Temelleri",
    teacher: "Prof. Dr. Mehmet Özkan",
    dueDate: "2025-07-15",
    dueTime: "23:59",
    status: "completed",
    priority: "high",
    progress: 100,
    description: "Harika bir araştırma projesi! Kaynak kullanımı mükemmel, analiz çok derinlemesine. APA formatına da uygun. Bu çalışma örnek proje olarak saklanabilir.",
    requirements: ["Araştırma Kalitesi", "Analiz", "Kaynak Kullanımı", "Format"],
    attachments: ["davranis_bilimi_arastirma.pdf", "kaynaklar.docx"],
    estimatedTime: "2 hafta",
    points: 100,
    submissionType: "file",
    isFavorite: true,
    reminderSet: false,
    color: "bg-red-500",
    type: "assignment",
    submittedDate: "2025-07-15",
    grade: 96,
    maxGrade: 100,
    feedback: "Harika bir araştırma projesi! Kaynak kullanımı mükemmel, analiz çok derinlemesine. APA formatına da uygun. Bu çalışma örnek proje olarak saklanabilir.",
    teacherComment: "Mükemmel çalışma! Örnek proje.",
    gradeLevel: "excellent",
    timeSpent: "2 hafta",
    rubric: [
      { criteria: "Araştırma Kalitesi", score: 25, maxScore: 25, comment: "Mükemmel araştırma" },
      { criteria: "Analiz", score: 24, maxScore: 25, comment: "Çok derinlemesine" },
      { criteria: "Kaynak Kullanımı", score: 25, maxScore: 25, comment: "Mükemmel kaynaklar" },
      { criteria: "Format", score: 22, maxScore: 25, comment: "APA formatı uygun" }
    ]
  }
];

// Calendar Events (for calendar view)
export const calendarEvents = [
  {
    id: "ae1",
    title: "Davranış Bilimi Araştırma Projesi",
    course: "Davranış Bilimi Temelleri",
    teacher: "Prof. Dr. Mehmet Özkan",
    dueDate: "2025-08-15",
    dueTime: "23:59",
    status: "pending",
    priority: "high",
    type: "assignment",
    description: "İnsan davranışlarını etkileyen faktörler hakkında kapsamlı bir araştırma projesi hazırlayın.",
    points: 100,
    estimatedTime: "2 hafta",
    isFavorite: true,
    reminderSet: true,
    color: "bg-red-500"
  },
  {
    id: "ae2",
    title: "Matematik Problem Seti",
    course: "MATEMATİK",
    teacher: "Prof. Dr. Ahmet Yılmaz",
    dueDate: "2025-08-12",
    dueTime: "14:00",
    status: "in_progress",
    priority: "high",
    type: "assignment",
    description: "Türev ve integral konularında 20 problem çözün.",
    points: 80,
    estimatedTime: "1 hafta",
    isFavorite: false,
    reminderSet: false,
    color: "bg-blue-500"
  },
  {
    id: "ae3",
    title: "Kimya Laboratuvar Raporu",
    course: "Kimya Temelleri",
    teacher: "Dr. Ayşe Demir",
    dueDate: "2025-08-18",
    dueTime: "17:00",
    status: "pending",
    priority: "medium",
    type: "assignment",
    description: "Atom yapısı deneyinin laboratuvar raporunu hazırlayın.",
    points: 60,
    estimatedTime: "3 gün",
    isFavorite: true,
    reminderSet: true,
    color: "bg-green-500"
  },
  {
    id: "ae4",
    title: "Biyoloji Sunum",
    course: "Biyoloji Temelleri",
    teacher: "Prof. Dr. Fatma Kaya",
    dueDate: "2025-08-20",
    dueTime: "10:00",
    status: "pending",
    priority: "medium",
    type: "presentation",
    description: "Hücre organellerinin işlevlerini anlatan 15 dakikalık sunum.",
    points: 70,
    estimatedTime: "1 hafta",
    isFavorite: false,
    reminderSet: false,
    color: "bg-purple-500"
  },
  {
    id: "ae5",
    title: "İngilizce Essay",
    course: "İngilizce Dil Öğrenimi",
    teacher: "Dr. Sarah Johnson",
    dueDate: "2025-08-14",
    dueTime: "23:59",
    status: "in_progress",
    priority: "high",
    type: "assignment",
    description: "Çevre kirliliği hakkında 500 kelimelik essay.",
    points: 50,
    estimatedTime: "4 gün",
    isFavorite: true,
    reminderSet: true,
    color: "bg-yellow-500"
  },
  {
    id: "ae6",
    title: "Geometri Quiz",
    course: "Geometri ve Analitik Geometri",
    teacher: "Prof. Dr. Mustafa Öz",
    dueDate: "2025-08-10",
    dueTime: "16:00",
    status: "completed",
    priority: "low",
    type: "quiz",
    description: "Analitik geometri konularında online quiz.",
    points: 40,
    estimatedTime: "1 saat",
    isFavorite: false,
    reminderSet: false,
    color: "bg-indigo-500"
  },
  {
    id: "ae7",
    title: "Matematik Final Projesi",
    course: "MATEMATİK",
    teacher: "Prof. Dr. Ahmet Yılmaz",
    dueDate: "2025-08-28",
    dueTime: "23:59",
    status: "pending",
    priority: "high",
    type: "assignment",
    description: "Türev ve integral konularında final projesi.",
    points: 150,
    estimatedTime: "3 hafta",
    isFavorite: true,
    reminderSet: true,
    color: "bg-blue-500"
  },
  {
    id: "ae8",
    title: "Kimya Sınavı",
    course: "Kimya Temelleri",
    teacher: "Dr. Ayşe Demir",
    dueDate: "2025-09-05",
    dueTime: "14:00",
    status: "pending",
    priority: "high",
    type: "exam",
    description: "Atom yapısı ve kimyasal bağlar konularında sınav.",
    points: 100,
    estimatedTime: "2 saat",
    isFavorite: false,
    reminderSet: true,
    color: "bg-green-500"
  },
  {
    id: "ae9",
    title: "Biyoloji Vaka Çalışması",
    course: "Biyoloji Temelleri",
    teacher: "Prof. Dr. Fatma Kaya",
    dueDate: "2025-08-25",
    dueTime: "12:00",
    status: "pending",
    priority: "medium",
    type: "assignment",
    description: "Genetik hastalıklar hakkında vaka çalışması.",
    points: 90,
    estimatedTime: "2 hafta",
    isFavorite: false,
    reminderSet: false,
    color: "bg-purple-500"
  },
  {
    id: "ae10",
    title: "İngilizce Konuşma Sınavı",
    course: "İngilizce Dil Öğrenimi",
    teacher: "Dr. Sarah Johnson",
    dueDate: "2025-08-22",
    dueTime: "11:00",
    status: "pending",
    priority: "medium",
    type: "exam",
    description: "10 dakikalık İngilizce konuşma sınavı.",
    points: 60,
    estimatedTime: "1 hafta",
    isFavorite: false,
    reminderSet: false,
    color: "bg-yellow-500"
  },
  {
    id: "ae11",
    title: "Fizik Laboratuvar Deneyi",
    course: "Fizik Temelleri",
    teacher: "Prof. Dr. Ali Veli",
    dueDate: "2025-09-15",
    dueTime: "10:00",
    status: "pending",
    priority: "medium",
    type: "assignment",
    description: "Mekanik konularında laboratuvar deneyi ve raporu.",
    points: 80,
    estimatedTime: "1 hafta",
    isFavorite: false,
    reminderSet: false,
    color: "bg-orange-500"
  },
  {
    id: "ae12",
    title: "Tarih Araştırma Ödevi",
    course: "Türk Tarihi",
    teacher: "Dr. Ayşe Kaya",
    dueDate: "2025-09-20",
    dueTime: "23:59",
    status: "pending",
    priority: "medium",
    type: "assignment",
    description: "Osmanlı döneminde eğitim sistemi hakkında araştırma.",
    points: 70,
    estimatedTime: "2 hafta",
    isFavorite: false,
    reminderSet: false,
    color: "bg-amber-500"
  },
  {
    id: "ae13",
    title: "Coğrafya Sunumu",
    course: "Coğrafya",
    teacher: "Prof. Dr. Mehmet Demir",
    dueDate: "2025-10-05",
    dueTime: "14:00",
    status: "pending",
    priority: "low",
    type: "presentation",
    description: "İklim değişikliği ve etkileri hakkında sunum.",
    points: 60,
    estimatedTime: "1 hafta",
    isFavorite: false,
    reminderSet: false,
    color: "bg-teal-500"
  },
  {
    id: "ae14",
    title: "Edebiyat Analiz Ödevi",
    course: "Türk Edebiyatı",
    teacher: "Dr. Fatma Öz",
    dueDate: "2025-10-10",
    dueTime: "17:00",
    status: "pending",
    priority: "medium",
    type: "assignment",
    description: "Orhan Pamuk'un bir eserini analiz etme ödevi.",
    points: 85,
    estimatedTime: "2 hafta",
    isFavorite: true,
    reminderSet: true,
    color: "bg-pink-500"
  },
  {
    id: "ae15",
    title: "Felsefe Sınavı",
    course: "Felsefe",
    teacher: "Prof. Dr. Ahmet Kaya",
    dueDate: "2025-10-15",
    dueTime: "09:00",
    status: "pending",
    priority: "high",
    type: "exam",
    description: "Etik ve mantık konularında kapsamlı sınav.",
    points: 100,
    estimatedTime: "2 saat",
    isFavorite: false,
    reminderSet: true,
    color: "bg-violet-500"
  }
];

// Helper functions
export const getAssignmentsByStatus = (status: string) => {
  return pendingAssignments.filter(assignment => assignment.status === status);
};

export const getAssignmentsByCourse = (course: string) => {
  return pendingAssignments.filter(assignment => assignment.course === course);
};

export const getAssignmentsByPriority = (priority: string) => {
  return pendingAssignments.filter(assignment => assignment.priority === priority);
};

export const getCompletedAssignmentsByGrade = (gradeLevel: string) => {
  return completedAssignments.filter(assignment => assignment.gradeLevel === gradeLevel);
};

export const getUpcomingAssignments = (days: number = 7) => {
  const today = new Date();
  const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
  
  return pendingAssignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    return dueDate >= today && dueDate <= futureDate;
  });
};

export const getOverdueAssignments = () => {
  const today = new Date();
  return pendingAssignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    return dueDate < today && assignment.status !== "completed";
  });
};