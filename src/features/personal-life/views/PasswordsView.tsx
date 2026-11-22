import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Key,
  Plus,
  Search,
  Eye,
  EyeOff,
  Copy,
  Check,
  Star,
  Trash2,
  Edit3,
  ShieldCheck,
  ShieldAlert,
  Lock,
  RefreshCw,
  Sparkles,
  Download,
  Upload,
  X,
  Globe,
} from "lucide-react";
import { ShellHeader } from "@/app/shell-header";
import { ExpandPopoverModal } from "@/components/ui/ExpandPopoverModal";

export type PasswordItem = {
  id: string;
  title: string;
  category: "Finansial / Perbankan" | "Email & Akun Kerja" | "Server & Cloud" | "Media Sosial" | "Klien & Portal" | "Lainnya";
  username: string;
  password: string;
  url?: string;
  notes?: string;
  isFavorite: boolean;
  tags: string[];
  updatedAt: string;
};

const CATEGORIES = [
  "Semua",
  "Finansial / Perbankan",
  "Email & Akun Kerja",
  "Server & Cloud",
  "Media Sosial",
  "Klien & Portal",
  "Lainnya",
] as const;

const INITIAL_PASSWORDS: PasswordItem[] = [
  {
    id: "pwd-1",
    title: "KlikBCA Bisnis Corporate",
    category: "Finansial / Perbankan",
    username: "CORP_DIGITAL_01",
    password: "Bca#Secure2026!Str",
    url: "https://klikbca.com",
    notes: "Gunakan token key BCA untuk otorisasi transfer batch payroll setiap tanggal 25.",
    isFavorite: true,
    tags: ["Prioritas", "Banking"],
    updatedAt: "2026-03-01",
  },
  {
    id: "pwd-2",
    title: "Google Workspace Superadmin",
    category: "Email & Akun Kerja",
    username: "admin@perusahaan.co.id",
    password: "GSuite$Enterprise99#",
    url: "https://admin.google.com",
    notes: "Pengelolaan user email konsultan, shared drive tim, dan lisensi Google Meet.",
    isFavorite: true,
    tags: ["Admin", "2FA"],
    updatedAt: "2026-02-15",
  },
  {
    id: "pwd-3",
    title: "Cloud Infrastructure & Database Console",
    category: "Server & Cloud",
    username: "ops-cloud@devteam.id",
    password: "K8s-CloudCluster*2026",
    url: "https://console.cloud.google.com",
    notes: "Akses cluster staging dan production database PostgreSQL Cloud SQL.",
    isFavorite: false,
    tags: ["DevOps", "Production"],
    updatedAt: "2026-03-10",
  },
  {
    id: "pwd-4",
    title: "GitHub Corporate Organization",
    category: "Server & Cloud",
    username: "lead-architect",
    password: "GhP_99xSecureCodeRepo#",
    url: "https://github.com",
    notes: "Personal access token dengan hak akses repo privat dan CI/CD deployment action.",
    isFavorite: true,
    tags: ["Code", "Dev"],
    updatedAt: "2026-02-28",
  },
  {
    id: "pwd-5",
    title: "Portal Klien Enterprise Hub",
    category: "Klien & Portal",
    username: "consultant.lead@clientportal.com",
    password: "ClientHub2026@Pass!",
    url: "https://portal.clientos.internal",
    notes: "Akses verifikasi laporan bulanan dan modul tanda tangan dokumen kontrak klien.",
    isFavorite: false,
    tags: ["ClientOS"],
    updatedAt: "2026-03-05",
  },
];

const STORAGE_KEY = "wira_passwords_vault_v2";

// Password strength evaluator
function evaluatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
  textColor: string;
} {
  if (!password) return { score: 0, label: "Kosong", color: "bg-muted", textColor: "text-muted-foreground" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score, label: "Rentan / Lemah", color: "bg-rose-500", textColor: "text-rose-600 dark:text-rose-400" };
  if (score <= 3) return { score, label: "Sedang", color: "bg-amber-500", textColor: "text-amber-600 dark:text-amber-400" };
  if (score === 4) return { score, label: "Kuat", color: "bg-blue-500", textColor: "text-blue-600 dark:text-blue-400" };
  return { score, label: "Sangat Kuat", color: "bg-emerald-500", textColor: "text-emerald-600 dark:text-emerald-400" };
}

// Password Generator helper
function generateRandomPassword(length: number, useUpper: boolean, useLower: boolean, useNumbers: boolean, useSymbols: boolean): string {
  let charset = "";
  if (useUpper) charset += "ABCDEFGHJKLMNPQRSTUVWXYZ";
  if (useLower) charset += "abcdefghijkmnpqrstuvwxyz";
  if (useNumbers) charset += "23456789";
  if (useSymbols) charset += "!@#$%^&*()_+~|}{[]:;?><=";
  if (!charset) charset = "abcdefghijklmnopqrstuvwxyz";

  let result = "";
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length];
  }
  return result;
}

export function PasswordsView() {
  const [passwords, setPasswords] = useState<PasswordItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PASSWORDS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [pinInput, setPinInput] = useState("");

  // Visible password tracking per id
  const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPassword, setEditingPassword] = useState<PasswordItem | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(passwords));
    } catch {
      // ignore
    }
  }, [passwords]);

  const toggleVisible = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVisibleMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, keyName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPasswords((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Hapus entri kata sandi ini dari brankas?")) {
      setPasswords((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSavePassword = (data: Omit<PasswordItem, "id" | "updatedAt">) => {
    if (editingPassword) {
      setPasswords((prev) =>
        prev.map((p) =>
          p.id === editingPassword.id
            ? { ...p, ...data, updatedAt: new Date().toISOString().slice(0, 10) }
            : p
        )
      );
    } else {
      const newEntry: PasswordItem = {
        ...data,
        id: `pwd-${Date.now()}`,
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      setPasswords((prev) => [newEntry, ...prev]);
    }
    setIsModalOpen(false);
    setEditingPassword(null);
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return passwords.filter((item) => {
      if (onlyFavorites && !item.isFavorite) return false;
      if (selectedCategory !== "Semua" && item.category !== selectedCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.username.toLowerCase().includes(q) ||
        (item.url && item.url.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q)) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [passwords, onlyFavorites, selectedCategory, searchQuery]);

  // Security audit overview
  const audit = useMemo(() => {
    const total = passwords.length;
    const strongCount = passwords.filter((p) => evaluatePasswordStrength(p.password).score >= 4).length;
    const weakCount = passwords.filter((p) => evaluatePasswordStrength(p.password).score <= 2).length;
    const favorites = passwords.filter((p) => p.isFavorite).length;
    return { total, strongCount, weakCount, favorites };
  }, [passwords]);

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(passwords, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `brankas_password_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (Array.isArray(parsed)) {
          setPasswords(parsed);
          alert(`Berhasil mengimpor ${parsed.length} akun password!`);
        }
      } catch {
        alert("File tidak valid.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  if (isLocked) {
    return (
      <div className="w-full max-w-md mx-auto my-12 p-8 bg-card border border-border rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
          <Lock size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Brankas Terkunci</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Masukkan PIN atau klik Buka Kunci untuk melihat kredensial Anda.
          </p>
        </div>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="PIN Brankas (default: bebas)"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full px-4 py-2.5 text-center text-base tracking-widest bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => {
              setIsLocked(false);
              setPinInput("");
            }}
            className="w-full py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md"
          >
            Buka Kunci Brankas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-5">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importJSON}
        className="hidden"
      />

      {/* Top-Right Floating Pill Header Actions */}
      <ShellHeader>
        <div
          data-floating-icon-bar="true"
          className="pointer-events-auto flex items-center h-[46px] p-1 rounded-full liquid-glass-header-pill shrink-0"
        >
          <div className="relative z-10 flex items-center gap-0.5 sm:gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setIsGeneratorOpen(true)}
              title="Generator Sandi"
              aria-label="Generator Sandi"
              aria-pressed={isGeneratorOpen}
              className={`group size-9 rounded-full aspect-square shrink-0 transition-colors cursor-pointer flex items-center justify-center ${
                isGeneratorOpen
                  ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Sparkles size={20} className="shrink-0 transition-transform duration-200" />
            </button>

            <button
              type="button"
              onClick={() => setIsLocked(true)}
              title="Kunci Layar Brankas"
              aria-label="Kunci"
              className="group size-9 rounded-full aspect-square shrink-0 transition-colors cursor-pointer flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Lock size={20} className="shrink-0 transition-transform duration-200" />
            </button>

            <span
              aria-hidden="true"
              className="mx-0.5 h-5 w-px rounded-full bg-border/70 shrink-0"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Impor JSON"
              aria-label="Impor"
              className="group size-9 rounded-full aspect-square shrink-0 transition-colors cursor-pointer flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Upload size={20} className="shrink-0 transition-transform duration-200" />
            </button>

            <button
              type="button"
              onClick={exportJSON}
              title="Ekspor JSON"
              aria-label="Ekspor"
              className="group size-9 rounded-full aspect-square shrink-0 transition-colors cursor-pointer flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Download size={20} className="shrink-0 transition-transform duration-200" />
            </button>

            <span
              aria-hidden="true"
              className="mx-0.5 h-5 w-px rounded-full bg-border/70 shrink-0"
            />

            <button
              type="button"
              onClick={() => {
                setEditingPassword(null);
                setIsModalOpen(true);
              }}
              title="Tambah Kredensial"
              aria-label="Tambah Kredensial"
              aria-pressed={isModalOpen}
              className={`group size-9 rounded-full aspect-square shrink-0 transition-colors cursor-pointer flex items-center justify-center ${
                isModalOpen
                  ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Plus size={20} className="shrink-0 transition-transform duration-200 group-hover:rotate-90" />
            </button>
          </div>
        </div>
      </ShellHeader>

      {/* Top Header - Minimal & Clean */}
      <div className="pb-3 border-b border-border/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-8 rounded-lg bg-muted/70 border border-border/60 flex items-center justify-center text-foreground/80 shrink-0">
            <Key className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground truncate leading-tight">
                Brankas Kata Sandi & Secrets
              </h1>
              <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                · {passwords.length} kredensial
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-2xl">
              Penyimpanan kredensial aman, audit kekuatan sandi, dan generator sandi acak.
            </p>
          </div>
        </div>
      </div>

      {/* Security Health & Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Key size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Akun</p>
            <p className="text-lg font-bold text-foreground">{audit.total}</p>
          </div>
        </div>

        <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Sandi Sangat Kuat</p>
            <p className="text-lg font-bold text-foreground">{audit.strongCount}</p>
          </div>
        </div>

        <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Perlu Diperkuat</p>
            <p className="text-lg font-bold text-foreground">{audit.weakCount}</p>
          </div>
        </div>

        <div className="bg-card border border-border p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Star size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Favorit / Disematkan</p>
            <p className="text-lg font-bold text-foreground">{audit.favorites}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama akun, username, url domain, atau tag..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={() => setOnlyFavorites((prev) => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border shrink-0 ${
              onlyFavorites
                ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                : "bg-background text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            <Star size={14} className={onlyFavorites ? "fill-white" : ""} />
            <span>Favorit Saja</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-muted-foreground font-medium mr-1 shrink-0">Kategori:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors border ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-muted-foreground border-border hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Password Vault List */}
      {filteredEntries.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center bg-card/40 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <Key size={28} />
          </div>
          <h3 className="text-lg font-bold text-foreground">Tidak Ada Kata Sandi Ditemukan</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1 mb-6">
            {searchQuery || selectedCategory !== "Semua" || onlyFavorites
              ? "Coba sesuaikan kata kunci pencarian atau filter kategori Anda."
              : "Amankan akun, PIN, dan kata sandi Anda di dalam brankas lokal."}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Semua");
              setOnlyFavorites(false);
              setEditingPassword(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm"
          >
            Tambah Kredensial Baru
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((item) => {
            const isVisible = !!visibleMap[item.id];
            const strength = evaluatePasswordStrength(item.password);

            return (
              <div
                key={item.id}
                className="bg-card border border-border hover:border-primary/40 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Title, Category & Fav */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-base text-foreground leading-snug">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-muted-foreground border border-border">
                          {item.category}
                        </span>
                        {item.url && (
                          <a
                            href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-primary hover:underline flex items-center gap-0.5 font-medium"
                          >
                            <Globe size={11} /> {item.url.replace(/^https?:\/\//, "").split("/")[0]}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-muted transition-colors"
                        title={item.isFavorite ? "Hapus favorit" : "Tandai favorit"}
                      >
                        <Star
                          size={16}
                          className={item.isFavorite ? "fill-amber-400 text-amber-400" : ""}
                        />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPassword(item);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Username Field */}
                  <div className="space-y-2 bg-muted/30 p-3.5 rounded-2xl border border-border mb-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground font-medium shrink-0">Username / Email:</span>
                      <div className="flex items-center gap-1.5 font-mono text-foreground font-semibold truncate">
                        <span>{item.username}</span>
                        <button
                          onClick={(e) => copyToClipboard(item.username, `user-${item.id}`, e)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Salin Username"
                        >
                          {copiedKey === `user-${item.id}` ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                      <span className="text-muted-foreground font-medium shrink-0">Password:</span>
                      <div className="flex items-center gap-1.5 font-mono text-foreground font-semibold">
                        <span className={isVisible ? "text-foreground" : "tracking-wider text-muted-foreground"}>
                          {isVisible ? item.password : "••••••••••••"}
                        </span>
                        <button
                          onClick={(e) => toggleVisible(item.id, e)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title={isVisible ? "Sembunyikan" : "Tampilkan Sandi"}
                        >
                          {isVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button
                          onClick={(e) => copyToClipboard(item.password, `pass-${item.id}`, e)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Salin Kata Sandi"
                        >
                          {copiedKey === `pass-${item.id}` ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notes / Tags if available */}
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                {/* Card Footer: Strength Indicator */}
                <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-medium">Kekuatan:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div
                          key={s}
                          className={`w-3.5 h-1.5 rounded-full ${
                            s <= strength.score ? strength.color : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`font-semibold ${strength.textColor}`}>{strength.label}</span>
                  </div>

                  <span className="text-muted-foreground">Diperbarui: {item.updatedAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Password Generator Modal */}
      {isGeneratorOpen && (
        <PasswordGeneratorModal
          onClose={() => setIsGeneratorOpen(false)}
          onUsePassword={(pwd) => {
            setIsGeneratorOpen(false);
            setEditingPassword(null);
            setIsModalOpen(true);
          }}
        />
      )}

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <PasswordFormModal
          initialData={editingPassword}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPassword(null);
          }}
          onSave={handleSavePassword}
        />
      )}
    </div>
  );
}

function PasswordGeneratorModal({
  onClose,
  onUsePassword,
}: {
  onClose: () => void;
  onUsePassword: (pwd: string) => void;
}) {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const pwd = generateRandomPassword(length, useUpper, useLower, useNumbers, useSymbols);
    setGeneratedPassword(pwd);
  };

  useEffect(() => {
    generate();
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  const copy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = evaluatePasswordStrength(generatedPassword);

  return (
    <ExpandPopoverModal
      isOpen={true}
      onClose={onClose}
      title="Generator Kata Sandi Acak"
      subtitle="Buat password entropi tinggi yang aman."
      icon={<Sparkles size={15} className="text-amber-500" />}
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => onUsePassword(generatedPassword)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-xs cursor-pointer"
          >
            Gunakan Sandi Ini
          </button>
        </div>
      }
    >
      <div className="space-y-3.5">
        {/* Display screen */}
        <div className="p-3 bg-neutral-50 dark:bg-zinc-800/80 border border-neutral-200/80 dark:border-zinc-700/70 rounded-2xl space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-foreground break-all select-all">
              {generatedPassword}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={generate}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-neutral-200/70 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                title="Acak Ulang"
              >
                <RefreshCw size={14} />
              </button>
              <button
                type="button"
                onClick={copy}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-neutral-200/70 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                title="Salin Sandi"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-neutral-200/70 dark:border-zinc-700/60">
            <span className="text-muted-foreground">Kekuatan: {strength.label}</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`w-3.5 h-1.5 rounded-full ${s <= strength.score ? strength.color : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Length slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
            <span>Panjang Karakter</span>
            <span>{length} Karakter</span>
          </div>
          <input
            type="range"
            min={8}
            max={36}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Character options */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center gap-2 px-2.5 py-2 bg-neutral-50 dark:bg-zinc-800/70 border border-neutral-200/70 dark:border-zinc-700/60 rounded-2xl cursor-pointer">
            <input
              type="checkbox"
              checked={useUpper}
              onChange={(e) => setUseUpper(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span>Huruf Besar (A-Z)</span>
          </label>
          <label className="flex items-center gap-2 px-2.5 py-2 bg-neutral-50 dark:bg-zinc-800/70 border border-neutral-200/70 dark:border-zinc-700/60 rounded-2xl cursor-pointer">
            <input
              type="checkbox"
              checked={useLower}
              onChange={(e) => setUseLower(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span>Huruf Kecil (a-z)</span>
          </label>
          <label className="flex items-center gap-2 px-2.5 py-2 bg-neutral-50 dark:bg-zinc-800/70 border border-neutral-200/70 dark:border-zinc-700/60 rounded-2xl cursor-pointer">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span>Angka (0-9)</span>
          </label>
          <label className="flex items-center gap-2 px-2.5 py-2 bg-neutral-50 dark:bg-zinc-800/70 border border-neutral-200/70 dark:border-zinc-700/60 rounded-2xl cursor-pointer">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span>Simbol (!@#$%)</span>
          </label>
        </div>
      </div>
    </ExpandPopoverModal>
  );
}

function PasswordFormModal({
  initialData,
  onClose,
  onSave,
}: {
  initialData: PasswordItem | null;
  onClose: () => void;
  onSave: (data: Omit<PasswordItem, "id" | "updatedAt">) => void;
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState<PasswordItem["category"]>(initialData?.category || "Finansial / Perbankan");
  const [username, setUsername] = useState(initialData?.username || "");
  const [password, setPassword] = useState(initialData?.password || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite || false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGenerate = () => {
    const gen = generateRandomPassword(16, true, true, true, true);
    setPassword(gen);
    setShowPassword(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !username.trim() || !password.trim()) {
      alert("Nama akun, username, dan password wajib diisi.");
      return;
    }

    onSave({
      title: title.trim(),
      category,
      username: username.trim(),
      password: password.trim(),
      url: url.trim(),
      notes: notes.trim(),
      isFavorite,
      tags: [category.split("/")[0].trim()],
    });
  };

  const strength = evaluatePasswordStrength(password);

  return (
    <ExpandPopoverModal
      isOpen={true}
      onClose={onClose}
      title={initialData ? "Edit Kredensial" : "Tambah Kredensial Sandi"}
      subtitle="Simpan login atau kunci API di brankas lokal."
      icon={<Key size={15} strokeWidth={2.2} />}
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            form="password-credential-form"
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-colors shadow-xs cursor-pointer"
          >
            Simpan Kredensial
          </button>
        </div>
      }
    >
      <form id="password-credential-form" onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">Nama Layanan / Akun *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Mandiri Cash Management, AWS Production"
            className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-zinc-800/80 border border-neutral-200/80 dark:border-zinc-700/70 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">Kategori Akun</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PasswordItem["category"])}
              className="w-full px-2.5 py-2 text-xs bg-neutral-50 dark:bg-zinc-800/80 border border-neutral-200/80 dark:border-zinc-700/70 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none"
            >
              <option value="Finansial / Perbankan">Finansial / Perbankan</option>
              <option value="Email & Akun Kerja">Email & Akun Kerja</option>
              <option value="Server & Cloud">Server & Cloud</option>
              <option value="Media Sosial">Media Sosial</option>
              <option value="Klien & Portal">Klien & Portal</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">Website / URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-zinc-800/80 border border-neutral-200/80 dark:border-zinc-700/70 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">Username / ID / Email *</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin@perusahaan.com atau user ID"
            className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-zinc-800/80 border border-neutral-200/80 dark:border-zinc-700/70 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none"
          />
        </div>

        {/* Password with generator button */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">Kata Sandi (Password) *</label>
            <button
              type="button"
              onClick={handleGenerate}
              className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles size={11} className="text-amber-500" /> Generate Sandi Acak
            </button>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi..."
              className="w-full pl-3 pr-9 py-2 text-xs font-mono bg-neutral-50 dark:bg-zinc-800/80 border border-neutral-200/80 dark:border-zinc-700/70 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Strength meter bar */}
          {password && (
            <div className="pt-1 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`w-4 h-1 rounded-full ${s <= strength.score ? strength.color : "bg-muted"}`}
                  />
                ))}
              </div>
              <span className={`text-[10.5px] font-semibold ${strength.textColor}`}>{strength.label}</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">Catatan / Kunci Pemulihan / Hint</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Instruksi login, 2FA backup codes, atau catatan penting..."
            className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-zinc-800/80 border border-neutral-200/80 dark:border-zinc-700/70 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none resize-none"
          />
        </div>

        <label
          htmlFor="isFavPass"
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-neutral-50 dark:bg-zinc-800/70 border border-neutral-200/70 dark:border-zinc-700/60 text-xs font-medium text-foreground cursor-pointer"
        >
          <input
            type="checkbox"
            id="isFavPass"
            checked={isFavorite}
            onChange={(e) => setIsFavorite(e.target.checked)}
            className="rounded text-primary focus:ring-primary"
          />
          <span>Sematkan ke daftar Favorit / Prioritas Atas</span>
        </label>
      </form>
    </ExpandPopoverModal>
  );
}
