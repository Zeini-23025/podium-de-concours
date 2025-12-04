import React from 'react';

/**
 * Footer component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass mt-auto border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © {currentYear} Nuit de l'Info - Leaderboard. Tous droits réservés.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Développé avec ❤️ pour la Nuit de l'Info
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

