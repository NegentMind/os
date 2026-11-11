import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { splitThread, uploadMedia } from "../dist/compose.js";
import { adapt } from "../dist/scheduler.js";

describe("splitThread", () => {
  it("corto queda integro sin sufijo", () => {
    assert.deepEqual(splitThread("Hola mundo.", 280), ["Hola mundo."]);
  });
  it("largo se parte sin exceder limite", () => {
    const parts = splitThread("Primera frase larga de prueba. Segunda frase larga de prueba. Tercera frase final.", 40);
    assert.ok(parts.length > 1);
    for (const p of parts) assert.ok(p.length <= 40, p);
  });
  it("multiparte lleva numeracion", () => {
    const parts = splitThread("Una. Dos. Tres. Cuatro. Cinco. Seis.", 15);
    assert.ok(parts.length > 1);
    assert.match(parts[0], /1\/\d+/);
  });
});

describe("uploadMedia validacion (sin red)", () => {
  let txt;
  before(() => {
    txt = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "hubtest-")), "notas.txt");
    fs.writeFileSync(txt, "hola");
  });
  it("rechaza extension no permitida", async () => {
    await assert.rejects(() => uploadMedia(txt), /Extension no soportada/);
  });
  it("rechaza archivo inexistente", async () => {
    await assert.rejects(() => uploadMedia("C:/tmp/no-existe-xyz.png"), /Archivo no encontrado/);
  });
});

describe("adapt scheduler", () => {
  it("x largo genera hilo", () => {
    const a = adapt("x", "lorem ipsum. ".repeat(40));
    assert.ok(a.thread && a.thread.length > 1);
  });
  it("instagram sin imagen hace skip", () => {
    assert.equal(adapt("instagram", "hola").skip, "instagram exige imageUrl.");
  });
  it("devto sin title hace skip", () => {
    assert.ok(adapt("devto", "hola").skip);
  });
  it("red desconocida", () => {
    assert.equal(adapt("zzz", "hola").text, "hola");
  });
});
