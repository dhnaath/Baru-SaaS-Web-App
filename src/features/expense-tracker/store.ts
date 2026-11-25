import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import { filterExactSeedRecords } from "../../core/legacySeed";
import { LEGACY_EXPENSE_SEED_FINGERPRINTS } from "./legacySeedFingerprints";
import { Expense, ExpenseStatus } from "./types";

interface ExpenseStore {
  expenses: Expense[];
  selectedExpenseId: string | null;

  // Actions
  addExpense: (expense: Omit<Expense, "id" | "createdAt">) => string;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setStatus: (id: string, status: ExpenseStatus) => void;
  setSelectedExpenseId: (id: string | null) => void;
}

export const INITIAL_EXPENSES: Expense[] = [];

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: INITIAL_EXPENSES,
      selectedExpenseId: null,

      addExpense: (data) => {
        const id = `exp-${Date.now()}`;
        const newExp: Expense = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ expenses: [newExp, ...state.expenses] }));
        return id;
      },

      updateExpense: (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
          selectedExpenseId:
            state.selectedExpenseId === id ? null : state.selectedExpenseId,
        }));
      },

      setStatus: (id, status) => {
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, status } : e)),
        }));
      },

      setSelectedExpenseId: (id) => set({ selectedExpenseId: id }),
    }),
    {
      name: "ecosystem-expense-tracker-storage",
      storage: createWorkspaceStorage(),
      version: 1,
      migrate: (persistedState: unknown) => {
        const state = (persistedState || {}) as Partial<ExpenseStore>;
        return {
          ...state,
          expenses: filterExactSeedRecords(
            Array.isArray(state.expenses) ? state.expenses : [],
            LEGACY_EXPENSE_SEED_FINGERPRINTS.expenses,
          ),
        } as ExpenseStore;
      },
    }
  )
);
