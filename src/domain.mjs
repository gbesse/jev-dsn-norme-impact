import { text, list, cents, date, ref, check, pair } from "./index.mjs";

export function prepare(x) {
  const changes = list(x.changes, "changes"),
    rules = list(x.rules, "rules");
  text(x.beforeVersion);
  text(x.afterVersion);
  if (x.beforeVersion === x.afterVersion)
    throw new TypeError("Versions distinctes requises");
  const checks = [],
    pairs = [],
    tests = [];
  for (const c of changes) {
    text(c.id);
    if (!/^S\d{2}\.G\d{2}\.\d{2}\.\d{3}$/.test(c.rubric))
      throw new TypeError("Rubrique DSN invalide");
    const affected = rules.filter(
      (r) => Array.isArray(r.rubrics) && r.rubrics.includes(c.rubric),
    );
    checks.push(
      check(
        c.id + "-couverture",
        "Rubrique inventoriée : " + c.rubric,
        affected.length ? true : null,
        ref(c.beforeDocId, c.afterDocId),
        "Ajouter la rubrique à l’inventaire avant de conclure à l’absence d’impact.",
      ),
    );
    for (const r of affected) {
      text(r.id);
      pairs.push(
        pair(
          c.id + "-" + r.id,
          "Couverture de la nouvelle exigence : " + r.id,
          c.after,
          r.description,
          ref(c.afterDocId, r.docId),
          "La règle décrite à droite couvre-t-elle la nouvelle exigence de gauche, y compris ses exceptions ?",
        ),
      );
      tests.push({
        rule: r.id,
        rubric: c.rubric,
        versions: [x.beforeVersion, x.afterVersion],
        before: c.before,
        after: c.after,
        testAction:
          "Ajouter au moins un cas positif, un cas négatif et le cas d’exception décrit dans la nouvelle exigence.",
      });
    }
  }
  return {
    checks,
    pairs,
    outputs: {
      affectedRules: [...new Set(tests.map((t) => t.rule))],
      testScenarios: tests,
      limite:
        "Les scénarios sont des pistes de tests, sans validation officielle de conformité NEODeS.",
    },
  };
}

function requiredDoc(o) {
  if (!o || typeof o !== "object") throw new TypeError("Objet métier requis");
  text(o.docId, "docId requis");
}
export function validateInput(x) {
  for (const c of list(x.changes, "changes")) {
    text(c.beforeDocId);
    text(c.afterDocId);
  }
  for (const r of list(x.rules, "rules")) requiredDoc(r);
}
