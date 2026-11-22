import React from "react";
import {
  Navigation,
  Menu,
  MoreVertical,
  MoreHorizontal,
} from "lucide-react";
import { WindowPositionLeftIcon } from "@/components/icons/WindowPositionIcons";
import { SidebarPillarsMenu } from "./SidebarPillarsMenu";
import { ProgressiveBlur } from "@/components/ProgressiveBlur";

export interface ShellLeftSidebarProps {
  isLeftOpen: boolean;
  isLeftSidebar75: boolean;
  closeLeftSidebar: () => void;
  toggleLeftSidebar75: () => void;
  sidebarView: "navigation" | "menu";
  setSidebarView: (view: "navigation" | "menu") => void;
  hasAppSidebar: boolean;
  pathname: string;
  setIsLeftOpen: (open: boolean) => void;
  currentMode: string;
  blurConfig: { enabled: boolean; tint: boolean };
}

export function ShellLeftSidebar({
  isLeftOpen,
  isLeftSidebar75,
  closeLeftSidebar,
  toggleLeftSidebar75,
  sidebarView,
  setSidebarView,
  hasAppSidebar,
  pathname: _pathname,
  setIsLeftOpen,
  currentMode,
  blurConfig,
}: ShellLeftSidebarProps) {
  // Mode minimize 75px hanya tersedia untuk tab Menu (tab Navigation tidak memiliki opsi minimize)
  const isCompact = isLeftSidebar75 && sidebarView === "menu";

  return (
    <aside
      id="sidenavLeft"
      className={`fixed inset-y-0 left-0 z-50 flex ${
        isCompact
          ? "w-[75px] bg-primary border-r border-white/20 shadow-xl"
          : "w-[360px] liquid-glass-sidebar-left"
      } max-w-[85vw] shrink-0 flex-col transition-all duration-300 ease-in-out ${
        isLeftOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Spacer atas: Tombol close / toggle kiri yang sejajar dengan header + 3 dots action (khusus tab Menu) */}
      <div
        className={`w-full h-[60px] sidebar-top-glass shrink-0 flex items-center px-3 ${
          isCompact
            ? "justify-center px-1 !border-b-0 !border-none !shadow-none"
            : "justify-between border-b border-white/20 dark:border-white/10"
        }`}
      >
        {!isCompact ? (
          <>
            <button
              type="button"
              className="size-9 rounded-full aspect-square text-white/90 hover:text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
              onClick={closeLeftSidebar}
              title="Sembunyikan Navigasi"
              aria-label="Tutup sidebar kiri"
            >
              <WindowPositionLeftIcon size={24} showArrow={false} />
            </button>

            {/* 3 Dots: Hanya tampil di tab Menu untuk minimize / switch ke mode ringkas 75px */}
            {sidebarView === "menu" && (
              <button
                type="button"
                onClick={toggleLeftSidebar75}
                className="size-9 rounded-full aspect-square text-white/90 hover:text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
                title="Mode Ringkas 75px (Minimize)"
                aria-label="Mode ringkas 75px"
              >
                <MoreVertical size={20} className="shrink-0" />
              </button>
            )}
          </>
        ) : (
          /* Mode Ringkas 75px: Hanya 3 Dots untuk mengembalikan ke 360px */
          <div className="w-full flex items-center justify-center">
            <button
              type="button"
              onClick={toggleLeftSidebar75}
              className="size-9 rounded-full aspect-square text-white/80 hover:text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Perluas ke Lebar Penuh (360px)"
              aria-label="Perluas ke 360px"
            >
              <MoreHorizontal size={20} className="shrink-0" />
            </button>
          </div>
        )}
      </div>

      {/* View switcher: Ribbon Tab - hanya muncul di mode full view (tidak muncul saat minimize) */}
      {!isCompact && (
        <div className="sidebar-tab-switcher-bar flex items-end w-full h-10 bg-white/10 dark:bg-white/5 shrink-0 gap-0 relative z-20">
          {/* Bilah Tab 1: Navigation */}
          <button
            type="button"
            onClick={() => setSidebarView("navigation")}
            className={`relative flex-1 h-10 flex items-center justify-center gap-2 px-2 text-xs transition-all cursor-pointer -mb-px rounded-tl-none rounded-tr-[28px] ${
              sidebarView === "navigation"
                ? "sidebar-tab-active-glass !border-b-0"
                : "sidebar-tab-inactive-glass"
            }`}
            title="Navigation"
          >
            <Navigation className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Navigation</span>
          </button>

          {/* Bilah Tab 2: Menu */}
          <button
            type="button"
            onClick={() => setSidebarView("menu")}
            className={`relative flex-1 h-10 flex items-center justify-center gap-2 px-2 text-xs transition-all cursor-pointer -mb-px rounded-tl-[28px] rounded-tr-none ${
              sidebarView === "menu"
                ? "sidebar-tab-active-glass !border-b-0"
                : "sidebar-tab-inactive-glass"
            }`}
            title="Menu"
          >
            <Menu className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Menu</span>
            {hasAppSidebar && (
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white text-primary font-bold shrink-0 shadow-2xs">
                Fitur
              </span>
            )}
          </button>
        </div>
      )}

      <div
        className={`flex-1 min-h-0 overflow-y-auto no-scrollbar px-3 ${
          isCompact ? "pt-1 pb-4 !border-t-0 !border-none !shadow-none" : "pt-5 pb-4"
        } sidebar-menu-body-glass`}
      >
        {/* Slot untuk konten sidebar milik app (target portal ShellSidebar) */}
        <div
          id="shellSidebarSlot"
          className={hasAppSidebar ? "block mb-4" : "hidden"}
        />

        {sidebarView === "navigation" ? (
          /* Tab Navigation sementara dikosongkan dan tidak memiliki mode minimize */
          <div className="flex flex-col gap-3" />
        ) : (
          <SidebarPillarsMenu
            isCompact={isCompact}
            activeMode={currentMode}
            onNavigate={() => {
              if (!isCompact && typeof window !== "undefined" && window.innerWidth < 1024) {
                setIsLeftOpen(false);
              }
            }}
          />
        )}

        {blurConfig.enabled && !isCompact && (
          <div className="sticky bottom-0 inset-x-0 -mx-3 -mb-4 h-8 pointer-events-none z-20">
            <ProgressiveBlur
              direction="bottom"
              height={32}
              blurLevels={[0.5, 1, 2, 4, 8]}
              tint={blurConfig.tint ? "linear-gradient(to bottom, transparent 0%, hsl(var(--card) / 0.8) 100%)" : false}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
