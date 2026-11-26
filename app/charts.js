// Dompet Rumah — charts.js
// Canvas charts with no library: a donut of spending by category and grouped
// bars of income against spending per month. Both are HiDPI-aware, scaling
// the backing store by devicePixelRatio so they stay sharp on phones.
function prepare(canvas, cssWidth, cssHeight) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.width = cssWidth + "px";
  canvas.style.height = cssHeight + "px";
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return ctx;
}

export function drawDonut(canvas, slices) {
  // slices: [{ label, value, color }]. The canvas is wide on purpose: the
  // donut sits on the left and the full legend on the right, so no label
  // can run off the edge.
  const W = 480, H = 210;
  const ctx = prepare(canvas, W, H);
  const cx = 90, cy = 105, outer = 82, inner = 50;
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (!total) {
    ctx.fillStyle = "#8a8578";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText("Belum ada pengeluaran", 24, 105);
    return;
  }
  let angle = -Math.PI / 2;
  for (const s of slices) {
    const sweep = (s.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outer, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = s.color;
    ctx.fill();
    angle += sweep;
  }
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = "#fffaf0";
  ctx.fill();
  ctx.fillStyle = "#1e5c43";
  ctx.font = "bold 15px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Total", cx, cy - 4);
  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.fillText("keluar", cx, cy + 14);
  // Legend, right of the donut.
  ctx.textAlign = "left";
  ctx.font = "12px system-ui, sans-serif";
  let y = 24;
  for (const s of slices) {
    ctx.fillStyle = s.color;
    ctx.fillRect(208, y - 9, 10, 10);
    ctx.fillStyle = "#2b2620";
    ctx.fillText(`${s.label} ${Math.round((s.value / total) * 100)}%`, 224, y);
    y += 20;
  }
}

export function drawBars(canvas, months) {
  // months: [{ label, income, spent }]. Green bar = income, red = spending.
  const W = 660, H = 250;
  const ctx = prepare(canvas, W, H);
  const maxValue = Math.max(...months.map((m) => Math.max(m.income, m.spent))) * 1.1;
  const baseY = 212, topY = 24, plotHeight = baseY - topY;
  const slot = W / months.length;
  const barWidth = 28, gap = 8;
  ctx.strokeStyle = "#ddd6c4";
  ctx.lineWidth = 1;
  ctx.font = "11px system-ui, sans-serif";
  for (let grid = 0; grid <= 4; grid += 1) {
    const y = topY + (plotHeight * grid) / 4;
    ctx.beginPath();
    ctx.moveTo(44, y);
    ctx.lineTo(W - 12, y);
    ctx.stroke();
    ctx.fillStyle = "#8a8578";
    ctx.textAlign = "right";
    ctx.fillText("Rp " + Math.round((maxValue * (4 - grid)) / 4 / 1000000) + " jt", 40, y + 4);
  }
  ctx.textAlign = "center";
  ctx.font = "12px system-ui, sans-serif";
  months.forEach((m, i) => {
    const x0 = 44 + slot * i + (slot - barWidth * 2 - gap) / 2;
    const incomeH = (m.income / maxValue) * plotHeight;
    const spentH = (m.spent / maxValue) * plotHeight;
    ctx.fillStyle = "#2f7d5c";
    ctx.fillRect(x0, baseY - incomeH, barWidth, incomeH);
    ctx.fillStyle = "#b4502e";
    ctx.fillRect(x0 + barWidth + gap, baseY - spentH, barWidth, spentH);
    ctx.fillStyle = "#2b2620";
    ctx.fillText(m.label, 44 + slot * i + slot / 2, baseY + 18);
  });
  // Legend, top left.
  ctx.textAlign = "left";
  ctx.fillStyle = "#2f7d5c";
  ctx.fillRect(44, 8, 10, 10);
  ctx.fillStyle = "#2b2620";
  ctx.fillText("Pemasukan", 58, 17);
  ctx.fillStyle = "#b4502e";
  ctx.fillRect(148, 8, 10, 10);
  ctx.fillStyle = "#2b2620";
  ctx.fillText("Pengeluaran", 162, 17);
}
