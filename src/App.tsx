import { useState, useEffect } from 'react';
import Sidebar, { type Page } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import PurchaseOrders from './pages/PurchaseOrders';
import Delivery from './pages/Delivery';
import Scorecard from './pages/Scorecard';
import AIRisk from './pages/AIRisk';
import { seedData } from './lib/data';

function getInitialTheme(): boolean {
  try {
    const stored = localStorage.getItem('theme');
    return stored !== 'light'; // dark is default
  } catch {
    return true;
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isDark, setIsDark] = useState(getInitialTheme);

  // Seed data on first visit
  useEffect(() => {
    seedData();
  }, []);

  // Apply theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {
      // silent
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'vendors': return <Vendors />;
      case 'purchase-orders': return <PurchaseOrders />;
      case 'delivery': return <Delivery />;
      case 'scorecard': return <Scorecard />;
      case 'ai-risk': return <AIRisk />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main content offset for sidebar */}
      <main className="ml-[252px] p-6 relative z-1 min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
