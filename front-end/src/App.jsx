import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TeamProvider } from './contexts/TeamContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Dashboard from './components/Dashboard/Dashboard';
import AdminPanel from './components/Admin/AdminPanel';

/**
 * Main App component with routing
 */
function App() {
  return (
    <TeamProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <Routes>
            <Route path="/" element={<Leaderboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </TeamProvider>
  );
}

export default App;

