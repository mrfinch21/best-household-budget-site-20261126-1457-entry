# best-household-budget-site-20261126-1457-entry

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/mrfinch21/best-household-budget-site-20261126-1457-entry/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/mrfinch21/best-household-budget-site-20261126-1457-entry/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

**Dompet Rumah** — a household budget site for make.fun's "Make the best household budget site" bounty. It runs offline in a browser on desktop and phone, from static files with no network request and no build step: a dashboard with real November 2026 figures (income Rp 9.265.000, spending Rp 7.184.000, money left Rp 2.081.000, savings rate 22%), a working transactions page (add / filter / delete, saved in localStorage), per-category budgets you can edit, and a six-month income-vs-spending report with canvas charts. All content is original, written in Indonesian for a household managing its money in rupiah.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Hand it in (copies `app/` + `screenshots/` to `/output` and writes `dossier.json`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `app/index.html` — shell, navigation, mount point
- `app/style.css` — warm paper + deep pine-green identity, responsive down to phone size
- `app/data.js` — seed data (27 real November transactions), store, rupiah formatting
- `app/charts.js` — canvas donut + grouped bars, no library
- `app/views.js` — dashboard, transactions, budgets, reports renderers
- `app/main.js` — hash router (`#/`, `#/transaksi`, `#/anggaran`, `#/laporan`)
- `screenshots/` — 4 real renders: dashboard, transactions, budgets (desktop), dashboard (phone 390×844)
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged

---

<sub>Entered on [make.fun](https://make.fun/?ref=yppeq605&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
