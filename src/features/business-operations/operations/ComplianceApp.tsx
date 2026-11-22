import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const ComplianceApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="operations_compliance"
    title="Kepatuhan & Regulasi"
    subtitle="Audit standar industri, checklist sertifikasi & jadwal perizinan"
    iconName="ShieldCheck"
    categories={["Legal & Perizinan", "Perpajakan", "K3 & Keselamatan", "ISO / Mutu", "Data Privasi"]}
    addButtonLabel="Tambah Item Kepatuhan"
    titlePlaceholder="Misal: Audit Keselamatan Kerja Semester I"
    metricLabel="Regulator / Tenggat Audit"
  />
);
export default ComplianceApp;
