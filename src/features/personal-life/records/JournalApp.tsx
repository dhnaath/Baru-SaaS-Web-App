import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const JournalApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="personal_journal"
    title="Jurnal & Mood"
    subtitle="Ruang refleksi privat, pencatatan suasana hati & pemikiran harian"
    iconName="BookOpen"
    categories={["Refleksi Harian", "Gratitude", "Evaluasi", "Mood Log", "Ide"]}
    addButtonLabel="Tulis Jurnal"
    titlePlaceholder="Misal: Evaluasi pencapaian minggu ini"
    metricLabel="Suasana Hati / Energi"
  />
);
export default JournalApp;
