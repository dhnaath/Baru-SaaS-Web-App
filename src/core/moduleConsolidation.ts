/**
 * Declarative module consolidation rules across the 8 consolidated workspaces.
 * Financial Planning, Creative Workspace, and Phase: Mutual-Self-Organization
 * remain completely untouched.
 *
 * Naming standard:
 * - Strictly no "&" character (always use "and").
 * - 2-word titles preferred; max 3 words ("X and Y") only when needed for clarity.
 * - Zero sub-items lost: all subMenus / features / tools / componentGroups are merged cleanly.
 */

export interface ModuleMergeRule {
  /** Exact IDs (or exact titles) of the source modules to merge into the first matched module. */
  sources: readonly string[];
  /** Consolidated display title (2 words, or 3 words with "and", never "&"). */
  title: string;
  /** Optional concise Indonesian summary description for the merged module. */
  desc?: string;
}

export const BIZ_OPS_MERGE_RULES: readonly ModuleMergeRule[] = [
  {
    sources: ["goals-and-performance", "biz-performance"],
    title: "Executive Overview",
    desc: "Pengelolaan sasaran OKR/KPI, evaluasi kinerja berkala, statistik operasional, pencarian terpadu, matriks hak akses, dan laporan kustom.",
  },
  {
    sources: ["vendor-management", "vendors-and-procurement", "biz-vendor-management", "biz-procurement"],
    title: "Vendor and Procurement",
    desc: "Direktori vendor, evaluasi SLA pemasok, penerbitan purchase order, persetujuan pengadaan, dan katalog produk terpadu.",
  },
  {
    sources: ["quality-control", "workplace-safety", "biz-quality-control", "biz-workplace-safety"],
    title: "Quality and Safety",
    desc: "Inspeksi kendali mutu, manajemen tiket operasional, keselamatan kerja, dan pencatatan insiden lapangan.",
  },
  {
    sources: ["client-records", "client-communications", "biz-client", "biz-client-comms"],
    title: "Client Management",
    desc: "Direktori klien dan mitra, portal komunikasi, perpesanan, riwayat interaksi, serta umpan balik pelanggan terpadu.",
  },
  {
    sources: ["service-scheduling", "commercial-services", "biz-scheduling", "biz-commercial-services"],
    title: "Commercial Services",
    desc: "Pesanan layanan, tarif jasa, penjadwalan antrean, reservasi janji temu, program loyalitas, dan keanggotaan klien.",
  },
  {
    sources: ["expense-control", "asset-management", "biz-expense-control", "biz-asset-management"],
    title: "Expense and Assets",
    desc: "Pengendalian biaya usaha, pajak dan PPN, langganan operasional, serta pengelolaan aset dan sumber daya perusahaan.",
  },
];

export const MBA_MERGE_RULES: readonly ModuleMergeRule[] = [
  {
    sources: ["competitive-analysis", "growth-strategy", "biz-mba-competitive-analysis", "biz-mba-growth-strategy"],
    title: "Competitive Strategy",
    desc: "Instrumen analisis daya saing (SWOT, PESTEL, Porter, VRIO, Value Chain) dan strategi pertumbuhan (BCG, Ansoff, Blue Ocean).",
  },
  {
    sources: ["business-design", "venture-validation", "biz-mba-business-design", "biz-mba-venture-validation"],
    title: "Business Design",
    desc: "Perancangan model bisnis (BMC, Lean Canvas, Value Proposition) hingga validasi MVP dan eksperimen Lean Startup.",
  },
  {
    sources: ["feasibility-analysis", "decision-frameworks", "biz-mba-feasibility-analysis", "biz-mba-decision-frameworks"],
    title: "Decision Analysis",
    desc: "Analisis kelayakan bisnis (CBA, Business Case, Pareto) dan kerangka pengambilan keputusan (Pugh, AHP, Eisenhower, Six Hats).",
  },
  {
    sources: ["ideation-frameworks", "technology-futures", "biz-mba-ideation-frameworks", "biz-mba-technology-futures"],
    title: "Innovation and Futures",
    desc: "Kerangka inovasi (Design Thinking, Doblin, SCAMPER, Open Innovation) serta pemetaan kesiapan teknologi dan tren masa depan.",
  },
  {
    sources: ["operations-management", "project-management", "biz-mba-operations-management", "biz-mba-project-management"],
    title: "Operations and Projects",
    desc: "Optimalisasi proses operasional (Six Sigma DMAIC, SIPOC) beserta tata kelola eksekusi proyek (RACI Matrix dan Gantt Chart).",
  },
  {
    sources: ["marketing-management", "customer-experience", "biz-mba-marketing-management", "biz-mba-customer-experience"],
    title: "Marketing Strategy",
    desc: "Strategi pemasaran (STP, 4P/7P, Product Life Cycle) terintegrasi dengan pemetaan pengalaman pelanggan (CJM dan Kano Model).",
  },
  {
    sources: ["product-discovery", "agile-delivery", "biz-mba-product-discovery", "biz-mba-agile-delivery"],
    title: "Product Delivery",
    desc: "Eksplorasi produk (Product Vision, RICE, MoSCoW, Opportunity Tree) hingga eksekusi pengiriman agile (Scrum, Story Mapping).",
  },
  {
    sources: ["sales-pipeline", "pricing-economics", "biz-mba-sales-pipeline", "biz-mba-pricing-economics"],
    title: "Sales and Pricing",
    desc: "Kerangka penjualan B2B (MEDDPICC, BANT, SPIN, Flywheel) beserta strategi penetapan harga, unit economics, dan analisis churn.",
  },
  {
    sources: ["talent-development", "performance-management", "biz-mba-talent-development", "biz-mba-performance-management"],
    title: "Talent and Performance",
    desc: "Pengembangan talenta (9-Box, 360 Feedback, Kirkpatrick, EVP) dan pengelolaan kinerja (Balanced Scorecard, OKR, SMART).",
  },
  {
    sources: ["team-culture", "change-management", "biz-mba-team-culture", "biz-mba-change-management"],
    title: "Culture and Change",
    desc: "Kepemimpinan dan budaya tim (Situational Leadership, Johari, Culture Map) beserta orkestrasi perubahan (McKinsey 7S, Kotter).",
  },
  {
    sources: ["risk-management", "policy-management", "biz-mba-risk-management", "biz-mba-policy-management"],
    title: "Risk and Policy",
    desc: "Manajemen risiko perusahaan (FMEA, ISO 31000, BCP) terpadu dengan perumusan kebijakan dan pemetaan pemangku kepentingan.",
  },
  {
    sources: ["brand-messaging", "stakeholder-relations", "biz-mba-brand-messaging", "biz-mba-stakeholder-relations"],
    title: "Brand and Stakeholders",
    desc: "Narasi merek (SCR Minto, Brand Archetypes, PESO, Press Release) beserta komunikasi krisis dan relasi pemangku kepentingan.",
  },
];

export const WORK_MERGE_RULES: readonly ModuleMergeRule[] = [
  {
    sources: ["goal-management", "goal-planning", "emp-goal-management", "emp-goal-planning"],
    title: "Goal Management",
    desc: "Penetapan sasaran terukur (SMART), penyelarasan tujuan, pengelolaan milestone, dan dashboard progres target.",
  },
  {
    sources: ["roadmap-management", "roadmap-planning", "emp-roadmap-management", "emp-roadmap-planning"],
    title: "Roadmap Planning",
    desc: "Penyusunan peta jalan strategis, timeline implementasi, dan pemetaan ketergantungan antar inisiatif.",
  },
  {
    sources: ["project-planning", "project-portfolio", "emp-project-planning", "emp-project-portfolio"],
    title: "Project Portfolio",
    desc: "Perencanaan ruang lingkup proyek, project brief, tinjauan portofolio, serta matriks prioritas lintas proyek.",
  },
  {
    sources: ["task-management", "task-tracking", "emp-task-management", "emp-task-tracking"],
    title: "Task Management",
    desc: "Penugasan, daftar tugas, antrean prioritas, pengingat otomatis, dan audit waktu penyelesaian pekerjaan.",
  },
  {
    sources: ["workflow-management", "workflow-design", "emp-workflow-management", "emp-workflow-design"],
    title: "Workflow Management",
    desc: "Papan Kanban visual, perancang alur kerja, pemetaan proses, dan template standar alur operasional.",
  },
  {
    sources: ["delivery-management", "delivery-tracking-module", "emp-delivery-management", "emp-delivery-tracking"],
    title: "Delivery Management",
    desc: "Ruang kendali serah terima proyek, daftar cek penerimaan hasil, dan alur persetujuan delivery.",
  },
  {
    sources: ["production-management", "production-planning", "emp-production-management", "emp-production-planning"],
    title: "Production Management",
    desc: "Pengelolaan proyek produksi, kalender publikasi, pipeline, penjadwalan, dan analitik capaian produksi.",
  },
  {
    sources: ["meeting-management", "meeting-coordination", "emp-meeting-management", "emp-meeting-coordination"],
    title: "Meeting Management",
    desc: "Penyusunan agenda rapat, pengingat otomatis, template notulensi, dan arsip keputusan pertemuan.",
  },
  {
    sources: ["decision-management", "decision-support", "emp-decision-management", "emp-decision-support"],
    title: "Decision Management",
    desc: "Daftar keputusan, riwayat pertimbangan, matriks evaluasi opsi, dan template ringkasan keputusan.",
  },
  {
    sources: ["risk-management", "risk-control", "emp-risk-management", "emp-risk-control"],
    title: "Risk Management",
    desc: "Mitigasi risiko, matriks penilaian risiko, register risiko aktif, dan notifikasi peringatan dini.",
  },
  {
    sources: ["issue-management", "issue-resolution", "emp-issue-management", "emp-issue-resolution"],
    title: "Issue Management",
    desc: "Pelacakan masalah, manajemen insiden, alur eskalasi, analisis akar masalah, dan laporan penyelesaian.",
  },
  {
    sources: [
      "performance-review",
      "productivity-analysis",
      "outcome-analysis",
      "emp-performance-review",
      "emp-productivity-analysis",
      "emp-outcome-analysis",
    ],
    title: "Performance Analysis",
    desc: "Evaluasi kinerja berkala, analisis kesenjangan, tren produktivitas, pemanfaatan waktu, dan realisasi manfaat.",
  },
];

export const FAMILY_MERGE_RULES: readonly ModuleMergeRule[] = [
  {
    sources: ["family-heritage", "family-members", "fam-heritage", "fam-members"],
    title: "Family Directory",
    desc: "Direktori anggota keluarga, silsilah keturunan, dan arsip sejarah perjalanan keluarga besar.",
  },
  {
    sources: ["household-management", "household-chores", "fam-household-management", "fam-chores"],
    title: "Household Operations",
    desc: "Pelacakan operasional rumah tangga, daftar pekerjaan harian, dan pembagian jadwal tugas keluarga.",
  },
  {
    sources: ["home-maintenance", "garden-and-pet-care", "fam-home-maintenance", "fam-garden-pet"],
    title: "Home Maintenance",
    desc: "Catatan dan jadwal perawatan rumah, pengelolaan kebun, perawatan hewan peliharaan, serta log aktivitas hunian.",
  },
  {
    sources: ["household-finance", "bills-and-payments", "fam-budget", "fam-bills-payments"],
    title: "Household Finance",
    desc: "Anggaran rumah tangga, pencatatan pengeluaran rutin, dan kalender jatuh tempo tagihan bulanan.",
  },
  {
    sources: ["property-records", "home-inventory", "home-utilities", "fam-property-records", "fam-home-inventory", "fam-home-utilities"],
    title: "Property and Assets",
    desc: "Register dokumen properti, inventaris aset rumah tangga, garansi kepemilikan, dan analitik konsumsi utilitas.",
  },
  {
    sources: ["kitchen-management", "meal-planning", "food-and-grocery-inventory", "fam-kitchen", "fam-meal-planning", "fam-food-grocery"],
    title: "Kitchen and Food",
    desc: "Koleksi resep keluarga, perencana menu mingguan, stok pantry, daftar belanja, dan pemantauan persediaan pangan.",
  },
  {
    sources: ["family-safety", "emergency-preparedness", "fam-safety", "fam-emergency-prep"],
    title: "Safety and Emergency",
    desc: "Daftar kontak darurat keluarga, kesiapsiagaan bencana, dan rencana respons kondisi darurat.",
  },
  {
    sources: ["vehicle-records", "vehicle-maintenance", "mobility-planning", "fam-vehicles", "fam-vehicle-maintenance", "fam-mobility-planning"],
    title: "Vehicle and Mobility",
    desc: "Register kendaraan, catatan BBM dan servis rutin, serta perencanaan mobilitas transportasi keluarga.",
  },
  {
    sources: ["family-documents", "family-calendar", "family-archives", "fam-family-documents", "fam-family-calendar", "fam-family-archives"],
    title: "Family Administration",
    desc: "Brankas dokumen penting keluarga, kalender kegiatan bersama, dan perpustakaan arsip keluarga.",
  },
];

export const SOCIAL_MERGE_RULES: readonly ModuleMergeRule[] = [
  {
    sources: ["people-manager-identity", "executive-contacts-book", "organization-directory", "net-people", "net-vault", "net-org-directory"],
    title: "People and Organizations",
    desc: "Profil identitas individu, daftar kontak, mitra strategis, profil organisasi, dan peta relasi antar lembaga.",
  },
  {
    sources: ["interaction-timeline-relations", "personal-connections", "relationship-insights", "net-relations", "net-personal-connections", "net-relationship-insights"],
    title: "Relationship Management",
    desc: "Jadwal tindak lanjut, riwayat diskusi, tanggal penting, dan analitik kesehatan kualitas relasi.",
  },
  {
    sources: ["circle-groups-communities", "community-engagement", "community-administration", "net-groups", "net-community-engagement", "net-community-administration"],
    title: "Community Management",
    desc: "Pengelolaan grup dan alumni, kalender kegiatan komunitas, partisipasi anggota, serta panduan komunitas.",
  },
  {
    sources: ["mentorship-introductions", "mentorship-and-advisory", "partnership-networks", "net-mentorship", "net-mentorship-advisory", "net-partnership-networks"],
    title: "Professional Networks",
    desc: "Sesi mentoring, dewan penasihat, perkenalan profesional, peta karier, dan jaringan kemitraan strategis.",
  },
  {
    sources: ["celebrations-gift-tracker", "social-events", "recognition-and-appreciation", "net-gifts", "net-social-events", "net-recognition-appreciation"],
    title: "Events and Occasions",
    desc: "Riwayat hadiah, kalender hari jadi, perencana acara sosial, undangan, dan catatan apresiasi relasi.",
  },
  {
    sources: ["communication-channels", "interaction-planning", "network-coordination", "net-communication-channels", "net-interaction-planning", "net-network-coordination"],
    title: "Communication Management",
    desc: "Preferensi kanal komunikasi, log interaksi harian, dan otomasi tindak lanjut jejaring.",
  },
];

export const PUBLIC_AFFAIRS_MERGE_RULES: readonly ModuleMergeRule[] = [
  {
    sources: ["komunitas-warga-rt-rw", "civic-calendar-agenda", "pub-community", "pub-calendar"],
    title: "Community Affairs",
    desc: "Direktori warga, kas lingkungan, persuratan, kalender kegiatan komunitas, jadwal rapat, dan notulensi.",
  },
  {
    sources: ["civic-services-guide", "civic-administration", "public-service-performance", "pub-services", "pub-civic-admin", "pub-service-performance"],
    title: "Public Services",
    desc: "Panduan layanan publik, persyaratan dokumen, direktori instansi, pengelolaan kasus, dan dashboard kinerja layanan.",
  },
  {
    sources: ["policy-compliance-audit", "legislative-monitoring", "pub-compliance", "pub-legislative-monitoring"],
    title: "Regulatory Compliance",
    desc: "Pelacak kepatuhan, audit legal, pustaka regulasi, pemantauan legislasi, dan notifikasi perubahan aturan.",
  },
  {
    sources: ["policy-research", "policy-development", "pub-policy-research", "pub-policy-dev"],
    title: "Policy Development",
    desc: "Ruang riset kebijakan, pustaka bukti, alur siklus penyusunan kebijakan, dan evaluasi dampak regulasi.",
  },
  {
    sources: ["advocacy-public-affairs", "public-consultation", "public-opinion-intelligence", "pub-advocacy", "pub-consultation", "pub-opinion-intel"],
    title: "Public Engagement",
    desc: "Advokasi publik, konsultasi masyarakat, survei opini, analitik sentimen, dan tren aspirasi publik.",
  },
  {
    sources: ["public-relations-media", "media-relations", "pub-pr", "pub-media-relations"],
    title: "Public Relations",
    desc: "Siaran pers, pembaruan pemangku kepentingan, pemantauan media, direktori jurnalis, dan agenda media briefing.",
  },
  {
    sources: ["stakeholder-relations", "government-relations", "interagency-coordination", "pub-stakeholder-relations", "pub-gov-relations", "pub-interagency-coord"],
    title: "Government Relations",
    desc: "Pemetaan pemangku kepentingan, kalender hubungan pemerintah, dan koordinasi aksi antar lembaga.",
  },
];

export const PERSONAL_MERGE_RULES: readonly ModuleMergeRule[] = [
  {
    sources: ["personal-development", "goal-and-life-planning", "personal-productivity", "per-personal-development", "per-goal-life-planning", "per-personal-productivity"],
    title: "Life Planning",
    desc: "Kebiasaan harian, blueprint hidup tahunan, proyek pribadi, fokus harian, dan analitik progres pribadi.",
  },
  {
    sources: ["health-and-fitness", "health-records", "per-health-fit", "per-health-rec"],
    title: "Health and Medical",
    desc: "Pelacakan olahraga, tidur, metrik tubuh, hidrasi, rekam medis, tanda vital, dan pengingat obat.",
  },
  {
    sources: ["mental-wellbeing", "nutrition-and-self-care", "per-mental-wellbeing", "per-nutrition-self-care"],
    title: "Personal Wellness",
    desc: "Pemeriksaan stres, rutinitas mindfulness, tren kesehatan emosional, nutrisi harian, dan perawatan diri.",
  },
  {
    sources: ["personal-journaling", "life-reflection", "per-journal", "per-life-reflection"],
    title: "Life Reflection",
    desc: "Jurnal harian, catatan syukur, pelacak suasana hati, ulasan berkala, kompas nilai, dan pelajaran hidup.",
  },
  {
    sources: ["personal-documents", "personal-records", "per-personal-documents", "per-personal-records"],
    title: "Personal Records",
    desc: "Register identitas dan sertifikat, pengingat perpanjangan dokumen, catatan pencapaian, dan kartu darurat medis.",
  },
  {
    sources: ["personal-budgeting", "income-and-expense-tracking", "savings-and-financial-goals", "per-personal-budgeting", "per-income-expense-tracking", "per-savings-financial-goals"],
    title: "Personal Finance",
    desc: "Anggaran pribadi, arus kas harian, catatan pemasukan dan pengeluaran, serta target tabungan pribadi.",
  },
  {
    sources: ["personal-learning", "skills-development", "reading-and-knowledge", "per-personal-learning", "per-skills-development", "per-reading-and-knowledge"],
    title: "Learning and Skills",
    desc: "Rencana belajar mandiri, inventaris keterampilan, matriks kesenjangan skill, dan log bacaan pribadi.",
  },
  {
    sources: ["hobbies-and-interests", "travel-and-experiences", "per-hobbies-and-interests", "per-travel-and-experiences"],
    title: "Lifestyle and Travel",
    desc: "Aktivitas hobi, perencanaan minat pribadi, daftar tujuan perjalanan, daftar bawaan, dan jurnal pengalaman.",
  },
  {
    sources: ["personal-security", "digital-privacy", "per-personal-security", "per-digital-privacy"],
    title: "Security and Privacy",
    desc: "Pengelolaan kata sandi, audit keamanan, panduan pemulihan, audit privasi, dan perlindungan jejak digital.",
  },
];

export const RESEARCH_MERGE_RULES: readonly ModuleMergeRule[] = [
  {
    sources: ["market-research", "industry-research", "res-market-research", "res-industry-research"],
    title: "Market Research",
    desc: "Kalkulasi ukuran pasar, analitik permintaan, profil industri, dan struktur lanskap sektor usaha.",
  },
  {
    sources: ["competitor-research", "customer-research", "opportunity-research", "res-competitor-research", "res-customer-research", "res-opportunity-research"],
    title: "Market Intelligence",
    desc: "Pemantauan kompetitor, persona dan suara pelanggan, pemetaan ruang kosong pasar, serta skor peluang.",
  },
  {
    sources: ["research-design", "research-methodology", "res-research-design", "res-research-methodology"],
    title: "Research Methods",
    desc: "Ruang desain riset, perumusan hipotesis, kalkulator sampel, panduan metodologi, dan validasi instrumen.",
  },
  {
    sources: ["academic-writing", "publication-research", "res-academic-writing", "res-publication-research"],
    title: "Academic Publication",
    desc: "Template manuskrip ilmiah, gaya sitasi, direktori jurnal target, alur peer-review, dan etika publikasi.",
  },
  {
    sources: ["data-intelligence", "business-insights", "res-data-intelligence", "res-business-insights"],
    title: "Business Intelligence",
    desc: "Katalog sumber data, analisis statistik, dashboard wawasan eksekutif, dan ringkasan insight lintas metrik.",
  },
  {
    sources: ["trend-analysis", "benchmarking", "res-trend-analysis", "res-benchmarking"],
    title: "Trends and Benchmarks",
    desc: "Pelacak sinyal tren, proyeksi deret waktu, notifikasi tren, dan matriks perbandingan benchmark industri.",
  },
  {
    sources: ["client-research", "strategic-research", "res-client-research", "res-strategic-research"],
    title: "Strategic Research",
    desc: "Profil latar belakang klien, alur discovery, evaluasi opsi strategis, dan rekomendasi konsultasi berbasis bukti.",
  },
  {
    sources: ["business-diagnosis", "feasibility-analysis", "res-business-diagnosis", "res-feasibility-analysis"],
    title: "Diagnostics and Feasibility",
    desc: "Asesmen diagnostik kematangan bisnis, skor kelayakan, analisis skenario, dan laporan studi kelayakan.",
  },
  {
    sources: ["mba-frameworks", "kurasi-pengetahuan", "res-frameworks", "res-kurasi"],
    title: "Business Frameworks",
    desc: "Pustaka kerangka kerja strategis (BCG, Porter, PESTEL) serta fondasi ilmu ekonomi, manajemen, dan komunikasi.",
  },
  {
    sources: ["reading-library", "reference-library", "res-reading", "res-reference-library"],
    title: "Reading and References",
    desc: "Daftar bacaan, catatan buku, bookmark, web clipper, register sitasi, dan panduan kurasi referensi.",
  },
];

export const SHARIA_MERGE_RULES: readonly ModuleMergeRule[] = [
  {
    sources: ["islamic-principles-and-ethics", "islamic-business-ethics", "sh-principles-ethics", "sh-business-ethics"],
    title: "Islamic Principles",
    desc: "Pustaka prinsip syariah, kerangka Maqasid al-Sharia, panduan etika bisnis Islam, dan asesmen keputusan etis.",
  },
  {
    sources: ["tabarru-hibah", "qardh-kebajikan", "sh-tabarru", "sh-qardh"],
    title: "Social Finance",
    desc: "Akad tabarru', hibah keluarga, infaq sedekah, buku pinjaman kebajikan Qardh Hasan, dan jadwal pengembalian pokok.",
  },
  {
    sources: ["mudharabah-bagi-hasil", "musyarakah-equity", "sh-mudharabah", "sh-musyarakah"],
    title: "Equity Contracts",
    desc: "Perhitungan bagi hasil Mudharabah, kemitraan modal Musharakah, kepemilikan porsi ekuitas, dan audit distribusi hasil.",
  },
  {
    sources: ["murabahah-costplus", "ijarah-sewa-manfaat", "salam-istishna-pesanan", "sh-murabahah", "sh-ijarah", "sh-salam-istisna"],
    title: "Trade Contracts",
    desc: "Akad jual beli Murabaha, sewa manfaat Ijarah dan IMBT, serta pemesanan Salam dan Istisna beserta jadwal angsuran.",
  },
  {
    sources: ["takaful-tamin", "wadiah-amanah", "sh-takaful", "sh-wadiah"],
    title: "Takaful and Custody",
    desc: "Pengelolaan dana tabarru' Takaful, klaim ta'awun, surplus underwriting, serta titipan Wadiah dan kustodi emas fisik.",
  },
  {
    sources: ["zakat-maal-portofolio", "zakat-penghasilan-profesi", "fidyah-kaffarah-fitrah", "sh-zakat-maal", "sh-zakat-profesi", "sh-zakat-fitrah"],
    title: "Zakat Management",
    desc: "Perhitungan zakat maal, nisab emas, haul, zakat penghasilan bulanan, distribusi LAZ, zakat fitrah, fidyah, dan kaffarah.",
  },
  {
    sources: ["audit-bebas-riba", "audit-gharar-maysir", "sh-audit-riba", "sh-audit-gharar"],
    title: "Sharia Compliance",
    desc: "Pembersihan bunga, identifikasi riba, pemeriksaan kejelasan objek akad, deteksi gharar-maysir, dan standar DSN-MUI/AAOIFI.",
  },
  {
    sources: ["sharia-governance-and-audit", "sharia-standards-and-fatwa", "sh-governance-audit", "sh-standards-fatwa"],
    title: "Sharia Governance",
    desc: "Dashboard tata kelola syariah, alur audit dan risiko syariah, pustaka fatwa, direktori standar, dan notifikasi pembaruan.",
  },
];

function findMatchingRule(
  id: string,
  rules: readonly ModuleMergeRule[]
): ModuleMergeRule | undefined {
  return rules.find((r) => r.sources.includes(id));
}

/**
 * Consolidates standard page app arrays (`WORK_APPS`, `FAMILY_HOUSEHOLD_APPS`, etc.)
 * that use `{ id, name, shortDesc, subMenus }`.
 */
export function consolidateSubMenuApps<
  T extends {
    id: string;
    name: string;
    shortDesc: string;
    subMenus: { id: string; label: string }[];
  }
>(apps: readonly T[], rules: readonly ModuleMergeRule[]): T[] {
  const result: T[] = [];
  const emittedRules = new Set<ModuleMergeRule>();

  for (const app of apps) {
    const rule = findMatchingRule(app.id, rules);
    if (!rule) {
      result.push(app);
      continue;
    }
    if (emittedRules.has(rule)) {
      continue;
    }
    emittedRules.add(rule);

    const matchedApps = apps.filter((item) => rule.sources.includes(item.id));
    const primary = matchedApps[0] || app;

    const mergedSubMenus: T["subMenus"] = [];
    const seenLabels = new Set<string>();
    for (const src of matchedApps) {
      for (const sub of src.subMenus) {
        const dedupeKey = sub.label.toLowerCase().trim();
        if (seenLabels.has(dedupeKey)) continue;
        seenLabels.add(dedupeKey);
        mergedSubMenus.push(sub);
      }
    }

    result.push({
      ...primary,
      name: rule.title,
      shortDesc: rule.desc || primary.shortDesc,
      subMenus: mergedSubMenus,
    });
  }

  return result;
}

/**
 * Consolidates `BIZ_OPS_APPS` which have `{ id, name, shortDesc, features, tools, componentGroups, subMenus }`.
 */
export function consolidateBizOpsApps<
  T extends {
    id: string;
    name: string;
    shortDesc: string;
    features: { id: string; label: string; to: string }[];
    tools: { id: string; label: string; to: string }[];
    componentGroups: { category: any; items: { id: string; label: string; to: string }[] }[];
    subMenus: { id: string; label: string; to: string }[];
  }
>(apps: readonly T[], rules: readonly ModuleMergeRule[]): T[] {
  const result: T[] = [];
  const emittedRules = new Set<ModuleMergeRule>();

  for (const app of apps) {
    const rule = findMatchingRule(app.id, rules);
    if (!rule) {
      result.push(app);
      continue;
    }
    if (emittedRules.has(rule)) {
      continue;
    }
    emittedRules.add(rule);

    const matchedApps = apps.filter((item) => rule.sources.includes(item.id));
    const primary = matchedApps[0] || app;

    const dedupeItems = <U extends { label: string }>(lists: U[][]): U[] => {
      const out: U[] = [];
      const seen = new Set<string>();
      for (const list of lists) {
        for (const it of list) {
          const k = it.label.toLowerCase().trim();
          if (seen.has(k)) continue;
          seen.add(k);
          out.push(it);
        }
      }
      return out;
    };

    const groupMap = new Map<string, { category: any; items: { id: string; label: string; to: string }[] }>();
    for (const src of matchedApps) {
      for (const grp of src.componentGroups) {
        const existing = groupMap.get(grp.category);
        if (!existing) {
          groupMap.set(grp.category, { category: grp.category, items: [...grp.items] });
        } else {
          const seen = new Set(existing.items.map((i) => i.label.toLowerCase().trim()));
          for (const it of grp.items) {
            const k = it.label.toLowerCase().trim();
            if (!seen.has(k)) {
              seen.add(k);
              existing.items.push(it);
            }
          }
        }
      }
    }

    result.push({
      ...primary,
      name: rule.title,
      shortDesc: rule.desc || primary.shortDesc,
      features: dedupeItems(matchedApps.map((m) => m.features)),
      tools: dedupeItems(matchedApps.map((m) => m.tools)),
      subMenus: dedupeItems(matchedApps.map((m) => m.subMenus)),
      componentGroups: Array.from(groupMap.values()),
    });
  }

  return result;
}

/**
 * Consolidates `STANDALONE_MBA_APPS` which have `{ id, title, subtitle, features }`.
 */
export function consolidateMbaApps<
  T extends {
    id: string;
    title: string;
    subtitle: string;
    features: { title: string }[];
  }
>(apps: readonly T[], rules: readonly ModuleMergeRule[]): T[] {
  const result: T[] = [];
  const emittedRules = new Set<ModuleMergeRule>();

  for (const app of apps) {
    const rule = findMatchingRule(app.id, rules);
    if (!rule) {
      result.push(app);
      continue;
    }
    if (emittedRules.has(rule)) {
      continue;
    }
    emittedRules.add(rule);

    const matchedApps = apps.filter((item) => rule.sources.includes(item.id));
    const primary = matchedApps[0] || app;

    const mergedFeatures: T["features"] = [];
    const seen = new Set<string>();
    for (const src of matchedApps) {
      for (const feat of src.features) {
        const k = feat.title.toLowerCase().trim();
        if (seen.has(k)) continue;
        seen.add(k);
        mergedFeatures.push(feat);
      }
    }

    result.push({
      ...primary,
      title: rule.title,
      subtitle: rule.desc || primary.subtitle,
      features: mergedFeatures,
    });
  }

  return result;
}

/**
 * Consolidates `WorkspaceModuleItem[]` inside `src/config/workspacePages.ts`
 * using the exact same rules so sidebar, compact hover menu, and hierarchy stay 100% synced.
 */
export function consolidateWorkspaceModules<
  T extends {
    id: string;
    title: string;
    desc?: string;
    features?: { title: string }[];
  }
>(modules: readonly T[], rules: readonly ModuleMergeRule[]): T[] {
  const result: T[] = [];
  const emittedRules = new Set<ModuleMergeRule>();

  for (const mod of modules) {
    const rule = findMatchingRule(mod.id, rules);
    if (!rule) {
      result.push(mod);
      continue;
    }
    if (emittedRules.has(rule)) {
      continue;
    }
    emittedRules.add(rule);

    const matchedMods = modules.filter((item) => rule.sources.includes(item.id));
    const primary = matchedMods[0] || mod;

    const mergedFeatures: NonNullable<T["features"]> = [];
    const seen = new Set<string>();
    for (const src of matchedMods) {
      for (const feat of src.features || []) {
        const k = feat.title.toLowerCase().trim();
        if (seen.has(k)) continue;
        seen.add(k);
        mergedFeatures.push(feat);
      }
    }

    result.push({
      ...primary,
      title: rule.title,
      desc: rule.desc || primary.desc,
      features: mergedFeatures,
    });
  }

  return result;
}

// ============================================================================
// Category Remap Architecture (Max 3–6 balanced categories, zero 0/1 orphans)
// Excluded workspaces: Financial Planning, Creative Workspace, Phase Side
// Already optimal (5 categories): Productivity Workspace, Research Foundations
// ============================================================================

export interface CategoryRemapEntry<C extends string = string> {
  category: C;
  label: string;
}

export const BIZ_CATEGORY_REMAP: Record<
  string,
  CategoryRemapEntry<
    "strategy" | "operations" | "commercial" | "finance" | "people" | "governance"
  >
> = {
  "Executive Overview": { category: "strategy", label: "Strategy" },
  "Strategic Frameworks": { category: "strategy", label: "Strategy" },
  "Vendor and Procurement": { category: "operations", label: "Operations" },
  "Inventory Management": { category: "operations", label: "Operations" },
  "Quality and Safety": { category: "operations", label: "Operations" },
  "Document Management": { category: "operations", label: "Operations" },
  "Client Management": { category: "commercial", label: "Commercial" },
  "Commercial Services": { category: "commercial", label: "Commercial" },
  "Expense and Assets": { category: "finance", label: "Finance" },
  "Business Valuation": { category: "finance", label: "Finance" },
  "Workforce Management": { category: "people", label: "People" },
  "Corporate Governance": { category: "governance", label: "Governance" },
};

export const SHARIA_CATEGORY_REMAP: Record<
  string,
  CategoryRemapEntry<"governance" | "contracts" | "social" | "wealth">
> = {
  "Islamic Principles": { category: "governance", label: "Governance" },
  "Sharia Compliance": { category: "governance", label: "Governance" },
  "Sharia Governance": { category: "governance", label: "Governance" },
  "Equity Contracts": { category: "contracts", label: "Contracts" },
  "Trade Contracts": { category: "contracts", label: "Contracts" },
  "Social Finance": { category: "social", label: "Social" },
  "Waqf Management": { category: "social", label: "Social" },
  "Zakat Management": { category: "social", label: "Social" },
  "Takaful and Custody": { category: "wealth", label: "Wealth" },
  "Sharia Investments": { category: "wealth", label: "Wealth" },
};

export const PERSONAL_CATEGORY_REMAP: Record<
  string,
  CategoryRemapEntry<"growth" | "wellness" | "administration" | "lifestyle" | "technology">
> = {
  "Life Planning": { category: "growth", label: "Growth" },
  "Life Reflection": { category: "growth", label: "Growth" },
  "Learning and Skills": { category: "growth", label: "Growth" },
  "Health and Medical": { category: "wellness", label: "Wellness" },
  "Personal Wellness": { category: "wellness", label: "Wellness" },
  "Personal Records": { category: "administration", label: "Administration" },
  "Personal Scheduling": { category: "administration", label: "Administration" },
  "Personal Finance": { category: "administration", label: "Administration" },
  "Lifestyle and Travel": { category: "lifestyle", label: "Lifestyle" },
  "Personal Assets": { category: "lifestyle", label: "Lifestyle" },
  "Security and Privacy": { category: "technology", label: "Technology" },
  "Personal Utilities": { category: "technology", label: "Technology" },
};

export const FAMILY_CATEGORY_REMAP: Record<
  string,
  CategoryRemapEntry<"family" | "operations" | "finance" | "living" | "safety">
> = {
  "Family Directory": { category: "family", label: "Family" },
  "Family Coordination": { category: "family", label: "Family" },
  "Family Administration": { category: "family", label: "Family" },
  "Household Operations": { category: "operations", label: "Operations" },
  "Home Maintenance": { category: "operations", label: "Operations" },
  "Household Finance": { category: "finance", label: "Finance" },
  "Property and Assets": { category: "finance", label: "Finance" },
  "Kitchen and Food": { category: "living", label: "Living" },
  "Vehicle and Mobility": { category: "living", label: "Living" },
  "Safety and Emergency": { category: "safety", label: "Safety" },
  "Family Health": { category: "safety", label: "Safety" },
};

export const PUBLIC_AFFAIRS_CATEGORY_REMAP: Record<
  string,
  CategoryRemapEntry<"community" | "governance" | "engagement" | "relations">
> = {
  "Community Affairs": { category: "community", label: "Community" },
  "Community Development": { category: "community", label: "Community" },
  "Regulatory Compliance": { category: "governance", label: "Governance" },
  "Policy Development": { category: "governance", label: "Governance" },
  "Public Services": { category: "engagement", label: "Engagement" },
  "Public Engagement": { category: "engagement", label: "Engagement" },
  "Public Relations": { category: "relations", label: "Relations" },
  "Government Relations": { category: "relations", label: "Relations" },
};

export const SOCIAL_CATEGORY_REMAP: Record<
  string,
  CategoryRemapEntry<"directory" | "relationships" | "communities">
> = {
  "People and Organizations": { category: "directory", label: "Directory" },
  "Professional Networks": { category: "directory", label: "Directory" },
  "Relationship Management": { category: "relationships", label: "Relationships" },
  "Communication Management": { category: "relationships", label: "Relationships" },
  "Community Management": { category: "communities", label: "Communities" },
  "Events and Occasions": { category: "communities", label: "Communities" },
};

/**
 * Remaps consolidated launcher app categories (`category`, `categoryLabel`, `badge`, `badgeText`)
 * and optionally orders apps stably by `categoryOrder`.
 */
export function remapAppCategories<
  C extends string,
  T extends {
    name: string;
    category: string;
    categoryLabel: string;
    badge: string;
    badgeText: string;
  }
>(
  apps: readonly T[],
  remap: Record<string, CategoryRemapEntry<C>>,
  categoryOrder?: readonly C[]
): (Omit<T, "category"> & { category: C })[] {
  const mapped = apps.map((app) => {
    const entry = remap[app.name];
    if (!entry) {
      return {
        ...app,
        category: app.category as C,
      };
    }
    return {
      ...app,
      category: entry.category,
      categoryLabel: entry.label,
      badge: entry.label,
      badgeText: entry.label,
    };
  });

  if (!categoryOrder || categoryOrder.length === 0) return mapped;

  return mapped
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const idxA = categoryOrder.indexOf(a.item.category);
      const idxB = categoryOrder.indexOf(b.item.category);
      const rankA = idxA === -1 ? 999 : idxA;
      const rankB = idxB === -1 ? 999 : idxB;
      if (rankA !== rankB) return rankA - rankB;
      return a.index - b.index;
    })
    .map((entry) => entry.item);
}

/**
 * Remaps consolidated `WorkspaceModuleItem[]` category labels in `workspacePages.ts`
 * and optionally orders modules stably by `categoryLabelOrder`.
 */
export function remapWorkspaceCategories<
  T extends {
    title: string;
    categoryLabel?: string;
  }
>(
  modules: readonly T[],
  remap: Record<string, CategoryRemapEntry>,
  categoryLabelOrder?: readonly string[]
): T[] {
  const mapped = modules.map((mod) => {
    const entry = remap[mod.title];
    if (!entry) return mod;
    return {
      ...mod,
      categoryLabel: entry.label,
    };
  });

  if (!categoryLabelOrder || categoryLabelOrder.length === 0) return mapped;

  return mapped
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const idxA = categoryLabelOrder.indexOf(a.item.categoryLabel || "");
      const idxB = categoryLabelOrder.indexOf(b.item.categoryLabel || "");
      const rankA = idxA === -1 ? 999 : idxA;
      const rankB = idxB === -1 ? 999 : idxB;
      if (rankA !== rankB) return rankA - rankB;
      return a.index - b.index;
    })
    .map((entry) => entry.item);
}

