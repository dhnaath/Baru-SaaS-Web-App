import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const ContactsApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="people_contacts"
    title="Buku Kontak & Relasi"
    subtitle="Direktori relasi profesional, personal, riwayat interaksi & tag"
    iconName="Users"
    categories={["Klien Utama", "Mitra Strategis", "Investor", "Penasihat", "Keluarga & Sahabat"]}
    addButtonLabel="Tambah Kontak"
    titlePlaceholder="Misal: Budi Santoso - Direktur Operasional"
    metricLabel="Instansi / Telepon"
  />
);
export default ContactsApp;
