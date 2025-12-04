import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Lock, Unlock } from 'lucide-react';
import { useTeamContext } from '../../contexts/TeamContext';
import TeamForm from './TeamForm';
import ScoreUpdater from './ScoreUpdater';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import { ADMIN_PASSWORD } from '../../utils/constants';

/**
 * Admin Panel component with authentication and team management
 */
const AdminPanel = () => {
  const { teams, loading, error, createTeam, updateTeam, deleteTeam, patchTeam } = useTeamContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Check if already authenticated (stored in sessionStorage)
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);
    setTimeout(() => {
      setToasts(toasts.filter(t => t.id !== id));
    }, 5000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      addToast('Connexion réussie', 'success');
    } else {
      addToast('Mot de passe incorrect', 'error');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    addToast('Déconnexion réussie', 'info');
  };

  const handleCreateTeam = async (teamData) => {
    setFormLoading(true);
    const result = await createTeam(teamData);
    setFormLoading(false);

    if (result.success) {
      addToast('Équipe créée avec succès', 'success');
      setShowForm(false);
    } else {
      addToast(result.error || 'Erreur lors de la création', 'error');
    }
  };

  const handleUpdateTeam = async (teamData) => {
    setFormLoading(true);
    const result = await updateTeam(editingTeam.id, teamData);
    setFormLoading(false);

    if (result.success) {
      addToast('Équipe modifiée avec succès', 'success');
      setEditingTeam(null);
    } else {
      addToast(result.error || 'Erreur lors de la modification', 'error');
    }
  };

  const handleDeleteTeam = async (id, name) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'équipe "${name}" ?`)) {
      const result = await deleteTeam(id);
      if (result.success) {
        addToast('Équipe supprimée avec succès', 'success');
      } else {
        addToast(result.error || 'Erreur lors de la suppression', 'error');
      }
    }
  };

  const handleQuickScoreUpdate = async (id, data) => {
    const result = await patchTeam(id, data);
    if (result.success) {
      addToast('Score mis à jour', 'success');
    } else {
      addToast(result.error || 'Erreur lors de la mise à jour', 'error');
    }
  };

  // Authentication form
  if (!isAuthenticated) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto glass rounded-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <Lock className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Accès Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium mb-2">
                Mot de passe
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Entrez le mot de passe admin"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Se connecter
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panneau d'administration</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-smooth focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          aria-label="Se déconnecter"
        >
          <Unlock className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>

      {/* Toast notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded-lg shadow-lg ${
              toast.type === 'success'
                ? 'bg-success text-white'
                : toast.type === 'error'
                ? 'bg-danger text-white'
                : 'bg-primary text-white'
            }`}
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Create/Edit Form */}
      {(showForm || editingTeam) && (
        <div className="mb-8 glass rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingTeam ? 'Modifier l\'équipe' : 'Créer une nouvelle équipe'}
          </h2>
          <TeamForm
            team={editingTeam}
            onSubmit={editingTeam ? handleUpdateTeam : handleCreateTeam}
            onCancel={() => {
              setShowForm(false);
              setEditingTeam(null);
            }}
            loading={formLoading}
          />
        </div>
      )}

      {/* Teams Table */}
      <div className="glass rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold">Gestion des équipes</h2>
          {!showForm && !editingTeam && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Créer une nouvelle équipe"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle équipe</span>
            </button>
          )}
        </div>

        {loading && teams.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error && teams.length === 0 ? (
          <div className="p-4">
            <ErrorMessage message={error} />
          </div>
        ) : teams.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p>Aucune équipe enregistrée.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-primary hover:underline"
            >
              Créer la première équipe
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Tableau des équipes">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Nom</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Membres</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Score</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {teams.map((team) => (
                  <tr key={team.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 text-sm">{team.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{team.name}</td>
                    <td className="px-4 py-3 text-sm">
                      {team.members?.join(', ') || 'Aucun'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <ScoreUpdater
                        team={team}
                        onUpdate={handleQuickScoreUpdate}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingTeam(team);
                            setShowForm(false);
                          }}
                          className="p-2 text-primary hover:bg-primary/10 rounded transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                          aria-label={`Modifier ${team.name}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(team.id, team.name)}
                          className="p-2 text-danger hover:bg-danger/10 rounded transition-smooth focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2"
                          aria-label={`Supprimer ${team.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPanel;

