import React, { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  RotateCcw,
  Pin,
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
import { useKembaliButtonClass } from "@/hooks/useKembaliButtonClass";
import { usePinnedCards } from "@/hooks/usePinnedCards";
import { CardMoreMenu } from "./CardMoreMenu";
import { useCardIconColor, resolveIconBg } from "@/hooks/useCardIconColor";
import { useCardIconImage } from "@/hooks/useCardIconImage";
import {
  makeMovedCardKey,
  useCardPageMover,
  useCurrentLauncherPage,
  type MovedCardRecord,
} from "@/hooks/useCardPageMover";
import {
  useCardComponentFilter,
  isCardComponentVisible,
  isCardComponentHidden,
} from "@/hooks/useCardComponentFilter";
import { SUB_COMPONENT_TAB_MAP } from "@/core/unifiedTaxonomy";

export type ModuleComponentCategory =
  | "Features"
  | "Tools"
  | "Dashboards"
  | "Workflows"
  | "Automations"
  | "Templates"
  | "Analytics"
  | "Records"
  | "Settings"
  | "Guides";

export const MODULE_COMPONENT_CATEGORIES: readonly ModuleComponentCategory[] = [
  "Features",
  "Tools",
  "Dashboards",
  "Workflows",
  "Automations",
  "Templates",
  "Analytics",
  "Records",
  "Settings",
  "Guides",
];

export const MODULE_COMPONENT_CATEGORY_ICONS: Record<ModuleComponentCategory, LucideIcon> = {
  Dashboards: LayoutGrid,
  Automations: Zap,
  Analytics: TrendingUp,
  Settings: Settings,
  Workflows: Workflow,
  Templates: Copy,
  Records: Database,
  Guides: BookOpen,
  Features: Puzzle,
  Tools: Wrench,
};

export function getComponentCategoryIcon(name?: string): LucideIcon | undefined {
  if (!name) return undefined;
  const exact = MODULE_COMPONENT_CATEGORY_ICONS[name as ModuleComponentCategory];
  if (exact) return exact;
  const normalized = name.trim().toLowerCase();
  const match = MODULE_COMPONENT_CATEGORIES.find(
    (cat) => cat.toLowerCase() === normalized
  );
  return match ? MODULE_COMPONENT_CATEGORY_ICONS[match] : undefined;
}

export interface CategorizableModuleItem {
  title?: string;
  label?: string;
  to?: string;
  desc?: string;
  inverted?: boolean;
  componentCategory?: ModuleComponentCategory;
}

export function buildModuleCategoryGroups(
  items: CategorizableModuleItem[] | undefined,
  fallbackTo: string
): MBACardCategoryGroup[] | undefined {
  if (!items || items.length === 0) return undefined;
  const buckets = new Map<ModuleComponentCategory, MBACardFeatureItem[]>();
  for (const cat of MODULE_COMPONENT_CATEGORIES) {
    buckets.set(cat, []);
  }
  for (const item of items) {
    const cat = item.componentCategory || "Features";
    const title = item.title || item.label || "";
    buckets.get(cat)!.push({
      title,
      to: item.to !== undefined ? item.to : fallbackTo,
      desc: item.desc,
      inverted: item.inverted,
    });
  }
  const groups: MBACardCategoryGroup[] = [];
  let idx = 1;
  for (const cat of MODULE_COMPONENT_CATEGORIES) {
    const groupItems = buckets.get(cat)!;
    if (groupItems.length > 0) {
      groups.push({
        id: idx,
        categoryNumber: idx,
        name: cat,
        items: groupItems,
      });
      idx += 1;
    }
  }
  return groups.length > 0 ? groups : undefined;
}

export interface MBACardFeatureItem {
  title: string;
  to: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  desc?: string;
  inverted?: boolean;
}

export interface MBACardCategoryGroup {
  id: number;
  categoryNumber: number;
  name: string;
  items: MBACardFeatureItem[];
}

export interface MBACardProps {
  id?: string;
  title: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  badge?: string;
  featureLabel?: string;
  shortDesc?: string;
  features?: MBACardFeatureItem[];
  tools?: MBACardFeatureItem[];
  categoryGroups?: MBACardCategoryGroup[];
  categoryOnlyMode?: boolean;
  isFav: boolean;
  toggleFavorite: (to: string) => void;
  gradient?: string;
  accentGradient?: string;
  maxFeatureCols?: 2 | 3 | 4 | 5;
  cardHeightClass?: string;
  showFeatureIcons?: boolean;
  movedRecord?: MovedCardRecord;
}

const GRADIENT_PALETTES = [
  "bg-linear-to-br from-blue-500 to-indigo-700",
  "bg-linear-to-br from-indigo-500 to-purple-700",
  "bg-linear-to-br from-purple-500 to-pink-700",
  "bg-linear-to-br from-rose-500 to-red-700",
  "bg-linear-to-br from-amber-500 to-orange-700",
  "bg-linear-to-br from-emerald-500 to-teal-700",
  "bg-linear-to-br from-cyan-500 to-blue-700",
  "bg-linear-to-br from-violet-500 to-fuchsia-700",
  "bg-linear-to-br from-fuchsia-500 to-rose-700",
  "bg-linear-to-br from-sky-500 to-blue-700",
  "bg-linear-to-br from-teal-500 to-emerald-700",
];

function getHashGradient(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[idx];
}

export function MBACard({
  title,
  to,
  icon: Icon,
  badge,
  featureLabel,
  shortDesc,
  features = [],
  tools,
  categoryGroups,
  categoryOnlyMode = true,
  isFav,
  toggleFavorite,
  gradient,
  accentGradient,
  maxFeatureCols = 3,
  cardHeightClass = "min-h-[300px]",
  showFeatureIcons = true,
  movedRecord,
}: MBACardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const kembaliBtnClass = useKembaliButtonClass();
  const currentPageId = useCurrentLauncherPage();
  const { isCardMovedOut } = useCardPageMover();
  const { isPinned, togglePin } = usePinnedCards(currentPageId);
  const isCardPinned = isPinned(to || title, currentPageId);

  const [interactionConfig, setInteractionConfig] = useState(() => ({
    axis: Math.random() > 0.5 ? "x" : "y",
    dir: Math.random() > 0.5 ? 1 : -1,
  }));
  const wasFlippedRef = useRef(false);
  const { customColor } = useCardIconColor(title, to);
  const { customPresetIcon, customImageSrc } = useCardIconImage(title, to);
  const DisplayIcon = customPresetIcon || Icon;
  const {
    selectedComponent,
    hiddenComponents,
    resetComponentFilter,
    toggleHideComponent,
    unhideAllComponents,
  } = useCardComponentFilter(title, to);

  // Hide native card if user moved it to a different Launcher page
  if (!movedRecord && currentPageId && isCardMovedOut(currentPageId, to, title)) {
    return null;
  }

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFlipped((prev) => {
      if (!prev) {
        wasFlippedRef.current = true;
      }
      return !prev;
    });
  };

  const cardGradient =
    gradient ||
    (accentGradient
      ? accentGradient.startsWith("bg-")
        ? accentGradient
        : `bg-gradient-to-br ${accentGradient}`
      : getHashGradient(title));

  const iconBg = resolveIconBg(customColor, cardGradient);

  const mainPath = to.split("?")[0];
  const mainSearch = to.includes("?")
    ? Object.fromEntries(new URLSearchParams(to.split("?")[1]))
    : undefined;

  const moveData = currentPageId
    ? {
        cardKey:
          movedRecord?.cardKey ||
          makeMovedCardKey(currentPageId, to, title),
        originPageId: movedRecord?.originPageId || currentPageId,
        currentPageId,
        to,
        badge,
        shortDesc,
        gradient,
        accentGradient,
        icon: Icon,
        features: features.map((f) => ({
          title: f.title,
          to: f.to,
          desc: f.desc,
          inverted: f.inverted,
        })),
        tools: tools?.map((t) => ({
          title: t.title,
          to: t.to,
          desc: t.desc,
          inverted: t.inverted,
        })),
        categoryGroups: categoryGroups?.map((g) => ({
          id: g.id,
          categoryNumber: g.categoryNumber,
          name: g.name,
          items: g.items.map((item) => ({
            title: item.title,
            to: item.to,
            desc: item.desc,
            inverted: item.inverted,
          })),
        })),
      }
    : undefined;

  const renderFeatureChips = (items: MBACardFeatureItem[]) => {
    const is2x2 = items.length === 4 || maxFeatureCols === 2;
    return (
      <div
        className={
          is2x2
            ? "flex flex-wrap justify-center content-start gap-2 w-full"
            : "flex flex-wrap justify-center content-start gap-1.5 w-full"
        }
      >
        {items.map((feat, idx) => {
          if (!feat.to) {
            return (
              <span
                key={idx}
                title={feat.desc || feat.title}
                className="w-auto max-w-full inline-flex items-center justify-center px-[6px] py-[6px] rounded-full bg-black dark:bg-foreground text-[11px] font-medium text-white dark:text-muted border border-black dark:border-foreground text-center cursor-default select-none"
              >
                <span className="module-chip-label whitespace-normal">
                  {feat.title}
                </span>
              </span>
            );
          }

          const featPath = feat.to.split("?")[0];
          const featSearch = feat.to.includes("?")
            ? Object.fromEntries(new URLSearchParams(feat.to.split("?")[1]))
            : undefined;

          return (
            <Link
              key={idx}
              to={featPath as any}
              search={featSearch as any}
              title={feat.desc || feat.title}
              className={
                feat.inverted
                  ? "w-auto max-w-full inline-flex items-center justify-center px-[6px] py-[6px] rounded-full bg-black dark:bg-foreground hover:opacity-85 text-[11px] font-medium text-white dark:text-muted transition-all cursor-pointer border border-black dark:border-foreground group/chip text-center"
                  : "w-auto max-w-full inline-flex items-center justify-center px-[6px] py-[6px] rounded-full bg-muted/60 hover:bg-primary/10 hover:text-primary text-[11px] font-medium text-foreground transition-all cursor-pointer border border-border/40 hover:border-primary/30 group/chip text-center"
              }
            >
              <span className="module-chip-label whitespace-normal">
                {feat.title}
              </span>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`w-full [perspective:1000px] h-full ${cardHeightClass}`}>
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        animate={{
          rotateX: isFlipped && interactionConfig.axis === "x" ? 180 * interactionConfig.dir : 0,
          rotateY: isFlipped && interactionConfig.axis === "y" ? 180 * interactionConfig.dir : 0,
        }}
        transition={{ duration: 0.6, type: "spring", stiffness: 80, damping: 15 }}
        onAnimationComplete={() => {
          if (!isFlipped && wasFlippedRef.current) {
            wasFlippedRef.current = false;
            setInteractionConfig((prev) => {
              let nextAxis = prev.axis;
              let nextDir = prev.dir;
              while (nextAxis === prev.axis && nextDir === prev.dir) {
                nextAxis = Math.random() > 0.5 ? "x" : "y";
                nextDir = Math.random() > 0.5 ? 1 : -1;
              }
              return { axis: nextAxis, dir: nextDir };
            });
          }
        }}
      >
        {/* Front Face (Gaya Kotak Tools 100 MBA) */}
        <div
          className={`w-full h-full rounded-[28px] border border-border bg-card p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between gap-4 group ${
            isFlipped ? "pointer-events-none" : ""
          }`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          <div className="flex flex-col flex-1">
            <div className="flex items-start justify-between gap-3 shrink-0">
              <Link
                to={mainPath as any}
                search={mainSearch as any}
                className="flex items-center gap-3.5 group/header min-w-0 flex-1 outline-none"
              >
                <div
                  className={`h-12 w-12 rounded-full overflow-hidden flex items-center justify-center text-white shadow-xs shrink-0 ${iconBg.className} group-hover/header:scale-105 transition-all`}
                  style={iconBg.style}
                >
                  {customImageSrc ? (
                    <img src={customImageSrc} alt={title} className="h-full w-full object-cover" />
                  ) : (
                    <DisplayIcon className="h-6 w-6 opacity-90 drop-shadow-sm" strokeWidth={1.75} />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-base text-foreground group-hover/header:text-primary transition-colors truncate">
                    {title}
                  </h4>
                  {badge && (
                    <span className="text-[11px] text-muted-foreground truncate block mt-0.5">
                      {badge}
                    </span>
                  )}
                </div>
              </Link>

              <div className="flex items-center gap-1.5 shrink-0">
                {isCardPinned && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      togglePin(to || title, currentPageId);
                    }}
                    className="p-1.5 rounded-xl border border-primary/25 bg-primary/15 text-primary hover:bg-primary/20 hover:border-primary/40 transition-all cursor-pointer active:scale-95 shrink-0 flex items-center justify-center shadow-2xs"
                    title="Lepas pin dari bagian atas halaman"
                    aria-label="Lepas pin kartu"
                  >
                    <Pin size={14} className="fill-primary rotate-45" />
                  </button>
                )}
                <CardMoreMenu
                  title={title}
                  isFav={isFav}
                  onToggleFavorite={() => toggleFavorite(to)}
                  moveData={moveData}
                  to={to}
                  icon={Icon}
                  defaultGradient={cardGradient}
                  componentGroups={
                    categoryGroups && categoryGroups.length > 0
                      ? categoryGroups.map((g) => ({
                          name: g.name,
                          count: g.items.length,
                        }))
                      : features.length > 0 && tools && tools.length > 0
                        ? [
                            { name: "Features", count: features.length },
                            { name: "Tools", count: tools.length },
                          ]
                        : tools && tools.length > 0
                          ? [{ name: "Tools", count: tools.length }]
                          : features.length > 0
                            ? [{ name: featureLabel || "Features", count: features.length }]
                            : undefined
                  }
                />
              </div>
            </div>

            {(() => {
              const selectedKey = selectedComponent !== "all" ? selectedComponent : null;
              const activeCompLabel = selectedKey
                ? SUB_COMPONENT_TAB_MAP[selectedKey]?.label || selectedKey
                : null;
              const isSelectedHidden = Boolean(
                selectedKey && hiddenComponents.includes(selectedKey)
              );

              const renderEmptyFilterState = (allHiddenOnly = false) => (
                <div className="mt-3 pt-3 flex flex-col flex-1 items-center justify-center text-center gap-2">
                  <p className="text-[11px] text-muted-foreground">
                    {isSelectedHidden ? (
                      <>
                        Komponen{" "}
                        <span className="font-semibold text-foreground">{activeCompLabel}</span> sedang disembunyikan.
                      </>
                    ) : allHiddenOnly ? (
                      "Semua komponen di modul ini sedang disembunyikan."
                    ) : (
                      <>
                        Belum ada komponen{" "}
                        <span className="font-semibold text-foreground">{activeCompLabel}</span> di modul ini.
                      </>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (selectedKey && isSelectedHidden) {
                        toggleHideComponent(selectedKey);
                      } else if (allHiddenOnly) {
                        unhideAllComponents();
                      } else {
                        resetComponentFilter();
                      }
                    }}
                    className="inline-flex items-center justify-center h-7 px-3 rounded-[28px] text-[11px] font-medium bg-primary text-primary-foreground cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    {isSelectedHidden ? "Tampilkan Kembali" : "Tampilkan Semua"}
                  </button>
                </div>
              );

              const renderInlineReset = () =>
                selectedComponent !== "all" ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      resetComponentFilter();
                    }}
                    className="ml-1.5 text-[10px] font-semibold text-primary hover:underline cursor-pointer"
                    title="Tampilkan semua komponen"
                  >
                    (Semua)
                  </button>
                ) : null;

              const renderHiddenFooter = (hiddenCount: number) =>
                hiddenCount > 0 ? (
                  <div className="pt-1 flex justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        unhideAllComponents();
                      }}
                      className="text-[10px] text-muted-foreground hover:text-primary hover:underline cursor-pointer transition-colors"
                      title="Tampilkan kembali komponen yang disembunyikan"
                    >
                      {hiddenCount} komponen disembunyikan · Tampilkan
                    </button>
                  </div>
                ) : null;

              if (categoryGroups && categoryGroups.length > 0) {
                const visibleGroups = categoryGroups.filter((group) =>
                  isCardComponentVisible(group.name, selectedComponent, hiddenComponents)
                );
                const hiddenOnCardCount = categoryGroups.filter((group) =>
                  isCardComponentHidden(group.name, hiddenComponents)
                ).length;
                if (visibleGroups.length === 0) {
                  return renderEmptyFilterState(selectedComponent === "all" && hiddenOnCardCount > 0);
                }
                return (
                  <div className="mt-3 pt-1 flex flex-col flex-1 space-y-4">
                    {visibleGroups.map((group) => {
                      const CategoryIcon = getComponentCategoryIcon(group.name);
                      return (
                        <div key={group.id} className="flex flex-col">
                          <span className="inline-flex items-center justify-center gap-1 text-[10px] font-normal tracking-wider text-muted-foreground mb-1.5 text-center shrink-0">
                            {CategoryIcon && <CategoryIcon size={11} className="shrink-0" />}
                            <span>{group.name} ({group.items.length}):</span>
                            {renderInlineReset()}
                          </span>
                          {renderFeatureChips(group.items)}
                        </div>
                      );
                    })}
                    {renderHiddenFooter(hiddenOnCardCount)}
                  </div>
                );
              }

              if (features.length > 0 && tools && tools.length > 0) {
                const showFeatures = isCardComponentVisible("Features", selectedComponent, hiddenComponents);
                const showTools = isCardComponentVisible("Tools", selectedComponent, hiddenComponents);
                const hiddenOnCardCount =
                  (isCardComponentHidden("Features", hiddenComponents) ? 1 : 0) +
                  (isCardComponentHidden("Tools", hiddenComponents) ? 1 : 0);
                if (!showFeatures && !showTools) {
                  return renderEmptyFilterState(selectedComponent === "all" && hiddenOnCardCount > 0);
                }
                return (
                  <div className="mt-3 pt-1 flex flex-col flex-1 space-y-8">
                    {showFeatures && (
                      <div className="flex flex-col">
                        <span className="inline-flex items-center justify-center gap-1 text-[10px] font-normal tracking-wider text-muted-foreground mb-2 text-center shrink-0">
                          <Puzzle size={11} className="shrink-0" />
                          <span>Features ({features.length}):</span>
                          {renderInlineReset()}
                        </span>
                        {renderFeatureChips(features)}
                      </div>
                    )}

                    {showTools && (
                      <div className="flex flex-col">
                        <span className="inline-flex items-center justify-center gap-1 text-[10px] font-normal tracking-wider text-muted-foreground mb-2 text-center shrink-0">
                          <Wrench size={11} className="shrink-0" />
                          <span>Tools ({tools.length}):</span>
                          {renderInlineReset()}
                        </span>
                        {renderFeatureChips(tools)}
                      </div>
                    )}
                    {renderHiddenFooter(hiddenOnCardCount)}
                  </div>
                );
              }

              if (tools && tools.length > 0) {
                const isHiddenTools = isCardComponentHidden("Tools", hiddenComponents);
                if (!isCardComponentVisible("Tools", selectedComponent, hiddenComponents)) {
                  return renderEmptyFilterState(selectedComponent === "all" && isHiddenTools);
                }
                return (
                  <div className="mt-3 pt-1 flex flex-col flex-1">
                    <span className="inline-flex items-center justify-center gap-1 text-[10px] font-normal tracking-wider text-muted-foreground mb-2 text-center shrink-0">
                      <Wrench size={11} className="shrink-0" />
                      <span>Tools ({tools.length}):</span>
                      {renderInlineReset()}
                    </span>
                    {renderFeatureChips(tools)}
                  </div>
                );
              }

              if (!categoryGroups && features.length === 0 && (!tools || tools.length === 0) && shortDesc) {
                if (selectedComponent !== "all") {
                  return renderEmptyFilterState(false);
                }
                return (
                  <div className="mt-3 pt-1 flex flex-col flex-1 justify-center">
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                      {shortDesc}
                    </p>
                  </div>
                );
              }

              const effectiveLabel = featureLabel || "Features";
              const isHiddenEffective = isCardComponentHidden(effectiveLabel, hiddenComponents);
              if (!isCardComponentVisible(effectiveLabel, selectedComponent, hiddenComponents)) {
                return renderEmptyFilterState(selectedComponent === "all" && isHiddenEffective);
              }
              const LabelIcon = getComponentCategoryIcon(effectiveLabel) || Puzzle;
              return (
                <div className="mt-3 pt-1 flex flex-col flex-1">
                  <span className="inline-flex items-center justify-center gap-1 text-[10px] font-normal tracking-wider text-muted-foreground mb-2 text-center shrink-0">
                    <LabelIcon size={11} className="shrink-0" />
                    <span>
                      {featureLabel ? `${featureLabel} (${features.length}):` : `Features (${features.length}):`}
                    </span>
                    {renderInlineReset()}
                  </span>
                  {renderFeatureChips(features)}
                </div>
              );
            })()}
          </div>

          <div className="pt-2 flex items-center justify-end text-xs shrink-0">
            <button
              type="button"
              onClick={handleFlip}
              className="p-1.5 rounded-xl border border-border/60 hover:border-border hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-all cursor-pointer active:scale-95 shrink-0 flex items-center justify-center group/btn"
              title="Lihat Related"
              aria-label="Lihat Related"
            >
              <ArrowRight className="size-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Back Face (Warna icon app + tombol kembali di ujung bawah kanan persis Tools 100 MBA) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-[28px] ${iconBg.className} p-4 shadow-lg border border-white/20 flex flex-col justify-end items-end overflow-hidden ${
            isFlipped ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{
            ...iconBg.style,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform:
              interactionConfig.axis === "x"
                ? `rotateX(${180 * interactionConfig.dir}deg)`
                : `rotateY(${180 * interactionConfig.dir}deg)`,
          }}
        >
          <button
            type="button"
            onClick={handleFlip}
            className={`${kembaliBtnClass} !p-1.5 !rounded-xl justify-center shrink-0`}
            title="Kembali"
            aria-label="Kembali"
          >
            <RotateCcw className="size-4 shrink-0" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
