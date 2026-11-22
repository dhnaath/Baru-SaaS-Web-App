import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const IpLicensesApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="ownership_ip_licenses"
    title="Hak Cipta & Lisensi IP"
    subtitle="Manajemen merek dagang, lisensi software, domain & paten"
    iconName="Award"
    categories={["Merek Dagang", "Hak Cipta", "Paten", "Domain", "Lisensi Software"]}
    addButtonLabel="Tambah Lisensi IP"
    titlePlaceholder="Misal: Merek Dagang Kelas 42 - DNA Consulting"
    metricLabel="Nomor Registrasi / Masa Berlaku"
  />
);
export default IpLicensesApp;
