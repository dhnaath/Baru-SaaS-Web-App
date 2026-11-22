import React, { useState, useMemo } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { HeaderNavPills, ShellHeader } from "@/app/shell-header";
import {
  MBACard,
  buildModuleCategoryGroups,
  type ModuleComponentCategory,
} from "@/components/common/MBACard";
import { MovedCardsGridItems } from "@/components/common/MovedCardsGridItems";
import {
  LauncherPageProvider,
  adjustCategoryTabsCount,
  syncLauncherPageBadge,
  useCardPageMover,
  useCurrentLauncherPage,
} from "@/hooks/useCardPageMover";
import { usePinnedCards, sortCardsWithPinned } from "@/hooks/usePinnedCards";
import {
  consolidateSubMenuApps,
  remapAppCategories,
  SHARIA_MERGE_RULES,
  SHARIA_CATEGORY_REMAP,
} from "@/core/moduleConsolidation";
import {
  Compass,
  Briefcase,
  Scale,
  HeartHandshake,
  Coins,
  Building2,
  TrendingUp,
  Users,
  Receipt,
  FileCheck,
  Package,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  Shield,
  Landmark,
  ScrollText,
  Search,
} from "lucide-react";

export type ShariaCategory =
  | "all"
  | "governance"
  | "contracts"
  | "social"
  | "wealth";

const LEGACY_SHARIA_CATEGORY_MAP: Record<string, ShariaCategory> = {
  principles: "governance",
  finance: "social",
  zakat: "social",
  protection: "wealth",
  investment: "wealth",
  sosial: "social",
  komersial: "contracts",
  proteksi: "wealth",
  simpanan: "wealth",
  investasi: "wealth",
  kepatuhan: "governance",
  "islamic-principles-ethics": "governance",
  "islamic-social-finance": "social",
  "islamic-commercial-contracts": "contracts",
  "islamic-protection-deposits": "wealth",
  "zakat-wealth-purification": "social",
  "sharia-investment": "wealth",
  "sharia-governance-compliance": "governance",
};

export function normalizeShariaCategory(raw?: string | null): ShariaCategory {
  if (!raw) return "all";
  const key = raw.trim().toLowerCase();
  if (
    key === "all" ||
    key === "governance" ||
    key === "contracts" ||
    key === "social" ||
    key === "wealth"
  ) {
    return key;
  }
  return LEGACY_SHARIA_CATEGORY_MAP[key] ?? "all";
}

export interface ShariaSubMenu {
  id: string;
  label: string;
  to: string;
  inverted?: boolean;
  componentCategory: ModuleComponentCategory;
}

export interface ShariaAppItem {
  id: string;
  name: string;
  category: Exclude<ShariaCategory, "all">;
  categoryLabel: string;
  shortDesc: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  accentGradient: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  subMenus: ShariaSubMenu[];
}

type RawShariaAppItem = Omit<ShariaAppItem, "category"> & { category: string };

const RAW_SHARIA_APPS: RawShariaAppItem[] = [
  // ============================================================================
  // CATEGORY 1 — Islamic Principles and Ethics (2 Modules)
  // ============================================================================
  {
    id: "islamic-principles-and-ethics",
    name: "Islamic Principles",
    category: "principles",
    categoryLabel: "Principles",
    shortDesc:
      "Referensi edukatif prinsip dasar syariah, kaidah muamalah, dan kerangka Maqasid al-Sharia sebagai rujukan nilai (bukan penetapan hukum otomatis).",
    to: "/islamic-principles-and-sharia-values?module=islamic-principles-and-ethics",
    icon: Compass,
    badge: "Principles",
    accentGradient: "from-emerald-600 to-teal-700",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Principles",
    subMenus: [
      { id: "islamic-principles-library", label: "Islamic Principles Library", to: "", componentCategory: "Guides" },
      { id: "maqasid-al-sharia-framework", label: "Maqasid al-Sharia Framework", to: "", componentCategory: "Guides" },
    ],
  },
  {
    id: "islamic-business-ethics",
    name: "Business Ethics",
    category: "principles",
    categoryLabel: "Principles",
    shortDesc:
      "Panduan etika bisnis Islami (amanah, keadilan, transparansi transaksi) dan instrumen refleksi penilaian keputusan etis usaha.",
    to: "/islamic-principles-and-sharia-values?module=islamic-business-ethics",
    icon: Briefcase,
    badge: "Principles",
    accentGradient: "from-teal-600 to-emerald-700",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badgeText: "Principles",
    subMenus: [
      { id: "islamic-business-ethics-guide", label: "Islamic Ethics Guide", to: "", componentCategory: "Guides" },
      { id: "ethical-decision-assessment", label: "Ethical Decision Assessment", to: "", componentCategory: "Analytics" },
    ],
  },

  // ============================================================================
  // CATEGORY 2 — Islamic Social Finance (3 Modules)
  // ============================================================================
  {
    id: "tabarru-hibah",
    name: "Tabarru' Hibah",
    category: "finance",
    categoryLabel: "Finance",
    shortDesc:
      "Pengelolaan akad tabarru', hibah keluarga, catatan infaq/sedekah, pintasan menuju modul Qardh Hasan, dan registrasi kontribusi sosial.",
    to: "/syariah/akad?app=tabarru",
    icon: HeartHandshake,
    badge: "Finance",
    accentGradient: "from-emerald-500 to-teal-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Finance",
    subMenus: [
      { id: "tabarru-contract", label: "Tabarru' Contract", to: "/syariah/akad?app=tabarru", inverted: false, componentCategory: "Templates" },
      { id: "hibah-family", label: "Hibah Contract", to: "/syariah/akad?app=hibah", inverted: false, componentCategory: "Templates" },
      { id: "infaq-sedekah", label: "Infaq Sadaqah Log", to: "/zakat?app=infaq", inverted: true, componentCategory: "Records" },
      { id: "qardh-hasan", label: "Qardh Calculator", to: "/syariah/akad?app=qardh", inverted: true, componentCategory: "Tools" },
      { id: "social-contribution-register", label: "Social Contribution Register", to: "", componentCategory: "Records" },
    ],
  },
  {
    id: "qardh-kebajikan",
    name: "Qardh Hasan",
    category: "finance",
    categoryLabel: "Finance",
    shortDesc:
      "Sistem pinjaman kebajikan tanpa bunga (0% riba) dengan buku catatan qardh, jadwal pengembalian pokok, dan panduan keringanan utang.",
    to: "/syariah/akad?app=qardh",
    icon: Coins,
    badge: "Finance",
    accentGradient: "from-teal-500 to-cyan-600",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badgeText: "Finance",
    subMenus: [
      { id: "qardh-ledger", label: "Qardh Ledger", to: "/syariah/akad?app=qardh", inverted: true, componentCategory: "Records" },
      { id: "pelunasan-pokok", label: "Qardh Hasan", to: "/syariah/akad?app=qardh", inverted: false, componentCategory: "Workflows" },
      { id: "keringanan-utang", label: "Debt Relief Terms", to: "/syariah/akad?app=qardh", inverted: true, componentCategory: "Guides" },
    ],
  },
  {
    id: "wakaf-aset-umat",
    name: "Waqf Management",
    category: "finance",
    categoryLabel: "Finance",
    shortDesc:
      "Tata kelola wakaf tunai, registri aset wakaf, pelaporan nazhir profesional, serta analitik dampak manfaat wakaf produktif.",
    to: "/syariah/akad?app=wakaf",
    icon: Building2,
    badge: "Finance",
    accentGradient: "from-green-500 to-emerald-600",
    accentBorder: "border-green-500/30 hover:border-green-500/60",
    badgeBg: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
    badgeText: "Finance",
    subMenus: [
      { id: "wakaf-uang", label: "Cash Waqf", to: "/syariah/akad?app=wakaf", inverted: false, componentCategory: "Features" },
      { id: "aset-wakaf", label: "Waqf Asset Register", to: "/syariah/akad?app=wakaf", inverted: true, componentCategory: "Records" },
      { id: "laporan-nazhir", label: "Nazhir Reporting", to: "/syariah/akad?app=wakaf", inverted: true, componentCategory: "Analytics" },
      { id: "waqf-impact-analytics", label: "Waqf Impact Analytics", to: "", componentCategory: "Analytics" },
    ],
  },

  // ============================================================================
  // CATEGORY 3 — Islamic Commercial Contracts (5 Modules)
  // ============================================================================
  {
    id: "mudharabah-bagi-hasil",
    name: "Mudharabah Sharing",
    category: "contracts",
    categoryLabel: "Contracts",
    shortDesc:
      "Kemitraan permodalan shahibul maal dan mudharib pengelola usaha dengan kalkulator nisbah, akad, audit laba-rugi, dan catatan distribusi.",
    to: "/syariah/akad?app=mudharabah",
    icon: TrendingUp,
    badge: "Contracts",
    accentGradient: "from-amber-500 to-orange-600",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "Contracts",
    subMenus: [
      { id: "nisbah-kalkulator", label: "Mudharabah Calculator", to: "/syariah/akad?app=mudharabah", inverted: false, componentCategory: "Tools" },
      { id: "kontrak-mudharabah", label: "Mudharabah Contract", to: "/syariah/akad?app=mudharabah", inverted: true, componentCategory: "Templates" },
      { id: "laporan-laba-rugi", label: "Profit Audit", to: "/syariah/akad?app=mudharabah", inverted: true, componentCategory: "Analytics" },
      { id: "profit-sharing-distribution-record", label: "Profit-Sharing Distribution Record", to: "", componentCategory: "Records" },
    ],
  },
  {
    id: "musyarakah-equity",
    name: "Musharakah Capital",
    category: "contracts",
    categoryLabel: "Contracts",
    shortDesc:
      "Penyertaan modal bersama (syirkah), skema musyarakah mutanaqisah, kontrak syirkah, kepemilikan modal, dan pelacak modal mitra.",
    to: "/syariah/akad?app=musyarakah",
    icon: Users,
    badge: "Contracts",
    accentGradient: "from-orange-500 to-amber-600",
    accentBorder: "border-orange-500/30 hover:border-orange-500/60",
    badgeBg: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
    badgeText: "Contracts",
    subMenus: [
      { id: "musyarakah-mutanaqisah", label: "Musharakah Calculator", to: "/syariah/akad?app=musyarakah", inverted: false, componentCategory: "Tools" },
      { id: "syirkah-inan", label: "Shirkah Contracts", to: "/syariah/akad?app=musyarakah", inverted: true, componentCategory: "Templates" },
      { id: "porsi-modal", label: "Capital Ownership", to: "/syariah/akad?app=musyarakah", inverted: true, componentCategory: "Records" },
      { id: "partnership-capital-tracker", label: "Partnership Capital Tracker", to: "", componentCategory: "Records" },
    ],
  },
  {
    id: "murabahah-costplus",
    name: "Murabaha Sale",
    category: "contracts",
    categoryLabel: "Contracts",
    shortDesc:
      "Jual beli komoditas/barang dengan pengungkapan harga pokok dan margin keuntungan (cost-plus markup) serta verifikasi kepemilikan aset.",
    to: "/syariah/akad?app=murabahah",
    icon: Receipt,
    badge: "Contracts",
    accentGradient: "from-blue-500 to-indigo-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Contracts",
    subMenus: [
      { id: "kalkulasi-margin", label: "Murabaha Margin Calculator", to: "/syariah/akad?app=murabahah", inverted: false, componentCategory: "Tools" },
      { id: "skema-cicilan", label: "Murabaha Installment Plan", to: "/syariah/akad?app=murabahah", inverted: true, componentCategory: "Workflows" },
      { id: "verifikasi-komoditas", label: "Asset Ownership Verification", to: "/syariah/akad?app=murabahah", inverted: true, componentCategory: "Tools" },
    ],
  },
  {
    id: "ijarah-sewa-manfaat",
    name: "Ijarah Lease",
    category: "contracts",
    categoryLabel: "Contracts",
    shortDesc:
      "Penyewaan manfaat barang dan jasa dengan kalkulator IMBT serta panduan tanggung jawab pemeliharaan oleh pemilik aset.",
    to: "/syariah/akad?app=ijarah",
    icon: FileCheck,
    badge: "Contracts",
    accentGradient: "from-indigo-500 to-sky-600",
    accentBorder: "border-indigo-500/30 hover:border-indigo-500/60",
    badgeBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    badgeText: "Contracts",
    subMenus: [
      { id: "ijarah-sewa", label: "Ijarah Contract", to: "/syariah/akad?app=ijarah", inverted: true, componentCategory: "Templates" },
      { id: "imbt-kalkulator", label: "Ijarah Calculator", to: "/syariah/akad?app=ijarah", inverted: false, componentCategory: "Tools" },
      { id: "maintenance-rule", label: "Ijarah Owner Obligations", to: "/syariah/akad?app=ijarah", inverted: true, componentCategory: "Guides" },
    ],
  },
  {
    id: "salam-istishna-pesanan",
    name: "Salam Istisna",
    category: "contracts",
    categoryLabel: "Contracts",
    shortDesc:
      "Akad pembiayaan pesanan manufaktur bertahap (Istishna'), jual beli komoditas di muka (Salam), dan panduan standar spesifikasi objek.",
    to: "/syariah/akad?app=istishna",
    icon: Package,
    badge: "Contracts",
    accentGradient: "from-sky-500 to-teal-600",
    accentBorder: "border-sky-500/30 hover:border-sky-500/60",
    badgeBg: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
    badgeText: "Contracts",
    subMenus: [
      { id: "istishna-termin", label: "Istishna Contract", to: "/syariah/akad?app=istishna", inverted: false, componentCategory: "Workflows" },
      { id: "salam-tani", label: "Salam Commodity Contract", to: "/syariah/akad?app=salam", inverted: false, componentCategory: "Templates" },
      { id: "spesifikasi-teknis", label: "Istishna Spec Guide", to: "/syariah/akad?app=istishna", inverted: true, componentCategory: "Guides" },
    ],
  },

  // ============================================================================
  // CATEGORY 4 — Islamic Protection and Deposits (2 Modules)
  // ============================================================================
  {
    id: "takaful-tamin",
    name: "Takaful Insurance",
    category: "protection",
    categoryLabel: "Protection",
    shortDesc:
      "Proteksi tolong-menolong berbasis dana tabarru' bersama, kalkulasi surplus underwriting, klaim ta'awun, dan pelacak kontribusi.",
    to: "/syariah/akad?app=takaful",
    icon: ShieldCheck,
    badge: "Protection",
    accentGradient: "from-cyan-500 to-blue-600",
    accentBorder: "border-cyan-500/30 hover:border-cyan-500/60",
    badgeBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    badgeText: "Protection",
    subMenus: [
      { id: "dana-tabarru", label: "Tabarru' Fund Ledger", to: "/syariah/akad?app=takaful", inverted: true, componentCategory: "Records" },
      { id: "surplus-underwriting", label: "Takaful Pool", to: "/syariah/akad?app=takaful", inverted: false, componentCategory: "Tools" },
      { id: "klaim-takaful", label: "Ta'awun Claims", to: "/syariah/akad?app=takaful", inverted: true, componentCategory: "Workflows" },
      { id: "takaful-contribution-tracker", label: "Takaful Contribution Tracker", to: "", componentCategory: "Records" },
    ],
  },
  {
    id: "wadiah-amanah",
    name: "Wadiah Custody",
    category: "protection",
    categoryLabel: "Protection",
    shortDesc:
      "Penyimpanan dana dan titipan murni (Wadiah Yad Dhamanah & Amanah) tanpa bunga dengan transparansi jaminan keutuhan titipan.",
    to: "/syariah/akad?app=wadiah",
    icon: Shield,
    badge: "Protection",
    accentGradient: "from-teal-600 to-emerald-700",
    accentBorder: "border-teal-600/30 hover:border-teal-600/60",
    badgeBg: "bg-teal-600/15 text-teal-600 dark:text-teal-400 border-teal-600/30",
    badgeText: "Protection",
    subMenus: [
      { id: "wadiah-dhamanah", label: "Wadiah Contract", to: "/syariah/akad?app=wadiah", inverted: false, componentCategory: "Features" },
      { id: "titipan-fisik", label: "Gold Custody Records", to: "/syariah/akad?app=wadiah", inverted: true, componentCategory: "Records" },
      { id: "pencatatan-amanah", label: "Custody Book", to: "/syariah/akad?app=wadiah", inverted: true, componentCategory: "Records" },
    ],
  },

  // ============================================================================
  // CATEGORY 5 — Zakat and Wealth Purification (3 Modules)
  // ============================================================================
  {
    id: "zakat-maal-portofolio",
    name: "Wealth Zakat",
    category: "zakat",
    categoryLabel: "Zakat",
    shortDesc:
      "Pelacak nisab emas 85 gram, kalender haul 354 hari hijriyah, zakat saham & reksa dana, serta panduan klasifikasi aset zakat.",
    to: "/zakat?app=maal",
    icon: Coins,
    badge: "Zakat",
    accentGradient: "from-yellow-500 to-amber-600",
    accentBorder: "border-yellow-500/30 hover:border-yellow-500/60",
    badgeBg: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    badgeText: "Zakat",
    subMenus: [
      { id: "nisab-tracker", label: "Zakat Maal Calculator", to: "/zakat?app=maal", inverted: false, componentCategory: "Tools" },
      { id: "haul-calendar", label: "Haul Calendar", to: "/zakat?app=maal", inverted: true, componentCategory: "Automations" },
      { id: "portofolio-syariah", label: "Securities Zakat Calculator", to: "/zakat?app=saham", inverted: true, componentCategory: "Tools" },
      { id: "zakat-asset-classification-guide", label: "Wealth Classification Guide", to: "", componentCategory: "Guides" },
    ],
  },
  {
    id: "zakat-penghasilan-profesi",
    name: "Income Zakat",
    category: "zakat",
    categoryLabel: "Zakat",
    shortDesc:
      "Kalkulasi zakat 2.5% dari pendapatan bersih bulanan, kompensasi kebutuhan pokok, dan histori penyaluran melalui LAZ resmi.",
    to: "/zakat?app=profesi",
    icon: Wallet,
    badge: "Zakat",
    accentGradient: "from-amber-600 to-orange-700",
    accentBorder: "border-amber-600/30 hover:border-amber-600/60",
    badgeBg: "bg-amber-600/15 text-amber-600 dark:text-amber-400 border-amber-600/30",
    badgeText: "Zakat",
    subMenus: [
      { id: "gaji-bersih", label: "Income Zakat Calculator", to: "/zakat?app=penghasilan", inverted: false, componentCategory: "Tools" },
      { id: "potongan-pokok", label: "Zakat Deduction Calculator", to: "/zakat?app=profesi", inverted: true, componentCategory: "Tools" },
      { id: "buku-pembayaran", label: "LAZ Distribution History", to: "/zakat?app=profesi", inverted: true, componentCategory: "Records" },
    ],
  },
  {
    id: "fidyah-kaffarah-fitrah",
    name: "Zakat Fitr",
    category: "zakat",
    categoryLabel: "Zakat",
    shortDesc:
      "Kalkulator konversi sha' beras / rupiah untuk zakat fitrah, penghitungan fidyah harian, dan panduan penebusan kaffarah.",
    to: "/zakat?app=fitrah",
    icon: Scale,
    badge: "Zakat",
    accentGradient: "from-lime-500 to-emerald-600",
    accentBorder: "border-lime-500/30 hover:border-lime-500/60",
    badgeBg: "bg-lime-500/15 text-lime-600 dark:text-lime-400 border-lime-500/30",
    badgeText: "Zakat",
    subMenus: [
      { id: "takaran-fitrah", label: "Zakat Fitrah Calculator", to: "/zakat?app=fitrah", inverted: false, componentCategory: "Tools" },
      { id: "fidyah-puasa", label: "Fidyah Calculator", to: "/zakat?app=fidyah", inverted: true, componentCategory: "Tools" },
      { id: "kaffarah-calc", label: "Kaffarah Guide", to: "/zakat?app=kaffarah", inverted: true, componentCategory: "Guides" },
    ],
  },

  // ============================================================================
  // CATEGORY 6 — Sharia Investment (1 Module)
  // ============================================================================
  {
    id: "screening-saham-syariah",
    name: "Sharia Investments",
    category: "investment",
    categoryLabel: "Investment",
    shortDesc:
      "Indikator penapisan mengacu pada parameter OJK/DES (rasio utang berbasis bunga <45% & pendapatan non-halal <10%) sebagai alat skrining, bukan penetapan fatwa.",
    to: "/100-komoditas?tab=syariah",
    icon: ShieldCheck,
    badge: "Investment",
    accentGradient: "from-emerald-600 to-green-700",
    accentBorder: "border-emerald-600/30 hover:border-emerald-600/60",
    badgeBg: "bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 border-emerald-600/30",
    badgeText: "Investment",
    subMenus: [
      { id: "rasio-utang", label: "Debt Ratio Screener", to: "/100-komoditas?tab=syariah", inverted: true, componentCategory: "Tools" },
      { id: "non-halal-rev", label: "Non-Halal Revenue Audit", to: "/100-komoditas?tab=syariah", inverted: true, componentCategory: "Analytics" },
      { id: "daftar-des", label: "Sharia Securities List", to: "/100-komoditas?tab=syariah", inverted: false, componentCategory: "Records" },
      { id: "sharia-screening-history", label: "Sharia Screening History", to: "", componentCategory: "Records" },
    ],
  },

  // ============================================================================
  // CATEGORY 7 — Sharia Governance and Compliance (4 Modules)
  // ============================================================================
  {
    id: "audit-bebas-riba",
    name: "Riba Compliance",
    category: "governance",
    categoryLabel: "Governance",
    shortDesc:
      "Identifikasi indikator riba akad, kalkulator cleansing dana bunga konvensional, rujukan Fatwa DSN-MUI tertelusur, serta asesmen eksposur riba.",
    to: "/syariah/terlarang?app=riba",
    icon: ShieldAlert,
    badge: "Governance",
    accentGradient: "from-rose-500 to-red-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Governance",
    subMenus: [
      { id: "cleansing-bunga", label: "Interest Cleansing", to: "/syariah/terlarang?app=cleansing", inverted: true, componentCategory: "Tools" },
      { id: "identifikasi-riba", label: "Riba Identification", to: "/syariah/terlarang?app=riba", inverted: false, componentCategory: "Analytics" },
      { id: "fatwa-dsn-mui", label: "DSN-MUI Fatwa Guide", to: "/syariah/terlarang?app=fatwa", inverted: true, componentCategory: "Guides" },
      { id: "riba-exposure-assessment", label: "Riba Exposure Assessment", to: "", componentCategory: "Analytics" },
    ],
  },
  {
    id: "audit-gharar-maysir",
    name: "Gharar Compliance",
    category: "governance",
    categoryLabel: "Governance",
    shortDesc:
      "Pemeriksaan indikator kejelasan objek (gharar), deteksi unsur spekulasi maysir, serta rujukan standar syariah AAOIFI yang dapat ditelusuri.",
    to: "/syariah/terlarang?app=gharar",
    icon: Scale,
    badge: "Governance",
    accentGradient: "from-purple-500 to-indigo-600",
    accentBorder: "border-purple-500/30 hover:border-purple-500/60",
    badgeBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    badgeText: "Governance",
    subMenus: [
      { id: "uji-gharar", label: "Gharar Audit", to: "/syariah/terlarang?app=gharar", inverted: false, componentCategory: "Analytics" },
      { id: "uji-maysir", label: "Maysir Detection", to: "/syariah/terlarang?app=maysir", inverted: false, componentCategory: "Analytics" },
      { id: "standar-aaoifi", label: "AAOIFI Standards", to: "/syariah/terlarang?app=aaoifi", inverted: true, componentCategory: "Guides" },
    ],
  },
  {
    id: "sharia-governance-and-audit",
    name: "Sharia Governance",
    category: "governance",
    categoryLabel: "Governance",
    shortDesc:
      "Pemantauan tata kelola syariah, alur kerja audit kepatuhan internal, registri kepatuhan, dan penilaian risiko syariah berbasis bukti terverifikasi.",
    to: "/islamic-principles-and-sharia-values?module=sharia-governance-and-audit",
    icon: Landmark,
    badge: "Governance",
    accentGradient: "from-slate-600 to-zinc-700",
    accentBorder: "border-slate-500/30 hover:border-slate-500/60",
    badgeBg: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30",
    badgeText: "Governance",
    subMenus: [
      { id: "sharia-governance-dashboard", label: "Sharia Governance Dashboard", to: "", componentCategory: "Dashboards" },
      { id: "sharia-audit-workflow", label: "Sharia Audit Workflow", to: "", componentCategory: "Workflows" },
      { id: "sharia-compliance-register", label: "Sharia Compliance Register", to: "", componentCategory: "Records" },
      { id: "sharia-risk-assessment", label: "Sharia Risk Assessment", to: "", componentCategory: "Analytics" },
    ],
  },
  {
    id: "sharia-standards-and-fatwa",
    name: "Sharia Standards",
    category: "governance",
    categoryLabel: "Governance",
    shortDesc:
      "Direktori standar syariah dan pustaka fatwa yang merujuk otoritas penerbit, tanggal terbit, dan status keberlakuan secara tertelusur.",
    to: "/islamic-principles-and-sharia-values?module=sharia-standards-and-fatwa",
    icon: ScrollText,
    badge: "Governance",
    accentGradient: "from-violet-500 to-purple-700",
    accentBorder: "border-violet-500/30 hover:border-violet-500/60",
    badgeBg: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
    badgeText: "Governance",
    subMenus: [
      { id: "fatwa-and-ruling-library", label: "Fatwa Ruling Library", to: "", componentCategory: "Records" },
      { id: "sharia-standards-directory", label: "Sharia Standards Directory", to: "", componentCategory: "Records" },
      { id: "fatwa-reference-tracker", label: "Fatwa Reference Lookup", to: "", componentCategory: "Tools" },
      { id: "regulatory-and-fatwa-updates", label: "Standards Update Alerts", to: "", componentCategory: "Automations" },
    ],
  },
];

const SHARIA_CATEGORY_KEYS: readonly Exclude<ShariaCategory, "all">[] = [
  "governance",
  "contracts",
  "social",
  "wealth",
];

export const SHARIA_APPS: ShariaAppItem[] = remapAppCategories(
  consolidateSubMenuApps(RAW_SHARIA_APPS, SHARIA_MERGE_RULES),
  SHARIA_CATEGORY_REMAP,
  SHARIA_CATEGORY_KEYS
);

export const SHARIA_CATEGORY_TABS: {
  id: ShariaCategory;
  label: string;
  count: number;
}[] = [
  { id: "all", label: "Semua", count: SHARIA_APPS.length },
  {
    id: "governance",
    label: "Governance",
    count: SHARIA_APPS.filter((a) => a.category === "governance").length,
  },
  {
    id: "contracts",
    label: "Contracts",
    count: SHARIA_APPS.filter((a) => a.category === "contracts").length,
  },
  {
    id: "social",
    label: "Social",
    count: SHARIA_APPS.filter((a) => a.category === "social").length,
  },
  {
    id: "wealth",
    label: "Wealth",
    count: SHARIA_APPS.filter((a) => a.category === "wealth").length,
  },
];

export const SHARIA_TOTAL_MODULES = SHARIA_APPS.length;
export const SHARIA_TOOLS_COUNT = SHARIA_APPS.reduce(
  (sum, app) => sum + app.subMenus.filter((s) => s.componentCategory === "Tools").length,
  0
);
export const SHARIA_FEATURES_COUNT = SHARIA_APPS.reduce(
  (sum, app) => sum + app.subMenus.filter((s) => s.componentCategory !== "Tools").length,
  0
);
export const SHARIA_TOTAL_BADGE = `${SHARIA_TOTAL_MODULES} Modul • ${SHARIA_FEATURES_COUNT} Features • ${SHARIA_TOOLS_COUNT} Tools`;
syncLauncherPageBadge("mode_sharia", SHARIA_TOTAL_BADGE);
export const SHARIA_SUMMARY_DESC = SHARIA_CATEGORY_TABS.filter((t) => t.id !== "all")
  .map((t) => `${t.label} (${t.count})`)
  .join(" · ");

export function IslamicPrinciplesShariaValuesPage({
  isEmbedded: _isEmbedded = false,
}: {
  isEmbedded?: boolean;
} = {}) {
  const [selectedCategory, setSelectedCategory] = useState<ShariaCategory>(() => {
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get("category") || params.get("pill");
        if (cat) return normalizeShariaCategory(cat);
      } catch {}
    }
    return "all";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();
  const pageId = useCurrentLauncherPage("mode_sharia") || "mode_sharia";
  const { getPageCountDelta, getCardsMovedIntoPage } = useCardPageMover();
  const { pinnedList } = usePinnedCards(pageId);

  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = SHARIA_APPS.filter((app) => {
      const matchCategory =
        selectedCategory === "all" || app.category === selectedCategory;
      const matchSearch =
        q === "" ||
        app.name.toLowerCase().includes(q) ||
        app.shortDesc.toLowerCase().includes(q) ||
        app.categoryLabel.toLowerCase().includes(q) ||
        app.badge.toLowerCase().includes(q) ||
        app.subMenus.some((sub) => sub.label.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
    return sortCardsWithPinned(list, (app) => app.to || app.name, pinnedList);
  }, [selectedCategory, searchQuery, pinnedList]);

  return (
    <LauncherPageProvider pageId={pageId}>
    <div className="w-full flex-1 flex flex-col font-sans pb-16">
      <ShellHeader>
        <HeaderNavPills
          items={adjustCategoryTabsCount(SHARIA_CATEGORY_TABS, getPageCountDelta(pageId))}
          activeId={selectedCategory}
          onSelect={(id) => setSelectedCategory(id as ShariaCategory)}
        />
      </ShellHeader>

      <div className="w-full mx-auto pt-3 sm:pt-4 space-y-3 sm:space-y-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2.5">
            <span>Islamic Principles <span className="font-normal">and</span> Sharia Values</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
          {filteredApps.map((app) => (
            <MBACard
              key={app.id}
              title={app.name}
              to={app.to}
              icon={app.icon}
              badge={app.badgeText}
              shortDesc={app.shortDesc}
              accentGradient={app.accentGradient}
              categoryGroups={buildModuleCategoryGroups(app.subMenus, app.to)}
              features={app.subMenus.map((sub) => ({
                title: sub.label,
                to: sub.to ?? app.to,
                inverted: sub.inverted,
              }))}
              isFav={isFavorite(app.to)}
              toggleFavorite={toggleFavorite}
            />
          ))}
          {selectedCategory === "all" && (
            <MovedCardsGridItems pageId={pageId} searchQuery={searchQuery} />
          )}
        </div>

        {filteredApps.length === 0 &&
          (selectedCategory !== "all" || getCardsMovedIntoPage(pageId).length === 0) && (
          <div className="text-center py-16 rounded-3xl border border-dashed border-border p-8 bg-card/40">
            <Search className="size-8 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-foreground">
              Tidak ada modul muamalah ditemukan
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Coba kata kunci pencarian lain atau pilih tab kategori lain untuk melihat seluruh modul.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-semibold transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
    </LauncherPageProvider>
  );
}
