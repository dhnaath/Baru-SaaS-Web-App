import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const HabitsApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="personal_habits"
    title="Habit & Rutinitas"
    subtitle="Pelacak kebiasaan harian & konsistensi ritme hidup"
    iconName="Repeat"
    categories={["Kesehatan", "Produktivitas", "Spiritual", "Pembelajaran", "Keluarga"]}
    addButtonLabel="Tambah Habit"
    titlePlaceholder="Misal: Olahraga Pagi 30 Menit"
    metricLabel="Target / Streak"
  />
);
export default HabitsApp;
