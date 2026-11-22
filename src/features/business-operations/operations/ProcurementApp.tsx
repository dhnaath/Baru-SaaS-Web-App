import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const ProcurementApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="operations_procurement"
    title="Pengadaan & Pembelian"
    subtitle="Alur pengajuan belanja, Purchase Orders & matriks otorisasi"
    iconName="ShoppingCart"
    categories={["Purchase Order", "Pengadaan Aset", "Operasional", "Jasa Eksternal", "ATK"]}
    addButtonLabel="Buat Pengajuan PO"
    titlePlaceholder="Misal: PO #2026-041 Pengadaan Perangkat Kerja"
    metricLabel="Nilai PO / Vendor"
  />
);
export default ProcurementApp;
