import { useState, useMemo } from 'react';
import { Search, Plus, ChevronDown, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import { getPurchaseOrders, PurchaseOrder } from '../lib/data';

const statusColor: Record<string, string> = {
  draft: 'glass-badge',
  pending: 'glass-badge-orange',
  approved: 'glass-badge-blue',
  shipped: 'glass-badge-cyan',
  delivered: 'glass-badge-green',
  cancelled: 'glass-badge-red',
};

const priorityColor: Record<string, string> = {
  low: 'glass-badge',
  medium: 'glass-badge-blue',
  high: 'glass-badge-orange',
  critical: 'glass-badge-red',
};

export default function PurchaseOrders() {
  const pos = useMemo(() => getPurchaseOrders(), []);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedPO, setExpandedPO] = useState<string | null>(null);

  const statuses = ['all', 'draft', 'pending', 'approved', 'shipped', 'delivered', 'cancelled'];

  const filtered = useMemo(() => {
    return pos.filter(p => {
      const matchSearch = p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.vendorName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [pos, search, filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-glass">Purchase Orders</h1>
          <p className="text-glass-muted text-sm mt-1">{pos.length} total orders</p>
        </div>
        <button className="glass-button glass-button-primary flex items-center gap-2">
          <Plus size={16} /> New Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-glass-muted" />
          <input
            className="glass-input w-full pl-9"
            placeholder="Search orders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="glass-input"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          {statuses.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* PO List */}
      <div className="space-y-3">
        {filtered.map(po => {
          const isExpanded = expandedPO === po.id;
          return (
            <div key={po.id} className="glass-card-solid">
              {/* Header Row */}
              <button
                className="w-full flex items-center gap-4 p-4 text-left cursor-pointer"
                onClick={() => setExpandedPO(isExpanded ? null : po.id)}
              >
                <span className="shrink-0">
                  {isExpanded ? <ChevronDown size={18} className="text-glass-muted" /> : <ChevronRight size={18} className="text-glass-muted" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-glass">{po.id}</span>
                    <span className={statusColor[po.status] ?? 'glass-badge'}>{po.status}</span>
                    <span className={priorityColor[po.priority] ?? 'glass-badge'}>{po.priority}</span>
                    {po.priority === 'critical' && <AlertTriangle size={14} className="text-[var(--red)]" />}
                  </div>
                  <div className="text-sm text-glass-secondary mt-0.5">{po.vendorName}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-glass">${po.totalAmount.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-xs text-glass-muted">
                    <Clock size={12} />
                    <span>{po.expectedDelivery}</span>
                  </div>
                </div>
              </button>

              {/* Expanded Line Items */}
              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="rounded-xl overflow-hidden" style={{ background: 'var(--surface)' }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-glass-muted text-xs border-b border-[var(--glass-border)]">
                          <th className="text-left py-2 px-3">Description</th>
                          <th className="text-right py-2 px-3">Qty</th>
                          <th className="text-right py-2 px-3">Unit Price</th>
                          <th className="text-right py-2 px-3">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {po.items.map(item => (
                          <tr key={item.id} className="border-b border-[var(--glass-border)] last:border-0">
                            <td className="py-2 px-3 text-glass">{item.description}</td>
                            <td className="py-2 px-3 text-right text-glass-secondary">{item.quantity}</td>
                            <td className="py-2 px-3 text-right text-glass-secondary">${item.unitPrice}</td>
                            <td className="py-2 px-3 text-right font-medium text-glass">${item.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="text-glass-muted">Ordered: {po.orderDate}</span>
                    <span className="font-semibold text-glass">Total: ${po.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
