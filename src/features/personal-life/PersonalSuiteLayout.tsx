import React, { useContext } from "react";
import { PersonalLifeContext, PersonalLifeProvider } from "./context/PersonalLifeContext";

export interface PersonalSuiteLayoutProps {
  children: React.ReactNode;
}

/**
 * Isolated layout provider for Personal Life Suite.
 * Reuses existing PersonalLifeContext if an ancestor already provides it;
 * otherwise mounts a scoped PersonalLifeProvider that persists to localStorage.
 */
export function PersonalSuiteLayout({ children }: PersonalSuiteLayoutProps) {
  const existingContext = useContext(PersonalLifeContext);
  if (existingContext) {
    return <>{children}</>;
  }
  return <PersonalLifeProvider>{children}</PersonalLifeProvider>;
}

export default PersonalSuiteLayout;
