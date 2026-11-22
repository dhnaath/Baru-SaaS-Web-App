import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const InvestmentsApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="ownership_investments"
    title="Portofolio Investasi"
    subtitle="Alokasi aset instrumen pasar modal, yield dividen & reksa dana"
    iconName="TrendingUp"
    categories={["Saham Bluechip", "Reksa Dana", "SBN / Obligasi", "Deposito", "Emas & Komoditas"]}
    addButtonLabel="Tambah Posisi Investasi"
    titlePlaceholder="Misal: SBN Ritel ORI026 Tenor 3 Tahun"
    metricLabel="Nilai Investasi / Imbal Hasil"
  />
);
export default InvestmentsApp;
