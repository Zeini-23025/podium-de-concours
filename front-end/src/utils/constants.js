// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Polling interval (ms)
export const POLLING_INTERVAL = 5000;

// Team limits
export const MIN_MEMBERS = 1;
export const MAX_MEMBERS = 5;

// Colors for medals
export const MEDAL_COLORS = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

// Trend indicators
export const TREND_UP = 'up';
export const TREND_DOWN = 'down';
export const TREND_STABLE = 'stable';

// Admin password (in production, use proper authentication)
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

