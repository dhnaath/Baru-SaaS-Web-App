import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const MeetingsApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="productivity_meetings"
    title="Notulensi Rapat & Keputusan"
    subtitle="Pencatatan agenda rapat, keputusan konsensus & daftar PIC"
    iconName="CalendarCheck"
    categories={["Rapat Direksi", "Review Klien", "Weekly Sync", "Townhall", "Komite Audit"]}
    addButtonLabel="Tambah Notulen"
    titlePlaceholder="Misal: Review Roadmap Produk Semester II"
    metricLabel="Keputusan / Daftar PIC"
  />
);
export default MeetingsApp;
