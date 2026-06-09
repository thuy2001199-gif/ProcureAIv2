// ── TypeScript Models ──

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  location: string;
  rating: number;       // 0-5
  status: 'active' | 'inactive' | 'under-review';
  riskLevel: 'low' | 'medium' | 'high';
  totalSpend: number;
  onTimeDelivery: number; // percentage
  contractEnd: string;    // ISO date
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  orderDate: string;
  expectedDelivery: string;
  status: 'draft' | 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
  items: LineItem[];
  totalAmount: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface VendorRating {
  vendorId: string;
  quality: number;
  delivery: number;
  cost: number;
  responsiveness: number;
  overall: number;
  trend: 'up' | 'down' | 'stable';
  lastReviewed: string;
}

export interface DeliveryPerformance {
  month: string;
  onTime: number;
  late: number;
  damaged: number;
  total: number;
}

// ── localStorage Data Layer ──

function read<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T[] : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // silent
  }
}

export const KEYS = {
  vendors: 'vendors',
  purchaseOrders: 'purchaseOrders',
  vendorRatings: 'vendorRatings',
  deliveryPerformance: 'deliveryPerformance',
} as const;

export function getVendors(): Vendor[] {
  return read<Vendor>(KEYS.vendors, []);
}
export function setVendors(data: Vendor[]): void {
  write(KEYS.vendors, data);
}

export function getPurchaseOrders(): PurchaseOrder[] {
  return read<PurchaseOrder>(KEYS.purchaseOrders, []);
}
export function setPurchaseOrders(data: PurchaseOrder[]): void {
  write(KEYS.purchaseOrders, data);
}

export function getVendorRatings(): VendorRating[] {
  return read<VendorRating>(KEYS.vendorRatings, []);
}
export function setVendorRatings(data: VendorRating[]): void {
  write(KEYS.vendorRatings, data);
}

export function getDeliveryPerformance(): DeliveryPerformance[] {
  return read<DeliveryPerformance>(KEYS.deliveryPerformance, []);
}
export function setDeliveryPerformance(data: DeliveryPerformance[]): void {
  write(KEYS.deliveryPerformance, data);
}

// ── Seed Data ──

const sampleVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Acme Materials Co.',
    category: 'Raw Materials',
    contact: 'Sarah Chen',
    email: 'sarah@acmematerials.com',
    location: 'Shanghai, CN',
    rating: 4.2,
    status: 'active',
    riskLevel: 'low',
    totalSpend: 284000,
    onTimeDelivery: 94,
    contractEnd: '2027-03-15',
  },
  {
    id: 'v2',
    name: 'NovaTech Electronics',
    category: 'Electronics',
    contact: 'James Park',
    email: 'jpark@novatech.io',
    location: 'Seoul, KR',
    rating: 3.8,
    status: 'active',
    riskLevel: 'medium',
    totalSpend: 512000,
    onTimeDelivery: 87,
    contractEnd: '2026-11-30',
  },
  {
    id: 'v3',
    name: 'GreenPath Logistics',
    category: 'Logistics',
    contact: 'Maria Lopez',
    email: 'mlopez@greenpath.co',
    location: 'Monterrey, MX',
    rating: 4.5,
    status: 'active',
    riskLevel: 'low',
    totalSpend: 178000,
    onTimeDelivery: 96,
    contractEnd: '2027-06-01',
  },
  {
    id: 'v4',
    name: 'SteelForge Industries',
    category: 'Raw Materials',
    contact: 'Henrik Muller',
    email: 'h.muller@steelforge.de',
    location: 'Duisburg, DE',
    rating: 3.1,
    status: 'under-review',
    riskLevel: 'high',
    totalSpend: 395000,
    onTimeDelivery: 72,
    contractEnd: '2026-08-20',
  },
  {
    id: 'v5',
    name: 'BrightStar Components',
    category: 'Components',
    contact: 'Aiko Tanaka',
    email: 'aiko@brightstar.jp',
    location: 'Osaka, JP',
    rating: 4.0,
    status: 'inactive',
    riskLevel: 'medium',
    totalSpend: 223000,
    onTimeDelivery: 91,
    contractEnd: '2025-12-31',
  },
];

const samplePOs: PurchaseOrder[] = [
  {
    id: 'PO-1001',
    vendorId: 'v1',
    vendorName: 'Acme Materials Co.',
    orderDate: '2026-05-12',
    expectedDelivery: '2026-06-15',
    status: 'shipped',
    items: [
      { id: 'li1', description: 'Aluminum Sheet 2mm', quantity: 500, unitPrice: 42, total: 21000 },
      { id: 'li2', description: 'Copper Wire Spool', quantity: 200, unitPrice: 85, total: 17000 },
    ],
    totalAmount: 38000,
    priority: 'high',
  },
  {
    id: 'PO-1002',
    vendorId: 'v2',
    vendorName: 'NovaTech Electronics',
    orderDate: '2026-05-20',
    expectedDelivery: '2026-07-01',
    status: 'approved',
    items: [
      { id: 'li3', description: 'PCB Board Type-A', quantity: 1000, unitPrice: 18, total: 18000 },
      { id: 'li4', description: 'Microcontroller Unit', quantity: 500, unitPrice: 32, total: 16000 },
    ],
    totalAmount: 34000,
    priority: 'critical',
  },
  {
    id: 'PO-1003',
    vendorId: 'v3',
    vendorName: 'GreenPath Logistics',
    orderDate: '2026-06-01',
    expectedDelivery: '2026-06-10',
    status: 'delivered',
    items: [
      { id: 'li5', description: 'Freight Service - Route 7', quantity: 1, unitPrice: 12500, total: 12500 },
    ],
    totalAmount: 12500,
    priority: 'low',
  },
  {
    id: 'PO-1004',
    vendorId: 'v4',
    vendorName: 'SteelForge Industries',
    orderDate: '2026-05-28',
    expectedDelivery: '2026-07-15',
    status: 'pending',
    items: [
      { id: 'li6', description: 'Steel I-Beam S200', quantity: 120, unitPrice: 340, total: 40800 },
      { id: 'li7', description: 'Rebar Bundle 12mm', quantity: 300, unitPrice: 95, total: 28500 },
    ],
    totalAmount: 69300,
    priority: 'high',
  },
  {
    id: 'PO-1005',
    vendorId: 'v5',
    vendorName: 'BrightStar Components',
    orderDate: '2026-06-03',
    expectedDelivery: '2026-06-20',
    status: 'draft',
    items: [
      { id: 'li8', description: 'Ceramic Capacitor 100nF', quantity: 5000, unitPrice: 0.45, total: 2250 },
      { id: 'li9', description: 'LED Array Module', quantity: 800, unitPrice: 12, total: 9600 },
    ],
    totalAmount: 11850,
    priority: 'medium',
  },
];

const sampleRatings: VendorRating[] = [
  { vendorId: 'v1', quality: 4.3, delivery: 4.0, cost: 4.1, responsiveness: 4.5, overall: 4.2, trend: 'up', lastReviewed: '2026-05-15' },
  { vendorId: 'v2', quality: 3.9, delivery: 3.6, cost: 3.8, responsiveness: 4.0, overall: 3.8, trend: 'down', lastReviewed: '2026-05-10' },
  { vendorId: 'v3', quality: 4.6, delivery: 4.7, cost: 4.2, responsiveness: 4.4, overall: 4.5, trend: 'up', lastReviewed: '2026-05-20' },
  { vendorId: 'v4', quality: 2.8, delivery: 2.5, cost: 3.5, responsiveness: 3.0, overall: 3.1, trend: 'down', lastReviewed: '2026-04-28' },
  { vendorId: 'v5', quality: 4.1, delivery: 3.9, cost: 3.8, responsiveness: 4.2, overall: 4.0, trend: 'stable', lastReviewed: '2026-03-12' },
];

const sampleDelivery: DeliveryPerformance[] = [
  { month: 'Jan', onTime: 42, late: 5, damaged: 1, total: 48 },
  { month: 'Feb', onTime: 38, late: 8, damaged: 2, total: 48 },
  { month: 'Mar', onTime: 45, late: 3, damaged: 0, total: 48 },
  { month: 'Apr', onTime: 40, late: 6, damaged: 1, total: 47 },
  { month: 'May', onTime: 44, late: 2, damaged: 1, total: 47 },
  { month: 'Jun', onTime: 46, late: 1, damaged: 0, total: 47 },
];

export function seedData(): void {
  const vendors = getVendors();
  if (vendors.length > 0) return;

  setVendors(sampleVendors);
  setPurchaseOrders(samplePOs);
  setVendorRatings(sampleRatings);
  setDeliveryPerformance(sampleDelivery);
}
