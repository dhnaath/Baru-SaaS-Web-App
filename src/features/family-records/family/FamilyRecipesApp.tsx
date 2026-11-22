import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const FamilyRecipesApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="family_recipes"
    title="Resep Warisan Keluarga"
    subtitle="Buku resep turun-temurun, takaran porsi & bumbu khas"
    iconName="ChefHat"
    categories={["Masakan Utama", "Kue Tradisional", "Sambal & Bumbu", "Minuman", "Menu Lebaran"]}
    addButtonLabel="Tambah Resep"
    titlePlaceholder="Misal: Rendang Padang Nenek"
    metricLabel="Porsi / Waktu Masak"
  />
);
export default FamilyRecipesApp;
