import React from 'react';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Header component with navigation
 */
const Header = () => {
  return (
    <header className="glass sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/80 transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            aria-label="Retour à l'accueil"
          >
            <Trophy className="w-6 h-6" aria-hidden="true" />
            <span>Nuit de l'Info</span>
          </Link>
          <nav aria-label="Navigation principale">
            <ul className="flex items-center gap-4">
              <li>
                <Link
                  to="/"
                  className="px-4 py-2 rounded-md hover:bg-primary/10 transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Classement
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-md hover:bg-primary/10 transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-md hover:bg-primary/10 transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

