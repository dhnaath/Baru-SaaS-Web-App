import React from "react";
import { GenericRecordModule } from "@/features/workspace-records/components/GenericRecordModule";

export const IntroductionsApp: React.FC = () => (
  <GenericRecordModule
    moduleKey="people_introductions"
    title="Jejaring & Perkenalan"
    subtitle="Log mediasi relasi dua arah, pembuka kolaborasi & follow-up"
    iconName="Network"
    categories={["Investor - Founder", "Klien - Vendor", "Mentor - Mentee", "Lintas Industri"]}
    addButtonLabel="Catat Perkenalan"
    titlePlaceholder="Misal: Intro Tim Supply Chain ke Logistik Nasional"
    metricLabel="Pihak Terhubung / Hasil"
  />
);
export default IntroductionsApp;
