// Dompet Rumah — main.js
// Hash router: #/ dashboard, #/transaksi, #/anggaran, #/laporan.
// The store lives in localStorage and is seeded with realistic November data
// on first visit. window.__shotReady signals the screenshot driver that the
// page has finished rendering.
import { loadStore, saveStore } from "./data.js";
import { renderDashboard, renderTransactions, renderBudgets, renderReports } from "./views.js";

const store = loadStore();
const root = document.getElementById("view");
const nav = document.getElementById("main-nav");

const ROUTES = {
  "/": renderDashboard,
  "/transaksi": renderTransactions,
  "/anggaran": renderBudgets,
  "/laporan": renderReports,
};

function persist() {
  saveStore(store);
}

function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const render = ROUTES[hash] || ROUTES["/"];
  nav.querySelectorAll("a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + hash);
  });
  render(store, root, persist);
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();
window.__shotReady = true;
