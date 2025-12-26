
import React, { createContext, useState, useContext, useEffect } from 'react';

const IdeaContext = createContext();

export const IdeaProvider = ({ children }) => {
  const [currentIdea, setCurrentIdea] = useState(() => {
    const saved = localStorage.getItem('currentIdea');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentIdea) {
      localStorage.setItem('currentIdea', JSON.stringify(currentIdea));
    } else {
      localStorage.removeItem('currentIdea');
    }
  }, [currentIdea]);

  const clearCurrentIdea = () => setCurrentIdea(null);

  return (
    <IdeaContext.Provider value={{ 
      currentIdea, 
      setCurrentIdea,
      clearCurrentIdea
    }}>
      {children}
    </IdeaContext.Provider>
  );
};

export const useIdea = () => {
  const context = useContext(IdeaContext);
  if (!context) {
    throw new Error('useIdea must be used within an IdeaProvider');
  }
  return context;
};