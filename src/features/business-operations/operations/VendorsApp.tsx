import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const VendorsApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="operations_vendors"
    title="Vendor & Rekanan Bisnis"
    subtitle="Direktori pihak ketiga, evaluasi SLA kontrak & log kemitraan"
    iconName="Building2"
    categories={["IT & Cloud", "Logistik", "Manufaktur", "Konsultan Legal", "Fasilitas Kantor"]}
    addButtonLabel="Tambah Vendor"
    titlePlaceholder="Misal: PT Teknologi Awan Nusantara"
    metricLabel="PIC / Skor SLA"
  />
);
export default VendorsApp;
