// Utilidades de composicion: partir textos en hilos y subir media a un host publico
// (las APIs de IG/TikTok exigen URLs o archivos; Catbox da URL publica sin cuenta).
import fs from "node:fs";
import path from "node:path";

const MAX_SUFFIX_ITERS = 5;

// Parte text en trozos de max `limit` caracteres. Corta por frases; si una frase sola
// supera el limite, la corta por palabras. Anade sufijo " i/N" solo si hay >1 parte.
// Nunca devuelve una parte de mas de `limit` caracteres.
export function splitThread(text: string, limit: number): string[] {
  if (!text) throw new Error("splitThread necesita texto.");
  if (!Number.isInteger(limit) || limit <= 0) throw new Error("splitThread necesita limit entero positivo.");
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return [clean];
  const sentences = clean.match(/[^.!?…]+[.!?…]+["'»”)\]]*|[^.!?…]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [clean];
  const units: string[] = [];
  for (const s of sentences) {
    if (s.length <= limit) units.push(s);
    else units.push(...hardSplit(s, limit));
  }
  // Reserva para el sufijo " N/N": itera hasta que el conteo sea estable.
  let parts = pack(units, limit);
  for (let k = 0; k < MAX_SUFFIX_ITERS; k++) {
    const n = parts.length;
    if (n <= 1) return parts;
    const reserve = ` ${n}/${n}`.length;
    if (reserve >= limit) throw new Error(`splitThread: limit=${limit} demasiado pequeno para numerar ${n} partes.`);
    const repacked = pack(units, limit - reserve);
    if (repacked.length === n) {
      return repacked.map((p, i) => `${p} ${i + 1}/${n}`.slice(0, limit));
    }
    parts = repacked;
  }
  const n = parts.length;
  const reserve = ` ${n}/${n}`.length;
  return pack(units, limit - reserve).map((p, i) => `${p} ${i + 1}/${n}`.slice(0, limit));
}

function pack(units: string[], max: number): string[] {
  const parts: string[] = [];
  let cur = "";
  for (const u of units) {
    const cand = cur ? `${cur} ${u}` : u;
    if (cand.length <= max) {
      cur = cand;
    } else {
      if (cur) parts.push(cur);
      cur = u;
    }
  }
  if (cur) parts.push(cur);
  return parts;
}

// Corta una unidad larga por palabras (sin romper palabras salvo que una sola exceda max).
function hardSplit(s: string, max: number): string[] {
  const words = s.split(" ").filter(Boolean);
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    if (w.length > max) {
      if (cur) {
        out.push(cur);
        cur = "";
      }
      for (let i = 0; i < w.length; i += max) out.push(w.slice(i, i + max));
    } else {
      const cand = cur ? `${cur} ${w}` : w;
      if (cand.length <= max) cur = cand;
      else {
        out.push(cur);
        cur = w;
      }
    }
  }
  if (cur) out.push(cur);
  return out;
}

const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".mp4"];
const MAX_BYTES = 200 * 1024 * 1024; // limite documentado de Catbox

// Sube un archivo local a Catbox (https://catbox.moe/user/api.php, multipart
// reqtype=fileupload) y devuelve la URL publica. Valida existencia, extension y tamano.
export async function uploadMedia(localPath: string): Promise<string> {
  if (!localPath) throw new Error("uploadMedia necesita un path local.");
  if (!fs.existsSync(localPath)) throw new Error(`Archivo no encontrado: ${localPath}. Usa un path local valido.`);
  const ext = path.extname(localPath).toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) {
    throw new Error(`Extension no soportada "${ext}". Usa: ${ALLOWED_EXT.join(", ")}.`);
  }
  const size = fs.statSync(localPath).size;
  if (size === 0) throw new Error("El archivo esta vacio.");
  if (size > MAX_BYTES) throw new Error(`Archivo de ${(size / 1048576).toFixed(1)}MB supera el limite de 200MB de Catbox.`);
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("fileToUpload", new Blob([fs.readFileSync(localPath)]), path.basename(localPath));
  const res = await fetch("https://catbox.moe/user/api.php", { method: "POST", body: form });
  if (!res.ok) throw new Error(`Catbox HTTP ${res.status}. Reintenta en unos minutos.`);
  const url = (await res.text()).trim();
  if (!/^https?:\/\//i.test(url)) throw new Error(`Catbox rechazo la subida: ${url.slice(0, 150)}`);
  return url;
}
