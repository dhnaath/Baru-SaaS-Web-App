import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const GiftsApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="people_gifts"
    title="Ide Kado & Tanda Kasih"
    subtitle="Pencatat preferensi bingkisan, riwayat kado & anggaran apresiasi"
    iconName="Gift"
    categories={["Keluarga", "Klien VIP", "Hari Raya", "Pernikahan", "Apresiasi Tim"]}
    addButtonLabel="Tambah Ide Kado"
    titlePlaceholder="Misal: Hampers Kopi Spesialti untuk Klien"
    metricLabel="Anggaran / Penerima"
  />
);
export default GiftsApp;
