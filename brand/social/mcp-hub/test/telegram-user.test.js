import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatDialogTitle, tuHistory, tuSend, tuDialogs } from "../dist/providers/telegram-user.js";

describe("telegram-user validacion (sin red)", () => {
  it("tuSend sin target rechaza", async () => {
    await assert.rejects(() => tuSend("", "hola"), /requiere target/);
  });
  it("tuSend texto vacio rechaza", async () => {
    await assert.rejects(() => tuSend("@x", ""), /Texto vacio/);
  });
  it("tuSend >4096 rechaza", async () => {
    await assert.rejects(() => tuSend("@x", "y".repeat(4097)), /4096/);
  });
  it("tuHistory sin target rechaza", async () => {
    await assert.rejects(() => tuHistory(""), /requiere target/);
  });
  it("sin creds pide my.telegram.org (sin red)", async () => {
    const keepId = process.env.TG_API_ID;
    const keepHash = process.env.TG_API_HASH;
    delete process.env.TG_API_ID;
    delete process.env.TG_API_HASH;
    try {
      await assert.rejects(() => tuDialogs(), /my\.telegram\.org/);
    } finally {
      if (keepId !== undefined) process.env.TG_API_ID = keepId;
      if (keepHash !== undefined) process.env.TG_API_HASH = keepHash;
    }
  });
  it("formatDialogTitle formatea", () => {
    assert.equal(
      formatDialogTitle({ title: "Devs", id: "123", entity: { className: "Channel" } }),
      "[Channel] Devs id=123"
    );
  });
});
