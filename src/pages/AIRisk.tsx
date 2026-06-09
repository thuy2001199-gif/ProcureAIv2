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
import { ShieldAlert, AlertTriangle, CheckCircle, TrendingDown, Brain, Zap } from 'lucide-react';
import { getVendors, getPurchaseOrders, getVendorRatings } from '../lib/data';
import { useAnimatedCounter } from '../lib/useAnimatedCounter';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler,
);

interface RiskInsight {
  vendorId: string;
  vendorName: string;
  riskScore: number; // 0-100
  category: string;
  factors: string[];
  recommendation: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

function computeRiskInsights(vendors: ReturnType<typeof getVendors>, ratings: ReturnType<typeof getVendorRatings>, pos: ReturnType<typeof getPurchaseOrders>): RiskInsight[] {
  return vendors.map(v => {
    const rating = ratings.find(r => r.vendorId === v.id);
    const vendorPOs = pos.filter(p => p.vendorId === v.id);

    let score = 0;
    const factors: string[] = [];

    // On-time delivery factor
    if (v.onTimeDelivery < 80) { score += 30; factors.push('Low on-time delivery rate'); }
    else if (v.onTimeDelivery < 90) { score += 15; factors.push('Below-average on-time delivery'); }

    // Rating factor
    if (v.rating < 3.0) { score += 25; factors.push('Poor vendor rating'); }
    else if (v.rating < 3.5) { score += 12; factors.push('Below-average vendor rating'); }

    // Contract expiry
    const contractEnd = new Date(v.contractEnd);
    const monthsLeft = (contractEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsLeft < 3) { score += 20; factors.push('Contract expiring soon'); }
    else if (monthsLeft < 6) { score += 10; factors.push('Contract renewal approaching'); }

    // Trend factor
    if (rating?.trend === 'down') { score += 15; factors.push('Declining performance trend'); }

    // Status
    if (v.status === 'under-review') { score += 10; factors.push('Vendor under review'); }
    if (v.status === 'inactive') { score += 5; factors.push('Vendor inactive'); }

    // PO concentration
    if (vendorPOs.length > 3) { score += 5; factors.push('High order concentration'); }

    score = Math.min(score, 100);

    let recommendation: string;
    let severity: RiskInsight['severity'];
    if (score >= 70) { recommendation = 'Immediate action required — consider alternative sourcing'; severity = 'critical'; }
    else if (score >= 50) { recommendation = 'Schedule review meeting and set performance milestones'; severity = 'high'; }
    else if (score >= 30) { recommendation = 'Monitor closely and establish improvement timeline'; severity = 'medium'; }
    else { recommendation = 'Maintain current relationship — low risk profile'; severity = 'low'; }

    return { vendorId: v.id, vendorName: v.name, riskScore: score, category: v.category, factors, recommendation, severity };
  }).sort((a, b) => b.riskScore - a.riskScore);
}

const severityColor: Record<string, string> = {
  critical: 'glass-badge-red',
  high: 'glass-badge-orange',
  medium: 'glass-badge-purple',
  low: 'glass-badge-green',
};

export default function AIRisk() {
  const vendors = useMemo(() => getVendors(), []);
  const ratings = useMemo(() => getVendorRatings(), []);
  const pos = useMemo(() => getPurchaseOrders(), []);

  const insights = useMemo(() => computeRiskInsights(vendors, ratings, pos), [vendors, ratings, pos]);

  const highRiskCount = insights.filter(i => i.severity === 'critical' || i.severity === 'high').length;
  const avgRisk = insights.length > 0 ? Math.round(insights.reduce((s, i) => s + i.riskScore, 0) / insights.length) : 0;

  const animHighRisk = useAnimatedCounter(highRiskCount, 600);
  const animAvgRisk = useAnimatedCounter(avgRisk, 700);
  const animLowRisk = useAnimatedCounter(insights.filter(i => i.severity === 'low').length, 500);

  const severityDist = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [{
      data: [
        insights.filter(i => i.severity === 'critical').length,
        insights.filter(i => i.severity === 'high').length,
        insights.filter(i => i.severity === 'medium').length,
        insights.filter(i => i.severity === 'low').length,
      ],
      backgroundColor: ['rgba(251,113,133,0.6)', 'rgba(251,146,60,0.6)', 'rgba(167,139,250,0.6)', 'rgba(52,211,153,0.6)'],
      borderColor: ['rgba(251,113,133,0.9)', 'rgba(251,146,60,0.9)', 'rgba(167,139,250,0.9)', 'rgba(52,211,153,0.9)'],
      borderWidth: 1,
      hoverOffset: 8,
    }],
  };

  const riskBarData = {
    labels: insights.map(i => i.vendorName),
    datasets: [{
      label: 'Risk Score',
      data: insights.map(i => i.riskScore),
      backgroundColor: insights.map(i =>
        i.severity === 'critical' ? 'rgba(251,113,133,0.5)' :
        i.severity === 'high' ? 'rgba(251,146,60,0.5)' :
        i.severity === 'medium' ? 'rgba(167,139,250,0.5)' :
        'rgba(52,211,153,0.5)'
      ),
      borderColor: insights.map(i =>
        i.severity === 'critical' ? 'rgba(251,113,133,0.8)' :
        i.severity === 'high' ? 'rgba(251,146,60,0.8)' :
        i.severity === 'medium' ? 'rgba(167,139,250,0.8)' :
        'rgba(52,211,153,0.8)'
      ),
      borderWidth: 1,
      borderRadius: 8,
    }],
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: { legend: { display: false } },
    scales: {
      x: { max: 100, ticks: { color: 'var(--text-muted)' }, grid: { color: 'rgba(148,163,184,0.08)' } },
      y: { ticks: { color: 'var(--text-secondary)' }, grid: { display: false } },
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
      <div className="flex items-center gap-2">
        <Brain size={24} className="text-[var(--purple)]" />
        <div>
          <h1 className="text-2xl font-bold text-glass">AI Risk Analysis</h1>
          <p className="text-glass-muted text-sm mt-0.5">AI-powered supply chain risk assessment</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card kpi-accent-red p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-[var(--red)]" />
            <span className="text-sm text-glass-muted">High Risk Vendors</span>
          </div>
          <div className="text-3xl font-bold text-glass">{animHighRisk}</div>
        </div>
        <div className="glass-card kpi-accent-orange p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={18} className="text-[var(--orange)]" />
            <span className="text-sm text-glass-muted">Avg Risk Score</span>
          </div>
          <div className="text-3xl font-bold text-glass">{animAvgRisk}</div>
        </div>
        <div className="glass-card kpi-accent-green p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-[var(--green)]" />
            <span className="text-sm text-glass-muted">Low Risk Vendors</span>
          </div>
          <div className="text-3xl font-bold text-glass">{animLowRisk}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-panel p-5 lg:col-span-2" style={{ minHeight: 300 }}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={18} className="text-[var(--red)]" />
            <h2 className="text-sm font-semibold text-glass">Risk Score by Vendor</h2>
          </div>
          <div style={{ height: 230 }}>
            <Bar data={riskBarData} options={chartOpts} />
          </div>
        </div>

        <div className="glass-panel p-5" style={{ minHeight: 300 }}>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-[var(--purple)]" />
            <h2 className="text-sm font-semibold text-glass">Severity Distribution</h2>
          </div>
          <div style={{ height: 230 }}>
            <Doughnut data={severityDist} options={doughnutOpts} />
          </div>
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-glass">Detailed Risk Insights</h2>
        {insights.map(insight => (
          <div key={insight.vendorId} className="glass-card p-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-glass">{insight.vendorName}</h3>
                  <span className={severityColor[insight.severity]}>{insight.severity}</span>
                  <span className="glass-badge glass-badge-blue">{insight.category}</span>
                </div>

                {/* Risk Score Bar */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--surface)' }}>
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{
                        width: `${insight.riskScore}%`,
                        background: insight.severity === 'critical' ? 'var(--red)' :
                          insight.severity === 'high' ? 'var(--orange)' :
                          insight.severity === 'medium' ? 'var(--purple)' : 'var(--green)',
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-glass w-10 text-right">{insight.riskScore}</span>
                </div>

                {/* Factors */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {insight.factors.map((f, i) => (
                    <span key={i} className="glass-badge text-[10px]" style={{ background: 'var(--surface)', borderColor: 'var(--glass-border)' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card-solid p-3 max-w-xs text-sm text-glass-secondary" style={{ borderRadius: 14 }}>
                <Zap size={14} className="text-[var(--cyan)] inline mr-1" />
                {insight.recommendation}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
