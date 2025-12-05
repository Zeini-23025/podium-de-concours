import React, { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { MIN_MEMBERS, MAX_MEMBERS } from '../../utils/constants';

/**
 * Team form component for creating/editing teams
 */
const TeamForm = ({ team = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    members: team?.members || [''],
    score: team?.score || 0,
    logo: null,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de l\'équipe est requis';
    }

    const validMembers = formData.members.filter(m => m.trim());
    if (validMembers.length < MIN_MEMBERS) {
      newErrors.members = `Au moins ${MIN_MEMBERS} membre est requis`;
    }
    if (validMembers.length > MAX_MEMBERS) {
      newErrors.members = `Maximum ${MAX_MEMBERS} membres autorisés`;
    }

    if (formData.score < 0) {
      newErrors.score = 'Le score ne peut pas être négatif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const validMembers = formData.members.filter(m => m.trim());
    const submitData = {
      name: formData.name.trim(),
      members: validMembers,
      score: parseInt(formData.score) || 0,
    };

    onSubmit(submitData);
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...formData.members];
    newMembers[index] = value;
    setFormData({ ...formData, members: newMembers });
    if (errors.members) {
      setErrors({ ...errors, members: null });
    }
  };

  const addMember = () => {
    if (formData.members.length < MAX_MEMBERS) {
      setFormData({
        ...formData,
        members: [...formData.members, ''],
      });
    }
  };

  const removeMember = (index) => {
    if (formData.members.length > MIN_MEMBERS) {
      const newMembers = formData.members.filter((_, i) => i !== index);
      setFormData({ ...formData, members: newMembers });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For now, we'll just store the file reference
      setFormData({ ...formData, logo: file });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label={team ? 'Modifier l\'équipe' : 'Créer une équipe'}>
      {/* Team Name */}
      <div>
        <label htmlFor="team-name" className="block text-sm font-medium mb-2">
          Nom de l'équipe <span className="text-danger">*</span>
        </label>
        <input
          id="team-name"
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: null });
          }}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.name ? 'border-danger' : 'border-slate-300'
            }`}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
          required
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-danger" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Members */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Membres ({MIN_MEMBERS}-{MAX_MEMBERS}) <span className="text-danger">*</span>
        </label>
        <div className="space-y-2">
          {formData.members.map((member, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={member}
                onChange={(e) => handleMemberChange(index, e.target.value)}
                placeholder={`Membre ${index + 1}`}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                aria-label={`Membre ${index + 1}`}
              />
              {formData.members.length > MIN_MEMBERS && (
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="px-3 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-smooth focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2"
                  aria-label={`Supprimer le membre ${index + 1}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.members && (
          <p className="mt-1 text-sm text-danger" role="alert">
            {errors.members}
          </p>
        )}
        {formData.members.length < MAX_MEMBERS && (
          <button
            type="button"
            onClick={addMember}
            className="mt-2 flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/10 transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un membre</span>
          </button>
        )}
      </div>

      {/* Score */}
      <div>
        <label htmlFor="team-score" className="block text-sm font-medium mb-2">
          Score initial
        </label>
        <input
          id="team-score"
          type="number"
          min="0"
          value={formData.score}
          onChange={(e) => {
            setFormData({ ...formData, score: e.target.value });
            if (errors.score) setErrors({ ...errors, score: null });
          }}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.score ? 'border-danger' : 'border-slate-300'
            }`}
          aria-invalid={errors.score ? 'true' : 'false'}
          aria-describedby={errors.score ? 'score-error' : undefined}
        />
        {errors.score && (
          <p id="score-error" className="mt-1 text-sm text-danger" role="alert">
            {errors.score}
          </p>
        )}
      </div>

      {/* Logo Upload (optional) */}
      <div>
        <label htmlFor="team-logo" className="block text-sm font-medium mb-2">
          Logo (optionnel)
        </label>
        <div className="flex items-center gap-4">
          <input
            id="team-logo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Télécharger un logo"
          />
          <label
            htmlFor="team-logo"
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Upload className="w-4 h-4" />
            <span>{formData.logo ? formData.logo.name : 'Choisir un fichier'}</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 sm:px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-smooth focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 tap-target order-2 xs:order-1"
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 sm:px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed tap-target order-1 xs:order-2"
          disabled={loading}
        >
          {loading ? 'Enregistrement...' : team ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
};

export default TeamForm;

