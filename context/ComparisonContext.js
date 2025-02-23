"use client";
import { createContext, useContext, useState } from 'react';

const ComparisonContext = createContext();

export function ComparisonProvider({ children }) {
  const [comparisonStrains, setComparisonStrains] = useState([]);

  const addToComparison = (strain) => {
    setComparisonStrains(prev => {
      if (prev.length >= 3) {
        return [...prev.slice(1), strain];
      }
      return [...prev, strain];
    });
  };

  const removeFromComparison = (strainId) => {
    setComparisonStrains(prev => prev.filter(strain => strain.id !== strainId));
  };

  const clearComparison = () => {
    setComparisonStrains([]);
  };

  return (
    <ComparisonContext.Provider value={{
      comparisonStrains,
      addToComparison,
      removeFromComparison,
      clearComparison
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export const useComparison = () => useContext(ComparisonContext);
