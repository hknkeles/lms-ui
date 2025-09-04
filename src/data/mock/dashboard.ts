export interface Course {
  id: string;
  title: string;
  teacher: string;
  cover: string;
  progress: number;
  slug: string;
}

export interface Grade {
  courseId: string;
  score: number;
  maxScore: number;
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Matematik 101",
    teacher: "Prof. Dr. Ahmet Yılmaz",
    cover: "/api/placeholder/300/200",
    progress: 75,
    slug: "matematik-101"
  },
  {
    id: "2",
    title: "İngilizce Kompozisyon",
    teacher: "Dr. Sarah Johnson",
    cover: "/api/placeholder/300/200",
    progress: 60,
    slug: "ingilizce-kompozisyon"
  },
  {
    id: "3",
    title: "Bilgisayar Programlama",
    teacher: "Prof. Dr. Mehmet Kaya",
    cover: "/api/placeholder/300/200",
    progress: 90,
    slug: "bilgisayar-programlama"
  },
  {
    id: "4",
    title: "Fizik Temelleri",
    teacher: "Dr. Ayşe Demir",
    cover: "/api/placeholder/300/200",
    progress: 45,
    slug: "fizik-temelleri"
  },
  {
    id: "5",
    title: "Tarih ve Medeniyet",
    teacher: "Prof. Dr. Mustafa Özkan",
    cover: "/api/placeholder/300/200",
    progress: 30,
    slug: "tarih-ve-medeniyet"
  }
];

export const mockGrades: Grade[] = [
  { courseId: "1", score: 88, maxScore: 100 },
  { courseId: "2", score: 82, maxScore: 100 },
  { courseId: "3", score: 91, maxScore: 100 },
  { courseId: "4", score: 78, maxScore: 100 },
  { courseId: "5", score: 85, maxScore: 100 }
];

// Dashboard istatistikleri hesapla
export const getDashboardStats = () => {
  const totalCourses = mockCourses.length;
  const ongoingCourses = mockCourses.filter(course => course.progress > 0 && course.progress < 100).length;
  
  const averageGrade = mockGrades.length > 0 
    ? Math.round(mockGrades.reduce((sum, grade) => sum + grade.score, 0) / mockGrades.length)
    : 0;

  return {
    totalCourses,
    ongoingCourses,
    averageGrade
  };
};

// Son 3 kursu al
export const getRecentCourses = () => {
  return mockCourses.slice(0, 3);
};
