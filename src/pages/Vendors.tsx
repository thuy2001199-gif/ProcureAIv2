import { useState, useMemo } from 'react';
import { Search, Plus, Star, MapPin, Mail } from 'lucide-react';
import { getVendors, setVendors, Vendor } from '../lib/data';

const statusColor: Record<string, string> = {
  active: 'glass-badge-green',
  inactive: 'glass-badge-red',
  'under-review': 'glass-badge-orange',
};

const riskColor: Record<string, string> = {
  low: 'glass-badge-green',
  medium: 'glass-badge-orange',
  high: 'glass-badge-red',
};

export default function Vendors() {
  const [vendors, setVendorsState] = useState<Vendor[]>(() => getVendors());
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(vendors.map(v => v.category));
    return ['all', ...Array.from(cats)];
  }, [vendors]);

  const filtered = useMemo(() => {
    return vendors.filter(v => {
      const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.contact.toLowerCase().includes(search.toLowerCase());
      const matchCategory = filterCategory === 'all' || v.category === filterCategory;
      return matchSearch && matchCategory;
    });
  }, [vendors, search, filterCategory]);

  const handleSave = (updated: Vendor[]) => {
    setVendorsState(updated);
    setVendors(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-glass">Vendors</h1>
          <p className="text-glass-muted text-sm mt-1">{vendors.length} vendors registered</p>
        </div>
        <button className="glass-button glass-button-primary flex items-center gap-2">
          <Plus size={16} /> Add Vendor
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-glass-muted" />
          <input
            className="glass-input w-full pl-9"
            placeholder="Search vendors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="glass-input"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          {categories.map(c => (
            <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
          ))}
        </select>
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(vendor => (
          <div key={vendor.id} className="glass-card p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-glass">{vendor.name}</h3>
                <div className="text-xs text-glass-muted mt-0.5">{vendor.category}</div>
              </div>
              <span className={statusColor[vendor.status] ?? 'glass-badge'}>{vendor.status}</span>
            </div>

            <div className="space-y-1.5 text-sm text-glass-secondary">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-glass-muted shrink-0" />
                <span>{vendor.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-glass-muted shrink-0" />
                <span>{vendor.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <Star size={14} className="text-[var(--orange)] fill-[var(--orange)]" />
                <span className="text-sm font-semibold text-glass">{vendor.rating}</span>
              </div>
              <span className={riskColor[vendor.riskLevel]}>{vendor.riskLevel} risk</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="text-center p-2 rounded-xl" style={{ background: 'var(--surface)' }}>
                <div className="text-xs text-glass-muted">Total Spend</div>
                <div className="text-sm font-bold text-glass">${(vendor.totalSpend / 1000).toFixed(0)}K</div>
              </div>
              <div className="text-center p-2 rounded-xl" style={{ background: 'var(--surface)' }}>
                <div className="text-xs text-glass-muted">On-Time</div>
                <div className="text-sm font-bold text-glass">{vendor.onTimeDelivery}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
