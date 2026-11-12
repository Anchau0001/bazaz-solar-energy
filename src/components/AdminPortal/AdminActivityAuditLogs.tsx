import React, { useState, useEffect } from 'react';
import { ActivityLog } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { ShieldAlert, Search, Filter, Clock, User, CheckCircle2, History } from 'lucide-react';

export const AdminActivityAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await api.getActivityLogs(200);
      setLogs(data);
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const actionTypes = Array.from(new Set(logs.map(l => l.actionType))).sort();

  const filteredLogs = logs.filter(l => {
    if (selectedAction !== 'all' && l.actionType !== selectedAction) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.description.toLowerCase().includes(q) ||
      l.userName.toLowerCase().includes(q) ||
      l.actionType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">System Activity & Security Audit Trail</h3>
          <p className="text-xs text-slate-500">
            Immutable log of transactions, logins, stock movements, and administrative modifications
          </p>
        </div>

        <button
          onClick={loadLogs}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
        >
          <History className="w-3.5 h-3.5" />
          <span>{isLoading ? 'Refreshing...' : 'Refresh Logs'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by staff name, action, or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:outline-none"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedAction}
            onChange={e => setSelectedAction(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
          >
            <option value="all">All Action Types ({actionTypes.length})</option>
            {actionTypes.map(act => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[11px]">
              <th className="p-3">Timestamp</th>
              <th className="p-3">Actor / User</th>
              <th className="p-3">Action Type</th>
              <th className="p-3">Event Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {filteredLogs.map(l => (
              <tr key={l.id} className="hover:bg-slate-50/70 transition">
                <td className="p-3 text-slate-500 whitespace-nowrap">
                  {new Date(l.timestamp).toLocaleString('en-GB')}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span className="font-bold text-slate-900 block font-sans">{l.userName}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{l.userRole}</span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    l.actionType.includes('SALE') ? 'bg-emerald-100 text-emerald-800' : l.actionType.includes('STOCK') ? 'bg-blue-100 text-blue-800' : l.actionType.includes('AUTH') ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {l.actionType}
                  </span>
                </td>
                <td className="p-3 text-slate-800 font-sans">{l.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs font-sans">
            No audit logs found matching criteria.
          </div>
        )}
      </div>
    </div>
  );
};
