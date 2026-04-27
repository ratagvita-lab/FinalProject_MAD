import React, { createContext, useState, useContext } from 'react';
import { KosType } from '../components/KosCard';
import { mockKosList } from '../constants/mockData';

interface KostDataContextType {
  kostList: KosType[];
  updateKost: (id: string, updates: Partial<KosType>) => void;
  getKostById: (id: string) => KosType | undefined;
}

const KostDataContext = createContext<KostDataContextType | undefined>(undefined);

export function KostDataProvider({ children }: { children: React.ReactNode }) {
  const [kostList, setKostList] = useState<KosType[]>(mockKosList);

  const updateKost = (id: string, updates: Partial<KosType>) => {
    setKostList(prev =>
      prev.map(kos => (kos.id === id ? { ...kos, ...updates } : kos))
    );
  };

  const getKostById = (id: string) => {
    return kostList.find(kos => kos.id === id);
  };

  return (
    <KostDataContext.Provider value={{ kostList, updateKost, getKostById }}>
      {children}
    </KostDataContext.Provider>
  );
}

export function useKostData() {
  const context = useContext(KostDataContext);
  if (context === undefined) {
    throw new Error('useKostData must be used within a KostDataProvider');
  }
  return context;
}
