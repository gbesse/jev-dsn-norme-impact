import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { analyze } from "../src/index.mjs";
const base = JSON.parse(
  await readFile(new URL("../examples/dossier.json", import.meta.url), "utf8"),
);
const clone = structuredClone;

import { parseRubrics, importNormeDiff } from "../src/adapters.mjs";
test("Ajout et suppression de rubriques détectés", () => {
  const x = importNormeDiff(
    "S21.G00.30.001\nAncien",
    "S21.G00.30.002\nNouveau",
    base.rules,
  );
  assert.equal(x.changes.length, 2);
  assert.equal(x.changes[0].after, "");
});
test("Rubrique répétée demande une normalisation", () => {
  assert.throws(
    () => parseRubrics("S21.G00.30.001 A\nS21.G00.30.001 B"),
    /dupliquée/,
  );
});
test("Rubrique absente de l’inventaire reste inconnue", async () => {
  const x = clone(base);
  x.rules[0].rubrics = [];
  const r = await analyze(x);
  assert.equal(r.status, "a_revoir");
  assert.deepEqual(r.outputs.affectedRules, []);
});
