import { useSyncExternalStore, useCallback } from "react";
import {
  LayoutGrid,
  Zap,
  TrendingUp,
  Settings,
  Workflow,
  Copy,
  Database,
  BookOpen,
  Puzzle,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { SubComponentKey } from "@/core/hierarchyRegistry";

export type CardComponentFilterValue = SubComponentKey | "all";

export interface CardComponentState {
  selected: CardComponentFilterValue;
  hidden: readonly SubComponentKey[];
}

export const CARD_COMPONENT_ICONS: Record<SubComponentKey, LucideIcon> = {
  dashboards: LayoutGrid,
  features: Puzzle,
  tools: Wrench,
  workflows: Workflow,
  automations: Zap,
  analytics: TrendingUp,
  templates: Copy,
  records: Database,
  guides: BookOpen,
  settings: Settings,
};

export function makeCardFilterKey(title: string, to?: string): string {
  return `${(to || "").trim()}::${title.trim().toLowerCase()}`;
}

export function normalizeComponentKey(name?: string): SubComponentKey | null {
  if (!name) return null;
  const n = name.trim().toLowerCase();
  if (n.startsWith("dashboard")) return "dashboards";
  if (n.startsWith("feature")) return "features";
  if (n.startsWith("tool")) return "tools";
  if (n.startsWith("workflow")) return "workflows";
  if (n.startsWith("automation")) return "automations";
  if (n.startsWith("analytic")) return "analytics";
  if (n.startsWith("template")) return "templates";
  if (n.startsWith("record")) return "records";
  if (n.startsWith("guide")) return "guides";
  if (n.startsWith("setting")) return "settings";
  return null;
}

export function matchesCardComponentFilter(
  groupName: string | undefined,
  selected: CardComponentFilterValue,
): boolean {
  if (selected === "all") return true;
  const key = normalizeComponentKey(groupName);
  return key === selected;
}

export function isCardComponentHidden(
  groupName: string | undefined,
  hidden: readonly SubComponentKey[],
): boolean {
  if (hidden.length === 0) return false;
  const key = normalizeComponentKey(groupName) || "features";
  return hidden.includes(key);
}

export function isCardComponentVisible(
  groupName: string | undefined,
  selected: CardComponentFilterValue,
  hidden: readonly SubComponentKey[],
): boolean {
  if (isCardComponentHidden(groupName, hidden)) return false;
  return matchesCardComponentFilter(groupName, selected);
}

const EMPTY_HIDDEN: readonly SubComponentKey[] = Object.freeze([]);
const DEFAULT_STATE: CardComponentState = Object.freeze({
  selected: "all",
  hidden: EMPTY_HIDDEN,
});

const cardStateStore = new Map<string, CardComponentState>();
const listeners = new Map<string, Set<() => void>>();

function notify(key: string) {
  const subs = listeners.get(key);
  if (!subs) return;
  for (const fn of subs) {
    fn();
  }
}

function updateCardState(
  key: string,
  updater: (prev: CardComponentState) => CardComponentState,
) {
  const prev = cardStateStore.get(key) ?? DEFAULT_STATE;
  const next = updater(prev);
  if (next === prev) return;
  if (next.selected === "all" && next.hidden.length === 0) {
    cardStateStore.delete(key);
  } else {
    cardStateStore.set(key, next);
  }
  notify(key);
}

export function setCardComponentFilterValue(
  key: string,
  value: CardComponentFilterValue,
) {
  const nextSelected: CardComponentFilterValue = value || "all";
  updateCardState(key, (prev) => {
    if (prev.selected === nextSelected) return prev;
    return { selected: nextSelected, hidden: prev.hidden };
  });
}

export function toggleCardHiddenComponent(key: string, comp: SubComponentKey) {
  updateCardState(key, (prev) => {
    const exists = prev.hidden.includes(comp);
    const nextHidden = exists
      ? prev.hidden.filter((item) => item !== comp)
      : [...prev.hidden, comp];
    return {
      selected: prev.selected,
      hidden: nextHidden.length === 0 ? EMPTY_HIDDEN : nextHidden,
    };
  });
}

export function clearCardHiddenComponents(key: string) {
  updateCardState(key, (prev) => {
    if (prev.hidden.length === 0) return prev;
    return { selected: prev.selected, hidden: EMPTY_HIDDEN };
  });
}

export function resetCardComponentVisibility(key: string) {
  updateCardState(key, (prev) => {
    if (prev.selected === "all" && prev.hidden.length === 0) return prev;
    return DEFAULT_STATE;
  });
}

export function useCardComponentFilter(title: string, to?: string) {
  const key = makeCardFilterKey(title, to);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      let subs = listeners.get(key);
      if (!subs) {
        subs = new Set();
        listeners.set(key, subs);
      }
      subs.add(onStoreChange);
      return () => {
        subs?.delete(onStoreChange);
        if (subs && subs.size === 0) {
          listeners.delete(key);
        }
      };
    },
    [key],
  );

  const getSnapshot = useCallback((): CardComponentState => {
    return cardStateStore.get(key) ?? DEFAULT_STATE;
  }, [key]);

  const state = useSyncExternalStore<CardComponentState>(
    subscribe,
    getSnapshot,
    () => DEFAULT_STATE,
  );

  const setComponentFilter = useCallback(
    (val: CardComponentFilterValue) => {
      setCardComponentFilterValue(key, val);
    },
    [key],
  );

  const toggleComponentFilter = useCallback(
    (val: SubComponentKey) => {
      const current = (cardStateStore.get(key) ?? DEFAULT_STATE).selected;
      setCardComponentFilterValue(key, current === val ? "all" : val);
    },
    [key],
  );

  const resetComponentFilter = useCallback(() => {
    setCardComponentFilterValue(key, "all");
  }, [key]);

  const toggleHideComponent = useCallback(
    (val: SubComponentKey) => {
      toggleCardHiddenComponent(key, val);
    },
    [key],
  );

  const unhideAllComponents = useCallback(() => {
    clearCardHiddenComponents(key);
  }, [key]);

  const resetAllComponentFilters = useCallback(() => {
    resetCardComponentVisibility(key);
  }, [key]);

  const isHidden = useCallback(
    (val: SubComponentKey) => state.hidden.includes(val),
    [state.hidden],
  );

  return {
    selectedComponent: state.selected,
    hiddenComponents: state.hidden,
    setComponentFilter,
    toggleComponentFilter,
    resetComponentFilter,
    toggleHideComponent,
    unhideAllComponents,
    resetAllComponentFilters,
    isHidden,
  };
}
