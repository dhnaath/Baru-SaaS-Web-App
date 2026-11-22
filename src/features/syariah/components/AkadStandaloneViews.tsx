import React, { useState } from "react";
import {
  HeartHandshake,
  Scale,
  Handshake,
  Archive,
  Users,
  Tag,
  CheckCircle2,
  Calculator,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Shield,
  Heart,
  Building,
  Building2,
  Coins,
  Gift,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AkadType =
  | "tabarru"
  | "mudharabah"
  | "wakalah"
  | "wadiah"
  | "musyarakah"
  | "murabahah"
  | "tamin"
  | "takaful"
  | "tadhamun"
  | "ijarah"
  | "qardh"
  | "hibah"
  | "wakaf"
  | "salam"
  | "istishna";

export function resolveAkadId(raw?: string | null): AkadType | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase() as AkadType;
  return key in AKAD_DATA ? key : null;
}

export interface AkadDetailInfo {
  id: AkadType;
  title: string;
  arabicName: string;
  badge: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  description: string;
  dalil: {
    text: string;
    source: string;
  };
  rukun: string[];
  syaratSah: string[];
  skemaAlur: { step: number; title: string; desc: string }[];
  contohPenerapan: string[];
}

export const AKAD_DATA: Record<AkadType, AkadDetailInfo> = {
  tabarru: {
    id: "tabarru",
    title: "Tabarru'",
    arabicName: "عقد التبرع",
    badge: "Non-Profit / Kebajikan",
    category: "Sharia Finance",
    icon: HeartHandshake,
    tagline: "Prinsip tolong-menolong tanpa berorientasi keuntungan komersial (ta'awun).",
    description:
      "Akad Tabarru' adalah segala bentuk perjanjian yang dilakukan dengan tujuan tolong-menolong murni dan kebajikan sosial (non-profit), bukan untuk mencari laba finansial (tijarah). Instrumen ini merupakan fondasi utama sistem asuransi syariah (takaful), pinjaman kebajikan (qardh al-hasan), wakaf, hibah, dan sedekah.",
    dalil: {
      text: "“Dan tolong-menolonglah kamu dalam (mengerjakan) kebajikan dan takwa, dan jangan tolong-menolong dalam berbuat dosa dan pelanggaran.”",
      source: "QS. Al-Ma'idah (5): 2",
    },
    rukun: [
      "Pemberi dana kebajikan / donatur (Mutabarri')",
      "Penerima kebajikan / peserta saling tolong (Mutabarra' lahu)",
      "Objek atau dana kebajikan yang diserahkan (Mauquf / Mauhub / Tabarru')",
      "Ijab dan qabul (Shighat pernyataan komitmen tolong-menolong)",
    ],
    syaratSah: [
      "Pemberi memiliki kecakapan hukum (baligh, berakal, sukarela)",
      "Harta yang ditabarrru'kan milik sah dan halal",
      "Tidak boleh mensyaratkan imbalan keuntungan finansial materiil",
      "Peruntukan dana jelas untuk kemaslahatan dan pertanggungan bersama",
    ],
    skemaAlur: [
      {
        step: 1,
        title: "Iuran Kebajikan",
        desc: "Peserta/donatur menyetorkan kontribusi dana kebajikan dengan niat ikhlas saling melindungi.",
      },
      {
        step: 2,
        title: "Pengumpulan Pool Risiko",
        desc: "Dana dikumpulkan dalam satu rekening terpisah (Dana Tabarru') yang dikelola secara amanah.",
      },
      {
        step: 3,
        title: "Santunan & Klaim Musibah",
        desc: "Jika ada peserta terkena musibah, santunan dibayarkan dari dana pool kebajikan tersebut.",
      },
      {
        step: 4,
        title: "Surplus Underwriting",
        desc: "Sisa dana jika klaim lebih rendah dari kontribusi dapat disimpan sebagai cadangan atau dibagikan kembali.",
      },
    ],
    contohPenerapan: [
      "Dana Ta'awun pada Asuransi Jiwa & Kerugian Syariah (Takaful)",
      "Qardh al-Hasan (Pembiayaan kebajikan tanpa tambahan bunga)",
      "Dana Abadi Wakaf Tunai & Pemberdayaan Umat",
      "Kotak Darurat Solidaritas & Komunitas Sosial",
    ],
  },

  mudharabah: {
    id: "mudharabah",
    title: "Mudharabah",
    arabicName: "عقد المضاربة",
    badge: "Kemitraan Bagi Hasil",
    category: "Sharia Finance",
    icon: Scale,
    tagline: "Kemitraan usaha antara pemilik modal 100% dan pengelola berkeahlian.",
    description:
      "Akad Mudharabah adalah kerja sama permodalan usaha di mana pihak pertama (Shahibul Maal) menyediakan seluruh modal (100%), sedangkan pihak kedua (Mudharib) bertindak selaku pengelola usaha. Keuntungan dibagi berdasarkan rasio nisbah yang disepakati di muka. Jika terjadi kerugian finansial di luar kelalaian pengelola, kerugian ditanggung penuh oleh pemilik modal, sementara pengelola rugi waktu dan tenaga.",
    dalil: {
      text: "“...dan orang-orang yang berjalan di bumi mencari sebagian karunia Allah (berniaga/berusaha)...”",
      source: "QS. Al-Muzzammil (73): 20 & HR. Ibnu Majah",
    },
    rukun: [
      "Pemilik modal (Shahibul Maal)",
      "Pengelola modal / enterpreneur (Mudharib)",
      "Modal usaha tunai atau likuid yang jelas jumlahnya (Ra's al-Maal)",
      "Kerja / aktivitas usaha yang diizinkan syariah (Amal)",
      "Nisbah bagi hasil yang disepakati di muka (Ribh)",
      "Ijab dan qabul (Shighat)",
    ],
    syaratSah: [
      "Modal harus berupa uang tunai atau aset yang jelas nilainya, bukan piutang",
      "Pembagian keuntungan berupa persentase rasio nisbah (misal 60:40), bukan nominal rupiah tetap",
      "Pengelola tidak boleh menjamin modal akan kembali utuh (kecuali ada ta'addi / wanprestasi)",
      "Bidang usaha harus halal dan tidak melanggar ketentuan syariah",
    ],
    skemaAlur: [
      {
        step: 1,
        title: "Penyertaan Modal 100%",
        desc: "Shahibul Maal menyetorkan dana modal secara penuh kepada Mudharib.",
      },
      {
        step: 2,
        title: "Pengelolaan Bisnis Mandiri",
        desc: "Mudharib mengoperasikan bisnis secara profesional tanpa intervensi berlebihan dari pemilik modal.",
      },
      {
        step: 3,
        title: "Penghitungan Laba Bersih",
        desc: "Pendapatan dikurangi biaya operasional riil menghasilkan laba bersih usaha.",
      },
      {
        step: 4,
        title: "Distribusi Nisbah Laba",
        desc: "Laba dibagi sesuai rasio nisbah yang disepakati; modal pokok dikembalikan pada akhir masa akad.",
      },
    ],
    contohPenerapan: [
      "Deposito Mudharabah Mutlaqah di Bank Syariah",
      "Pendanaan Proyek UMKM / Modal Kerja Ventura Syariah",
      "Pengelolaan Portofolio Investasi Reksadana Syariah",
      "Kemitraan Usaha Ritel & Warung Berkah",
    ],
  },

  wakalah: {
    id: "wakalah",
    title: "Wakalah",
    arabicName: "عقد الوكالة",
    badge: "Pelimpahan Kuasa / Jasa",
    category: "Sharia Finance",
    icon: Handshake,
    tagline: "Pelimpahan kuasa perwakilan untuk melaksanakan tindakan legal tertentu.",
    description:
      "Akad Wakalah adalah pelimpahan kuasa oleh seseorang (Muwakkil) kepada orang lain (Wakil) dalam hal-hal yang boleh diwakilkan. Dalam transaksi keuangan modern, sering digunakan bentuk Wakalah bil Ujrah, di mana wakil menerima upah atau imbalan jasa (fee) atas tugas perwakilan yang dijalankannya secara amanah.",
    dalil: {
      text: "“...Maka suruhlah salah seorang di antaramu pergi ke kota dengan membawa uang perakmu ini...”",
      source: "QS. Al-Kahfi (18): 19",
    },
    rukun: [
      "Pemberi kuasa (Muwakkil)",
      "Penerima kuasa (Wakil)",
      "Objek atau urusan yang dikuasakan (Taukil / Muwakkal fih)",
      "Ijab dan qabul penyerahan kuasa (Shighat)",
    ],
    syaratSah: [
      "Muwakkil memiliki hak legal penuh atas urusan yang diwakilkan",
      "Wakil memiliki kecakapan menjalankan amanah",
      "Pekerjaan yang dikuasakan jelas dan dibenarkan syariah (bukan maksiat)",
      "Jika memakai upah (Wakalah bil Ujrah), besaran ujrah harus transparan di awal",
    ],
    skemaAlur: [
      {
        step: 1,
        title: "Pemberian Mandat Kuasa",
        desc: "Muwakkil menunjuk Wakil dengan batasan wewenang dan instruksi yang terperinci.",
      },
      {
        step: 2,
        title: "Penetapan Biaya Jasa (Ujrah)",
        desc: "Kedua pihak menyepakati nominal atau persentase imbalan jasa atas pelaksanaan mandat.",
      },
      {
        step: 3,
        title: "Eksekusi Transaksi / Pekerjaan",
        desc: "Wakil bertindak atas nama Muwakkil secara amanah dan bertanggung jawab.",
      },
      {
        step: 4,
        title: "Laporan & Penyelesaian Ujrah",
        desc: "Wakil menyerahkan hasil pekerjaan/barang dan menerima upah jasa yang telah disepakati.",
      },
    ],
    contohPenerapan: [
      "Wakalah bil Ujrah pada Pengelolaan Investasi Asuransi Takaful",
      "Letter of Credit (L/C) Impor & Ekspor Bank Syariah",
      "Layanan Transfer Uang, RTGS, dan Pembayaran Tagihan Pihak Ketiga",
      "Jasa Keagenan Properti & Kuasa Hukum Syariah",
    ],
  },

  wadiah: {
    id: "wadiah",
    title: "Wadiah",
    arabicName: "عقد الوديعة",
    badge: "Penitipan Amanah Murni",
    category: "Sharia Finance",
    icon: Archive,
    tagline: "Penitipan barang atau dana murni dengan jaminan keamanan utuh.",
    description:
      "Akad Wadiah adalah akad penitipan barang atau uang dari pihak penitip (Muaddi') kepada pihak penerima titipan (Mustauda') yang dipercaya untuk menjaga keutuhannya. Dikenal dua jenis: Wadiah Yad al-Amanah (titipan murni tanpa hak pakai) dan Wadiah Yad adh-Dhamanah (titipan dengan hak pemanfaatan oleh pengelola dengan jaminan dana dapat ditarik sewaktu-waktu 100%).",
    dalil: {
      text: "“Sesungguhnya Allah menyuruh kamu menyampaikan amanat kepada yang berhak menerimanya...”",
      source: "QS. An-Nisa (4): 58",
    },
    rukun: [
      "Penitip barang / dana (Muaddi')",
      "Penerima titipan (Mustauda')",
      "Barang / dana yang dititipkan (Wadi'ah)",
      "Ijab dan qabul penitipan (Shighat)",
    ],
    syaratSah: [
      "Barang atau dana merupakan aset bernilai yang sah secara syariat",
      "Penerima titipan wajib menjaga keselamatan titipan layaknya harta sendiri",
      "Pada Wadiah Yad Dhomanah, pengelola bertanggung jawab mengembalikan utuh kapan pun diminta",
      "Pemberian bonus/hibah dari pengelola bersifat sukarela tanpa boleh dijanjikan di awal",
    ],
    skemaAlur: [
      {
        step: 1,
        title: "Penyerahan Titipan Dana/Barang",
        desc: "Nasabah menitipkan dana pada institusi pengelola dengan akad perlindungan.",
      },
      {
        step: 2,
        title: "Pengamanan & Hak Pemanfaatan",
        desc: "Pengelola menjaga dana (Yad Amanah) atau memanfaatkan untuk usaha halal berisiko terukur (Yad Dhomanah).",
      },
      {
        step: 3,
        title: "Likuiditas Penarikan Bebas",
        desc: "Penitip dapat menarik kembali dananya kapan saja sesuai kebutuhan tanpa hambatan.",
      },
      {
        step: 4,
        title: "Pemberian Bonus Sukarela (Athaya)",
        desc: "Pengelola diperkenankan memberikan insentif/bonus sukarela murni tanpa keterikatan janji di muka.",
      },
    ],
    contohPenerapan: [
      "Rekening Giro Wadiah (Demand Deposit) Perbankan Syariah",
      "Tabungan Wadiah Bebas Biaya Administrasi Pokok",
      "Safe Deposit Box (SDB) Penyimpanan Emas & Dokumen Berharga",
      "Dompet Digital Syariah / Escrow Account Penitipan Transaksi",
    ],
  },

  musyarakah: {
    id: "musyarakah",
    title: "Musyarakah",
    arabicName: "عقد المشاركة",
    badge: "Kemitraan Modal Bersama",
    category: "Sharia Finance",
    icon: Users,
    tagline: "Persekutuan modal dan keahlian untuk mendirikan usaha bersama.",
    description:
      "Akad Musyarakah adalah akad kerja sama antara dua pihak atau lebih untuk suatu usaha tertentu, di mana masing-masing pihak memberikan kontribusi dana/modal (syirkah al-amwal) atau keahlian kerja. Laba dibagi sesuai rasio nisbah yang disepakati bersama, sedangkan kerugian ditanggung proporsional sesuai rasio kontribusi modal masing-masing pihak.",
    dalil: {
      text: "“...maka mereka bersekutu dalam yang sepertiga itu...”",
      source: "QS. An-Nisa (4): 12 & Hadits Qudsi riwayat Abu Dawud",
    },
    rukun: [
      "Para mitra yang berakad (Syariik / Musytarikun)",
      "Objek kerja sama: Modal (Hishshah) dan Usaha (Amal)",
      "Proyeksi keuntungan dan nisbah bagi hasil (Ribh)",
      "Ijab dan qabul kesepakatan kemitraan (Shighat)",
    ],
    syaratSah: [
      "Semua mitra menyetorkan porsi modal yang jelas",
      "Hak pengelolaan dapat dilakukan bersama atau didelegasikan kepada salah satu mitra",
      "Keuntungan dibagi berdasarkan nisbah yang disepakati, bukan fixed return modal",
      "Kerugian dibagi mutlak sebanding dengan persentase modal yang disetor (Losses proportional to capital)",
    ],
    skemaAlur: [
      {
        step: 1,
        title: "Penyatuan Modal (Joint Capital)",
        desc: "Para mitra menggabungkan modal tunai untuk membiayai usaha bersama.",
      },
      {
        step: 2,
        title: "Manajemen & Tata Kelola",
        desc: "Pengoperasian bisnis diawasi bersama dengan transparansi pembukuan berkala.",
      },
      {
        step: 3,
        title: "Kalkulasi Laba & Beban",
        desc: "Hasil usaha diaudit untuk memisahkan biaya operasional dan laba bersih.",
      },
      {
        step: 4,
        title: "Pembagian Sesuai Nisbah",
        desc: "Laba didistribusikan sesuai nisbah, atau modal dicicil berkurang (Musyarakah Mutanaqisah).",
      },
    ],
    contohPenerapan: [
      "Pembiayaan Musyarakah Mutanaqisah (MMQ) untuk Kepemilikan Rumah/Aset",
      "Sindikasi Pembiayaan Infrastruktur & Proyek Korporasi Syariah",
      "Joint Venture Pendirian Perusahaan Rintisan (Startup Kemitraan)",
      "Investasi Ekuitas Private Equity Berprinsip Syariah",
    ],
  },

  murabahah: {
    id: "murabahah",
    title: "Murabahah",
    arabicName: "عقد المرابحة",
    badge: "Jual Beli Margin Transparan",
    category: "Sharia Finance",
    icon: Tag,
    tagline: "Jual beli komoditas/barang dengan pengungkapan harga beli dan margin laba disepakati.",
    description:
      "Akad Murabahah adalah akad jual beli barang di mana penjual secara transparan memberitahukan harga perolehan (harga beli pokok) barang kepada pembeli, kemudian menyepakati tambahan margin keuntungan (ribh/mark-up). Pembayaran dapat dilakukan secara tunai maupun angsuran/cicilan (bai' bi tsaman ajil) dengan cicilan tetap tanpa bunga mengambang.",
    dalil: {
      text: "“...padahal Allah telah menghalalkan jual beli dan mengharamkan riba...”",
      source: "QS. Al-Baqarah (2): 275",
    },
    rukun: [
      "Penjual (Ba'i)",
      "Pembeli (Musytari)",
      "Barang yang diperjualbelikan (Mabi')",
      "Harga pokok ditambah margin keuntungan (Tsaman)",
      "Ijab dan qabul jual beli (Shighat)",
    ],
    syaratSah: [
      "Penjual harus memiliki barang secara sah sebelum menjualnya kepada pembeli",
      "Harga pokok perolehan dan besaran margin laba harus diumumkan secara jujur dan transparan",
      "Barang harus halal, bernilai, dan dapat diserahterimakan",
      "Cicilan bernilai tetap (fixed payment) dan tidak boleh ada bunga denda keterlambatan yang dinikmati sebagai pendapatan bunga",
    ],
    skemaAlur: [
      {
        step: 1,
        title: "Permintaan & Spesifikasi Barang",
        desc: "Nasabah memesan barang yang diinginkan dan bank/lembaga membeli barang dari suplier.",
      },
      {
        step: 2,
        title: "Kepemilikan Sah Penjual",
        desc: "Lembaga syariah membeli dan menguasai barang secara sah (prinsip qabdh).",
      },
      {
        step: 3,
        title: "Akad Jual Beli Margin",
        desc: "Barang dijual ke nasabah dengan harga: Harga Pokok + Margin Keuntungan Transparan.",
      },
      {
        step: 4,
        title: "Pembayaran Angsuran Tetap",
        desc: "Nasabah mencicil pembayaran bulanan secara pasti tanpa fluktuasi suku bunga.",
      },
    ],
    contohPenerapan: [
      "Pembiayaan Kepemilikan Rumah (KPR Murabahah Cicilan Tetap)",
      "Pembiayaan Kendaraan Bermotor Syariah",
      "Pengadaan Mesin, Alat Produksi & Bahan Baku Usaha",
      "Pembiayaan Alat Elektronik & Kebutuhan Konsumtif Halal",
    ],
  },
  tamin: {
    id: "tamin",
    title: "Ta'min",
    arabicName: "التأمين",
    badge: "Proteksi / Rasa Aman",
    category: "Sharia Finance",
    icon: Shield,
    tagline: "Prinsip perlindungan dan mitigasi risiko demi terwujudnya rasa aman (amanah & tenang).",
    description:
      "Ta'min secara etimologi bermakna memberikan rasa aman, perlindungan, dan ketenangan (al-amnu). Dalam muamalah syariah, Ta'min merupakan ikhtiar terencana untuk melindungi diri, keluarga, dan harta benda dari musibah dan risiko finansial melalui mekanisme ta'awun (saling membantu) tanpa unsur maisir (judi), riba (bunga), maupun gharar (ketidakpastian komersial).",
    dalil: {
      text: "“Seseorang bertanya kepada Rasulullah ﷺ: 'Apakah aku ikat untaku lalu aku bertawakal, atau aku lepas saja lalu bertawakal?' Beliau bersabda: 'Ikatlah untamu terlebih dahulu, kemudian bertawakallah.'”",
      source: "HR. Tirmidzi no. 2517 (Hasan)",
    },
    rukun: [
      "Mu'ammin (Pengelola proteksi / peserta saling mengikat)",
      "Mu'amman Lahu (Pihak penerima perlindungan / manfaat)",
      "Mu'amman 'Alaih (Objek perlindungan yang sah secara syariat)",
      "Mablaq At-Ta'min (Kontribusi dana ta'min)",
      "Ijab dan Qabul (Kesepakatan saling melindungi dan tolong-menolong)",
    ],
    syaratSah: [
      "Objek yang dilindungi bukan barang atau aktivitas yang diharamkan syariat",
      "Bebas dari pertaruhan (maisir) dan denda riba penalti keterlambatan",
      "Klausul ganti rugi atau santunan transparan dan terukur tanpa gharar",
      "Didasari niat ikhtiar mitigasi risiko, bukan mengejar spekulasi laba finansial",
    ],
    skemaAlur: [
      { step: 1, title: "Identifikasi Risiko", desc: "Peserta memetakan potensi risiko kesehatan, jiwa, atau aset riil yang membutuhkan perlindungan." },
      { step: 2, title: "Akad Ta'min Ta'awuni", desc: "Menyepakati komitmen bersama untuk saling memproteksi melalui kontribusi terukur." },
      { step: 3, title: "Pengelolaan & Investasi Halal", desc: "Dana proteksi dikelola secara amanah dan diinvestasikan pada portofolio syariah." },
      { step: 4, title: "Penyaluran Santunan Proteksi", desc: "Pemberian santunan rasa aman saat terjadi peristiwa musibah sesuai kesepakatan." },
    ],
    contohPenerapan: [
      "Proteksi Kesehatan & Rawat Inap Syariah Mandiri",
      "Perlindungan Rumah Tinggal & Aset Usaha Halal",
      "Mitigasi Risiko Gagal Panen Pertanian Syariah",
      "Dana Proteksi Kelangsungan Pendidikan Anak Ta'awuni",
    ],
  },
  takaful: {
    id: "takaful",
    title: "Takaful",
    arabicName: "التكافل",
    badge: "Saling Menanggung / Risk Sharing",
    category: "Sharia Finance",
    icon: Users,
    tagline: "Prinsip saling memikul beban risiko bersama melalui pool dana tabarru'.",
    description:
      "Takaful (berasal dari kata kafala: saling menjamin/menanggung) adalah skema di mana sekumpulan peserta bersepakat untuk saling menanggung musibah yang menimpa salah satu dari mereka. Berbeda fundamental dengan asuransi konvensional (transfer of risk), takaful mengadopsi prinsip berbagi risiko (risk sharing) di mana peserta adalah pemilik dana kebajikan (dana tabarru') dan perusahaan hanya bertindak sebagai pengelola amanah (mudharib/wakil).",
    dalil: {
      text: "“Perumpamaan orang-orang mukmin dalam hal saling mencintai, menyayangi, dan mengasihi adalah bagaikan satu tubuh. Jika ada salah satu anggota tubuh yang sakit, maka seluruh tubuh akan ikut terjaga dan demam.”",
      source: "HR. Bukhari no. 6011 & Muslim no. 2586",
    },
    rukun: [
      "Al-Kafil (Para peserta takaful yang saling menanggung beban)",
      "Al-Makful Lahu (Peserta yang berhak menerima santunan musibah)",
      "Al-Makful 'Anhu (Beban risiko musibah yang ditanggung bersama)",
      "Al-Makful Bihi (Santunan klaim dari pool dana tabarru')",
      "Shighat Akad (Ijab qabul kepesertaan takaful ta'awuni)",
    ],
    syaratSah: [
      "Pemisahan mutlak antara rekening peserta (dana tabarru') dan rekening pengelola",
      "Klaim dibayarkan dari dana bersama peserta, bukan dari modal perusahaan",
      "Surplus underwriting dikembalikan kepada peserta atau dicadangkan kembali",
      "Operasional dan instrumen investasi diawasi Dewan Pengawas Syariah (DPS)",
    ],
    skemaAlur: [
      { step: 1, title: "Iuran Kontribusi Premi", desc: "Peserta menyetorkan premi yang dialokasikan ke pos tabarru' (kebajikan) & tabungan investasi." },
      { step: 2, title: "Risk Sharing Pool", desc: "Seluruh dana kebajikan digabungkan ke dalam satu wadah dana bersama peserta (Tabarru' Pool)." },
      { step: 3, title: "Klaim Santunan Musibah", desc: "Jika ada peserta terkena musibah, santunan dicairkan dari pool dana tabarru'." },
      { step: 4, title: "Distribusi Surplus Underwriting", desc: "Surplus underwriting (sisa dana klaim neto) didistribusikan kembali secara adil." },
    ],
    contohPenerapan: [
      "Takaful Jiwa & Santunan Duka Cita Keluarga",
      "Takaful Kendaraan & Properti Berbasis Risk Sharing",
      "Takaful Mikro Pembiayaan UMKM Komunitas",
      "Takaful Haji & Umrah Peserta Indonesia",
    ],
  },
  tadhamun: {
    id: "tadhamun",
    title: "Tadhamun",
    arabicName: "التضامن",
    badge: "Solidaritas / Ukhuwah",
    category: "Sharia Finance",
    icon: Heart,
    tagline: "Asas solidaritas sosial dan ukhuwah untuk menopang ketahanan ekonomi sesama.",
    description:
      "Tadhamun adalah prinsip solidaritas persaudaraan (ukhuwah islamiyah) di mana komunitas atau kelompok masyarakat membangun komitmen moral dan finansial untuk bahu-membahu menopang anggota yang rentan atau tertimpa musibah mendadak. Diimplementasikan melalui jaring pengaman sosial, dana darurat paguyuban, serta skema gotong-royong nir-komersial.",
    dalil: {
      text: "“Orang mukmin yang satu dengan mukmin yang lain bagaikan satu bangunan yang bagian-bagiannya saling mengokohkan.”",
      source: "HR. Bukhari no. 481 & Muslim no. 2585",
    },
    rukun: [
      "Anggota Komunitas / Sahibul Tadhamun (Pemberi solidaritas)",
      "Bentuk Dukungan (Kas darurat, tenaga gotong-royong, atau logistik)",
      "Penerima Manfaat (Anggota terdampak musibah atau krisis)",
      "Kesepakatan Ukhuwah (Piagam musyawarah solidaritas komunitas)",
    ],
    syaratSah: [
      "Tidak ada unsur paksaan, kompensasi bunga, atau ekspektasi imbal laba finansial",
      "Penyaluran tepat sasaran berdasarkan tingkat urgensi musibah riil",
      "Pengelolaan kas terbuka, akuntabel, dan transparan di hadapan seluruh anggota",
      "Bertujuan mengentaskan kesulitan ekonomi tanpa menjerumuskan pada jerat utang",
    ],
    skemaAlur: [
      { step: 1, title: "Himpun Kas Ukhuwah", desc: "Komunitas mengumpulkan kas gotong-royong sukarela secara berkala (bulanan/insidental)." },
      { step: 2, title: "Verifikasi Amanah Musibah", desc: "Pengurus komunitas memverifikasi anggota yang memerlukan bantuan mendesak." },
      { step: 3, title: "Penyaluran Langsung", desc: "Bantuan diserahkan secara langsung tanpa syarat pengembalian atau bunga." },
      { step: 4, title: "Pertanggungjawaban Terbuka", desc: "Laporan kas solidaritas dibagikan transparan kepada seluruh anggota komunitas." },
    ],
    contohPenerapan: [
      "Dana Kematian & Duka Cita RT/RW / Paguyuban Warga",
      "Jaring Pengaman Krisis UMKM Komunitas Muslim",
      "Bantuan Cepat Tanggap Kebencanaan Berbasis Jamaah",
      "Santunan Pendidikan Anak Yatim & Dhuafa Berkelanjutan",
    ],
  },
  ijarah: {
    id: "ijarah",
    title: "Ijarah",
    arabicName: "عقد الإجارة",
    badge: "Sewa Hak Guna & Jasa",
    category: "Sharia Finance",
    icon: Building,
    tagline: "Pemindahan hak guna (manfaat) suatu barang atau jasa dalam waktu tertentu dengan pembayaran sewa (ujrah).",
    description:
      "Akad Ijarah adalah akad pemindahan hak guna atas suatu barang atau jasa melalui pembayaran upah sewa (ujrah), tanpa diikuti dengan pemindahan kepemilikan barang itu sendiri. Dalam perkembangannya di perbankan syariah, dikenal pula Ijarah Muntahiya Bittamlik (IMBT), yaitu sewa menyewa yang diakhiri dengan perpindahan kepemilikan aset di akhir masa sewa melalui hibah atau jual beli.",
    dalil: {
      text: "“...Jika mereka menyusukan (anak-anak)mu untukmu, maka berikanlah kepada mereka imbalannya (ujrah)...”",
      source: "QS. Ath-Thalaq (65): 6 & HR. Ibnu Majah (Berikan upah pekerja sebelum keringatnya kering)",
    },
    rukun: [
      "Penyewa / Penerima jasa (Musta'jir)",
      "Pemberi sewa / Penyedia jasa (Mu'jir)",
      "Objek manfaat barang atau jasa (Ma'jur)",
      "Uang sewa / Upah imbalan (Ujrah)",
      "Ijab dan qabul (Shighat)",
    ],
    syaratSah: [
      "Manfaat objek sewa harus mubah (halal), jelas spesifikasinya, dan dapat diserahterimakan",
      "Kewajiban pemeliharaan kerusakan struktural aset berada pada pemilik barang",
      "Besaran ujrah dan jangka waktu sewa disepakati secara pasti di awal akad",
      "Penyewa hanya bertanggung jawab atas kerusakan akibat kelalaian atau pemakaian di luar batas wajar",
    ],
    skemaAlur: [
      { step: 1, title: "Penetapan Objek & Manfaat", desc: "Penyewa dan pemilik menyepakati objek sewa (properti/kendaraan/alat) dan batasan pemanfaatannya." },
      { step: 2, title: "Kesepakatan Tarif Ujrah", desc: "Menentukan nominal biaya sewa berkala dan tenor masa sewa tanpa klausul denda bunga ribawi." },
      { step: 3, title: "Pemanfaatan Manfaat Aset", desc: "Penyewa menikmati hak guna barang secara penuh selama masa kontrak sewa berlangsung." },
      { step: 4, title: "Pengembalian / Opsi Hibah", desc: "Aset dikembalikan dalam kondisi baik atau dialihkan kepemilikannya jika menggunakan skema IMBT." },
    ],
    contohPenerapan: [
      "Pembiayaan Properti & Kendaraan IMBT di Bank Syariah",
      "Sewa Guna Usaha Mesin Operasional & Alat Berat Syariah",
      "Jasa Ketenagakerjaan Profesional, Konsultan, dan Upah Karyawan",
      "Sewa Ruang Kantor, Gudang Logistik & Komputasi Awan",
    ],
  },
  qardh: {
    id: "qardh",
    title: "Qardh al-Hasan",
    arabicName: "عقد القرض الحسن",
    badge: "Pinjaman Kebajikan 0%",
    category: "Sharia Finance",
    icon: Coins,
    tagline: "Penyaluran pinjaman dana kebajikan murni tanpa bunga sepeserpun untuk membantu kebutuhan mendesak.",
    description:
      "Akad Qardh (khususnya Qardh al-Hasan) adalah akad pinjaman dana kebajikan di mana pemberi pinjaman menyerahkan sejumlah uang kepada penerima pinjaman dengan kewajiban bagi peminjam untuk mengembalikan jumlah pokok yang sama persis tanpa tambahan keuntungan atau bunga materiil sedikitpun. Setiap tambahan yang disyaratkan di awal atas pinjaman tergolong Riba Qardh yang diharamkan secara ijma'.",
    dalil: {
      text: "“Siapakah yang mau memberi pinjaman kepada Allah pinjaman yang baik (qardhan hasanan), maka Allah akan melipatgandakan balasan kepadanya dengan lipat ganda yang banyak...”",
      source: "QS. Al-Baqarah (2): 245 & Hadits Riwayat Ibnu Majah",
    },
    rukun: [
      "Pemberi pinjaman (Muqridh)",
      "Penerima pinjaman (Muqtaridh)",
      "Dana pinjaman pokok yang sah (Maal al-Qardh)",
      "Ijab dan qabul (Shighat)",
    ],
    syaratSah: [
      "Tidak boleh mensyaratkan keuntungan, bunga, atau hadiah kompensasi dari peminjam",
      "Peminjam wajib berkomitmen mengembalikan pinjaman pokok sesuai jadwal kesepakatan",
      "Pemberi pinjaman dianjurkan memberikan kelonggaran waktu bila peminjam mengalami kesulitan nyata (QS. 2:280)",
      "Boleh mengenakan biaya administrasi riil (ri'ayah) aktual yang tidak dipersentasekan dari pokok pinjaman",
    ],
    skemaAlur: [
      { step: 1, title: "Pengajuan Dana Kebajikan", desc: "Peminjam mengajukan kebutuhan dana mendesak kepada lembaga pengelola dana kebajikan / shahibul maal." },
      { step: 2, title: "Verifikasi Kelayakan", desc: "Memastikan peminjam berhak menerima talangan dan memiliki komitmen etis pengembalian pokok." },
      { step: 3, title: "Pencairan Pokok 100%", desc: "Dana diserahkan secara utuh tanpa pemotongan bunga di depan." },
      { step: 4, title: "Pelunasan Pokok Tanpa Bunga", desc: "Peminjam mengangsur atau melunasi pokok tepat waktu tanpa tambahan riba." },
    ],
    contohPenerapan: [
      "Pinjaman Talangan Haji / Umrah Syariah",
      "Pembiayaan Mikro Bergulir Pengentasan Kemiskinan BMT",
      "Kas Darurat Kebajikan Perusahaan bagi Karyawan",
      "Dana Talangan Pelunasan Utang Darurat Mustahik",
    ],
  },

  hibah: {
    id: "hibah",
    title: "Hibah Keluarga",
    arabicName: "عقد الهبة",
    badge: "Pemberian Sukarela / Tabarru'",
    category: "Sharia Finance",
    icon: Gift,
    tagline: "Pemberian hak milik harta secara sukarela semasa hidup tanpa mengharap imbalan.",
    description:
      "Akad Hibah adalah pemberian harta atau aset dari pemberi hibah (Wahib) kepada penerima (Mauhub Lahu) semasa pemberi masih hidup secara sukarela dan tanpa kontraprestasi ('iwadh). Dalam perencanaan harta keluarga Muslim, hibah menjaga keadilan antaranak sekaligus membedakan hak milik semasa hidup dari mekanisme waris (faraidh).",
    dalil: {
      text: "“Bertakwalah kepada Allah dan berlakulah adil di antara anak-anakmu.”",
      source: "HR. Bukhari no. 2587 & Muslim no. 1623",
    },
    rukun: [
      "Pemberi hibah yang cakap hukum (Wahib)",
      "Penerima hibah (Mauhub Lahu)",
      "Harta atau aset yang dihibahkan (Mauhub)",
      "Ijab, qabul, dan serah terima penguasaan aset (Qabdh)",
    ],
    syaratSah: [
      "Harta milik penuh dan sah dari pemberi hibah",
      "Serah terima aset terjadi semasa pemberi masih hidup",
      "Berlaku adil bila diberikan kepada anak-anak (tidak menimbulkan perselisihan)",
      "Tidak dimaksudkan untuk merugikan hak ahli waris secara zalim",
    ],
    skemaAlur: [
      { step: 1, title: "Inventarisasi Aset Hibah", desc: "Memisahkan aset pribadi yang halal dan bebas sengketa untuk dihibahkan." },
      { step: 2, title: "Pernyataan Ijab & Qabul", desc: "Dokumentasi tertulis/akta hibah di hadapan saksi dan keluarga." },
      { step: 3, title: "Serah Terima Hak Milik (Qabdh)", desc: "Pengalihan kepemilikan efektif semasa pemberi hibah masih hidup." },
      { step: 4, title: "Pencatatan Keadilan Keluarga", desc: "Menjaga proporsionalitas pemberian antaranggota keluarga agar harmonis." },
    ],
    contohPenerapan: [
      "Hibah Properti atau Tabungan Pendidikan untuk Anak Semasa Hidup",
      "Hibah Aset Produktif Keluarga dengan Akta Notaris/PPAT",
      "Pemberian Modal Usaha Awal tanpa Beban Utang Keluarga",
      "Hibah Sosial kepada Lembaga Pendidikan dan Dakwah",
    ],
  },

  wakaf: {
    id: "wakaf",
    title: "Wakaf Produktif",
    arabicName: "الوقف",
    badge: "Aset Abadi Umat",
    category: "Sharia Finance",
    icon: Building2,
    tagline: "Menahan pokok harta agar kekal dan menyalurkan hasilnya untuk kemaslahatan umat.",
    description:
      "Wakaf adalah perbuatan hukum wakif untuk memisahkan sebagian harta benda miliknya (tunai maupun aset tetap) untuk dimanfaatkan selamanya atau jangka waktu tertentu guna kepentingan ibadah dan kesejahteraan umum. Pokok wakaf wajib dijaga keutuhannya (tidak boleh dijual/dihibahkan/diwariskan), sementara hasil pengelolaannya disalurkan kepada mauquf 'alaih oleh Nazhir.",
    dalil: {
      text: "“Tahanlah pokoknya dan sedekahkanlah hasilnya.”",
      source: "HR. Bukhari no. 2737 & Muslim no. 1632 (Hadis Wakaf Umar bin Khattab)",
    },
    rukun: [
      "Wakif (Pihak yang mewakafkan harta)",
      "Nazhir (Pengelola profesional dan amanah atas harta wakaf)",
      "Mauquf Bih (Harta benda wakaf uang atau aset tetap yang terjaga pokoknya)",
      "Mauquf 'Alaih (Pihak penerima manfaat sosial/umum)",
      "Ikrar Wakaf (Shighat resmi disaksikan Pejabat Pembuat Akta Ikrar Wakaf)",
    ],
    syaratSah: [
      "Pokok aset wakaf bersifat tahan lama atau dikelola dengan penjaminan pokok (wakaf tunai)",
      "Harta bebas dari sitaan, sengketa, dan utang yang mengikat",
      "Peruntukan manfaat harus pada sektor halal dan maslahat umum",
      "Nazhir melaporkan pengelolaan aset dan distribusi imbal hasil secara berkala",
    ],
    skemaAlur: [
      { step: 1, title: "Ikrar & Penyerahan Wakaf", desc: "Wakif menyerahkan wakaf tunai/aset melalui LKS-PWU atau lembaga nazhir terdaftar." },
      { step: 2, title: "Pelestarian Pokok Aset", desc: "Pokok dana atau properti dikunci sebagai modal abadi umat." },
      { step: 3, title: "Investasi / Pengelolaan Produktif", desc: "Nazhir mengelola wakaf ke sukuk syariah, ritel halal, atau aset produktif." },
      { step: 4, title: "Distribusi Manfaat (Mauquf 'Alaih)", desc: "Surplus hasil disalurkan untuk beasiswa, klinik dhuafa, atau pemberdayaan UMKM." },
    ],
    contohPenerapan: [
      "Cash Waqf Linked Sukuk (CWLS) untuk Fasilitas Kesehatan Publik",
      "Wakaf Produktif Tanah Pertanian, Rumah Sakit, dan Gedung Pendidikan",
      "Pelaporan Transparansi Nazhir Berbasis Nilai Aset Bersih (NAB)",
      "Wakaf Melalui Uang untuk Pembangunan Infrastruktur Sosial",
    ],
  },

  salam: {
    id: "salam",
    title: "Salam",
    arabicName: "عقد السلم",
    badge: "Jual Beli Pesanan Tunai di Muka",
    category: "Sharia Finance",
    icon: Package,
    tagline: "Jual beli komoditas dengan pembayaran tunai penuh di awal dan penyerahan barang di waktu mendatang.",
    description:
      "Akad Salam adalah transaksi jual beli barang pesanan (khususnya komoditas agrikultur atau barang terstandarisasi) dengan penangguhan pengiriman oleh penjual dan pelunasan harga 100% di muka oleh pembeli saat akad. Skema ini membantu petani atau produsen memperoleh modal kerja tanpa pinjaman riba sekaligus memberi kepastian pasokan dan harga bagi pembeli.",
    dalil: {
      text: "“Barangsiapa melakukan akad salaf (salam), hendaklah melakukannya dengan takaran yang jelas, timbangan yang jelas, dan hingga batas waktu yang jelas.”",
      source: "HR. Bukhari no. 2240 & Muslim no. 1604",
    },
    rukun: [
      "Pembeli / Pemesan komoditas (Muslam)",
      "Penjual / Produsen pengada barang (Muslam Ilaihi)",
      "Modal pembayaran tunai penuh di awal (Ra'sul Mal al-Salam)",
      "Barang pesanan terstandar spesifikasi, mutu, dan kuantitasnya (Muslam Fihi)",
      "Ijab dan qabul (Shighat) dengan jadwal serah terima pasti",
    ],
    syaratSah: [
      "Modal harga wajib dibayar penuh (100% tunai) saat majelis akad",
      "Spesifikasi barang (jenis, mutu, ukuran/berat) harus terukur jelas agar bebas gharar",
      "Tanggal dan lokasi serah terima komoditas ditentukan sejak awal",
      "Tidak diperbolehkan menukar utang menjadi modal salam",
    ],
    skemaAlur: [
      { step: 1, title: "Penetapan Spesifikasi Komoditas", desc: "Pembeli dan produsen menyepakati jenis, kualitas, volume, serta tanggal pengiriman." },
      { step: 2, title: "Pembayaran 100% di Muka", desc: "Pembeli melunasi modal salam secara tunai sebagai modal produksi." },
      { step: 3, title: "Masa Produksi / Panen", desc: "Petani atau produsen menyiapkan barang sesuai standar yang diperjanjikan." },
      { step: 4, title: "Serah Terima Komoditas", desc: "Penjual menyerahkan komoditas tepat waktu dan pembeli melakukan verifikasi mutu." },
    ],
    contohPenerapan: [
      "Pembiayaan Modal Kerja Petani Padi, Kopi, dan Komoditas Pangan Syariah",
      "Kontrak Pasokan Bahan Baku Terstandar dengan Harga Terkunci di Muka",
      "Skema Salam Paralel antara Lembaga Keuangan Syariah dan Koperasi Tani",
      "Pengadaan Komoditas Ekspor dengan Kepastian Kualitas Panen",
    ],
  },

  istishna: {
    id: "istishna",
    title: "Istishna'",
    arabicName: "عقد الاستصناع",
    badge: "Pembiayaan Pesanan Manufaktur & Konstruksi",
    category: "Sharia Finance",
    icon: Building,
    tagline: "Akad pemesanan pembuatan aset atau konstruksi sesuai spesifikasi dengan pembayaran fleksibel bertahap.",
    description:
      "Akad Istishna' adalah akad jual beli dalam bentuk pemesanan pembuatan barang tertentu (manufaktur, infrastruktur, properti, perangkat lunak, atau mesin industri) dengan kriteria dan persyaratan yang disepakati antara pemesan (Mustashni') dan pembuat/kontraktor (Shani'). Berbeda dengan Salam, pembayaran Istishna' dapat dilakukan di muka, berdasarkan termin progres proyek, atau tangguh di akhir.",
    dalil: {
      text: "“Diriwayatkan bahwa Nabi SAW pernah memesan dibuatkan cincin perak dan mimbar dari kayu tamariska untuk keperluan dakwah.”",
      source: "HR. Bukhari no. 5874 & Muslim no. 2091 (Landasan Fatwa DSN-MUI No. 06/DSN-MUI/IV/2000)",
    },
    rukun: [
      "Pemesan / Pembeli aset (Mustashni')",
      "Produsen / Kontraktor pembuat aset (Shani')",
      "Barang atau proyek pesanan beserta spesifikasi teknisnya (Mashnu')",
      "Harga kontrak dan jadwal termin pembayaran",
      "Ijab dan qabul (Shighat)",
    ],
    syaratSah: [
      "Spesifikasi objek (desain, material, standar mutu, waktu selesai) harus jelas dan terukur",
      "Barang yang dipesan umumnya memerlukan proses pembuatan/konstruksi",
      "Harga kontrak bersifat pasti sejak awal dan tidak berubah sepihak",
      "Jika menggunakan Istishna' Paralel, akad kedua terpisah dan tidak saling menggantungkan",
    ],
    skemaAlur: [
      { step: 1, title: "Desain & BoQ Spesifikasi", desc: "Pemesan menyerahkan spesifikasi teknis, gambar kerja, dan standar kualitas." },
      { step: 2, title: "Kesepakatan Harga & Termin", desc: "Menetapkan total nilai kontrak beserta milestone pembayaran bertahap." },
      { step: 3, title: "Eksekusi Konstruksi / Produksi", desc: "Kontraktor memproduksi aset sesuai jadwal dan inspeksi mutu." },
      { step: 4, title: "BAST & Penyerahan Aset", desc: "Serah terima hasil akhir setelah lolos uji kualitas serta pelunasan sisa termin." },
    ],
    contohPenerapan: [
      "Pembiayaan KPR Inden Syariah & Pembangunan Rumah/Ruko Pesanan",
      "Kontrak Manufaktur Mesin Pabrik & Peralatan Industri Khusus",
      "Proyek Konstruksi Infrastruktur dengan Pembayaran Termin Progres (Milestone)",
      "Pengadaan Aset Kapal, Alat Berat, atau Sistem Khusus Berbasis Kontrak",
    ],
  },
};

export function StandaloneAkadApp({
  akadId,
  onBack: _onBack,
  onSelectAkad: _onSelectAkad,
}: {
  akadId: AkadType;
  onBack?: () => void;
  onSelectAkad?: (id: AkadType) => void;
}) {
  const data = AKAD_DATA[akadId];
  const Icon = data.icon;

  // Simulator state based on Akad type
  // 1. Tabarru simulator
  const [tabPeserta, setTabPeserta] = useState(150);
  const [tabIuran, setTabIuran] = useState(250000);
  const [tabKlaim, setTabKlaim] = useState(15000000);

  // 2. Mudharabah simulator
  const [mudModal, setMudModal] = useState(100000000);
  const [mudLaba, setMudLaba] = useState(18000000);
  const [mudNisbahShahibul, setMudNisbahShahibul] = useState(60);

  // 3. Wakalah simulator
  const [wakTransaksi, setWakTransaksi] = useState(50000000);
  const [wakTipeFee, setWakTipeFee] = useState<"percent" | "fixed">("percent");
  const [wakRate, setWakRate] = useState(2.5);
  const [wakFixedFee, setWakFixedFee] = useState(1250000);

  // 4. Wadiah simulator
  const [wadSaldo, setWadSaldo] = useState(35000000);
  const [wadBulan, setWadBulan] = useState(12);
  const [wadBonusRate, setWadBonusRate] = useState(3.0);

  // 5. Musyarakah simulator
  const [musModalA, setMusModalA] = useState(60000000);
  const [musModalB, setMusModalB] = useState(40000000);
  const [musProyeksiLaba, setMusProyeksiLaba] = useState(25000000);
  const [musNisbahA, setMusNisbahA] = useState(55);

  // 6. Murabahah simulator
  const [murHargaPokok, setMurHargaPokok] = useState(120000000);
  const [murUangMuka, setMurUangMuka] = useState(20000000);
  const [murMarginTahun, setMurMarginTahun] = useState(8.5);
  const [murTenorBulan, setMurTenorBulan] = useState(36);

  // 7. Ta'min simulator (Perlindungan & Mitigasi Risiko Ta'awuni)
  const [tamTanggungan, setTamTanggungan] = useState(3);
  const [tamPengeluaran, setTamPengeluaran] = useState(8500000);
  const [tamDanaDarurat, setTamDanaDarurat] = useState(25000000);
  const [tamNilaiAset, setTamNilaiAset] = useState(250000000);

  // 8. Takaful simulator (Risk Sharing Pool & Surplus Underwriting)
  const [takTotalKontribusi, setTakTotalKontribusi] = useState(500000000);
  const [takTotalKlaim, setTakTotalKlaim] = useState(280000000);
  const [takUjrahRate, setTakUjrahRate] = useState(20);
  const [takCadanganRate, setTakCadanganRate] = useState(30);

  // 9. Tadhamun simulator (Kas Solidaritas & Jaring Pengaman Komunitas)
  const [tadhAnggota, setTadhAnggota] = useState(80);
  const [tadhIuranBulan, setTadhIuranBulan] = useState(100000);
  const [tadhKasusTahun, setTadhKasusTahun] = useState(6);
  const [tadhSantunanKasus, setTadhSantunanKasus] = useState(5000000);

  // 10. Ijarah simulator (Sewa Hak Guna & Ujrah)
  const [ijrSewaBulan, setIjrSewaBulan] = useState(4500000);
  const [ijrDurasiBulan, setIjrDurasiBulan] = useState(12);
  const [ijrUjrahPemeliharaan, setIjrUjrahPemeliharaan] = useState(350000);

  // 11. Qardh simulator (Pinjaman Kebajikan 0% Bunga)
  const [qrdPokok, setQrdPokok] = useState(15000000);
  const [qrdTenorBulan, setQrdTenorBulan] = useState(10);
  const [qrdBiayaAdminRiil, setQrdBiayaAdminRiil] = useState(50000);

  // 12. Hibah simulator
  const [hibTotalHarta, setHibTotalHarta] = useState(500000000);
  const [hibNilaiHibah, setHibNilaiHibah] = useState(120000000);
  const [hibJumlahAnak, setHibJumlahAnak] = useState(3);

  // 13. Wakaf simulator
  const [wkfPokokTunai, setWkfPokokTunai] = useState(100000000);
  const [wkfImbalHasilPersen, setWkfImbalHasilPersen] = useState(6.5);
  const [wkfPorsiNazhirPersen, setWkfPorsiNazhirPersen] = useState(10);

  // 14. Salam simulator
  const [slmVolumeKg, setSlmVolumeKg] = useState(5000);
  const [slmHargaSalamKg, setSlmHargaSalamKg] = useState(11000);
  const [slmHargaPasarKg, setSlmHargaPasarKg] = useState(13500);

  // 15. Istishna simulator
  const [istNilaiProyek, setIstNilaiProyek] = useState(400000000);
  const [istDpPersen, setIstDpPersen] = useState(20);
  const [istJumlahTermin, setIstJumlahTermin] = useState(4);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Math.max(0, val));
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Clean Page Title */}
      <div className="flex items-center justify-center flex-wrap text-center gap-3 border-b border-border/40 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {data.title}
        </h1>
        <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          {data.arabicName}
        </span>
      </div>

      {/* Main Grid: Description & Practical Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Core Identity & Provisions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card Overview */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-primary">
                  {data.badge}
                </span>
                <h2 className="text-lg font-bold text-foreground">{data.tagline}</h2>
              </div>
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed mb-6">
              {data.description}
            </p>

            {/* Dalil / Landasan Syariah */}
            <div className="bg-muted/40 border-l-4 border-l-primary rounded-r-xl p-4 my-2">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                <BookOpen size={14} />
                <span>Landasan Dalil Syariah</span>
              </div>
              <p className="text-xs sm:text-sm italic text-foreground/90 leading-relaxed">
                {data.dalil.text}
              </p>
              <span className="block mt-2 text-[11px] font-semibold text-muted-foreground">
                {data.dalil.source}
              </span>
            </div>
          </div>

          {/* Rukun & Syarat Sah */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Rukun */}
            <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Rukun Akad</span>
              </h3>
              <ul className="space-y-2">
                {data.rukun.map((r, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-secondary text-foreground text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug text-foreground/90">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Syarat Sah */}
            <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" />
                <span>Syarat Sah Transaksi</span>
              </h3>
              <ul className="space-y-2">
                {data.syaratSah.map((s, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span className="leading-snug text-foreground/90">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skema Alur Transaksi Langkah demi Langkah */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              <span>Skema Alur Transaksi (Flowchart Syariah)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {data.skemaAlur.map((item) => (
                <div
                  key={item.step}
                  className="p-3.5 rounded-xl bg-muted/40 border border-border/40 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-md bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-7">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contoh Penerapan Dunia Nyata */}
          <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <span>Penerapan di Industri & Lembaga Keuangan</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {data.contohPenerapan.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-secondary/50 text-xs text-foreground/90 font-medium border border-border/20"
                >
                  <ArrowRight size={14} className="text-primary shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dedicated Interactive Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-4">
          <div className="bg-card border-2 border-primary/20 rounded-2xl p-5 sm:p-6 shadow-md relative">
            <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground text-sm sm:text-base">
                  Simulator Interaktif {data.title}
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                Live Tool
              </span>
            </div>

            {/* TABARRU SIMULATOR */}
            {akadId === "tabarru" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Simulasikan penghitungan pengumpulan dana tolong-menolong (Risk Pool) dan surplus underwriting dana kebajikan.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Jumlah Peserta Donatur</span>
                      <span className="text-primary font-bold">{tabPeserta} orang</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={1000}
                      step={10}
                      value={tabPeserta}
                      onChange={(e) => setTabPeserta(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Iuran Kebajikan per Peserta</span>
                      <span className="text-primary font-bold">{formatRupiah(tabIuran)}</span>
                    </label>
                    <input
                      type="range"
                      min={50000}
                      max={2000000}
                      step={50000}
                      value={tabIuran}
                      onChange={(e) => setTabIuran(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Estimasi Klaim Santunan</span>
                      <span className="text-rose-500 font-bold">{formatRupiah(tabKlaim)}</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={tabPeserta * tabIuran}
                      step={1000000}
                      value={Math.min(tabKlaim, tabPeserta * tabIuran)}
                      onChange={(e) => setTabKlaim(Number(e.target.value))}
                      className="w-full accent-rose-500 mt-1"
                    />
                  </div>
                </div>

                {(() => {
                  const totalTerkumpul = tabPeserta * tabIuran;
                  const surplus = totalTerkumpul - tabKlaim;
                  const rasioSolvabilitas = ((totalTerkumpul / (tabKlaim || 1)) * 100).toFixed(0);

                  return (
                    <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Total Pool Dana Tabarru':</span>
                        <span className="font-bold text-foreground">{formatRupiah(totalTerkumpul)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Penyaluran Santunan Klaim:</span>
                        <span className="font-semibold text-rose-500">-{formatRupiah(tabKlaim)}</span>
                      </div>
                      <div className="w-full h-px bg-border/80 my-1" />
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-bold text-foreground">Surplus Underwriting Tabarru':</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                          {formatRupiah(surplus)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1">
                        <span>Tingkat Solvabilitas Pool:</span>
                        <span className="font-semibold text-primary">{rasioSolvabilitas}%</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* MUDHARABAH SIMULATOR */}
            {akadId === "mudharabah" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Simulasikan porsi pembagian keuntungan usaha halal berdasarkan rasio nisbah investor (Shahibul Maal) vs pengelola (Mudharib).
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Modal Usaha (100% Shahibul Maal)</span>
                      <span className="text-primary font-bold">{formatRupiah(mudModal)}</span>
                    </label>
                    <input
                      type="range"
                      min={10000000}
                      max={500000000}
                      step={5000000}
                      value={mudModal}
                      onChange={(e) => setMudModal(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Estimasi Laba Bersih Usaha</span>
                      <span className="text-emerald-600 font-bold">{formatRupiah(mudLaba)}</span>
                    </label>
                    <input
                      type="range"
                      min={1000000}
                      max={100000000}
                      step={1000000}
                      value={mudLaba}
                      onChange={(e) => setMudLaba(Number(e.target.value))}
                      className="w-full accent-emerald-600 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Nisbah Laba Shahibul Maal : Mudharib</span>
                      <span className="text-primary font-bold">
                        {mudNisbahShahibul}% : {100 - mudNisbahShahibul}%
                      </span>
                    </label>
                    <input
                      type="range"
                      min={20}
                      max={80}
                      step={5}
                      value={mudNisbahShahibul}
                      onChange={(e) => setMudNisbahShahibul(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>
                </div>

                {(() => {
                  const bagianInvestor = (mudLaba * mudNisbahShahibul) / 100;
                  const bagianPengelola = (mudLaba * (100 - mudNisbahShahibul)) / 100;
                  const roiInvestor = ((bagianInvestor / mudModal) * 100).toFixed(2);

                  return (
                    <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Bagian Shahibul Maal ({mudNisbahShahibul}%):</span>
                        <span className="font-bold text-foreground">{formatRupiah(bagianInvestor)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Bagian Mudharib ({100 - mudNisbahShahibul}%):</span>
                        <span className="font-bold text-primary">{formatRupiah(bagianPengelola)}</span>
                      </div>
                      <div className="w-full h-px bg-border/80 my-1" />
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-bold text-foreground">Imbal Hasil Investor (Yield):</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                          {roiInvestor}% per periode
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground italic pt-1">
                        *Catatan: Pokok modal Rp {mudModal.toLocaleString("id-ID")} dikembalikan utuh pada akhir periode kerja sama.
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* WAKALAH SIMULATOR */}
            {akadId === "wakalah" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Kalkulasi imbalan jasa (Ujrah) yang adil atas mandat perwakilan pengurusan transaksi atau aset.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Nilai Transaksi yang Diwakilkan</span>
                      <span className="text-primary font-bold">{formatRupiah(wakTransaksi)}</span>
                    </label>
                    <input
                      type="range"
                      min={5000000}
                      max={200000000}
                      step={5000000}
                      value={wakTransaksi}
                      onChange={(e) => setWakTransaksi(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">
                      Metode Penentuan Ujrah
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setWakTipeFee("percent")}
                        className={cn(
                          "py-1.5 px-3 rounded-lg text-xs font-semibold border cursor-pointer transition-all",
                          wakTipeFee === "percent"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary text-muted-foreground border-border/50",
                        )}
                      >
                        Persentase (%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setWakTipeFee("fixed")}
                        className={cn(
                          "py-1.5 px-3 rounded-lg text-xs font-semibold border cursor-pointer transition-all",
                          wakTipeFee === "fixed"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary text-muted-foreground border-border/50",
                        )}
                      >
                        Nominal Tetap (Rp)
                      </button>
                    </div>
                  </div>

                  {wakTipeFee === "percent" ? (
                    <div>
                      <label className="text-xs font-semibold text-foreground flex justify-between">
                        <span>Tarif Ujrah</span>
                        <span className="text-primary font-bold">{wakRate}%</span>
                      </label>
                      <input
                        type="range"
                        min={0.5}
                        max={10}
                        step={0.5}
                        value={wakRate}
                        onChange={(e) => setWakRate(Number(e.target.value))}
                        className="w-full accent-primary mt-1"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs font-semibold text-foreground flex justify-between">
                        <span>Nominal Ujrah Tetap</span>
                        <span className="text-primary font-bold">{formatRupiah(wakFixedFee)}</span>
                      </label>
                      <input
                        type="range"
                        min={250000}
                        max={10000000}
                        step={250000}
                        value={wakFixedFee}
                        onChange={(e) => setWakFixedFee(Number(e.target.value))}
                        className="w-full accent-primary mt-1"
                      />
                    </div>
                  )}
                </div>

                {(() => {
                  const fee = wakTipeFee === "percent" ? (wakTransaksi * wakRate) / 100 : wakFixedFee;
                  const netto = wakTransaksi - fee;

                  return (
                    <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Imbalan Jasa Kuasa (Ujrah):</span>
                        <span className="font-extrabold text-primary">{formatRupiah(fee)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Nilai Bersih Dikelola:</span>
                        <span className="font-bold text-foreground">{formatRupiah(netto)}</span>
                      </div>
                      <div className="w-full h-px bg-border/80 my-1" />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Besaran ujrah diatur mengikat di awal akad. Wakil tidak menanggung kerugian selain akibat kelalaian nyata (ta'addi).
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* WADIAH SIMULATOR */}
            {akadId === "wadiah" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Simulasi rekening titipan amanah (Wadiah Yad adh-Dhamanah) dengan garansi saldo utuh 100% dan bonus sukarela (athaya).
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Saldo Rata-Rata Titipan</span>
                      <span className="text-primary font-bold">{formatRupiah(wadSaldo)}</span>
                    </label>
                    <input
                      type="range"
                      min={1000000}
                      max={200000000}
                      step={1000000}
                      value={wadSaldo}
                      onChange={(e) => setWadSaldo(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Durasi Penitipan</span>
                      <span className="text-primary font-bold">{wadBulan} Bulan</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={36}
                      step={1}
                      value={wadBulan}
                      onChange={(e) => setWadBulan(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Indikasi Bonus Sukarela (Athaya) p.a.</span>
                      <span className="text-emerald-600 font-bold">{wadBonusRate}%</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={6}
                      step={0.5}
                      value={wadBonusRate}
                      onChange={(e) => setWadBonusRate(Number(e.target.value))}
                      className="w-full accent-emerald-600 mt-1"
                    />
                  </div>
                </div>

                {(() => {
                  const bonusPerBulan = (wadSaldo * (wadBonusRate / 100)) / 12;
                  const totalBonus = bonusPerBulan * wadBulan;

                  return (
                    <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Saldo Pokok Dijamin:</span>
                        <span className="font-extrabold text-foreground">{formatRupiah(wadSaldo)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Estimasi Bonus Bulanan:</span>
                        <span className="font-semibold text-emerald-600">{formatRupiah(bonusPerBulan)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Total Bonus Selama {wadBulan} Bulan:</span>
                        <span className="font-bold text-emerald-600">{formatRupiah(totalBonus)}</span>
                      </div>
                      <div className="w-full h-px bg-border/80 my-1" />
                      <p className="text-[11px] text-muted-foreground italic">
                        *Perhatian: Bonus bersifat hibah sukarela murni dari institusi dan tidak boleh dijanjikan atau disyaratkan di awal akad.
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* MUSYARAKAH SIMULATOR */}
            {akadId === "musyarakah" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Hitung porsi kepemilikan modal bersama dan distribusi hasil usaha serta pembagian risiko secara adil.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Modal Mitra A (Anda)</span>
                      <span className="text-primary font-bold">{formatRupiah(musModalA)}</span>
                    </label>
                    <input
                      type="range"
                      min={5000000}
                      max={200000000}
                      step={5000000}
                      value={musModalA}
                      onChange={(e) => setMusModalA(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Modal Mitra B (Partner / Bank)</span>
                      <span className="text-indigo-600 font-bold">{formatRupiah(musModalB)}</span>
                    </label>
                    <input
                      type="range"
                      min={5000000}
                      max={200000000}
                      step={5000000}
                      value={musModalB}
                      onChange={(e) => setMusModalB(Number(e.target.value))}
                      className="w-full accent-indigo-600 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Proyeksi Laba Bersih Usaha</span>
                      <span className="text-emerald-600 font-bold">{formatRupiah(musProyeksiLaba)}</span>
                    </label>
                    <input
                      type="range"
                      min={2000000}
                      max={80000000}
                      step={1000000}
                      value={musProyeksiLaba}
                      onChange={(e) => setMusProyeksiLaba(Number(e.target.value))}
                      className="w-full accent-emerald-600 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Nisbah Laba Mitra A : Mitra B</span>
                      <span className="text-primary font-bold">
                        {musNisbahA}% : {100 - musNisbahA}%
                      </span>
                    </label>
                    <input
                      type="range"
                      min={20}
                      max={80}
                      step={5}
                      value={musNisbahA}
                      onChange={(e) => setMusNisbahA(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>
                </div>

                {(() => {
                  const totalModal = musModalA + musModalB;
                  const porsiSahamA = ((musModalA / totalModal) * 100).toFixed(1);
                  const porsiSahamB = ((musModalB / totalModal) * 100).toFixed(1);
                  const labaA = (musProyeksiLaba * musNisbahA) / 100;
                  const labaB = (musProyeksiLaba * (100 - musNisbahA)) / 100;

                  return (
                    <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Total Modal Usaha Gabungan:</span>
                        <span className="font-extrabold text-foreground">{formatRupiah(totalModal)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Porsi Modal A vs B:</span>
                        <span className="font-semibold text-foreground">
                          {porsiSahamA}% : {porsiSahamB}%
                        </span>
                      </div>
                      <div className="w-full h-px bg-border/80 my-1" />
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Bagian Laba Mitra A ({musNisbahA}%):</span>
                        <span className="font-bold text-emerald-600">{formatRupiah(labaA)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Bagian Laba Mitra B ({100 - musNisbahA}%):</span>
                        <span className="font-bold text-indigo-600">{formatRupiah(labaB)}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground italic pt-1">
                        *Prinsip Syariah: Bila rugi, kerugian finansial ditanggung proporsional sesuai rasio modal ({porsiSahamA}% : {porsiSahamB}%).
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* MURABAHAH SIMULATOR */}
            {akadId === "murabahah" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Simulasikan pembiayaan jual beli cost-plus dengan margin transparan dan angsuran tetap tanpa bunga floating.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Harga Beli Pokok Aset/Barang</span>
                      <span className="text-primary font-bold">{formatRupiah(murHargaPokok)}</span>
                    </label>
                    <input
                      type="range"
                      min={10000000}
                      max={500000000}
                      step={5000000}
                      value={murHargaPokok}
                      onChange={(e) => setMurHargaPokok(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Uang Muka (DP)</span>
                      <span className="text-foreground font-bold">{formatRupiah(murUangMuka)}</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={murHargaPokok * 0.5}
                      step={5000000}
                      value={murUangMuka}
                      onChange={(e) => setMurUangMuka(Number(e.target.value))}
                      className="w-full accent-foreground mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Margin Keuntungan per Tahun</span>
                      <span className="text-emerald-600 font-bold">{murMarginTahun}%</span>
                    </label>
                    <input
                      type="range"
                      min={4}
                      max={18}
                      step={0.5}
                      value={murMarginTahun}
                      onChange={(e) => setMurMarginTahun(Number(e.target.value))}
                      className="w-full accent-emerald-600 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Jangka Waktu Pembiayaan</span>
                      <span className="text-primary font-bold">{murTenorBulan} Bulan ({murTenorBulan / 12} Thn)</span>
                    </label>
                    <input
                      type="range"
                      min={6}
                      max={120}
                      step={6}
                      value={murTenorBulan}
                      onChange={(e) => setMurTenorBulan(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>
                </div>

                {(() => {
                  const pokokPembiayaan = murHargaPokok - murUangMuka;
                  const tenorTahun = murTenorBulan / 12;
                  const totalMargin = pokokPembiayaan * (murMarginTahun / 100) * tenorTahun;
                  const totalPiutang = pokokPembiayaan + totalMargin;
                  const angsuranPerBulan = totalPiutang / murTenorBulan;

                  return (
                    <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Pokok Pembiayaan Bersih:</span>
                        <span className="font-bold text-foreground">{formatRupiah(pokokPembiayaan)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Total Margin Keuntungan Penjual:</span>
                        <span className="font-semibold text-primary">{formatRupiah(totalMargin)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Total Harga Jual Murabahah:</span>
                        <span className="font-extrabold text-foreground">{formatRupiah(totalPiutang)}</span>
                      </div>
                      <div className="w-full h-px bg-border/80 my-1" />
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-bold text-foreground">Cicilan Tetap per Bulan:</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                          {formatRupiah(angsuranPerBulan)} / bln
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground italic pt-1">
                        *Angsuran bersifat pasti dan mengikat (fixed rate) sejak hari pertama hingga lunas tanpa risiko lonjakan bunga bank.
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TA'MIN SIMULATOR */}
            {akadId === "tamin" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Simulasikan pemetaan risiko finansial keluarga, kecukupan dana darurat, dan estimasi kebutuhan proteksi ta'awuni syariah.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Jumlah Anggota Tanggungan</span>
                      <span className="text-primary font-bold">{tamTanggungan} Orang</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={8}
                      step={1}
                      value={tamTanggungan}
                      onChange={(e) => setTamTanggungan(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Pengeluaran Rutin Bulanan</span>
                      <span className="text-primary font-bold">{formatRupiah(tamPengeluaran)}</span>
                    </label>
                    <input
                      type="range"
                      min={2000000}
                      max={50000000}
                      step={500000}
                      value={tamPengeluaran}
                      onChange={(e) => setTamPengeluaran(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Dana Darurat yang Dimiliki</span>
                      <span className="text-primary font-bold">{formatRupiah(tamDanaDarurat)}</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={200000000}
                      step={2000000}
                      value={tamDanaDarurat}
                      onChange={(e) => setTamDanaDarurat(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Estimasi Nilai Aset Kritis</span>
                      <span className="text-primary font-bold">{formatRupiah(tamNilaiAset)}</span>
                    </label>
                    <input
                      type="range"
                      min={20000000}
                      max={1500000000}
                      step={10000000}
                      value={tamNilaiAset}
                      onChange={(e) => setTamNilaiAset(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>
                </div>

                {(() => {
                  const targetBulanDarurat = tamTanggungan === 0 ? 3 : tamTanggungan <= 2 ? 6 : 12;
                  const targetDanaDarurat = tamPengeluaran * targetBulanDarurat;
                  const rasioDarurat = Math.min(100, Math.round((tamDanaDarurat / targetDanaDarurat) * 100));
                  const estimasiUangPertanggungan = tamPengeluaran * 12 * 5; // 5 tahun living cost
                  const alokasiTaMinBulanan = Math.round(tamPengeluaran * 0.05);

                  return (
                    <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Target Dana Darurat ({targetBulanDarurat} Bln):</span>
                        <span className="font-bold text-foreground">{formatRupiah(targetDanaDarurat)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Kesiapan Dana Darurat:</span>
                        <span className={`font-bold ${rasioDarurat >= 80 ? "text-emerald-500" : rasioDarurat >= 50 ? "text-amber-500" : "text-rose-500"}`}>
                          {rasioDarurat}% Terpenuhi
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Nilai Manfaat Proteksi Jiwa (5 Thn):</span>
                        <span className="font-semibold text-primary">{formatRupiah(estimasiUangPertanggungan)}</span>
                      </div>
                      <div className="w-full h-px bg-border/80 my-1" />
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-bold text-foreground">Rekomendasi Alokasi Ta'min (5%):</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                          ~{formatRupiah(alokasiTaMinBulanan)} / bln
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground italic pt-1">
                        *Prinsip Ta'min menganjurkan ikhtiar proteksi dini untuk menjaga stabilitas nafkah keluarga mukmin tanpa riba dan gharar.
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAKAFUL SIMULATOR */}
            {akadId === "takaful" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Simulasikan mekanisme Risk Sharing Pool (Dana Tabarru'), ujrah pengelola, klaim santunan peserta, dan surplus underwriting syariah.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Total Himpunan Dana Tabarru'</span>
                      <span className="text-primary font-bold">{formatRupiah(takTotalKontribusi)}</span>
                    </label>
                    <input
                      type="range"
                      min={50000000}
                      max={2000000000}
                      step={25000000}
                      value={takTotalKontribusi}
                      onChange={(e) => setTakTotalKontribusi(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Total Klaim Santunan Dibayarkan</span>
                      <span className="text-rose-500 font-bold">{formatRupiah(takTotalKlaim)}</span>
                    </label>
                    <input
                      type="range"
                      min={10000000}
                      max={takTotalKontribusi}
                      step={10000000}
                      value={Math.min(takTotalKlaim, takTotalKontribusi)}
                      onChange={(e) => setTakTotalKlaim(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Biaya Pengelola (Ujrah Wakalah)</span>
                      <span className="text-primary font-bold">{takUjrahRate}%</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={35}
                      step={1}
                      value={takUjrahRate}
                      onChange={(e) => setTakUjrahRate(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Porsi Cadangan Tabarru' Mendatang</span>
                      <span className="text-primary font-bold">{takCadanganRate}%</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      step={5}
                      value={takCadanganRate}
                      onChange={(e) => setTakCadanganRate(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>
                </div>

                {(() => {
                  const ujrahPengelola = takTotalKontribusi * (takUjrahRate / 100);
                  const danaRiskPoolNetto = takTotalKontribusi - ujrahPengelola;
                  const surplusKotor = danaRiskPoolNetto - takTotalKlaim;
                  const isSurplus = surplusKotor >= 0;
                  const cadanganTabarru = isSurplus ? surplusKotor * (takCadanganRate / 100) : 0;
                  const surplusUntukPeserta = isSurplus ? surplusKotor - cadanganTabarru : 0;

                  return (
                    <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Ujrah Pengelola (Operasional & DPS):</span>
                        <span className="font-semibold text-foreground">{formatRupiah(ujrahPengelola)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Dana Risk Pool Santunan Netto:</span>
                        <span className="font-bold text-foreground">{formatRupiah(danaRiskPoolNetto)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Status Underwriting:</span>
                        <span className={`font-bold ${isSurplus ? "text-emerald-500" : "text-rose-500"}`}>
                          {isSurplus ? `Surplus (${formatRupiah(surplusKotor)})` : `Defisit (${formatRupiah(Math.abs(surplusKotor))})`}
                        </span>
                      </div>
                      {isSurplus ? (
                        <>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Cadangan Dana Tabarru' ({takCadanganRate}%):</span>
                            <span className="font-semibold text-foreground">{formatRupiah(cadanganTabarru)}</span>
                          </div>
                          <div className="w-full h-px bg-border/80 my-1" />
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="font-bold text-foreground">Surplus Dibagikan ke Peserta:</span>
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                              {formatRupiah(surplusUntukPeserta)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-500">
                          *Bila defisit underwriting terjadi, pengelola wajib menalangi melalui pinjaman kebajikan tanpa bunga (Qardh al-Hasan) sesuai fatwa DSN-MUI.
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TADHAMUN SIMULATOR */}
            {akadId === "tadhamun" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Simulasikan jaring pengaman gotong-royong berbasis komunitas (Mutual Aid Fund) warga, paguyuban, atau yayasan ta'awun.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Jumlah Anggota Komunitas</span>
                      <span className="text-primary font-bold">{tadhAnggota} Orang</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={500}
                      step={5}
                      value={tadhAnggota}
                      onChange={(e) => setTadhAnggota(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Iuran Solidaritas per Orang / Bulan</span>
                      <span className="text-primary font-bold">{formatRupiah(tadhIuranBulan)}</span>
                    </label>
                    <input
                      type="range"
                      min={10000}
                      max={500000}
                      step={10000}
                      value={tadhIuranBulan}
                      onChange={(e) => setTadhIuranBulan(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Estimasi Kasus Musibah / Tahun</span>
                      <span className="text-primary font-bold">{tadhKasusTahun} Kasus</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      step={1}
                      value={tadhKasusTahun}
                      onChange={(e) => setTadhKasusTahun(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Besaran Santunan per Kasus</span>
                      <span className="text-primary font-bold">{formatRupiah(tadhSantunanKasus)}</span>
                    </label>
                    <input
                      type="range"
                      min={1000000}
                      max={25000000}
                      step={500000}
                      value={tadhSantunanKasus}
                      onChange={(e) => setTadhSantunanKasus(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>
                </div>

                {(() => {
                  const kasHimpunanTahun = tadhAnggota * tadhIuranBulan * 12;
                  const totalSantunanKeluar = tadhKasusTahun * tadhSantunanKasus;
                  const saldoSisaTahun = kasHimpunanTahun - totalSantunanKeluar;
                  const rasioKetahanan = Math.round((kasHimpunanTahun / Math.max(1, totalSantunanKeluar)) * 100);

                  return (
                    <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Kas Solidaritas Masuk / Tahun:</span>
                        <span className="font-bold text-foreground">{formatRupiah(kasHimpunanTahun)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Estimasi Penyaluran Santunan:</span>
                        <span className="font-semibold text-rose-500">{formatRupiah(totalSantunanKeluar)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Indeks Ketahanan Kas Solidaritas:</span>
                        <span className={`font-bold ${rasioKetahanan >= 120 ? "text-emerald-500" : rasioKetahanan >= 100 ? "text-amber-500" : "text-rose-500"}`}>
                          {rasioKetahanan}% {rasioKetahanan >= 120 ? "(Sangat Sehat)" : rasioKetahanan >= 100 ? "(Seimbang)" : "(Defisit)"}
                        </span>
                      </div>
                      <div className="w-full h-px bg-border/80 my-1" />
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-bold text-foreground">Saldo Cadangan Akhir Tahun:</span>
                        <span className={`font-extrabold ${saldoSisaTahun >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                          {formatRupiah(saldoSisaTahun)}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground italic pt-1">
                        *Prinsip Tadhamun memperkuat ikatan persaudaraan sejati, di mana yang lapang menopang yang sempit tanpa komersialisasi.
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* IJARAH SIMULATOR */}
            {akadId === "ijarah" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Simulasikan perhitungan biaya sewa hak guna aset (properti/kendaraan/alat) dan akumulasi ujrah operasional secara transparan.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Tarif Sewa Pokok / Bulan</span>
                      <span className="text-primary font-bold">{formatRupiah(ijrSewaBulan)}</span>
                    </label>
                    <input
                      type="range"
                      min={500000}
                      max={25000000}
                      step={250000}
                      value={ijrSewaBulan}
                      onChange={(e) => setIjrSewaBulan(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Jangka Waktu Sewa (Tenor)</span>
                      <span className="text-primary font-bold">{ijrDurasiBulan} Bulan</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={60}
                      step={1}
                      value={ijrDurasiBulan}
                      onChange={(e) => setIjrDurasiBulan(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Biaya Pemeliharaan / Ujrah Jasa (per bulan)</span>
                      <span className="text-primary font-bold">{formatRupiah(ijrUjrahPemeliharaan)}</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={2000000}
                      step={50000}
                      value={ijrUjrahPemeliharaan}
                      onChange={(e) => setIjrUjrahPemeliharaan(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>
                </div>

                {(() => {
                  const totalSewaPokok = ijrSewaBulan * ijrDurasiBulan;
                  const totalUjrahJasa = ijrUjrahPemeliharaan * ijrDurasiBulan;
                  const grandTotalIjarah = totalSewaPokok + totalUjrahJasa;
                  const cicilanPerBulan = grandTotalIjarah / ijrDurasiBulan;

                  return (
                    <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Total Sewa Hak Guna:</span>
                        <span className="font-bold text-foreground">{formatRupiah(totalSewaPokok)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Total Biaya Pemeliharaan/Jasa:</span>
                        <span className="font-semibold text-foreground">{formatRupiah(totalUjrahJasa)}</span>
                      </div>
                      <div className="w-full h-px bg-border/80 my-1" />
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-bold text-foreground">Total Nilai Kontrak Ijarah:</span>
                        <span className="font-extrabold text-primary">{formatRupiah(grandTotalIjarah)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Angsuran Sewa per Bulan:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {formatRupiah(cicilanPerBulan)} / bln
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground italic pt-1">
                        *Pada skema Ijarah Muntahiya Bittamlik (IMBT), di akhir masa tenor penyewa dapat memperoleh hak milik aset melalui opsi hibah atau akad jual beli simbolik.
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* QARDH AL-HASAN SIMULATOR */}
            {akadId === "qardh" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Simulasikan pinjaman dana kebajikan syariah (Qardh al-Hasan) 100% bebas bunga dan denda ribawi untuk kebutuhan darurat.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Pokok Pinjaman Kebajikan</span>
                      <span className="text-primary font-bold">{formatRupiah(qrdPokok)}</span>
                    </label>
                    <input
                      type="range"
                      min={1000000}
                      max={50000000}
                      step={500000}
                      value={qrdPokok}
                      onChange={(e) => setQrdPokok(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Tenor Pengembalian (Bulan)</span>
                      <span className="text-primary font-bold">{qrdTenorBulan} Bulan</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={36}
                      step={1}
                      value={qrdTenorBulan}
                      onChange={(e) => setQrdTenorBulan(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Biaya Administrasi Riil (Satu Kali, Notaris/Materai)</span>
                      <span className="text-primary font-bold">{formatRupiah(qrdBiayaAdminRiil)}</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={200000}
                      step={10000}
                      value={qrdBiayaAdminRiil}
                      onChange={(e) => setQrdBiayaAdminRiil(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>
                </div>

                {(() => {
                  const angsuranPokokBulan = qrdPokok / qrdTenorBulan;
                  const totalHarusDibayar = qrdPokok + qrdBiayaAdminRiil;

                  return (
                    <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Suku Bunga / Mark-Up Tambahan:</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">0% (Murni Bebas Riba)</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Angsuran Pokok Bulanan:</span>
                        <span className="font-bold text-foreground">{formatRupiah(angsuranPokokBulan)} / bln</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Biaya Riil Pengelolaan (One-off):</span>
                        <span className="font-medium text-muted-foreground">{formatRupiah(qrdBiayaAdminRiil)}</span>
                      </div>
                      <div className="w-full h-px bg-border/80 my-1" />
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-bold text-foreground">Total Pengembalian:</span>
                        <span className="font-extrabold text-primary">{formatRupiah(totalHarusDibayar)}</span>
                      </div>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 italic pt-1">
                        *Kaidah fiqh: "Kullu qardin jarra manfa'atan fahuwa riba" — Setiap pinjaman yang menarik manfaat/keuntungan bersyarat adalah riba. Qardh al-Hasan hanya mengembalikan pokok pinjaman.
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* HIBAH SIMULATOR */}
            {akadId === "hibah" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Simulasikan alokasi hibah keluarga semasa hidup dan porsi pemerataan yang adil bagi anak-anak.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Total Aset Siap Dialokasikan</span>
                      <span className="text-primary font-bold">{formatRupiah(hibTotalHarta)}</span>
                    </label>
                    <input
                      type="range"
                      min={50000000}
                      max={2000000000}
                      step={25000000}
                      value={hibTotalHarta}
                      onChange={(e) => setHibTotalHarta(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Total Nilai Hibah Keluarga</span>
                      <span className="text-primary font-bold">{formatRupiah(hibNilaiHibah)}</span>
                    </label>
                    <input
                      type="range"
                      min={10000000}
                      max={hibTotalHarta}
                      step={10000000}
                      value={Math.min(hibNilaiHibah, hibTotalHarta)}
                      onChange={(e) => setHibNilaiHibah(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Jumlah Penerima Anak / Keluarga</span>
                      <span className="text-primary font-bold">{hibJumlahAnak} Orang</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={8}
                      step={1}
                      value={hibJumlahAnak}
                      onChange={(e) => setHibJumlahAnak(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>
                </div>

                {(() => {
                  const nilaiHibahValid = Math.min(hibNilaiHibah, hibTotalHarta);
                  const perPenerima = nilaiHibahValid / hibJumlahAnak;
                  const sisaHarta = hibTotalHarta - nilaiHibahValid;
                  const rasioHibah = ((nilaiHibahValid / hibTotalHarta) * 100).toFixed(1);

                  return (
                    <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Proporsi Hibah dari Total Aset:</span>
                        <span className="font-bold text-foreground">{rasioHibah}%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Porsi Adil per Penerima:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {formatRupiah(perPenerima)}
                        </span>
                      </div>
                      <div className="w-full h-px bg-border/80 my-1" />
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-bold text-foreground">Sisa Harta Milik Pemberi:</span>
                        <span className="font-extrabold text-primary">{formatRupiah(sisaHarta)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* WAKAF SIMULATOR */}
            {akadId === "wakaf" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Proyeksikan imbal hasil tahunan wakaf produktif, hak kelola Nazhir (maks. 10%), dan dana manfaat umat (Mauquf 'Alaih).
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Pokok Wakaf Tunai Abadi</span>
                      <span className="text-primary font-bold">{formatRupiah(wkfPokokTunai)}</span>
                    </label>
                    <input
                      type="range"
                      min={10000000}
                      max={1000000000}
                      step={10000000}
                      value={wkfPokokTunai}
                      onChange={(e) => setWkfPokokTunai(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Proyeksi Imbal Hasil Produktif / Tahun</span>
                      <span className="text-emerald-600 font-bold">{wkfImbalHasilPersen}%</span>
                    </label>
                    <input
                      type="range"
                      min={3}
                      max={12}
                      step={0.5}
                      value={wkfImbalHasilPersen}
                      onChange={(e) => setWkfImbalHasilPersen(Number(e.target.value))}
                      className="w-full accent-emerald-600 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Porsi Operasional Nazhir (Maks. 10%)</span>
                      <span className="text-primary font-bold">{wkfPorsiNazhirPersen}%</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={1}
                      value={wkfPorsiNazhirPersen}
                      onChange={(e) => setWkfPorsiNazhirPersen(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>
                </div>

                {(() => {
                  const totalHasilTahun = (wkfPokokTunai * wkfImbalHasilPersen) / 100;
                  const hakNazhir = (totalHasilTahun * wkfPorsiNazhirPersen) / 100;
                  const manfaatUmat = totalHasilTahun - hakNazhir;

                  return (
                    <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Pokok Wakaf Terjaga (100%):</span>
                        <span className="font-bold text-foreground">{formatRupiah(wkfPokokTunai)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Total Hasil Kelola / Tahun:</span>
                        <span className="font-semibold text-foreground">{formatRupiah(totalHasilTahun)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Hak Operasional Nazhir ({wkfPorsiNazhirPersen}%):</span>
                        <span className="font-semibold text-muted-foreground">{formatRupiah(hakNazhir)}</span>
                      </div>
                      <div className="w-full h-px bg-border/80 my-1" />
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-bold text-foreground">Dana Manfaat Mauquf 'Alaih / Thn:</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                          {formatRupiah(manfaatUmat)}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* SALAM SIMULATOR */}
            {akadId === "salam" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Hitung modal pembayaran tunai di muka (Ra'sul Mal) dan efisiensi pengadaan komoditas akad Salam.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Volume Komoditas Pesanan</span>
                      <span className="text-primary font-bold">{slmVolumeKg.toLocaleString("id-ID")} Kg</span>
                    </label>
                    <input
                      type="range"
                      min={500}
                      max={25000}
                      step={500}
                      value={slmVolumeKg}
                      onChange={(e) => setSlmVolumeKg(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Harga Kontrak Salam / Kg (Tunai Awal)</span>
                      <span className="text-primary font-bold">{formatRupiah(slmHargaSalamKg)}</span>
                    </label>
                    <input
                      type="range"
                      min={5000}
                      max={50000}
                      step={500}
                      value={slmHargaSalamKg}
                      onChange={(e) => setSlmHargaSalamKg(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Estimasi Harga Spot Saat Panen / Kg</span>
                      <span className="text-emerald-600 font-bold">{formatRupiah(slmHargaPasarKg)}</span>
                    </label>
                    <input
                      type="range"
                      min={5000}
                      max={60000}
                      step={500}
                      value={slmHargaPasarKg}
                      onChange={(e) => setSlmHargaPasarKg(Number(e.target.value))}
                      className="w-full accent-emerald-600 mt-1"
                    />
                  </div>
                </div>

                {(() => {
                  const modalTunaiAwal = slmVolumeKg * slmHargaSalamKg;
                  const nilaiSpotPanen = slmVolumeKg * slmHargaPasarKg;
                  const selisihEfisiensi = nilaiSpotPanen - modalTunaiAwal;

                  return (
                    <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Modal Tunai Dibayar di Awal (100%):</span>
                        <span className="font-bold text-foreground">{formatRupiah(modalTunaiAwal)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Estimasi Nilai Pasar Saat Serah Terima:</span>
                        <span className="font-semibold text-foreground">{formatRupiah(nilaiSpotPanen)}</span>
                      </div>
                      <div className="w-full h-px bg-border/80 my-1" />
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-bold text-foreground">Selisih Pengamanan Harga Pembeli:</span>
                        <span className={`font-extrabold ${selisihEfisiensi >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                          {formatRupiah(selisihEfisiensi)}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ISTISHNA SIMULATOR */}
            {akadId === "istishna" && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Simulasikan jadwal termin pembayaran proyek manufaktur atau konstruksi berbasis milestone Istishna'.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Total Nilai Kontrak Proyek</span>
                      <span className="text-primary font-bold">{formatRupiah(istNilaiProyek)}</span>
                    </label>
                    <input
                      type="range"
                      min={50000000}
                      max={2000000000}
                      step={25000000}
                      value={istNilaiProyek}
                      onChange={(e) => setIstNilaiProyek(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Uang Muka Pemesanan</span>
                      <span className="text-primary font-bold">{istDpPersen}%</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      step={5}
                      value={istDpPersen}
                      onChange={(e) => setIstDpPersen(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground flex justify-between">
                      <span>Jumlah Termin Progres Milestone</span>
                      <span className="text-primary font-bold">{istJumlahTermin} Termin</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={12}
                      step={1}
                      value={istJumlahTermin}
                      onChange={(e) => setIstJumlahTermin(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>
                </div>

                {(() => {
                  const uangMuka = (istNilaiProyek * istDpPersen) / 100;
                  const sisaKontrak = istNilaiProyek - uangMuka;
                  const nilaiPerTermin = sisaKontrak / istJumlahTermin;

                  return (
                    <div className="mt-5 p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Pembayaran Awal ({istDpPersen}%):</span>
                        <span className="font-bold text-foreground">{formatRupiah(uangMuka)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Sisa Kontrak Dibagi {istJumlahTermin} Termin:</span>
                        <span className="font-semibold text-foreground">{formatRupiah(sisaKontrak)}</span>
                      </div>
                      <div className="w-full h-px bg-border/80 my-1" />
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-bold text-foreground">Nilai per Milestone BAST:</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                          {formatRupiah(nilaiPerTermin)}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
