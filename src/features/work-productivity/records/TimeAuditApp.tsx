import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const TimeAuditApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="productivity_time_audit"
    title="Audit Waktu & Deep Work"
    subtitle="Pelacakan alokasi jam kerja produktif, analisis distraksi & ritme fokus"
    iconName="Timer"
    categories={["Deep Work", "Kolaborasi Tim", "Administrasi", "Riset & Belajar"]}
    addButtonLabel="Catat Blok Waktu"
    titlePlaceholder="Misal: Blok Fokus Penulisan Laporan Valuasi (120 mnt)"
    metricLabel="Durasi / Skor Fokus"
  />
);
export default TimeAuditApp;
