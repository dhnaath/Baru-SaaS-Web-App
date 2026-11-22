import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HeaderNavPillItem } from "./shell-header";
import {
  WEALTH_STAGE_MAIN_BOXES,
  WEALTH_STAGE_PRINCIPLES_I18N,
} from "@/features/launcher/FinancialWealthSection";
import { useLanguage } from "@/features/finance/hooks/useLanguage";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: readonly HeaderNavPillItem<any>[];
  activeCategory?: string;
  mode?: "categories" | "finplan-definitions";
}

export function InfoModal({
  isOpen,
  onClose,
  categories = [],
  activeCategory = "all",
  mode = "categories",
}: InfoModalProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const lang = useLanguage();
  const isFinplanDefinitions = mode === "finplan-definitions";
  const normalizedActive = (activeCategory || "all").toLowerCase().trim();
  const isAllCategory =
    !normalizedActive ||
    normalizedActive === "all" ||
    normalizedActive === "semua" ||
    normalizedActive === "spectrum";

  const visibleStages = isAllCategory
    ? WEALTH_STAGE_MAIN_BOXES
    : (() => {
        const matched = WEALTH_STAGE_MAIN_BOXES.filter(
          (stage) =>
            stage.id.toLowerCase() === normalizedActive ||
            stage.name.toLowerCase() === normalizedActive
        );
        return matched.length > 0 ? matched : WEALTH_STAGE_MAIN_BOXES;
      })();

  const visibleCategories = isAllCategory
    ? categories
    : (() => {
        const matched = categories.filter(
          (cat) =>
            String(cat.id).toLowerCase() === normalizedActive ||
            cat.label.toLowerCase() === normalizedActive
        );
        return matched.length > 0 ? matched : categories;
      })();

  useLayoutEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const trigger = document.querySelector('[data-info-trigger="true"]') as HTMLElement | null;
      if (!trigger) {
        setPos(null);
        return;
      }
      const rect = trigger.getBoundingClientRect();
      const vw = window.innerWidth;
      const cardWidth = isFinplanDefinitions
        ? vw >= 640
          ? 480
          : Math.min(350, vw - 24)
        : vw >= 640
          ? 384
          : 320;
      const margin = vw >= 640 ? 20 : 12;
      const idealLeft = rect.left + rect.width / 2 - cardWidth / 2;
      const left = Math.max(margin, Math.min(idealLeft, vw - cardWidth - margin));
      const top = rect.bottom + 10;
      setPos({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [isOpen, isFinplanDefinitions]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          <div
            className="fixed z-50 pointer-events-auto"
            style={
              pos
                ? { top: `${pos.top}px`, left: `${pos.left}px` }
                : { top: "68px", right: "20px" }
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className={`${
                isFinplanDefinitions
                  ? "w-[min(92vw,480px)]"
                  : "w-80 sm:w-96"
              } rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 shadow-2xl p-2.5 flex flex-col overflow-hidden cursor-default text-left select-none max-h-[75vh]`}
              onClick={(e) => e.stopPropagation()}
            >
              {isFinplanDefinitions ? (
                <div className="flex flex-col gap-[17px] overflow-y-auto no-scrollbar max-h-[68vh] px-1.5 py-1">
                  {visibleStages.map((stage, idx) => {
                    const Icon = stage.icon;
                    const stageI18n =
                      WEALTH_STAGE_PRINCIPLES_I18N[stage.id]?.[lang] ||
                      WEALTH_STAGE_PRINCIPLES_I18N[stage.id]?.id || {
                        subtitle: stage.subtitle,
                        principles: stage.principles,
                      };

                    return (
                      <Fragment key={stage.id}>
                        {idx > 0 && (
                          <div className="h-px w-full bg-neutral-700 dark:bg-neutral-300 shrink-0" />
                        )}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 pb-0.5">
                            <span
                              className={`p-1.5 rounded-lg border shrink-0 ${stage.badgeBg}`}
                            >
                              <Icon className="size-3.5" />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[13px] font-bold text-neutral-900 dark:text-neutral-100 leading-tight truncate">
                                {stage.name}
                              </div>
                              <div className="text-[10.5px] text-neutral-500 dark:text-neutral-400 leading-tight truncate">
                                {stageI18n.subtitle}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            {stageI18n.principles.map((p) => (
                              <div
                                key={p.num}
                                className="flex items-start gap-2 text-[11px] leading-relaxed text-neutral-700 dark:text-neutral-300"
                              >
                                <span className="size-4.5 rounded-full bg-neutral-100 dark:bg-zinc-800 border border-neutral-200/80 dark:border-zinc-700/70 text-[10px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 text-neutral-700 dark:text-neutral-200">
                                  {p.num}
                                </span>
                                <span>{p.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar max-h-[60vh] px-0.5 py-0.5">
                  {visibleCategories.length === 0 ? (
                    <div className="min-h-[160px] rounded-2xl bg-neutral-50/80 dark:bg-zinc-800/50 border border-neutral-200/70 dark:border-zinc-700/60 flex items-center justify-center">
                      <span className="text-xs text-neutral-400">Tidak ada kategori</span>
                    </div>
                  ) : (
                    visibleCategories.map((cat) => (
                      <button
                        key={String(cat.id)}
                        type="button"
                        disabled
                        aria-disabled="true"
                        className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-2xl text-left select-none cursor-not-allowed border bg-neutral-50 dark:bg-zinc-800 text-neutral-700 dark:text-neutral-200 shadow-xs border-neutral-200/70 dark:border-zinc-700/60 opacity-85"
                      >
                        <span className="text-[13px] font-medium tracking-tight truncate leading-tight text-neutral-800 dark:text-neutral-100">
                          {cat.label}
                        </span>
                        {cat.count !== undefined && (
                          <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-zinc-700 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-zinc-600/60 shrink-0 shadow-2xs">
                            {cat.count}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
