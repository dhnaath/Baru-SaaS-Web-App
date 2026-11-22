import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const ProjectsApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="productivity_projects"
    title="Proyek & Inisiatif Kerja"
    subtitle="Papan perencanaan multi-proyek, progres tahapan & deliverable"
    iconName="FolderKanban"
    categories={["Konsultasi Klien", "Transformasi Digital", "Riset Pasar", "Ekspansi Internal"]}
    addButtonLabel="Tambah Proyek"
    titlePlaceholder="Misal: Implementasi ERP PT Sejahtera"
    metricLabel="Fase / Target Selesai"
  />
);
export default ProjectsApp;
