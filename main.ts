// Dompet Rumah — main.ts
// Hands the site in: copies app/ and screenshots/ from beside this file into
// the output directory and writes dossier.json there with the kit's dossier
// library. The library is the kit's own file (vendor/makefun-frontend.ts);
// leave it untouched — the grader rebuilds the dossier with its copy and
// compares the bytes.
//
// Run: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the site locally: node serve.ts, then open http://localhost:8080
import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// Pre-flight: the gate wants 3–4 screenshots, each a whole file of at most
// 256 KiB. Fail here with a plain message instead of a rejected entry.
const shots = readdirSync(join(out, "screenshots")).filter((f) => !f.startsWith("."));
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`expected 3-4 screenshots, found ${shots.length}`);
}
for (const f of shots) {
  const bytes = statSync(join(out, "screenshots", f)).size;
  if (bytes > 262144) throw new Error(`screenshot ${f} is ${bytes} bytes, over the 256 KiB cap`);
}
console.log(`handing in ${shots.length} screenshots: ${shots.join(", ")}`);

writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
const dossierBytes = statSync(join(out, "dossier.json")).size;
if (dossierBytes > 1572864) throw new Error(`dossier.json is ${dossierBytes} bytes, over the 1.5 MiB cap`);
console.log(`dossier written to ${join(out, "dossier.json")} (${dossierBytes} bytes, ${shots.length} screenshots)`);
