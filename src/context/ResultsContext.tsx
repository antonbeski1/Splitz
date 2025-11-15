'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ProcessedResult } from '@/app/actions';

interface ResultsContextType {
  results: ProcessedResult | null;
  setResults: (results: ProcessedResult | null) => void;
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

export function ResultsProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<ProcessedResult | null>(null);

  return (
    <ResultsContext.Provider value={{ results, setResults }}>
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  const context = useContext(ResultsContext);
  if (context === undefined) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
}
