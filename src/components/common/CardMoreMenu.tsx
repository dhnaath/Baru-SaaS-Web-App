import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpDown,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Info,
  Maximize2,
  MoreVertical,
  PanelBottom,
  Pin,
  RotateCcw,
  Share2,
  Palette,
  Upload,
} from "lucide-react";
import {
  LAUNCHER_PAGE_OPTIONS,
  getLauncherPageOption,
  useCardPageMover,
  type MovedCardCategoryGroupSnapshot,
  type MovedCardFeatureSnapshot,
} from "@/hooks/useCardPageMover";
import {
  useCardIconColor,
  CARD_COLOR_PRESETS,
  resolveIconBg,
} from "@/hooks/useCardIconColor";
import {
  useCardIconImage,
  CARD_ICON_PRESETS,
  compressImageFileToDataUrl,
} from "@/hooks/useCardIconImage";
import { usePinnedCards } from "@/hooks/usePinnedCards";
import {
  useCardComponentFilter,
  CARD_COMPONENT_ICONS,
  normalizeComponentKey,
} from "@/hooks/useCardComponentFilter";
import { SUB_COMPONENT_TABS, SUB_COMPONENT_TAB_MAP } from "@/core/unifiedTaxonomy";
import type { SubComponentKey } from "@/core/hierarchyRegistry";

export interface CardMoveMenuData {
  cardKey: string;
  originPageId: string;
  currentPageId: string;
  to: string;
  badge?: string;
  shortDesc?: string;
  gradient?: string;
  accentGradient?: string;
  icon?: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  features?: MovedCardFeatureSnapshot[];
  tools?: MovedCardFeatureSnapshot[];
  categoryGroups?: MovedCardCategoryGroupSnapshot[];
}

/**
 * MoveArrowsIcon — 4-way move arrows icon matching user uploaded specification (/public/assets/aistudio/image_c6a20cb9.png).
 * 4 completely detached, individual arrows with wide central spacing (302px) and spacious diagonal gaps.
 * None of the arrows touch or connect to each other.
 */
export function MoveArrowsIcon({ className = "size-4", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1200 1200"
      fill="currentColor"
      className={className}
      {...props}
    >
      {/* 1. Panah Atas (Up) — terpisah sendiri */}
      <path d="M600,98 L775,273 L723,325 L636,238 V449 H564 V238 L477,325 L425,273 Z" />
      {/* 2. Panah Kanan (Right) — terpisah sendiri */}
      <path d="M1102,600 L927,775 L875,723 L962,636 H751 V564 H962 L875,477 L927,425 Z" />
      {/* 3. Panah Bawah (Down) — terpisah sendiri */}
      <path d="M600,1102 L425,927 L477,875 L564,962 V751 H636 V962 L723,875 L775,927 Z" />
      {/* 4. Panah Kiri (Left) — terpisah sendiri */}
      <path d="M98,600 L273,425 L325,477 L238,564 H449 V636 H238 L325,723 L273,775 Z" />
    </svg>
  );
}

export interface CardMoreMenuProps {
  title: string;
  isFav: boolean;
  onToggleFavorite: () => void;
  moveData?: CardMoveMenuData;
  to?: string;
  icon?: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  defaultGradient?: string;
  componentGroups?: { name: string; count: number }[];
}

export function CardMoreMenu({
  title,
  isFav,
  onToggleFavorite,
  moveData,
  to,
  icon,
  defaultGradient,
  componentGroups,
}: CardMoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isIconImageModalOpen, setIsIconImageModalOpen] = useState(false);
  const [isSortSubmenuOpen, setIsSortSubmenuOpen] = useState(false);
  const [isHideSubmenuOpen, setIsHideSubmenuOpen] = useState(false);
  const [pageQuery, setPageQuery] = useState("");
  const [customImageUrlInput, setCustomImageUrlInput] = useState("");
  const [iconImageError, setIconImageError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const sortRowRef = useRef<HTMLButtonElement>(null);
  const sortSubmenuRef = useRef<HTMLDivElement>(null);
  const sortSubmenuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideRowRef = useRef<HTMLButtonElement>(null);
  const hideSubmenuRef = useRef<HTMLDivElement>(null);
  const hideSubmenuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moveListRef = useRef<HTMLDivElement>(null);
  const iconFileInputRef = useRef<HTMLInputElement>(null);
  const [menuPos, setMenuPos] = useState<{
    top?: number;
    bottom?: number;
    right: number;
    maxHeight: number;
  } | null>(null);
  const [sortSubmenuPos, setSortSubmenuPos] = useState<{
    top: number;
    left: number;
    maxHeight: number;
  } | null>(null);
  const [hideSubmenuPos, setHideSubmenuPos] = useState<{
    top: number;
    left: number;
    maxHeight: number;
  } | null>(null);

  const cardTo = to || moveData?.to;
  const CardIcon = icon || moveData?.icon;
  const cardDefaultGradient = defaultGradient || moveData?.gradient || "bg-linear-to-br from-primary to-indigo-700";
  const { customColor, hasCustomColor, setColor, resetColor } = useCardIconColor(title, cardTo);
  const {
    customIcon,
    customPresetIcon,
    customImageSrc,
    hasCustomIcon,
    setPresetIcon,
    setCustomImageSrc,
    resetIconImage,
  } = useCardIconImage(title, cardTo);
  const EffectiveCardIcon = customPresetIcon || CardIcon;
  const {
    selectedComponent,
    hiddenComponents,
    toggleComponentFilter,
    resetComponentFilter,
    toggleHideComponent,
    unhideAllComponents,
  } = useCardComponentFilter(title, cardTo);

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

    if (componentGroups && componentGroups.length > 0) {
      for (const g of componentGroups) {
        const key = normalizeComponentKey(g.name) || "features";
        counts[key] += g.count;
        total += g.count;
      }
    } else if (moveData?.categoryGroups && moveData.categoryGroups.length > 0) {
      for (const g of moveData.categoryGroups) {
        const key = normalizeComponentKey(g.name) || "features";
        const c = g.items.length;
        counts[key] += c;
        total += c;
      }
    } else {
      if (moveData?.features && moveData.features.length > 0) {
        counts.features += moveData.features.length;
        total += moveData.features.length;
      }
      if (moveData?.tools && moveData.tools.length > 0) {
        counts.tools += moveData.tools.length;
        total += moveData.tools.length;
      }
    }

    return { counts, total };
  }, [componentGroups, moveData]);

  const activeComponentMeta =
    selectedComponent !== "all" ? SUB_COMPONENT_TAB_MAP[selectedComponent] : null;
  const ActiveComponentIcon =
    selectedComponent !== "all" ? CARD_COMPONENT_ICONS[selectedComponent] : ArrowUpDown;

  const [customHexInput, setCustomHexInput] = useState(() =>
    customColor && !customColor.startsWith("bg-") ? customColor : "#6366f1"
  );

  // Sync customHexInput when customColor changes
  useEffect(() => {
    if (customColor && !customColor.startsWith("bg-")) {
      setCustomHexInput(customColor);
    }
  }, [customColor]);

  // Sync customImageUrlInput when customImageSrc is a standard URL
  useEffect(() => {
    if (customImageSrc && /^https?:\/\//i.test(customImageSrc)) {
      setCustomImageUrlInput(customImageSrc);
    } else if (!customImageSrc) {
      setCustomImageUrlInput("");
    }
  }, [customImageSrc]);

  const {
    moveCardToPage,
    restoreCardToOrigin,
    getMovedRecord,
  } = useCardPageMover();

  const existingMoved = moveData ? getMovedRecord(moveData.cardKey) : undefined;
  const trueOriginPageId = existingMoved?.originPageId || moveData?.originPageId;
  const currentPageId = existingMoved?.targetPageId || moveData?.currentPageId;
  const isMovedFromOrigin = Boolean(
    existingMoved && existingMoved.targetPageId !== existingMoved.originPageId
  );
  const originPageMeta = getLauncherPageOption(trueOriginPageId);
  const effectivePageId = currentPageId || "global";
  const { isPinned, togglePin } = usePinnedCards(effectivePageId);
  const cardId = cardTo || title;
  const isCardPinned = isPinned(cardId, effectivePageId);

  const [popupPos, setPopupPos] = useState<{
    top?: number;
    bottom?: number;
    right: number;
    maxHeight: number;
  } | null>(null);

  const updatePopupPosition = (expectedHeight = 380, expectedWidth = 525) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const right = Math.max(12, Math.min(window.innerWidth - (expectedWidth + 12), window.innerWidth - rect.right));
      const spaceBelow = window.innerHeight - rect.bottom - 16;
      const spaceAbove = rect.top - 16;

      // If more space below or space below fits the popup comfortably, anchor below the button
      if (spaceBelow >= Math.min(320, expectedHeight) || spaceBelow >= spaceAbove) {
        const maxHeight = Math.max(200, Math.min(expectedHeight, spaceBelow));
        setPopupPos({
          top: rect.bottom + 6,
          right,
          maxHeight,
        });
      } else {
        // Otherwise anchor above the button so it flips upwards and never gets cropped
        const maxHeight = Math.max(200, Math.min(expectedHeight, spaceAbove));
        setPopupPos({
          bottom: window.innerHeight - rect.top + 6,
          right,
          maxHeight,
        });
      }
    }
  };

  const updateMenuPosition = useCallback(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    const right = Math.max(8, Math.min(window.innerWidth - 220, window.innerWidth - rect.right));
    const spaceBelow = window.innerHeight - rect.bottom - 16;
    const spaceAbove = rect.top - 16;

    if (spaceBelow >= 340 || spaceBelow >= spaceAbove) {
      setMenuPos({
        top: rect.bottom + 6,
        right,
        maxHeight: Math.max(180, spaceBelow),
      });
    } else {
      setMenuPos({
        bottom: window.innerHeight - rect.top + 6,
        right,
        maxHeight: Math.max(180, spaceAbove),
      });
    }
  }, []);

  const measureSideSubmenuPosition = useCallback(
    (rowEl: HTMLButtonElement | null, submenuWidth = 196) => {
      const menuEl = menuRef.current;
      if (!rowEl || !menuEl || typeof window === "undefined") return null;
      const rowRect = rowEl.getBoundingClientRect();
      const menuRect = menuEl.getBoundingClientRect();
      const estimatedHeight = Math.min(440, window.innerHeight - 24);
      const spaceRight = window.innerWidth - menuRect.right - 12;
      const left =
        spaceRight >= submenuWidth + 6
          ? menuRect.right + 6
          : Math.max(12, menuRect.left - submenuWidth - 6);
      const maxTop = Math.max(12, window.innerHeight - estimatedHeight - 12);
      const top = Math.max(12, Math.min(rowRect.top - 8, maxTop));
      return {
        top,
        left,
        maxHeight: Math.max(200, window.innerHeight - 24),
      };
    },
    []
  );

  const updateSortSubmenuPosition = useCallback(() => {
    const pos = measureSideSubmenuPosition(sortRowRef.current, 196);
    if (pos) setSortSubmenuPos(pos);
  }, [measureSideSubmenuPosition]);

  const updateHideSubmenuPosition = useCallback(() => {
    const pos = measureSideSubmenuPosition(hideRowRef.current, 212);
    if (pos) setHideSubmenuPos(pos);
  }, [measureSideSubmenuPosition]);

  const openSortSubmenu = useCallback(() => {
    if (sortSubmenuTimerRef.current) {
      clearTimeout(sortSubmenuTimerRef.current);
      sortSubmenuTimerRef.current = null;
    }
    if (hideSubmenuTimerRef.current) {
      clearTimeout(hideSubmenuTimerRef.current);
      hideSubmenuTimerRef.current = null;
    }
    setIsHideSubmenuOpen(false);
    updateSortSubmenuPosition();
    setIsSortSubmenuOpen(true);
  }, [updateSortSubmenuPosition]);

  const closeSortSubmenu = useCallback(() => {
    if (sortSubmenuTimerRef.current) {
      clearTimeout(sortSubmenuTimerRef.current);
    }
    sortSubmenuTimerRef.current = setTimeout(() => {
      setIsSortSubmenuOpen(false);
    }, 120);
  }, []);

  const openHideSubmenu = useCallback(() => {
    if (hideSubmenuTimerRef.current) {
      clearTimeout(hideSubmenuTimerRef.current);
      hideSubmenuTimerRef.current = null;
    }
    if (sortSubmenuTimerRef.current) {
      clearTimeout(sortSubmenuTimerRef.current);
      sortSubmenuTimerRef.current = null;
    }
    setIsSortSubmenuOpen(false);
    updateHideSubmenuPosition();
    setIsHideSubmenuOpen(true);
  }, [updateHideSubmenuPosition]);

  const closeHideSubmenu = useCallback(() => {
    if (hideSubmenuTimerRef.current) {
      clearTimeout(hideSubmenuTimerRef.current);
    }
    hideSubmenuTimerRef.current = setTimeout(() => {
      setIsHideSubmenuOpen(false);
    }, 120);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsSortSubmenuOpen(false);
      setIsHideSubmenuOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (sortSubmenuTimerRef.current) {
        clearTimeout(sortSubmenuTimerRef.current);
      }
      if (hideSubmenuTimerRef.current) {
        clearTimeout(hideSubmenuTimerRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !isSortSubmenuOpen) return;
    updateSortSubmenuPosition();
    window.addEventListener("resize", updateSortSubmenuPosition);
    window.addEventListener("scroll", updateSortSubmenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateSortSubmenuPosition);
      window.removeEventListener("scroll", updateSortSubmenuPosition, true);
    };
  }, [isOpen, isSortSubmenuOpen, updateSortSubmenuPosition]);

  useLayoutEffect(() => {
    if (!isOpen || !isHideSubmenuOpen) return;
    updateHideSubmenuPosition();
    window.addEventListener("resize", updateHideSubmenuPosition);
    window.addEventListener("scroll", updateHideSubmenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateHideSubmenuPosition);
      window.removeEventListener("scroll", updateHideSubmenuPosition, true);
    };
  }, [isOpen, isHideSubmenuOpen, updateHideSubmenuPosition]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [isOpen, updateMenuPosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        (!menuRef.current || !menuRef.current.contains(target)) &&
        (!sortSubmenuRef.current || !sortSubmenuRef.current.contains(target)) &&
        (!hideSubmenuRef.current || !hideSubmenuRef.current.contains(target))
      ) {
        setIsSortSubmenuOpen(false);
        setIsHideSubmenuOpen(false);
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSortSubmenuOpen(false);
        setIsHideSubmenuOpen(false);
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isMoveModalOpen) return;
    const measureThreeAndHalfItemsHeight = () => {
      const listEl = moveListRef.current;
      if (listEl && listEl.children.length > 0) {
        const first = listEl.children[0] as HTMLElement;
        const second = listEl.children[1] as HTMLElement | undefined;
        const itemH = first.offsetHeight;
        const gap = second ? Math.max(0, second.offsetTop - (first.offsetTop + itemH)) : 14;
        if (itemH > 0) {
          return Math.round(26 + itemH * 3.5 + gap * 3);
        }
      }
      return 280;
    };
    const updateMovePopup = () => updatePopupPosition(measureThreeAndHalfItemsHeight(), 525);
    updateMovePopup();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMoveModalOpen(false);
      }
    };
    window.addEventListener("resize", updateMovePopup);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", updateMovePopup);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMoveModalOpen]);

  useEffect(() => {
    if (!isColorModalOpen) return;
    updatePopupPosition(380, 385);
    const handleResize = () => updatePopupPosition(380, 385);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsColorModalOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isColorModalOpen]);

  useEffect(() => {
    if (!isIconImageModalOpen) return;
    setIconImageError(null);
    updatePopupPosition(420, 385);
    const handleResize = () => updatePopupPosition(420, 385);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsIconImageModalOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isIconImageModalOpen]);

  const handleUploadIconFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setIconImageError("Pilih file gambar yang valid (PNG, JPG, WebP, atau SVG).");
      return;
    }
    try {
      setIconImageError(null);
      const dataUrl = await compressImageFileToDataUrl(file, 192);
      const saved = setCustomImageSrc(dataUrl);
      if (!saved) {
        setIconImageError("Penyimpanan penuh. Coba gambar dengan ukuran lebih kecil.");
      }
    } catch (err) {
      setIconImageError(err instanceof Error ? err.message : "Gagal memproses gambar.");
    }
  };

  const handleApplyImageUrl = () => {
    const trimmed = customImageUrlInput.trim();
    if (!trimmed) {
      setIconImageError("Masukkan URL gambar terlebih dahulu.");
      return;
    }
    if (!/^(https?:\/\/|\/|data:image\/)/i.test(trimmed)) {
      setIconImageError("URL harus diawali https:// atau http://.");
      return;
    }
    setIconImageError(null);
    const saved = setCustomImageSrc(trimmed);
    if (!saved) {
      setIconImageError("Gagal menyimpan gambar icon.");
    }
  };

  const filteredPages = LAUNCHER_PAGE_OPTIONS.filter((p) => {
    if (!pageQuery.trim()) return true;
    const q = pageQuery.toLowerCase().trim();
    return (
      p.label.toLowerCase().includes(q) ||
      p.shortLabel.toLowerCase().includes(q) ||
      p.badge.toLowerCase().includes(q) ||
      `hal ${p.pageNumber}`.includes(q) ||
      `page ${p.pageNumber}`.includes(q)
    );
  });

  const handleSelectTargetPage = (targetPageId: string, openAfterMove = false) => {
    if (!moveData) return;
    moveCardToPage(
      {
        cardKey: moveData.cardKey,
        originPageId: trueOriginPageId || moveData.originPageId,
        title,
        to: moveData.to,
        badge: moveData.badge,
        shortDesc: moveData.shortDesc,
        gradient: moveData.gradient,
        accentGradient: moveData.accentGradient,
        icon: moveData.icon,
        features: moveData.features,
      },
      targetPageId,
      openAfterMove
    );
    setIsMoveModalOpen(false);
    setPageQuery("");
  };

  return (
    <div
      className="flex items-center gap-1.5 shrink-0"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Dummy Expand Full View button (layout placeholder, non-interactive) */}
      <button
        type="button"
        disabled
        aria-disabled="true"
        className="p-1.5 rounded-xl border border-border/60 text-muted-foreground transition-all cursor-default shrink-0 flex items-center justify-center"
        title="Expand full view"
        aria-label={`Expand full view untuk ${title}`}
      >
        <Maximize2 className="size-4" />
      </button>

      <div ref={containerRef} className="relative shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isOpen) {
              updateMenuPosition();
            }
            setIsOpen((prev) => !prev);
          }}
          className={`p-1.5 rounded-xl border transition-all cursor-pointer active:scale-95 shrink-0 flex items-center justify-center ${
            isOpen
              ? "border-border bg-muted text-foreground shadow-2xs"
              : "border-border/60 hover:border-border hover:bg-muted/60 text-muted-foreground hover:text-foreground"
          }`}
          title="Opsi lainnya"
          aria-label={`Opsi untuk ${title}`}
          aria-expanded={isOpen}
        >
          <MoreVertical className="size-4" />
        </button>

      {isOpen &&
        menuPos &&
        typeof document !== "undefined" &&
        createPortal(
        <div
          ref={menuRef}
          style={{
            top: menuPos.top !== undefined ? `${menuPos.top}px` : undefined,
            bottom: menuPos.bottom !== undefined ? `${menuPos.bottom}px` : undefined,
            right: `${menuPos.right}px`,
            maxHeight: `${menuPos.maxHeight}px`,
          }}
          className="fixed z-[110] min-w-[208px] overflow-y-auto no-scrollbar rounded-xl border border-border bg-popover text-popover-foreground p-1 shadow-lg animate-in fade-in zoom-in-95 duration-150 space-y-0.5"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* 1. Tambah / Hapus dari Dock */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite();
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isFav
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "text-foreground hover:bg-muted"
            }`}
            title={
              isFav
                ? "Hapus dari Dock"
                : "Tambah ke Dock (Maksimal 5)"
            }
          >
            <PanelBottom
              className={`size-3.5 shrink-0 transition-transform ${
                isFav ? "text-primary scale-105" : "text-muted-foreground"
              }`}
            />
            <span className="whitespace-nowrap">
              {isFav ? "Hapus dari Dock" : "Tambah ke Dock"}
            </span>
          </button>

          {/* 2. Pin Kartu di Bagian Atas Halaman */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              togglePin(cardId, effectivePageId);
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isCardPinned
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "text-foreground hover:bg-muted"
            }`}
            title={
              isCardPinned
                ? "Lepas pin kartu dari bagian atas halaman"
                : "Pin kartu di bagian atas halaman (urutan pertama, maks 5)"
            }
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <Pin
                className={`size-3.5 shrink-0 transition-transform ${
                  isCardPinned
                    ? "text-primary fill-primary rotate-45"
                    : "text-muted-foreground"
                }`}
              />
              <span className="whitespace-nowrap">
                {isCardPinned ? "Lepas Pin dari Atas" : "Pin Kartu di Atas"}
              </span>
            </span>
            {isCardPinned && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-semibold bg-primary text-primary-foreground">
                Pinned
              </span>
            )}
          </button>

          {/* 3. Ganti Warna Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
              setIsColorModalOpen(true);
            }}
            className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer group/color"
            title="Ganti warna dan gradien icon kartu ini"
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <Palette className="size-3.5 shrink-0 text-muted-foreground group-hover/color:text-primary transition-colors" />
              <span className="whitespace-nowrap">Ganti Warna Icon</span>
            </span>
            {hasCustomColor && (
              <span className="size-2 rounded-full bg-primary shrink-0" title="Warna telah dikustomisasi" />
            )}
          </button>

          {/* 4. Ganti Gambar Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
              setIsIconImageModalOpen(true);
            }}
            className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer group/icon-image"
            title="Ganti gambar atau simbol icon kartu ini"
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <ImageIcon className="size-3.5 shrink-0 text-muted-foreground group-hover/icon-image:text-primary transition-colors" />
              <span className="whitespace-nowrap">Ganti Gambar Icon</span>
            </span>
            {hasCustomIcon && (
              <span className="size-2 rounded-full bg-primary shrink-0" title="Gambar icon telah dikustomisasi" />
            )}
          </button>

          {/* 5. Pindahkan Kotak ke Page Laman */}
          {moveData && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                  setIsMoveModalOpen(true);
                }}
                className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer group/move"
                title="Pindahkan kotak menu ini ke page laman lain"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <MoveArrowsIcon className="size-3.5 shrink-0 text-muted-foreground group-hover/move:text-primary transition-colors" />
                  <span className="whitespace-nowrap">Pindahkan ke Laman</span>
                </span>
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/70 group-hover/move:translate-x-0.5 transition-transform" />
              </button>

              {isMovedFromOrigin && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    restoreCardToOrigin(moveData.cardKey, title);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                  title={`Kembalikan ke ${originPageMeta?.label || "Page Asal"}`}
                >
                  <RotateCcw className="size-3.5 shrink-0" />
                  <span className="whitespace-nowrap truncate">
                    Kembalikan ke {originPageMeta?.shortLabel || "Page Asal"}
                  </span>
                </button>
              )}
            </>
          )}

          {/* 6. Urutkan / Sortir 10 Jenis Komponen Modul (sama seperti sidebar kiri) */}
          <button
            ref={sortRowRef}
            type="button"
            onMouseEnter={openSortSubmenu}
            onMouseLeave={closeSortSubmenu}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isSortSubmenuOpen) {
                setIsSortSubmenuOpen(false);
              } else {
                openSortSubmenu();
              }
            }}
            aria-expanded={isSortSubmenuOpen}
            title={
              activeComponentMeta
                ? `Sortir Komponen: ${activeComponentMeta.label}`
                : "Sortir 10 jenis komponen modul"
            }
            className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer group/sort ${
              selectedComponent !== "all"
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : isSortSubmenuOpen
                  ? "bg-muted text-foreground"
                  : "text-foreground hover:bg-muted"
            }`}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <ActiveComponentIcon
                className={`size-3.5 shrink-0 transition-colors ${
                  selectedComponent !== "all"
                    ? "text-primary"
                    : "text-muted-foreground group-hover/sort:text-primary"
                }`}
              />
              <span className="whitespace-nowrap">Urutkan</span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              {activeComponentMeta && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-primary text-primary-foreground leading-none">
                  {activeComponentMeta.label}
                </span>
              )}
              <ChevronRight
                className={`size-3.5 shrink-0 transition-transform ${
                  selectedComponent !== "all"
                    ? "text-primary"
                    : "text-muted-foreground/70 group-hover/sort:translate-x-0.5"
                }`}
              />
            </span>
          </button>

          {/* 7. Sembunyikan / Tampilkan 10 Jenis Komponen Modul (Hidden / Unhidden) */}
          <button
            ref={hideRowRef}
            type="button"
            onMouseEnter={openHideSubmenu}
            onMouseLeave={closeHideSubmenu}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isHideSubmenuOpen) {
                setIsHideSubmenuOpen(false);
              } else {
                openHideSubmenu();
              }
            }}
            aria-expanded={isHideSubmenuOpen}
            title={
              hiddenComponents.length > 0
                ? `${hiddenComponents.length} jenis komponen disembunyikan`
                : "Sembunyikan atau tampilkan 10 jenis komponen modul"
            }
            className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer group/hide ${
              hiddenComponents.length > 0
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : isHideSubmenuOpen
                  ? "bg-muted text-foreground"
                  : "text-foreground hover:bg-muted"
            }`}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <EyeOff
                className={`size-3.5 shrink-0 transition-colors ${
                  hiddenComponents.length > 0
                    ? "text-primary"
                    : "text-muted-foreground group-hover/hide:text-primary"
                }`}
              />
              <span className="whitespace-nowrap">Sembunyikan</span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              {hiddenComponents.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-primary text-primary-foreground leading-none">
                  {hiddenComponents.length}
                </span>
              )}
              <ChevronRight
                className={`size-3.5 shrink-0 transition-transform ${
                  hiddenComponents.length > 0
                    ? "text-primary"
                    : "text-muted-foreground/70 group-hover/hide:translate-x-0.5"
                }`}
              />
            </span>
          </button>

          {/* 8. Tentang Modul Ini (Dummy - non-interactive) */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-foreground transition-colors cursor-default"
          >
            <Info className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="whitespace-nowrap">Tentang Modul Ini</span>
          </button>

          {/* 9. Bagikan Modul Ini (Dummy - non-interactive) */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-foreground transition-colors cursor-default"
          >
            <Share2 className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="whitespace-nowrap">Bagikan Modul Ini</span>
          </button>
        </div>,
        document.body
      )}

      {/* Submenu Hover/Klik Sortir 10 Jenis Komponen Modul */}
      {isOpen &&
        isSortSubmenuOpen &&
        sortSubmenuPos &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={sortSubmenuRef}
            onMouseEnter={openSortSubmenu}
            onMouseLeave={closeSortSubmenu}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              top: `${sortSubmenuPos.top}px`,
              left: `${sortSubmenuPos.left}px`,
              maxHeight: `${sortSubmenuPos.maxHeight}px`,
            }}
            className="fixed z-[115] w-[196px] overflow-y-auto no-scrollbar rounded-2xl border border-border bg-popover/95 backdrop-blur-md text-popover-foreground p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-1.5"
          >
            {selectedComponent !== "all" && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  resetComponentFilter();
                  setIsSortSubmenuOpen(false);
                  setIsOpen(false);
                }}
                title={
                  componentCounts.total > 0
                    ? `Semua (${componentCounts.total})`
                    : "Tampilkan Semua Komponen"
                }
                className="w-full h-[32px] px-2.5 text-xs rounded-[28px] border shadow-xs transition-all flex items-center justify-between gap-2 cursor-pointer select-none bg-card/90 border-border text-foreground hover:border-primary/60 hover:text-primary font-medium"
              >
                <span className="truncate">Semua</span>
                {componentCounts.total > 0 && (
                  <span className="text-[11px] shrink-0 text-muted-foreground">
                    {componentCounts.total}
                  </span>
                )}
              </button>
            )}
            {SUB_COMPONENT_TABS.map((tab) => {
              const CompIcon = CARD_COMPONENT_ICONS[tab.key];
              const count = componentCounts.counts[tab.key];
              const isActive = selectedComponent === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleComponentFilter(tab.key);
                    setIsSortSubmenuOpen(false);
                    setIsOpen(false);
                  }}
                  title={
                    componentCounts.total > 0
                      ? `${tab.label} (${count}) — ${tab.description}`
                      : `${tab.label} — ${tab.description}`
                  }
                  className={`w-full h-[32px] px-2.5 text-xs rounded-[28px] border shadow-xs transition-all flex items-center justify-between gap-2 cursor-pointer select-none ${
                    isActive
                      ? "bg-primary border-primary text-primary-foreground font-semibold"
                      : "bg-card/90 border-border text-foreground hover:border-primary/60 hover:text-primary font-medium"
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <CompIcon className="size-3 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </span>
                  {componentCounts.total > 0 && (
                    <span
                      className={`text-[11px] shrink-0 ${
                        isActive ? "text-primary-foreground/85" : "text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>,
          document.body
        )}

      {/* Submenu Hover/Klik Sembunyikan / Tampilkan 10 Jenis Komponen Modul */}
      {isOpen &&
        isHideSubmenuOpen &&
        hideSubmenuPos &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={hideSubmenuRef}
            onMouseEnter={openHideSubmenu}
            onMouseLeave={closeHideSubmenu}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              top: `${hideSubmenuPos.top}px`,
              left: `${hideSubmenuPos.left}px`,
              maxHeight: `${hideSubmenuPos.maxHeight}px`,
            }}
            className="fixed z-[115] w-[212px] overflow-y-auto no-scrollbar rounded-2xl border border-border bg-popover/95 backdrop-blur-md text-popover-foreground p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-1.5"
          >
            {hiddenComponents.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  unhideAllComponents();
                }}
                title="Tampilkan kembali semua komponen yang disembunyikan"
                className="w-full h-[32px] px-2.5 text-xs rounded-[28px] border shadow-xs transition-all flex items-center justify-between gap-2 cursor-pointer select-none bg-card/90 border-border text-foreground hover:border-primary/60 hover:text-primary font-medium"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <Eye className="size-3 shrink-0" />
                  <span className="truncate">Tampilkan Semua</span>
                </span>
                <span className="text-[11px] shrink-0 text-muted-foreground">
                  {hiddenComponents.length}
                </span>
              </button>
            )}
            {SUB_COMPONENT_TABS.map((tab) => {
              const CompIcon = CARD_COMPONENT_ICONS[tab.key];
              const count = componentCounts.counts[tab.key];
              const isHiddenItem = hiddenComponents.includes(tab.key);
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleHideComponent(tab.key);
                  }}
                  title={
                    isHiddenItem
                      ? `Klik untuk menampilkan kembali ${tab.label}`
                      : `Klik untuk menyembunyikan ${tab.label}`
                  }
                  className={`w-full h-[32px] px-2.5 text-xs rounded-[28px] border shadow-xs transition-all flex items-center justify-between gap-2 cursor-pointer select-none ${
                    isHiddenItem
                      ? "bg-primary border-primary text-primary-foreground font-semibold"
                      : "bg-card/90 border-border text-foreground hover:border-primary/60 hover:text-primary font-medium"
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <CompIcon className="size-3 shrink-0" />
                    <span className={`truncate ${isHiddenItem ? "line-through opacity-90" : ""}`}>
                      {tab.label}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    {componentCounts.total > 0 && (
                      <span
                        className={`text-[11px] shrink-0 ${
                          isHiddenItem ? "text-primary-foreground/85" : "text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                    {isHiddenItem ? (
                      <EyeOff className="size-3 shrink-0 text-primary-foreground" />
                    ) : (
                      <Eye className="size-3 shrink-0 text-muted-foreground/70" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>,
          document.body
        )}
      </div>

      {/* Pop-up Pemilihan Page Tujuan: Floating card anchored langsung di depan menu kartu */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isMoveModalOpen && moveData && (
              <div
                className="fixed inset-0 z-[120] pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMoveModalOpen(false);
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {/* Click-outside backdrop transparan tanpa menggelapkan layar */}
                <div className="absolute inset-0 bg-transparent" />

                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="fixed z-10 w-[525px] max-w-[calc(100vw-24px)] rounded-[28px] border border-border bg-popover text-popover-foreground shadow-2xl p-2.5 flex flex-col overflow-hidden"
                  style={{
                    top: popupPos?.top !== undefined ? `${popupPos.top}px` : undefined,
                    bottom: popupPos?.bottom !== undefined ? `${popupPos.bottom}px` : undefined,
                    right: popupPos ? `${popupPos.right}px` : "24px",
                    maxHeight: popupPos ? `${popupPos.maxHeight}px` : "280px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Daftar 13 Page Laman */}
                  <div ref={moveListRef} className="p-1 overflow-y-auto space-y-[14px] flex-1">
                {filteredPages.map((page) => {
                  const isCurrent = page.id === currentPageId;

                  return (
                    <div
                      key={page.id}
                      className={`w-full rounded-2xl border transition-all flex items-center justify-between gap-2.5 py-2 px-3 ${
                        isCurrent
                          ? "border-primary/40 bg-primary/8"
                          : "border-border/60 bg-background/60 hover:border-primary/35 hover:bg-muted/50"
                      }`}
                    >
                      <button
                        type="button"
                        disabled={isCurrent}
                        onClick={() => handleSelectTargetPage(page.id, false)}
                        className={`flex items-center min-w-0 flex-1 text-left px-2 py-1 ${
                          isCurrent ? "cursor-default" : "cursor-pointer"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-foreground truncate">
                              {page.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className="text-[11px] text-muted-foreground truncate"
                              title={page.badge}
                            >
                              {page.badge}
                            </span>
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isCurrent ? (
                          <span
                            className="size-8.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-2xs"
                            title="Laman saat ini (Aktif)"
                            aria-label="Laman saat ini (Aktif)"
                          >
                            <Check className="size-4 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelectTargetPage(page.id, false);
                            }}
                            className="size-8.5 rounded-xl border border-border/80 bg-background/80 hover:bg-primary/10 hover:border-primary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center shrink-0"
                            title={`Pindahkan ke ${page.label}`}
                            aria-label={`Pindahkan ke ${page.label}`}
                          >
                            <MoveArrowsIcon className="size-4.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filteredPages.length === 0 && (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    Tidak ada page laman ditemukan.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}

      {/* Pop-up Ganti Warna Icon Kartu: Floating card anchored langsung di depan menu kartu */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isColorModalOpen && (
              <div
                className="fixed inset-0 z-[130] pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsColorModalOpen(false);
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {/* Click-outside backdrop transparan tanpa menggelapkan layar */}
                <div className="absolute inset-0 bg-transparent" />

                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="fixed z-10 w-[385px] max-w-[calc(100vw-24px)] rounded-[28px] border border-border bg-popover text-popover-foreground shadow-2xl p-2.5 flex flex-col overflow-hidden"
                  style={{
                    top: popupPos?.top !== undefined ? `${popupPos.top}px` : undefined,
                    bottom: popupPos?.bottom !== undefined ? `${popupPos.bottom}px` : undefined,
                    right: popupPos ? `${popupPos.right}px` : "24px",
                    maxHeight: popupPos ? `${popupPos.maxHeight}px` : "420px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
              {/* Body Modal */}
              <div className="p-5 overflow-y-auto space-y-5 no-scrollbar">
                {/* 1. Preview Icon Kartu */}
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/40 border border-border/60 gap-2.5">
                  <div
                    className={`h-16 w-16 rounded-full overflow-hidden flex items-center justify-center text-white shadow-md transition-all ${
                      resolveIconBg(customColor, cardDefaultGradient).className
                    }`}
                    style={resolveIconBg(customColor, cardDefaultGradient).style}
                  >
                    {customImageSrc ? (
                      <img
                        src={customImageSrc}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    ) : EffectiveCardIcon ? (
                      <EffectiveCardIcon className="h-8 w-8 drop-shadow-sm opacity-95" strokeWidth={1.75} />
                    ) : (
                      <Palette className="h-8 w-8 drop-shadow-sm opacity-95" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-foreground truncate max-w-[280px]">
                      {title}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {hasCustomColor ? (
                        <span className="text-primary font-medium inline-flex items-center gap-1">
                          <Check className="size-3" /> Warna Kustom Diterapkan
                        </span>
                      ) : (
                        "Warna Bawaan (Default Sistem)"
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Palet Gradien & Warna Pilihan */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground">
                      Pilihan Gradien & Warna Cepat
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {CARD_COLOR_PRESETS.length} Pilihan
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {CARD_COLOR_PRESETS.map((preset) => {
                      const isSelected = customColor === preset.value;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setColor(preset.value);
                          }}
                          className={`relative flex flex-col items-center p-2 rounded-xl border transition-all cursor-pointer group ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/30"
                              : "border-border/60 hover:border-border hover:bg-muted/50"
                          }`}
                          title={preset.name}
                        >
                          <div
                            className="size-8 rounded-full shadow-xs flex items-center justify-center text-white transition-transform group-hover:scale-105 shrink-0"
                            style={{ background: preset.previewBg }}
                          >
                            {isSelected && <Check className="size-4 stroke-[2.5] drop-shadow-sm" />}
                          </div>
                          <span className="text-[10px] text-center font-medium text-foreground mt-1.5 truncate max-w-full leading-tight">
                            {preset.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Pemilih Warna Kustom Sendiri (Color Picker & Hex) */}
                <div className="pt-2 border-t border-border">
                  <span className="text-xs font-semibold text-foreground block mb-2">
                    Warna Kustom Sendiri (Hex Picker)
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center shrink-0">
                      <input
                        type="color"
                        value={customHexInput.startsWith("#") ? customHexInput : "#6366f1"}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomHexInput(val);
                          setColor(val);
                        }}
                        style={{
                          backgroundColor: customHexInput.startsWith("#") ? customHexInput : "#6366f1",
                        }}
                        className="h-7.5 w-9 rounded-xl border-0 p-0 overflow-hidden cursor-pointer shadow-xs appearance-none transition-transform active:scale-95 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-xl [&::-moz-color-swatch]:border-none [&::-moz-color-swatch]:rounded-xl"
                        title="Klik untuk memilih warna"
                      />
                    </div>
                    <input
                      type="text"
                      value={customHexInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomHexInput(val);
                        if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
                          setColor(val);
                        }
                      }}
                      placeholder="#6366F1"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (/^#([0-9A-F]{3}){1,2}$/i.test(customHexInput)) {
                          setColor(customHexInput);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium cursor-pointer transition-colors"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
                <button
                  type="button"
                  onClick={() => {
                    resetColor();
                  }}
                  disabled={!hasCustomColor}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    hasCustomColor
                      ? "text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 cursor-pointer"
                      : "text-muted-foreground/50 cursor-not-allowed"
                  }`}
                  title="Kembalikan ke warna bawaan sistem"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset ke Bawaan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsColorModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}

      {/* Pop-up Ganti Gambar Icon Kartu: Floating card anchored langsung di depan menu kartu (gaya sama dengan Ganti Warna Icon) */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isIconImageModalOpen && (() => {
              const previewBg = resolveIconBg(customColor, cardDefaultGradient);
              return (
                <div
                  className="fixed inset-0 z-[130] pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsIconImageModalOpen(false);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {/* Click-outside backdrop transparan tanpa menggelapkan layar */}
                  <div className="absolute inset-0 bg-transparent" />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="fixed z-10 w-[385px] max-w-[calc(100vw-24px)] rounded-[28px] border border-border bg-popover text-popover-foreground shadow-2xl p-2.5 flex flex-col overflow-hidden"
                    style={{
                      top: popupPos?.top !== undefined ? `${popupPos.top}px` : undefined,
                      bottom: popupPos?.bottom !== undefined ? `${popupPos.bottom}px` : undefined,
                      right: popupPos ? `${popupPos.right}px` : "24px",
                      maxHeight: popupPos ? `${popupPos.maxHeight}px` : "420px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Body Modal */}
                    <div className="p-5 overflow-y-auto space-y-5 no-scrollbar">
                      {/* 1. Preview Icon Kartu */}
                      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/40 border border-border/60 gap-2.5">
                        <div
                          className={`h-16 w-16 rounded-full overflow-hidden flex items-center justify-center text-white shadow-md transition-all ${previewBg.className}`}
                          style={previewBg.style}
                        >
                          {customImageSrc ? (
                            <img
                              src={customImageSrc}
                              alt={title}
                              className="h-full w-full object-cover"
                            />
                          ) : EffectiveCardIcon ? (
                            <EffectiveCardIcon className="h-8 w-8 drop-shadow-sm opacity-95" strokeWidth={1.75} />
                          ) : (
                            <ImageIcon className="h-8 w-8 drop-shadow-sm opacity-95" />
                          )}
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-bold text-foreground truncate max-w-[280px]">
                            {title}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {hasCustomIcon ? (
                              <span className="text-primary font-medium inline-flex items-center gap-1">
                                <Check className="size-3" />{" "}
                                {customImageSrc ? "Gambar Kustom Diterapkan" : "Icon Kustom Diterapkan"}
                              </span>
                            ) : (
                              "Icon Bawaan (Default Sistem)"
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 2. Pilihan Icon Cepat */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-foreground">
                            Pilihan Gambar Icon Cepat
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {CARD_ICON_PRESETS.length} Pilihan
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {CARD_ICON_PRESETS.map((preset) => {
                            const PresetIcon = preset.icon;
                            const isSelected =
                              customIcon?.type === "preset" && customIcon.iconId === preset.id;
                            return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => {
                                  setIconImageError(null);
                                  setPresetIcon(preset.id);
                                }}
                                className={`relative flex flex-col items-center p-2 rounded-xl border transition-all cursor-pointer group ${
                                  isSelected
                                    ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/30"
                                    : "border-border/60 hover:border-border hover:bg-muted/50"
                                }`}
                                title={preset.name}
                              >
                                <div
                                  className={`relative size-8 rounded-full shadow-xs flex items-center justify-center text-white transition-transform group-hover:scale-105 shrink-0 ${previewBg.className}`}
                                  style={previewBg.style}
                                >
                                  <PresetIcon className="size-4 drop-shadow-sm" strokeWidth={1.9} />
                                  {isSelected && (
                                    <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center ring-2 ring-popover">
                                      <Check className="size-2.5 stroke-[3]" />
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-center font-medium text-foreground mt-1.5 truncate max-w-full leading-tight">
                                  {preset.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. Unggah Gambar / URL Kustom Sendiri */}
                      <div className="pt-2 border-t border-border">
                        <span className="text-xs font-semibold text-foreground block mb-2">
                          Gambar Kustom Sendiri (Upload / URL)
                        </span>
                        <input
                          ref={iconFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleUploadIconFile}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => iconFileInputRef.current?.click()}
                            className="h-7.5 w-9 rounded-xl border border-border bg-background hover:bg-muted text-foreground flex items-center justify-center shrink-0 cursor-pointer shadow-xs transition-transform active:scale-95"
                            title="Unggah gambar dari perangkat"
                            aria-label="Unggah gambar dari perangkat"
                          >
                            <Upload className="size-3.5" />
                          </button>
                          <input
                            type="text"
                            value={customImageUrlInput}
                            onChange={(e) => {
                              setCustomImageUrlInput(e.target.value);
                              if (iconImageError) setIconImageError(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleApplyImageUrl();
                              }
                            }}
                            placeholder="https://... atau unggah gambar"
                            className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <button
                            type="button"
                            onClick={handleApplyImageUrl}
                            className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium cursor-pointer transition-colors shrink-0"
                          >
                            Terapkan
                          </button>
                        </div>
                        {iconImageError && (
                          <p className="mt-1.5 text-[11px] text-rose-600 dark:text-rose-400">
                            {iconImageError}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer Modal */}
                    <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
                      <button
                        type="button"
                        onClick={() => {
                          setIconImageError(null);
                          setCustomImageUrlInput("");
                          resetIconImage();
                        }}
                        disabled={!hasCustomIcon}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          hasCustomIcon
                            ? "text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 cursor-pointer"
                            : "text-muted-foreground/50 cursor-not-allowed"
                        }`}
                        title="Kembalikan ke icon bawaan sistem"
                      >
                        <RotateCcw className="size-3.5" />
                        <span>Reset ke Bawaan</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsIconImageModalOpen(false)}
                        className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                      >
                        Selesai
                      </button>
                    </div>
                  </motion.div>
                </div>
              );
            })()}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
