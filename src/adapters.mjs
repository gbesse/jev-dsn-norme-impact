import { document } from "./io.mjs";
export function parseRubrics(value) {
  if (typeof value !== "string" || value.length > 2e6)
    throw new TypeError("Texte de norme trop grand");
  const map = new Map();
  const re = /^(S\d{2}\.G\d{2}\.\d{2}\.\d{3})[ \t]*(.*)$/gm;
  const matches = [...value.matchAll(re)];
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    if (map.has(m[1])) throw new TypeError("Rubrique dupliquée : " + m[1]);
    const end = matches[i + 1]?.index ?? value.length;
    map.set(m[1], value.slice(m.index + m[1].length, end).trim());
  }
  return map;
}
export function importNormeDiff(
  before,
  after,
  rules,
  {
    beforeVersion = "CT2026.1.2",
    afterVersion = "CT2027.1.2",
    at = new Date().toISOString().slice(0, 10),
  } = {},
) {
  const a = parseRubrics(before),
    b = parseRubrics(after);
  const keys = new Set([...a.keys(), ...b.keys()]);
  const changes = [],
    documents = [];
  for (const rubric of keys)
    if (a.get(rubric) !== b.get(rubric)) {
      const n = changes.length;
      const ba = a.get(rubric),
        bb = b.get(rubric);
      changes.push({
        id: "C" + n,
        rubric,
        before: ba ?? "",
        after: bb ?? "",
        beforeDocId: "avant" + n,
        afterDocId: "apres" + n,
      });
      documents.push(
        document("avant" + n, rubric + "\n" + (ba ?? "[rubrique absente]"), {
          uri: "fichier:" + beforeVersion,
          date: at,
          kind: "importe",
          licence: "À renseigner",
        }),
        document("apres" + n, rubric + "\n" + (bb ?? "[rubrique absente]"), {
          uri: "fichier:" + afterVersion,
          date: at,
          kind: "importe",
          licence: "À renseigner",
        }),
      );
    }
  if (!changes.length)
    throw new TypeError("Aucune modification de rubrique détectée");
  const normalized = rules.map((r, i) => ({ ...r, docId: "regle" + i }));
  documents.push(
    ...normalized.map((r) =>
      document(r.docId, JSON.stringify(r), {
        uri: "fichier:inventaire-regles",
        date: at,
        kind: "importe",
        licence: "Privé",
      }),
    ),
  );
  return {
    id: "impact-dsn",
    beforeVersion,
    afterVersion,
    changes,
    rules: normalized,
    documents,
  };
}
