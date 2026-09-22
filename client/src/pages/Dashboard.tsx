import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useAuthStore, usePatientStore } from '@/store/useAppStore';
import AppLayout from '@/layouts/AppLayout';
import { getDashboardStats, getRecentActivity } from '@/services/api';
import { mockPatients } from '@/data/mockPatients';
import { segmentationPerformanceData, casesOverTimeData } from '@/data/mockData';
import type { DashboardStats, ActivityItem, WorkflowStatus, ReviewStatus } from '@/types';
import {
  Users,
  Brain,
  Box,
  ClipboardCheck,
  ArrowRight,
  Clock,
  ScanLine,
  Scissors,
  FileText,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

function StatusBadge({ status }: { status: WorkflowStatus | ReviewStatus }) {
  const styles: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Processing: 'bg-blue-50 text-blue-700 border-blue-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Reviewed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Pending Review': 'bg-amber-50 text-amber-700 border-amber-200',
    'Not Started': 'bg-slate-50 text-slate-500 border-slate-200',
    'Requires Review': 'bg-red-50 text-red-700 border-red-200',
    Failed: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const { selectedPatientId, setSelectedPatient } = usePatientStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats);
    getRecentActivity().then(setActivities);
  }, []);

  const firstName = user?.name?.split(' ')[1] || user?.name?.split(' ')[0] || 'Clinician';

  const statCards = stats
    ? [
        { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Segmentation', value: stats.pendingSegmentation, icon: Brain, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Completed Reconstructions', value: stats.completedReconstructions, icon: Box, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Pending Reviews', value: stats.pendingReviews, icon: ClipboardCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      ]
    : [];

  const recentPatients = mockPatients.slice(0, 6);

  return (
    <AppLayout>
      {/* Greeting & Active Patient Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Good morning, {firstName}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            ROSA-assisted knee arthroplasty planning and patient-specific 3D reconstruction platform
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Patient:</span>
          <select
            value={selectedPatientId || 'PT-001'}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs focus:border-blue-500 focus:outline-none"
          >
            {mockPatients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.name} ({p.kneeSide} Knee)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clinical Workflow Pipeline Navigation Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-5 text-white shadow-lg mb-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Clinical Arthroplasty Workflow
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Active Study: {selectedPatientId || 'PT-001'} (Right Knee TKA)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Link href="/imaging">
            <div className="group rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/15 hover:border-blue-400/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="font-mono font-bold text-blue-400 text-[10px]">STEP 01</span>
                <ScanLine className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-bold text-white text-xs group-hover:text-blue-200 transition-colors">Medical Imaging</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">320-slice CT multi-plane viewer</p>
            </div>
          </Link>

          <Link href="/segmentation">
            <div className="group rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/15 hover:border-emerald-400/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="font-mono font-bold text-emerald-400 text-[10px]">STEP 02</span>
                <Brain className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-bold text-white text-xs group-hover:text-emerald-200 transition-colors">AI Segmentation</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">3D U-Net bone masks & Dice 0.974</p>
            </div>
          </Link>

          <Link href="/reconstruction">
            <div className="group rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/15 hover:border-amber-400/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="font-mono font-bold text-amber-400 text-[10px]">STEP 03</span>
                <Box className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-bold text-white text-xs group-hover:text-amber-200 transition-colors">3D Reconstruction</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Interactive WebGL knee anatomy</p>
            </div>
          </Link>

          <Link href="/planning">
            <div className="group rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/15 hover:border-cyan-400/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="font-mono font-bold text-cyan-400 text-[10px]">STEP 04</span>
                <Scissors className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-bold text-white text-xs group-hover:text-cyan-200 transition-colors">ROSA Planning</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Resection planes & gap balance</p>
            </div>
          </Link>

          <Link href="/reports">
            <div className="group rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/15 hover:border-purple-400/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="font-mono font-bold text-purple-400 text-[10px]">STEP 05</span>
                <FileText className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-bold text-white text-xs group-hover:text-purple-200 transition-colors">Clinical Dossier</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Printable pre-op plan sign-off</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        {/* Segmentation Performance */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Segmentation Performance (Dice Score)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={segmentationPerformanceData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="bone" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis domain={[0.9, 1]} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Bar dataKey="dice" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cases Over Time */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Cases Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={casesOverTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Completed" />
              <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Pending" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Patients Table */}
      <div className="rounded-xl border border-slate-200 bg-white mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Recent Patients</h3>
          <Link href="/patients">
            <span className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-left font-medium text-slate-500">Patient ID</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Name</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Age</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Side</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Imaging</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Segmentation</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Reconstruction</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Review</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Updated</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/patients/${p.id}`}>
                      <span className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">{p.id}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-900">{p.name}</td>
                  <td className="px-5 py-3 text-slate-600">{p.age}</td>
                  <td className="px-5 py-3 text-slate-600">{p.kneeSide}</td>
                  <td className="px-5 py-3"><StatusBadge status={p.imagingStatus} /></td>
                  <td className="px-5 py-3"><StatusBadge status={p.segmentationStatus} /></td>
                  <td className="px-5 py-3"><StatusBadge status={p.reconstructionStatus} /></td>
                  <td className="px-5 py-3"><StatusBadge status={p.reviewStatus} /></td>
                  <td className="px-5 py-3 text-slate-500">{p.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Activity */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">System Activity</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {activities.slice(0, 6).map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 truncate">
                  <span className="font-medium">{a.patientName}</span> — {a.description}
                </p>
              </div>
              <span className="shrink-0 text-xs text-slate-400">
                {new Date(a.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
