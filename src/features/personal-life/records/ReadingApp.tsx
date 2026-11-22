import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const ReadingApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="personal_reading"
    title="Buku & Bahan Bacaan"
    subtitle="Pelacak target membaca buku, kutipan inspiratif & rak bacaan"
    iconName="Book"
    categories={["Bisnis & Strategi", "Keuangan", "Biografi", "Filsafat", "Teknologi"]}
    addButtonLabel="Tambah Bacaan"
    titlePlaceholder="Misal: Good Strategy Bad Strategy"
    metricLabel="Halaman / Progres Baca"
  />
);
export default ReadingApp;
