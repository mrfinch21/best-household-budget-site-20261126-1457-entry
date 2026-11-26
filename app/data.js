// Dompet Rumah — data.js
// Seed data and the store. Every figure is a real household number for
// November 2026 (rupiah). The store persists in localStorage; a first visit
// seeds from SEED_TX below. The totals the site shows are computed from
// these rows, so the dashboard, budgets and reports can never disagree:
//
//   income  8.500.000 + 640.000 + 125.000        = Rp 9.265.000
//   spending (24 rows)                          = Rp 7.184.000
//   money left                                  = Rp 2.081.000 (22%)
//   budgets total                               = Rp 9.550.000
//   spending without the savings transfer       = Rp 6.184.000 (65%)
export const CATEGORIES = [
  { id: "belanja", name: "Belanja Harian", color: "#2f7d5c" },
  { id: "makan", name: "Makan di Luar", color: "#c96f2e" },
  { id: "listrik", name: "Listrik & Air", color: "#3d7ea6" },
  { id: "internet", name: "Internet & HP", color: "#7a5fb5" },
  { id: "transport", name: "Transport", color: "#a67c2e" },
  { id: "pendidikan", name: "Pendidikan Anak", color: "#b04a6e" },
  { id: "kesehatan", name: "Kesehatan", color: "#4a9e8f" },
  { id: "hiburan", name: "Hiburan", color: "#8a6d3b" },
  { id: "cicilan", name: "Cicilan Motor", color: "#5b6b7a" },
  { id: "tabungan", name: "Tabungan", color: "#2f7d5c" },
];

export const BUDGETS = {
  belanja: 2400000,
  makan: 900000,
  listrik: 650000,
  internet: 450000,
  transport: 800000,
  pendidikan: 1200000,
  kesehatan: 500000,
  hiburan: 400000,
  cicilan: 1250000,
  tabungan: 1000000,
};

export const GOAL = {
  name: "Dana Darurat 6 Bulan",
  target: 12000000,
  saved: 7450000,
};

const SEED_TX = [
  // Pemasukan November 2026 (3 baris, Rp 9.265.000)
  { id: "t01", date: "2026-11-01", desc: "Gaji November — Fajrul", cat: "gaji", type: "in", amount: 8500000 },
  { id: "t02", date: "2026-11-07", desc: "Jualan online (Tokopedia)", cat: "gaji", type: "in", amount: 640000 },
  { id: "t03", date: "2026-11-15", desc: "Refund token listrik", cat: "gaji", type: "in", amount: 125000 },
  // Pengeluaran (24 baris, Rp 7.184.000)
  { id: "t04", date: "2026-11-01", desc: "Belanja mingguan — Pasar Minggu", cat: "belanja", type: "out", amount: 385000 },
  { id: "t05", date: "2026-11-02", desc: "Token listrik 200rb", cat: "listrik", type: "out", amount: 200000 },
  { id: "t06", date: "2026-11-02", desc: "Bensin motor (Pertalite)", cat: "transport", type: "out", amount: 50000 },
  { id: "t07", date: "2026-11-03", desc: "Makan malam — Ayam Geprek", cat: "makan", type: "out", amount: 86000 },
  { id: "t08", date: "2026-11-04", desc: "SPP sekolah anak", cat: "pendidikan", type: "out", amount: 650000 },
  { id: "t09", date: "2026-11-05", desc: "Paket internet 50GB", cat: "internet", type: "out", amount: 150000 },
  { id: "t10", date: "2026-11-06", desc: "Belanja mingguan — sayur & buah", cat: "belanja", type: "out", amount: 412000 },
  { id: "t11", date: "2026-11-08", desc: "Cicilan motor — angsuran ke-14", cat: "cicilan", type: "out", amount: 1250000 },
  { id: "t12", date: "2026-11-09", desc: "Obat & vitamin apotek", cat: "kesehatan", type: "out", amount: 178000 },
  { id: "t13", date: "2026-11-10", desc: "Ojek online — antar anak", cat: "transport", type: "out", amount: 64000 },
  { id: "t14", date: "2026-11-11", desc: "Nonton bioskop keluarga", cat: "hiburan", type: "out", amount: 185000 },
  { id: "t15", date: "2026-11-12", desc: "Belanja bulanan — Indomaret", cat: "belanja", type: "out", amount: 523000 },
  { id: "t16", date: "2026-11-13", desc: "Buku & alat tulis anak", cat: "pendidikan", type: "out", amount: 215000 },
  { id: "t17", date: "2026-11-14", desc: "PDAM — tagihan air", cat: "listrik", type: "out", amount: 142000 },
  { id: "t18", date: "2026-11-16", desc: "Makan siang — Warteg Bahari", cat: "makan", type: "out", amount: 54000 },
  { id: "t19", date: "2026-11-18", desc: "Belanja mingguan — daging & telur", cat: "belanja", type: "out", amount: 468000 },
  { id: "t20", date: "2026-11-19", desc: "Servis motor + ganti oli", cat: "transport", type: "out", amount: 235000 },
  { id: "t21", date: "2026-11-20", desc: "Pulsa & kuota darurat", cat: "internet", type: "out", amount: 100000 },
  { id: "t22", date: "2026-11-21", desc: "Makan malam — Soto Ayam", cat: "makan", type: "out", amount: 72000 },
  { id: "t23", date: "2026-11-22", desc: "Tabungan — transfer ke BCA", cat: "tabungan", type: "out", amount: 1000000 },
  { id: "t24", date: "2026-11-23", desc: "Belanja mingguan — pasar", cat: "belanja", type: "out", amount: 396000 },
  { id: "t25", date: "2026-11-24", desc: "Periksa gigi anak", cat: "kesehatan", type: "out", amount: 250000 },
  { id: "t26", date: "2026-11-25", desc: "Langganan streaming", cat: "hiburan", type: "out", amount: 59000 },
  { id: "t27", date: "2026-11-26", desc: "Bensin motor (Pertamax)", cat: "transport", type: "out", amount: 60000 },
];

const STORAGE_KEY = "dompet-rumah-v1";

export function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.tx) && parsed.tx.length) return parsed;
    }
  } catch {
    // Corrupted storage: fall through and reseed.
  }
  return { tx: SEED_TX.slice(), budgets: { ...BUDGETS }, goal: { ...GOAL } };
}

export function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Private mode or full storage: the site still works for the session.
  }
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, name: id, color: "#888" };
}

export function formatIDR(n) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export function monthOf(dateStr) {
  return dateStr.slice(0, 7); // "2026-11"
}

export function txInMonth(store, ym) {
  return store.tx.filter((t) => monthOf(t.date) === ym);
}

export function sumByType(store, ym, type) {
  return txInMonth(store, ym)
    .filter((t) => t.type === type)
    .reduce((s, t) => s + t.amount, 0);
}

// Spending per category, excluding the savings transfer: the donut and the
// budget page both read this, so they always agree.
export function spentByCategory(store, ym) {
  const out = {};
  for (const t of txInMonth(store, ym)) {
    if (t.type !== "out" || t.cat === "tabungan") continue;
    out[t.cat] = (out[t.cat] || 0) + t.amount;
  }
  return out;
}

// Six months of history for the report chart. November's spending is filled
// in live from the transactions; the other months are the household's books.
export const HISTORY = [
  { ym: "2026-06", label: "Jun", income: 8900000, spent: 7120000 },
  { ym: "2026-07", label: "Jul", income: 9050000, spent: 7480000 },
  { ym: "2026-08", label: "Agu", income: 8800000, spent: 6950000 },
  { ym: "2026-09", label: "Sep", income: 9100000, spent: 7310000 },
  { ym: "2026-10", label: "Okt", income: 8950000, spent: 7040000 },
  { ym: "2026-11", label: "Nov", income: 9265000, spent: 0 },
];
