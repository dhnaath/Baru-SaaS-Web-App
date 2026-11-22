import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const IncidentsApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="operations_incidents"
    title="Log Masalah & Insiden"
    subtitle="Pencatatan gangguan operasional, resolusi & analisis akar masalah"
    iconName="ShieldAlert"
    categories={["Sistem & IT", "Keselamatan Kerja", "Kualitas Layanan", "Keamanan", "Supplier"]}
    addButtonLabel="Catat Insiden"
    titlePlaceholder="Misal: Gangguan Jaringan Server Regional"
    metricLabel="Tingkat Dampak / PIC"
  />
);
export default IncidentsApp;
