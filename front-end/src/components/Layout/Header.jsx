import React, { useState } from 'react';
import { Trophy, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Header component with responsive navigation
 */
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Classement' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/admin', label: 'Admin' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/80 transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            aria-label="Retour à l'accueil"
          >
            <Trophy className="w-6 h-6" aria-hidden="true" />
            <span className="hidden xs:inline sm:inline">Nuit de l'Info</span>
            <span className="inline xs:hidden sm:hidden">NDI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block" aria-label="Navigation principale">
            <ul className="flex items-center gap-2 lg:gap-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`px-3 lg:px-4 py-2 rounded-md transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isActive(item.path)
                        ? 'bg-primary text-white'
                        : 'hover:bg-primary/10'
                      }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden tap-target p-2 rounded-md hover:bg-primary/10 transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden mt-4 pb-4 border-t border-slate-200 dark:border-slate-700 pt-4"
            aria-label="Navigation mobile"
          >
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-md transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isActive(item.path)
                        ? 'bg-primary text-white'
                        : 'hover:bg-primary/10'
                      }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
