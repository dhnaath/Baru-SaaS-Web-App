import React, { useState, useMemo, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Search,
  X,
  CheckCircle2,
  ArrowUpDown,
  type LucideIcon,
} from "lucide-react";
import { getRaw } from "@/core/rawStorage";
import { getLastLauncherPage } from "@/utils/launcherCategoryMapper";
import {
  WORKSPACE_PAGES,
  getModuleCategory,
  findWorkspaceForRoute,
  type WorkspacePageDef,
  type WorkspaceModuleItem,
  type WorkspaceFeatureItem,
} from "@/config/workspacePages";
import {
  getUnifiedWorkspaceById,
  SUB_COMPONENT_TABS,
  SUB_COMPONENT_TAB_MAP,
} from "@/core/unifiedTaxonomy";
import {
  getHierarchyPage,
  getHierarchyModule,
  type SubComponentKey,
} from "@/core/hierarchyRegistry";
import { getComponentCategoryIcon } from "@/components/common/MBACard";
import { useLanguage } from "@/features/finance/hooks/useLanguage";

export {
  WORKSPACE_PAGES,
  getModuleCategory,
  type WorkspacePageDef,
  type WorkspaceModuleItem,
  type WorkspaceFeatureItem,
};

interface SidebarPillarsMenuProps {
  isCompact?: boolean;
  onNavigate?: () => void;
  activeMode?: string;
}

const WORKSPACE_THEMES: Record<
  string,
  { bg: string; text: string; border: string; glow: string; badge: string }
> = {
  financial: {
    bg: "bg-emerald-500/15 dark:bg-emerald-500/25",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    glow: "hover:border-emerald-500/50",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  mode_business: {
    bg: "bg-amber-500/15 dark:bg-amber-500/25",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
    glow: "hover:border-amber-500/50",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  mode_employment: {
    bg: "bg-blue-500/15 dark:bg-blue-500/25",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    glow: "hover:border-blue-500/50",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  mode_creative: {
    bg: "bg-pink-500/15 dark:bg-pink-500/25",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-500/30",
    glow: "hover:border-pink-500/50",
    badge: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  },
  mode_research: {
    bg: "bg-indigo-500/15 dark:bg-indigo-500/25",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500/30",
    glow: "hover:border-indigo-500/50",
    badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  mode_sharia: {
    bg: "bg-teal-500/15 dark:bg-teal-500/25",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-500/30",
    glow: "hover:border-teal-500/50",
    badge: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  },
  mode_personal: {
    bg: "bg-rose-500/15 dark:bg-rose-500/25",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/30",
    glow: "hover:border-rose-500/50",
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  mode_family: {
    bg: "bg-sky-500/15 dark:bg-sky-500/25",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-500/30",
    glow: "hover:border-sky-500/50",
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  },
  mode_public_affairs: {
    bg: "bg-purple-500/15 dark:bg-purple-500/25",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/30",
    glow: "hover:border-purple-500/50",
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  mode_networks: {
    bg: "bg-violet-500/15 dark:bg-violet-500/25",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-500/30",
    glow: "hover:border-violet-500/50",
    badge: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  },
  mode_phase_side: {
    bg: "bg-indigo-500/15 dark:bg-indigo-500/25",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500/30",
    glow: "hover:border-indigo-500/50",
    badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
};

function getActiveLauncherWorkspaceId(): string {
  try {
    const rawMode = getRaw("aio_active_mode") || getRaw("client_os_active_mode");
    if (rawMode) {
      const match = WORKSPACE_PAGES.find(
        (w) => w.id === rawMode || w.modeId === rawMode
      );
      if (match) return match.id;
    }
    const lastPageIdx = getLastLauncherPage(WORKSPACE_PAGES.length);
    if (WORKSPACE_PAGES[lastPageIdx]) {
      return WORKSPACE_PAGES[lastPageIdx].id;
    }
  } catch {}
  return "financial";
}

export function SidebarPillarsMenu({
  isCompact = false,
  onNavigate,
  activeMode,
}: SidebarPillarsMenuProps) {
  const location = useRouterState({ select: (s) => s.location });
  const pathname = location.pathname;

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    if (activeMode) {
      const match = WORKSPACE_PAGES.find(
        (w) => w.id === activeMode || w.modeId === activeMode
      );
      if (match) return match.id;
    }
    if (pathname && pathname.startsWith("/w/")) {
      const hp = getHierarchyPage(pathname.slice(3).split("/")[0]);
      if (hp) return hp.id;
    } else if (pathname && pathname !== "/") {
      const firstSeg = pathname.replace(/^\/+/, "").split("/")[0];
      const hp = getHierarchyPage(firstSeg);
      if (hp) return hp.id;
    }
    const fromRoute = findWorkspaceForRoute(pathname);
    if (fromRoute) return fromRoute.id;
    return getActiveLauncherWorkspaceId();
  });

  // Sinkronisasi otomatis dengan route saat ini
  useEffect(() => {
    if (pathname && pathname !== "/") {
      if (pathname.startsWith("/w/")) {
        const hp = getHierarchyPage(pathname.slice(3).split("/")[0]);
        if (hp) {
          setActiveWorkspaceId(hp.id);
          return;
        }
      } else {
        const firstSeg = pathname.replace(/^\/+/, "").split("/")[0];
        const hp = getHierarchyPage(firstSeg);
        if (hp) {
          setActiveWorkspaceId(hp.id);
          return;
        }
      }
      const fromRoute = findWorkspaceForRoute(pathname);
      if (fromRoute) {
        setActiveWorkspaceId(fromRoute.id);
        return;
      }
    }
    setActiveWorkspaceId(getActiveLauncherWorkspaceId());
  }, [pathname]);

  // Sinkronisasi saat prop activeMode dari app-shell berubah
  useEffect(() => {
    if (activeMode) {
      const match = WORKSPACE_PAGES.find(
        (w) => w.id === activeMode || w.modeId === activeMode
      );
      if (match) {
        setActiveWorkspaceId(match.id);
      }
    }
  }, [activeMode]);

  // Sinkronisasi saat user menggeser/memilih tab pada launcher
  useEffect(() => {
    const handleLauncherPageChange = (e: any) => {
      const targetId = e.detail?.id || e.detail;
      if (typeof targetId === "string") {
        const found = WORKSPACE_PAGES.find(
          (w) => w.id === targetId || w.modeId === targetId
        );
        if (found) {
          setActiveWorkspaceId(found.id);
        }
      }
    };

    const handleModeChanged = () => {
      if (pathname === "/") {
        setActiveWorkspaceId(getActiveLauncherWorkspaceId());
      }
    };

    window.addEventListener("aio_launcher_page_changed", handleLauncherPageChange);
    window.addEventListener("aio_launcher_mode_changed", handleLauncherPageChange);
    window.addEventListener("aio_active_workspace_changed", handleLauncherPageChange);
    window.addEventListener("aio_mode_changed", handleModeChanged);

    return () => {
      window.removeEventListener("aio_launcher_page_changed", handleLauncherPageChange);
      window.removeEventListener("aio_launcher_mode_changed", handleLauncherPageChange);
      window.removeEventListener("aio_active_workspace_changed", handleLauncherPageChange);
      window.removeEventListener("aio_mode_changed", handleModeChanged);
    };
  }, [pathname]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedComponent, setSelectedComponent] = useState<SubComponentKey | "all">("all");
  const [isSemuaHovered, setIsSemuaHovered] = useState(false);
  const [isSortHovered, setIsSortHovered] = useState(false);
  const semuaHoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sortHoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const semuaBtnRef = useRef<HTMLButtonElement | null>(null);
  const sortBtnRef = useRef<HTMLButtonElement | null>(null);
  const overlayAreaRef = useRef<HTMLDivElement | null>(null);
  const [semuaAlign, setSemuaAlign] = useState<{
    centerX: number;
    btnWidth: number;
    maxWidth: number;
  } | null>(null);
  const [sortAlign, setSortAlign] = useState<{
    rightOffset: number;
    btnWidth: number;
    maxWidth: number;
  } | null>(null);

  const measureSemuaAlign = useCallback(() => {
    const btnEl = semuaBtnRef.current;
    const areaEl = overlayAreaRef.current;
    if (!btnEl || !areaEl) return;
    const btnRect = btnEl.getBoundingClientRect();
    const areaRect = areaEl.getBoundingClientRect();
    if (areaRect.width <= 0) return;
    const centerX = btnRect.left + btnRect.width / 2 - areaRect.left;
    const distToNearestEdge = Math.max(60, Math.min(centerX + 8, areaRect.width - centerX + 8));
    const maxWidth = Math.min(areaRect.width, Math.floor(distToNearestEdge * 2));
    setSemuaAlign({
      centerX,
      btnWidth: Math.min(btnRect.width, maxWidth),
      maxWidth,
    });
  }, []);

  const measureSortAlign = useCallback(() => {
    const btnEl = sortBtnRef.current;
    const areaEl = overlayAreaRef.current;
    if (!btnEl || !areaEl) return;
    const btnRect = btnEl.getBoundingClientRect();
    const areaRect = areaEl.getBoundingClientRect();
    if (areaRect.width <= 0) return;
    const rightOffset = Math.max(0, areaRect.right - btnRect.right);
    const maxWidth = Math.max(120, Math.floor(areaRect.width - rightOffset));
    setSortAlign({
      rightOffset,
      btnWidth: Math.min(btnRect.width, maxWidth),
      maxWidth,
    });
  }, []);

  const openSemuaHover = () => {
    if (semuaHoverTimerRef.current) {
      clearTimeout(semuaHoverTimerRef.current);
      semuaHoverTimerRef.current = null;
    }
    if (sortHoverTimerRef.current) {
      clearTimeout(sortHoverTimerRef.current);
      sortHoverTimerRef.current = null;
    }
    setIsSortHovered(false);
    measureSemuaAlign();
    setIsSemuaHovered(true);
  };

  const closeSemuaHover = () => {
    if (semuaHoverTimerRef.current) {
      clearTimeout(semuaHoverTimerRef.current);
    }
    semuaHoverTimerRef.current = setTimeout(() => {
      setIsSemuaHovered(false);
    }, 120);
  };

  const openSortHover = () => {
    if (sortHoverTimerRef.current) {
      clearTimeout(sortHoverTimerRef.current);
      sortHoverTimerRef.current = null;
    }
    if (semuaHoverTimerRef.current) {
      clearTimeout(semuaHoverTimerRef.current);
      semuaHoverTimerRef.current = null;
    }
    setIsSemuaHovered(false);
    measureSortAlign();
    setIsSortHovered(true);
  };

  const closeSortHover = () => {
    if (sortHoverTimerRef.current) {
      clearTimeout(sortHoverTimerRef.current);
    }
    sortHoverTimerRef.current = setTimeout(() => {
      setIsSortHovered(false);
    }, 120);
  };

  useLayoutEffect(() => {
    if (!isSemuaHovered) return;
    measureSemuaAlign();
    window.addEventListener("resize", measureSemuaAlign);
    return () => window.removeEventListener("resize", measureSemuaAlign);
  }, [isSemuaHovered, selectedCategory, activeWorkspaceId, measureSemuaAlign]);

  useLayoutEffect(() => {
    if (!isSortHovered) return;
    measureSortAlign();
    window.addEventListener("resize", measureSortAlign);
    return () => window.removeEventListener("resize", measureSortAlign);
  }, [isSortHovered, selectedComponent, activeWorkspaceId, measureSortAlign]);

  useEffect(() => {
    return () => {
      if (semuaHoverTimerRef.current) {
        clearTimeout(semuaHoverTimerRef.current);
      }
      if (sortHoverTimerRef.current) {
        clearTimeout(sortHoverTimerRef.current);
      }
    };
  }, []);

  // Reset kategori & filter komponen terpilih jika workspace/laman berganti
  useEffect(() => {
    setSelectedCategory("all");
    setSelectedComponent("all");
    setIsSemuaHovered(false);
    setIsSortHovered(false);
  }, [activeWorkspaceId]);

  // Sinkronisasi dengan Kategori Bar Kanan Atas (HeaderNavPills di Header Utama)
  useEffect(() => {
    const handleHeaderCategoryChanged = (e: any) => {
      const catId = e.detail;
      if (typeof catId === "string") {
        setSelectedCategory(catId.toLowerCase());
      }
    };

    window.addEventListener("aio_header_category_changed", handleHeaderCategoryChanged);
    return () => {
      window.removeEventListener("aio_header_category_changed", handleHeaderCategoryChanged);
    };
  }, []);

  const lang = useLanguage();
  const allLabel = lang === "en" ? "All" : lang === "zh" ? "全部" : "Semua";
  const isAllSelected =
    !selectedCategory ||
    selectedCategory === "all" ||
    selectedCategory === "semua";

  const cleanCategoryKey = (s: string) =>
    s.toLowerCase().replace(/[-_\s]+/g, "");

  const isCategorySelected = (catName: string) => {
    if (isAllSelected) return false;
    const sel = cleanCategoryKey(selectedCategory);
    const c = cleanCategoryKey(catName);
    return c === sel || c.includes(sel) || sel.includes(c);
  };

  const handleSelectAllCategories = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("aio_select_header_category", { detail: "all" })
      );
      window.dispatchEvent(
        new CustomEvent("aio_header_category_changed", { detail: "all" })
      );
    }
  };

  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName.toLowerCase());
    setSearchQuery("");
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("aio_select_header_category", { detail: catName })
      );
      window.dispatchEvent(
        new CustomEvent("aio_header_category_changed", { detail: catName })
      );
    }
  };

  const activeWorkspace = useMemo(() => {
    return (
      WORKSPACE_PAGES.find((ws) => ws.id === activeWorkspaceId) ||
      WORKSPACE_PAGES[0]
    );
  }, [activeWorkspaceId]);

  const activeUnifiedWorkspace = useMemo(
    () => getUnifiedWorkspaceById(activeWorkspace.id),
    [activeWorkspace.id],
  );

  // Kelompokkan modul di dalam workspace aktif sesuai kategori
  const categoriesData = useMemo(() => {
    const map: Record<string, WorkspaceModuleItem[]> = {};
    for (const mod of activeWorkspace.modules) {
      const cat = getModuleCategory(mod, activeWorkspace.id);
      if (!map[cat]) map[cat] = [];
      map[cat].push(mod);
    }

    const list = Object.entries(map).map(([name, mods]) => ({
      name,
      count: mods.length,
      modules: mods,
    }));

    return {
      allCount: activeWorkspace.modules.length,
      categoryList: list,
      categoryMap: map,
    };
  }, [activeWorkspace]);

  const activeCategoryItem = !isAllSelected
    ? categoriesData.categoryList.find((cat) => isCategorySelected(cat.name))
    : undefined;
  const activeFilterLabel = activeCategoryItem ? activeCategoryItem.name : allLabel;
  const activeFilterCount = activeCategoryItem
    ? activeCategoryItem.count
    : categoriesData.allCount;

  const activeComponentMeta =
    selectedComponent !== "all" ? SUB_COMPONENT_TAB_MAP[selectedComponent] : undefined;
  const ActiveSortIcon = activeComponentMeta
    ? getComponentCategoryIcon(activeComponentMeta.label) || activeComponentMeta.icon
    : ArrowUpDown;

  const componentCounts = useMemo(() => {
    const counts: Record<SubComponentKey, number> = {
      dashboards: 0,
      features: 0,
      tools: 0,
      workflows: 0,
      automations: 0,
      analytics: 0,
      templates: 0,
      records: 0,
      guides: 0,
      settings: 0,
    };
    let total = 0;
    for (const cat of categoriesData.categoryList) {
      if (!isAllSelected && !isCategorySelected(cat.name)) continue;
      for (const mod of cat.modules) {
        if (!mod.features) continue;
        for (const feat of mod.features) {
          const key = (feat.componentCategory || "Features").toLowerCase() as SubComponentKey;
          if (key in counts) {
            counts[key] += 1;
            total += 1;
          }
        }
      }
    }
    return { counts, total };
  }, [categoriesData, selectedCategory, isAllSelected]);

  const [searchQuery, setSearchQuery] = useState("");
  const [openModuleFeatures, setOpenModuleFeatures] = useState<Record<string, boolean>>({});

  const handleSelectComponent = (compKey: SubComponentKey | "all") => {
    setSelectedComponent((prev) => (prev === compKey ? "all" : compKey));
    setOpenModuleFeatures({});
    setIsSortHovered(false);
  };

  const toggleModuleFeatures = (modId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenModuleFeatures((prev) => {
      const currentlyOpen =
        selectedComponent !== "all" ? prev[modId] !== false : !!prev[modId];
      return {
        ...prev,
        [modId]: !currentlyOpen,
      };
    });
  };

  const [hoveredCompactMod, setHoveredCompactMod] = useState<{
    mod: WorkspaceModuleItem;
    catName: string;
    top: number;
    left: number;
  } | null>(null);
  const compactHoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openCompactHover = useCallback(
    (mod: WorkspaceModuleItem, catName: string, el: HTMLElement) => {
      if (compactHoverTimerRef.current) {
        clearTimeout(compactHoverTimerRef.current);
        compactHoverTimerRef.current = null;
      }
      const rect = el.getBoundingClientRect();
      const left = Math.max(82, rect.right + 12);
      const itemCount = Math.max(1, (mod.features || []).length);
      const estimatedHeight = Math.min(460, itemCount * 42 + 20);
      const maxTop = Math.max(12, window.innerHeight - estimatedHeight - 12);
      const top = Math.max(12, Math.min(rect.top - 5, maxTop));
      setHoveredCompactMod({ mod, catName, top, left });
    },
    []
  );

  const keepCompactHoverOpen = useCallback(() => {
    if (compactHoverTimerRef.current) {
      clearTimeout(compactHoverTimerRef.current);
      compactHoverTimerRef.current = null;
    }
  }, []);

  const closeCompactHover = useCallback(() => {
    if (compactHoverTimerRef.current) {
      clearTimeout(compactHoverTimerRef.current);
    }
    compactHoverTimerRef.current = setTimeout(() => {
      setHoveredCompactMod(null);
    }, 140);
  }, []);

  useEffect(() => {
    if (!isCompact) {
      setHoveredCompactMod(null);
    }
  }, [isCompact, activeWorkspaceId]);

  useEffect(() => {
    return () => {
      if (compactHoverTimerRef.current) {
        clearTimeout(compactHoverTimerRef.current);
      }
    };
  }, []);

  const q = searchQuery.toLowerCase().trim();

  // Mode ringkas 75px: tampilkan semua modul pada halaman yang sedang dibuka saat ini
  // + efek hover bergaya Sortir fullview (tombol dummy sementara dengan gaya isi fitur sidebar)
  if (isCompact) {
    const hPage = getHierarchyPage(activeWorkspace.id);
    const compactModules = categoriesData.categoryList.flatMap((cat) =>
      cat.modules.map((mod) => ({ mod, catName: cat.name }))
    );

    const renderCompactHoverMenu = () => {
      if (typeof document === "undefined") return null;

      return createPortal(
        <AnimatePresence>
          {hoveredCompactMod && (() => {
            const { mod, catName, top, left } = hoveredCompactMod;
            const ModIcon = mod.icon || CheckCircle2;
            const hMod = hPage
              ? getHierarchyModule(hPage.slug, catName, mod.id)
              : undefined;

            const featureItems: WorkspaceFeatureItem[] =
              mod.features && mod.features.length > 0
                ? mod.features
                : [
                    {
                      title: mod.title,
                      to: mod.to,
                      icon: ModIcon,
                      desc: mod.desc,
                      componentCategory:
                        (SUB_COMPONENT_TAB_MAP[hMod?.defaultComponentKey || "features"]?.label as any) ||
                        "Features",
                    },
                  ];

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, x: -6, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -6, scale: 0.97 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                onMouseEnter={keepCompactHoverOpen}
                onMouseLeave={closeCompactHover}
                style={{ top: `${top}px`, left: `${left}px` }}
                className="fixed z-[120] pointer-events-auto"
              >
                {/* Jembatan hover tak terlihat agar kursor bisa berpindah mulus dari sidebar 75px ke menu hover */}
                <div className="absolute -left-4 top-0 bottom-0 w-4" />

                <div className="rounded-[26px] bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md border border-border/60 shadow-xl p-2.5 flex flex-col items-start gap-[8px] w-fit max-w-[320px] max-h-[calc(100vh-24px)] overflow-y-auto no-scrollbar">
                  {/* Daftar Komponen Modul (Dummy sementara - gaya isi sama dengan sidebar fullview, jarak judul & label 10 jenis 80% lebih dekat) */}
                  {featureItems.map((feat, fIdx) => {
                    const compKey = (
                      feat.componentCategory || "Features"
                    ).toLowerCase() as SubComponentKey;
                    const compMeta =
                      SUB_COMPONENT_TAB_MAP[compKey] || SUB_COMPONENT_TAB_MAP.features;
                    const CompIcon =
                      getComponentCategoryIcon(compMeta.label) || compMeta.icon;

                    return (
                      <button
                        key={`${feat.title}-${fIdx}`}
                        type="button"
                        disabled
                        aria-disabled="true"
                        className="w-fit max-w-full h-[34px] px-3 rounded-[28px] border border-border bg-card/90 text-[11px] font-normal text-muted-foreground shadow-xs flex items-center gap-3.5 cursor-default select-none"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <CompIcon size={12} className="shrink-0 text-muted-foreground" />
                          <span className="truncate">{feat.title}</span>
                        </span>
                        <span className="inline-flex items-center shrink-0 px-2 py-0.5 rounded-full bg-muted/60 dark:bg-muted/40 text-[10px] font-medium text-muted-foreground">
                          <span>{compMeta.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>,
        document.body
      );
    };

    return (
      <>
        <div className="flex flex-col items-center gap-2 py-2">
          {compactModules.map(({ mod, catName }) => {
            const ModIcon = mod.icon || CheckCircle2;
            const hMod = hPage
              ? getHierarchyModule(hPage.slug, catName, mod.id)
              : undefined;
            const pathOnly = hMod
              ? `${hMod.routePath}/${
                  selectedComponent !== "all" ? selectedComponent : hMod.defaultComponentKey
                }`
              : mod.to.split("?")[0];
            const searchParams =
              !hMod && mod.to.includes("?")
                ? Object.fromEntries(new URLSearchParams(mod.to.split("?")[1]))
                : undefined;
            const isActive = hMod
              ? pathname === hMod.routePath || pathname.startsWith(`${hMod.routePath}/`)
              : pathname === pathOnly || (pathOnly !== "/" && pathname.startsWith(`${pathOnly}/`));
            const isHovered = hoveredCompactMod?.mod.id === mod.id;

            return (
              <Link
                key={mod.id}
                to={pathOnly as any}
                search={searchParams as any}
                onMouseEnter={(e) => openCompactHover(mod, catName, e.currentTarget)}
                onMouseLeave={closeCompactHover}
                onClick={() => {
                  setHoveredCompactMod(null);
                  onNavigate?.();
                }}
                className={`size-11 rounded-[18px] border flex items-center justify-center shrink-0 transition-all hover:scale-105 active:scale-95 shadow-xs ${
                  isActive
                    ? "bg-white text-primary border-white font-bold shadow-md ring-2 ring-white/40"
                    : isHovered
                      ? "bg-white/25 border-white/50 text-white scale-105 shadow-sm"
                      : "bg-white/10 hover:bg-white/20 border-white/20 text-white/90 hover:text-white"
                }`}
                aria-label={mod.title}
              >
                <ModIcon size={18} className="shrink-0" />
              </Link>
            );
          })}
        </div>
        {renderCompactHoverMenu()}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full min-h-full">
      {/* Keterangan Laman Aktif (Rata Tengah Full Sidebar, tanpa icon dan label tambahan) */}
      {!q && (
        <div className="w-full text-center px-1 py-0.5">
          <span
            className="text-xs font-normal text-foreground text-center truncate block"
            title={activeUnifiedWorkspace?.labelId || activeWorkspace.label}
          >
            {activeUnifiedWorkspace?.labelEn || activeWorkspace.label}
          </span>
        </div>
      )}

      {/* Kotak Pencarian (flex-1) + Tombol Semua (hover overlay kategori) + Tombol Sortir (34x34px) */}
      <div className="relative w-full z-30">
        <div className="flex items-center gap-1.5 w-full">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[34px] pl-9 pr-8 text-xs rounded-[28px] bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer rounded-full hover:bg-muted transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <button
            ref={semuaBtnRef}
            type="button"
            onClick={() => {
              handleSelectAllCategories();
              setIsSemuaHovered(false);
            }}
            onMouseEnter={openSemuaHover}
            onMouseLeave={closeSemuaHover}
            title={
              activeCategoryItem
                ? `${activeFilterLabel} (${activeFilterCount}) — Klik untuk kembali ke ${allLabel}`
                : `${allLabel} (${categoriesData.allCount})`
            }
            aria-expanded={isSemuaHovered}
            className="h-[34px] shrink-0 max-w-[160px] px-[10px] text-xs rounded-[28px] border shadow-xs transition-all flex items-center justify-center gap-[10px] cursor-pointer select-none hover:shadow-sm bg-primary border-primary text-primary-foreground font-semibold"
          >
            <span className="truncate">{activeFilterLabel}</span>
            <span className="text-[11px] shrink-0 text-primary-foreground/85">
              {activeFilterCount}
            </span>
            <ChevronDown
              className={`size-3 shrink-0 text-primary-foreground/85 transition-transform duration-150 ${
                isSemuaHovered ? "rotate-180" : ""
              }`}
            />
          </button>

          <button
            ref={sortBtnRef}
            type="button"
            onClick={() => {
              if (selectedComponent !== "all") {
                setSelectedComponent("all");
                setOpenModuleFeatures({});
                setIsSortHovered(false);
              } else {
                openSortHover();
              }
            }}
            onMouseEnter={openSortHover}
            onMouseLeave={closeSortHover}
            title={
              activeComponentMeta
                ? `Sortir: ${activeComponentMeta.label} (${componentCounts.counts[selectedComponent as SubComponentKey]}) — Klik untuk kembali ke ${allLabel}`
                : "Sortir 10 jenis komponen modul"
            }
            aria-label={
              activeComponentMeta
                ? `Sortir komponen aktif: ${activeComponentMeta.label}`
                : "Sortir komponen"
            }
            aria-expanded={isSortHovered}
            className={`size-[34px] aspect-square shrink-0 rounded-[14px] border active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none ${
              activeComponentMeta
                ? "bg-primary border-primary text-primary-foreground shadow-xs hover:shadow-sm"
                : "bg-card border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/60"
            }`}
          >
            <ActiveSortIcon className="size-3.5 shrink-0" />
          </button>
        </div>
      </div>

      {/* Area Daftar Modul + Overlay Blur Full ke Bawah saat Hover Tombol Semua / Sortir */}
      <div ref={overlayAreaRef} className="relative flex-1 w-full">
        {/* Daftar Semua Modul Berurutan Tanpa Kotak Pemisah Kategori */}
        <div className="space-y-2.5">
        {(() => {
          const displayedModuleEntries = categoriesData.categoryList
            .filter((cat) => {
              if (q) return true;
              if (!selectedCategory || selectedCategory === "all" || selectedCategory === "semua") {
                return true;
              }
              const cleanStr = (s: string) => s.toLowerCase().replace(/[-_\s]+/g, "");
              const sel = cleanStr(selectedCategory);
              const c = cleanStr(cat.name);
              return c.includes(sel) || sel.includes(c);
            })
            .flatMap((cat) => {
              const entries: {
                mod: WorkspaceModuleItem;
                catName: string;
                filteredFeatures: WorkspaceFeatureItem[];
              }[] = [];
              for (const m of cat.modules) {
                const rawFeatures = m.features || [];
                const byComponent =
                  selectedComponent === "all"
                    ? rawFeatures
                    : rawFeatures.filter(
                        (f) =>
                          ((f.componentCategory || "Features").toLowerCase() as SubComponentKey) ===
                          selectedComponent
                      );

                if (selectedComponent !== "all" && byComponent.length === 0) {
                  continue;
                }

                if (q) {
                  const modMatch =
                    m.title.toLowerCase().includes(q) ||
                    (m.desc && m.desc.toLowerCase().includes(q));
                  const matchingFeats = byComponent.filter(
                    (f) =>
                      f.title.toLowerCase().includes(q) ||
                      (f.desc && f.desc.toLowerCase().includes(q))
                  );
                  if (!modMatch && matchingFeats.length === 0) {
                    continue;
                  }
                  entries.push({
                    mod: m,
                    catName: cat.name,
                    filteredFeatures: modMatch ? byComponent : matchingFeats,
                  });
                } else {
                  entries.push({
                    mod: m,
                    catName: cat.name,
                    filteredFeatures: byComponent,
                  });
                }
              }
              return entries;
            });

          if (displayedModuleEntries.length === 0 && activeComponentMeta) {
            return (
              <div className="rounded-[24px] bg-background border border-border/70 px-4 py-5 text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Belum ada komponen <span className="font-semibold text-foreground">{activeComponentMeta.label}</span> di daftar ini.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedComponent("all");
                    setOpenModuleFeatures({});
                  }}
                  className="inline-flex items-center justify-center h-7 px-3 rounded-[28px] text-[11px] font-medium bg-primary text-primary-foreground cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Tampilkan {allLabel}
                </button>
              </div>
            );
          }

          return displayedModuleEntries.map(({ mod, catName, filteredFeatures }) => {
            const ModIcon = mod.icon || CheckCircle2;
            const hPage = getHierarchyPage(activeWorkspace.id);
            const hMod = hPage
              ? getHierarchyModule(hPage.slug, catName, mod.id)
              : undefined;
            const pathOnly = hMod
              ? `${hMod.routePath}/${
                  selectedComponent !== "all" ? selectedComponent : hMod.defaultComponentKey
                }`
              : mod.to.split("?")[0];
            const searchParams =
              !hMod && mod.to.includes("?")
                ? Object.fromEntries(new URLSearchParams(mod.to.split("?")[1]))
                : undefined;
            const isSubOpen = q
              ? true
              : selectedComponent !== "all"
                ? openModuleFeatures[mod.id] !== false
                : !!openModuleFeatures[mod.id];
            const hasFeatures = filteredFeatures.length > 0;

            return (
              <div
                key={mod.id}
                className="rounded-[24px] bg-background border border-border/70 shadow-2xs overflow-hidden transition-all"
              >
                {/* Baris Utama Modul */}
                <div className="flex items-center justify-between gap-1 px-3 py-2.5 hover:bg-muted/40 transition-colors text-foreground group/item">
                  <Link
                    to={pathOnly as any}
                    search={searchParams as any}
                    onClick={onNavigate}
                    className="flex items-center gap-2 min-w-0 flex-1 outline-none text-left"
                    title={mod.desc || mod.title}
                  >
                    <ModIcon size={13} className="text-muted-foreground group-hover/item:text-foreground shrink-0 transition-transform" />
                    <span className="text-xs font-normal group-hover/item:text-foreground transition-colors truncate">
                      {mod.title}
                    </span>
                  </Link>

                  {/* Tombol dropdown chevron untuk membuka sub-fitur modul */}
                  {hasFeatures && (
                    <button
                      type="button"
                      onClick={(e) => toggleModuleFeatures(mod.id, e)}
                      className="size-6 rounded-full flex items-center justify-center shrink-0 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      title={isSubOpen ? "Tutup daftar fitur" : "Buka daftar fitur"}
                      aria-label="Tampilkan fitur modul"
                    >
                      <ChevronRight
                        size={13}
                        className={`shrink-0 transition-transform duration-200 text-muted-foreground group-hover/item:text-foreground hover:text-foreground ${
                          isSubOpen ? "rotate-90 text-foreground" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Daftar Sub-Fitur Modul (Menyatu tanpa garis divider, padding seimbang 10px) */}
                {isSubOpen && hasFeatures && (
                  <div className="px-2.5 pb-2.5 pt-1 space-y-1 bg-muted/20 dark:bg-muted/10 animate-in fade-in duration-150">
                    {filteredFeatures.map((feat, fIdx) => {
                      const compKey = (
                        feat.componentCategory || "Features"
                      ).toLowerCase() as SubComponentKey;
                      const compMeta =
                        SUB_COMPONENT_TAB_MAP[compKey] || SUB_COMPONENT_TAB_MAP.features;
                      const CompIcon =
                        getComponentCategoryIcon(compMeta.label) || compMeta.icon;
                      const compBadge = (
                        <span
                          className="inline-flex items-center shrink-0 px-2 py-0.5 rounded-full bg-muted/60 dark:bg-muted/40 text-[10px] font-medium text-muted-foreground group-hover/feat:text-primary group-hover/feat:bg-primary/10 transition-colors"
                          title={`Jenis komponen: ${compMeta.label} — ${compMeta.description}`}
                        >
                          <span>{compMeta.label}</span>
                        </span>
                      );

                      if (hMod) {
                        const targetRoute = `${hMod.routePath}/${compKey}`;
                        const featSearch = feat.to
                          ? { item: feat.to }
                          : undefined;
                        return (
                          <Link
                            key={fIdx}
                            to={targetRoute as any}
                            search={featSearch as any}
                            onClick={onNavigate}
                            className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[28px] text-[11px] font-normal text-muted-foreground hover:text-primary hover:bg-background transition-colors group/feat"
                            title={`${feat.desc || feat.title} · Komponen: ${compMeta.label}`}
                          >
                            <span className="flex items-center gap-2 min-w-0 flex-1">
                              <CompIcon size={12} className="shrink-0 text-muted-foreground group-hover/feat:text-primary transition-colors" />
                              <span className="truncate">{feat.title}</span>
                            </span>
                            {compBadge}
                          </Link>
                        );
                      }

                      if (!feat.to) {
                        return (
                          <div
                            key={fIdx}
                            className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[28px] text-[11px] font-normal text-muted-foreground/80 cursor-default select-none group/feat"
                            title={`${feat.desc || feat.title} · Komponen: ${compMeta.label}`}
                          >
                            <span className="flex items-center gap-2 min-w-0 flex-1">
                              <CompIcon size={12} className="shrink-0 text-muted-foreground/70" />
                              <span className="truncate">{feat.title}</span>
                            </span>
                            {compBadge}
                          </div>
                        );
                      }

                      const fPath = feat.to.split("?")[0];
                      const fSearch = feat.to.includes("?")
                        ? Object.fromEntries(new URLSearchParams(feat.to.split("?")[1]))
                        : undefined;

                      return (
                        <Link
                          key={fIdx}
                          to={fPath as any}
                          search={fSearch as any}
                          onClick={onNavigate}
                          className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[28px] text-[11px] font-normal text-muted-foreground hover:text-primary hover:bg-background transition-colors group/feat"
                          title={`${feat.desc || feat.title} · Komponen: ${compMeta.label}`}
                        >
                          <span className="flex items-center gap-2 min-w-0 flex-1">
                            <CompIcon size={12} className="shrink-0 text-muted-foreground group-hover/feat:text-primary transition-colors" />
                            <span className="truncate">{feat.title}</span>
                          </span>
                          {compBadge}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          });
        })()}
        </div>

        {/* Overlay Hover Kategori Halaman Aktif: efek blur full ke bawah tanpa kotak persegi rounded */}
        <AnimatePresence>
          {isSemuaHovered && categoriesData.categoryList.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="pointer-events-none absolute -top-3 -left-3 -right-3 -bottom-4 z-30 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm px-3 pb-4"
            >
              <div className="relative w-full">
                <div
                  onMouseEnter={openSemuaHover}
                  onMouseLeave={closeSemuaHover}
                  className={
                    semuaAlign
                      ? "pointer-events-auto absolute top-0 -translate-x-1/2 flex flex-col items-center gap-[10px] w-max pt-[10px] pb-1"
                      : "pointer-events-auto flex flex-col items-center gap-[10px] w-max mx-auto pt-[10px] pb-1"
                  }
                  style={
                    semuaAlign
                      ? {
                          left: `${semuaAlign.centerX}px`,
                          minWidth: `${semuaAlign.btnWidth}px`,
                          maxWidth: `${semuaAlign.maxWidth}px`,
                        }
                      : undefined
                  }
                >
                  {activeCategoryItem && (
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectAllCategories();
                        setIsSemuaHovered(false);
                      }}
                      title={`${allLabel} (${categoriesData.allCount})`}
                      className="w-fit max-w-full h-[34px] px-[10px] text-xs rounded-[28px] border shadow-xs transition-all flex items-center justify-center gap-[10px] cursor-pointer select-none bg-card/90 border-border text-foreground hover:border-primary/60 hover:text-primary font-medium"
                    >
                      <span className="truncate">{allLabel}</span>
                      <span className="text-[11px] shrink-0 text-muted-foreground">
                        {categoriesData.allCount}
                      </span>
                    </button>
                  )}
                  {categoriesData.categoryList
                    .filter((cat) => !activeCategoryItem || cat.name !== activeCategoryItem.name)
                    .map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => {
                          handleSelectCategory(cat.name);
                          setIsSemuaHovered(false);
                        }}
                        title={`${cat.name} (${cat.count})`}
                        className="w-fit max-w-full h-[34px] px-[10px] text-xs rounded-[28px] border shadow-xs transition-all flex items-center justify-center gap-[10px] cursor-pointer select-none bg-card/90 border-border text-foreground hover:border-primary/60 hover:text-primary font-medium"
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[11px] shrink-0 text-muted-foreground">
                          {cat.count}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay Hover Sortir 10 Jenis Komponen Modul: gaya & efek hover sama persis seperti tombol Semua */}
        <AnimatePresence>
          {isSortHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="pointer-events-none absolute -top-3 -left-3 -right-3 -bottom-4 z-30 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm px-3 pb-4"
            >
              <div className="relative w-full">
                <div
                  onMouseEnter={openSortHover}
                  onMouseLeave={closeSortHover}
                  className={
                    sortAlign
                      ? "pointer-events-auto absolute top-0 flex flex-col items-end gap-[10px] w-max pt-[10px] pb-2"
                      : "pointer-events-auto flex flex-col items-end gap-[10px] w-max ml-auto pt-[10px] pb-2"
                  }
                  style={
                    sortAlign
                      ? {
                          right: `${sortAlign.rightOffset}px`,
                          minWidth: `${sortAlign.btnWidth}px`,
                          maxWidth: `${sortAlign.maxWidth}px`,
                        }
                      : undefined
                  }
                >
                  {selectedComponent !== "all" && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedComponent("all");
                        setOpenModuleFeatures({});
                        setIsSortHovered(false);
                      }}
                      title={`${allLabel} (${componentCounts.total})`}
                      className="w-fit max-w-full h-[34px] px-[10px] text-xs rounded-[28px] border shadow-xs transition-all flex items-center justify-center gap-[10px] cursor-pointer select-none bg-card/90 border-border text-foreground hover:border-primary/60 hover:text-primary font-medium"
                    >
                      <span className="truncate">{allLabel}</span>
                      <span className="text-[11px] shrink-0 text-muted-foreground">
                        {componentCounts.total}
                      </span>
                    </button>
                  )}
                  {SUB_COMPONENT_TABS.map((tab) => {
                    const CompIcon = getComponentCategoryIcon(tab.label) || tab.icon;
                    const count = componentCounts.counts[tab.key];
                    const isActive = selectedComponent === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => handleSelectComponent(tab.key)}
                        title={`${tab.label} (${count}) — ${tab.description}`}
                        className={`w-fit max-w-full h-[34px] px-[10px] text-xs rounded-[28px] border shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer select-none ${
                          isActive
                            ? "bg-primary border-primary text-primary-foreground font-semibold"
                            : "bg-card/90 border-border text-foreground hover:border-primary/60 hover:text-primary font-medium"
                        }`}
                      >
                        <CompIcon className="size-3 shrink-0" />
                        <span className="truncate">{tab.label}</span>
                        <span
                          className={`text-[11px] shrink-0 ${
                            isActive ? "text-primary-foreground/85" : "text-muted-foreground"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
