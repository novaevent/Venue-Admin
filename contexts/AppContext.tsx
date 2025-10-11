"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type AppContextType = {
  environment: "local" | "prod";
  setEnvironment: React.Dispatch<React.SetStateAction<"local" | "prod">>;
  url: string;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const initialEnv =
    (typeof window !== "undefined" && localStorage.getItem("environment")) ||
    "prod";

  const [environment, setEnvironment] = useState<"local" | "prod">(
    initialEnv as "local" | "prod"
  );
  const [url, setUrl] = useState<string>(process.env.NEXT_PUBLIC_API_URL ?? "");

  useEffect(() => {
    localStorage.setItem("environment", environment);
    const currentEnvironment =
      localStorage.getItem("environment") ?? environment;
    if (currentEnvironment === "local")
      setUrl(process.env.NEXT_PUBLIC_API_DEV_URL ?? "");
    else setUrl(process.env.NEXT_PUBLIC_API_URL ?? "");
  }, [environment]);

  return (
    <AppContext.Provider value={{ environment, setEnvironment, url }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
