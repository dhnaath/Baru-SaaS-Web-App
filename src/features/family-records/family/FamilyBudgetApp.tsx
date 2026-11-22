import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const FamilyBudgetApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="family_budget"
    title="Tabungan & Dana Keluarga"
    subtitle="Pos dana terarah, dana pendidikan anak & tabungan bersama"
    iconName="PiggyBank"
    categories={["Dana Pendidikan", "Dana Darurat Keluarga", "Tabungan Rumah", "Liburan", "Dana Orang Tua"]}
    addButtonLabel="Tambah Pos Dana"
    titlePlaceholder="Misal: Tabungan Pendidikan Kuliah Anak"
    metricLabel="Target Dana / Saldo"
  />
);
export default FamilyBudgetApp;
