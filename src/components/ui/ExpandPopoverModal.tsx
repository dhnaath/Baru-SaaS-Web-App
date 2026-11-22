import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ExpandPopoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClassName?: string;
}

/**
 * Compact floating expand popover modeled directly on MacExpandStack:
 * - Solid crisp surface (white / zinc-900), rounded-3xl, hairline border, soft shadow-2xl
 * - Anchored cleanly below the top-right floating header bar (never fills the viewport)
 * - Transparent click-outside backdrop (no dark dim or full-screen blur)
 * - Smooth top-right scale/fade entrance & Escape-to-close
 */
export function ExpandPopoverModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  widthClassName = "w-[calc(100vw-24px)] sm:w-[392px]",
}: ExpandPopoverModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div data-expand-popover-modal="true" className="contents">
          {/* Transparent click-outside overlay (no dark dim / no blur) */}
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Compact floating expand panel anchored below top-right header pills */}
          <div className="fixed top-[68px] right-3 sm:right-5 z-50 pointer-events-auto">
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              style={{ transformOrigin: "top right" }}
              className={`${widthClassName} max-h-[min(74vh,calc(100vh-156px))] rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden text-left`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={title}
            >
              {/* Compact Header Row */}
              <div className="flex items-center justify-between gap-2.5 px-3.5 py-2.5 border-b border-neutral-200/70 dark:border-zinc-800 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  {icon && (
                    <div className="size-8 rounded-full flex items-center justify-center shrink-0 bg-neutral-50 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/70 dark:border-zinc-700/60 shadow-2xs">
                      {icon}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-[13.5px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight truncate">
                      {title}
                    </h2>
                    {subtitle && (
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5 truncate">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  title="Tutup"
                  aria-label="Tutup"
                  className="size-7 rounded-full shrink-0 flex items-center justify-center text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-3.5 py-3">
                {children}
              </div>

              {/* Optional Sticky Footer */}
              {footer && (
                <div className="px-3.5 py-2.5 border-t border-neutral-200/70 dark:border-zinc-800 bg-neutral-50/60 dark:bg-zinc-900/80 shrink-0">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
