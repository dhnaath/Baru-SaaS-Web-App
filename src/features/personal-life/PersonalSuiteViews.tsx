import React from "react";
import { AppShell } from "@/app/app-shell";
import { ActionModals } from "./components/ActionModals";

// Domain Suite Views
import { LifePlannerView } from "@/features/personal-life/modules/life-planner/LifePlannerView";
import { FinanceOSView } from "@/features/finance/modules/finance-os/FinanceOSView";
import { SimpleFinanceView } from "@/features/finance/modules/simple-finance/SimpleFinanceView";
import { BudgetTrackerView } from "@/features/finance/modules/budget-tracker/BudgetTrackerView";
import { WeightTrackerView } from "@/features/personal-life/modules/weight-tracker/WeightTrackerView";
import { DoctorConsultationView } from "@/features/personal-life/modules/doctor-consultation/DoctorConsultationView";
import { HouseholdTrackerView } from "@/features/home-leisure/modules/household/HouseholdTrackerView";
import { WishlistView } from "@/features/finance/modules/wishlist/WishlistView";
import { GroceryListView } from "@/features/home-leisure/modules/grocery/GroceryListView";
import { MovieTrackerView } from "@/features/home-leisure/modules/movie-tracker/MovieTrackerView";
import { RecipeBookView } from "@/features/home-leisure/modules/recipe-book/RecipeBookView";
import { CertificateTrackerView } from "@/features/personal-life/modules/certificate-tracker/CertificateTrackerView";
import { TravelBackpackView } from "@/features/home-leisure/modules/travel-backpack/TravelBackpackView";
import { NotesView } from "@/features/personal-life/modules/notes/NotesView";
import { JournalView } from "@/features/personal-life/modules/journal/JournalView";
import { HabitTrackerView } from "@/features/personal-life/modules/habit-tracker/HabitTrackerView";
import { ContactsView } from "@/features/social-networks/modules/contacts/ContactsView";
import { SubscriptionTrackerView } from "@/features/finance/modules/subscriptions/SubscriptionTrackerView";
import { AssetsTrackerView } from "@/features/finance/modules/assets/AssetsTrackerView";
import { PersonalSuiteLayout } from "./PersonalSuiteLayout";

export { PersonalSuiteLayout };

function wrapLifeWithShell(title: string, subtitle: string, Component: React.ComponentType) {
  return function LifeShellWrappedView() {
    return (
      <PersonalSuiteLayout>
        <AppShell title={title} subtitle={subtitle}>
          <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 py-4 space-y-6">
            <Component />
          </div>
          <ActionModals />
        </AppShell>
      </PersonalSuiteLayout>
    );
  };
}

// Export Wrapped Views
export const PersonalPlannerSuiteView = wrapLifeWithShell(
  "Life Planner",
  "Dasbor eksekutif holistik: sasaran, habit, tugas, keuangan, dan jurnal refleksi harian",
  LifePlannerView
);

export const FinanceOSSuiteView = wrapLifeWithShell(
  "Finance OS",
  "Sistem keuangan mendalam: multi-akun, arus kas masuk/keluar, visualisasi donut & tren bulanan",
  FinanceOSView
);

export const SimpleFinanceSuiteView = wrapLifeWithShell(
  "Keuangan Sederhana",
  "Pencatatan cepat kas harian, dompet digital, dan log mutasi transaksi instan",
  SimpleFinanceView
);

export const BudgetTrackerSuiteView = wrapLifeWithShell(
  "Budget Tracker 50/30/20",
  "Aturan alokasi anggaran: 50% Kebutuhan Pokok, 30% Keinginan, 20% Tabungan & Utang",
  BudgetTrackerView
);

export const WeightTrackerSuiteView = wrapLifeWithShell(
  "Weight & Body Metric Tracker",
  "Pelacak komposisi tubuh, indeks massa tubuh (BMI), body fat, massa otot & target berat badan",
  WeightTrackerView
);

export const DoctorConsultationSuiteView = wrapLifeWithShell(
  "Konsultasi Dokter & Rekam Medis",
  "Pencatatan sesi dokter, resep obat, tensi darah, jadwal kontrol, biaya & direktori spesialis",
  DoctorConsultationView
);

export const HouseholdSuiteView = wrapLifeWithShell(
  "Inventaris Rumah & Elektronik",
  "Pendataan perabotan hunian, status garansi aktif, kondisi barang, dan log servis berkala",
  HouseholdTrackerView
);

export const WishlistSuiteView = wrapLifeWithShell(
  "Wishlist and Savings",
  "Daftar impian terencana, refleksi mindful spending, celengan akumulasi dana & prioritas",
  WishlistView
);

export const GrocerySuiteView = wrapLifeWithShell(
  "Daftar Belanja & Sembako",
  "Perencanaan belanja supermarket, siklus restock mingguan/bulanan & estimasi biaya",
  GroceryListView
);

export const MovieTrackerSuiteView = wrapLifeWithShell(
  "Movie & Series Tracker",
  "Watchlist film, serial TV, dokumenter, platform streaming, rating & ulasan pribadi",
  MovieTrackerView
);

export const RecipeBookSuiteView = wrapLifeWithShell(
  "Buku Resep & Dapur",
  "Koleksi resep masakan, takaran bahan, porsi, kalori, dan petunjuk langkah memasak",
  RecipeBookView
);

export const CertificateSuiteView = wrapLifeWithShell(
  "Sertifikat & Dokumen Legal",
  "Pelacak sertifikasi profesional, ijazah, paspor/visa, SIM/STNK, dan lokasi fisik brankas",
  CertificateTrackerView
);

export const TravelBackpackSuiteView = wrapLifeWithShell(
  "Travel Backpack & Packing List",
  "Daftar perlengkapan perjalanan, estimasi bobot bagasi kabin/bagasi, dan rencana trip",
  TravelBackpackView
);

export const PersonalNotesSuiteView = wrapLifeWithShell(
  "Catatan & Notebooks",
  "Buku catatan terstruktur lintas kategori: kerja, pribadi, buku, ide & teknologi",
  NotesView
);

export const PersonalJournalSuiteView = wrapLifeWithShell(
  "Jurnal Refleksi Harian",
  "Catatan pemikiran harian, syukur (*gratitude*), cuaca, dan evaluasi suasana hati",
  JournalView
);

export const PersonalHabitsSuiteView = wrapLifeWithShell(
  "Pelacak Habit & Konsistensi",
  "Ritme kebiasaan harian, konsistensi mingguan, dan rekapitulasi streak positif",
  HabitTrackerView
);

export const PersonalContactsSuiteView = wrapLifeWithShell(
  "Buku Kontak & Relasi",
  "Direktori jejaring personal & profesional, frekuensi sapa, dan catatan relasi",
  ContactsView
);

export const PersonalSubscriptionsSuiteView = wrapLifeWithShell(
  "Langganan & Tagihan Rutin",
  "Pemantauan siklus biaya berulang bulanan/tahunan, kategori layanan, dan pengingat",
  SubscriptionTrackerView
);

export const PersonalAssetsSuiteView = wrapLifeWithShell(
  "Pelacak Aset & Portofolio",
  "Pencatatan aset modal, nilai perolehan, taksiran nilai pasar kini, dan kategori aset",
  AssetsTrackerView
);
