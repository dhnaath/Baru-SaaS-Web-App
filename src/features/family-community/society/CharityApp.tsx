import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const CharityApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="society_charity"
    title="Filantropi & Donasi"
    subtitle="Rekapitulasi donasi sosial, komitmen zakat & laporan dampak"
    iconName="Coins"
    categories={["Zakat & Infaq", "Beasiswa", "Kemanusiaan", "Wakaf Produktif", "Rumah Ibadah"]}
    addButtonLabel="Catat Donasi"
    titlePlaceholder="Misal: Penyaluran Zakat Maal Tahunan"
    metricLabel="Nominal / Lembaga Penyalur"
  />
);
export default CharityApp;
