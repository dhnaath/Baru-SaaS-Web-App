import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const FamilyTreeApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="family_tree"
    title="Silsilah & Keluarga Besar"
    subtitle="Pohon keluarga interaktif, generasi leluhur & direktori kontak"
    iconName="GitFork"
    categories={["Generasi Inti", "Orang Tua", "Kakek-Nenek", "Kerabat Dekat", "Trahluhur"]}
    addButtonLabel="Tambah Anggota Keluarga"
    titlePlaceholder="Misal: H. Ahmad Subarjo (Generasi II)"
    metricLabel="Hubungan / Domisili"
  />
);
export default FamilyTreeApp;
