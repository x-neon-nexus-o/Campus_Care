import { useEffect, useMemo, useState } from 'react';
import api from '../utils/api';
import Charts from '../components/Charts';
import NotificationCenter from '../components/NotificationCenter';
import { exportToCSV, exportToPDF, exportToDOCX, exportToImage, exportStructuredPDF, formatComplaintsForExport } from '../utils/exportUtils';

const STATUS = ['pending', 'in_review', 'in_progress', 'resolved', 'rejected', 'escalated'];
const URGENCY = ['low', 'medium', 'high', 'urgent'];

function AdminDashboard() {
  const [filters, setFilters] = useState({ dept: '', status: '', urgency: '', assigned: '' });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Build absolute URL for files served from backend /uploads
  const getFileUrl = (p) => {
    if (!p) return '';
    const str = String(p).trim();
    // If already absolute HTTP(S), return as-is
    if (/^https?:\/\//i.test(str)) return str;
    const base = (api?.defaults?.baseURL || '').replace(/\/$/, '').replace(/\/api$/, '');
    if (!base) return str;
    const right = str.replace(/^\/+/, '');
    return `${base}/${right}`;
  };

  const isImagePath = (p) => /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(p || '');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      const res = await api.get('/complaints', { params });
      // Handle both old array format and new paginated format
      if (Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        setItems(res.data.data || []);
        // Note: We might want to add pagination state if we want to support paging in admin dashboard too
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const assignedCount = useMemo(() => items.filter(i => i.assignedTo).length, [items]);
  const unassignedCount = useMemo(() => items.length - assignedCount, [items, assignedCount]);

  const updateComplaint = async (id, updates) => {
    await api.patch(`/complaints/${id}`, updates);
    fetchData();
  };

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams({ ...filters, save: 'true' });
      const url = `${api.defaults.baseURL}/complaints/export/csv?${params.toString()}`;
      const res = await fetch(url, { headers: { Authorization: api.defaults.headers.common['Authorization'] || '' } });
      if (!res.ok) throw new Error('Failed to export CSV');
      const data = await res.json();
      // Open server-saved file URL; browser will download from /uploads/exports
      const a = document.createElement('a');
      a.href = getFileUrl(data.url);
      a.download = data.filename || 'complaints-report.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('CSV export failed', e);
    }
  };

  const handleExportPDF = async () => {
    try {
      // Fetch full data first
      const params = { ...filters, limit: 10000 };
      const res = await api.get('/complaints', { params });
      const fullItems = res.data || [];

      const kpis = {
        total: fullItems.length,
        assigned: fullItems.filter(i => i.assignedTo).length,
        unassigned: fullItems.filter(i => !i.assignedTo).length,
        slaBreaches: fullItems.filter(c => c.dueAt && new Date(c.dueAt) < new Date() && c.status !== 'resolved').length,
      };

      await exportStructuredPDF({ complaints: fullItems, kpis, filename: 'complaints-report' });
    } catch (e) {
      console.error('PDF export failed', e);
    }
  };

  const handleExportDOCX = async () => {
    try {
      await fetchData();
      await exportToDOCX('admin-dashboard-content', 'complaints-report');
    } catch (e) {
      console.error('DOCX export failed', e);
    }
  };

  const handleExportImage = async () => {
    try {
      await fetchData();
      await exportToImage('admin-dashboard-content', 'complaints-report');
    } catch (e) {
      console.error('Image export failed', e);
    }
  };

  return (
    <div className="min-h-screen">
      <div id="admin-dashboard-content" className="max-w-7xl mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <NotificationCenter complaints={items} onUpdate={fetchData} />
            <div className="dropdown dropdown-end dropdown-top">
              <div tabIndex={0} role="button" className="btn btn-primary">
                Export
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
                <li><button onClick={handleExportCSV}>Export to CSV</button></li>
                <li><button onClick={handleExportPDF}>Export to PDF</button></li>
                <li><button onClick={handleExportDOCX}>Export to DOCX</button></li>
                <li><button onClick={handleExportImage}>Export as Image</button></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 shadow">
          <div className="card-body grid gap-3 md:grid-cols-5">
            <input className="input input-bordered" placeholder="Department" value={filters.dept} onChange={(e) => setFilters({ ...filters, dept: e.target.value })} />
            <select className="select select-bordered" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All Status</option>
              {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="select select-bordered" value={filters.urgency} onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}>
              <option value="">All Urgency</option>
              {URGENCY.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="select select-bordered" value={filters.assigned} onChange={(e) => setFilters({ ...filters, assigned: e.target.value })}>
              <option value="">All</option>
              <option value="true">Assigned</option>
              <option value="false">Unassigned</option>
            </select>
            <button className="btn btn-primary" onClick={fetchData} disabled={loading}>Apply</button>
          </div>
        </div>

        {/* Charts */}
        <Charts complaints={items} />

        {/* KPIs */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total</div>
            <div className="stat-value">{items.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Assigned</div>
            <div className="stat-value">{assignedCount}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Unassigned</div>
            <div className="stat-value">{unassignedCount}</div>
          </div>
          <div className="stat">
            <div className="stat-title">SLA Breaches</div>
            <div className="stat-value text-red-600">
              {items.filter(c => c.dueAt && new Date(c.dueAt) < new Date() && c.status !== 'resolved').length}
            </div>
          </div>
        </div>

        {/* Queue */}
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Dept</th>
                <th>Status</th>
                <th>Urgency</th>
                <th>Assigned To</th>
                <th>SLA</th>
                <th>Attachments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c._id}>
                  <td>{c.subject}</td>
                  <td>{c.department || '-'}</td>
                  <td>{c.status}</td>
                  <td>{c.urgency}</td>
                  <td>{(typeof c.assignedTo === 'string' ? c.assignedTo : (c.assignedTo?.email || c.assignedTo?.name)) || '-'}</td>
                  <td>{c.dueAt ? new Date(c.dueAt).toLocaleString() : '-'}</td>
                  <td>
                    <div className="flex items-center gap-2 max-w-[220px]">
                      {c.voiceNote && (
                        <audio controls src={getFileUrl(c.voiceNote)} className="h-8">
                          Your browser does not support the audio element.
                        </audio>
                      )}
                      {(c.mediaFiles || []).slice(0, 3).map((p, idx) => (
                        isImagePath(p) ? (
                          <a key={idx} href={getFileUrl(p)} target="_blank" rel="noreferrer">
                            <img src={getFileUrl(p)} alt="attachment" className="w-12 h-12 object-cover rounded" />
                          </a>
                        ) : (
                          <a key={idx} href={getFileUrl(p)} target="_blank" rel="noreferrer" className="link link-primary text-xs truncate max-w-[120px]">
                            {p.split('/').pop()}
                          </a>
                        )
                      ))}
                      {(c.mediaFiles?.length || 0) > 3 && (
                        <span className="text-xs opacity-70">+{c.mediaFiles.length - 3} more</span>
                      )}
                    </div>
                  </td>
                  <td className="flex gap-2">
                    <button className="btn btn-xs" onClick={() => updateComplaint(c._id, { status: 'in_review' })}>Mark In-Review</button>
                    <button className="btn btn-xs" onClick={() => updateComplaint(c._id, { status: 'in_progress' })}>Start</button>
                    <button className="btn btn-xs" onClick={() => updateComplaint(c._id, { status: 'resolved' })}>Resolve</button>
                    <button className="btn btn-xs" onClick={() => updateComplaint(c._id, { status: 'escalated' })}>Escalate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;


