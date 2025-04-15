"use client";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

const LoadingContext = createContext<{
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleFilterChange: () => void;
}>({ isLoading: false, setIsLoading: () => {}, handleFilterChange: () => {} });

const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const handleFilterChange = () => {
    setIsLoading(true);
  };
  if (!queryClient) return null;
  return (
    <LoadingContext.Provider value={{ setIsLoading, isLoading, handleFilterChange }}>
      {children}
    </LoadingContext.Provider>
  );
};
const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export { LoadingProvider, useLoading };
