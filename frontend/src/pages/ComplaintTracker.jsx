import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import LoadingSkeleton from '../components/LoadingSkeleton';

const STATUS_COLORS = {
  submitted: 'badge-warning',
  in_progress: 'badge-info',
  resolved: 'badge-success',
  rejected: 'badge-error',
};

function ComplaintTracker() {
  const navigate = useNavigate();
  const [queryId, setQueryId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('card');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchComplaints = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (queryId) params.id = queryId.trim();
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await api.get('/complaints', { params });

      // Handle both old array format and new paginated format
      if (Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        setItems(res.data.data || []);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Complaint Tracker</h1>

        <div className="card bg-base-100 shadow mb-4">
          <div className="card-body grid gap-3 md:grid-cols-4">
            <input className="input input-bordered" placeholder="Search by Complaint ID" value={queryId} onChange={(e) => setQueryId(e.target.value)} />
            <input className="input input-bordered" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <input className="input input-bordered" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={() => fetchComplaints(1)} disabled={loading}>Search</button>
              <button className="btn" onClick={() => setView(view === 'card' ? 'table' : 'card')}>{view === 'card' ? 'Table View' : 'Card View'}</button>
            </div>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <button className="btn btn-outline" onClick={() => navigate('/submit-complaint')}>Go to Submit Complaint</button>
        </div>

        {loading ? <LoadingSkeleton /> : view === 'card' ? (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((c) => (
              <div key={c._id} className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <h3 className="card-title">{c.subject}</h3>
                    <span className={`badge ${STATUS_COLORS[c.status] || 'badge-ghost'}`}>{c.status}</span>
                  </div>
                  <p className="text-sm opacity-70">Submitted: {new Date(c.createdAt).toLocaleString()}</p>
                  <p className="text-sm">Category: {c.category}</p>
                  <p className="text-sm">ID: {c._id}</p>
                  <div className="mt-3">
                    <ul className="steps steps-vertical lg:steps-horizontal">
                      <li className={`step ${['submitted', 'in_progress', 'resolved'].includes(c.status) ? 'step-primary' : ''}`}>Submitted</li>
                      <li className={`step ${['in_progress', 'resolved'].includes(c.status) ? 'step-primary' : ''}`}>Assigned</li>
                      <li className={`step ${['in_progress', 'resolved'].includes(c.status) ? 'step-primary' : ''}`}>Reviewed</li>
                      <li className={`step ${c.status === 'resolved' ? 'step-primary' : ''}`}>Resolved</li>
                    </ul>
                  </div>
                  {c.status === 'resolved' && (
                    <div className="mt-2">
                      <button className="btn btn-outline btn-sm">Leave Feedback</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Submitted</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c._id}>
                    <td className="font-mono text-xs">{c._id}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>{c.subject}</td>
                    <td><span className={`badge ${STATUS_COLORS[c.status] || 'badge-ghost'}`}>{c.status}</span></td>
                    <td>{c.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
          <div className="join">
            <button
              className="join-item btn"
              disabled={pagination.page <= 1 || loading}
              onClick={() => fetchComplaints(pagination.page - 1)}
            >
              «
            </button>
            <button className="join-item btn">Page {pagination.page} of {pagination.pages || 1}</button>
            <button
              className="join-item btn"
              disabled={pagination.page >= pagination.pages || loading}
              onClick={() => fetchComplaints(pagination.page + 1)}
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div >
  );
}

export default ComplaintTracker;


