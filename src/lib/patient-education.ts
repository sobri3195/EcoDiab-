export type QuizOption = {
  id: string;
  label: string;
};

export type MicroLesson = {
  id: string;
  title: string;
  durationMinutes: number;
  level: 'Dasar' | 'Menengah';
  category: string;
  summary: string;
  takeaway: string;
  quiz: {
    question: string;
    options: QuizOption[];
    correctOptionId: string;
  };
};

export type LessonProgress = {
  completedLessonIds: string[];
  quizAnswers: Record<string, string>;
  quizCorrectByLesson: Record<string, boolean>;
  totalQuizAttempts: number;
  updatedAt: string;
};

export type AchievementSummary = {
  completedLessons: number;
  completionRate: number;
  correctAnswers: number;
  accuracyRate: number;
  totalAttempts: number;
  badges: string[];
};

export const microLessons: MicroLesson[] = [
  {
    id: 'glucose-basics',
    title: 'Memahami Target Gula Darah Harian',
    durationMinutes: 4,
    level: 'Dasar',
    category: 'Glukosa',
    summary: 'Kenali rentang gula darah sebelum makan, setelah makan, dan kapan harus waspada.',
    takeaway: 'Catat pola harian 7 hari untuk membantu dokter menyusun intervensi personal.',
    quiz: {
      question: 'Kapan waktu yang tepat mengecek gula darah post-prandial?',
      options: [
        { id: 'a', label: '15 menit setelah makan' },
        { id: 'b', label: '2 jam setelah makan' },
        { id: 'c', label: '6 jam setelah makan' },
      ],
      correctOptionId: 'b',
    },
  },
  {
    id: 'medication-adherence',
    title: 'Kepatuhan Obat Tanpa Terlewat',
    durationMinutes: 3,
    level: 'Dasar',
    category: 'Terapi',
    summary: 'Strategi praktis untuk minum obat tepat waktu dan mengurangi dosis terlewat.',
    takeaway: 'Gunakan pengingat 2 tahap: alarm + checklist agar kepatuhan meningkat.',
    quiz: {
      question: 'Jika satu dosis terlewat, langkah awal paling aman adalah?',
      options: [
        { id: 'a', label: 'Minum dua dosis sekaligus' },
        { id: 'b', label: 'Lewati dan lanjut sesuai jadwal berikutnya (sesuai edukasi dokter)' },
        { id: 'c', label: 'Hentikan obat sampai kontrol berikutnya' },
      ],
      correctOptionId: 'b',
    },
  },
  {
    id: 'meal-plate-method',
    title: 'Metode Piring Seimbang untuk Diabetes',
    durationMinutes: 5,
    level: 'Menengah',
    category: 'Nutrisi',
    summary: 'Susun porsi karbohidrat, protein, dan serat agar lonjakan gula lebih terkendali.',
    takeaway: 'Isi 1/2 piring sayur non-tepung untuk bantu stabilisasi glukosa.',
    quiz: {
      question: 'Porsi ideal sayuran non-tepung pada metode piring adalah?',
      options: [
        { id: 'a', label: '1/4 piring' },
        { id: 'b', label: '1/2 piring' },
        { id: 'c', label: 'Seluruh piring' },
      ],
      correctOptionId: 'b',
    },
  },
];

export const createInitialProgress = (): LessonProgress => ({
  completedLessonIds: [],
  quizAnswers: {},
  quizCorrectByLesson: {},
  totalQuizAttempts: 0,
  updatedAt: new Date().toISOString(),
});

export function getEducationStorageKey(userId: string) {
  return `ecodiab-education-progress-${userId}`;
}

export function loadEducationProgress(userId: string): LessonProgress {
  const raw = localStorage.getItem(getEducationStorageKey(userId));
  if (!raw) return createInitialProgress();

  try {
    const parsed = JSON.parse(raw) as Partial<LessonProgress>;
    return {
      completedLessonIds: parsed.completedLessonIds ?? [],
      quizAnswers: parsed.quizAnswers ?? {},
      quizCorrectByLesson: parsed.quizCorrectByLesson ?? {},
      totalQuizAttempts: parsed.totalQuizAttempts ?? 0,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return createInitialProgress();
  }
}

export function saveEducationProgress(userId: string, progress: LessonProgress) {
  localStorage.setItem(getEducationStorageKey(userId), JSON.stringify(progress));
}

export function buildAchievementSummary(progress: LessonProgress): AchievementSummary {
  const completedLessons = progress.completedLessonIds.length;
  const completionRate = Math.round((completedLessons / microLessons.length) * 100);
  const correctAnswers = Object.values(progress.quizCorrectByLesson).filter(Boolean).length;
  const answeredLessons = Object.keys(progress.quizAnswers).length;
  const accuracyRate = answeredLessons ? Math.round((correctAnswers / answeredLessons) * 100) : 0;

  const badges: string[] = [];
  if (completedLessons >= 1) badges.push('Starter Learner');
  if (completedLessons === microLessons.length) badges.push('Lesson Finisher');
  if (correctAnswers >= 2) badges.push('Quiz Explorer');
  if (accuracyRate >= 80 && answeredLessons > 0) badges.push('High Accuracy');

  return {
    completedLessons,
    completionRate,
    correctAnswers,
    accuracyRate,
    totalAttempts: progress.totalQuizAttempts,
    badges,
  };
}
