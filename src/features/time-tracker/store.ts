import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import { filterExactSeedRecords } from "../../core/legacySeed";
import { LEGACY_TIME_SEED_FINGERPRINTS } from "./legacySeedFingerprints";
import {
  TimeEntry,
  TimeActivity,
  Timesheet,
  RateCard,
  TimeApprovalRecord,
  LinkedItem,
} from "./types";

interface TimeTrackerStore {
  entries: TimeEntry[];
  activities: TimeActivity[];
  timesheets: Timesheet[];
  rateCards: RateCard[];
  approvalRecords: TimeApprovalRecord[];

  // Active Timer
  isTimerRunning: boolean;
  timerStartTimestamp: number | null;
  timerNote: string;
  timerLinkedItem: LinkedItem | null;
  timerIsBillable: boolean;

  // Actions
  startTimer: (note: string, linkedItem?: LinkedItem, isBillable?: boolean) => void;
  stopTimer: () => void;
  logManualEntry: (data: {
    durationMinutes: number;
    note: string;
    linkedItem?: LinkedItem;
    isBillable?: boolean;
    date?: string;
  }) => void;
  importFromFocusSession: (taskTitle: string, durationMinutes: number) => void;
  updateEntry: (id: string, updates: Partial<TimeEntry>) => void;
  deleteEntry: (id: string) => void;

  createWeeklyTimesheet: (userId: string, userName: string, periodStart: string, periodEnd: string) => string;
  submitTimesheet: (timesheetId: string) => void;
  reviewTimesheet: (timesheetId: string, decision: 'approved' | 'rejected', approverName: string, comments?: string) => void;

  addRateCard: (card: Omit<RateCard, "id">) => void;
  addActivity: (activity: Omit<TimeActivity, "id">) => void;
}

const INITIAL_ACTIVITIES: TimeActivity[] = [
  { id: "act-1", name: "Administrasi & Pengarsipan", isBillableDefault: false },
  { id: "act-2", name: "Internal Team Sync", isBillableDefault: false },
  { id: "act-3", name: "Client Consulting & Advising", isBillableDefault: true },
  { id: "act-4", name: "Riset Teknologi & Arsitektur", isBillableDefault: true },
];

export const INITIAL_RATE_CARDS: RateCard[] = [];

export const INITIAL_ENTRIES: TimeEntry[] = [];

export const INITIAL_TIMESHEETS: Timesheet[] = [];

export const INITIAL_APPROVAL_RECORDS: TimeApprovalRecord[] = [];

export const useTimeTrackerStore = create<TimeTrackerStore>()(
  persist(
    (set, get) => ({
      entries: INITIAL_ENTRIES,
      activities: INITIAL_ACTIVITIES,
      timesheets: INITIAL_TIMESHEETS,
      rateCards: INITIAL_RATE_CARDS,
      approvalRecords: INITIAL_APPROVAL_RECORDS,

      isTimerRunning: false,
      timerStartTimestamp: null,
      timerNote: "",
      timerLinkedItem: null,
      timerIsBillable: true,

      startTimer: (note, linkedItem, isBillable = true) => {
        set({
          isTimerRunning: true,
          timerStartTimestamp: Date.now(),
          timerNote: note,
          timerLinkedItem: linkedItem || null,
          timerIsBillable: isBillable,
        });
      },

      stopTimer: () => {
        const { isTimerRunning, timerStartTimestamp, timerNote, timerLinkedItem, timerIsBillable } = get();
        if (!isTimerRunning || !timerStartTimestamp) return;

        const elapsedMs = Date.now() - timerStartTimestamp;
        const minutes = Math.max(1, Math.round(elapsedMs / (1000 * 60)));

        const newEntry: TimeEntry = {
          id: `te-${Date.now()}`,
          userId: "usr-01",
          userName: "Bambang Pamungkas",
          linkedItem: timerLinkedItem || undefined,
          startAt: new Date(timerStartTimestamp).toISOString(),
          endAt: new Date().toISOString(),
          durationMinutes: minutes,
          isBillable: timerIsBillable,
          note: timerNote || "Pekerjaan via Real-time Timer",
          source: "timer",
          status: "draft",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          entries: [newEntry, ...state.entries],
          isTimerRunning: false,
          timerStartTimestamp: null,
          timerNote: "",
          timerLinkedItem: null,
          timerIsBillable: true,
        }));
      },

      logManualEntry: ({ durationMinutes, note, linkedItem, isBillable = true, date }) => {
        const timestamp = date ? new Date(date).toISOString() : new Date().toISOString();
        const newEntry: TimeEntry = {
          id: `te-${Date.now()}`,
          userId: "usr-01",
          userName: "Bambang Pamungkas",
          linkedItem,
          durationMinutes,
          isBillable,
          note,
          source: "manual",
          status: "draft",
          createdAt: timestamp,
        };
        set((state) => ({ entries: [newEntry, ...state.entries] }));
      },

      importFromFocusSession: (taskTitle, durationMinutes) => {
        const newEntry: TimeEntry = {
          id: `te-${Date.now()}`,
          userId: "usr-01",
          userName: "Bambang Pamungkas",
          linkedItem: {
            sourceType: "task",
            sourceId: `task-${Date.now()}`,
            title: taskTitle,
          },
          durationMinutes,
          isBillable: true,
          note: `Sesi fokus selesai (${durationMinutes} menit, dikurangi interupsi).`,
          source: "imported_from_focus_session",
          status: "draft",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ entries: [newEntry, ...state.entries] }));
      },

      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        }));
      },

      createWeeklyTimesheet: (userId, userName, periodStart, periodEnd) => {
        const eligible = get().entries.filter((e) => {
          const entryDate = e.createdAt.split("T")[0];
          return entryDate >= periodStart && entryDate <= periodEnd;
        });

        const totalMins = eligible.reduce((acc, e) => acc + e.durationMinutes, 0);
        const newTs: Timesheet = {
          id: `ts-${Date.now()}`,
          userId,
          userName,
          periodStart,
          periodEnd,
          entryIds: eligible.map((e) => e.id),
          totalMinutes: totalMins,
          status: "draft",
        };

        set((state) => ({ timesheets: [newTs, ...state.timesheets] }));
        return newTs.id;
      },

      submitTimesheet: (timesheetId) => {
        set((state) => ({
          timesheets: state.timesheets.map((ts) =>
            ts.id === timesheetId ? { ...ts, status: "submitted" } : ts
          ),
          entries: state.entries.map((e) => {
            const ts = state.timesheets.find((t) => t.id === timesheetId);
            return ts?.entryIds.includes(e.id) ? { ...e, status: "submitted" } : e;
          }),
        }));
      },

      reviewTimesheet: (timesheetId, decision, approverName, comments) => {
        const record: TimeApprovalRecord = {
          id: `ap-${Date.now()}`,
          timesheetId,
          approverId: "mgr-cur",
          approverName,
          decision,
          comments,
          decidedAt: new Date().toISOString(),
        };

        set((state) => ({
          timesheets: state.timesheets.map((ts) =>
            ts.id === timesheetId ? { ...ts, status: decision === "approved" ? "approved" : "rejected" } : ts
          ),
          entries: state.entries.map((e) => {
            const ts = state.timesheets.find((t) => t.id === timesheetId);
            return ts?.entryIds.includes(e.id)
              ? { ...e, status: decision === "approved" ? "approved" : "rejected" }
              : e;
          }),
          approvalRecords: [record, ...state.approvalRecords],
        }));
      },

      addRateCard: (card) => {
        const newCard: RateCard = {
          ...card,
          id: `rc-${Date.now()}`,
        };
        set((state) => ({ rateCards: [...state.rateCards, newCard] }));
      },

      addActivity: (act) => {
        const newAct: TimeActivity = {
          ...act,
          id: `act-${Date.now()}`,
        };
        set((state) => ({ activities: [...state.activities, newAct] }));
      },
    }),
    {
      name: "ecosystem-time-tracker-storage",
      storage: createWorkspaceStorage(),
      version: 1,
      migrate: (persistedState: unknown) => {
        const state = (persistedState || {}) as Partial<TimeTrackerStore>;
        return {
          ...state,
          entries: filterExactSeedRecords(
            Array.isArray(state.entries) ? state.entries : [],
            LEGACY_TIME_SEED_FINGERPRINTS.entries,
          ),
          timesheets: filterExactSeedRecords(
            Array.isArray(state.timesheets) ? state.timesheets : [],
            LEGACY_TIME_SEED_FINGERPRINTS.timesheets,
          ),
          rateCards: filterExactSeedRecords(
            Array.isArray(state.rateCards) ? state.rateCards : [],
            LEGACY_TIME_SEED_FINGERPRINTS.rateCards,
          ),
          approvalRecords: filterExactSeedRecords(
            Array.isArray(state.approvalRecords) ? state.approvalRecords : [],
            LEGACY_TIME_SEED_FINGERPRINTS.approvalRecords,
          ),
        } as TimeTrackerStore;
      },
    }
  )
);
