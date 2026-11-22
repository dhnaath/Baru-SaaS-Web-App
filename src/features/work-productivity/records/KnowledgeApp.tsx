import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const KnowledgeApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="productivity_knowledge"
    title="Pustaka SOP & Playbook"
    subtitle="Dokumentasi standar operasional, artikel panduan & panduan kerja"
    iconName="BookOpen"
    categories={["SOP Operasional", "Playbook Penjualan", "Panduan Teknis", "Kebijakan SDM", "Onboarding"]}
    addButtonLabel="Tambah Dokumen SOP"
    titlePlaceholder="Misal: Playbook Audit Keuangan Triwulanan"
    metricLabel="Versi / Pemilik SOP"
  />
);
export default KnowledgeApp;
