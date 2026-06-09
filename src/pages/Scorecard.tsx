import { useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Minus, Star } from 'lucide-react';
import { getVendors, getVendorRatings } from '../lib/data';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function Scorecard() {
  const vendors = useMemo(() => getVendors(), []);
  const ratings = useMemo(() => getVendorRatings(), []);

  const merged = useMemo(() => {
    return vendors.map(v => {
      const r = ratings.find(rt => rt.vendorId === v.id);
      return { vendor: v, rating: r };
    });
  }, [vendors, ratings]);

  const trendIcon = (t: string) => {
    if (t === 'up') return <TrendingUp size={14} className="text-[var(--green)]" />;
    if (t === 'down') return <TrendingDown size={14} className="text-[var(--red)]" />;
    return <Minus size={14} className="text-[var(--text-muted)]" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-glass">Scorecard</h1>
        <p className="text-glass-muted text-sm mt-1">Vendor performance ratings and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {merged.map(({ vendor, rating }) => {
          if (!rating) return null;

          const radarData = {
            labels: ['Quality', 'Delivery', 'Cost', 'Responsiveness'],
            datasets: [{
              label: vendor.name,
              data: [rating.quality, rating.delivery, rating.cost, rating.responsiveness],
              backgroundColor: 'rgba(96,165,250,0.15)',
              borderColor: 'rgba(96,165,250,0.8)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(96,165,250,1)',
              pointRadius: 4,
            }],
          };

          const radarOpts = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                min: 0,
                max: 5,
                ticks: { stepSize: 1, color: 'var(--text-muted)', backdropColor: 'transparent' },
                grid: { color: 'rgba(148,163,184,0.12)' },
                angleLines: { color: 'rgba(148,163,184,0.12)' },
                pointLabels: { color: 'var(--text-secondary)', font: { size: 11 } },
              },
            },
            plugins: { legend: { display: false } },
          };

          return (
            <div key={vendor.id} className="glass-card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-glass">{vendor.name}</h3>
                  <div className="text-xs text-glass-muted mt-0.5">{vendor.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  {trendIcon(rating.trend)}
                  <div className="flex items-center gap-0.5">
                    <Star size={14} className="text-[var(--orange)] fill-[var(--orange)]" />
                    <span className="text-sm font-bold text-glass">{rating.overall}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'Quality', value: rating.quality },
                  { label: 'Delivery', value: rating.delivery },
                  { label: 'Cost', value: rating.cost },
                  { label: 'Service', value: rating.responsiveness },
                ].map(m => (
                  <div key={m.label} className="p-2 rounded-xl" style={{ background: 'var(--surface)' }}>
                    <div className="text-lg font-bold text-glass">{m.value}</div>
                    <div className="text-[10px] text-glass-muted">{m.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ height: 180 }}>
                <Radar data={radarData} options={radarOpts} />
              </div>

              <div className="text-xs text-glass-muted text-right">
                Last reviewed: {rating.lastReviewed}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
