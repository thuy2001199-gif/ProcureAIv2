import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { DollarSign, Users, FileText, Truck, TrendingUp, AlertTriangle } from 'lucide-react';
import { getVendors, getPurchaseOrders, getDeliveryPerformance } from '../lib/data';
import { useAnimatedCounter } from '../lib/useAnimatedCounter';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler,
);

export default function Dashboard() {
  const vendors = useMemo(() => getVendors(), []);
  const pos = useMemo(() => getPurchaseOrders(), []);
  const delivery = useMemo(() => getDeliveryPerformance(), []);

  const totalSpend = vendors.reduce((s, v) => s + v.totalSpend, 0);
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const openPOs = pos.filter(p => p.status !== 'delivered' && p.status !== 'cancelled').length;
  const avgOnTime = vendors.length > 0
    ? Math.round(vendors.reduce((s, v) => s + v.onTimeDelivery, 0) / vendors.length)
    : 0;

  const animatedSpend = useAnimatedCounter(totalSpend / 1000, 900, 1);
  const animatedVendors = useAnimatedCounter(activeVendors, 600);
  const animatedPOs = useAnimatedCounter(openPOs, 600);
  const animatedOnTime = useAnimatedCounter(avgOnTime, 700);

  const kpis = [
    { label: 'Total Spend ($K)', value: animatedSpend, icon: DollarSign, accent: 'kpi-accent-blue', badge: 'glass-badge-blue', badgeText: `${vendors.length} total` },
    { label: 'Active Vendors', value: animatedVendors, icon: Users, accent: 'kpi-accent-cyan', badge: 'glass-badge-cyan', badgeText: `${vendors.filter(v => v.riskLevel === 'high').length} high risk` },
    { label: 'Open Orders', value: animatedPOs, icon: FileText, accent: 'kpi-accent-green', badge: 'glass-badge-green', badgeText: `${pos.filter(p => p.priority === 'critical').length} critical` },
    { label: 'On-Time Avg %', value: animatedOnTime, icon: Truck, accent: 'kpi-accent-orange', badge: 'glass-badge-orange', badgeText: 'industry: 90%' },
  ];

  const spendByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    vendors.forEach(v => { map[v.category] = (map[v.category] || 0) + v.totalSpend; });
    return map;
  }, [vendors]);

  const doughnutData = {
    labels: Object.keys(spendByCategory),
    datasets: [{
      data: Object.values(spendByCategory),
      backgroundColor: ['rgba(96,165,250,0.6)', 'rgba(34,211,238,0.6)', 'rgba(167,139,250,0.6)', 'rgba(52,211,153,0.6)', 'rgba(251,146,60,0.6)'],
      borderColor: ['rgba(96,165,250,0.9)', 'rgba(34,211,238,0.9)', 'rgba(167,139,250,0.9)', 'rgba(52,211,153,0.9)', 'rgba(251,146,60,0.9)'],
      borderWidth: 1,
      hoverOffset: 8,
    }],
  };

  const deliveryLineData = {
    labels: delivery.map(d => d.month),
    datasets: [
      {
        label: 'On-Time',
        data: delivery.map(d => d.onTime),
        borderColor: 'rgba(96,165,250,1)',
        backgroundColor: 'rgba(96,165,250,0.10)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(96,165,250,1)',
      },
      {
        label: 'Late',
        data: delivery.map(d => d.late),
        borderColor: 'rgba(251,146,60,1)',
        backgroundColor: 'rgba(251,146,60,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(251,146,60,1)',
      },
    ],
  };

  const poStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    pos.forEach(p => { counts[p.status] = (counts[p.status] || 0) + 1; });
    return counts;
  }, [pos]);

  const barData = {
    labels: Object.keys(poStatusData).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    datasets: [{
      label: 'Orders',
      data: Object.values(poStatusData),
      backgroundColor: [
        'rgba(148,163,184,0.5)',   // draft
        'rgba(251,146,60,0.5)',    // pending
        'rgba(96,165,250,0.5)',    // approved
        'rgba(34,211,238,0.5)',    // shipped
        'rgba(52,211,153,0.5)',    // delivered
        'rgba(251,113,133,0.5)',   // cancelled
      ],
      borderColor: [
        'rgba(148,163,184,0.8)',
        'rgba(251,146,60,0.8)',
        'rgba(96,165,250,0.8)',
        'rgba(34,211,238,0.8)',
        'rgba(52,211,153,0.8)',
        'rgba(251,113,133,0.8)',
      ],
      borderWidth: 1,
      borderRadius: 8,
    }],
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: 'var(--text-secondary)', font: { size: 12 } } },
    },
    scales: {
      x: { ticks: { color: 'var(--text-muted)' }, grid: { color: 'rgba(148,163,184,0.08)' } },
      y: { ticks: { color: 'var(--text-muted)' }, grid: { color: 'rgba(148,163,184,0.08)' } },
    },
  };

  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: 'var(--text-secondary)', font: { size: 11 }, padding: 16 } },
    },
  };

  const lineOpts = {
    ...chartOpts,
    plugins: { ...chartOpts.plugins, legend: { ...chartOpts.plugins.legend, position: 'top' as const } },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-glass">Dashboard</h1>
        <p className="text-glass-muted text-sm mt-1">Real-time supply chain overview</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`glass-card ${kpi.accent} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <kpi.icon size={20} className="text-glass-muted" />
              <span className={kpi.badge}>{kpi.badgeText}</span>
            </div>
            <div className="text-3xl font-bold text-glass">{kpi.value}</div>
            <div className="text-xs text-glass-muted mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Delivery Trend */}
        <div className="glass-panel p-5 lg:col-span-2" style={{ minHeight: 280 }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-[var(--blue)]" />
            <h2 className="text-sm font-semibold text-glass">Delivery Performance Trend</h2>
          </div>
          <div style={{ height: 210 }}>
            <Line data={deliveryLineData} options={lineOpts} />
          </div>
        </div>

        {/* Spend by Category */}
        <div className="glass-panel p-5" style={{ minHeight: 280 }}>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={18} className="text-[var(--cyan)]" />
            <h2 className="text-sm font-semibold text-glass">Spend by Category</h2>
          </div>
          <div style={{ height: 210 }}>
            <Doughnut data={doughnutData} options={doughnutOpts} />
          </div>
        </div>
      </div>

      {/* PO Status + Risk Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* PO Status */}
        <div className="glass-panel p-5 lg:col-span-2" style={{ minHeight: 260 }}>
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-[var(--green)]" />
            <h2 className="text-sm font-semibold text-glass">Purchase Order Status</h2>
          </div>
          <div style={{ height: 190 }}>
            <Bar data={barData} options={chartOpts} />
          </div>
        </div>

        {/* Risk Alert */}
        <div className="glass-panel p-5" style={{ minHeight: 260 }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-[var(--orange)]" />
            <h2 className="text-sm font-semibold text-glass">Risk Alerts</h2>
          </div>
          <div className="space-y-3">
            {vendors.filter(v => v.riskLevel === 'high').map(v => (
              <div key={v.id} className="glass-card p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-glass">{v.name}</div>
                  <div className="text-xs text-glass-muted">On-time: {v.onTimeDelivery}%</div>
                </div>
                <span className="glass-badge glass-badge-red">High Risk</span>
              </div>
            ))}
            {vendors.filter(v => v.riskLevel === 'medium').map(v => (
              <div key={v.id} className="glass-card p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-glass">{v.name}</div>
                  <div className="text-xs text-glass-muted">On-time: {v.onTimeDelivery}%</div>
                </div>
                <span className="glass-badge glass-badge-orange">Medium</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
