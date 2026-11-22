import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const GoalsApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="personal_goals"
    title="Target & Sasaran"
    subtitle="Peta jalan sasaran jangka pendek & panjang dengan tahapan checkpoint"
    iconName="Target"
    categories={["Karier", "Finansial", "Kesehatan", "Keluarga", "Pengembangan Diri"]}
    addButtonLabel="Tambah Target"
    titlePlaceholder="Misal: Sertifikasi Konsultan Q3"
    metricLabel="Target Capaian / Tenggat"
  />
);
export default GoalsApp;
