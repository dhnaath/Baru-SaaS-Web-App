import React, { useContext } from "react";
import { WorkspaceRecordsContext, WorkspaceRecordsProvider } from "./context/WorkspaceRecordsContext";

export interface WorkspaceRecordsLayoutProps {
  children: React.ReactNode;
}

/**
 * Isolated layout provider for Workspace Records.
 * Reuses existing WorkspaceRecordsContext if an ancestor already provides it;
 * otherwise mounts a scoped WorkspaceRecordsProvider that persists to localStorage.
 */
export function WorkspaceRecordsLayout({ children }: WorkspaceRecordsLayoutProps) {
  const existingContext = useContext(WorkspaceRecordsContext);
  if (existingContext) {
    return <>{children}</>;
  }
  return <WorkspaceRecordsProvider>{children}</WorkspaceRecordsProvider>;
}

export default WorkspaceRecordsLayout;
