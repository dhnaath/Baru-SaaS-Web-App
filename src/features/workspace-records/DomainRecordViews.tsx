import React from "react";
import { AppShell } from "@/app/app-shell";

// Personal Apps
import { HabitsApp } from "@/features/personal-life/records/HabitsApp";
import { JournalApp } from "@/features/personal-life/records/JournalApp";
import { GoalsApp } from "@/features/personal-life/records/GoalsApp";
import { ReadingApp } from "@/features/personal-life/records/ReadingApp";
import { FitnessApp } from "@/features/personal-life/records/FitnessApp";
import { SleepApp } from "@/features/personal-life/records/SleepApp";

// Essentials Apps
import { VaultApp } from "@/features/personal-life/essentials/VaultApp";
import { DocumentsApp } from "@/features/personal-life/essentials/DocumentsApp";
import { SubscriptionsApp } from "@/features/personal-life/essentials/SubscriptionsApp";
import { BudgetApp } from "@/features/personal-life/essentials/BudgetApp";
import { InsuranceApp } from "@/features/personal-life/essentials/InsuranceApp";

// Household Apps
import { ChoresApp } from "@/features/family-records/household/ChoresApp";
import { MaintenanceApp } from "@/features/family-records/household/MaintenanceApp";
import { PantryApp } from "@/features/family-records/household/PantryApp";
import { PlantsApp } from "@/features/family-records/household/PlantsApp";
import { VehiclesApp } from "@/features/family-records/household/VehiclesApp";

// Family Apps
import { FamilyTreeApp } from "@/features/family-records/family/FamilyTreeApp";
import { FamilyHealthApp } from "@/features/family-records/family/FamilyHealthApp";
import { FamilyRecipesApp } from "@/features/family-records/family/FamilyRecipesApp";
import { TraditionsApp } from "@/features/family-records/family/TraditionsApp";
import { FamilyBudgetApp } from "@/features/family-records/family/FamilyBudgetApp";
import { PetCareApp } from "@/features/family-records/family/PetCareApp";

// Operations Apps
import { WorkflowsApp } from "@/features/business-operations/operations/WorkflowsApp";
import { VendorsApp } from "@/features/business-operations/operations/VendorsApp";
import { IncidentsApp } from "@/features/business-operations/operations/IncidentsApp";
import { ProcurementApp } from "@/features/business-operations/operations/ProcurementApp";
import { ComplianceApp } from "@/features/business-operations/operations/ComplianceApp";

// Ownership Apps
import { AssetsApp } from "@/features/business-operations/ownership/AssetsApp";
import { IpLicensesApp } from "@/features/business-operations/ownership/IpLicensesApp";
import { CapTableApp } from "@/features/business-operations/ownership/CapTableApp";
import { InvestmentsApp } from "@/features/business-operations/ownership/InvestmentsApp";
import { RealEstateApp } from "@/features/business-operations/ownership/RealEstateApp";

// People Apps
import { ContactsApp } from "@/features/social-networks/people/ContactsApp";
import { MilestonesApp } from "@/features/social-networks/people/MilestonesApp";
import { GiftsApp } from "@/features/social-networks/people/GiftsApp";
import { IntroductionsApp } from "@/features/social-networks/people/IntroductionsApp";
import { MentorshipApp } from "@/features/social-networks/people/MentorshipApp";

// Productivity Apps
import { KnowledgeApp } from "@/features/work-productivity/records/KnowledgeApp";
import { MeetingsApp } from "@/features/work-productivity/records/MeetingsApp";
import { ProjectsApp } from "@/features/work-productivity/records/ProjectsApp";
import { TasksApp } from "@/features/work-productivity/records/TasksApp";
import { TimeAuditApp } from "@/features/work-productivity/records/TimeAuditApp";

// Society Apps
import { CivicApp } from "@/features/family-community/society/CivicApp";
import { VolunteeringApp } from "@/features/family-community/society/VolunteeringApp";
import { CharityApp } from "@/features/family-community/society/CharityApp";
import { CommunityEventsApp } from "@/features/family-community/society/CommunityEventsApp";
import { AdvocacyApp } from "@/features/family-community/society/AdvocacyApp";

// Dashboards
import { GlobalOverview } from "./dashboard/GlobalOverview";
import { InnovationsHub } from "./dashboard/InnovationsHub";
import { EcosystemComparison } from "./dashboard/EcosystemComparison";
import { WorkspaceRecordsLayout } from "./WorkspaceRecordsLayout";

export { WorkspaceRecordsLayout };

function wrapWithShell(title: string, subtitle: string, Component: React.ComponentType) {
  return function ShellWrappedView() {
    return (
      <WorkspaceRecordsLayout>
        <AppShell title={title} subtitle={subtitle}>
          <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 py-4 space-y-6">
            <Component />
          </div>
        </AppShell>
      </WorkspaceRecordsLayout>
    );
  };
}

// Export Wrapped Views
export const HabitsRecordView = wrapWithShell("Habit & Rutinitas", "Pelacak kebiasaan harian & konsistensi ritme hidup", HabitsApp);
export const JournalRecordView = wrapWithShell("Jurnal & Mood", "Ruang refleksi privat, pencatatan suasana hati & pemikiran harian", JournalApp);
export const GoalsRecordView = wrapWithShell("Target & Sasaran", "Peta jalan sasaran jangka pendek & panjang dengan tahapan checkpoint", GoalsApp);
export const ReadingRecordView = wrapWithShell("Buku & Bahan Bacaan", "Pelacak target membaca buku, kutipan inspiratif & rak bacaan", ReadingApp);
export const FitnessRecordView = wrapWithShell("Latihan & Olahraga", "Log sesi latihan fisik, kalori, intensitas detak & kalkulator 1RM", FitnessApp);
export const SleepRecordView = wrapWithShell("Tidur & Pemulihan", "Kualitas tidur, jam istirahat malam & kalkulator sleep debt", SleepApp);

export const VaultRecordView = wrapWithShell("Brankas Sandi & Kunci", "Penyimpanan aman kredensial, kunci akses, PIN & catatan sensitif", VaultApp);
export const DocumentsRecordView = wrapWithShell("Dokumen & Garansi", "Sentralisasi berkas legal, kartu garansi fisik & polis aktif", DocumentsApp);
export const SubscriptionsRecordView = wrapWithShell("Langganan & Tagihan", "Pantau biaya berulang, siklus tagihan & proyeksi anggaran tahunan", SubscriptionsApp);
export const BudgetRecordView = wrapWithShell("Anggaran & Alokasi", "Perencanaan pos belanja, batas limit bulanan & evaluasi pengeluaran", BudgetApp);
export const InsuranceRecordView = wrapWithShell("Asuransi & Polis", "Portofolio perlindungan jiwa, kesehatan, kendaraan & klaim", InsuranceApp);

export const ChoresRecordView = wrapWithShell("Tugas Domestik & Kebersihan", "Distribusi tanggung jawab kebersihan rumah & ceklis berkala", ChoresApp);
export const MaintenanceRecordView = wrapWithShell("Perbaikan & Servis Rumah", "Jadwal servis AC, pipa, kelistrikan & log vendor tukang", MaintenanceApp);
export const PantryRecordView = wrapWithShell("Dapur & Stok Bahan Makanan", "Inventaris bahan pangan, bumbu dapur & radar kedaluwarsa", PantryApp);
export const PlantsRecordView = wrapWithShell("Tanaman & Kebun", "Jadwal penyiraman, pemupukan, repotting & log kesehatan flora", PlantsApp);
export const VehiclesRecordView = wrapWithShell("Kendaraan & Otomotif", "Log servis berkala, pajak STNK, ganti oli & efisiensi BBM", VehiclesApp);

export const FamilyTreeRecordView = wrapWithShell("Silsilah & Keluarga Besar", "Pohon keluarga interaktif, generasi leluhur & direktori kontak", FamilyTreeApp);
export const FamilyHealthRecordView = wrapWithShell("Kesehatan Keluarga", "Profil golongan darah, riwayat alergi, obat rutin & kontak darurat", FamilyHealthApp);
export const FamilyRecipesRecordView = wrapWithShell("Resep Warisan Keluarga", "Buku resep turun-temurun, kalkulator porsi & bumbu khas", FamilyRecipesApp);
export const TraditionsRecordView = wrapWithShell("Acara & Tradisi Bersama", "Kalender reuni keluarga, tradisi tahunan & kas acara", TraditionsApp);
export const FamilyBudgetRecordView = wrapWithShell("Tabungan & Dana Keluarga", "Pos dana terarah, kalkulator pendidikan anak & tabungan bersama", FamilyBudgetApp);
export const PetCareRecordView = wrapWithShell("Hewan Peliharaan & Anabul", "Profil anabul, riwayat vaksinasi, jadwal vet & log berat badan", PetCareApp);

export const WorkflowsRecordView = wrapWithShell("Alur Kerja & Pipeline", "Otomasi proses bisnis, tahapan eksekusi & pipeline operasional", WorkflowsApp);
export const VendorsRecordView = wrapWithShell("Vendor & Rekanan Bisnis", "Direktori pihak ketiga, evaluasi SLA kontrak & log kemitraan", VendorsApp);
export const IncidentsRecordView = wrapWithShell("Log Masalah & Insiden", "Pencatatan gangguan operasional, resolusi & analisis akar masalah", IncidentsApp);
export const ProcurementRecordView = wrapWithShell("Pengadaan & Pembelian", "Alur pengajuan belanja, Purchase Orders & matriks otorisasi", ProcurementApp);
export const ComplianceRecordView = wrapWithShell("Kepatuhan & Regulasi", "Audit standar industri, checklist sertifikasi & jadwal perizinan", ComplianceApp);

export const AssetsRecordView = wrapWithShell("Aset Modal & Inventaris", "Daftar inventaris bernilai tinggi, penempatan & depresiasi", AssetsApp);
export const IpLicensesRecordView = wrapWithShell("Hak Cipta & Lisensi IP", "Manajemen merek dagang, lisensi software, domain & paten", IpLicensesApp);
export const CapTableRecordView = wrapWithShell("Struktur Saham & Ekuitas", "Tabel pemegang saham (Cap Table), persentase kepemilikan & vesting", CapTableApp);
export const InvestmentsRecordView = wrapWithShell("Portofolio Investasi", "Alokasi aset instrumen pasar modal, yield dividen & reksadana", InvestmentsApp);
export const RealEstateRecordView = wrapWithShell("Properti & Lahan Komersial", "Portofolio tanah, bangunan komersial, penyewa & kalkulator cap rate", RealEstateApp);

export const ContactsRecordView = wrapWithShell("Buku Kontak & Relasi", "Direktori relasi profesional, personal, riwayat interaksi & tag", ContactsApp);
export const MilestonesRecordView = wrapWithShell("Milestone Relasi & Ulang Tahun", "Pengingat momen penting, anniversary & hari lahir rekanan", MilestonesApp);
export const GiftsRecordView = wrapWithShell("Ide Kado & Tanda Kasih", "Pencatat preferensi bingkisan, riwayat kado & anggaran apresiasi", GiftsApp);
export const IntroductionsRecordView = wrapWithShell("Jejaring & Perkenalan", "Log mediasi relasi dua arah, pembuka kolaborasi & follow-up", IntroductionsApp);
export const MentorshipRecordView = wrapWithShell("Bimbingan & Mentoring", "Catatan sesi konsultasi, roadmap bimbingan karir & action items", MentorshipApp);

export const KnowledgeRecordView = wrapWithShell("Pustaka SOP & Playbook", "Dokumentasi standar operasional, artikel panduan & panduan kerja", KnowledgeApp);
export const MeetingsRecordView = wrapWithShell("Notulensi Rapat & Keputusan", "Pencatatan agenda rapat, keputusan konsensus & daftar PIC", MeetingsApp);
export const ProjectsRecordView = wrapWithShell("Proyek & Inisiatif Kerja", "Papan perencanaan multi-proyek, progres tahapan & deliverable", ProjectsApp);
export const TasksRecordView = wrapWithShell("Tugas & Manajemen Waktu", "Daftar to-do berorientasi prioritas, delegasi tugas & tenggat", TasksApp);
export const TimeAuditRecordView = wrapWithShell("Audit Waktu & Deep Work", "Pelacakan alokasi jam kerja produktif, analisis distraksi & ritme fokus", TimeAuditApp);

export const CivicRecordView = wrapWithShell("Warga & Lingkungan RT/RW", "Direktori pengurus sipil, jadwal ronda, kas warga & zonasi fasilitas", CivicApp);
export const VolunteeringRecordView = wrapWithShell("Relawan & Aksi Sosial", "Pencatat jam kontribusi sosial, komunitas pegiat & program sosial", VolunteeringApp);
export const CharityRecordView = wrapWithShell("Filantropi & Donasi", "Rekapitulasi donasi sosial, komitmen zakat & laporan dampak", CharityApp);
export const CommunityEventsRecordView = wrapWithShell("Acara & Agenda Komunitas", "Kalender kegiatan publik, kepanitiaan acara & daftar hadir", CommunityEventsApp);
export const AdvocacyRecordView = wrapWithShell("Aspirasi & Laporan Fasum", "Pelaporan fasilitas umum, status penanganan & eskalasi keluhan", AdvocacyApp);

export const GlobalOverviewRecordView = wrapWithShell("Ecosystem Overview", "Pusat dasbor holistik integrasi seluruh pilar kehidupan & bisnis", GlobalOverview);
export const InnovationsHubRecordView = wrapWithShell("Innovations Hub", "Eksplorasi modul mutakhir, matriks korelasi & fitur lanjutan", InnovationsHub);
export const EcosystemComparisonRecordView = wrapWithShell("Ecosystem Comparison", "Perbandingan komprehensif arsitektur domain Personal, Finansial, dan Operasional", EcosystemComparison);
