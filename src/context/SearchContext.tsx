import { createContext, useContext, useState, ReactNode } from "react";

const SearchContext = createContext<{
  searchQuery: string;
  setSearchQuery: (val: string) => void;
} | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch debe usarse dentro de SearchProvider");
  return context;
};