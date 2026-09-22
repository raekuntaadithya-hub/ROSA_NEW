import { useState, useMemo } from 'react';
import { Link, useSearch } from 'wouter';
import AppLayout from '@/layouts/AppLayout';
import { mockPatients } from '@/data/mockPatients';
import type { WorkflowStatus, ReviewStatus, KneeSide } from '@/types';
import { Search, Filter, Users } from 'lucide-react';

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

export default function PatientRegistry() {
  const searchString = useSearch();
  const urlParams = new URLSearchParams(searchString);
  const initialSearch = urlParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sideFilter, setSideFilter] = useState<KneeSide | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    return mockPatients.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSide = sideFilter === 'All' || p.kneeSide === sideFilter;
      const matchesStatus =
        statusFilter === 'All' || p.segmentationStatus === statusFilter || p.reviewStatus === statusFilter;
      const matchesUrgency = urgencyFilter === 'All' || p.urgency === urgencyFilter;
      return matchesSearch && matchesSide && matchesStatus && matchesUrgency;
    });
  }, [searchQuery, sideFilter, statusFilter, urgencyFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Registry</h1>
          <p className="text-sm text-slate-500 mt-1">
            {filtered.length} patient{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
          <Users className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">DEMO DATA — NOT FOR CLINICAL USE</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search by name or ID..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={sideFilter}
            onChange={(e) => { setSideFilter(e.target.value as KneeSide | 'All'); setCurrentPage(1); }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none"
          >
            <option value="All">All Sides</option>
            <option value="Left">Left</option>
            <option value="Right">Right</option>
            <option value="Bilateral">Bilateral</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Approved">Approved</option>
            <option value="Requires Review">Requires Review</option>
          </select>

          <select
            value={urgencyFilter}
            onChange={(e) => { setUrgencyFilter(e.target.value); setCurrentPage(1); }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-300 focus:outline-none"
          >
            <option value="All">All Urgency</option>
            <option value="Routine">Routine</option>
            <option value="Urgent">Urgent</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-3 text-left font-medium text-slate-500">Patient ID</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Name</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Age</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Gender</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Knee Side</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Urgency</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Imaging</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Segmentation</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Reconstruction</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500">Review</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5">
                    <Link href={`/patients/${p.id}`}>
                      <span className="font-medium text-blue-600 hover:text-blue-700">{p.id}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/patients/${p.id}`}>
                      <span className="font-medium text-slate-900 hover:text-blue-700">{p.name}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{p.age}</td>
                  <td className="px-5 py-3.5 text-slate-600">{p.gender}</td>
                  <td className="px-5 py-3.5 text-slate-600">{p.kneeSide}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      p.urgency === 'Emergency' ? 'bg-red-50 text-red-700' :
                      p.urgency === 'Urgent' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {p.urgency}
                    </span>
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.imagingStatus} /></td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.segmentationStatus} /></td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.reconstructionStatus} /></td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.reviewStatus} /></td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-slate-400">
                    No patients match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
            <p className="text-sm text-slate-500">
              Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
