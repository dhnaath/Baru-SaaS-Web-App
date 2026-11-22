import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const CapTableApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="ownership_cap_table"
    title="Struktur Saham & Ekuitas"
    subtitle="Tabel pemegang saham (Cap Table), persentase kepemilikan & vesting"
    iconName="PieChart"
    categories={["Pendiri (Founders)", "Investor", "ESOP", "Saham Preferen", "Obligasi Konversi"]}
    addButtonLabel="Tambah Pemegang Saham"
    titlePlaceholder="Misal: PT Investama Nusantara - Seri A"
    metricLabel="Jumlah Lembar / Porsi Ekuitas"
  />
);
export default CapTableApp;
