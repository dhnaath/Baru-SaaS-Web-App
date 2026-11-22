import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const CivicApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="society_civic"
    title="Warga & Lingkungan RT/RW"
    subtitle="Direktori pengurus sipil, jadwal ronda, kas warga & zonasi fasilitas"
    iconName="Landmark"
    categories={["Kas Warga", "Pengurus RT/RW", "Keamanan", "Kebersihan Lingkungan", "Musyawarah"]}
    addButtonLabel="Tambah Catatan Warga"
    titlePlaceholder="Misal: Iuran Keamanan & Kebersihan Bulanan"
    metricLabel="Nominal / Penanggung Jawab"
  />
);
export default CivicApp;
