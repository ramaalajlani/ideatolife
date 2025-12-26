// src/context/useIdea.js
import { useContext } from 'react';
import IdeaContext from './IdeaContext';

export const useIdea = () => {
  const context = useContext(IdeaContext);
  if (context === undefined) {
    throw new Error('useIdea must be used within an IdeaProvider');
  }
  return context;
};