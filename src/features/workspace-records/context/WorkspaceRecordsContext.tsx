import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type {
  BudgetItem,
  DocumentItem,
  InsuranceItem,
  WorkspaceRecord,
  SubscriptionItem,
  VaultItem,
} from "../types";

interface WorkspaceRecordsStorageState {
  budgetEnvelopes: BudgetItem[];
  documents: DocumentItem[];
  insurancePolicies: InsuranceItem[];
  subscriptions: SubscriptionItem[];
  vaultItems: VaultItem[];
  moduleRecords: Record<string, WorkspaceRecord[]>;
}

const STORAGE_KEY = "wira_peh_state_v1";

const DEFAULT_STATE: WorkspaceRecordsStorageState = {
  budgetEnvelopes: [],
  documents: [],
  insurancePolicies: [],
  subscriptions: [],
  vaultItems: [],
  moduleRecords: {},
};

function readInitialState(): WorkspaceRecordsStorageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<WorkspaceRecordsStorageState>;
      return {
        budgetEnvelopes: Array.isArray(parsed.budgetEnvelopes) ? parsed.budgetEnvelopes : [],
        documents: Array.isArray(parsed.documents) ? parsed.documents : [],
        insurancePolicies: Array.isArray(parsed.insurancePolicies) ? parsed.insurancePolicies : [],
        subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : [],
        vaultItems: Array.isArray(parsed.vaultItems) ? parsed.vaultItems : [],
        moduleRecords:
          parsed.moduleRecords && typeof parsed.moduleRecords === "object"
            ? parsed.moduleRecords
            : {},
      };
    }
  } catch {
    // ignore storage read error
  }
  return DEFAULT_STATE;
}

export interface WorkspaceRecordsContextValue extends WorkspaceRecordsStorageState {
  activeSubMenu: string;
  setActiveSubMenu: (subMenu: string) => void;
  addBudgetEnvelope: (item: Omit<BudgetItem, "id">) => void;
  updateBudgetSpent: (id: string, spentAmount: number) => void;
  deleteBudgetEnvelope: (id: string) => void;
  addDocument: (item: Omit<DocumentItem, "id">) => void;
  deleteDocument: (id: string) => void;
  addInsurancePolicy: (item: Omit<InsuranceItem, "id">) => void;
  deleteInsurancePolicy: (id: string) => void;
  addSubscription: (item: Omit<SubscriptionItem, "id">) => void;
  deleteSubscription: (id: string) => void;
  addVaultItem: (item: Omit<VaultItem, "id">) => void;
  deleteVaultItem: (id: string) => void;
  getModuleRecords: (moduleKey: string, seed?: WorkspaceRecord[]) => WorkspaceRecord[];
  addModuleRecord: (moduleKey: string, record: Omit<WorkspaceRecord, "id">) => void;
  updateModuleRecordStatus: (
    moduleKey: string,
    id: string,
    status: WorkspaceRecord["status"],
  ) => void;
  deleteModuleRecord: (moduleKey: string, id: string) => void;
}

export const WorkspaceRecordsContext = createContext<WorkspaceRecordsContextValue | null>(null);

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function WorkspaceRecordsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkspaceRecordsStorageState>(readInitialState);
  const [activeSubMenu, setActiveSubMenu] = useState<string>("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage write error
    }
  }, [state]);

  const addBudgetEnvelope = useCallback((item: Omit<BudgetItem, "id">) => {
    setState((prev) => ({
      ...prev,
      budgetEnvelopes: [{ ...item, id: makeId("bgt") }, ...prev.budgetEnvelopes],
    }));
  }, []);

  const updateBudgetSpent = useCallback((id: string, spentAmount: number) => {
    setState((prev) => ({
      ...prev,
      budgetEnvelopes: prev.budgetEnvelopes.map((b) =>
        b.id === id ? { ...b, spentAmount } : b,
      ),
    }));
  }, []);

  const deleteBudgetEnvelope = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      budgetEnvelopes: prev.budgetEnvelopes.filter((b) => b.id !== id),
    }));
  }, []);

  const addDocument = useCallback((item: Omit<DocumentItem, "id">) => {
    setState((prev) => ({
      ...prev,
      documents: [{ ...item, id: makeId("doc") }, ...prev.documents],
    }));
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== id),
    }));
  }, []);

  const addInsurancePolicy = useCallback((item: Omit<InsuranceItem, "id">) => {
    setState((prev) => ({
      ...prev,
      insurancePolicies: [{ ...item, id: makeId("ins") }, ...prev.insurancePolicies],
    }));
  }, []);

  const deleteInsurancePolicy = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      insurancePolicies: prev.insurancePolicies.filter((p) => p.id !== id),
    }));
  }, []);

  const addSubscription = useCallback((item: Omit<SubscriptionItem, "id">) => {
    setState((prev) => ({
      ...prev,
      subscriptions: [{ ...item, id: makeId("sub") }, ...prev.subscriptions],
    }));
  }, []);

  const deleteSubscription = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.filter((s) => s.id !== id),
    }));
  }, []);

  const addVaultItem = useCallback((item: Omit<VaultItem, "id">) => {
    setState((prev) => ({
      ...prev,
      vaultItems: [{ ...item, id: makeId("vlt") }, ...prev.vaultItems],
    }));
  }, []);

  const deleteVaultItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      vaultItems: prev.vaultItems.filter((v) => v.id !== id),
    }));
  }, []);

  const getModuleRecords = useCallback(
    (moduleKey: string, seed: WorkspaceRecord[] = []): WorkspaceRecord[] => {
      const existing = state.moduleRecords[moduleKey];
      return existing ?? seed;
    },
    [state.moduleRecords],
  );

  const addModuleRecord = useCallback(
    (moduleKey: string, record: Omit<WorkspaceRecord, "id">) => {
      setState((prev) => {
        const list = prev.moduleRecords[moduleKey] || [];
        return {
          ...prev,
          moduleRecords: {
            ...prev.moduleRecords,
            [moduleKey]: [{ ...record, id: makeId(moduleKey) }, ...list],
          },
        };
      });
    },
    [],
  );

  const updateModuleRecordStatus = useCallback(
    (moduleKey: string, id: string, status: WorkspaceRecord["status"]) => {
      setState((prev) => {
        const list = prev.moduleRecords[moduleKey] || [];
        return {
          ...prev,
          moduleRecords: {
            ...prev.moduleRecords,
            [moduleKey]: list.map((r) => (r.id === id ? { ...r, status } : r)),
          },
        };
      });
    },
    [],
  );

  const deleteModuleRecord = useCallback((moduleKey: string, id: string) => {
    setState((prev) => {
      const list = prev.moduleRecords[moduleKey] || [];
      return {
        ...prev,
        moduleRecords: {
          ...prev.moduleRecords,
          [moduleKey]: list.filter((r) => r.id !== id),
        },
      };
    });
  }, []);

  return (
    <WorkspaceRecordsContext.Provider
      value={{
        ...state,
        activeSubMenu,
        setActiveSubMenu,
        addBudgetEnvelope,
        updateBudgetSpent,
        deleteBudgetEnvelope,
        addDocument,
        deleteDocument,
        addInsurancePolicy,
        deleteInsurancePolicy,
        addSubscription,
        deleteSubscription,
        addVaultItem,
        deleteVaultItem,
        getModuleRecords,
        addModuleRecord,
        updateModuleRecordStatus,
        deleteModuleRecord,
      }}
    >
      {children}
    </WorkspaceRecordsContext.Provider>
  );
}

export function useWorkspaceRecords(): WorkspaceRecordsContextValue {
  const ctx = useContext(WorkspaceRecordsContext);
  if (!ctx) {
    throw new Error("useWorkspaceRecords must be used inside WorkspaceRecordsProvider");
  }
  return ctx;
}
