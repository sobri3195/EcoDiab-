import { BookOpenCheck, CircleCheckBig, Clock3, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { useAppContext } from '../lib/app-context';
import {
  buildAchievementSummary,
  loadEducationProgress,
  microLessons,
  saveEducationProgress,
  type LessonProgress,
} from '../lib/patient-education';
import { useEffect, useMemo, useState } from 'react';

export default function PatientEducationPage() {
  const { currentUserId } = useAppContext();
  const [progress, setProgress] = useState<LessonProgress>(() => loadEducationProgress(currentUserId));

  useEffect(() => {
    setProgress(loadEducationProgress(currentUserId));
  }, [currentUserId]);

  useEffect(() => {
    saveEducationProgress(currentUserId, progress);
  }, [currentUserId, progress]);

  const summary = useMemo(() => buildAchievementSummary(progress), [progress]);

  const markLessonDone = (lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessonIds.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, lessonId],
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const submitQuiz = (lessonId: string, selectedOptionId: string, correctOptionId: string) => {
    setProgress((prev) => ({
      ...prev,
      quizAnswers: { ...prev.quizAnswers, [lessonId]: selectedOptionId },
      quizCorrectByLesson: { ...prev.quizCorrectByLesson, [lessonId]: selectedOptionId === correctOptionId },
      totalQuizAttempts: prev.totalQuizAttempts + 1,
      updatedAt: new Date().toISOString(),
    }));
  };

  return (
    <div className="space-y-4">
      <Card tone="primary" className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Patient Education</p>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Micro-learning untuk edukasi mandiri pasien</h2>
          </div>
          <Link to="/education/achievements" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            <Trophy className="h-4 w-4" /> Ringkasan Pencapaian
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-100 bg-white p-3 dark:border-emerald-800 dark:bg-slate-900">
            <p className="text-xs text-slate-500">Progress lesson</p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{summary.completionRate}%</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-white p-3 dark:border-emerald-800 dark:bg-slate-900">
            <p className="text-xs text-slate-500">Akurasi quiz</p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{summary.accuracyRate}%</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-white p-3 dark:border-emerald-800 dark:bg-slate-900">
            <p className="text-xs text-slate-500">Badge didapat</p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{summary.badges.length}</p>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        {microLessons.map((lesson) => {
          const selected = progress.quizAnswers[lesson.id];
          const isCorrect = progress.quizCorrectByLesson[lesson.id];
          const isDone = progress.completedLessonIds.includes(lesson.id);

          return (
            <Card key={lesson.id} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{lesson.category} · {lesson.level}</p>
                  <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{lesson.title}</h3>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Clock3 className="h-3.5 w-3.5" /> {lesson.durationMinutes} menit
                </span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300">{lesson.summary}</p>
              <p className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                <Sparkles className="mr-1 inline h-4 w-4" /> {lesson.takeaway}
              </p>

              <div className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Mini Quiz: {lesson.quiz.question}</p>
                <div className="space-y-2">
                  {lesson.quiz.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => submitQuiz(lesson.id, option.id, lesson.quiz.correctOptionId)}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                        selected === option.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-200'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {selected ? (
                  <p className={`text-xs font-semibold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isCorrect ? 'Jawaban benar, lanjutkan ke lesson berikutnya.' : 'Jawaban belum tepat, coba ulang agar pemahaman lebih kuat.'}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${isDone ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                  {isDone ? <CircleCheckBig className="h-3.5 w-3.5" /> : <BookOpenCheck className="h-3.5 w-3.5" />}
                  {isDone ? 'Lesson selesai' : 'Belum selesai'}
                </span>
                <button onClick={() => markLessonDone(lesson.id)} className="rounded-lg border border-emerald-500 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-900/30">
                  Tandai selesai
                </button>
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
