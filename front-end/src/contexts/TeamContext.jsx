import { createContext, useContext } from 'react';
import { useTeams } from '../hooks/useTeams';

const TeamContext = createContext(null);

export const TeamProvider = ({ children }) => {
  const teamsData = useTeams();

  return (
    <TeamContext.Provider value={teamsData}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeamContext = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeamContext must be used within a TeamProvider');
  }
  return context;
};

