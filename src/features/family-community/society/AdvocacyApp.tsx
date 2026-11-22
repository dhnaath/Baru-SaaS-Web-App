import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const AdvocacyApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="society_advocacy"
    title="Aspirasi & Laporan Fasum"
    subtitle="Pelaporan fasilitas umum, status penanganan & eskalasi keluhan"
    iconName="Megaphone"
    categories={["Infrastruktur Jalan", "Penerangan Umum", "Sanitasi & Drainase", "Tata Ruang", "Pelayanan Publik"]}
    addButtonLabel="Buat Laporan Aspirasi"
    titlePlaceholder="Misal: Usulan Perbaikan Penerangan Jalan Utama"
    metricLabel="Instansi Tujuan / Nomor Tiket"
  />
);
export default AdvocacyApp;
