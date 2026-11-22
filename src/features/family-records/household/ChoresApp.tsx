import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const ChoresApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="household_chores"
    title="Tugas Domestik & Kebersihan"
    subtitle="Distribusi tanggung jawab kebersihan rumah & ceklis berkala"
    iconName="CheckSquare"
    categories={["Harian", "Mingguan", "Bulanan", "Area Dapur", "Area Taman"]}
    addButtonLabel="Tambah Tugas Rumah"
    titlePlaceholder="Misal: Ganti Filter Air Dapur"
    metricLabel="PIC / Frekuensi"
  />
);
export default ChoresApp;
