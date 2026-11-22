import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const FitnessApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="personal_fitness"
    title="Latihan & Olahraga"
    subtitle="Log sesi latihan fisik, kalori, intensitas detak & beban latihan"
    iconName="Dumbbell"
    categories={["Kardio", "Kekuatan", "Mobilitas", "Lari", "Renang"]}
    addButtonLabel="Catat Latihan"
    titlePlaceholder="Misal: Lari Pagi Zona 2 - 5 km"
    metricLabel="Durasi / Kalori"
  />
);
export default FitnessApp;
