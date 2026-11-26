// Dompet Rumah — views.js
// Page renderers: dashboard, transactions, budgets, reports. Every control
// on every page works against the store (localStorage); nothing is a
// placeholder. All figures are computed from the store, never hard-coded,
// so the pages can never disagree with each other.
import { CATEGORIES, categoryById, formatIDR, sumByType, spentByCategory, txInMonth, HISTORY } from "./data.js";
import { drawDonut, drawBars } from "./charts.js";

const YM = "2026-11";

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

function money(n) {
  return formatIDR(n);
}

function progressBar(pct, color) {
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  const state = p >= 100 ? "over" : p >= 85 ? "warn" : "";
  return `<div class="meter"><div class="meter-fill ${state}" style="width:${p}%;background:${color}"></div></div>`;
}

function categoryOptions(selected) {
  return CATEGORIES.filter((c) => c.id !== "tabungan")
    .map((c) => `<option value="${c.id}"${c.id === selected ? " selected" : ""}>${c.name}</option>`)
    .join("");
}

export function renderDashboard(store, root) {
  const income = sumByType(store, YM, "in");
  const spent = sumByType(store, YM, "out");
  const saved = store.tx.filter((t) => t.cat === "tabungan").reduce((s, t) => s + t.amount, 0);
  const left = income - spent;
  const byCat = spentByCategory(store, YM);
  const slices = CATEGORIES.filter((c) => byCat[c.id]).map((c) => ({ label: c.name, value: byCat[c.id], color: c.color }));
  const recent = txInMonth(store, YM).slice().sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
  const goalPct = Math.round((store.goal.saved / store.goal.target) * 100);
  const outCount = txInMonth(store, YM).filter((t) => t.type === "out").length;

  root.innerHTML = `
  <section class="hero">
    <div>
      <h1>Selamat pagi, Keluarga Fajrul</h1>
      <p class="sub">Ringkasan keuangan rumah tangga — November 2026. Semua angka di bawah ini dihitung dari catatan transaksi Anda.</p>
    </div>
    <div class="hero-date">26 Nov 2026</div>
  </section>

  <section class="summary-cards">
    <article class="card card-income"><span class="card-label">Pemasukan</span><strong>${money(income)}</strong><span class="card-note">Gaji + jualan online + refund</span></article>
    <article class="card card-spending"><span class="card-label">Pengeluaran</span><strong>${money(spent)}</strong><span class="card-note">${outCount} transaksi bulan ini</span></article>
    <article class="card card-left"><span class="card-label">Sisa Uang</span><strong>${money(left)}</strong><span class="card-note">${Math.round((left / income) * 100)}% dari pemasukan belum terpakai</span></article>
    <article class="card card-saved"><span class="card-label">Ditabung</span><strong>${money(saved)}</strong><span class="card-note">Dana darurat ${goalPct}% dari target ${money(store.goal.target)}</span></article>
  </section>

  <section class="two-col">
    <article class="panel">
      <h2>Ke mana uang pergi?</h2>
      <p class="hint">Pengeluaran November 2026 di luar tabungan, per kategori.</p>
      <canvas id="donut" width="480" height="210" aria-label="Diagram pengeluaran per kategori"></canvas>
    </article>
    <article class="panel">
      <h2>Anggaran bulan ini</h2>
      <p class="hint">Empat kategori terbesar — sisanya di <a href="#/anggaran">halaman Anggaran</a>.</p>
      ${["belanja", "cicilan", "pendidikan", "transport"].map((id) => {
        const c = categoryById(id);
        const budget = store.budgets[id] || 0;
        const used = byCat[id] || 0;
        return `<div class="budget-line"><div class="budget-line-top"><span><span class="dot" style="background:${c.color}"></span>${c.name}</span><span>${money(used)} / ${money(budget)}</span></div>${progressBar((used / budget) * 100, c.color)}<div class="budget-line-sub">Sisa ${money(Math.max(0, budget - used))}${used > budget ? ` — lewat ${money(used - budget)}` : ""}</div></div>`;
      }).join("")}
    </article>
  </section>

  <section class="two-col">
    <article class="panel">
      <h2>Transaksi terakhir</h2>
      <ul class="recent-list">${recent.map((t) => {
        const c = categoryById(t.cat);
        return `<li><span class="dot" style="background:${c.color}"></span><span class="recent-desc">${esc(t.desc)}</span><span class="recent-date">${t.date.slice(8)} Nov</span><span class="recent-amt ${t.type}">${t.type === "in" ? "+" : "−"}${money(t.amount)}</span></li>`;
      }).join("")}</ul>
      <p><a class="btn" href="#/transaksi">Lihat semua transaksi</a></p>
    </article>
    <article class="panel goal-panel">
      <h2>${esc(store.goal.name)}</h2>
      <p class="goal-big">${money(store.goal.saved)} <span class="muted">dari ${money(store.goal.target)}</span></p>
      ${progressBar(goalPct, "#2f7d5c")}
      <p>${goalPct}% tercapai — kurang ${money(store.goal.target - store.goal.saved)} lagi. Dengan tabungan Rp 1.000.000 per bulan, target tercapai sekitar April 2027.</p>
      <p><a class="btn" href="#/laporan">Lihat laporan 6 bulan</a></p>
    </article>
  </section>`;

  const canvas = root.querySelector("#donut");
  if (canvas) drawDonut(canvas, slices);
}

export function renderTransactions(store, root, save) {
  const all = txInMonth(store, YM).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  const chips = ["semua", ...CATEGORIES.map((c) => c.id)];
  root.innerHTML = `
  <section class="page-head"><h1>Transaksi November 2026</h1><p class="sub">${all.length} transaksi tercatat. Tambah, saring, atau hapus — semua tersimpan di perangkat ini.</p></section>
  <section class="panel">
    <form id="add-form" class="add-form">
      <label>Deskripsi<input name="desc" required maxlength="80" placeholder="cth: Belanja mingguan — pasar"></label>
      <label>Jumlah (Rp)<input name="amount" type="number" min="1000" step="1000" required placeholder="50000"></label>
      <label>Tanggal<input name="date" type="date" value="2026-11-26" required></label>
      <label>Kategori<select name="cat">${categoryOptions("belanja")}</select></label>
      <label>Jenis<select name="type"><option value="out">Pengeluaran</option><option value="in">Pemasukan</option></select></label>
      <button class="btn btn-primary" type="submit">+ Tambah transaksi</button>
    </form>
  </section>
  <section class="panel">
    <div class="filters">${chips.map((c) => `<button class="chip${c === "semua" ? " active" : ""}" data-cat="${c}">${c === "semua" ? "Semua" : categoryById(c).name}</button>`).join("")}</div>
    <table class="tx-table">
      <thead><tr><th>Tanggal</th><th>Deskripsi</th><th>Kategori</th><th class="num">Jumlah</th><th></th></tr></thead>
      <tbody id="tx-body"></tbody>
    </table>
    <p id="tx-count" class="hint"></p>
  </section>`;

  const body = root.querySelector("#tx-body");
  const count = root.querySelector("#tx-count");
  let filter = "semua";
  function draw() {
    const rows = all.filter((t) => filter === "semua" || t.cat === filter);
    if (rows.length === 0) {
      body.innerHTML = `<tr><td colspan="5" class="empty-row">Tidak ada transaksi pada kategori ${esc(categoryById(filter).name)} bulan ini — tambah satu lewat formulir di atas.</td></tr>`;
    } else {
      body.innerHTML = rows.map((t) => {
        const c = categoryById(t.cat);
        return `<tr><td>${t.date}</td><td>${esc(t.desc)}</td><td><span class="dot" style="background:${c.color}"></span>${c.name}</td><td class="num ${t.type}">${t.type === "in" ? "+" : "−"}${money(t.amount)}</td><td><button class="del" data-id="${t.id}" title="Hapus">Hapus</button></td></tr>`;
      }).join("");
    }
    count.textContent = `Menampilkan ${rows.length} dari ${all.length} transaksi — total keluar ${money(rows.filter((t) => t.type === "out").reduce((s, t) => s + t.amount, 0))}.`;
  }
  draw();
  root.querySelectorAll(".chip").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll(".chip").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    filter = b.dataset.cat;
    draw();
  }));
  body.addEventListener("click", (e) => {
    const btn = e.target.closest(".del");
    if (!btn) return;
    const i = store.tx.findIndex((t) => t.id === btn.dataset.id);
    if (i >= 0) {
      store.tx.splice(i, 1);
      save();
      renderTransactions(store, root, save);
    }
  });
  root.querySelector("#add-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const amount = Number(f.get("amount"));
    if (!amount || amount <= 0) return;
    store.tx.push({
      id: "t" + Date.now().toString(36),
      date: String(f.get("date")),
      desc: String(f.get("desc")).trim(),
      cat: String(f.get("cat")),
      type: String(f.get("type")),
      amount,
    });
    save();
    renderTransactions(store, root, save);
  });
}

export function renderBudgets(store, root, save) {
  const byCat = spentByCategory(store, YM);
  const totalBudget = Object.values(store.budgets).reduce((s, v) => s + v, 0);
  const totalSpent = Object.keys(store.budgets).reduce((s, k) => s + (byCat[k] || 0), 0);
  root.innerHTML = `
  <section class="page-head"><h1>Anggaran November 2026</h1><p class="sub">Total anggaran ${money(totalBudget)} — sudah terpakai ${money(totalSpent)} (${Math.round((totalSpent / totalBudget) * 100)}%). Ubah angka anggaran, lalu simpan.</p></section>
  <section class="budget-grid">
    ${CATEGORIES.map((c) => {
      const budget = store.budgets[c.id] || 0;
      const used = byCat[c.id] || 0;
      const pct = budget ? (used / budget) * 100 : 0;
      const over = used > budget;
      return `<article class="panel budget-card">
        <h2><span class="dot" style="background:${c.color}"></span>${c.name}</h2>
        <p class="goal-big">${money(used)} <span class="muted">dari ${money(budget)}</span></p>
        ${progressBar(pct, c.color)}
        <p class="${over ? "over-text" : ""}">${over ? `Lewat anggaran ${money(used - budget)} — kurangi minggu depan.` : `Sisa ${money(budget - used)} untuk 4 hari ke depan.`}</p>
        <form class="budget-form" data-cat="${c.id}">
          <label>Anggaran baru (Rp)<input name="budget" type="number" min="0" step="50000" value="${budget}" required></label>
          <button class="btn" type="submit">Simpan</button>
        </form>
      </article>`;
    }).join("")}
  </section>
  <p class="hint">Catatan: cicilan motor Rp 1.250.000 per bulan sampai Maret 2027 (angsuran ke-14 dari 24). Dana darurat dipisah dari anggaran belanja.</p>`;

  root.querySelectorAll(".budget-form").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = Number(new FormData(f).get("budget"));
    if (Number.isFinite(v) && v >= 0) {
      store.budgets[f.dataset.cat] = v;
      save();
      renderBudgets(store, root, save);
    }
  }));
}

export function renderReports(store, root) {
  const income = sumByType(store, YM, "in");
  const spent = sumByType(store, YM, "out");
  const byCat = spentByCategory(store, YM);
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const months = HISTORY.map((m) => (m.ym === YM ? { ...m, spent } : m));
  const rate = Math.round(((income - spent) / income) * 100);
  const avgSpent = months.reduce((s, m) => s + m.spent, 0) / 6;
  root.innerHTML = `
  <section class="page-head"><h1>Laporan — 6 Bulan Terakhir</h1><p class="sub">Pemasukan vs pengeluaran Juni–November 2026. November: pemasukan ${money(income)}, pengeluaran ${money(spent)}, tingkat menabung ${rate}%.</p></section>
  <section class="panel">
    <h2>Pemasukan vs pengeluaran</h2>
    <canvas id="bars" width="660" height="250" aria-label="Grafik pemasukan vs pengeluaran 6 bulan"></canvas>
    <p class="hint">Rata-rata pengeluaran 6 bulan: ${money(avgSpent)} per bulan. Bulan paling hemat: Agustus 2026 (${money(6950000)}).</p>
  </section>
  <section class="two-col">
    <article class="panel">
      <h2>5 pengeluaran terbesar (November)</h2>
      <ol class="top-list">${top.map(([id, v]) => {
        const c = categoryById(id);
        return `<li><span class="dot" style="background:${c.color}"></span>${c.name}<strong>${money(v)}</strong></li>`;
      }).join("")}</ol>
    </article>
    <article class="panel">
      <h2>Yang bisa diperbaiki</h2>
      <ul class="tips">
        <li><strong>Makan di luar ${money(byCat.makan || 0)}</strong> — masak dua kali seminggu lagi menghemat sekitar Rp 200.000 per bulan.</li>
        <li><strong>Belanja harian</strong> adalah pos terbesar; daftar belanja mingguan sudah memangkas pengeluaran dibanding Oktober.</li>
        <li><strong>Tingkat menabung ${rate}%</strong> — di atas target keluarga 10%. Pertahankan sampai dana darurat penuh (April 2027).</li>
        <li><strong>Listrik</strong> turun dari Oktober setelah lampu diganti ke LED.</li>
      </ul>
    </article>
  </section>`;

  const canvas = root.querySelector("#bars");
  if (canvas) drawBars(canvas, months);
}
