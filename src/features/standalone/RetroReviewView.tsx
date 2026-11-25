import * as React from "react";
import {
  Archive,
  CalendarDays,
  CheckCircle2,
  Circle,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { ExpandPopoverModal } from "@/components/ui/ExpandPopoverModal";
import type { StandaloneRecord } from "./standaloneAppsData";

const STORAGE_KEY = "aio_standalone_retro";

type ReviewTab = "all" | "active" | "completed";
type ReviewPriority = "low" | "medium" | "high";

function isStandaloneRecord(value: unknown): value is StandaloneRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<StandaloneRecord>;
  return typeof record.id === "string" && typeof record.title === "string";
}

function parseRecords(raw: string | null): StandaloneRecord[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStandaloneRecord);
  } catch {
    return [];
  }
}

function readLocalRecords(): StandaloneRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const records = parseRecords(raw);
    // Drop malformed rows only; IDs alone are not sufficient proof that a row is demo data.
    if (raw && records.length !== JSON.parse(raw).length) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
    return records;
  } catch {
    return [];
  }
}

function getTodayLocal(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value?: string): string {
  if (!value) return "Tanggal belum diisi";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function isThisMonth(value?: string): boolean {
  if (!value) return false;
  const date = new Date(`${value}T00:00:00`);
  const now = new Date();
  return !Number.isNaN(date.getTime()) &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
}

function isArchived(record: StandaloneRecord): boolean {
  return record.status === "completed" || record.status === "archived";
}

function priorityLabel(priority?: string): string {
  if (priority === "high") return "Tinggi";
  if (priority === "low") return "Rendah";
  return "Sedang";
}

function priorityClasses(priority?: string): string {
  if (priority === "high") return "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20";
  if (priority === "low") return "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20";
  return "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20";
}

export function RetroReviewView() {
  const [records, setRecords] = React.useState<StandaloneRecord[]>(readLocalRecords);
  const [activeTab, setActiveTab] = React.useState<ReviewTab>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPriority, setSelectedPriority] = React.useState<"all" | ReviewPriority>("all");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingRecordId, setEditingRecordId] = React.useState<string | null>(null);
  const [storageWarning, setStorageWarning] = React.useState(false);

  const [formTitle, setFormTitle] = React.useState("");
  const [formPeriod, setFormPeriod] = React.useState("");
  const [formCategory, setFormCategory] = React.useState("");
  const [formDate, setFormDate] = React.useState(getTodayLocal);
  const [formPriority, setFormPriority] = React.useState<ReviewPriority>("medium");
  const [formScore, setFormScore] = React.useState("");
  const [formActionItem, setFormActionItem] = React.useState("");

  const searchStr = useRouterState({ select: (state) => state.location.searchStr });

  React.useEffect(() => {
    const params = new URLSearchParams(searchStr || "");
    const tab = params.get("tab");
    if (tab === "all" || tab === "active" || tab === "completed") {
      setActiveTab(tab);
    }
  }, [searchStr]);

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setRecords(parseRecords(event.newValue));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const saveRecords = (nextRecords: StandaloneRecord[]) => {
    setRecords(nextRecords);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
  };

  const changeTab = (tab: ReviewTab) => {
    setActiveTab(tab);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(window.history.state, "", url.toString());
    } catch {
      // The selected tab still works when URL updates are unavailable.
    }
  };

  const resetForm = () => {
    setEditingRecordId(null);
    setFormTitle("");
    setFormPeriod("");
    setFormCategory("");
    setFormDate(getTodayLocal());
    setFormPriority("medium");
    setFormScore("");
    setFormActionItem("");
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (record: StandaloneRecord) => {
    setEditingRecordId(record.id);
    setFormTitle(record.title);
    setFormPeriod(record.subtitle || "");
    setFormCategory(record.category || "");
    setFormDate(record.date || getTodayLocal());
    setFormPriority((record.priority as ReviewPriority) || "medium");
    setFormScore(record.meta?.score === undefined ? "" : String(record.meta.score));
    setFormActionItem(record.meta?.actionItem === undefined ? "" : String(record.meta.actionItem));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = formTitle.trim();
    if (!title || !formDate) return;

    const existing = editingRecordId ? records.find((record) => record.id === editingRecordId) : undefined;
    const meta: Record<string, string> = {};
    if (formScore.trim()) meta.score = formScore.trim();
    if (formActionItem.trim()) meta.actionItem = formActionItem.trim();

    const nextRecord: StandaloneRecord = {
      ...existing,
      id: existing?.id || `retro-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      subtitle: formPeriod.trim() || undefined,
      category: formCategory.trim() || undefined,
      date: formDate,
      priority: formPriority,
      status: existing?.status || "active",
      meta: Object.keys(meta).length ? meta : undefined,
    };

    if (editingRecordId) {
      saveRecords(records.map((record) => record.id === editingRecordId ? nextRecord : record));
    } else {
      saveRecords([nextRecord, ...records]);
    }
    closeForm();
  };

  const toggleArchive = (recordId: string) => {
    saveRecords(records.map((record) => {
      if (record.id !== recordId) return record;
      return { ...record, status: isArchived(record) ? "active" : "completed" };
    }));
  };

  const deleteRecord = (recordId: string) => {
    const target = records.find((record) => record.id === recordId);
    if (!target || !window.confirm(`Hapus review “${target.title}”?`)) return;
    saveRecords(records.filter((record) => record.id !== recordId));
  };

  const currentMonthCount = records.filter((record) => isThisMonth(record.date)).length;
  const archivedCount = records.filter(isArchived).length;
  const filteredRecords = records
    .filter((record) => {
      if (activeTab === "active" && !isThisMonth(record.date)) return false;
      if (activeTab === "completed" && !isArchived(record)) return false;
      if (selectedPriority !== "all" && record.priority !== selectedPriority) return false;

      const query = searchQuery.trim().toLocaleLowerCase("id-ID");
      if (query) {
        const searchable = [
          record.title,
          record.subtitle,
          record.category,
          ...Object.values(record.meta || {}).map(String),
        ].filter(Boolean).join(" ").toLocaleLowerCase("id-ID");
        if (!searchable.includes(query)) return false;
      }
      return true;
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const isFiltered = Boolean(searchQuery.trim()) || selectedPriority !== "all" || activeTab !== "all";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 px-5 py-6 xl:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50 text-foreground">
            <RefreshCw className="size-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Review &amp; Retrospective</h1>
            <p className="mt-1 text-sm text-muted-foreground">Catat evaluasi, hasil refleksi, dan tindak lanjut Anda.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{records.length} review</span>
          <span aria-hidden="true">·</span>
          <span>{currentMonthCount} bulan ini</span>
          <span aria-hidden="true">·</span>
          <span>{archivedCount} diarsipkan</span>
        </div>
      </header>

      <section aria-label="Filter dan pencarian review" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-sm">
        <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1" role="tablist" aria-label="Periode review">
          {([
            { id: "all", label: "Semua Review" },
            { id: "active", label: "Bulan Ini" },
            { id: "completed", label: "Terarsip" },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => changeTab(tab.id)}
              className={`rounded-lg px-3.5 py-2 text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-background font-semibold text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="relative block w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <span className="sr-only">Cari review</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari review..."
              className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <label>
            <span className="sr-only">Filter prioritas</span>
            <select
              value={selectedPriority}
              onChange={(event) => setSelectedPriority(event.target.value as "all" | ReviewPriority)}
              className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            >
              <option value="all">Semua Prioritas</option>
              <option value="high">Prioritas Tinggi</option>
              <option value="medium">Prioritas Sedang</option>
              <option value="low">Prioritas Rendah</option>
            </select>
          </label>
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Plus className="size-4" />
            Tambah Review
          </button>
        </div>
      </section>

      {storageWarning && (
        <p role="alert" className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          Perubahan tampil di halaman ini, tetapi browser tidak dapat menyimpannya. Periksa pengaturan penyimpanan browser Anda.
        </p>
      )}

      {filteredRecords.length === 0 ? (
        <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {isFiltered ? <Search className="size-6" /> : <RefreshCw className="size-6" />}
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            {isFiltered ? "Tidak ada review yang cocok" : "Belum ada review"}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {isFiltered
              ? "Coba ubah kata pencarian atau filter. Review yang Anda buat akan muncul di sini."
              : "Mulai dengan mencatat evaluasi pertama. Data yang Anda masukkan disimpan di browser ini."}
          </p>
          {isFiltered ? (
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setSelectedPriority("all"); changeTab("all"); }}
              className="mt-5 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Hapus filter
            </button>
          ) : (
            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Buat review pertama
            </button>
          )}
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredRecords.map((record) => {
            const archived = isArchived(record);
            const score = record.meta?.score;
            const actionItem = record.meta?.actionItem;
            return (
              <article
                key={record.id}
                className={`flex min-h-56 flex-col justify-between rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md ${
                  archived ? "border-border/60 bg-muted/20" : "border-border/80"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {record.category && (
                        <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground">{record.category}</span>
                      )}
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${priorityClasses(record.priority)}`}>
                        {priorityLabel(record.priority)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleArchive(record.id)}
                      aria-label={archived ? "Pulihkan review" : "Arsipkan review"}
                      aria-pressed={archived}
                      title={archived ? "Pulihkan review" : "Arsipkan review"}
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        archived ? "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {archived ? <CheckCircle2 className="size-5" /> : <Circle className="size-5" />}
                    </button>
                  </div>

                  <h2 className={`mt-3 text-base font-semibold leading-6 ${archived ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {record.title}
                  </h2>
                  {record.subtitle && <p className="mt-1 text-sm text-muted-foreground">{record.subtitle}</p>}

                  {(score !== undefined || actionItem) && (
                    <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-sm">
                      {score !== undefined && (
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">Skor kepuasan</span>
                          <span className="font-semibold tabular-nums text-foreground">{score}/10</span>
                        </div>
                      )}
                      {actionItem && (
                        <div className="flex items-start justify-between gap-3">
                          <span className="shrink-0 text-muted-foreground">Tindak lanjut</span>
                          <span className="text-right font-medium text-foreground">{actionItem}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4" />
                    <time dateTime={record.date}>{formatDate(record.date)}</time>
                    {archived && <span className="rounded-full bg-muted px-2 py-0.5 text-xs">Diarsipkan</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditForm(record)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Edit3 className="size-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRecord(record.id)}
                      aria-label={`Hapus ${record.title}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                    >
                      <Trash2 className="size-3.5" />
                      Hapus
                    </button>
                  </div>
                </footer>
              </article>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 py-1 text-xs text-muted-foreground">
        <Archive className="size-3.5" />
        <span>Data tersimpan di browser/perangkat ini dan belum tersinkron ke server.</span>
      </div>

      <ExpandPopoverModal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editingRecordId ? "Edit review" : "Buat review baru"}
        subtitle="Isi catatan yang ingin Anda simpan."
        icon={<RefreshCw size={16} />}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              Batal
            </button>
            <button
              type="submit"
              form="retro-review-form"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              {editingRecordId ? "Simpan perubahan" : "Simpan review"}
            </button>
          </div>
        }
      >
        <form id="retro-review-form" onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="retro-title" className="mb-1.5 block text-sm font-medium text-foreground">Judul review <span className="text-rose-600">*</span></label>
            <input
              id="retro-title"
              autoFocus
              required
              maxLength={120}
              value={formTitle}
              onChange={(event) => setFormTitle(event.target.value)}
              placeholder="Contoh: Evaluasi proyek bulan ini"
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="retro-category" className="mb-1.5 block text-sm font-medium text-foreground">Fokus area</label>
              <input
                id="retro-category"
                maxLength={60}
                value={formCategory}
                onChange={(event) => setFormCategory(event.target.value)}
                placeholder="Karier, personal, bisnis..."
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div>
              <label htmlFor="retro-date" className="mb-1.5 block text-sm font-medium text-foreground">Tanggal review <span className="text-rose-600">*</span></label>
              <input
                id="retro-date"
                type="date"
                required
                value={formDate}
                onChange={(event) => setFormDate(event.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </div>

          <div>
            <label htmlFor="retro-period" className="mb-1.5 block text-sm font-medium text-foreground">Periode atau ringkasan</label>
            <input
              id="retro-period"
              maxLength={160}
              value={formPeriod}
              onChange={(event) => setFormPeriod(event.target.value)}
              placeholder="Contoh: Review mingguan, sprint, atau kuartal"
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="retro-score" className="mb-1.5 block text-sm font-medium text-foreground">Skor kepuasan (1–10)</label>
              <input
                id="retro-score"
                type="number"
                min="1"
                max="10"
                step="0.1"
                value={formScore}
                onChange={(event) => setFormScore(event.target.value)}
                placeholder="Misal: 8"
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div>
              <label htmlFor="retro-priority" className="mb-1.5 block text-sm font-medium text-foreground">Prioritas tindak lanjut</label>
              <select
                id="retro-priority"
                value={formPriority}
                onChange={(event) => setFormPriority(event.target.value as ReviewPriority)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="retro-action" className="mb-1.5 block text-sm font-medium text-foreground">Tindak lanjut utama</label>
            <textarea
              id="retro-action"
              rows={3}
              maxLength={400}
              value={formActionItem}
              onChange={(event) => setFormActionItem(event.target.value)}
              placeholder="Apa satu hal konkret yang ingin dilakukan berikutnya?"
              className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </form>
      </ExpandPopoverModal>
    </div>
  );
}
