import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const WorkflowsApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="operations_workflows"
    title="Alur Kerja & Pipeline"
    subtitle="Otomasi proses bisnis, tahapan eksekusi & pipeline operasional"
    iconName="Workflow"
    categories={["Onboarding", "Produksi", "Keuangan", "Approval", "Delivery"]}
    addButtonLabel="Tambah Alur Kerja"
    titlePlaceholder="Misal: SOP Persetujuan Kontrak Klien"
    metricLabel="Tahapan / SLA"
  />
);
export default WorkflowsApp;
