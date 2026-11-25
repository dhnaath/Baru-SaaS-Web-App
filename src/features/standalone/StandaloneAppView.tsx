import * as React from "react";
import {
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  Layers,
  X,
} from "lucide-react";
import {
  STANDALONE_APPS,
  StandaloneRecord,
} from "./standaloneAppsData";
import { LEGACY_STANDALONE_SEED_FINGERPRINTS } from "./legacySeedFingerprints";
import { filterExactSeedRecords } from "@/core/legacySeed";
import { RetroReviewView } from "./RetroReviewView";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { ShellHeader } from "@/app/shell-header";
import { ExpandPopoverModal } from "@/components/ui/ExpandPopoverModal";

function isUnmodifiedLegacyDemo(appId: string, value: unknown): boolean {
  if (!value || typeof value !== "object" || !("id" in value)) return false;
  const record = value as { id?: unknown };
  if (typeof record.id !== "string") return false;
  return filterExactSeedRecords(
    [value as { id: string }],
    LEGACY_STANDALONE_SEED_FINGERPRINTS[appId],
  ).length === 0;
}

function SafeRedirect({ to }: { to: string }) {
  const navigate = useNavigate();
  const redirectedRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (redirectedRef.current === to) return;
    redirectedRef.current = to;
    navigate({ to: to as any, replace: true });
  }, [navigate, to]);

  return null;
}

interface StandaloneAppViewProps {
  appId: string;
}

export function StandaloneAppView({ appId }: StandaloneAppViewProps) {
  if (appId === "roadmap") {
    return <SafeRedirect to="/milestone-manager" />;
  }
  if (appId === "emergency-broadcast") {
    return <SafeRedirect to="/lainnya?app=emergency-hub" />;
  }
  if (appId === "interaction-timeline") {
    return <SafeRedirect to="/lainnya?app=meeting-timeline" />;
  }

  if (appId === "retro") {
    return <RetroReviewView />;
  }

  const config = STANDALONE_APPS[appId];

  // If no config found, render fallback
  if (!config) {
    return (
      <div className="p-8 text-center bg-card rounded-2xl border">
        <h2 className="text-lg font-bold text-foreground">Modul Tidak Ditemukan</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Aplikasi standalone dengan ID &ldquo;{appId}&rdquo; belum terdaftar.
        </p>
      </div>
    );
  }

  const storageKey = `aio_standalone_${appId}`;

  // State management with localStorage
  const [records, setRecords] = React.useState<StandaloneRecord[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (!Array.isArray(parsed)) return config.initialRecords;
        const nextRecords = parsed.filter((record) => !isUnmodifiedLegacyDemo(appId, record));
        if (nextRecords.length !== parsed.length) {
          localStorage.setItem(storageKey, JSON.stringify(nextRecords));
        }
        return nextRecords as StandaloneRecord[];
      }
    } catch {
      // ignore
    }
    return config.initialRecords;
  });

  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Sync the active tab with the `?tab=` URL param so the shell's contextual
  // sidebar can deep-link into a specific tab of this standalone app.
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  React.useEffect(() => {
    const param = new URLSearchParams(searchStr || "").get("tab");
    if (param && param !== activeTab && config.tabs.some((t) => t.id === param)) {
      setActiveTab(param);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchStr]);

  const changeTab = (id: string) => {
    setActiveTab(id);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", id);
      window.history.replaceState(window.history.state, "", url.toString());
    } catch {
      // ignore
    }
  };
  const [selectedPriority, setSelectedPriority] = React.useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);

  // New Record Form State
  const [formTitle, setFormTitle] = React.useState("");
  const [formSubtitle, setFormSubtitle] = React.useState("");
  const [formCategory, setFormCategory] = React.useState("");
  const [formDate, setFormDate] = React.useState("");
  const [formPriority, setFormPriority] = React.useState<"low" | "medium" | "high">("medium");
  const [formMeta, setFormMeta] = React.useState<Record<string, string>>({});

  // Save to localStorage
  const saveRecords = (newRecords: StandaloneRecord[]) => {
    setRecords(newRecords);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newRecords));
    } catch {
      // ignore
    }
  };

  const handleToggleStatus = (recordId: string) => {
    const updated = records.map((r) => {
      if (r.id !== recordId) return r;
      const nextStatus = r.status === "completed" ? "active" : "completed";
      return { ...r, status: nextStatus as StandaloneRecord["status"] };
    });
    saveRecords(updated);
  };

  const handleDeleteRecord = (recordId: string) => {
    const updated = records.filter((r) => r.id !== recordId);
    saveRecords(updated);
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newRecord: StandaloneRecord = {
      id: `${appId}-${Date.now()}`,
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || undefined,
      category: formCategory.trim() || undefined,
      date: formDate.trim() || new Date().toISOString().split("T")[0],
      priority: formPriority,
      status: "active",
      meta: Object.keys(formMeta).length > 0 ? formMeta : undefined,
    };

    saveRecords([newRecord, ...records]);
    setIsAddModalOpen(false);

    // Reset Form
    setFormTitle("");
    setFormSubtitle("");
    setFormCategory("");
    setFormDate("");
    setFormPriority("medium");
    setFormMeta({});
  };

  // Filter records
  const filteredRecords = records.filter((r) => {
    // Tab filter
    if (activeTab === "active" && r.status === "completed") return false;
    if (activeTab === "completed" && r.status !== "completed") return false;
    if (activeTab === "urgent" && r.priority !== "high" && r.status !== "urgent") return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchSub = r.subtitle?.toLowerCase().includes(q) || false;
      const matchCat = r.category?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchSub && !matchCat) return false;
    }

    // Priority filter
    if (selectedPriority !== "all" && r.priority !== selectedPriority) {
      return false;
    }

    return true;
  });

  const totalCount = records.length;
  const activeCount = records.filter((r) => r.status !== "completed").length;
  const completedCount = records.filter((r) => r.status === "completed").length;

  const Icon = config.icon;

  return (
    <div className="w-full flex flex-col bg-background">
      {/* Top ShellHeader Portaled Controls */}
      <ShellHeader>
        <div
          data-floating-icon-bar="true"
          className="pointer-events-auto flex items-center h-[46px] p-1 rounded-full liquid-glass-header-pill shrink-0 max-w-full"
        >
          <div className="relative z-10 flex items-center gap-0.5 sm:gap-1 shrink-0 overflow-x-auto no-scrollbar max-w-full">
            {config.tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => changeTab(tab.id)}
                aria-pressed={activeTab === tab.id}
                className={`h-9 px-3.5 rounded-full text-[13px] transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center shrink-0 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                    : "text-muted-foreground font-semibold hover:text-foreground hover:bg-accent"
                }`}
              >
                {tab.label}
              </button>
            ))}

            <span
              aria-hidden="true"
              className="mx-0.5 h-5 w-px rounded-full bg-border/70 shrink-0"
            />

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              title="Tambah Data Baru"
              aria-label="Tambah Data"
              aria-pressed={isAddModalOpen}
              className={`group size-9 rounded-full aspect-square shrink-0 transition-colors cursor-pointer flex items-center justify-center ${
                isAddModalOpen
                  ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Plus size={20} className="shrink-0 transition-transform duration-200 group-hover:rotate-90" />
            </button>
          </div>
        </div>
      </ShellHeader>

      {/* Header Banner - Minimal & Clean */}
      <div className="px-4 sm:px-6 pt-3 pb-2.5 border-b border-border/60 bg-background">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 max-w-7xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-8 rounded-lg bg-muted/70 border border-border/60 flex items-center justify-center text-foreground/80 shrink-0">
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground truncate leading-tight">
                {config.title}
              </h1>
              <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-2xl">
                {config.subtitle}
              </p>
            </div>
          </div>

          {/* Subtle Compact Summary */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground tabular-nums shrink-0">
            <span>{totalCount} total</span>
            <span aria-hidden="true">·</span>
            <span>{activeCount} aktif</span>
            <span aria-hidden="true">·</span>
            <span>{completedCount} selesai</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 space-y-4 max-w-7xl w-full">
        {/* Controls Bar: Tabs & Search Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-muted/60 rounded-lg border border-border/60 overflow-x-auto text-xs">
            {config.tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => changeTab(tab.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-background text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Priority Selector */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg bg-background border border-border text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Prioritas</option>
              <option value="high">Prioritas Tinggi</option>
              <option value="medium">Prioritas Sedang</option>
              <option value="low">Prioritas Rendah</option>
            </select>
          </div>
        </div>

      {/* Main Records List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-card rounded-2xl border border-dashed text-muted-foreground flex flex-col items-center justify-center gap-3">
            <Layers className="size-10 opacity-40 text-muted-foreground" />
            <div className="text-sm font-semibold">Belum ada data pada kriteria ini.</div>
            <p className="text-xs text-muted-foreground max-w-sm">
              Klik &ldquo;Tambah Data Baru&rdquo; untuk memasukkan catatan atau sesuaikan filter pencarian.
            </p>
          </div>
        ) : (
          filteredRecords.map((item) => {
            const isDone = item.status === "completed";
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-4 group hover:shadow-md ${
                  isDone
                    ? "bg-muted/30 border-border/60 opacity-80"
                    : "bg-card border-border hover:border-primary/40"
                }`}
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.category && (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                          {item.category}
                        </span>
                      )}
                      {item.priority && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.priority === "high"
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              : item.priority === "medium"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {item.priority === "high"
                            ? "Tinggi"
                            : item.priority === "medium"
                            ? "Sedang"
                            : "Rendah"}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleStatus(item.id)}
                      className="cursor-pointer shrink-0 text-muted-foreground hover:text-primary transition-colors"
                      title={isDone ? "Tandai Belum Selesai" : "Tandai Selesai"}
                    >
                      {isDone ? (
                        <CheckCircle2 className="size-5 text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <Circle className="size-5 hover:scale-110 transition-transform" />
                      )}
                    </button>
                  </div>

                  <div>
                    <h3
                      className={`text-base font-bold text-foreground leading-snug ${
                        isDone ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Metadata Chips */}
                  {item.meta && Object.keys(item.meta).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-border/40">
                      {Object.entries(item.meta).map(([k, val]) => {
                        const metaField = config.fieldLabels.extraMeta?.find((f) => f.key === k);
                        const labelName = metaField?.label || k;
                        return (
                          <div
                            key={k}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground flex items-center gap-1 font-medium"
                          >
                            <span className="opacity-75">{labelName}:</span>
                            <span className="text-foreground font-semibold">{String(val)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <span>{item.date || "Tidak ada tanggal"}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteRecord(item.id)}
                    className="p-1 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Hapus Data"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      </div>

      {/* Add New Record Expand Popover */}
      <ExpandPopoverModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Entri Baru"
        subtitle={config.title}
        icon={<Plus size={15} strokeWidth={2.3} />}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              form="standalone-add-record-form"
              className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-xs"
            >
              Simpan Entri
            </button>
          </div>
        }
      >
        <form
          id="standalone-add-record-form"
          onSubmit={handleCreateRecord}
          className="flex flex-col gap-3"
        >
          {/* Title */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              {config.fieldLabels.title} *
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder={`Masukkan ${config.fieldLabels.title}...`}
              className="w-full px-3 py-2 text-xs rounded-2xl bg-neutral-50 dark:bg-zinc-800/80 border border-neutral-200/80 dark:border-zinc-700/70 text-foreground placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 focus:outline-none"
            />
          </div>

          {/* Subtitle */}
          {config.fieldLabels.subtitle && (
            <div>
              <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                {config.fieldLabels.subtitle}
              </label>
              <input
                type="text"
                value={formSubtitle}
                onChange={(e) => setFormSubtitle(e.target.value)}
                placeholder="Masukkan rincian / deskripsi..."
                className="w-full px-3 py-2 text-xs rounded-2xl bg-neutral-50 dark:bg-zinc-800/80 border border-neutral-200/80 dark:border-zinc-700/70 text-foreground placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 focus:outline-none"
              />
            </div>
          )}

          {/* Category & Date Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1 truncate">
                {config.fieldLabels.category || "Kategori"}
              </label>
              <input
                type="text"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="Operasional / Utama"
                className="w-full px-3 py-2 text-xs rounded-2xl bg-neutral-50 dark:bg-zinc-800/80 border border-neutral-200/80 dark:border-zinc-700/70 text-foreground placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1 truncate">
                {config.fieldLabels.date || "Tanggal"}
              </label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-2xl bg-neutral-50 dark:bg-zinc-800/80 border border-neutral-200/80 dark:border-zinc-700/70 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Tingkat Prioritas
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-neutral-100/80 dark:bg-zinc-800/70 border border-neutral-200/70 dark:border-zinc-700/60">
              {(["low", "medium", "high"] as const).map((pri) => (
                <button
                  key={pri}
                  type="button"
                  onClick={() => setFormPriority(pri)}
                  className={`py-1.5 text-[11px] font-semibold rounded-xl cursor-pointer transition-all ${
                    formPriority === pri
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-neutral-600 dark:text-neutral-300 hover:bg-white/70 dark:hover:bg-zinc-700/60"
                  }`}
                >
                  {pri === "high" ? "Tinggi" : pri === "medium" ? "Sedang" : "Rendah"}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Extra Meta Fields */}
          {config.fieldLabels.extraMeta && config.fieldLabels.extraMeta.length > 0 && (
            <div className="pt-2.5 border-t border-neutral-200/70 dark:border-zinc-800 flex flex-col gap-2.5">
              <span className="text-[10.5px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Informasi Spesifik
              </span>
              {config.fieldLabels.extraMeta.map((extra) => (
                <div key={extra.key}>
                  <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {extra.label}
                  </label>
                  <input
                    type={extra.type || "text"}
                    value={formMeta[extra.key] || ""}
                    onChange={(e) =>
                      setFormMeta({ ...formMeta, [extra.key]: e.target.value })
                    }
                    placeholder={extra.placeholder}
                    className="w-full px-3 py-2 text-xs rounded-2xl bg-neutral-50 dark:bg-zinc-800/80 border border-neutral-200/80 dark:border-zinc-700/70 text-foreground placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}
        </form>
      </ExpandPopoverModal>
    </div>
  );
}
