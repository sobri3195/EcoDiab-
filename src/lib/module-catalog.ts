import type { LucideIcon } from 'lucide-react';
import { Activity, FlaskConical, HeartPulse, Leaf, Salad, ShieldAlert, Users, Video, HandHeart, BellRing, BookOpenCheck, CalendarCheck2, Target, Workflow } from 'lucide-react';

export type WorkspaceModule = {
  to: string;
  label: string;
  group: 'Core workflow' | 'Sustainability' | 'Extension modules';
  icon: LucideIcon;
  description: string;
};

export const workspaceModules: WorkspaceModule[] = [
  { to: '/dashboard', label: 'Dashboard', group: 'Core workflow', icon: Activity, description: 'Ringkasan performa klinis dan dampak sustainability.' },
  { to: '/patients', label: 'Patients', group: 'Core workflow', icon: Users, description: 'Manajemen daftar pasien dan status perawatan.' },
  { to: '/ai-risk', label: 'AI Risk', group: 'Core workflow', icon: ShieldAlert, description: 'Stratifikasi risiko berbasis indikator klinis.' },
  { to: '/follow-up', label: 'Follow-up', group: 'Core workflow', icon: CalendarCheck2, description: 'Perencanaan follow-up dan jadwal kontrol.' },
  { to: '/alerts', label: 'Smart Alerts', group: 'Core workflow', icon: BellRing, description: 'Pusat notifikasi prioritas untuk tim.' },
  { to: '/education', label: 'Patient Education', group: 'Core workflow', icon: BookOpenCheck, description: 'Materi edukasi pasien dan capaian belajar.' },
  { to: '/personal-goals', label: 'Personal Goals', group: 'Core workflow', icon: Target, description: 'Tracking target personal untuk pasien.' },
  { to: '/green', label: 'Green', group: 'Sustainability', icon: Leaf, description: 'Laporan jejak karbon layanan kesehatan.' },
  { to: '/dietary-assistant', label: 'Dietary Assistant', group: 'Sustainability', icon: Salad, description: 'Rekomendasi nutrisi ramah diabetes dan lingkungan.' },
  { to: '/medication-adherence', label: 'Medication Adherence', group: 'Extension modules', icon: HeartPulse, description: 'Monitoring kepatuhan obat dan reminder cerdas.' },
  { to: '/telemedicine-hub', label: 'Telemedicine Hub', group: 'Extension modules', icon: Video, description: 'Koordinasi konsultasi remote dan kesiapan pasien.' },
  { to: '/lab-insights', label: 'Lab Insights', group: 'Extension modules', icon: FlaskConical, description: 'Analisis tren lab dan sinyal klinis dini.' },
  { to: '/community-support', label: 'Community Support', group: 'Extension modules', icon: HandHeart, description: 'Program dukungan komunitas dan pendampingan pasien.' },
  { to: '/operations-center', label: 'Operations Center', group: 'Extension modules', icon: Workflow, description: 'Optimasi operasional tim klinik dan resource planning.' },
];
