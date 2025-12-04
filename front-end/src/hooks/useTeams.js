import { useState, useEffect, useCallback, useRef } from 'react';
import { teamService } from '../services/api';
import { calculateTrend } from '../utils/helpers';

/**
 * Custom hook for managing teams data
 */
export const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const previousRanksRef = useRef({});

  // Fetch all teams
  const fetchTeams = useCallback(async () => {
    try {
      setError(null);
      const response = await teamService.getAllTeams();
      const data = response.data?.data || response.data || [];
      setTeams(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement des équipes';
      setError(errorMessage);
      console.error('Error fetching teams:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      setError(null);
      const response = await teamService.getLeaderboard();
      const data = response.data?.data || response.data || [];
      
      // Calculate trends using ref to avoid dependency issues
      const previousRanks = previousRanksRef.current;
      const leaderboardWithTrends = data.map((team, index) => {
        const rank = index + 1;
        const previousRank = previousRanks[team.id] || rank;
        const trend = calculateTrend(rank, previousRank);
        
        return {
          ...team,
          rank,
          previous_rank: previousRank,
          trend,
        };
      });

      // Update previous ranks in ref
      const newPreviousRanks = {};
      leaderboardWithTrends.forEach(team => {
        newPreviousRanks[team.id] = team.rank;
      });
      previousRanksRef.current = newPreviousRanks;

      setLeaderboard(leaderboardWithTrends);
      return leaderboardWithTrends;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement du classement';
      setError(errorMessage);
      console.error('Error fetching leaderboard:', err);
      return [];
    }
  }, []);

  // Create team
  const createTeam = useCallback(async (teamData) => {
    try {
      setError(null);
      const response = await teamService.createTeam(teamData);
      const newTeam = response.data?.data || response.data;
      await fetchTeams();
      await fetchLeaderboard();
      return { success: true, data: newTeam };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la création de l\'équipe';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchTeams, fetchLeaderboard]);

  // Update team
  const updateTeam = useCallback(async (id, teamData) => {
    try {
      setError(null);
      const response = await teamService.updateTeam(id, teamData);
      const updatedTeam = response.data?.data || response.data;
      await fetchTeams();
      await fetchLeaderboard();
      return { success: true, data: updatedTeam };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la mise à jour de l\'équipe';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchTeams, fetchLeaderboard]);

  // Patch team (partial update)
  const patchTeam = useCallback(async (id, teamData) => {
    try {
      setError(null);
      const response = await teamService.patchTeam(id, teamData);
      const updatedTeam = response.data?.data || response.data;
      await fetchTeams();
      await fetchLeaderboard();
      return { success: true, data: updatedTeam };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la mise à jour de l\'équipe';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchTeams, fetchLeaderboard]);

  // Delete team
  const deleteTeam = useCallback(async (id) => {
    try {
      setError(null);
      await teamService.deleteTeam(id);
      await fetchTeams();
      await fetchLeaderboard();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la suppression de l\'équipe';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchTeams, fetchLeaderboard]);

  // Initial load
  useEffect(() => {
    fetchTeams();
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    teams,
    leaderboard,
    loading,
    error,
    fetchTeams,
    fetchLeaderboard,
    createTeam,
    updateTeam,
    patchTeam,
    deleteTeam,
  };
};

