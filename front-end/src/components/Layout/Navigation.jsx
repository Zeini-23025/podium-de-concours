import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, BarChart3, Settings } from 'lucide-react';

/**
 * Navigation component (can be used as sidebar or mobile menu)
 */
const Navigation = ({ className = '' }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Classement', icon: Trophy },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin', label: 'Admin', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={className} aria-label="Navigation principale">
      <ul className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                  active
                    ? 'bg-primary text-white'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                } focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;

