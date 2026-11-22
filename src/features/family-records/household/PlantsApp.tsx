import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const PlantsApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="household_plants"
    title="Tanaman & Kebun"
    subtitle="Jadwal penyiraman, pemupukan, repotting & log kesehatan flora"
    iconName="Sprout"
    categories={["Tanaman Hias", "Hidroponik", "Buah & Sayur", "Bunga", "Pemupukan"]}
    addButtonLabel="Tambah Tanaman"
    titlePlaceholder="Misal: Monstera Deliciosa - Teras Depan"
    metricLabel="Jadwal Siram / Pupuk"
  />
);
export default PlantsApp;
