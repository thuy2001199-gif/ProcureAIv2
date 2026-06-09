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
import { Bar, Doughnut } from 'react-chartjs-2';
import { Truck, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { getDeliveryPerformance, getPurchaseOrders } from '../lib/data';
import { useAnimatedCounter } from '../lib/useAnimatedCounter';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler,
);

export default function Delivery() {
  const delivery = useMemo(() => getDeliveryPerformance(), []);
  const pos = useMemo(() => getPurchaseOrders(), []);

  const totalOnTime = delivery.reduce((s, d) => s + d.onTime, 0);
  const totalLate = delivery.reduce((s, d) => s + d.late, 0);
  const totalDamaged = delivery.reduce((s, d) => s + d.damaged, 0);
  const totalAll = delivery.reduce((s, d) => s + d.total, 0);

  const onTimeRate = totalAll > 0 ? Math.round((totalOnTime / totalAll) * 100) : 0;

  const animOnTime = useAnimatedCounter(onTimeRate, 700);
  const animDelivered = useAnimatedCounter(pos.filter(p => p.status === 'delivered').length, 500);
  const animInTransit = useAnimatedCounter(pos.filter(p => p.status === 'shipped').length, 500);

  const barData = {
    labels: delivery.map(d => d.month),
    datasets: [
      {
        label: 'On-Time',
        data: delivery.map(d => d.onTime),
        backgroundColor: 'rgba(52,211,153,0.5)',
        borderColor: 'rgba(52,211,153,0.8)',
        borderWidth: 1,
        borderRadius: 8,
      },
      {
        label: 'Late',
        data: delivery.map(d => d.late),
        backgroundColor: 'rgba(251,146,60,0.5)',
        borderColor: 'rgba(251,146,60,0.8)',
        borderWidth: 1,
        borderRadius: 8,
      },
      {
        label: 'Damaged',
        data: delivery.map(d => d.damaged),
        backgroundColor: 'rgba(251,113,133,0.5)',
        borderColor: 'rgba(251,113,133,0.8)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: ['On-Time', 'Late', 'Damaged'],
    datasets: [{
      data: [totalOnTime, totalLate, totalDamaged],
      backgroundColor: ['rgba(52,211,153,0.6)', 'rgba(251,146,60,0.6)', 'rgba(251,113,133,0.6)'],
      borderColor: ['rgba(52,211,153,0.9)', 'rgba(251,146,60,0.9)', 'rgba(251,113,133,0.9)'],
      borderWidth: 1,
      hoverOffset: 8,
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-glass">Delivery</h1>
        <p className="text-glass-muted text-sm mt-1">Track shipment performance and on-time metrics</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card kpi-accent-green p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-[var(--green)]" />
            <span className="text-sm text-glass-muted">On-Time Rate</span>
          </div>
          <div className="text-3xl font-bold text-glass">{animOnTime}%</div>
        </div>
        <div className="glass-card kpi-accent-cyan p-5">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={18} className="text-[var(--cyan)]" />
            <span className="text-sm text-glass-muted">In Transit</span>
          </div>
          <div className="text-3xl font-bold text-glass">{animInTransit}</div>
        </div>
        <div className="glass-card kpi-accent-blue p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-[var(--blue)]" />
            <span className="text-sm text-glass-muted">Delivered</span>
          </div>
          <div className="text-3xl font-bold text-glass">{animDelivered}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-panel p-5 lg:col-span-2" style={{ minHeight: 300 }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-[var(--orange)]" />
            <h2 className="text-sm font-semibold text-glass">Monthly Delivery Breakdown</h2>
          </div>
          <div style={{ height: 230 }}>
            <Bar data={barData} options={chartOpts} />
          </div>
        </div>

        <div className="glass-panel p-5" style={{ minHeight: 300 }}>
          <div className="flex items-center gap-2 mb-4">
            <XCircle size={18} className="text-[var(--red)]" />
            <h2 className="text-sm font-semibold text-glass">Overall Distribution</h2>
          </div>
          <div style={{ height: 230 }}>
            <Doughnut data={doughnutData} options={doughnutOpts} />
          </div>
        </div>
      </div>
    </div>
  );
}
