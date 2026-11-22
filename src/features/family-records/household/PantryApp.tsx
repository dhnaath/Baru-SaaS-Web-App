import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const PantryApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="household_pantry"
    title="Dapur & Stok Bahan Makanan"
    subtitle="Inventaris bahan pangan, bumbu dapur & radar kedaluwarsa"
    iconName="Utensils"
    categories={["Bahan Pokok", "Sayur & Buah", "Protein", "Bumbu Dapur", "Minuman"]}
    addButtonLabel="Tambah Stok Dapur"
    titlePlaceholder="Misal: Beras Organik 10 kg"
    metricLabel="Jumlah / Tanggal Kedaluwarsa"
  />
);
export default PantryApp;
